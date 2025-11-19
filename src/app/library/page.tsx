"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";

type ApiBook = {
  id?: string;
  title?: string;
  author?: string;
  subTitle?: string;
  subtitle?: string;
  imageLink?: string;
  image?: string;
  rating?: number;
  totalRating?: number;
  keyIdeas?: number;
  type?: string;
  duration?: string;
  time?: string;
  subscriptionRequired?: boolean;
};

type Book = {
  id: string;
  title: string;
  author: string;
  subtitle: string;
  image: string;
  rating?: number;
  totalRatings?: number;
  keyIdeas?: number;
  type?: string;
  duration?: string;
  subscriptionRequired: boolean;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function mapApiBook(b: ApiBook): Book {
  return {
    id: String(b.id ?? ""),
    title: String(b.title ?? ""),
    author: String(b.author ?? ""),
    subtitle: String(b.subTitle ?? b.subtitle ?? ""),
    image: String(b.imageLink ?? b.image ?? ""),
    rating: typeof b.rating === "number" ? b.rating : undefined,
    totalRatings:
      typeof b.totalRating === "number" ? b.totalRating : undefined,
    keyIdeas: typeof b.keyIdeas === "number" ? b.keyIdeas : undefined,
    type: typeof b.type === "string" ? b.type : undefined,
    duration:
      typeof b.duration === "string"
        ? b.duration
        : typeof b.time === "string"
        ? b.time
        : undefined,
    subscriptionRequired: Boolean(b.subscriptionRequired),
  };
}

function formatDuration(raw?: string) {
  const v = raw?.trim();
  if (!v) return "";
  if (/^\d{1,2}:\d{2}$/.test(v)) return v;

  const mm = v.match(/(\d+)\s*m/i)?.[1];
  const ss = v.match(/(\d+)\s*s/i)?.[1];
  if (mm) {
    return `${String(mm).padStart(2, "0")}:${ss ? String(ss).padStart(2, "0") : "00"}`;
  }
  return v;
}

function LibraryBookCard({ book }: { book: Book }) {
  const duration = formatDuration(book.duration);

  return (
    <Link
      href={`/book/${book.id}`}
      className="for-you__recommended--books-link block"
    >
      <div className="relative w-[150px]">
        {book.subscriptionRequired && (
          <div className="absolute -top-3 left-0 text-[11px] px-3 py-1 rounded-full bg-[#032b41] text-white z-20">
            Premium
          </div>
        )}
        <figure className="relative w-[150px] h-[210px] mb-2">
          <div className="absolute inset-x-0 bottom-0 h-[120px] bg-[#f1f6f4] rounded-t-[999px]" />
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={book.image}
              alt={book.title}
              fill
              sizes="150px"
              className="object-contain relative z-10"
            />
          </div>
        </figure>
      </div>

      <div className="mt-1 text-[15px] font-semibold text-[#032b41] line-clamp-2">
        {book.title}
      </div>
      <div className="mt-1 text-[13px] text-[#6b757b]">{book.author}</div>
      {book.subtitle && (
        <div className="mt-1 text-[13px] text-[#394547] line-clamp-2">
          {book.subtitle}
        </div>
      )}

      <div className="mt-2 flex items-center gap-4 text-[12px] text-[#6b757b]">
        {duration && (
          <div className="flex items-center gap-1">
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="currentColor"
            >
              <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm1 10h4v-2h-3V7h-2v5z" />
            </svg>
            <span>{duration}</span>
          </div>
        )}

        {typeof book.rating === "number" && (
          <div className="flex items-center gap-1">
            <svg
              viewBox="0 0 1024 1024"
              width="14"
              height="14"
              fill="currentColor"
            >
              <path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z" />
            </svg>
            <span>{book.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function LibraryPage() {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setAuthUser(u));
    return () => unsub();
  }, []);

  // Saved Books (localStorage)
  useEffect(() => {
    if (!authUser) {
      setSavedBooks([]);
      setLoadingSaved(false);
      return;
    }

    if (typeof window === "undefined") return;
    const key = `library_${authUser.uid}`;
    const raw = window.localStorage.getItem(key);

    let ids: string[] = [];
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          ids = parsed.filter((x) => typeof x === "string");
        }
      } catch {
        ids = [];
      }
    }

    if (!ids.length) {
      setSavedBooks([]);
      setLoadingSaved(false);
      return;
    }

    async function fetchSaved() {
      setLoadingSaved(true);
      try {
        const uniqueIds = Array.from(new Set(ids));
        const books = await Promise.all(
          uniqueIds.map(async (id) => {
            const res = await fetch(
              `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${encodeURIComponent(
                id
              )}`,
              { cache: "no-store" }
            );
            const json: unknown = await res.json();
            if (!isRecord(json)) return null;
            return mapApiBook(json as ApiBook);
          })
        );

        setSavedBooks(
          books.filter((b): b is Book => !!b && !!b.id)
        );
      } catch {
        setSavedBooks([]);
      } finally {
        setLoadingSaved(false);
      }
    }

    fetchSaved();
  }, [authUser]);

  return (
    <div className="md:pl-10">
      <main className="w-full max-w-[1440px] px-[15px] py-10">
        {/* Saved Books */}
        <section>
          <h2 className="text-[20px] font-semibold text-[#032b41]">
            Saved Books
          </h2>
          <p className="mt-1 text-[13px] text-[#6b757b]">
            {loadingSaved
              ? "Loading..."
              : `${savedBooks.length} item${
                  savedBooks.length === 1 ? "" : "s"
                }`}
          </p>

          {loadingSaved ? (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="space-y-3 animate-pulse">
                  <div className="h-[210px] w-[150px] rounded-t-[999px] bg-zinc-100" />
                  <div className="h-4 w-32 bg-zinc-100 rounded" />
                  <div className="h-3 w-24 bg-zinc-100 rounded" />
                </div>
              ))}
            </div>
          ) : savedBooks.length === 0 ? (
            <div className="mt-6 text-[14px] text-[#6b757b]">
              You haven&apos;t saved any books yet. Go to a book page and click
              &quot;Add title to My Library&quot; to see it here.
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-x-10 gap-y-10">
              {savedBooks.map((book) => (
                <LibraryBookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

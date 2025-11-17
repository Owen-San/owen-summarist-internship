"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import AuthModal from "@/components/AuthModal";

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
  summary?: string;
  description?: string;
  bookDescription?: string;
  authorBio?: string;
  authorDescription?: string;
  tags?: string[];
  subscriptionRequired?: boolean;
  audio?: string;
  duration?: string;
  time?: string;
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
  summary?: string;
  bookDescription?: string;
  authorBio?: string;
  tags: string[];
  subscriptionRequired: boolean;
  audio?: string;
  duration?: string;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setAuthUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      try {
        const res = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${encodeURIComponent(
            String(id)
          )}`,
          { cache: "no-store" }
        );

        const json: unknown = await res.json();

        await new Promise((resolve) => setTimeout(resolve, 600));

        if (cancelled) return;

        if (!isRecord(json)) {
          setBook(null);
          return;
        }

        const data = json as ApiBook;

        const mapped: Book = {
          id: String(data.id ?? id),
          title: String(data.title ?? ""),
          author: String(data.author ?? ""),
          subtitle: String(data.subTitle ?? data.subtitle ?? ""),
          image: String(data.imageLink ?? data.image ?? ""),
          rating: typeof data.rating === "number" ? data.rating : undefined,
          totalRatings:
            typeof data.totalRating === "number" ? data.totalRating : undefined,
          keyIdeas: typeof data.keyIdeas === "number" ? data.keyIdeas : undefined,
          type: typeof data.type === "string" ? data.type : undefined,
          summary: typeof data.summary === "string" ? data.summary : undefined,
          bookDescription:
            typeof data.description === "string"
              ? data.description
              : typeof data.bookDescription === "string"
              ? data.bookDescription
              : undefined,
          authorBio:
            typeof data.authorBio === "string"
              ? data.authorBio
              : typeof data.authorDescription === "string"
              ? data.authorDescription
              : undefined,
          tags: Array.isArray(data.tags)
            ? data.tags.filter((t): t is string => typeof t === "string")
            : [],
          subscriptionRequired: Boolean(data.subscriptionRequired),
          audio: typeof data.audio === "string" ? data.audio : undefined,
          duration:
            typeof data.duration === "string"
              ? data.duration
              : typeof data.time === "string"
              ? data.time
              : undefined,
        };

        setBook(mapped);
      } catch {
        if (!cancelled) {
          setBook(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const duration = useMemo(() => {
    const v = book?.duration?.trim();
    if (!v) return "";
    if (/^\d{1,2}:\d{2}$/.test(v)) return v;

    const mm = v.match(/(\d+)\s*m/i)?.[1];
    const ss = v.match(/(\d+)\s*s/i)?.[1];

    if (mm) return `${String(mm).padStart(2, "0")}:${ss ? String(ss).padStart(2, "0") : "00"}`;
    return v;
  }, [book?.duration]);

  function handlePlay(kind: "read" | "listen") {
    if (!authUser) {
      setShowAuth(true);
      return;
    }
    if (book?.subscriptionRequired) {
      router.push("/choose-plan");
      return;
    }
    router.push(`/player/${book?.id}?mode=${kind}`);
  }

  function handleAddToLibrary() {
    if (!authUser) {
      setShowAuth(true);
      return;
    }
    router.refresh();
  }

  if (loading) {
    return (
      <div>
        <main className="w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 py-10 mx-auto md:mx-0">
          <div className="h-72 w-56 mx-auto rounded-md bg-zinc-100 animate-pulse" />
          <div className="mt-10 h-8 w-3/4 mx-auto bg-zinc-100 animate-pulse" />
          <div className="mt-3 h-5 w-1/2 mx-auto bg-zinc-100 animate-pulse" />
          <div className="mt-6 h-4 w-full bg-zinc-100 animate-pulse" />
        </main>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="md:pl-72">
        <main className="w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 py-10 mx-auto md:mx-0">
          <p className="text-[#0f2a37]">Book not found.</p>
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="md:pl-12">
        <main className="w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 py-10 mx-auto md:mx-0">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] gap-10 lg:gap-20 xl:gap-10 items-start">
            <div className="w-full max-w-[420px] mx-auto lg:mx-0 order-1 lg:order-2 mb-8 lg:mb-0">
              <div className="relative w-full max-w-[320px] mx-auto pt-6">
                <div className="absolute inset-x-0 bottom-0 h-[200px] bg-[#f1f6f4] rounded-t-[999px]" />
                <div className="relative h-[340px] w-full mx-auto">
                  <Image
                    src={book.image}
                    alt={book.title}
                    fill
                    sizes="340px"
                    className="object-contain relative z-10"
                  />
                </div>
              </div>
            </div>

            <div className="order-2 lg:order-1">
              <h1 className="text-[24px] sm:text-[28px] font-semibold text-[#0f2a37] text-center md:text-left">
                {book.title}
                {book.subscriptionRequired ? " (Premium)" : ""}
              </h1>

              <div className="mt-1 text-[15px] text-[#0f2a37]/80 text-center md:text-left">
                {book.author}
              </div>

              {book.subtitle ? (
                <div className="mt-4 text-[16px] sm:text-[18px] text-[#0f2a37] text-center md:text-left max-w-[520px]">
                  {book.subtitle}
                </div>
              ) : null}

              <div className="mt-6 border-t border-zinc-200" />

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="flex items-center gap-2 text-[#0f2a37] justify-center md:justify-start">
                  <span>
                    <svg viewBox="0 0 1024 1024" width="18" height="18" fill="currentColor">
                      <path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z" />
                    </svg>
                  </span>
                  {typeof book.rating === "number" && (
                    <span className="font-semibold">{book.rating.toFixed(1)}</span>
                  )}
                  {typeof book.totalRatings === "number" && (
                    <span className="text-[#0f2a37]/70">
                      ({book.totalRatings.toLocaleString()} ratings)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[#0f2a37] justify-center md:justify-start">
                  <span>
                    <svg viewBox="0 0 1024 1024" width="18" height="18" fill="currentColor">
                      <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                      <path d="M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8H488c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l165.4 120.6c3.6 2.6 8.6 1.8 11.2-1.7l28.6-39c2.6-3.7 1.8-8.7-1.8-11.2z"></path>
                    </svg>
                  </span>
                  <span>{duration}</span>
                </div>

                <div className="flex items-center gap-2 text-[#0f2a37] justify-center md:justify-start">
                  <span>
                    <svg viewBox="0 0 1024 1024" width="18" height="18" fill="currentColor">
                      <path d="M842 454c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 140.3-113.7 254-254 254S258 594.3 258 454c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 168.7 126.6 307.9 290 327.6V884H326.7c-13.7 0-24.7 14.3-24.7 32v36c0 4.4 2.8 8 6.2 8h407.6c3.4 0 6.2-3.6 6.2-8v-36c0-17.7-11-32-24.7-32H548V782.1c165.3-18 294-158 294-328.1z" />
                    </svg>
                  </span>
                  <span>{book.type ?? "Audio & Text"}</span>
                </div>

                <div className="flex items-center gap-2 text-[#0f2a37] justify-center md:justify-start">
                  <span>
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9.663 17h4.673" />
                      <path d="M12 3v1M21 12h-1M4 12H3" />
                      <path d="M6.343 6.343l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </span>
                  <span>
                    {typeof book.keyIdeas === "number"
                      ? `${book.keyIdeas} Key ideas`
                      : ""}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center md:justify-start">
                <button
                  onClick={() => handlePlay("read")}
                  className="bg-[#0f2a37] text-white rounded-md px-8 py-3 flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <span>
                    <svg viewBox="0 0 1024 1024" width="18" height="18" fill="currentColor">
                      <path d="M928 161H699.2c-49.1 0-97.1 14.1-138.4 40.7L512 233l-48.8-31.3A255.2 255.2 0 0 0 324.8 161H96c-17.7 0-32 14.3-32 32v568c0 17.7 14.3 32 32 32h228.8c49.1 0 97.1 14.1 138.4 40.7l44.4 28.6c1.3.8 2.8 1.3 4.3 1.3s3-.4 4.3-1.3l44.4-28.6C602 807.1 650.1 793 699.2 793H928c17.7 0 32-14.3 32-32V193c0-17.7-14.3-32-32-32z" />
                    </svg>
                  </span>
                  <span>Read</span>
                </button>

                <button
                  onClick={() => handlePlay("listen")}
                  className="border border-[#0f2a37] text-[#0f2a37] rounded-md px-8 py-3 flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <span>
                    <svg viewBox="0 0 1024 1024" width="18" height="18" fill="currentColor">
                      <path d="M842 454c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 140.3-113.7 254-254 254S258 594.3 258 454c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 168.7 126.6 307.9 290 327.6V884H326.7c-13.7 0-24.7 14.3-24.7 32v36c0 4.4 2.8 8 6.2 8h407.6c3.4 0 6.2-3.6 6.2-8v-36c0-17.7-11-32-24.7-32H548V782.1c165.3-18 294-158 294-328.1z" />
                    </svg>
                  </span>
                  <span>Listen</span>
                </button>
              </div>

              <div className="mt-6 border-t border-zinc-200" />

              <button
                onClick={handleAddToLibrary}
                className="mt-6 flex items-center gap-2 text-[#0f2a37] justify-center md:justify-start"
              >
                <span>
                  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2z" />
                  </svg>
                </span>
                <span className="text-[15px] text-[#0f2a37]">Add title to My Library</span>
              </button>

              <h2 className="mt-10 text-xl font-semibold text-[#0f2a37]">
                What&apos;s it about?
              </h2>

              <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
                {(book.tags.length
                  ? book.tags
                  : ["Productivity", "Personal Development"]
                ).map((t) => (
                  <span
                    key={t}
                    className="inline-block rounded-md bg-[#f1f6f4] px-4 py-2 text-[#0f2a37] text-sm font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-6 text-[14px] sm:text-[16px] leading-7 text-[#03314b] font-medium max-w-[720px]">
                {book.bookDescription ?? ""}
              </div>

              <h3 className="mt-10 text-xl font-semibold text-[#0f2a37]">
                About the author
              </h3>

              <div className="mt-6 text-[14px] sm:text-[16px] leading-7 text-[#03314b] font-medium max-w-[720px]">
                {book.authorBio}
              </div>
            </div>
          </div>
        </main>
      </div>

      <AuthModal open={showAuth} onOpenChange={setShowAuth} />
    </>
  );
}
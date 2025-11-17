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
  authorBio?: string;
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
    let active = true;
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
        if (!active || !isRecord(json)) {
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
          authorBio:
            typeof data.authorBio === "string" ? data.authorBio : undefined,
          tags: Array.isArray(data.tags)
            ? (data.tags.filter((t): t is string => typeof t === "string") as string[])
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
        setBook(null);
      } finally {
        if (active) setLoading(false);
      }
    }
    run();
    return () => {
      active = false;
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
      <div className="md:pl-72">
        <header className="sticky top-0 z-30 bg-white border-b border-zinc-200">
          <div className="mx-auto max-w-[1180px] px-10 py-4 flex items-center gap-3">
            <div className="relative flex-1">
              <div className="w-full h-10 rounded-md border border-zinc-300 bg-zinc-100 animate-pulse" />
            </div>
            <div className="h-6 w-6 rounded-md bg-zinc-100 animate-pulse" />
          </div>
        </header>
        <main className="mx-auto max-w-[1180px] px-10 py-10">
          <div className="h-64 w-64 mx-auto rounded-md bg-zinc-100 animate-pulse" />
          <div className="mt-10 h-8 w-3/4 bg-zinc-100 animate-pulse" />
          <div className="mt-3 h-5 w-1/2 bg-zinc-100 animate-pulse" />
          <div className="mt-6 h-4 w-full bg-zinc-100 animate-pulse" />
        </main>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="md:pl-72">
        <main className="mx-auto max-w-[1180px] px-10 py-10">
          <p className="text-[#0f2a37]">Book not found.</p>
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="md:pl-72">
        <header className="sticky top-0 z-30 bg-white border-b border-zinc-200">
          <div className="mx-auto max-w-[1180px] px-10 py-4 flex items-center gap-3">
            <div className="relative flex-1">
              <input
                placeholder="Search for books"
                className="w-full h-10 rounded-md border border-zinc-300 pl-4 pr-10 outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                <svg viewBox="0 0 1024 1024" width="18" height="18">
                  <path
                    d="M909.6 854.5 649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1C567.5 143.2 492.1 112 412 112s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412s31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"
                    fill="currentColor"
                  />
                </svg>
              </span>
            </div>
            <button className="md:hidden p-2 rounded-md border border-zinc-200">
              <svg viewBox="0 0 15 15" width="16" height="16">
                <path
                  d="M1.5 3C1.22 3 1 3.22 1 3.5S1.22 4 1.5 4h12c.28 0 .5-.22.5-.5S13.78 3 13.5 3h-12zM1 7.5c0-.28.22-.5.5-.5h12c.28 0 .5.22.5.5s-.22.5-.5.5h-12A.5.5 0 0 1 1 7.5zM1 11.5c0-.28.22-.5.5-.5h12c.28 0 .5.22.5.5s-.22.5-.5.5h-12a.5.5 0 0 1-.5-.5z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-[1180px] px-10 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-12 items-start">
            <div>
              <h1 className="text-[28px] font-semibold text-[#0f2a37]">
                {book.title}
                {book.subscriptionRequired ? " (Premium)" : ""}
              </h1>
              <div className="mt-1 text-[15px] text-[#0f2a37]/80">{book.author}</div>
              {book.subtitle ? (
                <div className="mt-4 text-[18px] text-[#0f2a37]">{book.subtitle}</div>
              ) : null}

              <div className="mt-6 border-t border-zinc-200" />

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="flex items-center gap-2 text-[#0f2a37]">
                  <span>
                    <svg viewBox="0 0 1024 1024" width="18" height="18" fill="currentColor">
                      <path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z" />
                    </svg>
                  </span>
                  {typeof book.rating === "number" && (
                    <span className="font-medium">{book.rating.toFixed(1)}</span>
                  )}
                  {typeof book.totalRatings === "number" && (
                    <span className="text-[#0f2a37]/70">
                      ({book.totalRatings.toLocaleString()} ratings)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[#0f2a37]">
                  <span>
                    <svg viewBox="0 0 1024 1024" width="18" height="18" fill="currentColor">
                      <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                      <path d="M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8H488c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l165.4 120.6c3.6 2.6 8.6 1.8 11.2-1.7l28.6-39c2.6-3.7 1.8-8.7-1.8-11.2z"></path>
                    </svg>
                  </span>
                  <span>{duration}</span>
                </div>

                <div className="flex items-center gap-2 text-[#0f2a37]">
                  <span>
                    <svg viewBox="0 0 1024 1024" width="18" height="18" fill="currentColor">
                      <path d="M842 454c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 140.3-113.7 254-254 254S258 594.3 258 454c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 168.7 126.6 307.9 290 327.6V884H326.7c-13.7 0-24.7 14.3-24.7 32v36c0 4.4 2.8 8 6.2 8h407.6c3.4 0 6.2-3.6 6.2-8v-36c0-17.7-11-32-24.7-32H548V782.1c165.3-18 294-158 294-328.1z" />
                    </svg>
                  </span>
                  <span>{book.type ?? "Audio & Text"}</span>
                </div>

                <div className="flex items-center gap-2 text-[#0f2a37]">
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
                  <span>{typeof book.keyIdeas === "number" ? `${book.keyIdeas} Key ideas` : ""}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => handlePlay("read")}
                  className="bg-[#0f2a37] text-white rounded-md px-6 py-3 flex items-center gap-2"
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
                  className="border border-[#0f2a37] text-[#0f2a37] rounded-md px-6 py-3 flex items-center gap-2"
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

              <button onClick={handleAddToLibrary} className="mt-6 flex items-center gap-2 text-[#0f2a37]">
                <span>
                  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2z" />
                  </svg>
                </span>
                <span className="underline">Add title to My Library</span>
              </button>

              <h2 className="mt-10 text-xl font-semibold text-[#0f2a37]">What&rsquo;s it about?</h2>

              <div className="mt-4 flex flex-wrap gap-3">
                {(book.tags.length ? book.tags : ["Productivity", "Personal Development"]).map((t) => (
                  <span
                    key={t}
                    className="inline-block rounded-md border border-zinc-200 px-4 py-2 text-[#0f2a37] bg-white"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-6 text-[15px] leading-7 text-[#0f2a37]/90">{book.summary}</div>

              <h3 className="mt-10 text-xl font-semibold text-[#0f2a37]">About the author</h3>
              <div className="mt-4 text-[15px] leading-7 text-[#0f2a37]/90">{book.authorBio}</div>
            </div>

            <div className="relative mx-auto lg:mx-0 w-[420px]">
              <div className="relative h-[300px] w-[300px] mx-auto">
                <Image src={book.image} alt="book" fill sizes="360px" className="object-contain relative z-10" />
              </div>
            </div>
          </div>
        </main>
      </div>

      <AuthModal open={showAuth} onOpenChange={setShowAuth} />
    </>
  );
}

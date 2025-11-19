"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AudioPlayer from "@/components/AudioPlayer";

type ApiBook = {
  id?: string;
  title?: string;
  author?: string;
  summary?: string;
  description?: string;
  bookDescription?: string;
  image?: string;
  imageLink?: string;
  audio?: string;
  audioLink?: string;
  audioUrl?: string;
};

type Book = {
  id: string;
  title: string;
  author: string;
  summary: string;
  image: string;
  audio: string;
};

export default function PlayerPage() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const res = await fetch(
        `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${encodeURIComponent(
          String(id)
        )}`,
        { cache: "no-store" }
      );

      const json = (await res.json()) as ApiBook;

      const mapped: Book = {
        id: String(json.id ?? id),
        title: String(json.title ?? ""),
        author: String(json.author ?? ""),
        summary:
          typeof json.summary === "string"
            ? json.summary
            : typeof json.description === "string"
            ? json.description
            : typeof json.bookDescription === "string"
            ? json.bookDescription
            : "",
        image: String(json.imageLink ?? json.image ?? ""),
        audio:
          typeof json.audio === "string"
            ? json.audio
            : typeof json.audioLink === "string"
            ? json.audioLink
            : typeof json.audioUrl === "string"
            ? json.audioUrl
            : "",
      };

      setBook(mapped);
      setLoading(false);
    }

    load();
  }, [id]);

  if (loading || !book) {
    return (
      <div className="px-6 py-10 pb-28 md:pb-24">
        <div className="h-8 w-1/3 rounded bg-zinc-200 animate-pulse" />
        <div className="mt-4 h-4 w-full rounded bg-zinc-200 animate-pulse" />
        <div className="mt-2 h-4 w-5/6 rounded bg-zinc-200 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-20 py-10 pb-28 md:pb-24 max-w-[1000px] mx-auto">
      <h1 className="text-2xl font-semibold text-[#0f2a37]">{book.title}</h1>
      <p className="mt-1 text-[#0f2a37]/80">{book.author}</p>

      <div className="mt-4 border-t border-zinc-200" />

      <div
        className="mt-6 leading-7 text-[#03314b] whitespace-pre-line"
        style={{ fontSize: "var(--player-font-size, 15px)" }}
      >
        {book.summary}
      </div>

      <AudioPlayer
        src={book.audio}
        title={book.title}
        author={book.author}
        image={book.image}
      />
    </div>
  );
}

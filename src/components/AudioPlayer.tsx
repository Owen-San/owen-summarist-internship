"use client";

import Image from "next/image";
import { useRef, useState, type ChangeEvent } from "react";

type AudioPlayerProps = {
  src: string;
  title: string;
  author: string;
  image: string;
};

export default function AudioPlayer({ src, title, author, image }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  function togglePlay() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  }

  function skip(amount: number) {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    const next = Math.min(
      Math.max(audio.currentTime + amount, 0),
      duration || audio.duration || 0
    );
    audio.currentTime = next;
    setCurrentTime(next);
  }

  function handleLoadedMetadata() {
    if (!audioRef.current) return;
    const d = audioRef.current.duration;
    setDuration(Number.isNaN(d) ? 0 : d);
    setCurrentTime(0);
  }

  function handleTimeUpdate() {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  }

  function handleRangeChange(e: ChangeEvent<HTMLInputElement>) {
    const value = Number(e.target.value);
    if (!audioRef.current) return;
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  }

  function formatTime(sec: number) {
    if (!sec || Number.isNaN(sec)) return "00:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 w-full bg-[#002333] text-white shadow-[0_-2px_8px_rgba(0,0,0,0.35)]">
      <audio
        ref={audioRef}
        src={src}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      <div className="mx-auto w-full max-w-[1200px] px-3 py-3 sm:px-4 md:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          <div className="flex min-w-0 flex-1 items-center justify-center gap-3 lg:justify-start">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-white">
              <Image src={image} alt={title} fill className="object-contain" />
            </div>
            <div className="flex min-w-0 flex-col items-center text-center lg:items-start lg:text-left">
              <span className="truncate text-[14px] leading-tight">
                {title}
              </span>
              <span className="mt-1 truncate text-[12px] text-white/70">
                {author}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-center gap-4 lg:gap-5">
            <button
              type="button"
              onClick={() => skip(-10)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white"
            >
              <span className="flex items-center gap-[2px] text-[11px]">
                <span className="leading-none">⟲</span>
                <span>10</span>
              </span>
            </button>

            <button
              type="button"
              onClick={togglePlay}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white"
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#002333]">
                  <rect x="6" y="5" width="4" height="14" fill="currentColor" />
                  <rect x="14" y="5" width="4" height="14" fill="currentColor" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#002333]">
                  <polygon points="6,4 20,12 6,20" fill="currentColor" />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={() => skip(10)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white"
            >
              <span className="flex items-center gap-[2px] text-[11px]">
                <span>10</span>
                <span className="leading-none">⟳</span>
              </span>
            </button>
          </div>

          <div className="flex w-full items-center gap-3 lg:w-auto lg:flex-1">
            <span className="w-12 text-right text-[12px]">
              {formatTime(currentTime)}
            </span>

            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={handleRangeChange}
              className="h-[3px] flex-1 cursor-pointer appearance-none rounded-full bg-[#6d787d]"
            />

            <span className="w-12 text-left text-[12px]">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

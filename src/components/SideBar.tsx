"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { useEffect, useState } from "react";

type FontSizeKey = "sm" | "md" | "lg" | "xl";

const sizeMap: Record<FontSizeKey, string> = {
  sm: "16px",
  md: "18px",
  lg: "20px",
  xl: "22px",
};

type SidebarProps = {
  variant?: "desktop" | "mobile";
};

export default function Sidebar({ variant = "desktop" }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isPlayer = pathname?.startsWith("/player");

  const isForYou = pathname === "/foryou" || pathname === "/";
  const isLibrary = pathname === "/library";

  const [fontSize, setFontSize] = useState<FontSizeKey>(() => {
    if (typeof window === "undefined") return "md";
    const saved = window.localStorage.getItem("playerFontSize") as
      | FontSizeKey
      | null;
    if (saved === "sm" || saved === "md" || saved === "lg" || saved === "xl") {
      return saved;
    }
    return "md";
  });

  async function handleLogout() {
    await signOut(auth);
    router.push("/");
  }

  function applyFontSize(size: FontSizeKey) {
    setFontSize(size);
  }

  useEffect(() => {
    if (!isPlayer) return;
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty(
        "--player-font-size",
        sizeMap[fontSize]
      );
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem("playerFontSize", fontSize);
    }
  }, [fontSize, isPlayer]);

  const base = "h-screen w-72 border-r border-zinc-200 bg-white";
  const desktopClasses = "hidden md:flex sticky top-0";
  const mobileClasses = "flex md:hidden";

  return (
    <aside
      className={`${base} ${
        variant === "desktop" ? desktopClasses : mobileClasses
      }`}
    >
      <div className={`flex h-full w-full flex-col ${isPlayer ? "pb-24" : ""}`}>
        <div className="px-7 py-7">
          <div className="relative h-12 w-44">
            <Image src="/logo.png" alt="Summarist" fill className="object-contain" />
          </div>
        </div>

        <nav className="px-4 space-y-1.5 text-[16px]">
          {/* For you */}
          <Link
            href="/foryou"
            className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-md ${
              isForYou
                ? "bg-zinc-100 text-[#0f2a37]"
                : "hover:bg-zinc-100 text-[#0f2a37]/80"
            }`}
          >
            <span className="inline-block h-5 w-5">
              <svg viewBox="0 0 1024 1024" width="18" height="18">
                <path
                  d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z"
                  fill="currentColor"
                />
              </svg>
            </span>
            For you
          </Link>

          {/* My Library */}
          <Link
            href="/library"
            className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-md ${
              isLibrary
                ? "bg-zinc-100 text-[#0f2a37]"
                : "hover:bg-zinc-100 text-[#0f2a37]/80"
            }`}
          >
            <span className="inline-block h-5 w-5">
              <svg viewBox="0 0 16 16" width="18" height="18">
                <path
                  d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"
                  fill="currentColor"
                />
              </svg>
            </span>
            My Library
          </Link>

          <div className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-md text-[#0f2a37]/50 select-none cursor-not-allowed">
            <span className="inline-block h-5 w-5">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path
                  d="M17.849 11.808l-.707-.707-9.9 9.9H3v-4.243L14.313 5.444l5.657 5.657a1 1 0 0 1 0 1.414l-7.07 7.071-1.415-1.414 6.364-6.364z"
                  fill="currentColor"
                />
              </svg>
            </span>
            Highlights
          </div>

          <div className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-md text-[#0f2a37]/50 select-none cursor-not-allowed">
            <span className="inline-block h-5 w-5">
              <svg viewBox="0 0 1024 1024" width="18" height="18">
                <path
                  d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"
                  fill="currentColor"
                />
              </svg>
            </span>
            Search
          </div>
        </nav>

        {isPlayer && (
          <div className="px-7 pt-6">
            <div className="flex items-center gap-4 text-[#0f2a37]">
              {(["sm", "md", "lg", "xl"] as FontSizeKey[]).map((size, index) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => applyFontSize(size)}
                  className={`pb-1 ${
                    fontSize === size ? "border-b-2 border-[#2BD97C]" : ""
                  }`}
                >
                  <span
                    className={
                      index === 0
                        ? "text-[16px]"
                        : index === 1
                        ? "text-[18px]"
                        : index === 2
                        ? "text-[20px]"
                        : "text-[22px]"
                    }
                  >
                    Aa
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto px-4 space-y-1.5 pb-7">
          <Link
            href="/settings"
            className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-md hover:bg-zinc-100 text-[#0f2a37]/80"
          >
            <span className="inline-block h-5 w-5">
              <svg viewBox="0 0 15 15" width="18" height="18">
                <path
                  d="M7.07.65c-.4 0-.74.27-.83.66l-.24 1.05c-.38.11-.74.26-1.08.45l-.91-.57a.85.85 0 0 0-1.05.08l-.61.61a.85.85 0 0 0-.08 1.05l.57.91c-.19.34-.34.7-.45 1.08l-1.05.24a.85.85 0 0 0-.66.83v.86c0 .4.27.74.66.83l1.05.24c.11.38.26.74.45 1.08l-.57.91a.85.85 0 0 0 .08 1.05l.61.61c.29.29.75.34 1.05.08l.91-.57c.34.19.7.34 1.08.45l.24 1.05c.09.39.43.66.83.66h.86c.4 0 .74-.27.83-.66l.24-1.05c.38-.11.74-.26 1.08-.45l.91.57c.3.26.76.21 1.05-.08l.61-.61c.29-.29.34-.75.08-1.05l-.57-.91c.19-.34.34-.7.45-1.08l1.05-.24c.39-.09.66-.43.66-.83v-.86c0-.4-.27-.74-.66-.83l-1.05-.24a5 5 0 0 0-.45-1.08l-.57-.91a.85.85 0 0 0-.08-1.05l-.61-.61a.85.85 0 0 0-1.05-.08l-.91.57a5 5 0 0 0-1.08-.45l-.24-1.05A.85.85 0 0 0 7.93.65h-.86z"
                  fill="currentColor"
                />
              </svg>
            </span>
            Settings
          </Link>

          <div
            className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-md text-[#0f2a37]/50 select-none cursor-not-allowed"
            title="Coming soon"
          >
            <span className="inline-block h-5 w-5">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" strokeWidth="2" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" fill="none" strokeWidth="2" />
                <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
            Help & Support
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-md hover:bg-zinc-100 text-left text-[#0f2a37]/80"
          >
            <span className="inline-block h-5 w-5">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </span>
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}

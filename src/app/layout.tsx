"use client";

import { usePathname } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { useEffect, useState, ReactNode } from "react";
import SideBar from "@/components/SideBar";
import SearchBar from "@/components/SearchBar";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  const isHome = pathname === "/";
  const isPlayer = pathname?.startsWith("/player");

  return (
    <html lang="en">
      <body
        className={
          isPlayer
            ? "antialiased flex h-[calc(100vh-90px)]"
            : "antialiased flex min-h-screen"
        }
      >
        {user && !isHome && (
          <div className={isPlayer ? "pb-[500px]" : ""}>
            <SideBar />
          </div>
        )}

        <main className="flex-1 overflow-y-auto">
          {user && !isHome && <SearchBar />}
          {children}
        </main>
      </body>
    </html>
  );
}

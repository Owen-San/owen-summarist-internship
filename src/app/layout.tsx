"use client";

import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { useEffect, useState, ReactNode } from "react";
import SideBar from "@/components/SideBar";
import SearchBar from "@/components/SearchBar";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setCheckingAuth(false);
    });
    return () => unsub();
  }, []);

  const isHome = pathname === "/";
  const isProtected = !isHome;

  useEffect(() => {
    if (!checkingAuth && isProtected && !user) {
      router.replace("/");
    }
  }, [checkingAuth, isProtected, user, router]);

  if (checkingAuth) {
    return (
      <html lang="en">
        <body className="antialiased flex min-h-screen" />
      </html>
    );
  }

  return (
    <html lang="en">
      <body
        className={
          pathname?.startsWith("/player")
            ? "antialiased flex h-[calc(100vh-90px)]"
            : "antialiased flex min-h-screen"
        }
      >
        {user && !isHome && (
          <div className={pathname?.startsWith("/player") ? "pb-[500px]" : ""}>
            <SideBar />
          </div>
        )}

        <main className="flex-1 overflow-y-auto">
          {user && !isHome && <SearchBar />}
          {(!isProtected || user) && children}
        </main>
      </body>
    </html>
  );
}

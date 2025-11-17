"use client";

import { usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { useEffect, useState, ReactNode } from "react";
import SideBar from "@/components/SideBar";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<null | object>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  const isHome = pathname === "/";

  return (
    <html lang="en">
      <body className="antialiased flex">
        {user && !isHome && <SideBar />}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </body>
    </html>
  );
}
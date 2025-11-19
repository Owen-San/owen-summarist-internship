"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/AuthModal";

export default function SettingsPage() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
    });
    return () => unsub();
  }, []);

  const isGuest = !authUser || authUser.isAnonymous;

  const emailDisplay = isGuest
    ? "Guest Account"
    : authUser?.email ?? "No email";

  const buttonLabel = isGuest
    ? "Login to upgrade plan"
    : "Upgrade to Premium";

  function handleUpgradeClick() {
    if (isGuest) {
      setAuthModalOpen(true);
    } else {
      router.push("/choose-plan"); // ✅ Redirect for real logged-in users
    }
  }

  return (
    <>
      <div className="md:pl-10">
        <main className="w-full max-w-[980px] px-6 py-14">
          {/* HEADER */}
          <h1 className="text-[34px] font-bold text-[#032b41]">Settings</h1>
          <div className="mt-6 border-t border-[#e1e7eb]" />

          {/* SUBSCRIPTION SECTION */}
          <section className="mt-10 border-b border-[#e1e7eb] pb-10">
            <h2 className="text-[22px] font-semibold text-[#032b41]">
              Your Subscription plan
            </h2>

            <p className="mt-4 text-[17px] text-[#394547]">Basic</p>

            <button
              type="button"
              onClick={handleUpgradeClick}
              className="mt-5 inline-flex items-center justify-center rounded-md
                         bg-[#2bd97c] px-8 py-3.5 text-[16px] font-semibold
                         text-white hover:bg-[#22c56c] transition-colors"
            >
              {buttonLabel}
            </button>
          </section>

          {/* EMAIL SECTION */}
          <section className="mt-10">
            <h2 className="text-[22px] font-semibold text-[#032b41]">Email</h2>
            <p className="mt-4 text-[17px] text-[#032b41]">{emailDisplay}</p>
          </section>
        </main>
      </div>

      {/* AUTH MODAL */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
}

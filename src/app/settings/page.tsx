"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthModal from "@/components/AuthModal";
import { useSubscription } from "@/hooks/useSubscription";
import { goToBillingPortal } from "@/lib/stripe";

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, planLabel, isActive, loading } = useSubscription();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isManaging, setIsManaging] = useState(false);

  const isGuest = !user || user.isAnonymous;

  const emailDisplay = isGuest ? "Guest Account" : user?.email ?? "No email";

  const planDisplay = loading
    ? "Checking your plan..."
    : isActive
    ? planLabel
    : "Basic";

  const buttonLabel = isGuest
    ? "Login to upgrade plan"
    : isActive
    ? isManaging
      ? "Opening billing portal..."
      : "Manage subscription"
    : "Upgrade to Premium";

  async function handleUpgradeClick() {
    if (loading || isManaging) {
      return;
    }

    if (isGuest) {
      setAuthModalOpen(true);
      return;
    }

    if (isActive) {
      setIsManaging(true);
      try {
        await goToBillingPortal();
      } finally {
        setIsManaging(false);
      }
      return;
    }

    router.push("/choose-plan");
  }

  const checkoutSuccess = searchParams.get("checkout") === "success";

  return (
    <>
      <div className="md:pl-10">
        <main className="w-full max-w-[980px] px-6 py-14">
          <h1 className="text-[34px] font-bold text-[#032b41]">Settings</h1>

          {checkoutSuccess && (
            <div className="mt-4 rounded-md bg-[#e6f4ea] px-4 py-3 text-[14px] text-[#0f5132]">
              Your subscription has been updated successfully.
            </div>
          )}

          <div className="mt-6 border-t border-[#e1e7eb]" />

          <section className="mt-10 border-b border-[#e1e7eb] pb-10">
            <h2 className="text-[22px] font-semibold text-[#032b41]">
              Your Subscription plan
            </h2>

            <p className="mt-4 text-[17px] text-[#394547]">{planDisplay}</p>

            <button
              type="button"
              onClick={handleUpgradeClick}
              disabled={loading || isManaging}
              className={`mt-5 inline-flex items-center justify-center rounded-md bg-[#2bd97c] px-8 py-3.5 text-[16px] font-semibold text-white hover:bg-[#22c56c] transition-colors ${
                loading || isManaging ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {buttonLabel}
            </button>
          </section>

          <section className="mt-10">
            <h2 className="text-[22px] font-semibold text-[#032b41]">Email</h2>
            <p className="mt-4 text-[17px] text-[#032b41]">{emailDisplay}</p>
          </section>
        </main>
      </div>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
}

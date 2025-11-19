"use client";

import Image from "next/image";
import { useState } from "react";
import { FaRegFileAlt, FaSeedling, FaHandshake } from "react-icons/fa";

type FaqItem = {
  question: string;
  answer: string;
};

const faqItems: FaqItem[] = [
  {
    question: "How does the free 7-day trial work?",
    answer:
      "Begin your complimentary 7-day trial with a Summarist annual membership. You are under no obligation to continue your subscription, and you will only be billed when the trial period expires. With Premium access, you can learn at your own pace and as frequently as you desire, and you may terminate your subscription prior to the conclusion of the 7-day free trial.",
  },
  {
    question:
      "Can I switch subscriptions from monthly to yearly, or yearly to monthly?",
    answer:
      "While an annual plan is active, it is not feasible to switch to a monthly plan. However, once the current month ends, transitioning from a monthly plan to an annual plan is an option.",
  },
  {
    question: "What's included in the Premium plan?",
    answer:
      "Premium membership provides you with the ultimate Summarist experience, including unrestricted entry to many best-selling books, high-quality audio, the ability to download titles for offline reading, and the option to send your reads to your Kindle.",
  },
  {
    question: "Can I cancel during my trial or subscription?",
    answer:
      "You will not be charged if you cancel your trial before its conclusion. While you will not have complete access to the entire Summarist library, you can still expand your knowledge with one curated book per day.",
  },
];

type PlanId = "yearly" | "monthly";

export default function ChoosePlanPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("yearly");

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <main className="min-h-screen bg-white text-[#032b41] animate-[choose-plan-slide-in_0.35s_ease-out_forwards]">
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#032b41] text-white pt-16 pb-24">
          <div className="pointer-events-none absolute inset-x-[-30%] bottom-[-260px] h-[520px] rounded-[50%] bg-white" />
          <div className="relative mx-auto flex max-w-[980px] flex-col items-center px-4 text-center">
            <h1 className="text-[32px] sm:text-[38px] md:text-[44px] font-bold leading-tight">
              Get unlimited access to many
              <br />
              amazing books to read
            </h1>
            <p className="mt-4 text-[15px] sm:text-[16px] text-white/90">
              Turn ordinary moments into amazing learning opportunities
            </p>

            <div className="mt-10 w-full max-w-[480px]">
              <div className="relative mx-auto aspect-[4/3] w-full">
                <Image
                  src="/pricing-top.png"
                  alt="Choose plan illustration"
                  fill
                  sizes="480px"
                  priority
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES + PLANS */}
        <section className="mx-auto max-w-[980px] px-4 pb-32 pt-10">
          {/* three feature icons */}
          <div className="grid gap-10 text-center md:grid-cols-3">
            {/* Document icon */}
            <div>
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#f1f6f4] text-[#032b41]">
                <FaRegFileAlt className="h-9 w-9" />
              </div>
              <p className="text-[15px] leading-snug">
                <span className="font-semibold">Key ideas in few min</span> with
                many books to read
              </p>
            </div>

            {/* Plant icon */}
            <div>
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#f1f6f4] text-[#032b41]">
                <FaSeedling className="h-9 w-9" />
              </div>
              <p className="text-[15px] leading-snug">
                <span className="font-semibold">3 million</span> people growing
                with Summarist everyday
              </p>
            </div>

            {/* Handshake icon */}
            <div>
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#f1f6f4] text-[#032b41]">
                <FaHandshake className="h-9 w-9" />
              </div>
              <p className="text-[15px] leading-snug">
                <span className="font-semibold">Precise recommendations</span>{" "}
                collections curated by experts
              </p>
            </div>
          </div>

          <div className="mt-14 text-center">
            <h2 className="text-[24px] sm:text-[26px] md:text-[28px] font-semibold text-[#032b41]">
              Choose the plan that fits you
            </h2>
          </div>

          {/* PLAN CARDS */}
          <div className="mx-auto mt-8 max-w-[580px] space-y-6">
            {/* Yearly */}
            <button
              type="button"
              onClick={() => setSelectedPlan("yearly")}
              className={`w-full rounded-md border px-6 py-6 text-left transition-colors ${
                selectedPlan === "yearly"
                  ? "border-[#00a061] bg-[#f7faf9] shadow-[0_0_0_1px_rgba(0,160,97,0.25)]"
                  : "border-[#d8e2e7] bg-[#f7faf9]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    selectedPlan === "yearly"
                      ? "border-[#00a061]"
                      : "border-[#6b757b]"
                  }`}
                >
                  {selectedPlan === "yearly" && (
                    <div className="h-2.5 w-2.5 rounded-full bg-[#00a061]" />
                  )}
                </div>
                <div className="text-[15px] font-semibold text-[#032b41]">
                  Premium Plus Yearly
                </div>
              </div>
              <div className="mt-3 text-[20px] font-bold text-[#032b41]">
                $99.99<span className="text-[16px] font-semibold">/year</span>
              </div>
              <div className="mt-1 text-[13px] text-[#00a061]">
                7-day free trial included
              </div>
            </button>

            {/* OR divider between plans */}
            <div className="flex items-center gap-4 text-[12px] text-[#6b757b]">
              <div className="h-px flex-1 bg-[#d8e2e7]" />
              <span>or</span>
              <div className="h-px flex-1 bg-[#d8e2e7]" />
            </div>

            {/* Monthly */}
            <button
              type="button"
              onClick={() => setSelectedPlan("monthly")}
              className={`w-full rounded-md border px-6 py-6 text-left transition-colors ${
                selectedPlan === "monthly"
                  ? "border-[#00a061] bg-[#f7faf9] shadow-[0_0_0_1px_rgba(0,160,97,0.25)]"
                  : "border-[#d8e2e7] bg-[#f7faf9]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    selectedPlan === "monthly"
                      ? "border-[#00a061]"
                      : "border-[#6b757b]"
                  }`}
                >
                  {selectedPlan === "monthly" && (
                    <div className="h-2.5 w-2.5 rounded-full bg-[#00a061]" />
                  )}
                </div>
                <div className="text-[15px] font-semibold text-[#032b41]">
                  Premium Monthly
                </div>
              </div>
              <div className="mt-3 text-[20px] font-bold text-[#032b41]">
                $9.99<span className="text-[16px] font-semibold">/month</span>
              </div>
              <div className="mt-1 text-[13px] text-[#6b757b]">
                No trial included
              </div>
            </button>
          </div>
        </section>

        {/* FULL-WIDTH STICKY TRIAL BAR */}
        <div className="sticky bottom-0 z-40 w-full border-t border-[#e1e7eb] bg-white">
          <div className="mx-auto max-w-[580px] px-4 py-4 text-center">
            <button className="mb-2 w-full rounded-md bg-[#2bd97c] py-3.5 text-[15px] font-semibold text-white">
              Start your free 7-day trial
            </button>
            <p className="text-[12px] text-[#6b757b]">
              Cancel your trial at any time before it ends, and you won&apos;t
              be charged.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <section className="border-t border-[#e1e7eb] bg-white">
          <div className="mx-auto max-w-[980px] px-4 py-10">
            <div className="divide-y divide-[#e1e7eb] border-b border-[#e1e7eb]">
              {faqItems.map((item, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={item.question} className="py-5">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between text-left text-[18px] font-semibold text-[#032b41]"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                    >
                      <span>{item.question}</span>
                      <span className="ml-4 text-[20px]">
                        {isOpen ? "˄" : "˅"}
                      </span>
                    </button>
                    <div
                      className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
                        isOpen
                          ? "max-h-[400px] opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="mt-3 text-[14px] leading-relaxed text-[#394547]">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-[#e1e7eb] bg-[#f7faf9]">
          <div className="mx-auto flex max-w-[980px] flex-col gap-10 px-4 py-10 text-[13px] text-[#6b757b] md:flex-row md:justify-between">
            <div className="space-y-2">
              <h3 className="text-[13px] font-semibold text-[#032b41]">
                Actions
              </h3>
              <p>Summarist Magazine</p>
              <p>Cancel Subscription</p>
              <p>Help</p>
              <p>Contact us</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-[13px] font-semibold text-[#032b41]">
                Useful Links
              </h3>
              <p>Pricing</p>
              <p>Summarist Business</p>
              <p>Gift Cards</p>
              <p>Authors &amp; Publishers</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-[13px] font-semibold text-[#032b41]">
                Company
              </h3>
              <p>About</p>
              <p>Careers</p>
              <p>Partners</p>
              <p>Code of Conduct</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-[13px] font-semibold text-[#032b41]">
                Other
              </h3>
              <p>Sitemap</p>
              <p>Legal Notice</p>
              <p>Terms of Service</p>
              <p>Privacy Policies</p>
            </div>
          </div>
          <div className="border-t border-[#e1e7eb] py-4 text-center text-[12px] text-[#6b757b]">
            Copyright © 2025 Summarist.
          </div>
        </footer>
      </main>
    </div>
  );
}

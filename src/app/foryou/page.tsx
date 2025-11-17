import Image from "next/image";
import Link from "next/link";

type Book = {
  id: string;
  title: string;
  author: string;
  subtitle?: string;
  image: string;
  duration: string;
  rating?: string;
  premium?: boolean;
  audio?: string;
};

const selected: Book = {
  id: "f9gy1gpai8",
  title: "The Lean Startup",
  author: "Eric Ries",
  subtitle: "How Constant Innovation Creates Radically Successful Businesses",
  image:
    "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Fimages%2Fthe-lean-startup.png?alt=media&token=087bb342-71d9-4c07-8b0d-4dd1f06a5aa2",
  duration: "3 mins 23 secs",
  audio:
    "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Faudios%2Fthe-lean-startup.mp3?alt=media&token=c2f2b1d4-eaf2-4d47-8c8a-7a8fd062a47e",
};

const recommended: Book[] = [
  {
    id: "5bxl50cz4bt",
    title: "How to Win Friends and Influence People in the Digital Age",
    author: "Dale Carnegie",
    subtitle: "Time-tested advice for the digital age",
    image:
      "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Fimages%2Fhow-to-win-friends-and-influence-people.png?alt=media&token=099193aa-4d85-4e22-8eb7-55f12a235fe2",
    duration: "03:24",
    rating: "4.4",
    audio:
      "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Faudios%2Fhow-to-win-friends-and-influence-people.mp3?alt=media&token=60872755-13fc-43f4-8b75-bae3fcd73991",
  },
  {
    id: "2l0idxm1rvw",
    title: "Can’t Hurt Me",
    author: "David Goggins",
    subtitle: "Master Your Mind and Defy the Odds",
    image:
      "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Fimages%2Fcant-hurt-me.png?alt=media&token=026646b0-40f8-48c4-8d32-b69bd5b8f700",
    duration: "04:52",
    rating: "4.2",
    audio:
      "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Faudios%2Fcan't-hurt-me.mp3?alt=media&token=7de57406-60ca-49d6-9113-857507f48312",
  },
  {
    id: "4t0amyb4upc",
    title: "Mastery",
    author: "Robert Greene",
    subtitle: "Myths about genius and what it really means to be great",
    image:
      "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Fimages%2Fmastery.png?alt=media&token=c41aac74-9887-4536-9478-93cd983892af",
    duration: "04:40",
    rating: "4.3",
    premium: true,
    audio:
      "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Faudios%2Fmastery.mp3?alt=media&token=364b7c19-e9b1-4084-be0d-3a9cb5367098",
  },
  {
    id: "g2tdej27d23",
    title: "Atomic Habits",
    author: "James Clear",
    subtitle: "An Easy & Proven Way to Build Good Habits & Break Bad Ones",
    image:
      "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Fimages%2Fatomic_habits.png?alt=media&token=51401979-e7cc-40c4-87fa-3b27d1fe761b",
    duration: "03:24",
    rating: "4.3",
    premium: true,
    audio:
      "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Faudios%2Fatomic-habits.mp3?alt=media&token=e9bd4ea8-044a-4c73-acac-1228e3bc50b6",
  },
  {
    id: "18tro3gle2p",
    title: "How to Talk to Anyone",
    author: "Leil Lowndes",
    subtitle: "92 Little Tricks for Big Success in Relationships",
    image:
      "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Fimages%2Fhow-to-talk-to-anyone.png?alt=media&token=48f77463-a093-42b4-8f1f-82fa4edd044c",
    duration: "03:22",
    rating: "4.6",
    premium: true,
    audio:
      "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Faudios%2Fhow-to-talk-to-anyone.mp3?alt=media&token=30173e56-fbe6-4162-8184-64d24dc480ac",
  },
  {
    id: "ap153fptaq",
    title: "Jim Collins",
    author: "Good to Great",
    subtitle: "Why Some Companies Make the Leap...And Others Don't",
    image:
      "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Fimages%2Fgood-to-great.png?alt=media&token=b906ec52-7871-411f-b5b6-53f1da98ee27",
    duration: "03:01",
    rating: "4.5",
    premium: true,
    audio:
      "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Faudios%2Fgood-to-great.mp3?alt=media&token=c1b30865-26f7-47c5-a0f3-fd9da5d3da3d",
  },
  {
    id: "2ozpy1q1pbt",
    title: "The Intelligent Investor",
    author: "Benjamin Graham",
    subtitle: "The Definitive Book on Value Investing",
    image:
      "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Fimages%2Fthe-intelligent-investor.png?alt=media&token=f72f1865-de93-4c67-bd6e-55070f467923",
    duration: "02:48",
    rating: "4.8",
    premium: true,
    audio:
      "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Faudios%2Fthe-intelligent-investor.mp3?alt=media&token=82429bb8-8af4-4375-bca5-e6f89e631fca",
  },
  {
    id: "cuolx5oryy8",
    title: "The 4 Day Week",
    author: "Andrew Barnes",
    subtitle:
      "How the flexible work revolution can increase productivity, profitability, and wellbeing, and help create a sustainable future",
    image:
      "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Fimages%2Fthe-4-day-week.png?alt=media&token=8f468ea2-f16c-4a96-9bc3-8f66aaff33ec",
    duration: "02:20",
    rating: "4.6",
    premium: true,
    audio:
      "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Faudios%2Fthe-4-day-week.mp3?alt=media&token=6265f7a5-1dab-422d-8d22-71cdb70678a1",
  },
];

const suggested: Book[] = [
  {
    id: "6ncszvwbl4e",
    title: "Zero to One",
    author: "Peter Thiel with Blake Masters",
    subtitle: "Notes on Startups, or How to Build The Future",
    image:
      "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Fimages%2Fzero-to-one.png?alt=media&token=0c64bbe6-4e9e-4a0e-adc9-9e218dd12402",
    duration: "03:24",
    rating: "4.3",
    premium: true,
    audio:
      "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Faudios%2Fzero-to-one.mp3?alt=media&token=29494cf2-2c9e-404a-bb76-c4fb2a23d8f2",
  },
  {
    id: "hyqzkhdyq7h",
    title: "Rich Dad, Poor Dad",
    author: "Robert T. Kiyosaki",
    subtitle:
      "What the Rich Teach Their Kids about Money – That the Poor and the Middle Class Do Not!",
    image:
      "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Fimages%2Frich-dad-poor-dad.png?alt=media&token=dc226e0c-fd89-4897-9605-9603e04a9966",
    duration: "05:38",
    rating: "4.5",
    premium: true,
    audio:
      "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Faudios%2Frich-dad-poor-dad.mp3?alt=media&token=e65e6fc1-b5c7-4aed-9715-07a96ec12db1",
  },
  {
    id: "vt4i7lvosz",
    title: "The 10X Rule",
    author: "Grant Cardone",
    subtitle: "The Only Difference Between Success and Failure",
    image:
      "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Fimages%2Fthe-10x-rule.png?alt=media&token=1e766af7-97ec-4bb8-969f-95ca35cf1d68",
    duration: "03:18",
    rating: "4",
    premium: true,
    audio:
      "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Faudios%2Fthe-10x-rule.mp3?alt=media&token=4638392a-ced3-4926-a8b3-1c7a4fbe520a",
  },
  {
    id: "g80xtszllo9",
    title: "Deep Work",
    author: "Cal Newport",
    subtitle: "Rules for Focused Success in a Distracted World",
    image:
      "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Fimages%2Fdeep-work.png?alt=media&token=3a857c13-f374-4c82-b134-fef5a01c202e",
    duration: "02:50",
    rating: "4.3",
    premium: true,
    audio:
      "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Faudios%2Fdeep-work.mp3?alt=media&token=f1749513-05ab-4733-8675-6073ba6ac5e9",
  },
  {
    id: "6ctat6ynzqp",
    title: "The 5 Second Rule",
    author: "Mel Robbins",
    subtitle:
      "Transform Your Life, Work, and Confidence with Everyday Courage",
    image:
      "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Fimages%2Fthe-five-second-rule.png?alt=media&token=8d6d24fd-11c8-425d-b7f0-3ae1499192db",
    duration: "02:45",
    rating: "4.3",
    premium: true,
    audio:
      "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Faudios%2Fthe-5-second-rule.mp3?alt=media&token=9a0e621a-c545-431f-8d19-052cc445844a",
  },
  {
    id: "pducrv7aiqr",
    title: "The 12 Week Year",
    author: "Brian P. Moran and Michael Lennington",
    subtitle: "Get More Done in 12 Weeks than Others Do in 12 months",
    image:
      "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Fimages%2Fthe-twelve-week-year.png?alt=media&token=e6c87df7-f57c-4026-b364-9ba05541b438",
    duration: "03:36",
    rating: "4.6",
    premium: true,
    audio:
      "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Faudios%2Fthe-12-week-year.mp3?alt=media&token=7542f2ee-eafe-44a7-9606-17f070d83af8",
  },
  {
    id: "vdb1ghfrlt",
    title: "Getting Things Done",
    author: "David Allen",
    subtitle: "The Art of Stress-Free Productivity",
    image:
      "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Fimages%2Fgetting-things-done.png?alt=media&token=b1d71920-25fd-4b8b-ad2b-7652f27b4cbc",
    duration: "02:24",
    rating: "4.3",
    premium: true,
    audio:
      "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Faudios%2Fgetting-things-done.mp3?alt=media&token=82466b53-7e16-4044-a79f-53bda67a39fe",
  },
];

export default function ForYouPage() {
  return (
    <div className="min-h-screen bg-white text-[#0f2a37]">
      <header className="sticky top-0 z-30 bg-white border-b border-zinc-200">
        <div className="mx-auto max-w-[980px] px-6 py-4 flex items-center gap-3">
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
        </div>
      </header>

      <main className="mx-auto max-w-[980px] px-6 py-8 space-y-10">
        <section>
          <h2 className="text-[22px] font-semibold text-[#0f2a37] mb-4">Selected just for you</h2>
          <Link href={`/book/${selected.id}`} className="block rounded-md bg-[#fdecc8] p-6">
            <div className="mb-4 text-[15px] text-[#0f2a37]">{selected.subtitle}</div>
            <div className="mb-4 h-px bg-[#e6cfa5]" />
            <div className="flex items-center gap-6">
              <div className="relative h-[140px] w-[140px] shrink-0">
                <Image src={selected.image} alt="book" fill sizes="140px" className="object-contain" />
              </div>
              <div className="flex-1">
                <div className="text-[18px] font-semibold leading-tight">{selected.title}</div>
                <div className="text-[14px] text-[#0f2a37]/70">{selected.author}</div>
                <div className="mt-3 flex items-center gap-2 text-[14px]">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
                    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                      <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
                    </svg>
                  </span>
                  <span className="text-[#0f2a37]/90">{selected.duration}</span>
                </div>
              </div>
            </div>
          </Link>
        </section>

        <section>
          <h2 className="text-[22px] font-semibold text-[#0f2a37]">Recommended For You</h2>
          <p className="mb-4 text-[14px] text-[#0f2a37]/60">We think you’ll like these</p>
          <div className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recommended.map((b) => (
              <Link key={b.id} href={`/book/${b.id}`} className="block">
                <div className="relative mb-2">
                  {b.premium && (
                    <span className="absolute -top-2 right-0 rounded-full bg-[#0f2a37]/10 px-2 py-0.5 text-[12px] text-[#0f2a37]">
                      Premium
                    </span>
                  )}
                  <div className="relative aspect-[3/4] w-full">
                    <Image
                      src={b.image}
                      alt="book"
                      fill
                      sizes="(min-width: 1280px) 220px, 33vw"
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="text-[16px] font-semibold leading-snug line-clamp-2">{b.title}</div>
                <div className="text-[13px] text-[#0f2a37]/70">{b.author}</div>
                {b.subtitle && <div className="mt-1 text-[13px] text-[#0f2a37]/80 line-clamp-2">{b.subtitle}</div>}
                <div className="mt-2 flex items-center gap-4 text-[13px] text-[#0f2a37]/70">
                  <span className="inline-flex items-center gap-1">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm1 5h-2v6h6v-2h-4z" />
                    </svg>
                    {b.duration}
                  </span>
                  {b.rating && (
                    <span className="inline-flex items-center gap-1">
                      <svg viewBox="0 0 1024 1024" width="14" height="14" fill="currentColor">
                        <path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z" />
                      </svg>
                      {b.rating}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-[22px] font-semibold text-[#0f2a37]">Suggested Books</h2>
          <p className="mb-4 text-[14px] text-[#0f2a37]/60">Browse those books</p>
          <div className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {suggested.map((b) => (
              <Link key={b.id} href={`/book/${b.id}`} className="block">
                <div className="relative mb-2">
                  {b.premium && (
                    <span className="absolute -top-2 right-0 rounded-full bg-[#0f2a37]/10 px-2 py-0.5 text-[12px] text-[#0f2a37]">
                      Premium
                    </span>
                  )}
                  <div className="relative aspect-[3/4] w-full">
                    <Image src={b.image} alt="book" fill className="object-contain" />
                  </div>
                </div>
                <div className="text-[16px] font-semibold leading-snug line-clamp-2">{b.title}</div>
                <div className="text-[13px] text-[#0f2a37]/70">{b.author}</div>
                {b.subtitle && <div className="mt-1 text-[13px] text-[#0f2a37]/80 line-clamp-2">{b.subtitle}</div>}
                <div className="mt-2 flex items-center gap-4 text-[13px] text-[#0f2a37]/70">
                  <span className="inline-flex items-center gap-1">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm1 5h-2v6h6v-2h-4z" />
                    </svg>
                    {b.duration}
                  </span>
                  {b.rating && (
                    <span className="inline-flex items-center gap-1">
                      <svg viewBox="0 0 1024 1024" width="14" height="14" fill="currentColor">
                        <path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z" />
                      </svg>
                      {b.rating}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
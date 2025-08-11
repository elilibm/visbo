"use client";

import Link from "next/link";

export default function HomePage() {
  const name = "Elili"; // replace with session/user data when wired up

  return (
    <div className="relative w-screen min-h-screen bg-white overflow-hidden">
      {/* LEFT BULB BACKGROUND (CSS bg like your mock) */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[60vw] max-w-[760px] -translate-x-10 z-0 hidden md:block"
        style={{
          backgroundImage: "url('/img/home-bulb.png')", // put your bulb asset in /public/img/
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "left center",
          opacity: 0.98
        }}
      />

      {/* LOGO — exactly same block and position as landing */}
      <div className="absolute top-6 left-6 z-50">
        <svg
          width="27"
          height="27"
          viewBox="0 0 46 43"
          fill="#BFF9FF"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path d="M22.5 43L3.01443 21.25L41.9856 21.25L22.5 43Z" />
          <path d="M22.7681 12.1316C22.7681 10.5384 22.478 8.96089 21.9142 7.48902C21.3504 6.01715 20.524 4.67978 19.4823 3.55325C18.4406 2.42673 17.2038 1.53313 15.8427 0.923461C14.4817 0.313792 13.0228 0 11.5496 0 10.0764 0 8.61754 0.313792 7.25645 0.923461 5.89535 1.53313 4.65863 2.42673 3.61689 3.55326 2.57515 4.67978 1.7488 6.01715 1.18502 7.48902 0.621231 8.96089 0.331055 10.5384 0.331055 12.1316L11.5496 12.1316H22.7681Z" />
          <path d="M45.2056 12.1316C45.2056 10.5384 44.9155 8.96089 44.3517 7.48902 43.7879 6.01715 42.9615 4.67978 41.9198 3.55325 40.8781 2.42673 39.6413 1.53313 38.2802 0.923461 36.9192 0.313792 35.4603 0 33.9871 0 32.5139 0 31.055 0.313792 29.6939 0.923461 28.3329 1.53313 27.0961 2.42673 26.0544 3.55326 25.0127 4.67978 24.1863 6.01715 23.6225 7.48902 23.0587 8.96089 22.7686 10.5384 22.7686 12.1316L33.9871 12.1316H45.2056Z" />
          <rect x="0.331055" y="11.8495" width="44.8742" height="4.7962" />
        </svg>
      </div>

      {/* CONTENT */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 md:px-10 pt-32 lg:pt-40">
        <div className="max-w-3xl">
          <h1 className="dmsans text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.02em]">
            Welcome back <span className="text-[#FF6021]">{name}</span>.
          </h1>
          <p className="dmsans mt-4 text-neutral-600 text-base md:text-lg">
            Ready to make your dreams a reality?
          </p>
        </div>

        {/* ACTION CARDS (same vibe as screenshot) */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl">
          <HomeCard
            href="/generate"
            title="Generate"
            subtitle="Create your vision instantly."
          />
          <HomeCard
            href="/boards"
            title="All Boards"
            subtitle="Where past, present and future meet."
          />
        </div>
      </section>
    </div>
  );
}

function HomeCard({
  href,
  title,
  subtitle
}: {
  href: string;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      href={href}
      className="group relative rounded-2xl bg-white p-6 border border-neutral-200/70 shadow-sm backdrop-blur
                 hover:border-neutral-300 hover:shadow-md transition will-change-transform"
    >
      <div className="flex items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="dmsans mt-1 text-xs text-neutral-500">{subtitle}</p>
        </div>
        <svg
          className="h-6 w-6 text-neutral-400 transition group-hover:translate-x-0.5 group-hover:text-neutral-800"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 12h12M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* subtle depth like your landing cards */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/70 to-white/30" />
    </Link>
  );
}

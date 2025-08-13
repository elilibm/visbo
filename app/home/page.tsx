"use client";

import Link from "next/link";

export default function HomePage() {
  const name = "Elili"; // replace with session/user data when wired up

  return (
    <div className="relative w-screen min-h-screen bg-white overflow-hidden">
      <div
  className="absolute inset-0 bg-no-repeat 
             sm:pt-[70%] sm:bg-[length:70%] sm:bg-[position:-20%_-5%]
             pt-[20%] bg-[length:110%] bg-center"
  style={{
    backgroundImage: "url('/img/light-bulb.png')"
  }}
></div>

      <div className="absolute top-6 left-6 z-50">
        <svg
          width="27"
          height="27"
          viewBox="0 0 46 43"
          fill="#FF6021"
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
     <div className="flex justify-center">
      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-[18%]">
  <div className="max-w-3xl">
    <h1 className="dmsans text-4xl font-bold tracking-[-0.02em]">
      Welcome back <span className="text-[#FF6021]">{name}</span>.
    </h1>
    <p className="dmsans mt-2 text-neutral-600 text-md font-light ">
      Ready to make your dreams a reality?
    </p>
  </div>

  {/* ACTION CARDS */}
  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-7 max-w-3xl">
    <HomeCard
      href="/step-2"
      title="Generate"
      subtitle="Create your vision instantly."
    />
    <HomeCard
      href="/step-2"
      title="All Boards"
      subtitle="Where past, present and future meet."
    />
  </div>
</section>
</div>

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
      className="group relative rounded-2xl bg-gradient-to-b from-white/70 to-[#F5F5F5] px-20 py-6"
      style={{
        borderWidth: "0.5px",                     
        borderStyle: "solid",              
        borderColor: "#D9D9D9" 
  }}
    >
      <div className="flex items-center justify-between gap-6">
        <div className="pt-[10%] -ml-14">
          <h3 className="text-lg font-normal text-black">{title}</h3>
          <p className="dmsans mt-0.5 text-xs text-neutral-500 font-light">{subtitle}</p>
        </div>
        
        <div className="absolute bottom-6 right-6 z-50">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M7 7h10m0 0v10m0-10L7 17" stroke-width="1"/>
            </svg>
          </div>
      </div>
       </Link>
  );
}

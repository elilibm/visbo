"use client";

import Image from "next/image";
import React from "react";
import Head from "next/head";
import Link from "next/link";

export default function home() {
    return (
      <section className="relative w-full h-screen overflow-hidden">
      <div className="absolute top-7 left-7 z-20">
        <Image src="/img/logo.svg" alt="Visbo Logo" width={37.2} height={33} />
      </div>

      {/* Gradient background div (assumed already styled with gradient) */}
      <div id="gradient-bg" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
        {/* Title */}
        <h1 className="text-center text-xl md:text-2xl font-medium mb-10">
          Start your vision right.<br/> Select one of the options below.
        </h1>

        {/* Cards */}
        <div className="flex flex-col md:flex-row gap-6">
          <Link
            href="/genie"
            className="text-base font-light border border-white rounded-lg p-6 w-72 text-center hover:bg-white/10 transition cursor-pointer"
          >
            <p>
              Not sure where to begin? <br /> Talk to our genie to figure out what you truly want.
            </p>
          </Link>

          <Link
            href="/vision-board"
            className="text-base font-light border border-white rounded-lg p-6 w-72 text-center hover:bg-white/10 transition cursor-pointer"
          >
            <p>
              Know exactly what you want? <br /> Let’s generate your vision board.
            </p>
          </Link>
        </div>
      </div>
</section>
    );
  }
  
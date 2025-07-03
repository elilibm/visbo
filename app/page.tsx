"use client";

import Image from "next/image";
import React from "react";
import Head from "next/head";
import { useEffect, useRef } from "react";
import Link from "next/link";



export default function HomePage() {
  return (
    <>
    <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <title>Visbo</title>
      </Head>

    <main className="flex flex-col">


      {/* HERO */}
      <section className="relative w-full h-screen overflow-hidden">
      <div className="absolute top-7 left-7 z-20">
  <Image src="/img/logo.svg" alt="Visbo Logo" width={37.2} height={33} />
</div>
<Link href="/home" className="login-link ">
  Log In
</Link>
        
      <div id="gradient-bg"/>
  <div className="hero-section relative z-10">
    <div className="hero-title">visbo</div>
    <p className="hero-subtitle">make all your dreams come true.</p>
    <button className="hero-button">Sign Up</button>
    <div className="down-arrow">
    <Image src="/img/down_arrow.svg" alt="Visbo Logo" width={25} height={14} />
    </div>
  </div>
</section>

      {/* ABOUT*/}
      <section id="how-it-works" className="how-it-works">
        <div className="how-title-container">
          <h2 className="how-title">Skip the hassle. Keep the magic.</h2>
          <p className="how-description">
            Vision boards shouldn't take hours to make or compromise your goals for aesthetics. With <a style={{ color: '#FF4F87', fontWeight: 'normal', textDecoration: 'none' }}>visbo</a>, create a beautifully natural, personalized vision board in just minutes. No stress, no compromises.
          </p>
        </div>
        <div className="vision-bar">
          <h2 className="vision-title">
            why vision boards work.
          </h2>
          <button className="vision-button">
            benefits
          </button>
        </div>
      </section>
{/* INFOOO */}
      <section className="landing-section container mx-auto px-[15%] py-[5%] space-y-30">
        <div className="step-row gap-x-[20%]">
          <div className="step-text">
            <h2 className="step-title">set your intentions.</h2>
            <p className="step-description">
              Add your goals to a list. Be descriptive. The more specific the vision, the more likely it will come true. Add your descriptive visions to the list.
            </p>
          </div>
          <img src="/img/landing_1.svg" alt="Write Icon" className="step-image" />
        </div>
        <div className="step-row reverse gap-x-[30%]">
          <div className="step-text">
            <h2 className="step-title">
              use the genie.<br /> it’s genie–us.
            </h2>
            <p className="step-description">
              Use the assistive chat genie to help you describe your goals. Simply type in your goal and prompt for more detail or clarifying questions.
            </p>
          </div>
          <img src="/img/landing_2.svg" alt="Genie Icon" className="step-image" />
        </div>
        <div className="step-row gap-x-[20%]">
          <div className="step-text">
            <h2 className="step-title">see your vision<br />come to life.</h2>
            <p className="step-description">
              Click generate and watch your vision come to life. To edit any specific image, tweak your description and regenerate until you get the board you like :)
            </p>
          </div>
          <img src="/img/landing_3.svg" alt="Layout Icon" className="step-image" />
        </div>
      </section>

    </main>
    </>
  );
}

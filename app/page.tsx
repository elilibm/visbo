"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import React from "react";
import AuthButtons from "../components/AuthButtons";

const images = Array.from({ length: 9 }, (_, i) => `image-${i}`);

export default function LandingZoomAnimation() {
  const [mounted, setMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const centerImageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const authButtonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;

    const container = containerRef.current;
    const allImages = gsap.utils.toArray(".image") as HTMLElement[];
    const centerImage = centerImageRef.current;
    const text = textRef.current;
    const logo = logoRef.current;
    const authButtons = authButtonsRef.current;

    const columns: HTMLElement[][] = [[], [], []];
    allImages.forEach((img, i) => {
      columns[i % 3].push(img);
    });

    gsap.set(columns[0], { y: -30 });
    gsap.set(columns[1], { y: 20 });
    gsap.set(columns[2], { y: -20 });

    gsap.to([columns[0], columns[1], columns[2]], {
      y: 0,
      duration: 1.2,
      ease: "power2.out",
      delay: 0.2
    });

    gsap.delayedCall(1.5, () => {
      if (!container || !centerImage) return;

      const rect = centerImage.getBoundingClientRect();
      const scaleX = window.innerWidth / rect.width;
      const scaleY = window.innerHeight / rect.height;
      const scaleFactor = Math.max(scaleX, scaleY) * 1.05;

      const xOffset = window.innerWidth / 2 - (rect.left + rect.width / 2);
      const yOffset = window.innerHeight / 2 - (rect.top + rect.height / 2);

      gsap.to(container, {
        scale: scaleFactor,
        x: xOffset,
        y: yOffset,
        transformOrigin: "center center",
        duration: 3,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.to([text, logo, authButtons], {
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: "power2.out"
          });
        }
      });
    });
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="w-screen h-screen bg-white overflow-hidden relative">
      <div
        ref={containerRef}
        className="grid grid-cols-3 grid-rows-3 absolute top-0 left-0 w-full h-full"
      >
        {images.map((id, idx) => {
          const isLastCol = idx % 3 === 2;
          const isLastRow = idx >= 6;
          const borders =
            `${!isLastCol ? "border-r-[4px]" : ""} ` +
            `${!isLastRow ? "border-b-[4px]" : ""} border-white`;

        return (
          <div
            key={idx}
            className={`image w-full h-full bg-white flex items-center justify-center overflow-hidden ${borders}`}
            ref={idx === 4 ? centerImageRef : null}
            style={{ boxSizing: "border-box" }}
          >
            <img
              src={idx === 4 ? "/img/langingaltbg.jpg" : `/img/${id}.jpg`}
              alt={id}
              className="w-full h-full object-cover"
            />
          </div>
        );
        })}
      </div>

      {/* Center text */}
      <div
        ref={textRef}
        className="dmsans absolute top-[28%] left-1/2 -translate-x-1/2 text-center text-[#BFF9FF] opacity-0 translate-y-4"
      >
        <h1 className="text-6xl font-bold mb-4">visbo</h1>
        <p className="dmsans font-light text-lg">The ultimate tool for creating vision boards.</p>
        <p className="text-lg font-light">Set your sights high.</p>
      </div>

      {/* Logo */}
      <div
        ref={logoRef}
        className="absolute top-6 left-6 z-50 opacity-0 translate-y-4"
      >
        {/* svg unchanged */}
        <svg width="27" height="27" viewBox="0 0 46 43" fill="#BFF9FF" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M22.5 43L3.01443 21.25L41.9856 21.25L22.5 43Z" />
          <path d="M22.7681 12.1316C22.7681 10.5384 22.478 8.96089 21.9142 7.48902C21.3504 6.01715 20.524 4.67978 19.4823 3.55325C18.4406 2.42673 17.2038 1.53313 15.8427 0.923461C14.4817 0.313792 13.0228 0 11.5496 0 10.0764 0 8.61754 0.313792 7.25645 0.923461 5.89535 1.53313 4.65863 2.42673 3.61689 3.55326 2.57515 4.67978 1.7488 6.01715 1.18502 7.48902 0.621231 8.96089 0.331055 10.5384 0.331055 12.1316L11.5496 12.1316H22.7681Z" />
          <path d="M45.2056 12.1316C45.2056 10.5384 44.9155 8.96089 44.3517 7.48902 43.7879 6.01715 42.9615 4.67978 41.9198 3.55325 40.8781 2.42673 39.6413 1.53313 38.2802 0.923461 36.9192 0.313792 35.4603 0 33.9871 0 32.5139 0 31.055 0.313792 29.6939 0.923461 28.3329 1.53313 27.0961 2.42673 26.0544 3.55326 25.0127 4.67978 24.1863 6.01715 23.6225 7.48902 23.0587 8.96089 22.7686 10.5384 22.7686 12.1316L33.9871 12.1316H45.2056Z" />
          <rect x="0.331055" y="11.8495" width="44.8742" height="4.7962" />
        </svg>
      </div>

      {/* Auth buttons — keep only this block */}
      <div
        ref={authButtonsRef}
        className="absolute top-6 right-7 z-50 flex items-center space-x-5 font-dmsans opacity-0 translate-y-4"
      >
        <AuthButtons />
      </div>
    </div>
  );
}

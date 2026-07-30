"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

const HERO_IMAGES = [
  { id: "rolls-royce", alt: "Rolls-Royce Collection", img: "/images/hero-banner.png" },
  { id: "bmw",         alt: "BMW M-Series Collection", img: "/images/hero-banner-bmw.png" },
  { id: "porsche",     alt: "Porsche GT3 Collection",  img: "/images/hero-banner-porsche.png" },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate background car images every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full overflow-hidden h-[calc(100dvh-102px)] min-h-[540px] md:h-[calc(100vh-102px)] md:min-h-[620px] bg-[#0c0c0c]">

      {/* Background Image Carousel (Smooth Cross-fade) */}
      {HERO_IMAGES.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? "opacity-100 z-0" : "opacity-0 -z-10"
          }`}
        >
          <Image
            src={slide.img}
            alt={slide.alt}
            fill
            priority={idx === 0}
            className="object-cover object-[72%_center] sm:object-center"
            style={{ filter: "brightness(0.62)" }}
          />
        </div>
      ))}

      {/* Gradients */}
      <div className="hero-overlay" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c]/85 via-transparent to-[#0c0c0c]/90 pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 md:px-16 max-w-[680px] py-8">

        {/* Text Container */}
        <div>

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-3 sm:mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block animate-pulse" />
            <span className="text-[11px] sm:text-[13px] font-extrabold tracking-[0.22em] uppercase text-accent font-pally">
              Premium Diecast · RC Toys · 3D Frames
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-[38px] xs:text-[42px] sm:text-[58px] md:text-[70px] font-black leading-[1.04] sm:leading-none uppercase text-white mb-3 sm:mb-6 font-pally drop-shadow">
            Collect<br />
            <span className="text-accent">What You</span><br />
            Love
          </h1>

          {/* Subtitle */}
          <p className="text-[13px] sm:text-[15px] text-white/85 leading-relaxed mb-6 sm:mb-8 max-w-[360px] sm:max-w-[420px] font-pally">
            India's finest 1:18, 1:24 &amp; 1:32 scale diecast models, RC toys,
            and wall-mounted 3D display frames.
          </p>

          {/* CTA Button */}
          <div>
            <Link
              href="/products"
              className="inline-flex items-center justify-center bg-accent text-dark font-extrabold text-[12px] sm:text-[13px] tracking-wider uppercase px-7 sm:px-9 py-3.5 sm:py-4 rounded-lg no-underline font-pally shadow-[0_4px_24px_rgba(200,169,110,0.45)] hover:bg-accent-lt transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>

      </div>

      {/* Dead Center Scroll Indicator */}
      <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 opacity-85 hover:opacity-100 transition-opacity pointer-events-none">
        <span className="text-[9.5px] sm:text-[10px] font-bold tracking-[0.22em] uppercase text-white/70 font-pally whitespace-nowrap">
          Scroll To Explore
        </span>
        <ChevronDown size={16} className="text-accent animate-bounce" />
      </div>

    </section>
  );
}

"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function Hero() {

  return (
    <section className="relative w-full overflow-hidden h-dvh min-h-[640px] md:h-screen md:min-h-[720px] bg-[#0c0c0c] -mt-[102px]">
      {/* Scoped Inline Font strictly for Hero Headline */}
      <style>{`
        @font-face {
          font-family: 'PallyHero';
          src: url('https://cdn.fontshare.com/wf/V5WYWD27XO3LMOQ4EG2MQK4FRPTA5QJ2/ISQNWVNKUKTQCSPRHYNOUSUBYEKTLRCT/T66H3U7F4BLCEXDVQJD4H2MBK7CL3FOD.woff2') format('woff2');
          font-weight: 700;
          font-display: swap;
        }
      `}</style>

      {/* Background Cinematic Video Loop */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        src="/videos/hero-cinematic.mp4"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      />

      {/* Subtle Side Gradient for Text Legibility (No heavy black layer over video) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 md:px-16 max-w-[680px] pt-[102px] pb-8">

        {/* Text Container */}
        <div>

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-3 sm:mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block animate-pulse" />
            <span className="text-[11px] sm:text-[13px] font-extrabold tracking-[0.22em] uppercase text-accent">
              Premium Diecast · RC Toys · 3D Frames
            </span>
          </div>

          {/* Headline — Inline Pally Font Only Here */}
          <h1
            style={{ fontFamily: "'PallyHero', sans-serif" }}
            className="text-[38px] xs:text-[42px] sm:text-[58px] md:text-[70px] font-black leading-[1.04] sm:leading-none uppercase text-white mb-3 sm:mb-6 drop-shadow"
          >
            Collect<br />
            <span className="text-accent">What You</span><br />
            Love
          </h1>

          {/* Subtitle */}
          <p className="text-[13px] sm:text-[15px] text-white/85 leading-relaxed mb-6 sm:mb-8 max-w-[360px] sm:max-w-[420px]">
            India's finest 1:18, 1:24 &amp; 1:32 scale diecast models, RC toys,
            and wall-mounted 3D display frames.
          </p>

          {/* CTA Button */}
          <div>
            <Link
              href="/products"
              className="inline-flex items-center justify-center bg-accent text-dark font-extrabold text-[12px] sm:text-[13px] tracking-wider uppercase px-7 sm:px-9 py-3.5 sm:py-4 rounded-lg no-underline shadow-[0_4px_24px_rgba(200,169,110,0.45)] hover:bg-accent-lt transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>

      </div>

      {/* Dead Center Scroll Indicator */}
      <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 opacity-85 hover:opacity-100 transition-opacity pointer-events-none">
        <span className="text-[9.5px] sm:text-[10px] font-bold tracking-[0.22em] uppercase text-white/70 whitespace-nowrap">
          Scroll To Explore
        </span>
        <ChevronDown size={16} className="text-accent animate-bounce" />
      </div>

    </section>
  );
}

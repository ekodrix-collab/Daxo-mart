import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden h-[calc(100vh-102px)] min-h-[calc(100vh-102px)] bg-[#0c0c0c]">

      {/* Background Image */}
      <Image
        src="/images/hero-banner.png"
        alt="DAXOMART premium diecast collection"
        fill
        priority
        className="object-cover object-center"
        style={{ filter: "brightness(0.55)" }}
      />

      {/* Strong left gradient */}
      <div className="hero-overlay" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 md:px-16 max-w-[680px] py-8">

        {/* Eyebrow */}
        <span className="text-[11px] sm:text-[13px] font-extrabold tracking-[0.24em] uppercase text-accent mb-3 sm:mb-4 block font-pally">
          Premium Diecast · RC Toys · 3D Frames
        </span>

        {/* Headline */}
        <h1 className="text-[44px] sm:text-[60px] md:text-[72px] font-black leading-none uppercase text-white mb-4 sm:mb-6 font-pally">
          Collect<br />
          <span className="text-accent">What You</span><br />
          Love
        </h1>

        {/* Sub */}
        <p className="text-[14px] sm:text-[15px] text-white/80 leading-relaxed mb-6 sm:mb-8 max-w-[420px] font-pally">
          India's finest 1:18, 1:24 &amp; 1:32 scale diecast models, RC toys,
          and wall-mounted 3D display frames.
        </p>

        {/* CTAs */}
        <div className="flex gap-3 flex-wrap">
          <Link
            href="/products"
            className="inline-flex items-center justify-center bg-accent text-dark font-extrabold text-[12px] sm:text-[13px] tracking-wider uppercase px-7 sm:px-9 py-4 rounded-lg no-underline font-pally shadow-[0_4px_24px_rgba(200,169,110,0.4)] hover:bg-accent-lt transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Animated Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/60 font-pally">
          Scroll To Explore
        </span>
        <ChevronDown size={18} className="text-accent animate-bounce" />
      </div>
    </section>
  );
}

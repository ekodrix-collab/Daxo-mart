import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden min-h-[500px] h-[75vh] max-h-[650px]">

      {/* Background */}
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
      <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 md:px-16 max-w-[640px]">

        {/* Eyebrow */}
        <span className="text-[11px] sm:text-[12px] font-extrabold tracking-[0.24em] uppercase text-accent mb-3 sm:mb-4 block font-pally">
          Premium Diecast · RC Toys · 3D Frames
        </span>

        {/* Headline */}
        <h1 className="text-[40px] sm:text-[56px] md:text-[66px] font-black leading-none uppercase text-white mb-4 sm:mb-6 font-pally">
          Collect<br />
          <span className="text-accent">What You</span><br />
          Love
        </h1>

        {/* Sub */}
        <p className="text-[14px] sm:text-[13px] text-white/80 leading-relaxed mb-6 sm:mb-8 max-w-[380px] font-pally">
          India's finest 1:18, 1:24 &amp; 1:32 scale diecast models, RC toys,
          and wall-mounted 3D display frames.
        </p>

        {/* Offer pills */}
        {/* <div className="flex gap-2.5 mb-6 sm:mb-8 flex-wrap">
          <span className="bg-accent/20 border border-accent/50 text-accent text-[11px] sm:text-[12px] font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-full font-pally">
            4% off first order
          </span>
          <span className="bg-white/10 border border-white/20 text-white/70 text-[11px] sm:text-[12px] font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-full font-pally">
            Free delivery Available
          </span>
        </div> */}

        {/* CTAs */}
        <div className="flex gap-3 flex-wrap">
          <Link
            href="/products"
            className="inline-flex items-center justify-center bg-accent text-dark font-extrabold text-[12px] sm:text-[13px] tracking-wider uppercase px-6 sm:px-8 py-3.5 rounded-lg no-underline font-pally shadow-[0_4px_24px_rgba(200,169,110,0.4)] hover:bg-accent-lt transition-colors"
          >
            Shop Now
          </Link>
          {/* <Link
            href="/products"
            className="inline-flex items-center justify-center border-2 border-white/35 text-white font-extrabold text-[12px] sm:text-[13px] tracking-wider uppercase px-6 sm:px-8 py-3.5 rounded-lg no-underline font-pally hover:border-accent hover:text-accent transition-colors"
          >
            1:24 Collection
          </Link> */}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
    </section>
  );
}

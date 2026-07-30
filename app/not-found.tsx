import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Search, Home, Car, ShieldAlert, Sparkles, RefreshCw } from "lucide-react";

export const metadata = {
  title: "404 - Page Not Found | DAXOMART",
  description: "The diecast model or page you are looking for has taken a detour.",
};

export default function NotFound() {
  return (
    <div className="min-h-[85vh] bg-[#0c0c0c] text-cream font-pally flex items-center justify-center py-16 px-4 relative overflow-hidden">

      {/* Radial background ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full text-center relative z-10">

        {/* 404 Badge with Car Icon */}
        <div className="inline-flex items-center gap-2 bg-dark2 border border-accent/40 rounded-full px-5 py-2 mb-6 shadow-xl animate-pulse">
          <Car className="w-4 h-4 text-accent" />
          <span className="text-xs font-black uppercase tracking-[0.25em] text-accent">
            404 • PIT STOP ERROR
          </span>
        </div>

        {/* Big Glowing 404 Text */}
        <h1 className="text-7xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-cream to-accent/40 tracking-tight font-pally leading-none mb-2 drop-shadow-2xl">
          404
        </h1>

        {/* Headline */}
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white font-pally mb-4">
          Lost Off The Racetrack!
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base text-muted max-w-md mx-auto leading-relaxed mb-8">
          The diecast scale model or page you were looking for has taken a wrong turn or moved to another garage track.
        </p>

        {/* Quick Action Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-accent hover:bg-accent-lt text-dark font-extrabold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl no-underline transition-all shadow-[0_4px_25px_rgba(200,169,110,0.3)] hover:scale-105"
          >
            <Home size={16} /> Return To Home
          </Link>

          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-dark2 hover:bg-dark3 border border-border hover:border-accent/60 text-white font-extrabold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl no-underline transition-all hover:scale-105"
          >
            <Car size={16} /> Explore All Diecast
          </Link>
        </div>

        {/* Popular Categories Links Bar */}
        <div className="bg-dark2/80 border border-border/80 rounded-2xl p-6 backdrop-blur-md">
          <p className="text-xs font-bold uppercase tracking-widest text-muted mb-4">
            Or Jump Directly To Popular Collections:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <Link
              href="/products?category=1%3A24"
              className="text-xs font-semibold text-gray-300 hover:text-accent bg-[#18181A] hover:bg-[#222226] border border-[#2A2A2E] px-4 py-2 rounded-lg transition-colors no-underline"
            >
              🚗 1:24 Scale Diecast
            </Link>
            <Link
              href="/products?category=1%3A18"
              className="text-xs font-semibold text-gray-300 hover:text-accent bg-[#18181A] hover:bg-[#222226] border border-[#2A2A2E] px-4 py-2 rounded-lg transition-colors no-underline"
            >
              🏎️ 1:18 Scale Diecast
            </Link>
            <Link
              href="/products?category=RC"
              className="text-xs font-semibold text-gray-300 hover:text-accent bg-[#18181A] hover:bg-[#222226] border border-[#2A2A2E] px-4 py-2 rounded-lg transition-colors no-underline"
            >
              🎮 RC Toys
            </Link>
            <Link
              href="/products?category=Frame"
              className="text-xs font-semibold text-gray-300 hover:text-accent bg-[#18181A] hover:bg-[#222226] border border-[#2A2A2E] px-4 py-2 rounded-lg transition-colors no-underline"
            >
              🖼️ 3D Car Frames
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

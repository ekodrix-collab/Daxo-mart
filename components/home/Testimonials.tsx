"use client";

import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface ReviewItem {
  id: string;
  name: string;
  init: string;
  bg: string;
  stars: number;
  text: string;
}

const REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    name: "Saurav J.",
    init: "SJ",
    bg: "#c8a96e",
    stars: 5,
    text: "Absolute quality! The 1:24 Range Rover arrived perfectly packed. The detail is insane — looks exactly like the real thing on my shelf.",
  },
  {
    id: "rev-2",
    name: "Fatima R.",
    init: "FR",
    bg: "#7a9ecb",
    stars: 5,
    text: "Ordered the Rolls Royce Phantom for my brother's birthday. He was blown away. Fast delivery and premium packaging.",
  },
  {
    id: "rev-3",
    name: "Arjun M.",
    init: "AM",
    bg: "#7acb8a",
    stars: 5,
    text: "The RC car set is a huge hit with my kids. Great build quality, runs smooth. DaxoMart knows their toys!",
  },
  {
    id: "rev-4",
    name: "Priya L.",
    init: "PL",
    bg: "#cb7a8a",
    stars: 4,
    text: "The 3D display frame makes my collection look like a museum piece. Will definitely be ordering more.",
  },
  {
    id: "rev-5",
    name: "Vikram S.",
    init: "VS",
    bg: "#e28743",
    stars: 5,
    text: "The 1:18 Lamborghini Sian diecast is breathtaking. Opening doors, engine detail, heavy metal body — pure perfection!",
  },
  {
    id: "rev-6",
    name: "Ananya K.",
    init: "AK",
    bg: "#9b59b6",
    stars: 5,
    text: "Ordered the Classic Mustang for my desk. Lightning-fast shipping and the item looks even better in person.",
  },
];

const TestimonialCard = memo(function TestimonialCard({
  review,
}: {
  review: ReviewItem;
}) {
  return (
    <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 shrink-0 px-2">
      <div className="bg-white rounded-xl p-6 px-10 sm:px-6 flex flex-col gap-4  min-h-[180px] justify-between h-full transition-transform hover:-translate-y-0.5 duration-200 shadow">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-[15px] shrink-0"
            style={{ background: review.bg }}
          >
            {review.init}
          </div>
          <div>
            <p className="text-[14px] font-bold text-black">{review.name}</p>
            <div
              className="flex gap-0.5 mt-0.5"
              aria-label={`${review.stars} out of 5 stars`}
            >
              {Array.from({ length: review.stars }).map((_, j) => (
                <span key={j} className="text-star text-[13px]">
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
        <p className="text-[13px] text-black leading-relaxed pa">
          "{review.text}"
        </p>
      </div>
    </div>
  );
});

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number>(0);

  // SSR-safe responsive card counting
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w >= 1280) setVisibleCards(4);
      else if (w >= 1024) setVisibleCards(3);
      else if (w >= 640) setVisibleCards(2);
      else setVisibleCards(1);
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, REVIEWS.length - visibleCards);

  // Ensure index stays in valid range when window resizes
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [currentIndex, maxIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto-advance slider timer
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(handleNext, 3500);
    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  // Touch Swipe Gesture Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) handleNext();
      else handlePrev();
    }
    setIsPaused(false);
  };

  return (
    <section
      className="bg-white py-16"
      aria-label="Customer Testimonials"
    >
      <div className="max-w-[1280px] mx-auto px-2 sm:px-3">
        {/* Header Section */}
        <div className="text-center mb-10">
          <p className="text-[12px] font-bold tracking-[0.22em] uppercase text-accent mb-2">
            DAXOMART
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-[0.05em] text-dark">
            Hear From Our Happy Customers
          </h2>
        </div>

        {/* Carousel Container */}
        <div
          className="relative px-2 sm:px-5"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Navigation Control - Previous (Positioned outside cards) */}
          <button
            onClick={handlePrev}
            aria-label="Previous testimonial"
            className="absolute left-0 sm:left-1 top-1/2 -translate-y-1/2 bg-dark/90 hover:bg-dark text-cream border border-border/80 rounded-full p-2.5 shadow-xl active:scale-90 transition-all z-10 backdrop-blur-md cursor-pointer hover:border-accent"
          >
            <ChevronLeft className="w-5 h-5 text-accent" />
          </button>

          {/* Track Frame */}
          <div className="overflow-hidden rounded-xl py-1">
            {/* Sliding Track */}
            <div
              className="flex transition-transform duration-500 ease-in-out will-change-transform"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
              }}
            >
              {REVIEWS.map((review) => (
                <TestimonialCard key={review.id} review={review} />
              ))}
            </div>
          </div>

          {/* Navigation Control - Next (Positioned outside cards) */}
          <button
            onClick={handleNext}
            aria-label="Next testimonial"
            className="absolute right-0 sm:right-1 top-1/2 -translate-y-1/2 bg-dark/90 hover:bg-dark text-cream border border-border/80 rounded-full p-2.5 shadow-xl active:scale-90 transition-all z-10 backdrop-blur-md cursor-pointer hover:border-accent"
          >
            <ChevronRight className="w-5 h-5 text-accent" />
          </button>
        </div>
      </div>
    </section>
  );
}

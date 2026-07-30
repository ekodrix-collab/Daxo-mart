"use client";

import { useState, useRef, useEffect } from "react";

interface ProductVideoFloatingProps {
  videoUrl?: string | null;
  productName?: string;
}

export default function ProductVideoFloating({
  videoUrl,
  productName = "Product Reel",
}: ProductVideoFloatingProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const miniVideoRef = useRef<HTMLVideoElement | null>(null);
  const fullVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (miniVideoRef.current) {
      miniVideoRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
    }
  }, [videoUrl]);

  useEffect(() => {
    if (isFullscreen && fullVideoRef.current) {
      fullVideoRef.current.play().catch(() => {});
    }
  }, [isFullscreen]);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  if (!videoUrl || isDismissed) return null;

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted((prev) => !prev);
  };

  const togglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fullVideoRef.current) {
      if (isPlaying) {
        fullVideoRef.current.pause();
        setIsPlaying(false);
      } else {
        fullVideoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <>
      {/* ── FLOATING MINI BUBBLE (Bottom-Right) ── */}
      {!isFullscreen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div
            onClick={() => setIsFullscreen(true)}
            className="group relative w-28 h-44 sm:w-32 sm:h-52 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/30 bg-black cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-red-500/20 active:scale-95"
          >
            {/* Auto-playing muted video preview */}
            <video
              ref={miniVideoRef}
              src={videoUrl}
              autoPlay
              muted={isMuted}
              loop
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Top Bar inside Mini Bubble */}
            <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-20">
              {/* Sound Toggle Button */}
              <button
                type="button"
                onClick={toggleSound}
                className="w-7 h-7 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                title={isMuted ? "Unmute Sound" : "Mute Sound"}
              >
                {isMuted ? (
                  <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </button>

              {/* Close (X) Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDismissed(true);
                }}
                className="w-7 h-7 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg hover:scale-110 active:scale-95"
                title="Dismiss Video"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Bottom Watch Badge */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center z-10 px-2">
              <span className="bg-black/75 hover:bg-red-600 text-white text-[11px] font-semibold px-3 py-1 rounded-full backdrop-blur-md border border-white/20 flex items-center gap-1.5 shadow-lg transition-colors">
                <svg className="w-3 h-3 fill-current text-red-500 group-hover:text-white" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── FULLSCREEN PORTRAIT REEL MODAL ── */}
      {isFullscreen && (
        <div
          onClick={() => setIsFullscreen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-8 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[340px] sm:max-w-[380px] h-[70vh] max-h-[600px] sm:h-[600px] rounded-3xl overflow-hidden bg-black border border-white/15 shadow-2xl flex flex-col justify-between my-auto"
          >
            {/* Fullscreen Video Player */}
            <div
              onClick={togglePlayPause}
              className="relative w-full h-full cursor-pointer group"
            >
              <video
                ref={fullVideoRef}
                src={videoUrl}
                autoPlay
                muted={isMuted}
                loop
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Pause Indicator overlay on hover/pause */}
              {!isPlaying && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                    <svg className="w-8 h-8 fill-current translate-x-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Top Controls Overlay inside Fullscreen */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                <div className="flex items-center gap-2">
                  {/* Sound Toggle Button */}
                  <button
                    type="button"
                    onClick={toggleSound}
                    className="h-10 px-3 rounded-full bg-black/60 hover:bg-black text-white text-xs font-medium flex items-center gap-1.5 backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                  >
                    {isMuted ? (
                      <>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                        </svg>
                        Unmute
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                        Mute
                      </>
                    )}
                  </button>
                </div>

                {/* Close (X) Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFullscreen(false);
                  }}
                  className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-lg cursor-pointer hover:scale-105 active:scale-95"
                  title="Close Fullscreen"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

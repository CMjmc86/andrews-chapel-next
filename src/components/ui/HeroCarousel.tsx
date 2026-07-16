"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Placeholder slides — swap `image` for a real photo URL later.
// Each slide currently renders as a labeled gradient so it's obvious
// where real photography needs to be dropped in.
const slides = [
  { label: "Our Church Home", gradient: "radial-gradient(ellipse at 30% 30%, #1A5FE0 0%, #000D26 70%)", image: "/images/hero/church.png" },
  { label: "Pastor Kathy Grace", gradient: "radial-gradient(ellipse at 70% 40%, #B8860B 0%, #000D26 70%)", image: "/images/hero/pastor.png" },
  { label: "Community Outreach", gradient: "radial-gradient(ellipse at 40% 60%, #0047CC 0%, #000D26 70%)", image: "/images/hero/giftbags.jpg" },
  { label: "Community Outreach", gradient: "radial-gradient(ellipse at 60% 30%, #D4AF37 0%, #000D26 70%)", image: "/images/hero/giftbags2.jpg" },
  { label: "Youth Ministry", gradient: "radial-gradient(ellipse at 50% 50%, #1A5FE0 0%, #001A5C 60%, #000D26 100%)", image: null },
];

const AUTO_ROTATE_MS = 5000;

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((index: number) => {
    setCurrent(((index % slides.length) + slides.length) % slides.length);
  }, []);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, AUTO_ROTATE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused]);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: i === current ? 1 : 0,
            background: slide.image ? undefined : slide.gradient,
            backgroundImage: slide.image ? `url(${slide.image})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden={i !== current}
        >
          {/* Placeholder label — remove this div once real photos are added */}
          {!slide.image && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white/10 font-serif text-2xl sm:text-3xl uppercase tracking-[0.3em]">
                {slide.label}
              </span>
            </div>
          )}
        </div>
      ))}

      {/* Dark overlay so hero text stays readable over any photo */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(0,13,38,0.55) 0%, rgba(0,13,38,0.75) 100%)" }}
      />

      {/* Manual arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-colors"
        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(212,175,55,0.3)" }}
      >
        <ChevronLeft className="w-5 h-5 text-[#D4AF37]" />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-colors"
        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(212,175,55,0.3)" }}
      >
        <ChevronRight className="w-5 h-5 text-[#D4AF37]" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="rounded-full transition-all"
            style={{
              width: i === current ? "24px" : "8px",
              height: "8px",
              background: i === current ? "#D4AF37" : "rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

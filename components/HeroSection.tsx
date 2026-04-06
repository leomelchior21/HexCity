"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import HexBackground from "./HexBackground";

const TIMELINE = [
  { m: "FEB", label: "Basics",      status: "done"     },
  { m: "MAR", label: "Advanced",    status: "done"     },
  { m: "APR", label: "Ideation",    status: "current"  },
  { m: "MAY", label: "Prototyping", status: "upcoming" },
  { m: "JUN", label: "Testing",     status: "upcoming" },
  { m: "JUL", label: "Break",       status: "vacation" },
  { m: "AUG", label: "Finale",      status: "upcoming" },
];

export default function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
    const handleMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      <HexBackground />

      {/* Morphing gradient orb behind logo */}
      <div
        className="absolute top-1/2 left-1/2 pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 600,
          height: 600,
          background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, rgba(6,182,212,0.06) 40%, transparent 70%)",
          filter: "blur(60px)",
          transform: `translate(calc(-50% + ${mousePos.x * -20}px), calc(-50% + ${mousePos.y * -20}px))`,
          transition: "transform 0.15s ease-out",
        }}
        aria-hidden
      />

      {/* Secondary orb */}
      <div
        className="absolute top-1/3 left-1/3 pointer-events-none"
        style={{
          width: 400,
          height: 400,
          background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "morphBlob 10s ease-in-out infinite",
        }}
        aria-hidden
      />

      {/* Radial depth vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
        }}
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #000000)" }}
      />

      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center text-center px-8"
        style={{
          transform: `perspective(1000px) rotateX(${mousePos.y * -1.5}deg) rotateY(${mousePos.x * 1.5}deg)`,
          transition: "transform 0.15s ease-out",
        }}
      >

        {/* Logo */}
        <div className="logo-reveal relative">
          <div
            className="absolute inset-0 -z-10 rounded-full"
            style={{
              transform: "scale(1.5)",
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.98) 20%, rgba(0,0,0,0.8) 55%, transparent 100%)",
              filter: "blur(28px)",
            }}
          />
          <Image
            src="/hexcity-logo-white.svg"
            alt="HEXCITY"
            width={480}
            height={146}
            priority
            className="w-[280px] sm:w-[380px] md:w-[480px] h-auto"
            style={{
              filter:
                "drop-shadow(0 0 60px rgba(255,255,255,0.15)) drop-shadow(0 0 120px rgba(0,0,0,0.98))",
            }}
          />
        </div>

        {/* Tagline with glow */}
        <div className="relative mt-6">
          <p
            className="timeline-reveal text-[13px] tracking-[0.35em] uppercase font-mono"
            style={{ color: "rgba(255,255,255,0.28)", animationDelay: "0.6s" }}
          >
            Build a Smart City · Think in Systems
          </p>
          <div
            className="absolute -inset-x-8 -inset-y-2 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(ellipse, rgba(124,58,237,0.06) 0%, transparent 70%)",
              filter: "blur(20px)",
            }}
          />
        </div>

        {/* Liquid Glass Timeline */}
        <div className="mt-12 timeline-reveal" style={{ animationDelay: "0.9s" }}>
          <div
            className="relative rounded-2xl px-6 py-5"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(28px) saturate(180%)",
              WebkitBackdropFilter: "blur(28px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.09)",
              boxShadow:
                "0 1px 0 0 rgba(255,255,255,0.10) inset, 0 -1px 0 0 rgba(0,0,0,0.5) inset, 0 16px 48px rgba(0,0,0,0.7), 0 4px 16px rgba(0,0,0,0.5)",
            }}
          >
            {/* Top specular highlight */}
            <div
              className="absolute top-0 left-4 right-4 h-px rounded-full"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)" }}
            />

            <div className="flex items-start gap-0">
              {TIMELINE.map((item, i) => (
                <TimelineItem key={item.m} item={item} index={i} total={TIMELINE.length} />
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Scroll cue with magnetic pull */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 scroll-cue cursor-pointer group"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
      >
        <span
          className="text-[10px] tracking-[0.4em] uppercase font-mono group-hover:text-white/60 transition-colors"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          scroll
        </span>
        <svg width="1" height="36" viewBox="0 0 1 36" fill="none" className="group-hover:opacity-80 transition-opacity">
          <line x1="0.5" y1="0" x2="0.5" y2="36" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        </svg>
      </div>
    </section>
  );
}

function TimelineItem({
  item,
  index,
  total,
}: {
  item: (typeof TIMELINE)[0];
  index: number;
  total: number;
}) {
  const isDone     = item.status === "done";
  const isCurrent  = item.status === "current";
  const isVacation = item.status === "vacation";
  const isLast     = index === total - 1;

  const dotColor = isDone
    ? "rgba(255,255,255,0.7)"
    : isCurrent
    ? "#ffffff"
    : isVacation
    ? "rgba(245,158,11,0.7)"
    : "rgba(255,255,255,0.12)";

  const lineColor = isDone
    ? "rgba(255,255,255,0.20)"
    : "rgba(255,255,255,0.05)";

  const monthColor = isCurrent
    ? "#ffffff"
    : isDone
    ? "rgba(255,255,255,0.55)"
    : isVacation
    ? "rgba(245,158,11,0.65)"
    : "rgba(255,255,255,0.20)";

  const labelColor = isCurrent
    ? "rgba(255,255,255,0.60)"
    : isDone
    ? "rgba(255,255,255,0.28)"
    : isVacation
    ? "rgba(245,158,11,0.45)"
    : "rgba(255,255,255,0.15)";

  const DOT_CONTAINER = 56;
  const dotSize = isCurrent ? 20 : isDone ? 14 : 10;

  return (
    <div className="flex items-start">
      <div className="flex flex-col items-center">
        {/* Dot */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: DOT_CONTAINER, height: DOT_CONTAINER }}
        >
          {isCurrent && (
            <>
              <div
                className="absolute rounded-full"
                style={{
                  width: 36,
                  height: 36,
                  background: "rgba(255,255,255,0.06)",
                  animation: "pulseRing 2.2s ease-out infinite",
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  width: 28,
                  height: 28,
                  background: "rgba(255,255,255,0.04)",
                  animation: "pulseRing 2.2s ease-out 0.5s infinite",
                }}
              />
            </>
          )}
          <div
            className="rounded-full"
            style={{
              width: dotSize,
              height: dotSize,
              background: dotColor,
              boxShadow: isCurrent
                ? "0 0 16px rgba(255,255,255,0.6), 0 0 32px rgba(255,255,255,0.2)"
                : isDone
                ? "0 0 8px rgba(255,255,255,0.2)"
                : "none",
            }}
          />
        </div>

        {/* Month */}
        <span
          className="font-mono font-bold tracking-widest uppercase"
          style={{ fontSize: 12, color: monthColor }}
        >
          {item.m}
        </span>

        {/* Label */}
        <span
          className="mt-1 whitespace-nowrap text-center leading-tight"
          style={{ fontSize: 10, color: labelColor, maxWidth: 64 }}
        >
          {item.label}
        </span>
      </div>

      {/* Connecting line */}
      {!isLast && (
        <div
          className="flex-shrink-0"
          style={{
            width: 48,
            height: 1,
            marginTop: DOT_CONTAINER / 2,
            background: lineColor,
          }}
        />
      )}
    </div>
  );
}

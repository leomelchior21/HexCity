"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import HexBackground from "./HexBackground";

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

        <motion.div
          className="mt-12 timeline-reveal"
          style={{ animationDelay: "0.9s" }}
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 18, scale: loaded ? 1 : 0.96 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <Link
            href="/projects"
            className="group relative inline-flex min-h-[78px] items-center justify-center overflow-hidden rounded-2xl px-9 sm:px-12 text-base sm:text-lg font-bold uppercase tracking-[0.18em] text-white transition-transform duration-300 hover:-translate-y-1 active:translate-y-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(124,58,237,0.92), rgba(6,182,212,0.82) 52%, rgba(34,197,94,0.78))",
              border: "1px solid rgba(255,255,255,0.22)",
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.28) inset, 0 -1px 0 rgba(0,0,0,0.28) inset, 0 18px 55px rgba(6,182,212,0.18), 0 18px 65px rgba(124,58,237,0.22)",
            }}
          >
            <span
              className="absolute inset-y-0 -left-1/2 w-1/2 skew-x-[-18deg] bg-white/20 transition-transform duration-700 group-hover:translate-x-[360%]"
              aria-hidden
            />
            <span className="relative flex items-center gap-4">
              Meet The Projects
              <span
                className="grid h-9 w-9 place-items-center rounded-full bg-black/24 text-white transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </span>
            </span>
          </Link>
        </motion.div>

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

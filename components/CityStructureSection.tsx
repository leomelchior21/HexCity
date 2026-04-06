"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useInView } from "@/hooks/useScrollAnimation";

export default function CityStructureSection() {
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.2 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef_inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!sectionRef_inner.current) return;
      const rect = sectionRef_inner.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <section
      id="citysim-invite"
      ref={sectionRef}
      className="relative py-0 overflow-hidden"
    >
      <div
        ref={sectionRef_inner}
        className={`relative transition-all duration-1000 ease-out ${
          isInView ? "opacity-100 scale-100" : "opacity-0 scale-[0.97]"
        }`}
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/citysim-invite.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "brightness(0.35) saturate(1.2)",
            transform: `translate(${(mousePos.x - 50) * -0.015}px, ${(mousePos.y - 50) * -0.015}px) scale(1.05)`,
            transition: "transform 0.3s ease-out",
          }}
        />

        {/* Gradient overlays */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at ${mousePos.x}% ${mousePos.y}%, rgba(124,58,237,0.12) 0%, transparent 60%),
              linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.8) 100%)
            `,
          }}
        />

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(167,139,250,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(167,139,250,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-8 max-w-3xl mx-auto">
          {/* Small tag */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-mono tracking-[0.25em] uppercase mb-8 transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{
              background: "rgba(167,139,250,0.10)",
              border: "1px solid rgba(167,139,250,0.25)",
              color: "#A78BFA",
              transitionDelay: "300ms",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            CitySim Simulator
          </div>

          {/* Main heading */}
          <h2
            className={`font-display text-5xl md:text-7xl font-bold leading-[1.05] mb-6 transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            <span className="text-white/90">Ready to </span>
            <span
              className="gradient-text"
              style={{
                background: "linear-gradient(135deg, #A78BFA 0%, #06B6D4 50%, #22C55E 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              build
            </span>
            <span className="text-white/90">{" "}your city?</span>
          </h2>

          {/* Subtitle */}
          <p
            className={`text-white/50 text-lg md:text-xl leading-relaxed max-w-xl mx-auto mb-12 transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "700ms" }}
          >
            Step into the simulation. Control traffic, energy, water, and air quality in real time — your decisions shape the city.
          </p>

          {/* CTA Button */}
          <div
            className={`transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
            }`}
            style={{ transitionDelay: "900ms" }}
          >
            <Link
              href="/simulation"
              className="group relative inline-flex items-center gap-4 px-10 py-5 rounded-2xl text-lg font-semibold overflow-hidden transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, rgba(124,58,237,0.20) 0%, rgba(6,182,212,0.15) 100%)",
                border: "1px solid rgba(167,139,250,0.30)",
                color: "#E0D4FC",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(124,58,237,0.35) 0%, rgba(6,182,212,0.25) 100%)";
                e.currentTarget.style.borderColor = "rgba(167,139,250,0.50)";
                e.currentTarget.style.boxShadow = "0 0 60px rgba(124,58,237,0.25), 0 20px 40px rgba(0,0,0,0.4)";
                e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(124,58,237,0.20) 0%, rgba(6,182,212,0.15) 100%)";
                e.currentTarget.style.borderColor = "rgba(167,139,250,0.30)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0) scale(1)";
              }}
            >
              {/* Shimmer effect background */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
                  backgroundSize: "200% 100%",
                  animation: "shimmerLine 2s linear infinite",
                }}
              />

              {/* Play icon */}
              <div
                className="relative w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: "rgba(167,139,250,0.20)",
                  border: "1px solid rgba(167,139,250,0.30)",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="6,3 20,12 6,21" />
                </svg>
              </div>

              <span className="relative">Launch CitySim</span>

              {/* Arrow */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="relative transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Bottom hint */}
          <p
            className={`mt-8 text-white/20 text-xs font-mono tracking-wide transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "1100ms" }}
          >
            ⬡ Interactive experience — real sensors, real data, real impact
          </p>
        </div>
      </div>
    </section>
  );
}

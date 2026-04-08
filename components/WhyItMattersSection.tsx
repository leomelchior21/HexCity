"use client";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useInView } from "@/hooks/useScrollAnimation";

export default function WhyItMattersSection() {
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.1 });
  const { ref: ctaRef, isInView: ctaInView } = useInView({ threshold: 0.3 });

  return (
    <section ref={sectionRef} id="why" className="py-32 px-6 relative overflow-hidden scroll-mt-28">
      {/* Massive SYSTEMS text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span
          className="font-display font-black select-none transition-all duration-[2000ms] ease-out"
          style={{
            fontSize: "clamp(8rem, 20vw, 18rem)",
            lineHeight: 1,
            color: "rgba(255,255,255,0.025)",
            transform: isInView ? "scale(1) rotate(0deg)" : "scale(0.8) rotate(-5deg)",
            opacity: isInView ? 1 : 0,
          }}
        >
          SYSTEMS
        </span>
      </div>

      {/* Animated gradient orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "morphBlob 12s ease-in-out infinite",
        }}
        aria-hidden
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "morphBlob 15s ease-in-out 2s infinite",
        }}
        aria-hidden
      />

      <div className="max-w-5xl mx-auto relative">
        <p className={`text-hex-purple-light text-sm font-medium tracking-widest uppercase mb-6 transition-all duration-700 ease-out ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          Why It Matters
        </p>

        <h2
          className={`font-display font-bold leading-tight mb-8 transition-all duration-1000 ease-out ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
        >
          Real cities work{" "}
          <span className="gradient-text">like systems.</span>
          <br />
          Not like isolated projects.
        </h2>

        <p className={`text-white/50 text-lg md:text-xl leading-relaxed mb-16 max-w-3xl mx-auto transition-all duration-1000 ease-out ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "200ms" }}>
          When you learn to think in systems, you learn how the real world actually works -- interdependencies, feedback loops, trade-offs. That is the skill that separates engineers who solve real problems.
        </p>

        {/* 3 Principles */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            { label: "Systems > Solutions", desc: "An isolated solution rarely solves the real problem. Integrated systems do.", icon: "🕸️", color: "#7C3AED" },
            { label: "Data > Assumptions", desc: "Sensors capture reality. Algorithms process it. Decisions improve.", icon: "📊", color: "#06B6D4" },
            { label: "Impact > Intention", desc: "What counts isn't the idea -- it's the working prototype in front of the public.", icon: "🚀", color: "#22C55E" },
          ].map((item, i) => (
            <div
              key={item.label}
              className="liquid-glass rounded-2xl p-8 text-center card-lift ripple-container group"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? "none" : "translateY(30px)",
                transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 150 + 300}ms`,
              }}
            >
              <div
                className="text-4xl mb-4 inline-block float-gentle"
                style={{ animationDelay: `${i * 0.5}s` }}
              >
                {item.icon}
              </div>
              <h3 className="font-display font-bold text-lg mb-3" style={{ color: item.color }}>
                {item.label}
              </h3>
              <p className="text-white/45 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Box */}
        <div ref={ctaRef}
          className={`liquid-glass-purple rounded-3xl p-12 transition-all duration-1000 ease-out ${ctaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
        >
          <h3 className="font-display text-3xl md:text-4xl font-bold mb-4">Ready to explore?</h3>
          <p className="text-white/50 mb-8">Access the Ardudeck or open the city simulation.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton href="/swot" label="SWOT Analysis" />
            <CTAButton href="/lab" label="Ardudeck" />
            <CTAButton href="/simulation" label="City Sim" />
          </div>
        </div>
      </div>
    </section>
  );
}

function CTAButton({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-300 ripple-container"
      style={{
        background: hovered ? "rgba(124,58,237,0.95)" : "rgba(255,255,255,0.06)",
        border: hovered ? "1px solid rgba(167,139,250,0.4)" : "1px solid rgba(255,255,255,0.1)",
        color: hovered ? "#fff" : "rgba(255,255,255,0.8)",
        boxShadow: hovered
          ? "0 8px 30px rgba(124,58,237,0.4), 0 0 60px rgba(124,58,237,0.15)"
          : "0 4px 16px rgba(0,0,0,0.3)",
        transform: hovered ? "translateY(-2px)" : "none",
      }}
    >
      {label}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

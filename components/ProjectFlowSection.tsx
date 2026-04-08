"use client";
import { useInView } from "@/hooks/useScrollAnimation";

const steps = [
  {
    n: "01",
    label: "Brainstorm",
    icon: "💡",
    color: "#7C3AED",
    glow: "rgba(124,58,237,0.30)",
    desc: "Free-form idea generation to solve a real urban problem in São Paulo.",
  },
  {
    n: "02",
    label: "SWOT",
    icon: "⚖️",
    color: "#06B6D4",
    glow: "rgba(6,182,212,0.30)",
    desc: "Analysis of strengths, weaknesses, opportunities and threats of the chosen solution.",
  },
  {
    n: "03",
    label: "Build",
    icon: "🔧",
    color: "#F59E0B",
    glow: "rgba(245,158,11,0.30)",
    desc: "Physical construction of the hexagon: Arduino, sensors, actuators, structure and programming.",
  },
  {
    n: "04",
    label: "Integration",
    icon: "🔗",
    color: "#22C55E",
    glow: "rgba(34,197,94,0.30)",
    desc: "All hexes connect. The entire system functions as a real city.",
  },
  {
    n: "05",
    label: "Exhibition",
    icon: "🏆",
    color: "#EF4444",
    glow: "rgba(239,68,68,0.30)",
    desc: "Mostra Cultural — the public interacts with HEXCITY. Systems running live.",
  },
];

export default function ProjectFlowSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section id="flow" ref={ref} className="py-32 px-8 md:px-16 scroll-mt-28">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div
          className="text-center mb-20 transition-all duration-1000 ease-out"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "none" : "translateY(16px)",
          }}
        >
          <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/25 mb-3 block">
            Process
          </span>
          <h2 className="font-display text-5xl md:text-6xl font-bold mb-4">
            Project <span className="gradient-text">Flow</span>
          </h2>
          <p className="text-white/40 max-w-md mx-auto">
            From concept to city — 5 stages structuring the project
          </p>
        </div>

        {/* Steps row */}
        <div className="relative">

          {/* Connecting track line */}
          <div
            className="hidden md:block absolute left-0 right-0 h-px pointer-events-none"
            style={{
              top: 52,
              background:
                "linear-gradient(90deg, transparent 2%, rgba(255,255,255,0.07) 15%, rgba(255,255,255,0.07) 85%, transparent 98%)",
            }}
          />

          <div className="grid md:grid-cols-5 gap-5">
            {steps.map((step, i) => (
              <StepCard key={step.n} step={step} index={i} isInView={isInView} isLast={i === steps.length - 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({
  step,
  index,
  isInView,
  isLast,
}: {
  step: (typeof steps)[0];
  index: number;
  isInView: boolean;
  isLast: boolean;
}) {
  return (
    <div
      className="relative flex flex-col items-center text-center group"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? "none" : "translateY(28px)",
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 110}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 110}ms`,
      }}
    >
      {/* Arrow connector — sits between cards on the track */}
      {!isLast && (
        <div
          className="hidden md:flex absolute items-center justify-center"
          style={{ right: -14, top: 44, zIndex: 10 }}
        >
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
            <path
              d="M1 1l6 5-6 5"
              stroke="rgba(255,255,255,0.13)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      {/* Icon badge */}
      <div
        className="relative z-10 w-[104px] h-[104px] rounded-3xl flex flex-col items-center justify-center mb-5 transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-1.5"
        style={{
          background: `${step.color}10`,
          border: `1px solid ${step.color}30`,
          boxShadow: `0 0 0 0 ${step.glow}`,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = `0 0 32px ${step.glow}, 0 8px 24px rgba(0,0,0,0.35)`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 0 ${step.glow}`;
        }}
      >
        {/* Step watermark number */}
        <span
          className="absolute top-2.5 right-3 font-mono font-black leading-none select-none pointer-events-none"
          style={{
            fontSize: 28,
            color: `${step.color}15`,
            letterSpacing: "-1px",
          }}
        >
          {step.n}
        </span>

        {/* Emoji icon */}
        <span className="text-3xl leading-none mb-1">{step.icon}</span>

        {/* Step label badge */}
        <span
          className="text-[9px] font-mono font-bold tracking-widest uppercase mt-1"
          style={{ color: `${step.color}70` }}
        >
          {step.n}
        </span>
      </div>

      {/* Label */}
      <div
        className="font-display font-bold text-[15px] mb-2 transition-colors duration-300 group-hover:brightness-110"
        style={{ color: step.color }}
      >
        {step.label}
      </div>

      {/* Description */}
      <p className="text-white/35 text-[11px] leading-relaxed px-1">{step.desc}</p>
    </div>
  );
}

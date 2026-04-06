"use client";
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SWOT_DATA = [
  {
    quadrant: "Strengths",
    letter: "S",
    color: "#22C55E",
    glowColor: "rgba(34,197,94,0.12)",
    borderColor: "rgba(34,197,94,0.2)",
    icon: "shield",
    prompts: [
      "What does our solution do well?",
      "What unique tech or skill do we have?",
      "Why is our approach innovative?",
    ],
  },
  {
    quadrant: "Weaknesses",
    letter: "W",
    color: "#EF4444",
    glowColor: "rgba(239,68,68,0.12)",
    borderColor: "rgba(239,68,68,0.2)",
    icon: "target",
    prompts: [
      "What limits our solution?",
      "What resources are missing?",
      "What could fail in our prototype?",
    ],
  },
  {
    quadrant: "Opportunities",
    letter: "O",
    color: "#06B6D4",
    glowColor: "rgba(6,182,212,0.12)",
    borderColor: "rgba(6,182,212,0.2)",
    icon: "trending",
    prompts: [
      "How can we scale this?",
      "What external support exists?",
      "How does this help the city system?",
    ],
  },
  {
    quadrant: "Threats",
    letter: "T",
    color: "#F59E0B",
    glowColor: "rgba(245,158,11,0.12)",
    borderColor: "rgba(245,158,11,0.2)",
    icon: "alert",
    prompts: [
      "What could break this?",
      "What external factors affect us?",
      "What happens if integration fails?",
    ],
  },
];

// ─── SVG Icons ───────────────────────────────────────────────────────────────
function ShieldIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function TargetIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function TrendingIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function AlertIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

const IconMap: Record<string, React.FC<{ color: string }>> = {
  shield: ShieldIcon,
  target: TargetIcon,
  trending: TrendingIcon,
  alert: AlertIcon,
};

// ─── SWOT Card Component ─────────────────────────────────────────────────────
function SWOTCard({ data, index }: { data: typeof SWOT_DATA[0]; index: number }) {
  const IconComp = IconMap[data.icon];
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 120);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden transition-all duration-800"
      style={{
        minHeight: 200,
        background: `linear-gradient(180deg, rgba(10,10,14,0.95) 0%, ${data.glowColor} 100%)`,
        border: `1px solid ${data.borderColor}`,
        boxShadow: isVisible
          ? `0 0 50px ${data.glowColor}, 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 ${data.borderColor}40`
          : "0 2px 8px rgba(0,0,0,0.15)",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
      }}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: `linear-gradient(90deg, ${data.color}80, ${data.color}30, transparent)`,
        }}
      />

      {/* Bottom shimmer line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${data.color}10, ${data.color}40)`,
        }}
      />

      {/* Bottom glow blob */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 100%, ${data.glowColor} 0%, transparent 70%)`,
        }}
      />

      {/* Animated scan line */}
      {isVisible && (
        <div
          className="absolute top-0 left-0 h-px pointer-events-none"
          style={{
            width: "40%",
            background: `linear-gradient(90deg, transparent, ${data.color}50, transparent)`,
            animation: `scanLine 4s ease-in-out ${index * 1}s infinite`,
          }}
        />
      )}

      <div className="relative flex flex-col gap-4 h-full px-6 py-5">
        {/* Letter badge + Icon */}
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500"
            style={{
              background: `${data.color}10`,
              border: `1px solid ${data.color}30`,
              boxShadow: isVisible ? `0 0 25px ${data.glowColor}` : "none",
              animation: isVisible ? "badgePulse 3s ease-in-out infinite" : "none",
            }}
          >
            <span
              className="text-lg font-bold font-mono"
              style={{ color: data.color }}
            >
              {data.letter}
            </span>
          </div>

          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: `${data.color}08`,
            }}
          >
            <IconComp color={data.color} />
          </div>
        </div>

        {/* Title */}
        <h3
          className="text-2xl font-black tracking-tight"
          style={{ color: data.color }}
        >
          {data.quadrant}
        </h3>

        {/* Prompts */}
        <div className="space-y-1.5 mt-auto">
          {data.prompts.map((prompt, i) => (
            <p
              key={i}
              className="text-sm leading-relaxed"
              style={{
                color: "rgba(255,255,255,0.42)",
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(10px)",
                transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 120 + 400 + i * 100}ms`,
              }}
            >
              {prompt}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function SWOTPage() {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <div ref={heroRef} className="pt-32 pb-14 px-6 relative overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(167,139,250,0.08) 0%, transparent 60%)",
            filter: "blur(100px)",
          }}
        />
        <div className="max-w-4xl mx-auto relative text-center">
          {/* Tag */}
          <span
            className="text-[11px] font-mono tracking-[0.35em] uppercase text-white/18 mb-6 block transition-all duration-1000"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(10px)",
            }}
          >
            Strategic Analysis
          </span>

          {/* SWOT Title — big and bold */}
          <h1
            className="font-display text-8xl md:text-9xl font-black mb-6 leading-none tracking-tight transition-all duration-1000"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.92)",
            }}
          >
            <span
              style={{
                background: "linear-gradient(135deg, #A78BFA 0%, #22C55E 30%, #06B6D4 60%, #F59E0B 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              SWOT
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-white/35 text-lg md:text-xl max-w-lg mx-auto leading-relaxed transition-all duration-1000"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(10px)",
              transitionDelay: "200ms",
            }}
          >
            Evaluate your HEXCITY project across four critical dimensions.
            Realistic assessment leads to better solutions.
          </p>
        </div>
      </div>

      {/* SWOT Cards — horizontal 4x1 grid */}
      <div className="flex-1 px-6 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {SWOT_DATA.map((data, i) => (
            <SWOTCard key={data.quadrant} data={data} index={i} />
          ))}
        </div>
      </div>

      {/* Bottom insight */}
      <div className="px-6 pb-16">
        <div className="max-w-2xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-sm"
            style={{
              background: "rgba(167,139,250,0.06)",
              border: "1px solid rgba(167,139,250,0.15)",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span>
              Use this framework before prototyping.{" "}
              <strong style={{ color: "#A78BFA" }}>Stronger analysis → better solutions.</strong>
            </span>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

"use client";
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SWOT_DATA = [
  {
    quadrant: "Strengths",
    letter: "S",
    color: "#22C55E",
    glowColor: "rgba(34,197,94,0.15)",
    edgeColor: "rgba(34,197,94,0.08)",
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
    glowColor: "rgba(239,68,68,0.15)",
    edgeColor: "rgba(239,68,68,0.08)",
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
    glowColor: "rgba(6,182,212,0.15)",
    edgeColor: "rgba(6,182,212,0.08)",
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
    glowColor: "rgba(245,158,11,0.15)",
    edgeColor: "rgba(245,158,11,0.08)",
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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function TargetIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function TrendingIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function AlertIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
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

// ─── SWOT Bar Component ──────────────────────────────────────────────────────
function SWOTBar({ data, index }: { data: typeof SWOT_DATA[0]; index: number }) {
  const IconComp = IconMap[data.icon];
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 150);
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
      className="relative overflow-hidden transition-all duration-700"
      style={{
        minHeight: 110,
        background: `linear-gradient(90deg, rgba(10,10,12,0.95) 0%, ${data.glowColor} 100%)`,
        border: `1px solid ${data.color}18`,
        boxShadow: `0 0 30px ${data.glowColor}, 0 4px 16px rgba(0,0,0,0.3)`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateX(0)" : "translateX(-30px)",
      }}
    >
      {/* Right edge glow gradient */}
      <div
        className="absolute top-0 right-0 bottom-0 w-48 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${data.edgeColor} 100%)`,
        }}
      />

      {/* Left accent border */}
      <div
        className="absolute top-0 left-0 bottom-0 w-0.5"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${data.color}50 50%, transparent 100%)`,
        }}
      />

      {/* Top shimmer line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, ${data.color}30, ${data.color}10, transparent)`,
        }}
      />

      {/* Animated scan line */}
      {isVisible && (
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, ${data.color}40, transparent)`,
            backgroundSize: "200% 100%",
            animation: `shimmerLine 3s linear ${index * 0.5}s infinite`,
          }}
        />
      )}

      <div className="relative flex items-center gap-5 h-full px-6 py-5">
        {/* Letter badge — pulsing */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500"
          style={{
            background: `${data.color}10`,
            border: `1px solid ${data.color}25`,
            boxShadow: isVisible ? `0 0 20px ${data.glowColor}` : "none",
            animation: isVisible ? "badgePulse 3s ease-in-out infinite" : "none",
          }}
        >
          <span
            className="text-sm font-bold font-mono"
            style={{ color: data.color }}
          >
            {data.letter}
          </span>
        </div>

        {/* Icon + Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: `${data.color}08`,
              }}
            >
              <IconComp color={data.color} />
            </div>
            <h3
              className="text-base font-semibold"
              style={{ color: data.color }}
            >
              {data.quadrant}
            </h3>
          </div>

          {/* Prompts */}
          <div className="space-y-1">
            {data.prompts.map((prompt, i) => (
              <p
                key={i}
                className="text-xs leading-relaxed"
                style={{
                  color: "rgba(255,255,255,0.38)",
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(8px)",
                  transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 150 + 300 + i * 80}ms`,
                }}
              >
                {prompt}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function DesignThinkingPage() {
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
      <div ref={heroRef} className="pt-28 pb-10 px-6 relative overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(167,139,250,0.06) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div className="max-w-4xl mx-auto relative text-center">
          <span
            className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/20 mb-4 block transition-all duration-1000"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(10px)",
            }}
          >
            Strategic Analysis
          </span>
          <h1
            className="font-display text-6xl md:text-8xl font-bold mb-6 leading-none transition-all duration-1000"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
            }}
          >
            <span className="gradient-text">SWOT</span>
          </h1>
          <p
            className="text-white/40 text-lg max-w-lg mx-auto transition-all duration-1000"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(10px)",
              transitionDelay: "200ms",
            }}
          >
            Evaluate your HEXCITY project concept across four critical dimensions.
            Realistic assessment leads to better solutions.
          </p>
        </div>
      </div>

      {/* SWOT Bars — vertical stack */}
      <div className="flex-1 px-6 pb-20">
        <div className="max-w-3xl mx-auto space-y-3">
          {SWOT_DATA.map((data, i) => (
            <SWOTBar key={data.quadrant} data={data} index={i} />
          ))}
        </div>
      </div>

      {/* Bottom insight */}
      <div className="px-6 pb-16">
        <div className="max-w-2xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-sm"
            style={{
              background: "rgba(167,139,250,0.08)",
              border: "1px solid rgba(167,139,250,0.20)",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span>
              Use this framework to refine your hex design before prototyping.{" "}
              <strong style={{ color: "#A78BFA" }}>Stronger analysis → better solutions.</strong>
            </span>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

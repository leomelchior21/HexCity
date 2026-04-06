"use client";
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SWOT_DATA = [
  {
    quadrant: "Strengths",
    step: "S",
    color: "#22C55E",
    glowColor: "rgba(34,197,94,0.3)",
    icon: "shield",
    prompts: [
      "What does our solution do well?",
      "What unique tech/skill do we have?",
      "Why is our approach innovative?",
    ],
  },
  {
    quadrant: "Weaknesses",
    step: "W",
    color: "#EF4444",
    glowColor: "rgba(239,68,68,0.3)",
    icon: "target",
    prompts: [
      "What limits our solution?",
      "What resources are missing?",
      "What could fail in our prototype?",
    ],
  },
  {
    quadrant: "Opportunities",
    step: "O",
    color: "#06B6D4",
    glowColor: "rgba(6,182,212,0.3)",
    icon: "trending",
    prompts: [
      "How can we scale this?",
      "What external support exists?",
      "How does this help the city system?",
    ],
  },
  {
    quadrant: "Threats",
    step: "T",
    color: "#F59E0B",
    glowColor: "rgba(245,158,11,0.3)",
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
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function TargetIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function TrendingIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function AlertIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
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

// ─── Animated orbit ring ─────────────────────────────────────────────────────
function OrbitRing({ color, delay, duration, size }: { color: string; delay: number; duration: number; size: number }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        width: size,
        height: size,
        top: "50%",
        left: "50%",
        marginLeft: -size / 2,
        marginTop: -size / 2,
        borderRadius: "50%",
        border: `1px solid ${color}15`,
        animation: `rotateOrbit ${duration}s linear ${delay}s infinite`,
        transformOrigin: "center center",
      }}
    >
      <div
        className="absolute rounded-full"
        style={{
          width: 5,
          height: 5,
          background: color,
          boxShadow: `0 0 8px ${color}`,
          top: -2.5,
          left: "50%",
          marginLeft: -2.5,
        }}
      />
    </div>
  );
}

// ─── SWOT Bento Box ──────────────────────────────────────────────────────────
function SWOTBox({ data, index, isActive, boxSize }: { data: typeof SWOT_DATA[0]; index: number; isActive: boolean; boxSize: number }) {
  const IconComp = IconMap[data.icon];

  return (
    <div
      className="relative overflow-hidden transition-all duration-700 cursor-default"
      style={{
        width: boxSize,
        height: boxSize,
        background: isActive ? `${data.color}08` : "rgba(255,255,255,0.02)",
        border: `1px solid ${isActive ? `${data.color}35` : "rgba(255,255,255,0.06)"}`,
        boxShadow: isActive
          ? `0 0 50px ${data.glowColor}, 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 ${data.color}15`
          : "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px transition-all duration-700"
        style={{
          background: isActive
            ? `linear-gradient(90deg, transparent, ${data.color}60, transparent)`
            : "transparent",
        }}
      />

      {/* Corner glow blob */}
      {isActive && (
        <div
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${data.color}12 0%, transparent 70%)`,
            filter: "blur(16px)",
          }}
        />
      )}

      {/* Orbit animations */}
      {isActive && (
        <>
          <OrbitRing color={data.color} delay={0} duration={6} size={boxSize * 0.9} />
          <OrbitRing color={data.color} delay={3} duration={8} size={boxSize * 1.1} />
        </>
      )}

      <div className="relative flex flex-col items-center justify-center h-full px-5 text-center gap-2">
        {/* Step letter */}
        <div
          className="text-[10px] font-mono tracking-widest transition-colors duration-500"
          style={{ color: isActive ? `${data.color}80` : "rgba(255,255,255,0.12)" }}
        >
          {data.step}
        </div>

        {/* Icon */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500"
          style={{
            background: isActive ? `${data.color}15` : "rgba(255,255,255,0.04)",
            border: `1px solid ${isActive ? `${data.color}30` : "rgba(255,255,255,0.06)"}`,
            transform: isActive ? "scale(1.1)" : "scale(1)",
          }}
        >
          <IconComp color={isActive ? data.color : "rgba(255,255,255,0.25)"} />
        </div>

        {/* Label */}
        <h4
          className="text-[15px] font-semibold leading-tight transition-colors duration-500"
          style={{ color: isActive ? data.color : "rgba(255,255,255,0.45)" }}
        >
          {data.quadrant}
        </h4>

        {/* Prompts */}
        <div className="space-y-1.5 mt-1">
          {data.prompts.map((prompt, i) => (
            <p
              key={i}
              className="text-[10.5px] leading-relaxed transition-all duration-500"
              style={{
                color: isActive ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.2)",
                opacity: isActive ? 1 : 0.5,
                transitionDelay: `${i * 100}ms`,
              }}
            >
              {prompt}
            </p>
          ))}
        </div>

        {/* Active indicator dot */}
        {isActive && (
          <div
            className="w-2 h-2 rounded-full mt-2"
            style={{
              background: data.color,
              boxShadow: `0 0 10px ${data.color}`,
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
        )}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function DesignThinkingPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [boxSize, setBoxSize] = useState(240);
  const [isVisible, setIsVisible] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // Intersection observer
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Auto-rotate every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SWOT_DATA.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Responsive box sizing
  useEffect(() => {
    const measure = () => {
      if (window.innerWidth < 768) {
        setBoxSize(Math.min(280, window.innerWidth * 0.42));
      } else {
        setBoxSize(240);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <div className="pt-24 pb-8 px-6 relative overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(ellipse, ${SWOT_DATA[activeIndex].glowColor.replace("0.3", "0.08")} 0%, transparent 70%)`,
            filter: "blur(80px)",
            transition: "background 1s ease",
          }}
        />
        <div className="max-w-7xl mx-auto relative text-center">
          <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/25 mb-3 block">
            Strategic Analysis
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 leading-none">
            <span className="gradient-text">SWOT</span>{" "}
            <span className="text-white/60">Analysis</span>
          </h1>
          <p className="text-white/40 text-lg max-w-xl mx-auto mt-4">
            Evaluate your HEXCITY project concept across four critical dimensions. Be honest — realistic assessment leads to better solutions.
          </p>
        </div>
      </div>

      {/* Bento Grid */}
      <div ref={gridRef} className="flex-1 flex items-center justify-center px-6 pb-20">
        <div
          className="grid grid-cols-2 gap-3 transition-all duration-1000"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          {SWOT_DATA.map((data, i) => (
            <SWOTBox
              key={data.quadrant}
              data={data}
              index={i}
              isActive={i === activeIndex}
              boxSize={boxSize}
            />
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

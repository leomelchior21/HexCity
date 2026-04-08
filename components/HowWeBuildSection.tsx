"use client";
import { useState, useEffect, useRef } from "react";

// ─── Loop stages ─────────────────────────────────────────────────────────────
const STAGES = [
  {
    id: "collection",
    label: "Data Collection",
    step: "01",
    color: "#22C55E",
    desc: "Sensors capture real-world data from the environment.",
  },
  {
    id: "analysis",
    label: "Analysis & Processing",
    step: "02",
    color: "#A78BFA",
    desc: "Arduino processes data and makes real-time decisions.",
  },
  {
    id: "actions",
    label: "Real-Time Actions",
    step: "03",
    color: "#06B6D4",
    desc: "Actuators respond — servos, LEDs, buzzers, and relays take action.",
  },
  {
    id: "optimization",
    label: "Optimization & Improvement",
    step: "04",
    color: "#F59E0B",
    desc: "The loop repeats, continuously improving city performance.",
  },
];

// ─── SVG Icons ───────────────────────────────────────────────────────────────
function SensorIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
    </svg>
  );
}

function CloudIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <path d="M18 10a4 4 0 00-7.46-2A5 5 0 006 13a4 4 0 008 0" />
      <path d="M14 10h4" />
      <circle cx="16" cy="10" r="1" fill={color} />
    </svg>
  );
}

function ActuatorIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}

function FeedbackIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9" />
    </svg>
  );
}

const IconMap: Record<string, React.FC<{ color: string }>> = {
  collection: SensorIcon,
  analysis: CloudIcon,
  actions: ActuatorIcon,
  optimization: FeedbackIcon,
};

// ─── Geometry helpers ─────────────────────────────────────────────────────────
const RADIUS = 140;
const CENTER = 200;
const NODE_R = 36;

function getNodePos(index: number, total: number) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return {
    x: CENTER + RADIUS * Math.cos(angle),
    y: CENTER + RADIUS * Math.sin(angle),
  };
}

// ─── Animated particle along arc ─────────────────────────────────────────────
function Particle({ fromIdx, toIdx, color, delay }: { fromIdx: number; toIdx: number; color: string; delay: number }) {
  const start = getNodePos(fromIdx, STAGES.length);
  const end = getNodePos(toIdx, STAGES.length);

  const mx = (start.x + end.x) / 2;
  const my = (start.y + end.y) / 2;
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const perpX = -dy / dist;
  const perpY = dx / dist;
  const arcHeight = 30;
  const cpX = mx + perpX * arcHeight;
  const cpY = my + perpY * arcHeight;

  return (
    <circle r="3" fill={color} opacity="0.8">
      <animateMotion dur="3s" begin={`${delay}s`} repeatCount="indefinite" path={`M ${start.x} ${start.y} Q ${cpX} ${cpY} ${end.x} ${end.y}`} />
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="3s" begin={`${delay}s`} repeatCount="indefinite" />
    </circle>
  );
}

// ─── Bento Box Component ─────────────────────────────────────────────────────
function BentoBox({ stage, index, isActive, boxSize }: { stage: typeof STAGES[0]; index: number; isActive: boolean; boxSize: number }) {
  const IconComp = IconMap[stage.id];

  return (
    <div
      className="relative overflow-hidden transition-all duration-700 cursor-default"
      style={{
        width: boxSize,
        height: boxSize,
        background: isActive ? `${stage.color}08` : "rgba(255,255,255,0.02)",
        border: `1px solid ${isActive ? `${stage.color}30` : "rgba(255,255,255,0.06)"}`,
        boxShadow: isActive
          ? `0 0 40px ${stage.color}15, 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 ${stage.color}15`
          : "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px transition-all duration-700"
        style={{
          background: isActive
            ? `linear-gradient(90deg, transparent, ${stage.color}60, transparent)`
            : "transparent",
        }}
      />

      {/* Corner glow blob */}
      {isActive && (
        <div
          className="absolute -top-6 -right-6 w-20 h-20 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${stage.color}10 0%, transparent 70%)`,
            filter: "blur(10px)",
          }}
        />
      )}

      <div className="relative flex flex-col items-center justify-center h-full px-4 text-center gap-3">
        {/* Step number */}
        <div
          className="text-[10px] font-mono tracking-widest transition-colors duration-500"
          style={{ color: isActive ? `${stage.color}70` : "rgba(255,255,255,0.12)" }}
        >
          {stage.step}
        </div>

        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500"
          style={{
            background: isActive ? `${stage.color}15` : "rgba(255,255,255,0.04)",
            border: `1px solid ${isActive ? `${stage.color}25` : "rgba(255,255,255,0.06)"}`,
            transform: isActive ? "scale(1.1)" : "scale(1)",
          }}
        >
          <IconComp color={isActive ? stage.color : "rgba(255,255,255,0.25)"} />
        </div>

        {/* Label */}
        <h4
          className="text-[13px] font-semibold leading-tight transition-colors duration-500"
          style={{ color: isActive ? stage.color : "rgba(255,255,255,0.45)" }}
        >
          {stage.label}
        </h4>

        {/* Description */}
        <p
          className="text-[11px] leading-relaxed transition-colors duration-500 max-w-[160px]"
          style={{ color: isActive ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.22)" }}
        >
          {stage.desc}
        </p>

        {/* Active indicator dot */}
        {isActive && (
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: stage.color,
              boxShadow: `0 0 8px ${stage.color}`,
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
        )}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function HowWeBuildSection() {
  const [activeStage, setActiveStage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [boxSize, setBoxSize] = useState(200);
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection observer
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setIsVisible(true); }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Size bento boxes to match SVG container height
  useEffect(() => {
    if (!isVisible) return;
    const measure = () => {
      // Fixed reference: SVG viewBox is 360x390, we want boxes to fill same space
      // 2 boxes + 1 gap = 390px -> boxSize = (390 - 12) / 2 = 189
      // Use a fixed value for consistency
      setBoxSize(180);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [isVisible]);

  // Auto-rotate active stage every 3s
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % STAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isVisible]);

  // Generate arc paths between nodes
  const arcs = STAGES.map((_, i) => {
    const from = getNodePos(i, STAGES.length);
    const to = getNodePos((i + 1) % STAGES.length, STAGES.length);
    const mx = (from.x + to.x) / 2;
    const my = (from.y + to.y) / 2;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const perpX = -dy / dist;
    const perpY = dx / dist;
    const arcHeight = 25;
    const cpX = mx + perpX * arcHeight;
    const cpY = my + perpY * arcHeight;
    return { path: `M ${from.x} ${from.y} Q ${cpX} ${cpY} ${to.x} ${to.y}` };
  });

  return (
    <section id="build" ref={ref} className="relative py-32 px-6 md:px-16 overflow-hidden" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(6,182,212,0.04) 0%, #06080e 100%)" }}>
      <div className="max-w-5xl mx-auto relative">

        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/25 mb-3 block">
            005 — The Feedback Loop
          </span>
          <h2 className="font-display text-5xl md:text-6xl font-bold leading-[1.05] mb-4">
            Smart City{" "}
            <span className="gradient-text">Feedback Loop</span>
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            Sensors collect data → Arduino processes → Actuators respond → The city improves. Endlessly.
          </p>
        </div>

        {/* Loop + Bento Grid */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">

          {/* Left: Animated SVG loop */}
          <div ref={containerRef} className={`relative transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`} style={{ transitionDelay: "200ms" }}>
            <svg viewBox="20 20 360 390" className="w-full" style={{ maxWidth: (boxSize * 2 + 12) * 1.15 }}>

              {/* Background glow */}
              <defs>
                <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={STAGES[activeStage].color} stopOpacity="0.15" />
                  <stop offset="100%" stopColor={STAGES[activeStage].color} stopOpacity="0" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <circle cx={CENTER} cy={CENTER} r={80} fill="url(#centerGlow)" />

              {/* Arc connections */}
              {arcs.map((arc, i) => (
                <g key={`arc-${i}`}>
                  <path d={arc.path} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" strokeLinecap="round" />
                  {i === activeStage && (
                    <path d={arc.path} fill="none" stroke={STAGES[i].color} strokeWidth="3" strokeLinecap="round" filter="url(#glow)" opacity="0.6">
                      <animate attributeName="stroke-dasharray" values="0 200;200 0" dur="1.5s" repeatCount="indefinite" />
                    </path>
                  )}
                </g>
              ))}

              {/* Animated particles */}
              {STAGES.map((stage, i) => (
                <g key={`particles-${i}`}>
                  <Particle fromIdx={i} toIdx={(i + 1) % STAGES.length} color={stage.color} delay={i * 0.75} />
                  <Particle fromIdx={i} toIdx={(i + 1) % STAGES.length} color={stage.color} delay={i * 0.75 + 1.5} />
                </g>
              ))}

              {/* Center text */}
              <text x={CENTER} y={CENTER - 16} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.35)" fontFamily="monospace" letterSpacing="1">
                SMART CITY
              </text>
              <text x={CENTER} y={CENTER} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.35)" fontFamily="monospace" letterSpacing="1">
                FEEDBACK LOOP
              </text>
              <g transform={`translate(${CENTER - 9}, ${CENTER + 10})`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5">
                  <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9" />
                </svg>
              </g>

              {/* Stage nodes */}
              {STAGES.map((stage, i) => {
                const pos = getNodePos(i, STAGES.length);
                const isActive = i === activeStage;
                const IconComp = IconMap[stage.id];
                const pulseR = NODE_R + 12;

                return (
                  <g
                    key={stage.id}
                    className="cursor-pointer"
                    onClick={() => setActiveStage(i)}
                    onMouseEnter={() => setActiveStage(i)}
                  >
                    {/* Pulse ring */}
                    {isActive && (
                      <circle cx={pos.x} cy={pos.y} r={pulseR} fill="none" stroke={stage.color} strokeWidth="1" opacity="0.3">
                        <animate attributeName="r" values={`${NODE_R};${NODE_R + 20};${NODE_R}`} dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}

                    {/* Node circle */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={NODE_R}
                      fill={isActive ? `${stage.color}20` : "rgba(10,10,15,0.8)"}
                      stroke={isActive ? stage.color : "rgba(255,255,255,0.1)"}
                      strokeWidth={isActive ? 2.5 : 1.5}
                      filter={isActive ? "url(#glow)" : undefined}
                      style={{ transition: "all 0.5s ease" }}
                    />

                    {/* Icon */}
                    <g transform={`translate(${pos.x - 12}, ${pos.y - 12})`}>
                      <IconComp color={isActive ? stage.color : "rgba(255,255,255,0.3)"} />
                    </g>

                    {/* Label */}
                    <text
                      x={pos.x}
                      y={pos.y + NODE_R + 18}
                      textAnchor="middle"
                      fontSize="8"
                      fontWeight="600"
                      fill={isActive ? stage.color : "rgba(255,255,255,0.35)"}
                      fontFamily="'Space Grotesk', monospace"
                      letterSpacing="0.5"
                      style={{ transition: "fill 0.5s ease" }}
                    >
                      {stage.label.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Right: 2x2 Bento Grid */}
          <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`} style={{ transitionDelay: "400ms" }}>
            <div className="grid grid-cols-2 gap-3" style={{ width: boxSize * 2 + 12, height: boxSize * 2 + 12 }}>
              {STAGES.map((stage, i) => (
                <BentoBox key={stage.id} stage={stage} index={i} isActive={i === activeStage} boxSize={boxSize} />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom insight */}
        <div className={`mt-16 text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`} style={{ transitionDelay: "600ms" }}>
          <div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-sm"
            style={{
              background: "rgba(167,139,250,0.08)",
              border: "1px solid rgba(167,139,250,0.20)",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round">
              <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9" />
            </svg>
            <span>
              Each hexagon runs this loop independently — together they form a{" "}
              <strong style={{ color: "#A78BFA" }}>distributed smart city network</strong>.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

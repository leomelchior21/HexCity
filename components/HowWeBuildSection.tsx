"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── Loop stages ─────────────────────────────────────────────────────────────
const STAGES = [
  {
    id: "collection",
    label: "Data Collection",
    icon: "sensors",
    color: "#22C55E",
    glowColor: "rgba(34,197,94,0.4)",
    desc: "Sensors capture real-world data: temperature, light, distance, air quality, water level.",
    items: ["🌡️ Temperature", "💡 Light (LDR)", "📏 Ultrasonic", "💧 Turbidity"],
  },
  {
    id: "analysis",
    label: "Analysis & Processing",
    icon: "cloud",
    color: "#A78BFA",
    glowColor: "rgba(167,139,250,0.4)",
    desc: "Arduino processes sensor data, runs algorithms, and makes decisions in real time.",
    items: ["🧠 Arduino Logic", "📊 Data Filtering", "⚙️ Decision Engine"],
  },
  {
    id: "actions",
    label: "Real-Time Actions",
    icon: "actuators",
    color: "#06B6D4",
    glowColor: "rgba(6,182,212,0.4)",
    desc: "Actuators respond: servos move, LEDs change, buzzers alert, relays switch.",
    items: ["🔧 Servo Motors", "💡 Smart LEDs", "🔔 Buzzers", "🔌 Relays"],
  },
  {
    id: "optimization",
    label: "Optimization & Improvement",
    icon: "feedback",
    color: "#F59E0B",
    glowColor: "rgba(245,158,11,0.4)",
    desc: "The loop continues — each cycle refines the system for better city performance.",
    items: [" Performance Tracking", "🔄 Continuous Feedback", "🎯 Fine Tuning"],
  },
];

// ─── SVG Icon components ─────────────────────────────────────────────────────
function SensorIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
    </svg>
  );
}

function CloudIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <path d="M18 10a4 4 0 00-7.46-2A5 5 0 006 13a4 4 0 008 0" />
      <path d="M14 10h4" />
      <circle cx="16" cy="10" r="1" fill={color} />
    </svg>
  );
}

function ActuatorIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}

function FeedbackIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9" />
    </svg>
  );
}

const IconMap: Record<string, React.FC<{ color: string }>> = {
  sensors: SensorIcon,
  cloud: CloudIcon,
  actuators: ActuatorIcon,
  feedback: FeedbackIcon,
};

// ─── Geometry helpers ─────────────────────────────────────────────────────────
const RADIUS = 140; // loop radius
const CENTER = 200; // SVG center
const NODE_R = 36; // node circle radius

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

  // Calculate arc midpoint (perpendicular to chord)
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

// ─── Main Component ──────────────────────────────────────────────────────────
export default function HowWeBuildSection() {
  const [activeStage, setActiveStage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeRef = useRef(0);
  const [, setTick] = useState(0);

  // Intersection observer
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setIsVisible(true); }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Animation loop
  useEffect(() => {
    if (!isVisible) return;
    let raf: number;
    const animate = (ts: number) => {
      timeRef.current = ts * 0.001;
      setTick(Math.floor(ts / 100));
      // Auto-rotate active stage every 3s
      setActiveStage(Math.floor((ts * 0.001) / 3) % STAGES.length);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isVisible]);

  const activeData = STAGES[activeStage];

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
    return { from, to, cpX, cpY, path: `M ${from.x} ${from.y} Q ${cpX} ${cpY} ${to.x} ${to.y}` };
  });

  return (
    <section id="build" ref={ref} className="relative py-32 px-6 md:px-16 overflow-hidden" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(6,182,212,0.04) 0%, #06080e 100%)" }}>
      <div className="max-w-6xl mx-auto relative">

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

        {/* Loop diagram */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: Animated SVG loop */}
          <div className={`relative flex items-center justify-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`} style={{ transitionDelay: "200ms" }}>
            <svg viewBox="0 0 400 400" className="w-full max-w-[420px]">

              {/* Background glow */}
              <defs>
                <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={activeData.color} stopOpacity="0.15" />
                  <stop offset="100%" stopColor={activeData.color} stopOpacity="0" />
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
                  {/* Base arc */}
                  <path d={arc.path} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" strokeLinecap="round" />
                  {/* Active arc glow */}
                  {i === activeStage && (
                    <path d={arc.path} fill="none" stroke={STAGES[i].color} strokeWidth="3" strokeLinecap="round" filter="url(#glow)" opacity="0.6">
                      <animate attributeName="stroke-dasharray" values="0 200;200 0" dur="1.5s" repeatCount="indefinite" />
                    </path>
                  )}
                </g>
              ))}

              {/* Animated particles along arcs */}
              {STAGES.map((stage, i) => (
                <g key={`particles-${i}`}>
                  <Particle fromIdx={i} toIdx={(i + 1) % STAGES.length} color={stage.color} delay={i * 0.75} />
                  <Particle fromIdx={i} toIdx={(i + 1) % STAGES.length} color={stage.color} delay={i * 0.75 + 1.5} />
                </g>
              ))}

              {/* Center text */}
              <text x={CENTER} y={CENTER - 20} textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.4)" fontFamily="monospace">
                SMART CITY
              </text>
              <text x={CENTER} y={CENTER} textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.4)" fontFamily="monospace">
                FEEDBACK LOOP
              </text>
              <g transform={`translate(${CENTER - 10}, ${CENTER + 12})`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
                  <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9" />
                </svg>
              </g>

              {/* Stage nodes */}
              {STAGES.map((stage, i) => {
                const pos = getNodePos(i, STAGES.length);
                const isActive = i === activeStage;
                const IconComp = IconMap[stage.icon];
                const pulseR = NODE_R + (isActive ? 12 : 0);

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

                    {/* Node background */}
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
                    <g transform={`translate(${pos.x - 14}, ${pos.y - 14})`}>
                      <IconComp color={isActive ? stage.color : "rgba(255,255,255,0.3)"} />
                    </g>

                    {/* Label */}
                    <text
                      x={pos.x}
                      y={pos.y + NODE_R + 18}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="600"
                      fill={isActive ? stage.color : "rgba(255,255,255,0.35)"}
                      fontFamily="'Space Grotesk', monospace"
                      style={{ transition: "fill 0.5s ease" }}
                    >
                      {stage.label.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Right: Detail panel */}
          <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`} style={{ transitionDelay: "400ms" }}>
            <div
              className="liquid-glass rounded-3xl overflow-hidden transition-all duration-500"
              style={{ borderColor: `${activeData.color}25` }}
            >
              {/* Top shimmer */}
              <div
                className="h-px w-full"
                style={{ background: `linear-gradient(90deg, transparent, ${activeData.color}40, transparent)` }}
              />

              <div className="px-7 pt-7 pb-7">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500"
                    style={{
                      background: `${activeData.color}15`,
                      border: `1px solid ${activeData.color}25`,
                      boxShadow: `0 0 30px ${activeData.glowColor}`,
                    }}
                  >
                    {(() => {
                      const IconComp = IconMap[activeData.icon];
                      return <IconComp color={activeData.color} />;
                    })()}
                  </div>
                  <div>
                    <div className="text-[10px] font-mono tracking-widest uppercase mb-1" style={{ color: `${activeData.color}70` }}>
                      Stage {activeStage + 1} of {STAGES.length}
                    </div>
                    <h3 className="font-display text-xl font-bold" style={{ color: activeData.color }}>
                      {activeData.label}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-white/55 text-sm leading-relaxed mb-6">{activeData.desc}</p>

                {/* Items */}
                <div className="space-y-2.5">
                  {activeData.items.map((item, i) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-300"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        color: "rgba(255,255,255,0.6)",
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? "none" : "translateX(20px)",
                        transition: `all 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 100}ms`,
                      }}
                    >
                      <span className="text-base">{item.split(" ")[0]}</span>
                      <span>{item.split(" ").slice(1).join(" ")}</span>
                    </div>
                  ))}
                </div>

                {/* Loop indicator */}
                <div className="mt-6 flex items-center gap-2">
                  {STAGES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveStage(i)}
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: i === activeStage ? "32px" : "8px",
                        background: i === activeStage ? activeData.color : "rgba(255,255,255,0.15)",
                      }}
                    />
                  ))}
                </div>
              </div>
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

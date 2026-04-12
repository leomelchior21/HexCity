"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

// ─── Focus Point Data with Full Questions ──────────────────────────────────

const FOCUS_POINTS = [
  {
    id: "energy",
    label: "Energy",
    color: "#F59E0B",
    glowColor: "rgba(245,158,11,0.30)",
    iconPath: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    questions: {
      "1.1 Observation": [
        "Where is energy being used in this area?",
        "Is there any visible waste of energy?",
        "Is lighting efficient or excessive?",
      ],
      "1.2 Cause": [
        "Why does this area consume so much energy?",
        "Is this consumption necessary or poorly planned?",
        "What type of energy source is being used?",
      ],
      "1.3 System": [
        "How does energy impact other systems (e.g., mobility, water)?",
        "Is there dependence on non-renewable sources?",
        "Are there failures in energy distribution?",
      ],
      "1.4 Human Impact": [
        "Who pays the highest cost for this energy?",
        "Are there power shortages or instability?",
        "Does this affect comfort or safety?",
      ],
      "1.5 Future": [
        "Is this level of consumption sustainable long term?",
        "What happens if demand increases?",
      ],
      "1.6 Problem Definition": [
        "Is the issue high consumption or low efficiency?",
      ],
    },
  },
  {
    id: "water",
    label: "Water",
    color: "#06B6D4",
    glowColor: "rgba(6,182,212,0.30)",
    iconPath: "M12 2.69l5.66 5.66a8 8 0 11-11.31 0z",
    questions: {
      "2.1 Observation": [
        "Are there signs of waste or leakage?",
        "Does the water appear clean or polluted?",
      ],
      "2.2 Cause": [
        "Where does this water come from?",
        "Why might there be scarcity or misuse?",
      ],
      "2.3 System": [
        "How does water usage affect energy or vegetation?",
        "Is there proper treatment and distribution?",
      ],
      "2.4 Human Impact": [
        "Who has access to clean water?",
        "Is there inequality in access?",
      ],
      "2.5 Future": [
        "What happens during drought periods?",
        "Can the system support city growth?",
      ],
      "2.6 Problem Definition": [
        "Is the issue scarcity or poor management?",
      ],
    },
  },
  {
    id: "air",
    label: "Air",
    color: "#7DD3FC",
    glowColor: "rgba(125,211,252,0.25)",
    iconPath: "M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2",
    questions: {
      "3.1 Observation": [
        "Does the air appear clean or polluted?",
        "Are there visible sources of pollution (traffic, industry)?",
      ],
      "3.2 Cause": [
        "What is generating this pollution?",
        "Is it caused by transportation, industry, or other factors?",
      ],
      "3.3 System": [
        "How does air quality connect with mobility and energy?",
        "Is there enough vegetation to balance the system?",
      ],
      "3.4 Human Impact": [
        "Who is most affected by poor air quality?",
        "Does this impact health (respiratory issues, allergies)?",
      ],
      "3.5 Future": [
        "Will air quality improve or worsen over time?",
        "Does urban growth increase the problem?",
      ],
      "3.6 Problem Definition": [
        "Is the issue emissions or lack of mitigation?",
      ],
    },
  },
  {
    id: "mobility",
    label: "Mobility",
    color: "#F97316",
    glowColor: "rgba(249,115,22,0.30)",
    iconPath: "M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h2m12 0h2a2 2 0 012 2v6a2 2 0 01-2 2h-2M5 15h14M5 17a2 2 0 100 4 2 2 0 000-4zm14 0a2 2 0 100 4 2 2 0 000-4z",
    questions: {
      "4.1 Observation": [
        "Is there congestion?",
        "Can people move efficiently through the area?",
      ],
      "4.2 Cause": [
        "Why is there so much traffic?",
        "Is public transportation effective?",
      ],
      "4.3 System": [
        "How does mobility impact air quality and energy use?",
        "Is the city designed for cars or for people?",
      ],
      "4.4 Human Impact": [
        "How much time do people lose in transportation?",
        "Who has limited access to mobility options?",
      ],
      "4.5 Future": [
        "Can this system handle population growth?",
        "Will congestion increase or collapse the system?",
      ],
      "4.6 Problem Definition": [
        "Is the issue too many cars or lack of alternatives?",
      ],
    },
  },
  {
    id: "waste",
    label: "Waste",
    color: "#EF4444",
    glowColor: "rgba(239,68,68,0.25)",
    iconPath: "M23 4l0 6-6 0M1 20l0-6 6 0M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15",
    questions: {
      "5.1 Observation": [
        "Is there visible waste accumulation?",
        "Is there evidence of recycling or waste separation?",
      ],
      "5.2 Cause": [
        "Why is waste being generated in this way?",
        "Is the issue lack of infrastructure or awareness?",
      ],
      "5.3 System": [
        "How does waste affect water, soil, and health?",
        "Is there any form of reuse or recycling system?",
      ],
      "5.4 Human Impact": [
        "Who lives near waste accumulation areas?",
        "Are there health or safety risks?",
      ],
      "5.5 Future": [
        "Is this level of waste sustainable?",
        "Where will this waste go in the long term?",
      ],
      "5.6 Problem Definition": [
        "Is the issue waste production or waste management?",
      ],
    },
  },
  {
    id: "green",
    label: "Green",
    color: "#22C55E",
    glowColor: "rgba(34,197,94,0.30)",
    iconPath: "M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75",
    questions: {
      "6.1 Observation": [
        "Are there enough green areas?",
        "Are trees and plants healthy?",
      ],
      "6.2 Cause": [
        "Why is there a lack or abundance of vegetation?",
        "Has there been deforestation or poor planning?",
      ],
      "6.3 System": [
        "How does vegetation impact temperature, air, and water?",
        "Is there biodiversity in this area?",
      ],
      "6.4 Human Impact": [
        "Do people have access to green spaces?",
        "Does this affect well-being and mental health?",
      ],
      "6.5 Future": [
        "Is the city gaining or losing green areas?",
        "Will climate conditions worsen without vegetation?",
      ],
      "6.6 Problem Definition": [
        "Is the issue lack of green space or poor distribution?",
      ],
    },
  },
];

// ─── Hexagon SVG Component ─────────────────────────────────────────────────
function HexShape({
  size = 80,
  color,
  active,
  pulsing,
}: {
  size?: number;
  color: string;
  active: boolean;
  pulsing: boolean;
}) {
  const r = size / 2;
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return `${r + r * Math.cos(angle)},${r + r * Math.sin(angle)}`;
  }).join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-shrink-0">
      {/* Outer pulse ring */}
      {pulsing && (
        <polygon
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity="0.4"
          className="hex-pulse-ring"
        />
      )}
      {/* Main hex */}
      <polygon
        points={points}
        fill={active ? `${color}18` : "rgba(255,255,255,0.03)"}
        stroke={active ? color : "rgba(255,255,255,0.10)"}
        strokeWidth={active ? 2 : 1}
        className="hex-main"
        style={{
          filter: active ? `drop-shadow(0 0 12px ${color}60)` : "none",
          transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      />
    </svg>
  );
}

// ─── Expanded Card (Full-Screen Overlay) ───────────────────────────────────
function ExpandedCard({
  fp,
  onClose,
}: {
  fp: (typeof FOCUS_POINTS)[0];
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => setVisible(true));

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 500);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) handleClose();
  };

  const sectionKeys = Object.keys(fp.questions);

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(32px) saturate(180%)",
        WebkitBackdropFilter: "blur(32px) saturate(180%)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Content container */}
      <div
        className="relative w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto rounded-3xl"
        style={{
          background: "rgba(12,12,12,0.90)",
          border: `1px solid ${fp.color}25`,
          boxShadow: `0 0 80px ${fp.glowColor.replace("0.30", "0.12")}, 0 24px 80px rgba(0,0,0,0.8)`,
          transform: visible ? "scale(1) translateY(0)" : "scale(0.92) translateY(40px)",
          transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Top glow line */}
        <div
          className="h-px w-full sticky top-0 z-10"
          style={{ background: `linear-gradient(90deg, transparent, ${fp.color}50, transparent)` }}
        />

        {/* Header */}
        <div className="sticky top-0 z-10 px-8 pt-8 pb-6" style={{ background: "rgba(12,12,12,0.95)", backdropFilter: "blur(16px)" }}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-5">
              {/* Hex icon */}
              <HexShape size={56} color={fp.color} active pulsing={false} />
              <div>
                <span
                  className="text-[10px] font-mono tracking-[0.25em] uppercase block mb-1"
                  style={{ color: `${fp.color}60` }}
                >
                  Focus Point
                </span>
                <h2
                  className="font-display text-3xl md:text-4xl font-bold tracking-tight"
                  style={{ color: fp.color }}
                >
                  {fp.label.toUpperCase()}
                </h2>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
                color: "rgba(255,255,255,0.5)",
              }}
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Subtitle hint */}
          <p className="mt-4 text-sm text-white/35 italic">
            Use your sketchbook to document observations for each question
          </p>

          {/* Section divider */}
          <div className="mt-5 h-px" style={{ background: `linear-gradient(90deg, ${fp.color}30, transparent)` }} />
        </div>

        {/* Questions Grid */}
        <div className="px-8 pb-10 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {sectionKeys
              .filter((sectionKey) => fp.questions[sectionKey as keyof typeof fp.questions] !== undefined)
              .map((sectionKey, si) => {
                const questions = fp.questions[sectionKey as keyof typeof fp.questions]!;
                return (
                <div
                  key={sectionKey}
                  className="rounded-2xl p-5"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(20px)",
                    transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${si * 80 + 200}ms`,
                  }}
                >
                  {/* Section label */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: fp.color }}
                    />
                    <span
                      className="text-xs font-mono font-semibold tracking-wide uppercase"
                      style={{ color: fp.color }}
                    >
                      {sectionKey}
                    </span>
                  </div>

                  {/* Questions list */}
                  <ul className="space-y-2.5">
                    {questions.map((q, qi) => (
                      <li
                        key={qi}
                        className="text-sm leading-relaxed text-white/50 pl-5 relative"
                        style={{
                          opacity: visible ? 1 : 0,
                          transform: visible ? "translateX(0)" : "translateX(-12px)",
                          transition: `all 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${si * 80 + qi * 50 + 350}ms`,
                        }}
                      >
                        {/* Bullet */}
                        <span
                          className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full"
                          style={{
                            background: `${fp.color}50`,
                          }}
                        />
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div
            className="mt-8 p-5 rounded-2xl text-center"
            style={{
              background: `${fp.color}08`,
              border: `1px dashed ${fp.color}25`,
              opacity: visible ? 1 : 0,
              transition: `opacity 0.5s ease ${900}ms`,
            }}
          >
            <p className="text-sm text-white/40">
              💡 <span className="text-white/60 font-medium">Tip:</span> Sketch your observations, note patterns, and define the core problem at the end
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────
export default function FocusPointsPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const userInteractedRef = useRef(false);

  const activeFp = FOCUS_POINTS[activeIndex];

  // Auto-cycle every 4 seconds
  const startAutoCycle = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!userInteractedRef.current) {
        setActiveIndex((prev) => (prev + 1) % FOCUS_POINTS.length);
      }
    }, 4000);
  }, []);

  useEffect(() => {
    startAutoCycle();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAutoCycle]);

  const handleSelect = (index: number) => {
    userInteractedRef.current = true;
    setActiveIndex(index);
    // Resume auto-cycle after 12s of inactivity
    setTimeout(() => {
      userInteractedRef.current = false;
      startAutoCycle();
    }, 12000);
  };

  const handleExpand = (id: string) => {
    setExpandedId(id);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleCollapse = () => {
    setExpandedId(null);
    startAutoCycle();
  };

  // Circular positions for 6 items
  const hexPositions = FOCUS_POINTS.map((_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    const radius = 160;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  });

  return (
    <main className="min-h-screen bg-[#020202] overflow-hidden relative">
      {/* Background ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${activeFp.glowColor.replace("0.30", "0.06")}, transparent)`,
          transition: "background 0.8s ease",
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Header */}
      <header className="relative z-10 pt-8 pb-4 px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/20 block mb-1">
              HEXCITY · INTERACTIVE
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold">
              HEX <span className="gradient-text">FOCUS POINTS</span>
            </h1>
          </div>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              color: "rgba(255,255,255,0.35)",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            ← Back
          </Link>
        </div>
      </header>

      {/* Main Interactive Area */}
      <div className="relative z-10 flex flex-col items-center justify-center" style={{ minHeight: "calc(100vh - 120px)" }}>
        {/* Hexagon Ring */}
        <div className="relative" style={{ width: 420, height: 420 }}>
          {/* Center info */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
            style={{ zIndex: 5 }}
          >
            <div
              className="w-20 h-20 mx-auto mb-3 rounded-full flex items-center justify-center"
              style={{
                background: `${activeFp.color}10`,
                border: `1px solid ${activeFp.color}30`,
                boxShadow: `0 0 40px ${activeFp.glowColor}`,
                transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={activeFp.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={activeFp.iconPath} />
              </svg>
            </div>
            <span
              className="text-2xl font-display font-bold block transition-colors duration-400"
              style={{ color: activeFp.color }}
            >
              {activeFp.label.toUpperCase()}
            </span>
            <span className="text-[10px] font-mono tracking-widest text-white/25 mt-1 block">
              TAP TO EXPLORE
            </span>
          </div>

          {/* Connecting lines from center to each hex */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            {hexPositions.map((pos, i) => (
              <line
                key={i}
                x1="210"
                y1="210"
                x2={210 + pos.x}
                y2={210 + pos.y}
                stroke={i === activeIndex ? activeFp.color : "rgba(255,255,255,0.06)"}
                strokeWidth={i === activeIndex ? 1.5 : 1}
                strokeDasharray={i === activeIndex ? "none" : "4 4"}
                style={{ transition: "all 0.5s ease" }}
              />
            ))}
          </svg>

          {/* Hex buttons */}
          {FOCUS_POINTS.map((fp, i) => {
            const isActive = i === activeIndex;
            const pos = hexPositions[i];
            return (
              <button
                key={fp.id}
                onClick={() => handleSelect(i)}
                onDoubleClick={() => handleExpand(fp.id)}
                className="absolute flex flex-col items-center gap-2 group"
                style={{
                  left: 210 + pos.x - 40,
                  top: 210 + pos.y - 40,
                  width: 80,
                  zIndex: isActive ? 10 : 2,
                  transform: isActive ? "scale(1.12)" : "scale(1)",
                  transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                <HexShape
                  size={80}
                  color={fp.color}
                  active={isActive}
                  pulsing={isActive}
                />
                <span
                  className="text-[10px] font-semibold tracking-wider uppercase transition-colors duration-300"
                  style={{ color: isActive ? fp.color : "rgba(255,255,255,0.35)" }}
                >
                  {fp.label}
                </span>

                {/* Expand hint on hover */}
                <span
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] text-white/20 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
                >
                  dbl-click to expand
                </span>
              </button>
            );
          })}
        </div>

        {/* Bottom legend / instruction */}
        <div className="mt-12 text-center">
          <p className="text-xs text-white/25">
            <span className="text-white/45 font-medium">Click</span> a hex to highlight ·{" "}
            <span className="text-white/45 font-medium">Double-click</span> to expand questions
          </p>

          {/* Active indicator dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {FOCUS_POINTS.map((fp, i) => (
              <button
                key={fp.id}
                onClick={() => handleSelect(i)}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  background: i === activeIndex ? fp.color : "rgba(255,255,255,0.15)",
                  boxShadow: i === activeIndex ? `0 0 8px ${fp.color}60` : "none",
                  transform: i === activeIndex ? "scale(1.4)" : "scale(1)",
                }}
                aria-label={fp.label}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Expanded Card Overlay */}
      {expandedId && (
        <ExpandedCard
          fp={FOCUS_POINTS.find((f) => f.id === expandedId)!}
          onClose={handleCollapse}
        />
      )}
    </main>
  );
}

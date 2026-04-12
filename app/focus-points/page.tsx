"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

// ─── Focus Point Data ──────────────────────────────────────────────────────

const FOCUS_POINTS = [
  {
    id: "energy",
    number: 1,
    label: "Energy",
    color: "#F59E0B",
    glowColor: "rgba(245,158,11,0.30)",
    iconPath: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    questions: [
      "What are three visible energy-related problems in São Paulo?",
      "What do these problems suggest about how energy is being used or wasted?",
      "If these problems keep happening, what underlying pattern or dependency do they reveal about the city's energy system?",
      "What decision, behavior, or structural choice (that people usually don't notice) could be creating this pattern?",
    ],
  },
  {
    id: "water",
    number: 2,
    label: "Water",
    color: "#06B6D4",
    glowColor: "rgba(6,182,212,0.30)",
    iconPath: "M12 2.69l5.66 5.66a8 8 0 11-11.31 0z",
    questions: [
      "What are three common water-related problems in São Paulo?",
      "What patterns do you notice between these problems?",
      "What do these patterns reveal about how water is managed or distributed in the city?",
      "What hidden factor (such as infrastructure, planning, or behavior) could be causing this situation?",
    ],
  },
  {
    id: "air",
    number: 3,
    label: "Air",
    color: "#7DD3FC",
    glowColor: "rgba(125,211,252,0.25)",
    iconPath: "M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2",
    questions: [
      "What are three noticeable air-related problems in São Paulo?",
      "What are their most immediate causes?",
      "What do these causes reveal about how the city produces pollution?",
      "What underlying urban choice or system (transport, industry, planning) might be driving this pattern?",
    ],
  },
  {
    id: "mobility",
    number: 4,
    label: "Mobility",
    color: "#F97316",
    glowColor: "rgba(249,115,22,0.30)",
    iconPath: "M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h2m12 0h2a2 2 0 012 2v6a2 2 0 01-2 2h-2M5 15h14M5 17a2 2 0 100 4 2 2 0 000-4zm14 0a2 2 0 100 4 2 2 0 000-4z",
    questions: [
      "What are three common mobility problems in São Paulo?",
      "What do these problems reveal about how people move through the city?",
      "What pattern do you see in how transportation is organized or prioritized?",
      "What hidden decision or structural factor could be reinforcing this pattern?",
    ],
  },
  {
    id: "waste",
    number: 5,
    label: "Waste",
    color: "#EF4444",
    glowColor: "rgba(239,68,68,0.25)",
    iconPath: "M23 4l0 6-6 0M1 20l0-6 6 0M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15",
    questions: [
      "What are three visible waste-related problems in São Paulo?",
      "What patterns do these problems share?",
      "What do these patterns reveal about how waste is handled in the city?",
      "What unseen factor (system, behavior, or infrastructure) could be causing this?",
    ],
  },
  {
    id: "green",
    number: 6,
    label: "Green",
    color: "#22C55E",
    glowColor: "rgba(34,197,94,0.30)",
    iconPath: "M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75",
    questions: [
      "What are three visible issues related to green spaces in São Paulo?",
      "What do these issues indicate about the city's environment?",
      "What pattern do you notice in how green areas are distributed or maintained?",
      "What hidden decision or planning choice could explain this pattern?",
    ],
  },
];

// ─── Hexagon SVG Component with Number Inside ───────────────────────────────
function HexShape({
  size = 80,
  color,
  active,
  pulsing,
  number,
}: {
  size?: number;
  color: string;
  active: boolean;
  pulsing: boolean;
  number: number;
}) {
  const r = size / 2;
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return `${r + r * Math.cos(angle)},${r + r * Math.sin(angle)}`;
  }).join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-shrink-0">
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
      <polygon
        points={points}
        fill={active ? `${color}15` : "rgba(255,255,255,0.02)"}
        stroke={active ? color : "rgba(255,255,255,0.08)"}
        strokeWidth={active ? 1.5 : 1}
        className="hex-main"
        style={{
          filter: active ? `drop-shadow(0 0 16px ${color}50)` : "none",
          transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      />
      <text
        x={r}
        y={r}
        textAnchor="middle"
        dominantBaseline="central"
        fill={active ? color : "rgba(255,255,255,0.20)"}
        fontSize={size * 0.32}
        fontWeight="700"
        fontFamily="Space Grotesk, sans-serif"
        style={{ transition: "fill 0.4s ease" }}
      >
        {number}
      </text>
    </svg>
  );
}

// ─── Expanded Card with Carousel ───────────────────────────────────────────
function ExpandedCard({
  fp,
  onClose,
}: {
  fp: (typeof FOCUS_POINTS)[0];
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [slideDir, setSlideDir] = useState<"left" | "right">("right");
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  const goTo = (index: number) => {
    setSlideDir(index > carouselIndex ? "right" : "left");
    setCarouselIndex(index);
  };

  const totalQuestions = fp.questions.length;
  const currentQ = fp.questions[carouselIndex];

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        background: "rgba(0,0,0,0.88)",
        backdropFilter: "blur(32px) saturate(180%)",
        WebkitBackdropFilter: "blur(32px) saturate(180%)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div
        className="relative w-full max-w-2xl mx-4 rounded-3xl overflow-hidden"
        style={{
          background: "rgba(12,12,12,0.92)",
          border: `1px solid ${fp.color}25`,
          boxShadow: `0 0 80px ${fp.glowColor.replace("0.30", "0.12")}, 0 24px 80px rgba(0,0,0,0.8)`,
          transform: visible ? "scale(1) translateY(0)" : "scale(0.92) translateY(40px)",
          transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Top glow line */}
        <div
          className="h-px w-full"
          style={{ background: `linear-gradient(90deg, transparent, ${fp.color}50, transparent)` }}
        />

        {/* Header */}
        <div className="px-8 pt-8 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${fp.color}12`, border: `1px solid ${fp.color}25` }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={fp.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={fp.iconPath} />
                </svg>
              </div>
              <div>
                <span
                  className="text-[10px] font-mono tracking-[0.25em] uppercase block mb-0.5"
                  style={{ color: `${fp.color}60` }}
                >
                  Focus Point {fp.number}
                </span>
                <h2
                  className="font-display text-2xl md:text-3xl font-bold tracking-tight"
                  style={{ color: fp.color }}
                >
                  {fp.label.toUpperCase()}
                </h2>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 flex-shrink-0"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
                color: "rgba(255,255,255,0.5)",
              }}
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-4 h-px" style={{ background: `linear-gradient(90deg, ${fp.color}30, transparent)` }} />
        </div>

        {/* Carousel Area */}
        <div className="px-8 pb-6">
          {/* Question number badge */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span
                className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg"
                style={{
                  background: `${fp.color}15`,
                  color: fp.color,
                  border: `1px solid ${fp.color}25`,
                }}
              >
                Q{carouselIndex + 1} / {totalQuestions}
              </span>
              <span className="text-[10px] text-white/25 tracking-wide">
                {carouselIndex === 0 && "OBSERVATION"}
                {carouselIndex === 1 && "PATTERNS"}
                {carouselIndex === 2 && "SYSTEM"}
                {carouselIndex === 3 && "HIDDEN FACTOR"}
              </span>
            </div>
          </div>

          {/* Question text with slide animation */}
          <div className="relative min-h-[120px] flex items-center justify-center overflow-hidden rounded-2xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p
              key={carouselIndex}
              className="text-lg md:text-xl font-medium text-white/75 text-center leading-relaxed px-6 py-8"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible
                  ? slideDir === "right"
                    ? "translateX(0)"
                    : "translateX(0)"
                  : slideDir === "right"
                    ? "translateX(60px)"
                    : "translateX(-60px)",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {currentQ}
            </p>
          </div>
        </div>

        {/* Carousel Navigation */}
        <div className="px-8 pb-8">
          <div className="flex items-center justify-between">
            {/* Prev button */}
            <button
              onClick={() => goTo(Math.max(0, carouselIndex - 1))}
              disabled={carouselIndex === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
              style={{
                color: carouselIndex === 0 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.5)",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Prev
            </button>

            {/* Dot indicators */}
            <div className="flex items-center gap-1.5">
              {fp.questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === carouselIndex ? 24 : 6,
                    background: i === carouselIndex ? fp.color : "rgba(255,255,255,0.12)",
                    boxShadow: i === carouselIndex ? `0 0 8px ${fp.color}50` : "none",
                  }}
                  aria-label={`Question ${i + 1}`}
                />
              ))}
            </div>

            {/* Next button */}
            <button
              onClick={() => goTo(Math.min(totalQuestions - 1, carouselIndex + 1))}
              disabled={carouselIndex === totalQuestions - 1}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
              style={{
                color: carouselIndex === totalQuestions - 1 ? "rgba(255,255,255,0.15)" : fp.color,
                background: carouselIndex === totalQuestions - 1 ? "rgba(255,255,255,0.04)" : `${fp.color}10`,
                border: `1px solid ${carouselIndex === totalQuestions - 1 ? "rgba(255,255,255,0.07)" : fp.color + "25"}`,
              }}
            >
              Next
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Bottom tip */}
        <div
          className="mx-8 mb-6 p-4 rounded-xl text-center"
          style={{
            background: `${fp.color}06`,
            border: `1px dashed ${fp.color}18`,
            opacity: visible ? 1 : 0,
            transition: `opacity 0.5s ease 300ms`,
          }}
        >
          <p className="text-xs text-white/30">
            💡 <span className="text-white/50 font-medium">Sketch your answer</span> — use your sketchbook to document observations
          </p>
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

  const startAutoCycle = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!userInteractedRef.current) {
        setActiveIndex((prev) => (prev + 1) % FOCUS_POINTS.length);
      }
    }, 1000);
  }, []);

  useEffect(() => {
    startAutoCycle();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAutoCycle]);

  // Tap to highlight, if already highlighted → expand
  const handleTap = (index: number) => {
    userInteractedRef.current = true;

    if (index === activeIndex) {
      setExpandedId(FOCUS_POINTS[index].id);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      setActiveIndex(index);
      setTimeout(() => {
        userInteractedRef.current = false;
        startAutoCycle();
      }, 12000);
    }
  };

  const handleCollapse = () => {
    setExpandedId(null);
    startAutoCycle();
  };

  const RADIUS = 170;

  const hexPositions = FOCUS_POINTS.map((_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return {
      x: Math.cos(angle) * RADIUS,
      y: Math.sin(angle) * RADIUS,
    };
  });

  const CONTAINER_SIZE = 460;
  const CENTER = CONTAINER_SIZE / 2;
  const HEX_SIZE = 72;
  const HALF_HEX = HEX_SIZE / 2;

  return (
    <main className="min-h-screen bg-[#020202] overflow-hidden relative flex flex-col">
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
      <header className="relative z-10 pt-6 pb-2 px-8 flex-shrink-0">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/20 block mb-1">
              HEXCITY · INTERACTIVE
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold">
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
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="relative" style={{ width: CONTAINER_SIZE, height: CONTAINER_SIZE }}>
          {/* Center info */}
          <div
            className="absolute text-center pointer-events-none"
            style={{
              left: CENTER - 60,
              top: CENTER - 50,
              width: 120,
              zIndex: 5,
            }}
          >
            <div
              className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center relative"
              style={{
                background: `${activeFp.color}08`,
                border: `1px solid ${activeFp.color}20`,
                boxShadow: `0 0 40px ${activeFp.glowColor.replace("0.30", "0.15")}`,
                transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={activeFp.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.4s ease" }}>
                <path d={activeFp.iconPath} />
              </svg>
              <div
                className="absolute inset-[-6px] rounded-full border border-white/[0.04]"
                style={{ animation: "spin 20s linear infinite" }}
              />
            </div>

            <span
              className="text-xl font-display font-bold block transition-colors duration-400"
              style={{ color: activeFp.color }}
            >
              {activeFp.label.toUpperCase()}
            </span>
            <span className="text-[9px] font-mono tracking-widest text-white/20 mt-0.5 block">
              TAP TO EXPLORE
            </span>
          </div>

          {/* Connecting lines from center to hex edge */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            {hexPositions.map((pos, i) => {
              const lineLen = RADIUS - HALF_HEX;
              const endX = CENTER + pos.x * (lineLen / RADIUS);
              const endY = CENTER + pos.y * (lineLen / RADIUS);
              return (
                <line
                  key={i}
                  x1={CENTER}
                  y1={CENTER}
                  x2={endX}
                  y2={endY}
                  stroke={i === activeIndex ? activeFp.color : "rgba(255,255,255,0.05)"}
                  strokeWidth={i === activeIndex ? 1.5 : 1}
                  strokeDasharray={i === activeIndex ? "none" : "4 4"}
                  style={{ transition: "all 0.5s ease" }}
                />
              );
            })}
          </svg>

          {/* Hex buttons */}
          {FOCUS_POINTS.map((fp, i) => {
            const isActive = i === activeIndex;
            const pos = hexPositions[i];
            return (
              <button
                key={fp.id}
                onClick={() => handleTap(i)}
                className="absolute flex flex-col items-center gap-1.5 group"
                style={{
                  left: CENTER + pos.x - HALF_HEX,
                  top: CENTER + pos.y - HALF_HEX,
                  width: HEX_SIZE,
                  zIndex: isActive ? 10 : 2,
                  transform: isActive ? "scale(1.08)" : "scale(1)",
                  transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                <HexShape
                  size={HEX_SIZE}
                  color={fp.color}
                  active={isActive}
                  pulsing={isActive}
                  number={fp.number}
                />
                <span
                  className="text-[9px] font-semibold tracking-wider uppercase transition-colors duration-300 whitespace-nowrap"
                  style={{ color: isActive ? fp.color : "rgba(255,255,255,0.28)" }}
                >
                  {fp.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom instruction + dots */}
      <div className="relative z-10 flex-shrink-0 text-center pb-8">
        <p className="text-xs text-white/25">
          <span className="text-white/45 font-medium">Tap</span> a hex to highlight · tap again to expand
        </p>

        <div className="flex items-center justify-center gap-2 mt-3">
          {FOCUS_POINTS.map((fp, i) => (
            <button
              key={fp.id}
              onClick={() => handleTap(i)}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                background: i === activeIndex ? fp.color : "rgba(255,255,255,0.12)",
                boxShadow: i === activeIndex ? `0 0 8px ${fp.color}60` : "none",
                transform: i === activeIndex ? "scale(1.4)" : "scale(1)",
              }}
              aria-label={fp.label}
            />
          ))}
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

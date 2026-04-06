"use client";
import { useState } from "react";
import { useInView } from "@/hooks/useScrollAnimation";
import { useMouseParallax, tiltStyle } from "@/hooks/useMouseParallax";

const SHAPE_FACTS = [
  {
    id: "hex",
    label: "Hexagon",
    sides: 6,
    color: "#A78BFA",
    glowColor: "rgba(167,139,250,0.35)",
    tileEfficiency: 100,
    perimeterRatio: 1.0,
    facts: [
      "Tiles perfectly — zero wasted space",
      "Most neighbors per cell: 6",
      "Closest shape to a circle",
      "Minimum perimeter per area",
    ],
    highlight: true,
  },
  {
    id: "square",
    label: "Square",
    sides: 4,
    color: "#06B6D4",
    glowColor: "rgba(6,182,212,0.25)",
    tileEfficiency: 100,
    perimeterRatio: 1.21,
    facts: [
      "Tiles perfectly but rigidly",
      "4 neighbors — less connected",
      "21% more perimeter than hex",
      "Harder to simulate curves",
    ],
  },
  {
    id: "triangle",
    label: "Triangle",
    sides: 3,
    color: "#22C55E",
    glowColor: "rgba(34,197,94,0.25)",
    tileEfficiency: 100,
    perimeterRatio: 1.73,
    facts: [
      "Tiles perfectly but awkwardly",
      "Alternating up/down — complex paths",
      "73% more perimeter than hex",
      "Poor isotropy for city planning",
    ],
  },
  {
    id: "circle",
    label: "Circle",
    sides: 0,
    color: "#F59E0B",
    glowColor: "rgba(245,158,11,0.25)",
    tileEfficiency: 78.5,
    perimeterRatio: 1.0,
    facts: [
      "Closest perimeter to hexagon",
      "Leaves 21.5% dead space when tiled",
      "No straight edges — hard to build",
      "Beautiful but inefficient at scale",
    ],
  },
];

// ─── Pillar data with fun facts ───────────────────────────────────────────
const PILLARS = [
  {
    icon: "⬡",
    iconBg: "rgba(167,139,250,0.15)",
    iconColor: "#A78BFA",
    label: "Hexagonal Planning",
    desc: "Efficient, equidistant zoning that mirrors natural patterns",
    facts: [
      "Students will design a 7-hex district with equal access to all services",
      "Each hex connects to exactly 6 neighbors — no dead ends, no bottlenecks",
      "They'll calculate optimal resource distribution using hex grid math",
    ],
  },
  {
    icon: "⚡",
    iconBg: "rgba(6,182,212,0.15)",
    iconColor: "#06B6D4",
    label: "Arduino Electronics",
    desc: "Real sensors and actuators making the city responsive",
    facts: [
      "Students wire real circuits: sensors read data, actuators take action",
      "They'll code in C++ on Arduino — from Tinkercad simulation to physical hardware",
      "Every hex has its own microcontroller communicating with the rest of the city",
    ],
  },
  {
    icon: "🌱",
    iconBg: "rgba(34,197,94,0.15)",
    iconColor: "#22C55E",
    label: "6 Sustainability Pillars",
    desc: "Energy, Water, Air, Mobility, Waste, and Green spaces",
    facts: [
      "Teams build smart bins that signal when full, automated irrigation, and air quality monitors",
      "Each pillar uses real sensors: DHT11 for temp/humidity, ultrasonic for distance, LDR for light",
      "Students present data dashboards showing their hex's performance on all 6 pillars",
    ],
  },
  {
    icon: "🏆",
    iconBg: "rgba(245,158,11,0.15)",
    iconColor: "#F59E0B",
    label: "Live Exhibition",
    desc: "August 2026 — fully built, running, demo-ready cities",
    facts: [
      "Students present their working city to a live audience — parents, judges, community",
      "All 28 groups must integrate seamlessly into one functioning smart city",
      "The city runs live: sensors detect, code processes, actuators respond in real time",
    ],
  },
];

function ShapeViz({ shape }: { shape: typeof SHAPE_FACTS[0] }) {
  const isHex = shape.id === "hex";

  const getPath = () => {
    if (shape.id === "hex") {
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        return `${50 + 38 * Math.cos(a)},${50 + 38 * Math.sin(a)}`;
      });
      return `M ${pts.join(" L ")} Z`;
    }
    if (shape.id === "square") return "M 16 16 L 84 16 L 84 84 L 16 84 Z";
    if (shape.id === "triangle") return "M 50 10 L 90 85 L 10 85 Z";
    return "";
  };

  return (
    <svg viewBox="0 0 100 100" width="80" height="80">
      {shape.id === "circle" ? (
        <circle
          cx="50" cy="50" r="40"
          fill={`${shape.color}15`}
          stroke={shape.color}
          strokeWidth={isHex ? 2.5 : 1.5}
        />
      ) : (
        <path
          d={getPath()}
          fill={`${shape.color}15`}
          stroke={shape.color}
          strokeWidth={isHex ? 2.5 : 1.5}
        />
      )}
      {isHex && (
        <text x="50" y="54" textAnchor="middle" fontSize="10" fill={shape.color} fontFamily="monospace" fontWeight="bold">
          ★
        </text>
      )}
    </svg>
  );
}

// ─── Pillar Card with dropdown ────────────────────────────────────────────
function PillarCard({ pillar, index, isInView, isOpen, onToggle }: {
  pillar: typeof PILLARS[0];
  index: number;
  isInView: boolean;
  isOpen: boolean;
  onToggle: () => void;
}) {

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-500"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${isOpen ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)"}`,
        boxShadow: isOpen
          ? "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)"
          : "0 2px 8px rgba(0,0,0,0.2)",
        opacity: isInView ? 1 : 0,
        transform: isInView ? "none" : "translateX(30px)",
        transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 100}ms`,
      }}
    >
      {/* Header (clickable) */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 text-left ripple-container"
      >
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition-transform duration-300"
          style={{
            background: pillar.iconBg,
            transform: isOpen ? "scale(1.1)" : "scale(1)",
          }}
        >
          {pillar.icon}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white/90">{pillar.label}</div>
          <div className="text-xs text-white/30 mt-0.5 truncate">{pillar.desc}</div>
        </div>

        {/* Chevron */}
        <div
          className="flex-shrink-0 transition-transform duration-300 text-white/25"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </button>

      {/* Expanded facts */}
      <div
        className="overflow-hidden transition-all duration-500 ease-out"
        style={{
          maxHeight: isOpen ? "300px" : "0px",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="px-5 pb-5 pt-0 space-y-2.5">
          {pillar.facts.map((fact, i) => (
            <div
              key={i}
              className="flex items-start gap-3 text-xs text-white/45 leading-relaxed"
              style={{
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? "translateY(0)" : "translateY(8px)",
                transition: `all 0.3s ease ${i * 80}ms`,
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                style={{ background: pillar.iconColor, opacity: 0.6 }}
              />
              {fact}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TheProjectSection() {
  const [activeShape, setActiveShape] = useState("hex");
  const selected = SHAPE_FACTS.find((s) => s.id === activeShape) ?? SHAPE_FACTS[0];
  const [openPillar, setOpenPillar] = useState<number | null>(null);

  const { ref: sectionRef, isInView } = useInView({ threshold: 0.05 });
  const { ref: shapeRef, isInView: shapeInView } = useInView({ threshold: 0.2 });

  return (
    <section id="project" ref={sectionRef} className="relative py-32 px-8 md:px-16 bg-black overflow-hidden">
      {/* Background orb */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(124,58,237,0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="max-w-5xl mx-auto relative">

        {/* -- Section: The Project -- */}
        <div className={`mb-24 transition-all duration-1000 ease-out ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div className="mb-3">
            <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/20">
              001 -- The Project
            </span>
          </div>

          <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
            {/* Left: Title + description */}
            <div>
              <h2 className="font-display text-6xl md:text-7xl font-bold leading-[0.95] mb-6">
                Design{" "}
                <span className="gradient-text">tomorrow's</span>{" "}
                smart city.
              </h2>
              <p className="text-white/40 text-base leading-relaxed max-w-md">
                HexCity is a 9th-grade engineering challenge where students design, prototype, and exhibit physical city models built on hexagonal city-planning principles -- wired with Arduino sensors and actuators.
              </p>
            </div>

            {/* Right: Pillar cards with dropdown */}
            <div className="space-y-2.5 max-w-md ml-auto">
              {PILLARS.map((pillar, i) => (
                <PillarCard
                  key={pillar.label}
                  pillar={pillar}
                  index={i}
                  isInView={isInView}
                  isOpen={openPillar === i}
                  onToggle={() => setOpenPillar(openPillar === i ? null : i)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Section divider */}
        <div className="section-divider mb-24" />

        {/* -- Section: Why Hexagons -- */}
        <div ref={shapeRef} className={`transition-all duration-1000 ease-out ${shapeInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div className="mb-3">
            <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/25">
              002 -- Why Hexagons
            </span>
          </div>

          <div className="text-center mb-14">
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-4">
              Hexagons are the{" "}
              <span className="gradient-text">bestagons.</span>
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              It's not an opinion -- it's geometry. Compare the shapes yourself.
            </p>
          </div>

          {/* Shape selector */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {SHAPE_FACTS.map((shape) => (
              <button
                key={shape.id}
                onClick={() => setActiveShape(shape.id)}
                className="flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 ripple-container"
                style={
                  activeShape === shape.id
                    ? {
                        background: `${shape.color}15`,
                        border: `1px solid ${shape.color}40`,
                        boxShadow: `0 0 20px ${shape.color}20`,
                      }
                    : {
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }
                }
              >
                <ShapeViz shape={shape} />
                <div className="text-left">
                  <div className="text-sm font-semibold" style={{ color: activeShape === shape.id ? shape.color : "rgba(255,255,255,0.6)" }}>
                    {shape.label}
                  </div>
                  {shape.sides > 0 && (
                    <div className="text-xs text-white/25 font-mono">{shape.sides} sides</div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Selected shape detail */}
          <ShapeDetail shape={selected} />
        </div>
      </div>
    </section>
  );
}

function ShapeDetail({ shape }: { shape: typeof SHAPE_FACTS[0] }) {
  const { ref, rotation, isHovered } = useMouseParallax(6);

  // Generate tiling pattern based on shape type
  const renderTilingPattern = () => {
    const cells = [];
    if (shape.id === "hex") {
      // Hexagonal grid
      for (let row = -2; row <= 2; row++) {
        for (let col = -3; col <= 3; col++) {
          const cx = 150 + col * 45 + (row % 2 === 1 ? 22.5 : 0);
          const cy = 100 + row * 39;
          const pts = Array.from({ length: 6 }, (_, i) => {
            const a = (Math.PI / 3) * i - Math.PI / 6;
            return `${cx + 20 * Math.cos(a)},${cy + 20 * Math.sin(a)}`;
          }).join(" ");
          cells.push(
            <polygon
              key={`h-${col}-${row}`}
              points={pts}
              fill={`${shape.color}18`}
              stroke={shape.color}
              strokeWidth="1"
              opacity="0.6"
              className="float-gentle"
              style={{ animationDelay: `${(col + row) * 0.2}s` }}
            />
          );
        }
      }
    } else if (shape.id === "square") {
      for (let row = -3; row <= 3; row++) {
        for (let col = -4; col <= 4; col++) {
          cells.push(
            <rect
              key={`s-${col}-${row}`}
              x={150 + col * 32}
              y={80 + row * 32}
              width="28"
              height="28"
              fill={`${shape.color}15`}
              stroke={shape.color}
              strokeWidth="1"
              opacity="0.5"
              className="float-gentle"
              style={{ animationDelay: `${(col + row) * 0.15}s` }}
            />
          );
        }
      }
    } else if (shape.id === "triangle") {
      for (let row = -3; row <= 3; row++) {
        for (let col = -4; col <= 4; col++) {
          const up = (col + row) % 2 === 0;
          const cx = 150 + col * 28 + (up ? 14 : 0);
          const cy = 80 + row * 24;
          cells.push(
            <polygon
              key={`t-${col}-${row}`}
              points={`${cx},${cy - 14} ${cx + 14},${cy + 14} ${cx - 14},${cy + 14}`}
              fill={`${shape.color}15`}
              stroke={shape.color}
              strokeWidth="1"
              opacity="0.5"
              className="float-gentle"
              style={{ animationDelay: `${(col + row) * 0.15}s` }}
            />
          );
        }
      }
    } else {
      // Circle - shows gaps
      for (let row = -3; row <= 3; row++) {
        for (let col = -4; col <= 4; col++) {
          cells.push(
            <circle
              key={`c-${col}-${row}`}
              cx={150 + col * 36}
              cy={80 + row * 36}
              r="15"
              fill={`${shape.color}18`}
              stroke={shape.color}
              strokeWidth="1"
              opacity="0.5"
              className="float-gentle"
              style={{ animationDelay: `${(col + row) * 0.2}s` }}
            />
          );
        }
      }
    }
    return cells;
  };

  return (
    <div
      ref={ref}
      className="liquid-glass rounded-3xl p-8 transition-all duration-500"
      style={{ ...tiltStyle(rotation, isHovered), borderColor: `${shape.color}25` }}
    >
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Shape preview */}
        <div className="flex flex-col items-center justify-center gap-6">
          <div
            className="w-40 h-40 relative flex items-center justify-center rounded-2xl overflow-hidden"
            style={{
              background: `${shape.color}08`,
              border: `1px solid ${shape.color}20`,
              boxShadow: `0 0 60px ${shape.glowColor}`,
            }}
          >
            {/* Tiling pattern background */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 300 200"
              preserveAspectRatio="xMidYMid slice"
            >
              {renderTilingPattern()}
            </svg>

            {/* Main shape on top */}
            <div className="relative z-10">
              <svg viewBox="0 0 100 100" width="80" height="80">
                {shape.id === "circle" ? (
                  <circle cx="50" cy="50" r="42" fill={`${shape.color}18`} stroke={shape.color} strokeWidth="2.5" />
                ) : shape.id === "hex" ? (
                  <path
                    d={`M ${Array.from({ length: 6 }, (_, i) => {
                      const a = (Math.PI / 3) * i - Math.PI / 6;
                      return `${50 + 44 * Math.cos(a)},${50 + 44 * Math.sin(a)}`;
                    }).join(" L ")} Z`}
                    fill={`${shape.color}18`}
                    stroke={shape.color}
                    strokeWidth="2.5"
                  />
                ) : shape.id === "square" ? (
                  <rect x="8" y="8" width="84" height="84" fill={`${shape.color}18`} stroke={shape.color} strokeWidth="2.5" />
                ) : (
                  <path d="M 50 6 L 94 90 L 6 90 Z" fill={`${shape.color}18`} stroke={shape.color} strokeWidth="2.5" />
                )}
              </svg>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="text-center p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="font-mono font-bold text-xl" style={{ color: shape.color }}>
                {shape.tileEfficiency}%
              </div>
              <div className="text-xs text-white/30 mt-0.5">Tile coverage</div>
            </div>
            <div className="text-center p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="font-mono font-bold text-xl" style={{ color: shape.color }}>
                ×{shape.perimeterRatio.toFixed(2)}
              </div>
              <div className="text-xs text-white/30 mt-0.5">Perimeter ratio</div>
            </div>
          </div>
        </div>

        {/* Facts */}
        <div>
          <h3 className="font-display text-2xl font-bold mb-6" style={{ color: shape.color }}>
            {shape.label}
            {shape.highlight && (
              <span className="ml-2 text-sm text-white/50 font-sans font-normal">-- optimal</span>
            )}
          </h3>
          <ul className="space-y-3">
            {shape.facts.map((fact, i) => (
              <li key={i} className="flex items-start gap-3">
                <div
                  className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                  style={{ background: `${shape.color}20`, border: `1px solid ${shape.color}40` }}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: shape.color }} />
                </div>
                <span className="text-white/60 text-sm leading-relaxed">{fact}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

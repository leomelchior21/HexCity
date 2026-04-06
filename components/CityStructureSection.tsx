"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

// ─── Focus points (mirrors HexFocusPointsSection) ─────────────────────────
const FOCUS_POINTS = [
  { id: "energy",   label: "Energy",   color: "#F59E0B", glowColor: "rgba(245,158,11,0.30)",    icon: "☀️", desc: "Solar panels, energy storage, clean power for the district." },
  { id: "water",    label: "Water",    color: "#06B6D4", glowColor: "rgba(6,182,212,0.30)",     icon: "💧", desc: "Smart water distribution, turbidity, level, irrigation." },
  { id: "air",      label: "Air",      color: "#7DD3FC", glowColor: "rgba(125,211,252,0.25)",   icon: "💨", desc: "CO₂ monitoring, ventilation, green buffer zones." },
  { id: "mobility", label: "Mobility", color: "#F97316", glowColor: "rgba(249,115,22,0.30)",    icon: "🚦", desc: "Adaptive traffic, vehicle counting, flow control." },
  { id: "waste",    label: "Waste",    color: "#EF4444", glowColor: "rgba(239,68,68,0.25)",     icon: "♻️", desc: "Smart bin systems, sorting, composting zones." },
  { id: "green",    label: "Green",    color: "#22C55E", glowColor: "rgba(34,197,94,0.30)",     icon: "🌿", desc: "Urban parks, vegetation, biodiversity corridors." },
];

// ─── Hex grid layout (pointy-top, axial coords) ────────────────────────────
// A 3×2 hex cluster with a central hub — organic and balanced
interface HexNode {
  id: string;
  focusIdx: number;
  cx: number;
  cy: number;
  r: number;
}

const HEX_SIZE = 36;
const HEX_W = HEX_SIZE * 2;
const HEX_H = HEX_SIZE * Math.sqrt(3);

const HEX_GRID: HexNode[] = [
  // Row 0
  { id: "h0", focusIdx: 0, cx: 90,  cy: 63,  r: HEX_SIZE },
  { id: "h1", focusIdx: 1, cx: 178, cy: 63,  r: HEX_SIZE },
  { id: "h2", focusIdx: 2, cx: 266, cy: 63,  r: HEX_SIZE },
  // Row 1 (offset)
  { id: "h3", focusIdx: 3, cx: 134, cy: 124, r: HEX_SIZE },
  { id: "h4", focusIdx: 4, cx: 222, cy: 124, r: HEX_SIZE },
  // Row 2
  { id: "h5", focusIdx: 5, cx: 90,  cy: 186, r: HEX_SIZE },
  { id: "h6", focusIdx: 0, cx: 178, cy: 186, r: HEX_SIZE },
  { id: "h7", focusIdx: 1, cx: 266, cy: 186, r: HEX_SIZE },
  // Central hub (larger)
  { id: "hub", focusIdx: -1, cx: 178, cy: 124, r: HEX_SIZE + 6 },
];

// Neighbors (axial distance ≤ 1.5 in grid coords)
const HEX_NEIGHBORS: [number, number][] = [];
for (let i = 0; i < HEX_GRID.length; i++) {
  for (let j = i + 1; j < HEX_GRID.length; j++) {
    const dist = Math.hypot(HEX_GRID[j].cx - HEX_GRID[i].cx, HEX_GRID[j].cy - HEX_GRID[i].cy);
    if (dist < HEX_W * 1.15) HEX_NEIGHBORS.push([i, j]);
  }
}

// ─── Activity labels that cycle per hex ────────────────────────────────────
const ACTIVITIES = [
  "Building", "Extracting", "Monitoring", "Syncing",
  "Growing",  "Calibrating",  "Routing",   "Filtering",
];

// ─── Geometry helpers ──────────────────────────────────────────────────────
function hexPoints(cx: number, cy: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 180) * (60 * i - 30);
    pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
  }
  return pts.join(" ");
}

// ─── Component ─────────────────────────────────────────────────────────────
export default function CityStructureSection() {
  const [visible, setVisible] = useState(false);
  const [hoveredHex, setHoveredHex] = useState<string | null>(null);
  const [themeCycle, setThemeCycle] = useState(0); // which theme set is active
  const ref = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  // Hex animated state
  const [hexAnim, setHexAnim] = useState(() =>
    HEX_GRID.map(() => ({
      breathe: 0,
      extractX: 0,
      extractY: 0,
      pulse: 0,
      fillAlpha: 0,
      glow: 0,
      activityIdx: 0,
    }))
  );

  // Connection energy
  const [connEnergy, setConnEnergy] = useState(() => HEX_NEIGHBORS.map(() => 0));

  // Particles
  const [particles, setParticles] = useState<
    { id: number; fromIdx: number; toIdx: number; t: number; color: string; size: number }[]
  >([]);
  const pidRef = useRef(0);

  // ── Intersection observer ─────────────────────────────────────────────
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── Animation loop ─────────────────────────────────────────────────────
  const animate = useCallback((ts: number) => {
    if (!visible) { animRef.current = requestAnimationFrame(animate); return; }
    const t = ts * 0.001;
    timeRef.current = t;

    // Theme cycle: shift focus assignments every ~12s
    setThemeCycle(Math.floor(t / 12) % 3);

    setHexAnim(prev => prev.map((h, i) => {
      const node = HEX_GRID[i];
      const phase = i * 0.7;

      // Breathing
      const breathe = Math.sin(t * 0.6 + phase) * 2;

      // Extract: gentle drift out and back
      const extPhase = (t * 0.4 + phase) % (Math.PI * 2);
      const extMag = (Math.sin(extPhase) * 0.5 + 0.5);
      const extAngle = (i / HEX_GRID.length) * Math.PI * 2;
      const extractX = Math.cos(extAngle) * extMag * 8;
      const extractY = Math.sin(extAngle) * extMag * 8;

      // Pulse ring
      const pulseT = (t * 0.5 + phase * 0.3) % 4;
      const pulse = pulseT < 0.8 ? pulseT / 0.8 : 0;

      // Fill alpha
      const fillAlpha = 0.08 + Math.sin(t * 0.9 + phase * 1.5) * 0.04;

      // Glow
      const glow = 0.12 + Math.sin(t * 0.4 + phase) * 0.08;

      // Activity cycling
      const activityIdx = Math.floor((t * 0.2 + phase * 0.5) % ACTIVITIES.length);

      return { breathe, extractX, extractY, pulse, fillAlpha, glow, activityIdx };
    }));

    // Connection energy flow
    setConnEnergy(HEX_NEIGHBORS.map(([a, b], ci) => {
      return (Math.sin(t * 1.2 + ci * 0.8) * 0.5 + 0.5);
    }));

    // Particles
    setParticles(prev => {
      let next = prev.map(p => ({ ...p, t: p.t + 0.012 })).filter(p => p.t <= 1);
      if (Math.random() < 0.08 && HEX_NEIGHBORS.length > 0) {
        const ci = Math.floor(Math.random() * HEX_NEIGHBORS.length);
        const [fromIdx, toIdx] = HEX_NEIGHBORS[ci];
        const fromNode = HEX_GRID[fromIdx];
        next.push({
          id: pidRef.current++,
          fromIdx,
          toIdx,
          t: 0,
          color: FOCUS_POINTS[fromNode.focusIdx]?.color ?? "#22C55E",
          size: 1.5 + Math.random() * 2.5,
        });
      }
      return next.slice(-40);
    });

    animRef.current = requestAnimationFrame(animate);
  }, [visible]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [animate]);

  // ── Derived: which focus point each hex shows (theme cycling) ─────────
  const getFocusIdx = (baseIdx: number): number => {
    if (baseIdx < 0) return -1; // hub
    return (baseIdx + themeCycle * 2) % FOCUS_POINTS.length;
  };

  return (
    <section
      id="structure"
      ref={ref}
      className="relative py-32 px-6 md:px-16 overflow-hidden"
      style={{
        background: "radial-gradient(ellipse 60% 50% at 50% 55%, rgba(34,197,94,0.03) 0%, #06080e 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto relative">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/25 mb-3 block">
            Build Together
          </span>
          <h2 className="font-display text-5xl md:text-6xl font-bold leading-[1.05] mb-4">
            One city,{" "}
            <span className="gradient-text-green">many districts.</span>
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            Each hexagon holds a focus point. Themes shift and evolve as the city grows.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">

          {/* ── Left: Animated hex grid ──────────────────────────────── */}
          <div className="flex-1 flex flex-col items-center gap-8">
            <div className="relative w-full max-w-sm">
              <svg viewBox="40 10 280 230" className="w-full h-full">

                {/* Connection lines */}
                {HEX_NEIGHBORS.map(([a, b], ci) => {
                  const ha = HEX_GRID[a];
                  const hb = HEX_GRID[b];
                  const energy = connEnergy[ci];
                  const fa = FOCUS_POINTS[ha.focusIdx];
                  return (
                    <g key={`conn-${ci}`}>
                      <line x1={ha.cx} y1={ha.cy} x2={hb.cx} y2={hb.cy}
                        stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />
                      <line x1={ha.cx} y1={ha.cy} x2={hb.cx} y2={hb.cy}
                        stroke={energy > 0.55 ? fa?.color : "transparent"}
                        strokeWidth="2" opacity={energy * 0.45}
                        style={{ filter: "blur(2px)" }} />
                    </g>
                  );
                })}

                {/* Particles */}
                {particles.map(p => {
                  const from = HEX_GRID[p.fromIdx];
                  const to = HEX_GRID[p.toIdx];
                  const px = from.cx + (to.cx - from.cx) * p.t;
                  const py = from.cy + (to.cy - from.cy) * p.t;
                  return (
                    <circle key={p.id} cx={px} cy={py} r={p.size}
                      fill={p.color} opacity={1 - p.t * 0.5}
                      style={{ filter: `drop-shadow(0 0 4px ${p.color})` }} />
                  );
                })}

                {/* Hexagons */}
                {HEX_GRID.map((node, i) => {
                  const a = hexAnim[i];
                  const isHovered = hoveredHex === node.id;
                  const isHub = node.id === "hub";
                  const focusIdx = getFocusIdx(node.focusIdx);
                  const focus = focusIdx >= 0 ? FOCUS_POINTS[focusIdx] : null;
                  const color = isHub ? "#A78BFA" : focus?.color ?? "#22C55E";
                  const currentR = node.r + a.breathe + (isHovered ? 4 : 0) + a.pulse * 10;
                  const outerR = currentR + 8 + a.pulse * 14;
                  const innerR = currentR * 0.55;
                  const activityLabel = focusIdx >= 0 ? ACTIVITIES[a.activityIdx] : "Central Hub";

                  return (
                    <g
                      key={node.id}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredHex(node.id)}
                      onMouseLeave={() => setHoveredHex(null)}
                      style={{
                        transform: isHub ? "none" : `translate(${a.extractX}px, ${a.extractY}px)`,
                        transition: "transform 0.3s ease-out",
                      }}
                    >
                      {/* Pulse ring */}
                      {a.pulse > 0 && (
                        <polygon points={hexPoints(node.cx, node.cy, outerR + a.pulse * 10)}
                          fill="none" stroke={color} strokeWidth="1"
                          opacity={(1 - a.pulse) * 0.35} />
                      )}

                      {/* Outer glow */}
                      <polygon points={hexPoints(node.cx, node.cy, outerR)}
                        fill={`${color}${isHovered ? "20" : "08"}`} stroke="none" />

                      {/* Main hex */}
                      <polygon points={hexPoints(node.cx, node.cy, currentR)}
                        fill={`${color}${isHovered ? "35" : Math.round(a.fillAlpha * 255).toString(16).padStart(2, "0")}`}
                        stroke="#4B5563" strokeWidth={isHub ? 4 : isHovered ? 3.5 : 2.5}
                        strokeLinejoin="round"
                        style={{
                          filter: isHovered
                            ? `drop-shadow(0 0 16px ${color}60)`
                            : `drop-shadow(0 0 ${4 + a.glow * 10}px ${color}${Math.round(a.glow * 50).toString(16).padStart(2, "0")})`,
                        }}
                      />

                      {/* Inner hex */}
                      <polygon points={hexPoints(node.cx, node.cy, innerR)}
                        fill={`${color}06`} stroke={`${color}20`} strokeWidth="1" />

                      {/* Icon emoji */}
                      <text x={node.cx} y={node.cy - 12} textAnchor="middle" fontSize="14">
                        {isHub ? "🏛️" : focus?.icon ?? "📦"}
                      </text>

                      {/* Activity label */}
                      <text x={node.cx} y={node.cy + 4} textAnchor="middle"
                        fontSize={isHub ? "7" : "6.5"} fill={`${color}80`} fontFamily="monospace">
                        {activityLabel}
                      </text>

                      {/* Main label */}
                      <text x={node.cx} y={node.cy + 16} textAnchor="middle"
                        fontSize={isHub ? "9" : "7.5"} fontWeight="700"
                        fill={isHovered ? color : "rgba(255,255,255,0.5)"}
                        fontFamily="'Space Grotesk', 'Monument Extended', monospace">
                        {isHub ? "CORE" : focus?.label ?? "???"}
                      </text>

                      {/* Status dot */}
                      {!isHub && (
                        <circle
                          cx={node.cx + currentR - 7}
                          cy={node.cy - currentR + 7}
                          r="2"
                          fill={color}
                          opacity={0.5 + Math.sin(timeRef.current * 3 + i) * 0.5}
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Theme cycle indicator */}
            <div className="flex items-center gap-2 text-xs text-white/30 font-mono">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 2v6h-6M3 12A9 9 0 0119.36 5.36" />
              </svg>
              <span>Theme cycle {themeCycle + 1}/3 — shifting every 12s</span>
            </div>
          </div>

          {/* ── Right: Detail panel ──────────────────────────────────── */}
          <div className="flex-1 w-full max-w-md">
            {(() => {
              // Show the hovered hex's focus, or default to first
              const hoveredNode = hoveredHex
                ? HEX_GRID.find(h => h.id === hoveredHex)
                : null;
              const focusIdx = hoveredNode ? getFocusIdx(hoveredNode.focusIdx) : (getFocusIdx(0));
              const focus = focusIdx >= 0 ? FOCUS_POINTS[focusIdx] : null;

              return (
                <div
                  className="liquid-glass rounded-3xl overflow-hidden transition-all duration-500"
                  style={{ borderColor: focus ? `${focus.color}25` : "rgba(255,255,255,0.08)" }}
                >
                  <div className="h-px w-full"
                    style={{ background: focus ? `linear-gradient(90deg, transparent, ${focus.color}40, transparent)` : "transparent" }} />

                  <div className="px-7 pt-7 pb-7">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                        style={{
                          background: focus ? `${focus.color}15` : "rgba(255,255,255,0.05)",
                          border: focus ? `1px solid ${focus.color}25` : "1px solid rgba(255,255,255,0.08)",
                        }}>
                        {focus?.icon ?? "🏛️"}
                      </div>
                      <div>
                        <div className="text-[10px] font-mono tracking-widest uppercase mb-1"
                          style={{ color: focus ? `${focus.color}70` : "rgba(255,255,255,0.3)" }}>
                          {hoveredNode ? `Hex ${hoveredNode.id.toUpperCase()}` : "Hover a hex"}
                        </div>
                        <h3 className="font-display text-xl font-bold"
                          style={{ color: focus?.color ?? "rgba(255,255,255,0.6)" }}>
                          {focus?.label ?? "Select a district"}
                        </h3>
                      </div>
                    </div>

                    <p className="text-white/50 text-sm leading-relaxed mb-5">
                      {focus?.desc ?? "Hover over any hexagon to see its focus point details."}
                    </p>

                    {/* Mini focus points grid */}
                    <div className="grid grid-cols-3 gap-2">
                      {FOCUS_POINTS.map((fp) => {
                        const isActive = focus?.id === fp.id;
                        return (
                          <div
                            key={fp.id}
                            className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs transition-all duration-200"
                            style={{
                              background: isActive ? `${fp.color}15` : "rgba(255,255,255,0.03)",
                              border: `1px solid ${isActive ? `${fp.color}30` : "rgba(255,255,255,0.06)"}`,
                              color: isActive ? fp.color : "rgba(255,255,255,0.35)",
                            }}
                          >
                            <span className="text-sm">{fp.icon}</span>
                            <span className="truncate">{fp.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* ── CTA ────────────────────────────────────────────────────── */}
        <div className="mt-16 text-center">
          <Link
            href="/simulation"
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-semibold transition-all duration-300"
            style={{
              background: "rgba(34,197,94,0.08)",
              border: "1px solid rgba(34,197,94,0.25)",
              color: "#22C55E",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(34,197,94,0.15)";
              e.currentTarget.style.boxShadow = "0 0 40px rgba(34,197,94,0.15), 0 8px 32px rgba(0,0,0,0.4)";
              e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(34,197,94,0.08)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "none";
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:scale-110">
              <polygon points="4,2 22,12 4,22" fill="currentColor" />
            </svg>
            Explore CitySim
            <span className="text-white/25 text-sm font-normal ml-1">→</span>
          </Link>

          <p className="mt-4 text-white/20 text-xs font-mono">
            Interact with living entities, traffic, and urban systems in real time
          </p>
        </div>
      </div>
    </section>
  );
}

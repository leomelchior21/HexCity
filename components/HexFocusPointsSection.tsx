"use client";
import { useState } from "react";
import { useInView } from "@/hooks/useScrollAnimation";

// ─── Minimalist SVG Icons ─────────────────────────────────────────────────
const Icon = ({ children, color = "currentColor" }: { children: React.ReactNode; color?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
    {children}
  </svg>
);

const IconEnergy = ({ color }: { color: string }) => <Icon color={color}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></Icon>;
const IconWater = ({ color }: { color: string }) => <Icon color={color}><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" /></Icon>;
const IconAir = ({ color }: { color: string }) => <Icon color={color}><path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" /></Icon>;
const IconMobility = ({ color }: { color: string }) => <Icon color={color}><rect x="1" y="3" width="15" height="13" rx="2" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></Icon>;
const IconWaste = ({ color }: { color: string }) => <Icon color={color}><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></Icon>;
const IconGreen = ({ color }: { color: string }) => <Icon color={color}><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75" /></Icon>;

const FOCUS_POINTS = [
  {
    id: "energy",
    label: "Energy",
    icon: IconEnergy,
    color: "#F59E0B",
    glowColor: "rgba(245,158,11,0.30)",
    description:
      "Cities consume 78% of global energy. HexCity explores solar panels, LED street lighting, motion-activated systems, and energy harvesting to power an entire district from renewable sources.",
  },
  {
    id: "water",
    label: "Water",
    icon: IconWater,
    color: "#06B6D4",
    glowColor: "rgba(6,182,212,0.30)",
    description:
      "40% of urban water is lost to leaks before it reaches consumers. HexCity models smart water distribution with turbidity monitoring, level detection, and automated valve control.",
  },
  {
    id: "air",
    label: "Air",
    icon: IconAir,
    color: "#7DD3FC",
    glowColor: "rgba(125,211,252,0.25)",
    description:
      "4.2 million people die annually from outdoor air pollution. HexCity models air quality monitoring networks, ventilation control, and green buffer zones that filter urban air.",
  },
  {
    id: "mobility",
    label: "Mobility",
    icon: IconMobility,
    color: "#F97316",
    glowColor: "rgba(249,115,22,0.30)",
    description:
      "Traffic congestion costs cities 3-5% of GDP annually. HexCity's hexagonal street network naturally distributes flow, reducing bottlenecks compared to grid or radial city plans.",
  },
  {
    id: "waste",
    label: "Waste",
    icon: IconWaste,
    color: "#EF4444",
    glowColor: "rgba(239,68,68,0.25)",
    description:
      "Cities generate 2.01 billion tons of solid waste per year, with only 13.5% recycled. HexCity models smart bin systems, sorting indicators, and composting zones.",
  },
  {
    id: "green",
    label: "Green",
    icon: IconGreen,
    color: "#22C55E",
    glowColor: "rgba(34,197,94,0.30)",
    description:
      "Urban green spaces reduce city temperatures by up to 5°C, support biodiversity, and improve mental health. HexCity dedicates entire hexagonal sectors to vegetation and parks.",
  },
];

export default function HexFocusPointsSection() {
  const [active, setActive] = useState<string>("energy");
  const selected = FOCUS_POINTS.find((f) => f.id === active) ?? FOCUS_POINTS[0];
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.05 });

  return (
    <section ref={sectionRef} id="focus" className="relative py-32 px-8 md:px-16 bg-black overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse, ${selected.glowColor.replace("0.30", "0.06")} 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-5xl mx-auto relative">

        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ease-out ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/25 mb-3 block">
            004 — Sustainability
          </span>
          <h2 className="font-display text-5xl md:text-6xl font-bold leading-[1.05] mb-4">
            HEX <span className="gradient-text">FOCUS POINTS</span>
          </h2>
        </div>

        {/* Desktop: grid + detail panel */}
        <div className={`hidden md:grid md:grid-cols-[1fr_1.4fr] gap-8 items-start transition-all duration-1000 ease-out ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`} style={{ transitionDelay: "200ms" }}>
          {/* 6 boxes grid */}
          <div className="grid grid-cols-2 gap-3">
            {FOCUS_POINTS.map((fp, i) => {
              const isActive = active === fp.id;
              const IconComp = fp.icon;
              return (
                <button
                  key={fp.id}
                  onClick={() => setActive(fp.id)}
                  className="relative flex items-center gap-3 p-4 rounded-2xl text-left transition-all duration-300 ripple-container"
                  style={{
                    background: isActive ? `${fp.color}10` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isActive ? fp.color + "35" : "rgba(255,255,255,0.06)"}`,
                    boxShadow: isActive ? `0 0 24px ${fp.glowColor}, 0 4px 16px rgba(0,0,0,0.3)` : "none",
                    transform: isActive ? "translateY(-2px)" : "none",
                    opacity: isInView ? 1 : 0,
                    transitionDelay: `${i * 80 + 200}ms`,
                  }}
                >
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300"
                    style={{
                      background: `${fp.color}15`,
                      transform: isActive ? "scale(1.1)" : "scale(1)",
                    }}
                  >
                    <IconComp color={fp.color} />
                  </div>

                  {/* Label */}
                  <div>
                    <div
                      className="text-sm font-semibold transition-colors"
                      style={{ color: isActive ? fp.color : "rgba(255,255,255,0.5)" }}
                    >
                      {fp.label}
                    </div>
                  </div>

                  {/* Active indicator */}
                  {isActive && (
                    <div
                      className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full"
                      style={{ background: fp.color }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Detail panel — overview only */}
          <DetailPanel fp={selected} />
        </div>

        {/* Mobile: stacked + detail */}
        <div className="md:hidden">
          <div className="flex flex-wrap gap-2 mb-6">
            {FOCUS_POINTS.map((fp) => {
              const IconComp = fp.icon;
              return (
                <button
                  key={fp.id}
                  onClick={() => setActive(fp.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-250"
                  style={
                    active === fp.id
                      ? {
                          background: `${fp.color}18`,
                          border: `1px solid ${fp.color}40`,
                          color: fp.color,
                        }
                      : {
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.07)",
                          color: "rgba(255,255,255,0.45)",
                        }
                  }
                >
                  <div className="w-4 h-4"><IconComp color={active === fp.id ? fp.color : "rgba(255,255,255,0.4)" } /></div>
                  {fp.label}
                </button>
              );
            })}
          </div>
          <DetailPanel fp={selected} />
        </div>
      </div>
    </section>
  );
}

// ─── Detail Panel — Overview Only ─────────────────────────────────────────
function DetailPanel({ fp }: { fp: typeof FOCUS_POINTS[0] }) {
  const IconComp = fp.icon;

  return (
    <div
      className="liquid-glass rounded-3xl overflow-hidden transition-all duration-500"
      style={{ borderColor: `${fp.color}25` }}
    >
      {/* Top shimmer */}
      <div
        className="h-px w-full"
        style={{ background: `linear-gradient(90deg, transparent, ${fp.color}40, transparent)` }}
      />

      {/* Header */}
      <div className="px-7 pt-7 pb-5">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${fp.color}15`, border: `1px solid ${fp.color}25` }}
          >
            <IconComp color={fp.color} />
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold" style={{ color: fp.color }}>
              {fp.label}
            </h3>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-7 pb-7">
        <p className="text-white/55 text-sm leading-relaxed">{fp.description}</p>

        {/* Decorative line */}
        <div className="mt-6 h-px" style={{ background: `linear-gradient(90deg, ${fp.color}30, transparent)` }} />

        {/* Key insight */}
        <div className="mt-4 flex items-center gap-2 text-xs" style={{ color: fp.color }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={fp.color} strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <span className="text-white/40">Click any focus point to explore its role in HexCity</span>
        </div>
      </div>
    </div>
  );
}

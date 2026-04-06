"use client";
import { useState } from "react";

const CITIES = [
  {
    id: "9a",
    label: "HexCity 9A",
    class: "9th Grade A",
    color: "#A78BFA",
    glowColor: "rgba(167,139,250,0.30)",
    groups: 7,
    status: "ideating",
    statusLabel: "Ideation Phase",
    focus: "Energy + Mobility",
    theme: "Solar Highway",
    description: "7 teams focusing on clean energy distribution and smart traffic routing through hexagonal districts.",
    groupNames: ["Hexa-1A", "Hexa-2A", "Hexa-3A", "Hexa-4A", "Hexa-5A", "Hexa-6A", "Hexa-7A"],
  },
  {
    id: "9b",
    label: "HexCity 9B",
    class: "9th Grade B",
    color: "#06B6D4",
    glowColor: "rgba(6,182,212,0.30)",
    groups: 7,
    status: "ideating",
    statusLabel: "Ideation Phase",
    focus: "Water + Green",
    theme: "AquaForest",
    description: "7 teams building a city centered around water management networks and integrated urban greenery.",
    groupNames: ["Hexa-1B", "Hexa-2B", "Hexa-3B", "Hexa-4B", "Hexa-5B", "Hexa-6B", "Hexa-7B"],
  },
  {
    id: "9c",
    label: "HexCity 9C",
    class: "9th Grade C",
    color: "#22C55E",
    glowColor: "rgba(34,197,94,0.30)",
    groups: 7,
    status: "ideating",
    statusLabel: "Ideation Phase",
    focus: "Air + Waste",
    theme: "CleanBreath",
    description: "7 teams designing automated waste collection systems and real-time air quality monitoring networks.",
    groupNames: ["Hexa-1C", "Hexa-2C", "Hexa-3C", "Hexa-4C", "Hexa-5C", "Hexa-6C", "Hexa-7C"],
  },
  {
    id: "9d",
    label: "HexCity 9D",
    class: "9th Grade D",
    color: "#F59E0B",
    glowColor: "rgba(245,158,11,0.30)",
    groups: 7,
    status: "ideating",
    statusLabel: "Ideation Phase",
    focus: "Full Integration",
    theme: "NexaCore",
    description: "7 teams tackling all 6 focus points simultaneously — the most ambitious city of the four.",
    groupNames: ["Hexa-1D", "Hexa-2D", "Hexa-3D", "Hexa-4D", "Hexa-5D", "Hexa-6D", "Hexa-7D"],
  },
];

// Mini hex grid SVG for the city card
function MiniHexGrid({ color }: { color: string }) {
  const hexes = [
    { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 },
    { x: 0.5, y: 0.87 }, { x: 1.5, y: 0.87 },
    { x: 1, y: 1.73 },
    { x: 0, y: 1.73 }, { x: 2, y: 1.73 },
  ];

  const R = 16;
  const W = R * 2;
  const H = R * Math.sqrt(3);
  const PAD = 4;

  return (
    <svg viewBox={`${-PAD} ${-PAD} ${3 * W + PAD * 2} ${2.5 * H + PAD * 2}`} width="100%" height="100%">
      {hexes.map((h, i) => {
        const cx = h.x * W + R;
        const cy = h.y * H + R;
        const pts = Array.from({ length: 6 }, (_, j) => {
          const a = (Math.PI / 3) * j;
          return `${cx + R * 0.9 * Math.cos(a)},${cy + R * 0.9 * Math.sin(a)}`;
        }).join(" ");

        const isCenter = i === 3 || i === 4;
        return (
          <polygon
            key={i}
            points={pts}
            fill={isCenter ? `${color}20` : "rgba(255,255,255,0.03)"}
            stroke={isCenter ? color : "rgba(255,255,255,0.08)"}
            strokeWidth={isCenter ? "1.5" : "0.8"}
          />
        );
      })}
    </svg>
  );
}

export default function CitiesSection() {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [expandedCity, setExpandedCity] = useState<string | null>(null);

  return (
    <section id="cities" className="relative py-32 px-8 md:px-16 bg-black overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 40% at 50% 60%, rgba(124,58,237,0.04) 0%, transparent 100%)",
        }}
      />

      <div className="max-w-5xl mx-auto relative">

        {/* Header */}
        <div className="mb-16">
          <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/25 mb-3 block">
            005 — The Cities
          </span>
          <h2 className="font-display text-5xl md:text-6xl font-bold leading-[1.05] mb-4">
            Four classes,{" "}
            <span className="gradient-text">four cities.</span>
          </h2>
          <p className="text-white/40 text-lg max-w-xl">
            Each 9th-grade class builds their own HexCity. 7 groups per class, each responsible for a hexagonal district.
          </p>
        </div>

        {/* Overview stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { value: "4", label: "Cities" },
            { value: "28", label: "Groups" },
            { value: "~120", label: "Students" },
            { value: "AUG 2026", label: "Exhibition" },
          ].map((s) => (
            <div key={s.label} className="liquid-glass rounded-xl px-5 py-4 text-center">
              <div className="font-display text-2xl font-bold text-white/90">{s.value}</div>
              <div className="text-[11px] text-white/30 font-mono uppercase tracking-wide mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* City cards */}
        <div className="grid md:grid-cols-2 gap-5">
          {CITIES.map((city) => {
            const isExpanded = expandedCity === city.id;
            const isHovered  = hoveredCity === city.id;

            return (
              <div
                key={city.id}
                className="relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-400"
                style={{
                  background: "rgba(6,6,6,0.85)",
                  border: `1px solid ${isHovered || isExpanded ? city.color + "35" : "rgba(255,255,255,0.07)"}`,
                  boxShadow: isHovered || isExpanded
                    ? `0 0 40px ${city.glowColor}, 0 16px 48px rgba(0,0,0,0.6)`
                    : "0 4px 20px rgba(0,0,0,0.4)",
                  transform: isHovered ? "translateY(-4px)" : "none",
                }}
                onMouseEnter={() => setHoveredCity(city.id)}
                onMouseLeave={() => setHoveredCity(null)}
                onClick={() => setExpandedCity(isExpanded ? null : city.id)}
              >
                {/* Top shimmer */}
                <div
                  className="h-px w-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${city.color}30, transparent)`,
                    opacity: isHovered || isExpanded ? 1 : 0.4,
                    transition: "opacity 0.3s",
                  }}
                />

                <div className="p-7">
                  <div className="flex items-start gap-5 mb-5">
                    {/* Mini hex grid */}
                    <div className="w-24 h-20 flex-shrink-0 opacity-80">
                      <MiniHexGrid color={city.color} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: city.color }} />
                        <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: `${city.color}70` }}>
                          {city.statusLabel}
                        </span>
                      </div>
                      <h3 className="font-display text-xl font-bold mb-0.5" style={{ color: city.color }}>
                        {city.label}
                      </h3>
                      <p className="text-xs text-white/35">{city.class} · {city.groups} groups</p>
                    </div>

                    {/* Theme badge */}
                    <div
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold flex-shrink-0"
                      style={{ background: `${city.color}15`, color: city.color, border: `1px solid ${city.color}25` }}
                    >
                      {city.theme}
                    </div>
                  </div>

                  {/* Focus tag + description */}
                  <p className="text-white/40 text-sm leading-relaxed mb-4">{city.description}</p>

                  {/* Focus pillars */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-white/25 font-mono uppercase tracking-wide">Focus:</span>
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{ background: `${city.color}15`, color: city.color }}
                    >
                      {city.focus}
                    </span>
                  </div>
                </div>

                {/* Expanded: groups list */}
                {isExpanded && (
                  <div className="px-7 pb-7 border-t" style={{ borderColor: `${city.color}15` }}>
                    <div className="pt-5">
                      <div
                        className="text-[10px] font-mono tracking-widest uppercase mb-3"
                        style={{ color: `${city.color}60` }}
                      >
                        7 Groups
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {city.groupNames.map((g) => (
                          <div
                            key={g}
                            className="px-3 py-1.5 rounded-lg text-xs font-mono"
                            style={{
                              background: `${city.color}10`,
                              border: `1px solid ${city.color}20`,
                              color: "rgba(255,255,255,0.55)",
                            }}
                          >
                            {g}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Expand indicator */}
                <div
                  className="absolute bottom-4 right-5 text-[10px] font-mono tracking-wide transition-opacity"
                  style={{ color: `${city.color}50`, opacity: isHovered ? 1 : 0 }}
                >
                  {isExpanded ? "▲ collapse" : "▼ see groups"}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom note */}
        <p className="mt-8 text-center text-xs text-white/20 font-mono">
          Groups will be assigned districts · Exhibition date: August 2026
        </p>
      </div>
    </section>
  );
}

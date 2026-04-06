"use client";
import { useState } from "react";
import { useInView } from "@/hooks/useScrollAnimation";

// ─── Minimalist SVG Icons ─────────────────────────────────────────────────
const Icon = ({ children, color = "currentColor" }: { children: React.ReactNode; color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
    {children}
  </svg>
);

const IconTraffic = () => <Icon color="#ef4444"><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M7 6V4a2 2 0 012-2h6a2 2 0 012 2v2" /><line x1="3" y1="12" x2="21" y2="12" /></Icon>;
const IconAir = () => <Icon color="#ef4444"><path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" /></Icon>;
const IconWater = () => <Icon color="#ef4444"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" /></Icon>;
const IconWaste = () => <Icon color="#ef4444"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" /><rect x="4" y="6" width="16" height="14" rx="2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></Icon>;
const IconHeat = () => <Icon color="#ef4444"><path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z" /></Icon>;
const IconGrowth = () => <Icon color="#ef4444"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></Icon>;

const IconRoute = () => <Icon color="#a78bfa"><polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" /><polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" /><line x1="4" y1="4" x2="9" y2="9" /></Icon>;
const IconLeaf = () => <Icon color="#a78bfa"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75" /></Icon>;
const IconDroplet = () => <Icon color="#a78bfa"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" /></Icon>;
const IconRecycle = () => <Icon color="#a78bfa"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></Icon>;
const IconThermo = () => <Icon color="#a78bfa"><path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z" /><line x1="12" y1="9" x2="12" y2="14" /></Icon>;
const IconHex = () => <Icon color="#a78bfa"><polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" /><polygon points="12,6 18,9.5 18,14.5 12,18 6,14.5 6,9.5" /></Icon>;

const PROBLEMS = [
  { icon: <IconTraffic />, label: "Chronic traffic gridlock", value: "3.8h", unit: "avg daily commute" },
  { icon: <IconAir />, label: "Air pollution crisis", value: "4.2M", unit: "deaths/year (WHO)" },
  { icon: <IconWater />, label: "Water infrastructure failure", value: "40%", unit: "leakage rate" },
  { icon: <IconWaste />, label: "Waste mismanagement", value: "2.01B", unit: "tons solid waste/year" },
  { icon: <IconHeat />, label: "Urban heat islands", value: "+5°C", unit: "vs rural areas" },
  { icon: <IconGrowth />, label: "Unplanned growth", value: "55%", unit: "population in informal zones" },
];

const SOLUTIONS = [
  { icon: <IconRoute />, label: "Predictive traffic routing", value: "40%", unit: "congestion reduction" },
  { icon: <IconLeaf />, label: "Integrated air monitoring", value: "Real-time", unit: "quality index" },
  { icon: <IconDroplet />, label: "Smart water management", value: "30%", unit: "consumption saved" },
  { icon: <IconRecycle />, label: "Automated waste sorting", value: "70%", unit: "recycling rate achievable" },
  { icon: <IconThermo />, label: "Green corridors + cool surfaces", value: "−3°C", unit: "urban temperature" },
  { icon: <IconHex />, label: "Hexagonal zoning model", value: "100%", unit: "equidistant services" },
];

export default function MegaCitiesSection() {
  const [hovered, setHovered] = useState<"mega" | "smart" | null>(null);
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.05 });

  return (
    <section ref={sectionRef} id="megacities" className="relative py-32 px-8 md:px-16 bg-black overflow-hidden">
      {/* Subtle background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 40% at 50% 50%, rgba(124,58,237,0.04) 0%, transparent 100%)",
        }}
      />

      <div className="max-w-5xl mx-auto relative">

        {/* Header — centered */}
        <div className={`text-center mb-16 transition-all duration-1000 ease-out ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/25 mb-3 block">
            003 -- Context
          </span>
          <h2 className="font-display text-5xl md:text-6xl font-bold leading-[1.05] mb-4">
            Mega Cities{" "}
            <span className="text-white/20 font-sans font-thin">×</span>{" "}
            <span className="gradient-text">Smart Cities</span>
          </h2>
          <p className="text-white/40 text-lg max-w-lg mx-auto">
            Why the way we plan cities matters more than ever -- and how HexCity addresses the real challenges.
          </p>
        </div>

        {/* Side-by-side comparison */}
        <div className={`grid md:grid-cols-2 gap-6 transition-all duration-1000 ease-out ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`} style={{ transitionDelay: "200ms" }}>

          {/* Left: Mega City */}
          <div
            className="relative rounded-3xl overflow-hidden cursor-default transition-all duration-500 ripple-container"
            style={{
              background: "rgba(6,6,6,0.8)",
              border: "1px solid rgba(239,68,68,0.15)",
              boxShadow: hovered === "mega"
                ? "0 0 60px rgba(239,68,68,0.12), 0 20px 60px rgba(0,0,0,0.6)"
                : "0 8px 32px rgba(0,0,0,0.5)",
              transform: hovered === "mega" ? "translateY(-4px)" : "none",
            }}
            onMouseEnter={() => setHovered("mega")}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Header */}
            <div
              className="px-6 pt-6 pb-5 border-b"
              style={{ borderColor: "rgba(239,68,68,0.12)" }}
            >
              <div className="flex items-center gap-3 mb-1">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-[11px] font-mono tracking-widest uppercase text-red-400/60">Unplanned Growth</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-white/80">Mega City</h3>
              <p className="text-white/30 text-sm mt-1">Population density without systems thinking</p>
            </div>

            {/* Problems */}
            <div className="p-6 space-y-3">
              {PROBLEMS.map((p, i) => (
                <div
                  key={p.label}
                  className="flex items-center gap-4 p-3 rounded-xl transition-all duration-300"
                  style={{
                    background: "rgba(239,68,68,0.04)",
                    border: "1px solid rgba(239,68,68,0.08)",
                    opacity: isInView ? 1 : 0,
                    transform: isInView ? "none" : "translateX(-20px)",
                    transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 80}ms`,
                  }}
                >
                  <div className="w-5 h-5 flex-shrink-0">{p.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white/50 truncate">{p.label}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-mono font-bold text-red-400 text-sm">{p.value}</div>
                    <div className="text-[10px] text-white/25">{p.unit}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Smart City */}
          <div
            className="relative rounded-3xl overflow-hidden cursor-default transition-all duration-500 ripple-container"
            style={{
              background: "rgba(6,6,6,0.8)",
              border: "1px solid rgba(124,58,237,0.20)",
              boxShadow: hovered === "smart"
                ? "0 0 60px rgba(124,58,237,0.15), 0 20px 60px rgba(0,0,0,0.6)"
                : "0 8px 32px rgba(0,0,0,0.5)",
              transform: hovered === "smart" ? "translateY(-4px)" : "none",
            }}
            onMouseEnter={() => setHovered("smart")}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Header */}
            <div
              className="px-6 pt-6 pb-5 border-b"
              style={{ borderColor: "rgba(124,58,237,0.12)" }}
            >
              <div className="flex items-center gap-3 mb-1">
                <div className="w-2 h-2 rounded-full bg-hex-purple-light animate-pulse" />
                <span className="text-[11px] font-mono tracking-widest uppercase text-purple-400/60">Systems Thinking</span>
              </div>
              <h3 className="font-display text-2xl font-bold gradient-text">Smart City</h3>
              <p className="text-white/30 text-sm mt-1">Data-driven design with sustainability at the core</p>
            </div>

            {/* Solutions */}
            <div className="p-6 space-y-3">
              {SOLUTIONS.map((s, i) => (
                <div
                  key={s.label}
                  className="flex items-center gap-4 p-3 rounded-xl transition-all duration-300"
                  style={{
                    background: "rgba(124,58,237,0.06)",
                    border: "1px solid rgba(124,58,237,0.12)",
                    opacity: isInView ? 1 : 0,
                    transform: isInView ? "none" : "translateX(20px)",
                    transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 80}ms`,
                  }}
                >
                  <div className="w-5 h-5 flex-shrink-0">{s.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white/50 truncate">{s.label}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-mono font-bold text-hex-purple-light text-sm">{s.value}</div>
                    <div className="text-[10px] text-white/25">{s.unit}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom insight */}
        <div className={`mt-10 liquid-glass-purple rounded-2xl px-8 py-6 flex items-center gap-6 transition-all duration-1000 ease-out ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`} style={{ transitionDelay: "400ms" }}>
          <div className="text-4xl opacity-40">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5"><polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" /></svg>
          </div>
          <div>
            <p className="text-white/70 text-sm leading-relaxed">
              <span className="text-white font-semibold">HexCity bridges this gap.</span>{" "}
              By designing with hexagonal structure, 6 sustainability pillars, and real Arduino sensors, students experience both sides -- the chaos of unplanned growth, and the elegance of systems thinking.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

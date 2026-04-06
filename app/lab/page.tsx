"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { COMPONENTS, type ComponentDef, type ComponentType } from "@/components/lab/ComponentData";
import ComponentSimulator from "@/components/lab/ComponentSimulator";
import ComponentSVG from "@/components/lab/ComponentSVG";

export default function ArdudeckPage() {
  const [tab, setTab] = useState<ComponentType>("actuator");
  const [selected, setSelected] = useState<ComponentDef | null>(null);

  const filtered = COMPONENTS.filter((c) => c.type === tab);

  return (
    <main className="min-h-screen flex flex-col bg-black">
      <Navbar />

      {/* Hero */}
      <div className="pt-28 pb-16 px-8 md:px-16 relative overflow-hidden">
        {/* Ambient glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div className="max-w-5xl mx-auto relative">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/25">
              Component Lab
            </span>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          <h1 className="font-display text-6xl md:text-7xl font-bold mb-4">
            Ardu
            <span className="gradient-text">deck</span>
          </h1>
          <p className="text-white/40 text-lg max-w-2xl leading-relaxed">
            Every sensor and actuator you'll use in your HexCity — visualized, simulated, and explained. Understand the hardware before you touch it.
          </p>

          {/* Quick stats */}
          <div className="flex gap-6 mt-8">
            {[
              { value: "16", label: "Components" },
              { value: "6", label: "Actuators" },
              { value: "10", label: "Sensors" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display text-2xl font-bold gradient-text">{s.value}</div>
                <div className="text-xs text-white/30 font-mono mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 px-8 md:px-16 pb-24">
        <div className="max-w-5xl mx-auto">

          {/* Tabs */}
          <div
            className="flex gap-1 mb-10 p-1 rounded-2xl w-fit"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {(["actuator", "sensor"] as ComponentType[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setSelected(null); }}
                className="px-7 py-2.5 rounded-xl text-sm font-semibold transition-all duration-250"
                style={
                  tab === t
                    ? {
                        background: "rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.95)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        boxShadow: "0 1px 0 0 rgba(255,255,255,0.10) inset, 0 4px 12px rgba(0,0,0,0.4)",
                      }
                    : { color: "rgba(255,255,255,0.35)" }
                }
              >
                {t === "actuator" ? "⚡ Actuators" : "🧠 Sensors"}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Component grid */}
            <div className="lg:col-span-2">
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((comp) => (
                  <ComponentCard
                    key={comp.id}
                    comp={comp}
                    selected={selected?.id === comp.id}
                    onSelect={() => setSelected(comp)}
                  />
                ))}
              </div>
            </div>

            {/* Detail panel */}
            <div className="lg:col-span-1">
              {selected ? (
                <div className="sticky top-24">
                  <DetailPanel comp={selected} onClose={() => setSelected(null)} />
                </div>
              ) : (
                <div
                  className="liquid-glass rounded-2xl p-10 flex flex-col items-center justify-center text-center h-64"
                >
                  <svg viewBox="0 0 60 60" width="40" height="40" className="mb-4 opacity-20">
                    <polygon points="30,4 54,17 54,43 30,56 6,43 6,17" fill="none" stroke="white" strokeWidth="2" />
                    <line x1="6" y1="17" x2="54" y2="43" stroke="white" strokeWidth="1" opacity="0.5" />
                    <line x1="54" y1="17" x2="6" y2="43" stroke="white" strokeWidth="1" opacity="0.5" />
                  </svg>
                  <p className="text-xs text-white/25 font-mono">Select a component</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

// ─── Component Card ────────────────────────────────────────────────────────

function ComponentCard({
  comp,
  selected,
  onSelect,
}: {
  comp: ComponentDef;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="text-left rounded-2xl overflow-hidden transition-all duration-300 group"
      style={
        selected
          ? {
              background: `${comp.color}10`,
              border: `1px solid ${comp.color}40`,
              boxShadow: `0 0 30px ${comp.color}18, 0 8px 24px rgba(0,0,0,0.5)`,
              transform: "translateY(-2px)",
            }
          : {
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }
      }
    >
      {/* SVG illustration */}
      <div
        className="h-28 flex items-center justify-center transition-all duration-300"
        style={{
          background: selected
            ? `${comp.color}08`
            : "rgba(255,255,255,0.02)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="w-20 h-20 group-hover:scale-105 transition-transform duration-300">
          <ComponentSVG id={comp.id} color={comp.color} />
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        <div
          className="text-[10px] font-medium px-2 py-0.5 rounded-full w-fit mb-2 font-mono tracking-wide"
          style={{ background: `${comp.color}18`, color: comp.color }}
        >
          {comp.type === "actuator" ? "OUTPUT" : "INPUT"}
        </div>
        <h3 className="font-display font-bold text-white/90 text-sm mb-1">{comp.name}</h3>
        <p className="text-white/35 text-xs leading-snug">{comp.tagline}</p>
      </div>
    </button>
  );
}

// ─── Detail Panel ──────────────────────────────────────────────────────────

function DetailPanel({ comp, onClose }: { comp: ComponentDef; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"sim" | "info" | "pins">("sim");

  return (
    <div
      className="liquid-glass rounded-3xl overflow-hidden transition-all duration-500"
      style={{ borderColor: `${comp.color}30` }}
    >
      {/* Shimmer */}
      <div
        className="h-px w-full"
        style={{ background: `linear-gradient(90deg, transparent, ${comp.color}50, transparent)` }}
      />

      {/* Header */}
      <div className="p-5 border-b border-white/5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Realistic SVG */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center p-1.5"
              style={{ background: `${comp.color}15`, border: `1px solid ${comp.color}25` }}
            >
              <ComponentSVG id={comp.id} color={comp.color} />
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-sm">{comp.name}</h3>
              <div className="text-xs mt-0.5" style={{ color: comp.color }}>{comp.tagline}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/20 hover:text-white/60 transition-colors p-1 rounded-lg hover:bg-white/5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sub tabs */}
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
          {(["sim", "info", "pins"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={
                activeTab === t
                  ? { background: `${comp.color}22`, color: comp.color }
                  : { color: "rgba(255,255,255,0.28)" }
              }
            >
              {t === "sim" ? "Simulate" : t === "info" ? "How It Works" : "Pins"}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {activeTab === "sim" && <ComponentSimulator comp={comp} />}

        {activeTab === "info" && (
          <div className="space-y-4">
            <p className="text-white/55 text-sm leading-relaxed">{comp.description}</p>
            <div className="h-px" style={{ background: `${comp.color}15` }} />
            <div>
              <p className="text-[10px] text-white/25 uppercase tracking-widest mb-2 font-mono">How It Works</p>
              <p className="text-white/45 text-sm leading-relaxed">{comp.howItWorks}</p>
            </div>
            <div
              className="rounded-xl px-4 py-3 text-xs font-medium flex items-center gap-2"
              style={{ background: `${comp.color}12`, color: comp.color, border: `1px solid ${comp.color}25` }}
            >
              {comp.type === "actuator"
                ? "⚡ OUTPUT — Arduino controls this component"
                : "🧠 INPUT — Arduino reads this component"}
            </div>
          </div>
        )}

        {activeTab === "pins" && (
          <div className="space-y-3">
            {comp.pins.map((pin) => (
              <div
                key={pin.name}
                className="flex items-center gap-3 px-3 py-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: pin.color }} />
                <div className="flex-1">
                  <div className="text-xs font-mono font-bold text-white/90">{pin.name}</div>
                  <div className="text-xs text-white/35">{pin.desc}</div>
                </div>
              </div>
            ))}
            {/* Pin diagram */}
            <div
              className="rounded-xl p-4 mt-2"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div className="text-[10px] text-white/20 text-center mb-3 uppercase tracking-widest font-mono">
                Pinout
              </div>
              <div className="flex justify-center">
                <PinDiagram pins={comp.pins} color={comp.color} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PinDiagram({ pins, color }: { pins: ComponentDef["pins"]; color: string }) {
  const h = Math.max(80, pins.length * 24 + 24);
  return (
    <svg viewBox={`0 0 140 ${h}`} width="140" height={h}>
      {/* Component body */}
      <rect
        x="45" y="6"
        width="50" height={pins.length * 24 + 12}
        rx="6"
        fill={`${color}10`}
        stroke={color}
        strokeWidth="1.5"
      />
      {/* Specular highlight */}
      <rect
        x="45" y="6"
        width="50" height="6"
        rx="6"
        fill={`${color}20`}
      />
      {/* Pins */}
      {pins.map((pin, i) => (
        <g key={pin.name}>
          <line
            x1="12" y1={20 + i * 24}
            x2="45" y2={20 + i * 24}
            stroke={pin.color} strokeWidth="2"
          />
          <circle cx="12" cy={20 + i * 24} r="4" fill={pin.color} />
          <circle cx="12" cy={20 + i * 24} r="2" fill={`${pin.color}60`} />
          <text
            x="49" y={24 + i * 24}
            fontSize="7.5" fill={pin.color}
            fontFamily="monospace"
          >
            {pin.name}
          </text>
        </g>
      ))}
    </svg>
  );
}

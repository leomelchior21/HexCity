"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import CanvasSimGrid, { createInitialState, type EntityType } from "@/components/simulation/CanvasSimGrid";

const W = 760;
const H = 520;

const ENTITY_CONFIG: {
  type: EntityType;
  icon: string;
  label: string;
  color: string;
  max: number;
}[] = [
  { type: "car", icon: "🚗", label: "Cars", color: "#EF4444", max: 200 },
  { type: "bus", icon: "🚌", label: "Buses", color: "#F59E0B", max: 50 },
  { type: "bike", icon: "🚲", label: "Bikes", color: "#22C55E", max: 100 },
  { type: "pedestrian", icon: "🚶", label: "Pedestrians", color: "#94A3B8", max: 400 },
];

const VEG_PRESETS: {
  key: string;
  label: string;
  icon: string;
  range: [number, number];
}[] = [
  { key: "periphery", label: "Periphery", icon: "🏡", range: [0.05, 0.10] },
  { key: "metro", label: "Metro Zone", icon: "🏘️", range: [0.10, 0.20] },
  { key: "downtown", label: "Downtown", icon: "🏙️", range: [0.20, 0.30] },
  { key: "optimal", label: "Optimal", icon: "🌳", range: [0.45, 0.50] },
];

export default function SimulationPage() {
  const [vegPreset, setVegPreset] = useState("metro");
  const [vegRatio, setVegRatio] = useState(0.15);
  const [targets, setTargets] = useState<Record<EntityType, number>>({
    car: 20, bus: 8, bike: 15, pedestrian: 30,
  });
  const [zoom, setZoom] = useState(1);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [stats, setStats] = useState({ congestion: 0, avgSpeed: 0, efficiency: 0, total: 0 });
  const [selectedEntity, setSelectedEntity] = useState<{
    type: EntityType; speed: number; x: number; y: number; color: string; fromId: string; toId: string;
  } | null>(null);

  // Chart history
  const [chartHistory, setChartHistory] = useState<{ congestion: number; avgSpeed: number; efficiency: number }[]>([]);
  const tickCounterRef = useRef(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleStats = useCallback((newStats: { congestion: number; avgSpeed: number; efficiency: number; total: number }) => {
    setStats(newStats);
    tickCounterRef.current++;
    if (tickCounterRef.current % 2 === 0) {
      setChartHistory(prev => {
        const next = [...prev, { congestion: newStats.congestion, avgSpeed: newStats.avgSpeed, efficiency: newStats.efficiency }];
        if (next.length > 120) return next.slice(next.length - 120);
        return next;
      });
    }
  }, []);

  const applyVegPreset = useCallback((key: string) => {
    const preset = VEG_PRESETS.find(p => p.key === key);
    if (!preset) return;
    setVegPreset(key);
    const [min, max] = preset.range;
    const ratio = min + Math.random() * (max - min);
    setVegRatio(Math.round(ratio * 100) / 100);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === " ") { e.preventDefault(); setPaused(p => !p); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const congestionColor =
    stats.congestion < 40 ? "#22C55E" : stats.congestion < 70 ? "#F59E0B" : "#EF4444";

  return (
    <main className="min-h-screen flex flex-col bg-[#020202]">
      <Navbar />

      <div className="pt-20 flex-1 flex flex-col">
        {/* Header */}
        <div className="px-6 py-6">
          <div className="max-w-7xl mx-auto flex items-end justify-between">
            <div>
              <p className="text-hex-green text-[10px] font-mono tracking-[0.3em] uppercase mb-2">
                City Simulation v2.0
              </p>
              <h1 className="font-display text-3xl md:text-4xl font-bold leading-none">
                What happens when{" "}
                <span className="gradient-text-green">everything works together.</span>
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-2 text-[10px] text-white/20 font-mono">
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">Space</kbd> Pause
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div className="flex-1 px-6 pb-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-[1fr_280px] gap-5">

              {/* ── Simulation canvas ── */}
              <div className="space-y-4">
                <div
                  className="relative rounded-2xl overflow-hidden border border-white/5"
                  style={{ aspectRatio: `${W}/${H}` }}
                >
                  {/* Paused overlay */}
                  {paused && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                      <div
                        className="px-10 py-6 rounded-2xl text-center"
                        style={{
                          background: "rgba(10,10,10,0.7)",
                          backdropFilter: "blur(24px)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <div className="text-4xl mb-2">⏸</div>
                        <div className="font-display font-bold text-white text-lg mb-3">Paused</div>
                        <button
                          onClick={() => setPaused(false)}
                          className="px-6 py-2 rounded-xl bg-hex-green/20 border border-hex-green/40 text-hex-green font-semibold text-xs hover:bg-hex-green/30 transition-all"
                        >
                          Resume
                        </button>
                      </div>
                    </div>
                  )}

                  <CanvasSimGrid
                    width={W}
                    height={H}
                    zoom={zoom}
                    vegRatio={vegRatio}
                    targets={targets}
                    paused={paused}
                    dayNight={0.5}
                    showHeatmap={false}
                    speed={speed}
                    onStatsChange={handleStats}
                    canvasRef={canvasRef}
                    onEntityClick={setSelectedEntity}
                  />

                  {/* Entity Inspector Tooltip */}
                  {selectedEntity && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20">
                      <div
                        className="flex items-center gap-4 px-4 py-2.5 rounded-xl text-[11px]"
                        style={{
                          background: "rgba(0,0,0,0.75)",
                          backdropFilter: "blur(20px)",
                          border: `1px solid ${selectedEntity.color}40`,
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ background: selectedEntity.color }}
                          />
                          <span className="text-white/40 font-mono uppercase">
                            {ENTITY_CONFIG.find(e => e.type === selectedEntity.type)?.icon}
                            {selectedEntity.type}
                          </span>
                        </div>
                        <div className="w-px h-4 bg-white/10" />
                        <div>
                          <span className="text-white/25">Speed</span>
                          <span className="text-white/70 font-mono font-bold ml-1">
                            {selectedEntity.speed}
                          </span>
                        </div>
                        <div className="w-px h-4 bg-white/10" />
                        <div>
                          <span className="text-white/25">Pos</span>
                          <span className="text-white/70 font-mono ml-1">
                            {selectedEntity.x}, {selectedEntity.y}
                          </span>
                        </div>
                        <div className="w-px h-4 bg-white/10" />
                        <div>
                          <span className="text-white/25">Route</span>
                          <span className="text-white/70 font-mono ml-1">
                            {selectedEntity.fromId} → {selectedEntity.toId}
                          </span>
                        </div>
                        <button
                          onClick={() => setSelectedEntity(null)}
                          className="text-white/20 hover:text-white/50 ml-1"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Controls overlay — zoom */}
                  <div className="absolute top-3 right-3 z-20">
                    <div
                      className="flex flex-col items-center p-1.5 rounded-xl"
                      style={{
                        background: "rgba(0,0,0,0.5)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <button
                        onClick={() => setZoom(z => Math.min(4, Math.round((z + 0.25) * 100) / 100))}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm"
                      >
                        +
                      </button>
                      <span className="text-white/25 text-[9px] font-mono py-0.5">
                        {zoom.toFixed(1)}×
                      </span>
                      <button
                        onClick={() => setZoom(z => Math.max(0.7, Math.round((z - 0.25) * 100) / 100))}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm"
                      >
                        −
                      </button>
                      <button
                        onClick={() => setZoom(1)}
                        title="Reset zoom"
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white/20 hover:text-white/50 hover:bg-white/5 transition-all text-[10px] mt-0.5"
                      >
                        ↺
                      </button>
                    </div>
                  </div>

                  {/* Legend + perf counter */}
                  <div className="absolute bottom-3 left-3 right-3 z-20 flex justify-between items-end">
                    <div
                      className="flex flex-wrap gap-x-3 gap-y-1 px-3 py-2 rounded-xl text-[10px]"
                      style={{
                        background: "rgba(0,0,0,0.5)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      {ENTITY_CONFIG.map(et => (
                        <div key={et.type} className="flex items-center gap-1.5">
                          <div className="rounded-full" style={{
                            width: et.type === "bus" ? 8 : et.type === "car" ? 6 : et.type === "bike" ? 4 : 3,
                            height: et.type === "bus" ? 8 : et.type === "car" ? 6 : et.type === "bike" ? 4 : 3,
                            background: et.color,
                          }} />
                          <span className="text-white/35">{et.icon} {et.label}</span>
                        </div>
                      ))}
                    </div>
                    <div
                      className="px-2.5 py-1.5 rounded-lg text-[9px] font-mono flex-shrink-0"
                      style={{
                        background: "rgba(0,0,0,0.5)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <span className="text-white/20">{stats.total}</span>
                      <span className="text-white/10 mx-1">·</span>
                      <span className="text-hex-green/60">60fps</span>
                    </div>
                  </div>
                </div>

                {/* Live stats mini bar */}
                <div className="flex gap-3">
                  {[
                    { label: "Density", value: `${stats.congestion}%`, color: congestionColor, pct: stats.congestion },
                    { label: "Avg Speed", value: `${stats.avgSpeed}`, color: "#06B6D4", pct: Math.min(100, stats.avgSpeed * 1.5) },
                    { label: "Flow", value: `${stats.efficiency}%`, color: "#8B5CF6", pct: stats.efficiency },
                    { label: "Agents", value: `${stats.total}`, color: "#fff", pct: Math.min(100, (stats.total / 750) * 100) },
                  ].map(s => (
                    <div
                      key={s.label}
                      className="flex-1 rounded-xl p-3 border border-white/5"
                      style={{ background: "rgba(255,255,255,0.02)" }}
                    >
                      <div className="text-[9px] text-white/25 font-mono uppercase tracking-wider mb-1">{s.label}</div>
                      <div className="text-lg font-display font-bold" style={{ color: s.color }}>{s.value}</div>
                      <div className="h-1 bg-white/5 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(0, s.pct))}%`, background: s.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Charts */}
                {chartHistory.length > 2 && (
                  <div
                    className="rounded-2xl border border-white/5 p-4"
                    style={{ background: "rgba(255,255,255,0.02)" }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-[10px] text-white/25 font-mono uppercase tracking-wider">Live Analytics</div>
                      <div className="text-[9px] text-white/15 font-mono">{chartHistory.length} samples</div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <MiniChart
                        data={chartHistory.map(d => d.congestion)}
                        label="Congestion %"
                        color="#EF4444"
                      />
                      <MiniChart
                        data={chartHistory.map(d => d.avgSpeed)}
                        label="Avg Speed"
                        color="#06B6D4"
                      />
                      <MiniChart
                        data={chartHistory.map(d => d.efficiency)}
                        label="Flow %"
                        color="#8B5CF6"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ── Control panel ── */}
              <div className="space-y-4">

                {/* Vegetation presets */}
                <ControlCard label="Green Zones">
                  <div className="grid grid-cols-2 gap-1.5">
                    {VEG_PRESETS.map(p => (
                      <button
                        key={p.key}
                        onClick={() => applyVegPreset(p.key)}
                        className={`px-2.5 py-2.5 rounded-lg text-[11px] font-medium transition-all text-left ${
                          vegPreset === p.key
                            ? "bg-white/10 text-white border border-white/15"
                            : "bg-white/3 text-white/35 hover:bg-white/6 hover:text-white/55 border border-transparent"
                        }`}
                      >
                        <span className="text-base">{p.icon}</span>
                        <div className="mt-0.5">{p.label}</div>
                        <div className="text-[9px] text-white/20 font-mono mt-0.5">
                          {Math.round(p.range[0] * 100)}–{Math.round(p.range[1] * 100)}%
                        </div>
                      </button>
                    ))}
                  </div>
                </ControlCard>

                {/* Traffic */}
                <ControlCard label="Traffic">
                  <div className="space-y-3">
                    {ENTITY_CONFIG.map(et => (
                      <div key={et.type}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-white/50">{et.icon} {et.label}</span>
                          <span className="font-mono font-bold" style={{ color: et.color }}>{targets[et.type]}</span>
                        </div>
                        <input
                          type="range" min={0} max={et.max} step={et.max > 100 ? 10 : 1}
                          value={targets[et.type]}
                          onChange={e => setTargets(t => ({ ...t, [et.type]: +e.target.value }))}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>
                </ControlCard>

                {/* Speed & Playback */}
                <ControlCard label="Playback">
                  <div className="flex gap-1.5 mb-3">
                    {[0.5, 1, 2, 4].map(s => (
                      <button
                        key={s}
                        onClick={() => setSpeed(s)}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
                          speed === s
                            ? "bg-white/12 text-white border border-white/15"
                            : "text-white/25 hover:text-white/45 border border-transparent"
                        }`}
                      >
                        {s}×
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setPaused(p => !p)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        paused
                          ? "bg-hex-green/20 border border-hex-green/40 text-hex-green"
                          : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/8 hover:text-white"
                      }`}
                    >
                      {paused ? "▶ Resume" : "⏸ Pause"}
                    </button>
                  </div>
                </ControlCard>

              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Mini Chart Component ─────────────────────────────────────────────────
function MiniChart({ data, label, color }: { data: number[]; label: string; color: string }) {
  if (data.length < 2) return null;
  const w = 200;
  const h = 60;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const step = w / (data.length - 1);

  const pathD = data.map((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / range) * (h - 8) - 4;
    return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");

  const areaD = pathD + ` L ${((data.length - 1) * step).toFixed(1)} ${h} L 0 ${h} Z`;

  return (
    <div>
      <div className="text-[9px] text-white/20 font-mono mb-1">{label}</div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[48px]">
        <defs>
          <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#grad-${label})`} />
        <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

// ─── Control Card ─────────────────────────────────────────────────────────
function ControlCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl border border-white/5 p-4"
      style={{ background: "rgba(255,255,255,0.02)" }}
    >
      <div className="text-[9px] text-white/20 font-mono uppercase tracking-[0.15em] mb-3">{label}</div>
      {children}
    </div>
  );
}

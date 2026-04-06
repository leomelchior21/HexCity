"use client";

interface TMonth {
  month: string;
  label: string;
  phase: "arduino" | "ideation" | "build" | "vacation" | "finale";
  phaseColor: string;
  status: "done" | "current" | "upcoming" | "vacation";
}

const TIMELINE: TMonth[] = [
  { month: "FEB", label: "Arduino Basics",       phase: "arduino",   phaseColor: "#06B6D4", status: "done"     },
  { month: "MAR", label: "Arduino Advanced",     phase: "arduino",   phaseColor: "#06B6D4", status: "done"     },
  { month: "APR", label: "HexCity Ideation",     phase: "ideation",  phaseColor: "#7C3AED", status: "current"  },
  { month: "MAY", label: "HexCity Prototyping",  phase: "build",     phaseColor: "#8B5CF6", status: "upcoming" },
  { month: "JUN", label: "HexCity Testing",      phase: "build",     phaseColor: "#8B5CF6", status: "upcoming" },
  { month: "JUL", label: "Winter Break",         phase: "vacation",  phaseColor: "#F59E0B", status: "vacation" },
  { month: "AUG", label: "Finale",               phase: "finale",    phaseColor: "#22C55E", status: "upcoming" },
];

const PHASES = [
  { key: "arduino",  label: "Arduino",         color: "#06B6D4", span: "FEB – MAR" },
  { key: "ideation", label: "Ideation",         color: "#7C3AED", span: "APR"      },
  { key: "build",    label: "Prototype & Test", color: "#8B5CF6", span: "MAY – JUN"},
  { key: "vacation", label: "Winter Break",     color: "#F59E0B", span: "JUL"      },
  { key: "finale",   label: "Finale",           color: "#22C55E", span: "AUG"      },
];

export default function TimelineSection() {
  return (
    <section id="timeline" className="py-32 px-6 relative overflow-hidden scroll-mt-28">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full bg-white/[0.012] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <p className="text-white/25 text-xs font-mono tracking-widest uppercase mb-4">Calendar</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-white">
            Project <span className="gradient-text">Timeline</span>
          </h2>
          <p className="text-white/30 max-w-md mx-auto text-sm">
            School year 2026 — São Paulo
          </p>
        </div>

        {/* Track */}
        <div className="glass rounded-3xl p-8 md:p-12 overflow-x-auto no-scrollbar">
          <div className="relative min-w-[640px]">
            {/* Progress line */}
            <div className="absolute top-[27px] left-0 right-0 h-px bg-white/6" />
            {/* Done portion */}
            <div
              className="absolute top-[27px] left-0 h-px bg-gradient-to-r from-transparent via-white/20 to-white/25"
              style={{ width: "28.5%" /* 2 of 7 done = ~28.5% */ }}
            />

            <div className="flex items-start justify-between relative">
              {TIMELINE.map((item, i) => (
                <MonthNode key={item.month} item={item} index={i} />
              ))}
            </div>
          </div>

          {/* Phase legend */}
          <div className="flex flex-wrap gap-6 mt-10 min-w-[640px]">
            {PHASES.map((ph) => (
              <div key={ph.key} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: ph.color }} />
                <span className="text-xs text-white/35">
                  <span style={{ color: ph.color }} className="font-medium">{ph.label}</span>
                  {" "}
                  <span className="text-white/20">({ph.span})</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Current phase indicator */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-xl px-6 py-3 border border-white/8 bg-white/[0.03] backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white/40 text-xs font-mono">Now in</span>
            <span className="text-white font-semibold text-sm">HexCity Ideation</span>
            <span className="text-white/25 text-xs font-mono">APR 2026</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function MonthNode({ item, index }: { item: TMonth; index: number }) {
  const styles = {
    done:     { ring: "rgba(255,255,255,0.18)", bg: "rgba(255,255,255,0.06)", text: "rgba(255,255,255,0.45)" },
    current:  { ring: "#7C3AED",                bg: "rgba(124,58,237,0.12)",  text: "#ffffff"                },
    upcoming: { ring: "rgba(255,255,255,0.07)", bg: "rgba(255,255,255,0.02)", text: "rgba(255,255,255,0.2)"  },
    vacation: { ring: "rgba(245,158,11,0.3)",   bg: "rgba(245,158,11,0.08)", text: "rgba(245,158,11,0.55)"  },
  }[item.status];

  return (
    <div className="flex flex-col items-center group relative">
      {/* Circle */}
      <div
        className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center border mb-3 transition-all duration-300 group-hover:scale-110"
        style={{ background: styles.bg, borderColor: styles.ring }}
      >
        {item.status === "current" && (
          <div className="absolute inset-0 rounded-full border border-[#7C3AED] animate-ping opacity-20" />
        )}
        {item.status === "done" && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        )}
        {item.status === "current" && (
          <div className="w-3 h-3 rounded-full bg-white" style={{ boxShadow: "0 0 10px rgba(255,255,255,0.5)" }} />
        )}
        {item.status === "upcoming" && (
          <div className="w-2 h-2 rounded-full bg-white/15" />
        )}
        {item.status === "vacation" && (
          <span className="text-xl">🏖️</span>
        )}
      </div>

      {/* Month label */}
      <span
        className="text-[10px] font-mono font-bold tracking-widest uppercase mb-1"
        style={{ color: styles.text }}
      >
        {item.month}
      </span>

      {/* Phase pill */}
      <div
        className="text-[9px] px-2 py-0.5 rounded-full font-medium text-center"
        style={{ background: `${item.phaseColor}14`, color: item.phaseColor }}
      >
        {item.label.split(" ")[0]}
      </div>

      {/* Hover tooltip */}
      <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 absolute top-full mt-3 w-32 text-center text-[10px] text-white/45 leading-snug pointer-events-none bg-black/90 rounded-lg p-2 border border-white/8 z-20">
        {item.label}
      </div>
    </div>
  );
}

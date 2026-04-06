const concepts = [
  {
    icon: (
      <svg viewBox="0 0 60 60" width="48" height="48">
        <polygon points="30,4 56,19 56,49 30,64 4,49 4,19" fill="rgba(124,58,237,0.15)" stroke="#7C3AED" strokeWidth="1.5" />
        <polygon points="30,14 46,23 46,41 30,50 14,41 14,23" fill="rgba(124,58,237,0.08)" stroke="rgba(124,58,237,0.4)" strokeWidth="1" />
        <polygon points="30,22 38,27 38,37 30,42 22,37 22,27" fill="#7C3AED" opacity="0.6" />
      </svg>
    ),
    color: "#7C3AED",
    colorLight: "rgba(124,58,237,0.15)",
    label: "Hexagonal Thinking",
    tagline: "Spatial efficiency and modularity",
    body: "Hexagons cover space without gaps, connect to all neighbors, and scale infinitely. Each project is a cell — independent, but part of the whole.",
    pills: ["Efficiency", "Modularity", "Connection"],
  },
  {
    icon: (
      <svg viewBox="0 0 60 60" width="48" height="48">
        <circle cx="30" cy="30" r="22" fill="rgba(6,182,212,0.1)" stroke="#06B6D4" strokeWidth="1.5" />
        {[[20,20],[40,20],[40,40],[20,40]].map(([x,y],i)=>(
          <g key={i}>
            <circle cx={x} cy={y} r="4" fill="#06B6D4" opacity="0.8" />
            <line x1={x} y1={y} x2={30} y2={30} stroke="rgba(6,182,212,0.4)" strokeWidth="1" strokeDasharray="2,2" />
          </g>
        ))}
        <circle cx="30" cy="30" r="5" fill="#06B6D4" />
      </svg>
    ),
    color: "#06B6D4",
    colorLight: "rgba(6,182,212,0.12)",
    label: "Systems Thinking",
    tagline: "No project exists in isolation",
    body: "A smart traffic light impacts energy consumption. Irrigation affects local temperature. Learning to see these dependencies is the most valuable skill.",
    pills: ["Cause & Effect", "Dependencies", "Integration"],
  },
  {
    icon: (
      <svg viewBox="0 0 60 60" width="48" height="48">
        <path d="M30 8 L30 52" stroke="rgba(34,197,94,0.3)" strokeWidth="1" />
        <path d="M10 30 L50 30" stroke="rgba(34,197,94,0.3)" strokeWidth="1" />
        <circle cx="30" cy="30" r="18" fill="rgba(34,197,94,0.1)" stroke="#22C55E" strokeWidth="1.5" strokeDasharray="4,3" />
        <path d="M22 38 Q30 10 38 38" fill="rgba(34,197,94,0.2)" stroke="#22C55E" strokeWidth="1.5" />
        <circle cx="30" cy="30" r="4" fill="#22C55E" />
      </svg>
    ),
    color: "#22C55E",
    colorLight: "rgba(34,197,94,0.12)",
    label: "Sustainability",
    tagline: "Clean energy, real impact",
    body: "Every design decision has an energy cost. HEXCITY focuses on solutions that optimize resources, reduce waste, and create more resilient cities.",
    pills: ["Solar Energy", "Resources", "Resilience"],
  },
];

export default function CoreConceptsSection() {
  return (
    <section id="concepts" className="py-32 px-6 scroll-mt-28">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-hex-purple-light text-sm font-medium tracking-widest uppercase mb-4">
            Foundations
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Core <span className="gradient-text">Concepts</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {concepts.map((c) => (
            <div
              key={c.label}
              className="glass rounded-2xl p-8 group hover:border-opacity-50 transition-all duration-300 cursor-default border"
              style={{ borderColor: `${c.color}25` }}
            >
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110" style={{ background: c.colorLight }}>
                {c.icon}
              </div>
              <div className="text-xs font-medium tracking-widest uppercase mb-2" style={{ color: c.color }}>{c.label}</div>
              <h3 className="font-display text-xl font-bold text-white mb-3">{c.tagline}</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-6">{c.body}</p>
              <div className="flex flex-wrap gap-2">
                {c.pills.map((p) => (
                  <span key={p} className="text-xs px-3 py-1 rounded-full" style={{ background: c.colorLight, color: c.color }}>{p}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

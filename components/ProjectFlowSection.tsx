const steps = [
  { n: "01", label: "Brainstorm", icon: "💡", color: "#7C3AED", desc: "Free-form idea generation to solve a real urban problem in São Paulo." },
  { n: "02", label: "SWOT", icon: "⚖️", color: "#06B6D4", desc: "Analysis of strengths, weaknesses, opportunities and threats of the chosen solution." },
  { n: "03", label: "Build", icon: "🔧", color: "#F59E0B", desc: "Physical construction of the hexagon: Arduino, sensors, actuators, structure and programming." },
  { n: "04", label: "Integration", icon: "🔗", color: "#22C55E", desc: "All hexes connect. The entire system functions as a real city." },
  { n: "05", label: "Exhibition", icon: "🏆", color: "#EF4444", desc: "Mostra Cultural — the public interacts with HEXCITY. Systems running live." },
];

export default function ProjectFlowSection() {
  return (
    <section id="flow" className="py-32 px-6 scroll-mt-28">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-hex-cyan text-sm font-medium tracking-widest uppercase mb-4">Process</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Project <span className="gradient-text">Flow</span>
          </h2>
          <p className="text-white/40 max-w-md mx-auto">From concept to city — 5 stages structuring the project</p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
          <div className="grid md:grid-cols-6 gap-4">
            {steps.map((step, i) => (
              <div key={step.label} className="group flex flex-col items-center text-center">
                <div
                  className="relative z-10 w-20 h-20 rounded-2xl flex flex-col items-center justify-center mb-4 glass border transition-all duration-300 group-hover:scale-110"
                  style={{ borderColor: `${step.color}35` }}
                >
                  <span className="text-2xl mb-0.5">{step.icon}</span>
                  <span className="text-xs font-mono font-bold" style={{ color: `${step.color}70` }}>{step.n}</span>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute -right-5 top-1/2 -translate-y-1/2">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1 5h8M6 2l3 3-3 3" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="font-display font-bold text-sm mb-1.5" style={{ color: step.color }}>{step.label}</div>
                <p className="text-white/35 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

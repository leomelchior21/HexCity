export default function WhatIsSection() {
  const problems = [
    { icon: "⚡", text: "Wasted energy in buildings and streets" },
    { icon: "🚦", text: "Chaotic traffic without intelligence" },
    { icon: "💧", text: "Poorly managed water resources" },
    { icon: "🌿", text: "Green spaces without monitoring" },
  ];

  return (
    <section id="what" className="py-32 px-6 scroll-mt-28">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-hex-purple-light text-sm font-medium tracking-widest uppercase mb-4">
              The Project
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight">
              What is{" "}
              <span className="gradient-text">HEXCITY?</span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-6">
              HEXCITY is a modular smart city where each hexagonal cell is an independent project solving a real urban problem — while integrating into the larger system.
            </p>
            <p className="text-white/45 leading-relaxed mb-10">
              Inspired by the challenges of São Paulo — South America's largest metropolis — each team builds a solution with Arduino, sensors and actuators, then integrates it into the complete city.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {problems.map((p) => (
                <div
                  key={p.text}
                  className="glass rounded-xl p-4 flex items-start gap-3 hover:border-hex-purple/30 transition-all"
                >
                  <span className="text-2xl">{p.icon}</span>
                  <span className="text-white/60 text-sm leading-snug">{p.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <HexViz />
          </div>
        </div>
      </div>
    </section>
  );
}

function HexViz() {
  const hexes = [
    { x: 140, y: 120, color: "#7C3AED", label: "Central" },
    { x: 140, y: 40, color: "#22C55E", label: "Energy" },
    { x: 210, y: 80, color: "#06B6D4", label: "Water" },
    { x: 210, y: 160, color: "#F59E0B", label: "Traffic" },
    { x: 140, y: 200, color: "#22C55E", label: "Green" },
    { x: 70, y: 160, color: "#EC4899", label: "Air" },
    { x: 70, y: 80, color: "#06B6D4", label: "Soil" },
  ];

  function hexPoints(cx: number, cy: number, r: number) {
    const pts: string[] = [];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 180) * (60 * i - 30);
      pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
    }
    return pts.join(" ");
  }

  return (
    <svg viewBox="0 0 280 260" className="w-72 h-72">
      {hexes.slice(1).map((h, i) => (
        <line key={i} x1={140} y1={120} x2={h.x} y2={h.y} stroke="rgba(124,58,237,0.2)" strokeWidth="1" strokeDasharray="3,3" />
      ))}
      {hexes.map((h, i) => (
        <g key={i}>
          <polygon points={hexPoints(h.x, h.y, i === 0 ? 42 : 34)} fill={`${h.color}20`} stroke={h.color} strokeWidth="1.5" />
          <text x={h.x} y={h.y + 4} textAnchor="middle" fontSize={i === 0 ? "10" : "8"} fill={h.color} fontWeight="600" fontFamily="Monument Extended, Space Grotesk, sans-serif">{h.label}</text>
        </g>
      ))}
      <circle cx={140} cy={120} r={130} fill="none" stroke="rgba(124,58,237,0.08)" strokeWidth="1" strokeDasharray="4,8" />
    </svg>
  );
}

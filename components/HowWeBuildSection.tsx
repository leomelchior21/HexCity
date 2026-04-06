const tools = [
  { icon: "⚡", name: "Arduino", type: "Hardware", color: "#06B6D4", desc: "Microcontroller that reads sensors and controls actuators. The brain of each hexagon.", tags: ["Uno", "Mega", "C++"] },
  { icon: "🔬", name: "Sensors", type: "Input", color: "#22C55E", desc: "Capture real-world data: temperature, light, distance, humidity, water turbidity.", tags: ["LDR", "Ultrasonic", "DHT11"] },
  { icon: "⚙️", name: "Actuators", type: "Output", color: "#7C3AED", desc: "Respond to the environment: servos, LEDs, buzzers, relays — code becomes physical action.", tags: ["Servo", "LED", "Relay"] },
  { icon: "🖥️", name: "Tinkercad", type: "Software", color: "#F59E0B", desc: "Virtual simulator where we test circuits and code before building physically.", tags: ["Simulation", "3D", "Circuits"] },
  { icon: "🏗️", name: "Physical Build", type: "Physical", color: "#EF4444", desc: "The physical hexagon — structure, wiring, display and presentation for the Exhibition.", tags: ["Wood", "Acrylic", "MDF"] },
];

export default function HowWeBuildSection() {
  return (
    <section id="build" className="py-32 px-6 scroll-mt-28">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-hex-amber text-sm font-medium tracking-widest uppercase mb-4">Technology</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              How We <span className="gradient-text">Build</span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-4">
              Each team uses a real technology stack to build their solution — from code to physical structure.
            </p>
            <p className="text-white/40 leading-relaxed">
              The journey starts with simple circuits on Tinkercad, moves to physical assembly with Arduino, and ends with a functional prototype integrated into the city.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-10">
              {[{ n: "20+", label: "Components" }, { n: "32", label: "Hexagons" }, { n: "1", label: "City" }].map((s) => (
                <div key={s.label} className="glass rounded-xl p-4 text-center">
                  <div className="font-display text-3xl font-bold gradient-text">{s.n}</div>
                  <div className="text-white/40 text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {tools.map((tool) => (
              <div key={tool.name} className="glass rounded-xl p-5 flex items-start gap-4 hover:border-white/10 transition-all group cursor-default">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform group-hover:scale-110" style={{ background: `${tool.color}15` }}>
                  {tool.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display font-bold text-white">{tool.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${tool.color}15`, color: tool.color }}>{tool.type}</span>
                  </div>
                  <p className="text-white/45 text-sm leading-relaxed mb-2">{tool.desc}</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {tool.tags.map((t) => (
                      <span key={t} className="text-xs text-white/25 bg-white/5 px-2 py-0.5 rounded">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

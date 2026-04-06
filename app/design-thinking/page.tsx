"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const STAGES = [
  {
    n: "01",
    key: "empathize",
    label: "Empathize",
    icon: "👁️",
    color: "#06B6D4",
    tagline: "Understand the people",
    description: "Go to the streets. Talk to residents, drivers, city officials. Observe how people actually live with the problem — not how you imagine they do.",
    hexcity: "Walk around your neighborhood. Document how traffic actually flows, where water is wasted, where energy is lost. Use your phone to photograph and record. The problem only exists in the real world.",
    methods: ["Street observation", "User interviews", "Photo documentation", "Journey mapping"],
    questions: [
      "Who is most affected by this problem?",
      "What do they do to workaround it today?",
      "What frustrates them most?",
      "What would make their day significantly better?",
    ],
    output: "User research notes, photos, empathy map",
  },
  {
    n: "02",
    key: "define",
    label: "Define",
    icon: "🎯",
    color: "#7C3AED",
    tagline: "Frame the right problem",
    description: "Synthesize your research into a clear problem statement. A well-defined problem is already halfway solved. Avoid vague definitions.",
    hexcity: "Write a Point of View (POV): [User] needs [need] because [insight]. Example: 'Commuters on Av. Paulista need to predict traffic density 10 minutes ahead because they lose an average of 47 minutes per day in unpredictable jams.'",
    methods: ["POV statement", "SWOT analysis", "Affinity mapping", "Problem framing"],
    questions: [
      "What is the core problem (not symptom)?",
      "Who specifically is affected?",
      "What are the constraints? (budget, time, size)",
      "How will we know if we solved it?",
    ],
    output: "POV statement, SWOT analysis, success metrics",
  },
  {
    n: "03",
    key: "ideate",
    label: "Ideate",
    icon: "💡",
    color: "#F59E0B",
    tagline: "Generate many solutions",
    description: "Quantity over quality — first. Generate 20, 50, 100 ideas before judging any of them. Wild ideas often contain the seed of the best solution.",
    hexcity: "Each team member writes 5 ideas in 5 minutes. No criticism allowed. Then share and build on each other's ideas. After 3 rounds, use the SWOT matrix to evaluate the top 5 candidates for your hex project.",
    methods: ["Brainstorming", "SCAMPER", "Crazy 8s", "Mind mapping"],
    questions: [
      "What if resources were unlimited?",
      "What would a 10-year-old invent?",
      "How would nature solve this?",
      "What's the complete opposite approach?",
    ],
    output: "Idea canvas, SWOT matrix, selected concept",
  },
  {
    n: "04",
    key: "prototype",
    label: "Prototype",
    icon: "🔧",
    color: "#22C55E",
    tagline: "Build to think",
    description: "A prototype is not a final product — it is a hypothesis made tangible. Build the simplest version that tests your key assumption.",
    hexcity: "First, prototype in Tinkercad (digital circuit + Arduino code). Then build the physical hex. The goal is not perfection — it's learning. What breaks? What doesn't work as expected? That is valuable data.",
    methods: ["Tinkercad simulation", "Breadboard circuit", "3D structure mock", "Code MVP"],
    questions: [
      "What is the ONE assumption we're testing?",
      "What's the minimum version that tests it?",
      "How will we know if it works?",
      "What can we reuse from existing builds?",
    ],
    output: "Tinkercad simulation, physical prototype, test plan",
  },
  {
    n: "05",
    key: "test",
    label: "Test",
    icon: "🧪",
    color: "#EC4899",
    tagline: "Learn from failure fast",
    description: "Put your prototype in front of real people and observe — without explaining it. Their confusion is your data. Iterate rapidly.",
    hexcity: "Connect your hex to the city. Does it work with the neighboring hexes? Does the overall system behave as expected? Every failure is a lesson. Document what you changed and why.",
    methods: ["User testing", "System integration test", "Stress testing", "Iteration log"],
    questions: [
      "Did it solve the problem we defined?",
      "What broke unexpectedly?",
      "What would users change?",
      "Is the system integration stable?",
    ],
    output: "Test results, iteration log, final presentation",
  },
];

const SWOT_TEMPLATE = [
  { quadrant: "Strengths", color: "#22C55E", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)", items: ["What does our solution do well?", "What unique tech/skill do we have?", "Why is our approach innovative?"] },
  { quadrant: "Weaknesses", color: "#EF4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", items: ["What limits our solution?", "What resources are missing?", "What could fail in our prototype?"] },
  { quadrant: "Opportunities", color: "#06B6D4", bg: "rgba(6,182,212,0.08)", border: "rgba(6,182,212,0.2)", items: ["How can we scale this?", "What external support exists?", "How does this help the city system?"] },
  { quadrant: "Threats", color: "#F59E0B", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", items: ["What could break this?", "What external factors affect us?", "What happens if integration fails?"] },
];

export default function DesignThinkingPage() {
  const [activeStage, setActiveStage] = useState(0);
  const [activeTab, setActiveTab] = useState<"overview" | "swot">("overview");
  const stage = STAGES[activeStage];

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <div className="pt-24 pb-12 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-hex-purple/8 blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-hex-purple/20 text-hex-purple-light text-xs font-medium tracking-widest uppercase border border-hex-purple/30">
              Stanford d.school Method
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 leading-none">
            Design
            <br />
            <span className="gradient-text">Thinking.</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mt-6">
            The 5-stage framework that transforms problems into solutions. Applied to HEXCITY — from street observation to working prototype.
          </p>
        </div>
      </div>

      {/* Stage selector — horizontal timeline */}
      <div className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-2xl p-4 overflow-x-auto no-scrollbar">
            <div className="flex gap-3 min-w-max">
              {STAGES.map((s, i) => (
                <button
                  key={s.key}
                  onClick={() => setActiveStage(i)}
                  className={`flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeStage === i ? "text-white" : "text-white/40 hover:text-white/70"
                  }`}
                  style={activeStage === i ? { background: `${s.color}20`, border: `1px solid ${s.color}40` } : { border: "1px solid transparent" }}
                >
                  <span className="text-xl">{s.icon}</span>
                  <div className="text-left">
                    <div className="text-xs opacity-50 font-mono">{s.n}</div>
                    <div>{s.label}</div>
                  </div>
                  {activeStage === i && (
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse ml-1" style={{ background: s.color }} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stage detail */}
      <div className="flex-1 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Tab switcher */}
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "overview" ? "text-white" : "text-white/40 hover:text-white/60"}`}
              style={activeTab === "overview" ? { background: `${stage.color}20`, border: `1px solid ${stage.color}40` } : {}}
            >
              Stage Overview
            </button>
            <button
              onClick={() => setActiveTab("swot")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "swot" ? "text-white" : "text-white/40 hover:text-white/60"}`}
              style={activeTab === "swot" ? { background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)" } : {}}
            >
              SWOT Analysis Tool
            </button>
          </div>

          {activeTab === "overview" && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main card */}
              <div className="lg:col-span-2 space-y-6">
                {/* Header */}
                <div className="glass rounded-2xl p-8 border" style={{ borderColor: `${stage.color}30` }}>
                  <div className="flex items-start gap-5 mb-6">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0" style={{ background: `${stage.color}18` }}>
                      {stage.icon}
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold mb-1 opacity-50" style={{ color: stage.color }}>{stage.n} / 05</div>
                      <h2 className="font-display text-4xl font-bold mb-1">{stage.label}</h2>
                      <p className="text-lg font-medium" style={{ color: stage.color }}>{stage.tagline}</p>
                    </div>
                  </div>
                  <p className="text-white/65 leading-relaxed text-lg">{stage.description}</p>
                </div>

                {/* HexCity application */}
                <div className="glass rounded-2xl p-8" style={{ borderLeft: `3px solid ${stage.color}` }}>
                  <div className="flex items-center gap-2 mb-4">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={stage.color} strokeWidth="2">
                      <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                    </svg>
                    <span className="text-xs font-medium tracking-widest uppercase" style={{ color: stage.color }}>Applied to HEXCITY</span>
                  </div>
                  <p className="text-white/65 leading-relaxed">{stage.hexcity}</p>
                </div>

                {/* Key questions */}
                <div className="glass rounded-2xl p-8">
                  <h3 className="font-display font-bold text-lg mb-5 text-white">Key Questions</h3>
                  <div className="space-y-3">
                    {stage.questions.map((q, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5" style={{ background: `${stage.color}20`, color: stage.color }}>
                          {i + 1}
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed">{q}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Methods */}
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-display font-bold text-sm mb-4 text-white/70 uppercase tracking-widest">Methods</h3>
                  <div className="space-y-2">
                    {stage.methods.map((m) => (
                      <div key={m} className="flex items-center gap-3 py-2 border-b border-white/5">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: stage.color }} />
                        <span className="text-white/65 text-sm">{m}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Output */}
                <div className="glass rounded-2xl p-6" style={{ borderColor: `${stage.color}25` }}>
                  <h3 className="font-display font-bold text-sm mb-3 text-white/70 uppercase tracking-widest">Stage Output</h3>
                  <p className="text-white/55 text-sm leading-relaxed">{stage.output}</p>
                </div>

                {/* Stage navigation */}
                <div className="flex gap-2">
                  {activeStage > 0 && (
                    <button
                      onClick={() => setActiveStage(activeStage - 1)}
                      className="flex-1 py-3 rounded-xl glass border border-white/10 hover:border-white/20 text-white/60 hover:text-white text-sm font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                      Back
                    </button>
                  )}
                  {activeStage < STAGES.length - 1 && (
                    <button
                      onClick={() => setActiveStage(activeStage + 1)}
                      className="flex-1 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 text-white"
                      style={{ background: `${STAGES[activeStage + 1].color}25`, border: `1px solid ${STAGES[activeStage + 1].color}40` }}
                    >
                      Next: {STAGES[activeStage + 1].label}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </button>
                  )}
                </div>

                {/* Flow visual */}
                <div className="glass rounded-2xl p-5">
                  <div className="text-xs text-white/25 uppercase tracking-widest mb-4">Process</div>
                  {STAGES.map((s, i) => (
                    <button
                      key={s.key}
                      onClick={() => setActiveStage(i)}
                      className="w-full flex items-center gap-3 py-2 group"
                    >
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all" style={i === activeStage ? { background: s.color, color: "white" } : { background: `${s.color}15`, color: s.color }}>
                        {i + 1}
                      </div>
                      <span className={`text-sm transition-all ${i === activeStage ? "text-white font-medium" : "text-white/35 group-hover:text-white/60"}`}>{s.label}</span>
                      {i < STAGES.length - 1 && (
                        <div className="flex-1 flex items-center">
                          <div className="w-full h-px" style={{ background: i < activeStage ? s.color : "rgba(255,255,255,0.08)" }} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "swot" && <SWOTTool />}
        </div>
      </div>

      <Footer />
    </main>
  );
}

function SWOTTool() {
  const [values, setValues] = useState<Record<string, string>>({
    Strengths: "", Weaknesses: "", Opportunities: "", Threats: "",
  });

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold mb-2">SWOT Analysis</h2>
        <p className="text-white/45">Use this to evaluate your HEXCITY project concept. Be honest — a realistic SWOT leads to better solutions.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {SWOT_TEMPLATE.map((q) => (
          <div key={q.quadrant} className="rounded-2xl p-6 border" style={{ background: q.bg, borderColor: q.border }}>
            <h3 className="font-display font-bold text-lg mb-1" style={{ color: q.color }}>{q.quadrant}</h3>
            <div className="space-y-1.5 mb-4">
              {q.items.map((item) => (
                <p key={item} className="text-xs text-white/35 flex items-start gap-1.5">
                  <span className="opacity-50">→</span> {item}
                </p>
              ))}
            </div>
            <textarea
              className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white/80 text-sm resize-none outline-none focus:border-opacity-60 transition-all placeholder-white/20"
              style={{ borderColor: `${q.color}20` }}
              rows={5}
              placeholder={`Write your ${q.quadrant.toLowerCase()} here...`}
              value={values[q.quadrant]}
              onChange={(e) => setValues((v) => ({ ...v, [q.quadrant]: e.target.value }))}
            />
          </div>
        ))}
      </div>

      {/* HMW statement generator */}
      <div className="glass rounded-2xl p-8">
        <h3 className="font-display font-bold text-xl mb-2">How Might We...?</h3>
        <p className="text-white/40 text-sm mb-6">Turn your problem into a design challenge with this framing technique.</p>
        <div className="glass rounded-xl p-6 border border-hex-purple/20">
          <p className="text-white/50 text-sm mb-3">Example from your SWOT:</p>
          <p className="text-white font-medium text-lg">
            "How might we{" "}
            <span className="text-hex-purple-light">[solve the weakness]</span>
            {" "}while{" "}
            <span className="text-hex-cyan">[leveraging the strength]</span>
            {" "}to{" "}
            <span className="text-hex-green">[capture the opportunity]</span>?"
          </p>
        </div>
        <div className="mt-6 grid sm:grid-cols-3 gap-4">
          {[
            { label: "Narrow HMW", desc: "Too specific — limits solutions", example: "How might we add a solar panel to the roof?" },
            { label: "Good HMW", desc: "Just right — opens possibilities", example: "How might we power this hex from renewable sources?" },
            { label: "Broad HMW", desc: "Too vague — hard to act on", example: "How might we save the planet?" },
          ].map((ex) => (
            <div key={ex.label} className="glass rounded-xl p-4">
              <div className="font-display font-bold text-xs text-white/60 mb-1">{ex.label}</div>
              <div className="text-xs text-white/30 mb-3 italic">{ex.desc}</div>
              <p className="text-white/55 text-xs leading-relaxed">"{ex.example}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

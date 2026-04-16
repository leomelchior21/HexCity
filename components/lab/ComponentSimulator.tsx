"use client";
import { useState, useEffect, useRef } from "react";
import type { ComponentDef } from "./ComponentData";

export default function ComponentSimulator({ comp }: { comp: ComponentDef }) {
  const sim = comp.simType;

  // Shared state
  const [val, setVal] = useState(50);
  const [val2, setVal2] = useState(50);
  const [val3, setVal3] = useState(50);
  const [on, setOn] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [channels, setChannels] = useState([false, false, false, false]);
  const buzzerRef = useRef<OscillatorNode | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (sim === "buzzer") return;

    if (buzzerRef.current) {
      buzzerRef.current.stop();
      buzzerRef.current = null;
    }

    if (audioRef.current) {
      audioRef.current.close();
      audioRef.current = null;
    }
  }, [sim]);

  useEffect(() => {
    return () => {
      if (buzzerRef.current) {
        buzzerRef.current.stop();
        buzzerRef.current = null;
      }

      if (audioRef.current) {
        audioRef.current.close();
        audioRef.current = null;
      }
    };
  }, []);

  // LED on/off
  if (sim === "led") {
    return (
      <div className="flex flex-col items-center gap-6 py-4">
        <div className="relative">
          <div
            className="w-20 h-20 rounded-full transition-all duration-300"
            style={{
              background: on ? "#F59E0B" : "#1a1a1a",
              boxShadow: on ? "0 0 40px 20px rgba(245,158,11,0.5)" : "none",
              border: `2px solid ${on ? "#F59E0B" : "#333"}`,
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-2xl">
            {on ? "💡" : "⚫"}
          </div>
        </div>
        <button
          onClick={() => setOn(!on)}
          className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${
            on
              ? "bg-amber-500 text-black"
              : "glass border border-white/10 text-white/60 hover:text-white"
          }`}
        >
          {on ? "ON — Click to turn OFF" : "OFF — Click to turn ON"}
        </button>
        <div className="text-xs font-mono text-white/40">
          digitalWrite(pin, {on ? "HIGH" : "LOW"});
        </div>
      </div>
    );
  }

  // RGB
  if (sim === "rgb") {
    const r = val, g = val2, b = val3;
    return (
      <div className="flex flex-col items-center gap-6 py-4">
        <div
          className="w-24 h-24 rounded-full transition-all duration-200"
          style={{
            background: `rgb(${r},${g},${b})`,
            boxShadow: `0 0 40px 20px rgba(${r},${g},${b},0.4)`,
            border: "2px solid rgba(255,255,255,0.1)",
          }}
        />
        <div className="w-full space-y-3">
          {[
            { label: "R", val: r, set: setVal, color: "#EF4444" },
            { label: "G", val: g, set: setVal2, color: "#22C55E" },
            { label: "B", val: b, set: setVal3, color: "#06B6D4" },
          ].map((ch) => (
            <div key={ch.label} className="flex items-center gap-3">
              <span className="text-xs font-mono w-4" style={{ color: ch.color }}>{ch.label}</span>
              <input
                type="range" min={0} max={255}
                value={ch.val}
                onChange={(e) => ch.set(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-xs font-mono text-white/40 w-8 text-right">{ch.val}</span>
            </div>
          ))}
        </div>
        <div className="text-xs font-mono text-white/40 text-center">
          analogWrite(R,{r}); analogWrite(G,{g}); analogWrite(B,{b});
        </div>
      </div>
    );
  }

  // Servo 180
  if (sim === "servo180") {
    const angle = Math.round((val / 100) * 180);
    return (
      <div className="flex flex-col items-center gap-6 py-4">
        <ServoViz angle={angle} color="#06B6D4" />
        <div className="w-full flex items-center gap-3">
          <span className="text-xs text-white/40 w-6">0°</span>
          <input type="range" min={0} max={100} value={val} onChange={(e) => setVal(Number(e.target.value))} className="flex-1" />
          <span className="text-xs text-white/40 w-10">180°</span>
        </div>
        <div className="text-xs font-mono text-white/40">servo.write({angle});</div>
      </div>
    );
  }

  // Stepper Motor
  if (sim === "stepper") {
    const steps = Math.round((val / 100) * 2048);
    const rpm = ((val2 / 100) * 15).toFixed(1);
    const direction = val3 > 50 ? "CW →" : "← CCW";
    return (
      <div className="flex flex-col items-center gap-6 py-4">
        <div className="relative w-24 h-24">
          <div
            className="w-full h-full rounded-full border-2 border-hex-green/40 flex items-center justify-center"
            style={{
              animation: `spin ${Math.max(0.3, 4 - (val2 / 100) * 3)}s linear infinite ${val3 <= 50 ? "reverse" : "normal"}`,
            }}
          >
            <div className="w-1 h-8 bg-hex-green rounded-full origin-bottom absolute bottom-1/2" />
            <div className="w-8 h-1 bg-hex-green rounded-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center text-xl">🔩</div>
        </div>
        <div className="w-full space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/40 w-12">Steps</span>
            <input type="range" min={0} max={100} value={val} onChange={(e) => setVal(Number(e.target.value))} className="flex-1" />
            <span className="text-xs font-mono text-white/60 w-12 text-right">{steps}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/40 w-12">RPM</span>
            <input type="range" min={0} max={100} value={val2} onChange={(e) => setVal2(Number(e.target.value))} className="flex-1" />
            <span className="text-xs font-mono text-white/60 w-12 text-right">{rpm}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/40 w-12">Dir</span>
            <input type="range" min={0} max={100} value={val3} onChange={(e) => setVal3(Number(e.target.value))} className="flex-1" />
            <span className="text-xs font-mono text-white/60 w-12 text-right">{direction}</span>
          </div>
        </div>
        <div className="text-xs font-mono text-white/40 text-center">
          stepper.step({steps}, {val3 > 50 ? "FORWARD" : "BACKWARD"}, {rpm} RPM);
        </div>
      </div>
    );
  }

  // Buzzer
  if (sim === "buzzer") {
    const freq = Math.round(100 + (val / 100) * 1900);
    const toggleBuzzer = () => {
      if (on) {
        buzzerRef.current?.stop();
        buzzerRef.current = null;
        setOn(false);
      } else {
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        audioRef.current = ctx;
        const osc = ctx.createOscillator();
        osc.type = "square";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.connect(ctx.destination);
        osc.start();
        buzzerRef.current = osc;
        setOn(true);
      }
    };
    return (
      <div className="flex flex-col items-center gap-6 py-4">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all ${on ? "bg-red-500/20 border-2 border-red-500" : "glass border border-white/10"}`}>
          {on ? "🔔" : "🔕"}
        </div>
        <div className="w-full flex items-center gap-3">
          <span className="text-xs text-white/40 w-12">100Hz</span>
          <input type="range" min={0} max={100} value={val} onChange={(e) => { setVal(Number(e.target.value)); if (buzzerRef.current && audioRef.current) { buzzerRef.current.frequency.setValueAtTime(Math.round(100 + (Number(e.target.value) / 100) * 1900), audioRef.current.currentTime); }}} className="flex-1" />
          <span className="text-xs text-white/40 w-12 text-right">2kHz</span>
        </div>
        <button onClick={toggleBuzzer} className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${on ? "bg-red-500 text-white" : "glass border border-white/10 text-white/60 hover:text-white"}`}>
          {on ? "STOP" : `PLAY ${freq}Hz`}
        </button>
        <div className="text-xs font-mono text-white/40">tone(pin, {freq});</div>
      </div>
    );
  }

  // Relay
  if (sim === "relay") {
    const devices = [
      { name: "Fan", icon: "🌀", channel: 0, color: "#06B6D4" },
      { name: "Water Pump", icon: "💧", channel: 1, color: "#3B82F6" },
      { name: "Lamp", icon: "💡", channel: 2, color: "#F59E0B" },
      { name: "Heater", icon: "🔥", channel: 3, color: "#EF4444" },
    ];
    const toggle = (ch: number) => {
      setChannels(prev => prev.map((v, i) => i === ch ? !v : v));
    };

    const activeCount = channels.filter(Boolean).length;

    return (
      <div className="flex flex-col items-center gap-5 py-4">
        {/* Relay module visualization */}
        <div className="glass rounded-xl p-4 w-full max-w-xs">
          <div className="text-[10px] text-white/30 font-mono tracking-widest uppercase text-center mb-3">
            4-Channel Relay Module
          </div>

          {/* Device cards */}
          <div className="space-y-2">
            {devices.map((dev, i) => (
              <button
                key={dev.name}
                onClick={() => toggle(i)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200"
                style={{
                  background: channels[i] ? `${dev.color}15` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${channels[i] ? `${dev.color}40` : "rgba(255,255,255,0.06)"}`,
                }}
              >
                <span className="text-xl">{dev.icon}</span>
                <div className="flex-1 text-left">
                  <div className="text-xs font-medium text-white/80">{dev.name}</div>
                  <div className="text-[10px] text-white/30 font-mono">CH{i + 1}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full transition-all"
                    style={{
                      background: channels[i] ? dev.color : "rgba(255,255,255,0.15)",
                      boxShadow: channels[i] ? `0 0 8px ${dev.color}` : "none",
                    }}
                  />
                  <span className={`text-[10px] font-mono ${channels[i] ? "text-hex-green" : "text-white/25"}`}>
                    {channels[i] ? "ON" : "OFF"}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Status bar */}
          <div className="mt-3 flex items-center justify-between text-[10px] font-mono">
            <span className="text-white/30">{activeCount}/4 active</span>
            <span className={activeCount > 0 ? "text-hex-green" : "text-white/20"}>
              {activeCount > 0 ? "● POWERED" : "○ STANDBY"}
            </span>
          </div>
        </div>

        {/* Code hint */}
        <div className="text-xs font-mono text-white/40 text-center">
          {devices.map((d, i) => `digitalWrite(CH${i + 1}, ${channels[i] ? "HIGH" : "LOW"});`).join("\n")}
        </div>
      </div>
    );
  }

  // Potentiometer
  if (sim === "potentiometer") {
    const analog = Math.round((val / 100) * 1023);
    const voltage = ((val / 100) * 5).toFixed(2);
    return (
      <div className="flex flex-col items-center gap-6 py-4">
        <KnobViz value={val} color="#F59E0B" />
        <div className="w-full flex items-center gap-3">
          <span className="text-xs text-white/40">0</span>
          <input type="range" min={0} max={100} value={val} onChange={(e) => setVal(Number(e.target.value))} className="flex-1" />
          <span className="text-xs text-white/40">100%</span>
        </div>
        <div className="flex gap-4">
          <div className="glass rounded-lg px-4 py-2 text-center">
            <div className="text-xs text-white/30 mb-1">analogRead()</div>
            <div className="font-mono font-bold text-amber-400">{analog}</div>
          </div>
          <div className="glass rounded-lg px-4 py-2 text-center">
            <div className="text-xs text-white/30 mb-1">Tensão</div>
            <div className="font-mono font-bold text-amber-400">{voltage}V</div>
          </div>
        </div>
      </div>
    );
  }

  // Button
  if (sim === "button") {
    return (
      <div className="flex flex-col items-center gap-6 py-4">
        <button
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          onTouchStart={() => setPressed(true)}
          onTouchEnd={() => setPressed(false)}
          className={`w-24 h-24 rounded-2xl text-4xl transition-all duration-100 select-none ${pressed ? "bg-hex-cyan/40 border-2 border-hex-cyan scale-95" : "glass border border-white/15 hover:border-white/30"}`}
        >
          🔘
        </button>
        <div className={`text-sm font-bold px-6 py-2 rounded-full transition-all ${pressed ? "bg-hex-cyan/20 text-hex-cyan" : "bg-white/5 text-white/40"}`}>
          {pressed ? "PRESSIONADO" : "SOLTO"}
        </div>
        <div className="text-xs font-mono text-white/40">
          digitalRead(pin) == {pressed ? "LOW" : "HIGH"}; <span className="text-white/20">// INPUT_PULLUP</span>
        </div>
      </div>
    );
  }

  // LDR
  if (sim === "ldr") {
    const ldrVal = Math.round(1023 - (val / 100) * 1023);
    return (
      <div className="flex flex-col items-center gap-6 py-4">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full transition-all duration-300"
            style={{ background: `radial-gradient(circle, rgba(245,158,11,${val / 100 * 0.8}) 0%, transparent 70%)` }} />
          <div className="relative z-10 text-4xl">{val > 70 ? "☀️" : val > 30 ? "🌤️" : "🌑"}</div>
        </div>
        <div className="w-full">
          <div className="flex justify-between text-xs text-white/30 mb-2">
            <span>Escuro</span><span>Claro</span>
          </div>
          <input type="range" min={0} max={100} value={val} onChange={(e) => setVal(Number(e.target.value))} className="w-full" />
        </div>
        <div className="glass rounded-lg px-4 py-2 text-center">
          <div className="text-xs text-white/30 mb-1">analogRead()</div>
          <div className="font-mono font-bold text-amber-400">{ldrVal}</div>
          <div className="text-xs text-white/25">{val < 30 ? "Escuro" : val < 70 ? "Médio" : "Muito claro"}</div>
        </div>
      </div>
    );
  }

  // Ultrasonic
  if (sim === "ultrasonic") {
    const cm = Math.round(2 + (val / 100) * 398);
    const barWidth = (val / 100) * 100;
    return (
      <div className="flex flex-col items-center gap-6 py-4">
        <div className="flex items-center gap-4">
          <div className="text-3xl">📡</div>
          <div className="flex-1 h-4 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-hex-cyan/60 rounded-full transition-all duration-200 flex items-center justify-end pr-2"
              style={{ width: `${barWidth}%` }}
            />
          </div>
          <div className="font-mono font-bold text-hex-cyan w-16 text-right">{cm}cm</div>
        </div>
        <div className="w-full flex items-center gap-3">
          <span className="text-xs text-white/40 w-10">2cm</span>
          <input type="range" min={0} max={100} value={val} onChange={(e) => setVal(Number(e.target.value))} className="flex-1" />
          <span className="text-xs text-white/40 w-12 text-right">400cm</span>
        </div>
        <div className="text-xs font-mono text-white/40">
          pulseIn(ECHO, HIGH) / 58 = {cm}cm
        </div>
      </div>
    );
  }

  // Temperature
  if (sim === "temp") {
    const temp = Math.round(-10 + (val / 100) * 65);
    const color = temp < 15 ? "#06B6D4" : temp < 30 ? "#22C55E" : temp < 40 ? "#F59E0B" : "#EF4444";
    return (
      <div className="flex flex-col items-center gap-6 py-4">
        <div className="relative">
          <div className="w-12 h-32 rounded-full bg-white/5 border border-white/10 flex flex-col justify-end overflow-hidden">
            <div className="w-full rounded-b-full transition-all duration-300" style={{ height: `${val}%`, background: color }} />
          </div>
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 font-mono font-bold text-xl" style={{ color }}>
            {temp}°C
          </div>
        </div>
        <div className="w-full">
          <div className="flex justify-between text-xs text-white/30 mb-2"><span>-10°C</span><span>55°C</span></div>
          <input type="range" min={0} max={100} value={val} onChange={(e) => setVal(Number(e.target.value))} className="w-full" />
        </div>
        <div className="text-xs font-mono text-white/40">dht.readTemperature() = {temp}.0°C</div>
      </div>
    );
  }

  // Humidity (and soil, rain, water level, turbidity — generic slider readout)
  const genericSensors: Record<string, { label: string; unit: string; min: string; max: string; color: string; formula: string }> = {
    humidity: { label: "Umidade do Ar", unit: "%", min: "0%", max: "100%", color: "#06B6D4", formula: "dht.readHumidity()" },
    turbidity: { label: "Turbidez", unit: "NTU", min: "Claro", max: "Turvo", color: "#8B5CF6", formula: "analogRead(A0)" },
    waterlevel: { label: "Nível de Água", unit: "%", min: "0cm", max: "100%", color: "#06B6D4", formula: "analogRead(S)" },
    rain: { label: "Intensidade da Chuva", unit: "%", min: "Seco", max: "Encharcado", color: "#7C3AED", formula: "analogRead(A0)" },
    soil: { label: "Umidade do Solo", unit: "%", min: "Seco", max: "Úmido", color: "#22C55E", formula: "analogRead(A0)" },
  };

  if (genericSensors[sim]) {
    const g = genericSensors[sim];
    const reading = sim === "soil"
      ? Math.round(1023 - (val / 100) * 900)
      : Math.round((val / 100) * 1023);
    return (
      <div className="flex flex-col items-center gap-6 py-4">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="40" fill="none"
              stroke={g.color} strokeWidth="8"
              strokeDasharray={`${val * 2.51} 251`}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 0.3s" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono font-bold text-xl" style={{ color: g.color }}>{val}%</span>
            <span className="text-xs text-white/30">{g.unit}</span>
          </div>
        </div>
        <div className="w-full">
          <div className="flex justify-between text-xs text-white/30 mb-2"><span>{g.min}</span><span>{g.max}</span></div>
          <input type="range" min={0} max={100} value={val} onChange={(e) => setVal(Number(e.target.value))} className="w-full" />
        </div>
        <div className="text-xs font-mono text-white/40">{g.formula} = {reading}</div>
      </div>
    );
  }

  return null;
}

function ServoViz({ angle, color }: { angle: number; color: string }) {
  const rad = ((angle - 90) * Math.PI) / 180;
  const x = 60 + 40 * Math.cos(rad);
  const y = 60 + 40 * Math.sin(rad);
  return (
    <svg viewBox="0 0 120 120" width="120" height="120">
      <circle cx="60" cy="60" r="50" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      {[0, 45, 90, 135, 180].map((a) => {
        const r2 = ((a - 90) * Math.PI) / 180;
        return (
          <text key={a} x={60 + 42 * Math.cos(r2)} y={60 + 42 * Math.sin(r2) + 3} textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.2)">{a}°</text>
        );
      })}
      <path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
      <line x1="60" y1="60" x2={x} y2={y} stroke={color} strokeWidth="3" strokeLinecap="round" />
      <circle cx={x} cy={y} r="4" fill={color} />
      <circle cx="60" cy="60" r="6" fill={color} />
      <text x="60" y="100" textAnchor="middle" fontSize="10" fill={color} fontWeight="bold">{angle}°</text>
    </svg>
  );
}

function KnobViz({ value, color }: { value: number; color: string }) {
  const angle = -135 + (value / 100) * 270;
  const rad = (angle * Math.PI) / 180;
  const x = 40 + 28 * Math.cos(rad);
  const y = 40 + 28 * Math.sin(rad);
  return (
    <svg viewBox="0 0 80 80" width="80" height="80">
      <circle cx="40" cy="40" r="35" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
      <circle cx="40" cy="40" r="24" fill="rgba(255,255,255,0.06)" />
      <line x1="40" y1="40" x2={x} y2={y} stroke={color} strokeWidth="3" strokeLinecap="round" />
      <circle cx={x} cy={y} r="3.5" fill={color} />
      <circle cx="40" cy="40" r="4" fill={color} opacity="0.6" />
    </svg>
  );
}

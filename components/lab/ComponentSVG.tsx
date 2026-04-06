// Realistic SVG illustrations of Arduino components
// Each SVG is drawn to resemble the physical component

interface Props {
  id: string;
  color: string;
}

export default function ComponentSVG({ id, color }: Props) {
  switch (id) {
    case "led":       return <LEDSVG color={color} />;
    case "rgb":       return <RGBLEDSVG color={color} />;
    case "servo180":  return <ServoSVG color={color} />;
    case "stepper":   return <StepperSVG color={color} />;
    case "buzzer":    return <BuzzerSVG color={color} />;
    case "relay":     return <RelaySVG color={color} />;
    case "potentiometer": return <PotentiometerSVG color={color} />;
    case "button":    return <ButtonSVG color={color} />;
    case "ldr":       return <LDRSVG color={color} />;
    case "ultrasonic": return <UltrasonicSVG color={color} />;
    case "temp":      return <DHT11SVG color={color} />;
    case "humidity":  return <DHT11SVG color={color} />;
    case "turbidity": return <TurbiditySVG color={color} />;
    case "waterlevel": return <WaterLevelSVG color={color} />;
    case "rain":      return <RainSVG color={color} />;
    case "soil":      return <SoilSVG color={color} />;
    default:          return <DefaultSVG color={color} />;
  }
}

// ─── LED ────────────────────────────────────────────────────────────────────
function LEDSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none">
      {/* Glow */}
      <circle cx="40" cy="30" r="22" fill={`${color}10`} />
      {/* LED dome (hemisphere) */}
      <ellipse cx="40" cy="32" rx="14" ry="5" fill={`${color}60`} />
      <path d="M 26 32 Q 26 18 40 18 Q 54 18 54 32" fill={`${color}80`} stroke={color} strokeWidth="1.5" />
      {/* LED flat bottom */}
      <rect x="29" y="32" width="22" height="8" fill={`${color}60`} stroke={color} strokeWidth="1" rx="0" />
      <ellipse cx="40" cy="40" rx="11" ry="3.5" fill={`${color}50`} stroke={color} strokeWidth="1" />
      {/* Specular highlight */}
      <ellipse cx="36" cy="24" rx="4" ry="2.5" fill="rgba(255,255,255,0.35)" transform="rotate(-20,36,24)" />
      {/* Flat side indicator (cathode) */}
      <line x1="51" y1="32" x2="51" y2="40" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
      {/* Legs */}
      <line x1="36" y1="43" x2="36" y2="65" stroke="#aaaaaa" strokeWidth="2" />
      <line x1="44" y1="43" x2="44" y2="65" stroke="#888888" strokeWidth="2" />
      {/* Leg labels */}
      <text x="30" y="74" fontSize="7" fill="rgba(255,255,255,0.3)" fontFamily="monospace">+</text>
      <text x="42" y="74" fontSize="7" fill="rgba(255,255,255,0.3)" fontFamily="monospace">−</text>
    </svg>
  );
}

// ─── RGB LED ─────────────────────────────────────────────────────────────────
function RGBLEDSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none">
      {/* Dome */}
      <path d="M 28 34 Q 28 18 40 18 Q 52 18 52 34" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      {/* RGB segments inside dome */}
      <path d="M 28 34 Q 28 18 34 18 Q 40 18 40 34" fill="rgba(239,68,68,0.45)" />
      <path d="M 34 18 Q 40 18 40 34 L 40 34 Q 40 18 46 18" fill="rgba(34,197,94,0.45)" />
      <path d="M 40 18 Q 46 18 52 34" fill="rgba(6,182,212,0.45)" />
      {/* Bottom cylinder */}
      <rect x="30" y="34" width="20" height="8" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <ellipse cx="40" cy="42" rx="10" ry="3" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      {/* Specular */}
      <ellipse cx="36" cy="24" rx="3.5" ry="2" fill="rgba(255,255,255,0.3)" transform="rotate(-20,36,24)" />
      {/* 4 legs */}
      <line x1="32" y1="44" x2="32" y2="64" stroke="#aaa" strokeWidth="1.8" />
      <line x1="37" y1="44" x2="37" y2="64" stroke="#ef4444" strokeWidth="1.8" />
      <line x1="43" y1="44" x2="43" y2="64" stroke="#22c55e" strokeWidth="1.8" />
      <line x1="48" y1="44" x2="48" y2="64" stroke="#06b6d4" strokeWidth="1.8" />
      {/* Leg labels */}
      <text x="26" y="73" fontSize="6" fill="rgba(255,255,255,0.3)" fontFamily="monospace">V</text>
      <text x="34" y="73" fontSize="6" fill="rgba(239,68,68,0.6)" fontFamily="monospace">R</text>
      <text x="40" y="73" fontSize="6" fill="rgba(34,197,94,0.6)" fontFamily="monospace">G</text>
      <text x="46" y="73" fontSize="6" fill="rgba(6,182,212,0.6)" fontFamily="monospace">B</text>
    </svg>
  );
}

// ─── Servo Motor ─────────────────────────────────────────────────────────────
function ServoSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none">
      {/* Main body */}
      <rect x="12" y="20" width="40" height="42" rx="5" fill={`${color}15`} stroke={color} strokeWidth="1.5" />
      {/* Body detail lines */}
      <rect x="14" y="24" width="36" height="4" rx="2" fill={`${color}20`} />
      {/* Mounting ears */}
      <rect x="6" y="26" width="8" height="10" rx="2" fill={`${color}20`} stroke={color} strokeWidth="1" />
      <rect x="50" y="26" width="8" height="10" rx="2" fill={`${color}20`} stroke={color} strokeWidth="1" />
      <circle cx="10" cy="31" r="2" fill={`${color}60`} />
      <circle cx="54" cy="31" r="2" fill={`${color}60`} />
      {/* Output shaft */}
      <circle cx="32" cy="41" r="10" fill={`${color}25`} stroke={color} strokeWidth="1.5" />
      <circle cx="32" cy="41" r="6" fill={`${color}15`} stroke={`${color}80`} strokeWidth="1" />
      <circle cx="32" cy="41" r="2.5" fill={color} />
      {/* Servo horn */}
      <rect x="29" y="24" width="6" height="17" rx="3" fill={color} opacity="0.7" />
      <circle cx="32" cy="24" r="3" fill={color} />
      {/* Wire colors */}
      <rect x="20" y="58" width="4" height="8" rx="1" fill="#ef4444" />
      <rect x="26" y="58" width="4" height="8" rx="1" fill="#888" />
      <rect x="32" y="58" width="4" height="8" rx="1" fill="#f59e0b" />
      <text x="19" y="74" fontSize="5.5" fill="rgba(255,255,255,0.3)" fontFamily="monospace">V − S</text>
    </svg>
  );
}

// ─── Stepper Motor ───────────────────────────────────────────────────────────
function StepperSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none">
      {/* Main body (cylindrical motor) */}
      <rect x="16" y="18" width="36" height="44" rx="4" fill={`${color}15`} stroke={color} strokeWidth="1.5" />
      {/* Top cap */}
      <rect x="16" y="18" width="36" height="8" rx="4" fill={`${color}25`} />
      {/* Motor shaft */}
      <rect x="30" y="6" width="8" height="14" rx="2" fill="#aaa" stroke="#888" strokeWidth="1" />
      <circle cx="34" cy="6" r="3" fill="#bbb" />
      {/* Coil windings pattern */}
      {[24, 30, 36, 42, 48].map((y) => (
        <line key={y} x1="20" y1={y} x2="48" y2={y} stroke={`${color}30`} strokeWidth="1" />
      ))}
      {/* Gear/rotor hint */}
      <circle cx="34" cy="40" r="10" fill={`${color}10`} stroke={`${color}50`} strokeWidth="1" />
      <circle cx="34" cy="40" r="4" fill={color} opacity="0.5" />
      {/* Step arrows */}
      <path d="M 20 56 L 26 52 L 32 56 L 38 52 L 44 56" stroke={`${color}60`} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* 6 pins */}
      {["IN1", "IN2", "IN3", "IN4", "VCC", "GND"].map((pin, i) => (
        <g key={pin}>
          <line x1={18 + i * 8} y1="62" x2={18 + i * 8} y2="72" stroke={i < 4 ? color : i === 4 ? "#ef4444" : "#888"} strokeWidth="1.8" />
          <text x={13 + i * 8} y="79" fontSize="4.5" fill="rgba(255,255,255,0.25)" fontFamily="monospace">{pin}</text>
        </g>
      ))}
    </svg>
  );
}

// ─── Buzzer ──────────────────────────────────────────────────────────────────
function BuzzerSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none">
      {/* PCB base */}
      <rect x="18" y="44" width="44" height="10" rx="2" fill="#1a2a1a" stroke="#2d4a2d" strokeWidth="1" />
      {/* Buzzer cylinder */}
      <ellipse cx="40" cy="42" rx="18" ry="5" fill={`${color}40`} stroke={color} strokeWidth="1.5" />
      <rect x="22" y="24" width="36" height="18" rx="3" fill={`${color}20`} stroke={color} strokeWidth="1.5" />
      <ellipse cx="40" cy="24" rx="18" ry="5" fill={`${color}35`} stroke={color} strokeWidth="1.5" />
      {/* Top spiral (sound emitter) */}
      <ellipse cx="40" cy="24" rx="8" ry="2.5" fill={`${color}15`} stroke={`${color}60`} strokeWidth="1" />
      <ellipse cx="40" cy="24" rx="4" ry="1.5" fill={`${color}10`} stroke={`${color}40`} strokeWidth="0.8" />
      {/* + label */}
      <circle cx="28" cy="49" r="2.5" fill={color} opacity="0.6" />
      <text x="25" y="52" fontSize="7" fill={color} fontFamily="monospace">+</text>
      {/* Sound waves */}
      <path d="M 58 20 Q 64 24 58 28" stroke={`${color}50`} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 62 17 Q 70 24 62 31" stroke={`${color}30`} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Legs */}
      <line x1="32" y1="54" x2="32" y2="68" stroke="#aaa" strokeWidth="2" />
      <line x1="48" y1="54" x2="48" y2="68" stroke="#888" strokeWidth="2" />
      <text x="28" y="76" fontSize="6.5" fill="rgba(255,255,255,0.3)" fontFamily="monospace">+ −</text>
    </svg>
  );
}

// ─── Relay ───────────────────────────────────────────────────────────────────
function RelaySVG({ color }: { color: string }) {
  const devices = [
    { name: "FAN", icon: "🌀", x: 52 },
    { name: "PUMP", icon: "💧", x: 52 },
    { name: "LAMP", icon: "💡", x: 52 },
    { name: "HEAT", icon: "🔥", x: 52 },
  ];
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none">
      {/* PCB */}
      <rect x="6" y="12" width="52" height="52" rx="4" fill="#0d1a0d" stroke="#1d3a1d" strokeWidth="1.5" />
      {/* 4 relay blocks */}
      {[16, 26, 36, 46].map((y, i) => (
        <g key={i}>
          <rect x="10" y={y} width="16" height="8" rx="2" fill={`${color}12`} stroke={`${color}50`} strokeWidth="0.8" />
          <circle cx="30" cy={y + 4} r="2" fill={`${color}60`} />
        </g>
      ))}
      {/* LED indicators */}
      {[18, 28, 38, 48].map((y, i) => (
        <circle key={i} cx={44} cy={y + 2} r="2" fill={`${color}30`} stroke={`${color}60`} strokeWidth="0.5" />
      ))}
      {/* Device labels on right side */}
      {devices.map((dev, i) => (
        <g key={i}>
          <rect x="54" y={14 + i * 12} width="20" height="9" rx="2" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />
          <text x="64" y={21 + i * 12} fontSize="4.5" fill="rgba(255,255,255,0.3)" fontFamily="monospace" textAnchor="middle">{dev.name}</text>
        </g>
      ))}
      {/* Connection lines */}
      {[18, 28, 38, 48].map((y, i) => (
        <line key={i} x1="48" y1={y + 2} x2="54" y2={y + 4} stroke="rgba(255,255,255,0.1)" strokeWidth="0.6" />
      ))}
      {/* Control pins */}
      {["VCC", "GND", "IN1", "IN2", "IN3", "IN4"].map((pin, i) => (
        <g key={pin}>
          <line x1={12 + i * 8} y1="64" x2={12 + i * 8} y2="74" stroke={i === 0 ? "#ef4444" : i === 1 ? "#888" : color} strokeWidth="1.5" />
          <text x={8 + i * 8} y="80" fontSize="4" fill="rgba(255,255,255,0.2)" fontFamily="monospace">{pin}</text>
        </g>
      ))}
    </svg>
  );
}

// ─── Potentiometer ──────────────────────────────────────────────────────────
function PotentiometerSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none">
      {/* Body */}
      <rect x="18" y="20" width="44" height="36" rx="4" fill={`${color}12`} stroke={color} strokeWidth="1.5" />
      {/* Resistive track arc */}
      <path
        d="M 30 50 A 14 14 0 1 1 50 50"
        stroke={`${color}40`} strokeWidth="3" fill="none" strokeLinecap="round"
      />
      {/* Knob outer ring */}
      <circle cx="40" cy="38" r="12" fill={`${color}15`} stroke={color} strokeWidth="1.5" />
      <circle cx="40" cy="38" r="7" fill={`${color}25`} stroke={`${color}60`} strokeWidth="1" />
      {/* Indicator line */}
      <line x1="40" y1="30" x2="40" y2="36" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Knob center */}
      <circle cx="40" cy="38" r="2.5" fill={color} opacity="0.7" />
      {/* Shaft */}
      <line x1="40" y1="20" x2="40" y2="12" stroke="#ccc" strokeWidth="4" strokeLinecap="round" />
      <circle cx="40" cy="12" r="3" fill="#bbb" />
      {/* 3 legs */}
      {[24, 40, 56].map((x, i) => (
        <g key={i}>
          <line x1={x} y1="56" x2={x} y2="68" stroke={i === 0 ? "#ef4444" : i === 1 ? "#f59e0b" : "#888"} strokeWidth="2" />
        </g>
      ))}
      <text x="13" y="76" fontSize="5.5" fill="rgba(255,255,255,0.25)" fontFamily="monospace">VCC WIP GND</text>
    </svg>
  );
}

// ─── Button ─────────────────────────────────────────────────────────────────
function ButtonSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none">
      {/* PCB/base */}
      <rect x="20" y="30" width="40" height="30" rx="2" fill="#0a1a0a" stroke="#1d3a1d" strokeWidth="1" />
      {/* Switch body */}
      <rect x="24" y="22" width="32" height="32" rx="3" fill={`${color}12`} stroke={color} strokeWidth="1.5" />
      {/* Button cap */}
      <rect x="28" y="18" width="24" height="24" rx="4" fill={`${color}20`} stroke={color} strokeWidth="1.5" />
      {/* Top cap surface */}
      <rect x="30" y="20" width="20" height="20" rx="3" fill={`${color}15`} />
      {/* Specular */}
      <rect x="31" y="21" width="8" height="4" rx="2" fill="rgba(255,255,255,0.15)" />
      {/* 4 legs in corners */}
      {[[26,54], [54,54], [26,58], [54,58]].map(([x,y], i) => (
        <g key={i}>
          <line x1={x} y1={y} x2={x} y2={y + 12} stroke="#aaa" strokeWidth="2" />
          <circle cx={x} cy={y} r="2" fill={`${color}40`} />
        </g>
      ))}
      <text x="24" y="77" fontSize="5.5" fill="rgba(255,255,255,0.2)" fontFamily="monospace">TACTILE SW</text>
    </svg>
  );
}

// ─── LDR ─────────────────────────────────────────────────────────────────────
function LDRSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none">
      {/* Glow */}
      <circle cx="40" cy="32" r="22" fill={`${color}08`} />
      {/* LDR body (disc) */}
      <circle cx="40" cy="32" r="18" fill={`${color}18`} stroke={color} strokeWidth="1.5" />
      <circle cx="40" cy="32" r="14" fill={`${color}12`} stroke={`${color}50`} strokeWidth="1" />
      {/* Photo-resistive serpentine pattern */}
      <path
        d="M 30 26 L 50 26 L 50 30 L 30 30 L 30 34 L 50 34 L 50 38 L 30 38"
        stroke={`${color}90`} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Light rays */}
      {[0, 45, 90, 135, 225, 270, 315].map((a) => {
        const rad = (a * Math.PI) / 180;
        const x1 = 40 + 20 * Math.cos(rad);
        const y1 = 32 + 20 * Math.sin(rad);
        const x2 = 40 + 27 * Math.cos(rad);
        const y2 = 32 + 27 * Math.sin(rad);
        return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke={`${color}30`} strokeWidth="1" />;
      })}
      {/* Legs */}
      <line x1="34" y1="50" x2="34" y2="66" stroke="#aaa" strokeWidth="2" />
      <line x1="46" y1="50" x2="46" y2="66" stroke="#888" strokeWidth="2" />
      <text x="22" y="74" fontSize="5.5" fill="rgba(255,255,255,0.25)" fontFamily="monospace">LDR GL5528</text>
    </svg>
  );
}

// ─── Ultrasonic HC-SR04 ──────────────────────────────────────────────────────
function UltrasonicSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none">
      {/* PCB board */}
      <rect x="8" y="28" width="64" height="28" rx="4" fill="#0a1a20" stroke="#1a3a4a" strokeWidth="1.5" />
      {/* Left transducer (TRIG) */}
      <rect x="14" y="22" width="18" height="34" rx="9" fill={`${color}15`} stroke={color} strokeWidth="1.5" />
      <ellipse cx="23" cy="22" rx="9" ry="5" fill={`${color}30`} stroke={color} strokeWidth="1.5" />
      <ellipse cx="23" cy="22" rx="5" ry="3" fill={`${color}50`} />
      <text x="17" y="46" fontSize="5.5" fill={`${color}60`} fontFamily="monospace">TRIG</text>
      {/* Right transducer (ECHO) */}
      <rect x="48" y="22" width="18" height="34" rx="9" fill={`${color}15`} stroke={color} strokeWidth="1.5" />
      <ellipse cx="57" cy="22" rx="9" ry="5" fill={`${color}30`} stroke={color} strokeWidth="1.5" />
      <ellipse cx="57" cy="22" rx="5" ry="3" fill={`${color}50`} />
      <text x="51" y="46" fontSize="5.5" fill={`${color}60`} fontFamily="monospace">ECHO</text>
      {/* Ultrasound waves */}
      {[8, 14, 20].map((r) => (
        <path key={r}
          d={`M 40 14 A ${r} ${r} 0 0 1 ${40 + r} ${14 + r}`}
          stroke={`${color}${r === 8 ? "50" : r === 14 ? "30" : "15"}`}
          strokeWidth="1" fill="none" strokeLinecap="round"
        />
      ))}
      {/* 4 pins */}
      {["VCC","TRIG","ECHO","GND"].map((pin, i) => (
        <g key={pin}>
          <line x1={18 + i * 12} y1="56" x2={18 + i * 12} y2="68" stroke={i === 0 ? "#ef4444" : i === 3 ? "#888" : color} strokeWidth="2" />
          <text x={14 + i * 12} y="75" fontSize="4.5" fill="rgba(255,255,255,0.25)" fontFamily="monospace">{pin.slice(0,4)}</text>
        </g>
      ))}
    </svg>
  );
}

// ─── DHT11 (Temp + Humidity) ─────────────────────────────────────────────────
function DHT11SVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none">
      {/* Main body */}
      <rect x="20" y="16" width="40" height="44" rx="5" fill={`${color}15`} stroke={color} strokeWidth="1.5" />
      {/* Top curved section */}
      <rect x="20" y="16" width="40" height="8" rx="5" fill={`${color}30`} />
      <rect x="22" y="16" width="36" height="6" rx="4" fill={`${color}20`} />
      {/* Grid pattern (sensor mesh) */}
      {[24, 28, 32, 36, 40, 44].map((y) => (
        <line key={y} x1="22" y1={y} x2="58" y2={y} stroke={`${color}20`} strokeWidth="0.8" />
      ))}
      {[24, 30, 36, 42, 48, 54].map((x) => (
        <line key={x} x1={x} y1="24" x2={x} y2="54" stroke={`${color}20`} strokeWidth="0.8" />
      ))}
      {/* Label */}
      <text x="28" y="36" fontSize="8" fill={color} fontFamily="monospace" fontWeight="bold">DHT</text>
      <text x="30" y="46" fontSize="8" fill={color} fontFamily="monospace" fontWeight="bold">11</text>
      {/* Legs */}
      {[28, 40, 52].map((x, i) => (
        <g key={i}>
          <line x1={x} y1="60" x2={x} y2="72" stroke={i === 0 ? "#ef4444" : i === 1 ? "#f59e0b" : "#888"} strokeWidth="2" />
        </g>
      ))}
      <text x="17" y="78" fontSize="5" fill="rgba(255,255,255,0.2)" fontFamily="monospace">VCC DATA GND</text>
    </svg>
  );
}

// ─── Turbidity Sensor ────────────────────────────────────────────────────────
function TurbiditySVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none">
      {/* PCB */}
      <rect x="14" y="14" width="52" height="36" rx="4" fill="#0a1220" stroke="#1a2a3a" strokeWidth="1.5" />
      {/* Photodiode */}
      <circle cx="28" cy="32" r="9" fill={`${color}12`} stroke={color} strokeWidth="1.5" />
      <circle cx="28" cy="32" r="5" fill={`${color}25`} />
      <circle cx="28" cy="32" r="2.5" fill={color} opacity="0.6" />
      <text x="21" y="46" fontSize="5" fill={`${color}60`} fontFamily="monospace">EMITTER</text>
      {/* Receiver */}
      <circle cx="52" cy="32" r="9" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      <circle cx="52" cy="32" r="5" fill="rgba(255,255,255,0.08)" />
      <circle cx="52" cy="32" r="2.5" fill="rgba(255,255,255,0.3)" />
      <text x="45" y="46" fontSize="5" fill="rgba(255,255,255,0.3)" fontFamily="monospace">DETECT</text>
      {/* Light beam */}
      <line x1="37" y1="32" x2="43" y2="32" stroke={`${color}50`} strokeWidth="1.5" strokeDasharray="2 2" />
      {/* Water container hint */}
      <rect x="35" y="22" width="10" height="20" rx="2" fill="rgba(6,182,212,0.08)" stroke="rgba(6,182,212,0.20)" strokeWidth="1" />
      {/* Pins */}
      {[22, 34, 46, 58].map((x, i) => (
        <line key={i} x1={x} y1="50" x2={x} y2="62" stroke={i === 0 ? "#ef4444" : i === 3 ? "#888" : color} strokeWidth="2" />
      ))}
      <text x="10" y="70" fontSize="5" fill="rgba(255,255,255,0.2)" fontFamily="monospace">VCC GND A0 D0</text>
    </svg>
  );
}

// ─── Water Level Sensor ──────────────────────────────────────────────────────
function WaterLevelSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none">
      {/* PCB base */}
      <rect x="24" y="10" width="32" height="12" rx="3" fill="#0a1a20" stroke="#1a2a3a" strokeWidth="1.5" />
      {/* Sensor strip / comb electrode */}
      <rect x="30" y="22" width="20" height="48" rx="2" fill={`${color}08`} stroke={`${color}40`} strokeWidth="1" />
      {/* Comb traces (interdigitated) */}
      {[0, 4, 8, 12, 16, 20, 24, 28, 32, 36].map((y) => (
        <g key={y}>
          <line x1="32" y1={24 + y} x2={y % 8 === 0 ? "40" : "48"} y2={24 + y} stroke={`${color}60`} strokeWidth="1.2" />
        </g>
      ))}
      {/* Water level fill simulation */}
      <rect x="32" y="44" width="16" height="24" rx="1"
        fill="rgba(6,182,212,0.15)" stroke="rgba(6,182,212,0.25)" strokeWidth="0.8" />
      {/* Waterline */}
      <line x1="30" y1="44" x2="50" y2="44" stroke="rgba(6,182,212,0.50)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Component label */}
      <text x="28" y="18" fontSize="6" fill={color} fontFamily="monospace">WL SENS</text>
      {/* Pins */}
      <line x1="34" y1="10" x2="34" y2="4" stroke="#ef4444" strokeWidth="2" />
      <line x1="40" y1="10" x2="40" y2="4" stroke="#f59e0b" strokeWidth="2" />
      <line x1="46" y1="10" x2="46" y2="4" stroke="#888" strokeWidth="2" />
      <text x="28" y="3" fontSize="5" fill="rgba(255,255,255,0.2)" fontFamily="monospace">+ S −</text>
    </svg>
  );
}

// ─── Rain Sensor ─────────────────────────────────────────────────────────────
function RainSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none">
      {/* PCB */}
      <rect x="10" y="20" width="60" height="40" rx="4" fill="#0d1a10" stroke="#1a3a20" strokeWidth="1.5" />
      {/* Rain detection traces */}
      {[16, 24, 32, 40, 48].map((x) => (
        <line key={x} x1={x} y1="24" x2={x} y2="56" stroke={`${color}50`} strokeWidth="1.5" />
      ))}
      {/* Interdigitated fingers */}
      {[28, 36, 44, 52].map((x) => (
        <line key={x} x1={x} y1="24" x2={x} y2="56" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" />
      ))}
      {/* Horizontal connectors */}
      <line x1="16" y1="24" x2="48" y2="24" stroke={`${color}40`} strokeWidth="1" />
      <line x1="24" y1="56" x2="56" y2="56" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      {/* Raindrops */}
      {[[25, 14], [40, 10], [55, 13]].map(([x, y], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx="2.5" ry="3.5" fill={`${color}70`} />
        </g>
      ))}
      {/* Pins */}
      {[18, 28, 40, 52, 62].map((x, i) => (
        <line key={i} x1={x} y1="60" x2={x} y2="72" stroke={i === 0 ? "#ef4444" : i === 4 ? "#888" : i === 3 ? "#22c55e" : color} strokeWidth="2" />
      ))}
      <text x="6" y="78" fontSize="4.5" fill="rgba(255,255,255,0.2)" fontFamily="monospace">VCC GND A0 D0</text>
    </svg>
  );
}

// ─── Soil Moisture ───────────────────────────────────────────────────────────
function SoilSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none">
      {/* PCB top control board */}
      <rect x="16" y="8" width="48" height="22" rx="3" fill="#0a1a0a" stroke="#1a3a1a" strokeWidth="1.5" />
      <text x="22" y="21" fontSize="6.5" fill={color} fontFamily="monospace">SOIL HUM</text>
      {/* Fork probes */}
      <rect x="26" y="30" width="6" height="40" rx="3" fill={`${color}20`} stroke={color} strokeWidth="1.5" />
      <rect x="48" y="30" width="6" height="40" rx="3" fill={`${color}20`} stroke={color} strokeWidth="1.5" />
      {/* Probe tips (sharpened) */}
      <path d="M 26 70 L 29 76 L 32 70" fill={color} />
      <path d="M 48 70 L 51 76 L 54 70" fill={color} />
      {/* Wire connections */}
      <line x1="29" y1="30" x2="29" y2="30" stroke={color} strokeWidth="2" />
      <path d="M 29 30 Q 29 26 32 26 L 48 26 Q 51 26 51 30" stroke={`${color}60`} strokeWidth="1.5" fill="none" />
      {/* Soil indication */}
      <rect x="18" y="58" width="44" height="10" rx="2" fill="rgba(139,90,43,0.20)" stroke="rgba(139,90,43,0.30)" strokeWidth="1" />
      {/* Pins */}
      {[24, 34, 44, 54].map((x, i) => (
        <line key={i} x1={x} y1="8" x2={x} y2="2" stroke={i === 0 ? "#ef4444" : i === 1 ? "#f59e0b" : i === 2 ? "#888" : "#22c55e"} strokeWidth="2" />
      ))}
      <text x="12" y="1" fontSize="4.5" fill="rgba(255,255,255,0.2)" fontFamily="monospace">VCC A0 GND D0</text>
    </svg>
  );
}

// ─── Default (fallback) ──────────────────────────────────────────────────────
function DefaultSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none">
      <rect x="16" y="20" width="48" height="40" rx="6" fill={`${color}15`} stroke={color} strokeWidth="1.5" />
      <circle cx="40" cy="40" r="10" fill={`${color}25`} stroke={color} strokeWidth="1" />
      <text x="34" y="44" fontSize="12" fill={color}>?</text>
    </svg>
  );
}

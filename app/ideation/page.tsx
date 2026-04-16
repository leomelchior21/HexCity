"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

type ProblemDomain = {
  id: string;
  label: string;
  color: string;
  problems: string[];
};

type ProblemPick = {
  domain: ProblemDomain;
  text: string;
};

type GroupBrief = {
  problem: ProblemPick | null;
  sensor: string | null;
  actuators: string[] | null;
};

type VersionState = {
  problem: number;
  sensor: number;
  actuator: number;
};

const GROUP_OPTIONS = [3, 4] as const;
const ACTUATOR_COUNT_OPTIONS = [1, 2, 3] as const;
const DEFAULT_GROUP_COUNT = 4;
const DEFAULT_ACTUATOR_COUNT = 2;

const GROUP_COLORS = [
  "#A78BFA",
  "#06B6D4",
  "#22C55E",
  "#F59E0B",
];

const PROBLEM_DOMAINS: ProblemDomain[] = [
  {
    id: "energy",
    label: "Energy",
    color: "#F59E0B",
    problems: [
      "Energy waste in public buildings after school hours",
      "Street lighting stays bright in low-traffic zones",
      "Solar panels lose efficiency without maintenance data",
      "Peak-hour power overload in dense neighborhoods",
      "EV chargers are hard to monitor or prioritize",
      "Classrooms waste light and cooling when empty",
    ],
  },
  {
    id: "water",
    label: "Water",
    color: "#06B6D4",
    problems: [
      "Water level in public tanks is not monitored",
      "Leaks go unnoticed in underground pipelines",
      "Rainwater is not collected during heavy storms",
      "Turbid reservoir water is detected too late",
      "Park irrigation wastes water after rain",
      "Flood risk rises in low-lying streets",
    ],
  },
  {
    id: "air",
    label: "Air",
    color: "#7DD3FC",
    problems: [
      "Traffic corridors create air pollution hotspots",
      "Bus stops expose people to heat and exhaust",
      "Indoor rooms become uncomfortable without ventilation",
      "Noise and air pollution overlap near avenues",
      "Industrial areas lack simple local warning systems",
      "People cannot see air quality changes in real time",
    ],
  },
  {
    id: "mobility",
    label: "Mobility",
    color: "#F97316",
    problems: [
      "Traffic builds up around school entry and exit times",
      "Pedestrian crossings are unsafe at busy intersections",
      "Bike lanes are underused because routes feel unsafe",
      "Emergency vehicles lose time in congested streets",
      "Parking availability is invisible until drivers arrive",
      "Transit hubs have weak first and last-mile connections",
    ],
  },
  {
    id: "waste",
    label: "Waste",
    color: "#EF4444",
    problems: [
      "Public bins overflow before collection",
      "Recycling mistakes happen because feedback is missing",
      "Food waste from markets is not sorted early",
      "E-waste collection points are hard to locate",
      "Organic waste is not routed to composting",
      "Hazardous waste needs clearer alerts and isolation",
    ],
  },
  {
    id: "green",
    label: "Green",
    color: "#22C55E",
    problems: [
      "Park soil dries out before anyone notices",
      "Tree cover is uneven across neighborhoods",
      "Green corridors are missing between public spaces",
      "Heat islands grow where vegetation is scarce",
      "Community gardens lack simple irrigation feedback",
      "Biodiversity areas are not protected from foot traffic",
    ],
  },
];

const SENSORS = [
  "Push Button",
  "Potentiometer",
  "LDR Light Sensor",
  "Ultrasonic HC-SR04",
  "DHT11 Temperature",
  "DHT11 Humidity",
  "Water Turbidity Sensor",
  "Water Level Sensor",
  "Rain Sensor",
  "Soil Humidity Sensor",
];

const ACTUATORS = [
  "LED",
  "RGB LED",
  "Servo Motor 180",
  "Servo Motor 360",
  "Buzzer",
  "Relay",
];

function createEmptyBriefs(count: number): GroupBrief[] {
  return Array.from({ length: count }, () => ({
    problem: null,
    sensor: null,
    actuators: null,
  }));
}

function shuffle<T>(items: readonly T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickProblems(count: number): ProblemPick[] {
  const allProblems = PROBLEM_DOMAINS.flatMap((domain) =>
    domain.problems.map((text) => ({ domain, text }))
  );

  return shuffle(allProblems).slice(0, count);
}

function pickSensors(count: number) {
  return shuffle(SENSORS).slice(0, count);
}

function createActuatorSets(count: number, actuatorCount: number) {
  const sets: string[][] = [];

  const collect = (start: number, current: string[]) => {
    if (current.length === actuatorCount) {
      sets.push(current);
      return;
    }

    for (let i = start; i < ACTUATORS.length; i += 1) {
      collect(i + 1, [...current, ACTUATORS[i]]);
    }
  };

  collect(0, []);

  return shuffle(sets).slice(0, count);
}

function resizeBriefs(current: GroupBrief[], count: number) {
  if (current.length === count) return current;
  if (current.length > count) return current.slice(0, count);

  return [
    ...current,
    ...createEmptyBriefs(count - current.length),
  ];
}

function updateIndexedBriefs<T>(
  current: GroupBrief[],
  picks: T[],
  key: keyof GroupBrief
) {
  return current.map((brief, index) => ({
    ...brief,
    [key]: picks[index],
  }));
}

function formatOptionLabel(value: number, noun: string) {
  if (value === 1) return `1 ${noun}`;
  return `${value} ${noun}s`;
}

function buttonStyle(isActive: boolean, color: string) {
  if (isActive) {
    return {
      background: `${color}20`,
      borderColor: `${color}55`,
      color,
      boxShadow: `0 0 22px ${color}18, 0 1px 0 rgba(255,255,255,0.10) inset`,
    };
  }

  return {
    background: "rgba(255,255,255,0.035)",
    borderColor: "rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.42)",
    boxShadow: "0 1px 0 rgba(255,255,255,0.05) inset",
  };
}

function nextVersion(current: VersionState, keys: Array<keyof VersionState>) {
  return keys.reduce(
    (acc, key) => ({
      ...acc,
      [key]: acc[key] + 1,
    }),
    current
  );
}

export default function IdeationPage() {
  const [groupCount, setGroupCount] = useState(DEFAULT_GROUP_COUNT);
  const [actuatorCount, setActuatorCount] = useState(DEFAULT_ACTUATOR_COUNT);
  const [briefs, setBriefs] = useState<GroupBrief[]>(() => createEmptyBriefs(DEFAULT_GROUP_COUNT));
  const [version, setVersion] = useState<VersionState>({
    problem: 0,
    sensor: 0,
    actuator: 0,
  });

  const selectGroupCount = (count: number) => {
    setGroupCount(count);
    setBriefs((current) => resizeBriefs(current, count));
  };

  const selectActuatorCount = (count: number) => {
    setActuatorCount(count);
    setBriefs((current) =>
      current.map((brief) => ({
        ...brief,
        actuators: brief.actuators ? null : brief.actuators,
      }))
    );
    setVersion((current) => nextVersion(current, ["actuator"]));
  };

  const randomizeProblems = () => {
    const problems = pickProblems(groupCount);
    setBriefs((current) => updateIndexedBriefs(current, problems, "problem"));
    setVersion((current) => nextVersion(current, ["problem"]));
  };

  const randomizeSensors = () => {
    const sensors = pickSensors(groupCount);
    setBriefs((current) => updateIndexedBriefs(current, sensors, "sensor"));
    setVersion((current) => nextVersion(current, ["sensor"]));
  };

  const randomizeActuators = () => {
    const actuatorSets = createActuatorSets(groupCount, actuatorCount);
    setBriefs((current) => updateIndexedBriefs(current, actuatorSets, "actuators"));
    setVersion((current) => nextVersion(current, ["actuator"]));
  };

  const randomizeAll = () => {
    const problems = pickProblems(groupCount);
    const sensors = pickSensors(groupCount);
    const actuatorSets = createActuatorSets(groupCount, actuatorCount);

    setBriefs((current) =>
      current.map((brief, index) => ({
        ...brief,
        problem: problems[index],
        sensor: sensors[index],
        actuators: actuatorSets[index],
      }))
    );
    setVersion((current) => nextVersion(current, ["problem", "sensor", "actuator"]));
  };

  const clearAll = () => {
    setBriefs(createEmptyBriefs(groupCount));
    setVersion((current) => nextVersion(current, ["problem", "sensor", "actuator"]));
  };

  return (
    <main className="h-screen overflow-hidden bg-black text-white flex flex-col">
      <Navbar />

      <section className="relative h-full overflow-hidden pt-20 pb-4 px-4 md:px-8">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.86) 0%, #000 100%), linear-gradient(90deg, rgba(124,58,237,0.08), rgba(6,182,212,0.05), rgba(34,197,94,0.05))",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        <div className="max-w-5xl mx-auto relative h-full flex flex-col">
          <div
            className="relative z-30 mb-3 rounded-lg p-2"
            style={{
              background: "rgba(0,0,0,0.72)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              boxShadow: "0 12px 36px rgba(0,0,0,0.45)",
            }}
          >
            <div className="flex flex-col gap-2">
              <div className="grid lg:grid-cols-[1fr_1.45fr] gap-2">
                <OptionGroup label="Groups">
                  {GROUP_OPTIONS.map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => selectGroupCount(count)}
                      className="rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200"
                      style={buttonStyle(groupCount === count, "#A78BFA")}
                    >
                      {formatOptionLabel(count, "group")}
                    </button>
                  ))}
                </OptionGroup>

                <OptionGroup label="Actuators per group">
                  {ACTUATOR_COUNT_OPTIONS.map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => selectActuatorCount(count)}
                      className="rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200"
                      style={buttonStyle(actuatorCount === count, "#22C55E")}
                    >
                      {formatOptionLabel(count, "actuator")}
                    </button>
                  ))}
                </OptionGroup>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <ControlButton tone="primary" onClick={randomizeAll}>
                  Generate All
                </ControlButton>
                <ControlButton tone="problem" onClick={randomizeProblems}>
                  New Problems
                </ControlButton>
                <ControlButton tone="sensor" onClick={randomizeSensors}>
                  New Sensors
                </ControlButton>
                <ControlButton tone="actuator" onClick={randomizeActuators}>
                  New Actuators
                </ControlButton>
                <ControlButton tone="danger" onClick={clearAll}>
                  Clear
                </ControlButton>
              </div>
            </div>
          </div>

          <div
            className="grid gap-3 flex-1 min-h-0"
            style={{
              gridTemplateColumns: `repeat(${groupCount}, minmax(0, 1fr))`,
              gridTemplateRows: "minmax(0, 1fr)",
            }}
          >
            {briefs.map((brief, index) => (
              <GroupCard
                key={index}
                brief={brief}
                groupNumber={index + 1}
                accent={GROUP_COLORS[index % GROUP_COLORS.length]}
                version={version}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function OptionGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-lg p-2"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <p className="text-[10px] text-white/25 font-mono uppercase mb-2 px-1">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function ControlButton({
  children,
  tone,
  onClick,
}: {
  children: React.ReactNode;
  tone: "primary" | "problem" | "sensor" | "actuator" | "danger";
  onClick: () => void;
}) {
  const toneStyles = {
    primary: {
      background: "rgba(124,58,237,0.28)",
      borderColor: "rgba(167,139,250,0.40)",
      color: "#EDE9FE",
    },
    problem: {
      background: "rgba(239,68,68,0.16)",
      borderColor: "rgba(239,68,68,0.28)",
      color: "#FCA5A5",
    },
    sensor: {
      background: "rgba(6,182,212,0.16)",
      borderColor: "rgba(6,182,212,0.30)",
      color: "#67E8F9",
    },
    actuator: {
      background: "rgba(34,197,94,0.14)",
      borderColor: "rgba(34,197,94,0.28)",
      color: "#86EFAC",
    },
    danger: {
      background: "rgba(255,255,255,0.045)",
      borderColor: "rgba(255,255,255,0.09)",
      color: "rgba(255,255,255,0.58)",
    },
  }[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg px-3 py-2.5 text-xs md:text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
      style={{
        ...toneStyles,
        borderWidth: 1,
        borderStyle: "solid",
        boxShadow: "0 1px 0 rgba(255,255,255,0.08) inset, 0 8px 18px rgba(0,0,0,0.25)",
      }}
    >
      {children}
    </button>
  );
}

function GroupCard({
  brief,
  groupNumber,
  accent,
  version,
}: {
  brief: GroupBrief;
  groupNumber: number;
  accent: string;
  version: VersionState;
}) {
  const domainColor = brief.problem?.domain.color ?? accent;

  return (
    <article
      className="relative overflow-hidden rounded-lg p-3 transition-all duration-300 hover:-translate-y-1 h-full min-h-0 flex flex-col"
      style={{
        background: `linear-gradient(135deg, ${accent}12 0%, rgba(8,8,10,0.88) 46%, rgba(0,0,0,0.96) 100%)`,
        border: `1px solid ${accent}28`,
        boxShadow: "0 14px 42px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="absolute left-0 right-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}90, transparent)`,
        }}
      />

      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="text-[10px] text-white/25 font-mono uppercase mb-1">
            Brief {String(groupNumber).padStart(2, "0")}
          </p>
          <h2 className="font-display text-lg md:text-xl font-bold" style={{ color: accent }}>
            Group {groupNumber}
          </h2>
        </div>
        <HexBadge color={domainColor} />
      </div>

      <div className="grid grid-rows-[1.05fr_0.95fr] gap-2 flex-1 min-h-0">
        <BriefField label="Problem" color={domainColor}>
          <div key={`problem-${version.problem}-${groupNumber}`} className="fade-in-up">
            {brief.problem ? (
              <>
                <p
                  className="text-[11px] font-mono uppercase mb-2"
                  style={{ color: brief.problem.domain.color }}
                >
                  {brief.problem.domain.label}
                </p>
                <p className="text-white/72 text-sm md:text-base leading-snug">{brief.problem.text}</p>
              </>
            ) : (
              <p className="text-white/25 text-sm md:text-base leading-snug">
                Generate a city problem.
              </p>
            )}
          </div>
        </BriefField>

        <div className="grid grid-cols-1 gap-2 min-h-0">
          <BriefField label="Sensor" color="#06B6D4">
            <p
              key={`sensor-${version.sensor}-${groupNumber}`}
              className="fade-in-up text-cyan-200 text-sm md:text-base font-semibold leading-snug"
            >
              {brief.sensor ?? "Select input"}
            </p>
          </BriefField>

          <BriefField label="Actuators" color="#22C55E">
            <div key={`actuator-${version.actuator}-${groupNumber}`} className="fade-in-up">
              {brief.actuators ? (
                <div className="space-y-1">
                  {brief.actuators.map((actuator, index) => (
                    <div key={actuator}>
                      {index > 0 && (
                        <p className="text-white/25 text-[9px] font-mono uppercase mb-0.5">plus</p>
                      )}
                      <p className="text-green-200 text-sm md:text-base font-semibold leading-snug">
                        {actuator}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/25 text-sm md:text-base leading-snug">Select outputs</p>
              )}
            </div>
          </BriefField>
        </div>
      </div>
    </article>
  );
}

function BriefField({
  label,
  color,
  children,
}: {
  label: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="border-t pt-2 min-h-0 overflow-hidden"
      style={{
        borderColor: "rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="h-2 w-2 rounded-full"
          style={{
            background: color,
            boxShadow: `0 0 14px ${color}80`,
          }}
        />
        <p className="text-[11px] font-mono uppercase text-white/35">{label}</p>
      </div>
      {children}
    </section>
  );
}

function HexBadge({ color }: { color: string }) {
  const points = Array.from({ length: 6 }, (_, index) => {
    const angle = (Math.PI / 3) * index - Math.PI / 6;
    return `${28 + 23 * Math.cos(angle)},${28 + 23 * Math.sin(angle)}`;
  }).join(" ");

  return (
    <svg width="38" height="38" viewBox="0 0 56 56" aria-hidden="true" className="flex-shrink-0">
      <polygon
        points={points}
        fill={`${color}18`}
        stroke={color}
        strokeWidth="1.5"
      />
      <circle cx="28" cy="28" r="3" fill={color} />
    </svg>
  );
}

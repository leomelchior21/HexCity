"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";

type FocusId = "energy" | "water" | "air" | "mobility" | "waste" | "green";
type SensorKind = "temperature" | "rain" | "soil" | "water" | "turbidity" | "ir" | "co2" | "ph" | "environment" | "tag";
type ActuatorKind = "mist" | "servo" | "led" | "buzzer" | "relay" | "fan" | "conveyor" | "filter" | "irrigation" | "storage";

type Project = {
  id: string;
  title: string;
  subtitle: string;
  quick: string;
  description: string;
  students: string[];
  focus: FocusId;
  sensor: string;
  actuator: string;
  sensorKind: SensorKind;
  actuatorKind: ActuatorKind;
};

const FOCUS_META: Record<FocusId, { label: string; color: string; quiet: string }> = {
  energy: { label: "Energy", color: "#F59E0B", quiet: "rgba(245,158,11,0.12)" },
  water: { label: "Water", color: "#06B6D4", quiet: "rgba(6,182,212,0.12)" },
  air: { label: "Air", color: "#7DD3FC", quiet: "rgba(125,211,252,0.12)" },
  mobility: { label: "Mobility", color: "#F97316", quiet: "rgba(249,115,22,0.12)" },
  waste: { label: "Waste", color: "#EF4444", quiet: "rgba(239,68,68,0.12)" },
  green: { label: "Green", color: "#22C55E", quiet: "rgba(34,197,94,0.12)" },
};

const PROJECTS: Project[] = [
  {
    id: "ecomist",
    title: "EcoMist",
    subtitle: "Heat-responsive public cooling",
    quick: "Cooler public spaces that activate mist only when temperatures are too high.",
    description:
      "Our solution creates cooler and more comfortable public spaces on hot days. Temperature sensors detect excessive heat and automatically activate misting towers only when cooling is needed.",
    students: ["Bernardo M. Magalhaes", "Julia O. A. Castro", "Lorena H. Coffone", "Lorenzo G. Viccari"],
    focus: "green",
    sensor: "Temperature sensor",
    actuator: "Misting towers",
    sensorKind: "temperature",
    actuatorKind: "mist",
  },
  {
    id: "greenfresh-rainwater",
    title: "GreenFresh",
    subtitle: "Rainwater quality station",
    quick: "A building captures rainwater and checks if it is safe to reuse.",
    description:
      "Our solution turns rainwater into a local source of clean, reusable water. The building collects rainwater, while a pH sensor monitors its quality before it can be safely reused.",
    students: ["Ana Teresa F. R. Zimmermann", "Henrique B. Marsaioli", "Mariana O. Varella", "Rafael Martin S. Andrade"],
    focus: "water",
    sensor: "pH sensor",
    actuator: "Reuse and filtration system",
    sensorKind: "ph",
    actuatorKind: "filter",
  },
  {
    id: "greenpulse",
    title: "GreenPulse",
    subtitle: "Smart irrigation for urban plants",
    quick: "Soil moisture controls misting so plants get water only when needed.",
    description:
      "Our solution helps cities keep green areas healthy while using less water. A soil moisture sensor detects dry soil and activates misting only when plants need irrigation.",
    students: ["Ayman A.", "Isabela M. Logiodice", "Joao Pedro D.", "Laura B. Mendonca", "Manuela P. L. L. Moraes"],
    focus: "green",
    sensor: "Soil moisture sensor",
    actuator: "Misting irrigation",
    sensorKind: "soil",
    actuatorKind: "irrigation",
  },
  {
    id: "rainspire",
    title: "Rainspire",
    subtitle: "Public plaza water harvesting",
    quick: "A plaza collects rainwater and sends it underground for reuse.",
    description:
      "Our solution transforms public plazas into smart rainwater collection spaces. A rain sensor activates the system, directing collected water to an underground area for filtration and reuse.",
    students: ["Ana Beatriz L. Zancaner", "Antonio Augusto S. Biagi", "Beatriz U. Santos", "Maria Luiza N. F. Gomes"],
    focus: "water",
    sensor: "Rain sensor",
    actuator: "Collection diverter",
    sensorKind: "rain",
    actuatorKind: "storage",
  },
  {
    id: "crystalclear",
    title: "CrystalClear",
    subtitle: "Air and waste filtration control",
    quick: "Sensors trigger filtration equipment to improve air and waste conditions.",
    description:
      "Our solution combines cleaner air and smarter waste management in one urban system. Sensors monitor conditions, while a relay controls ventilation and filtration equipment.",
    students: ["Felipe S. Ceneviva", "Gabriel Kenzo S. Szego", "Pedro B. Murata", "Raphael B. Salerno"],
    focus: "air",
    sensor: "Environmental sensors",
    actuator: "Relay-controlled ventilation and filtration",
    sensorKind: "environment",
    actuatorKind: "relay",
  },
  {
    id: "coolingtower",
    title: "CoolingTower",
    subtitle: "Automatic public-space cooling",
    quick: "A temperature sensor turns on a misting tower when heat rises.",
    description:
      "Our solution brings automatic cooling to hot urban public spaces. A temperature sensor detects rising temperatures and activates a misting tower when cooling is needed.",
    students: ["Ana Luiza N. Mascarenhas", "Catarina S. Moreira"],
    focus: "air",
    sensor: "Temperature sensor",
    actuator: "Misting tower",
    sensorKind: "temperature",
    actuatorKind: "mist",
  },
  {
    id: "aquasense",
    title: "AquaSense",
    subtitle: "Real-time lake safety warning",
    quick: "Water turbidity alerts citizens when public lake conditions may be unsafe.",
    description:
      "Our solution makes public lakes safer by providing citizens with real-time water quality warnings. A water turbidity sensor monitors water quality, while an RGB LED and buzzer alert users when conditions may be unsafe.",
    students: ["Felipe D. Jardim", "Giulia B. Pinto", "Julieta B. P. O. Ribeiro", "Sara R. S. Lima"],
    focus: "water",
    sensor: "Water turbidity sensor",
    actuator: "RGB LED and buzzer",
    sensorKind: "turbidity",
    actuatorKind: "buzzer",
  },
  {
    id: "aircleaner",
    title: "AirCleaner",
    subtitle: "Responsive outdoor filtration",
    quick: "Environmental readings activate a filtration fan only when air needs cleaning.",
    description:
      "Our solution helps cities create cleaner and healthier outdoor environments. Sensors monitor environmental conditions and automatically activate a filtration fan when air purification is needed.",
    students: ["Catherine A. Kassis", "Henrique J. F. Silva", "Luca J. Bertocco", "Maria Luiza B. Machado", "Rafaela A. Giacchetta"],
    focus: "air",
    sensor: "Environmental sensors",
    actuator: "Filtration fan",
    sensorKind: "environment",
    actuatorKind: "fan",
  },
  {
    id: "ecohub",
    title: "EcoHub",
    subtitle: "Cooler transit waiting areas",
    quick: "Bus stops respond to excessive heat with automatic misting.",
    description:
      "Our solution makes waiting for public transportation more comfortable on hot days. A temperature sensor detects excessive heat and activates a misting system to cool the bus stop.",
    students: ["Ana Beatriz S. Werneck", "Joao Pinheiro E. Mandur", "Marcelo M. Valente", "Omar F. Abissamra"],
    focus: "mobility",
    sensor: "Temperature sensor",
    actuator: "Misting system",
    sensorKind: "temperature",
    actuatorKind: "mist",
  },
  {
    id: "dryzone",
    title: "DryZone",
    subtitle: "Safer rainwater tank access",
    quick: "Water level data controls an iris door for storage maintenance.",
    description:
      "Our solution makes rainwater storage systems easier and safer to maintain. A water-level sensor monitors the tank, while a servo motor controls an iris-shaped maintenance door.",
    students: ["Joaquim L. Cardoso", "Nicolas L.", "Ricardo M. Nogueira", "Theo B. G. Pires"],
    focus: "water",
    sensor: "Water-level sensor",
    actuator: "Servo motor iris door",
    sensorKind: "water",
    actuatorKind: "servo",
  },
  {
    id: "aquair",
    title: "Aquair",
    subtitle: "Water reuse and air cleaning",
    quick: "A combined filtration system improves water and air quality.",
    description:
      "Our solution combines water reuse and cleaner air in one sustainable urban system. Sensors monitor environmental conditions while filtration systems help improve both water and air quality.",
    students: ["Laura M. Martins", "Paola S. Pinotti"],
    focus: "water",
    sensor: "Environmental sensors",
    actuator: "Water and air filtration systems",
    sensorKind: "environment",
    actuatorKind: "filter",
  },
  {
    id: "cicl3",
    title: "CICL3",
    subtitle: "Motorized waste sorting",
    quick: "An IR sensor starts a conveyor to move waste through sorting.",
    description:
      "Our solution makes urban waste sorting faster and more efficient. An IR sensor detects incoming waste and activates a motorized conveyor that moves materials through the sorting system.",
    students: ["Manuela A.", "Roberta B. Lepiani", "Manuela T."],
    focus: "waste",
    sensor: "IR sensor",
    actuator: "Motorized conveyor",
    sensorKind: "ir",
    actuatorKind: "conveyor",
  },
  {
    id: "skyflow",
    title: "SkyFlow",
    subtitle: "Buildings that redirect airflow",
    quick: "Servo motors rotate structures to guide air through dense streets.",
    description:
      "Our solution turns buildings into active tools for improving airflow in dense cities. Sensors monitor conditions, while servo motors rotate parts of the structures to redirect air through the streets.",
    students: ["Fernanda U. Santos", "Joao Pedro G. Jereissati", "Maria S. Carneiro", "Stela A. Nahas"],
    focus: "air",
    sensor: "Environmental sensors",
    actuator: "Servo motors",
    sensorKind: "environment",
    actuatorKind: "servo",
  },
  {
    id: "humoil",
    title: "Humoil",
    subtitle: "Organic waste to greener spaces",
    quick: "Compost supports plant life while soil moisture controls irrigation.",
    description:
      "Our solution turns organic waste into a resource for greener public spaces. Compost and biomass support the landscape, while a soil moisture sensor activates irrigation when plants need water.",
    students: ["Rafael B. Mestieri", "Tomas V. C. Branco", "Vitor Eduardo B. Garofallo"],
    focus: "waste",
    sensor: "Soil moisture sensor",
    actuator: "Irrigation system",
    sensorKind: "soil",
    actuatorKind: "irrigation",
  },
  {
    id: "waterguard",
    title: "WaterGuard",
    subtitle: "Rain-activated collection",
    quick: "A rain sensor opens the water collection system automatically.",
    description:
      "Our solution captures rainwater automatically instead of letting it go to waste. A rain sensor detects rainfall and activates a servo motor that opens the collection system.",
    students: ["Guilherme C. N. Minders", "Henrique A. Movizzo", "Henrique J. F. Silva", "Matheus G. Carnevalli"],
    focus: "water",
    sensor: "Rain sensor",
    actuator: "Servo motor collection gate",
    sensorKind: "rain",
    actuatorKind: "servo",
  },
  {
    id: "gloway",
    title: "Gloway",
    subtitle: "Presence-based street lighting",
    quick: "Streetlights turn on only when nearby people are detected.",
    description:
      "Our solution reduces energy waste by lighting streets only when needed. An IR sensor detects nearby people and automatically turns the streetlights on.",
    students: ["Bernardo David Z.", "Eleonora P. Tchalian", "Lorenzo M. Prado", "Matheus P. Maiorano"],
    focus: "energy",
    sensor: "IR sensor",
    actuator: "Streetlight LEDs",
    sensorKind: "ir",
    actuatorKind: "led",
  },
  {
    id: "greenery",
    title: "Greenery",
    subtitle: "Heat-aware green spaces",
    quick: "Urban green areas activate misting during extreme heat.",
    description:
      "Our solution helps urban green spaces stay cooler during periods of extreme heat. A temperature sensor monitors the area and activates misting when temperatures become too high.",
    students: ["Gabriela A. Metzger", "Samira M.", "Vicky Z. Q. Xie"],
    focus: "green",
    sensor: "Temperature sensor",
    actuator: "Misting system",
    sensorKind: "temperature",
    actuatorKind: "mist",
  },
  {
    id: "filterain",
    title: "FilteRain",
    subtitle: "Building-scale rainwater reuse",
    quick: "Rain opens a collection system for automatic capture and reuse.",
    description:
      "Our solution gives buildings a simple way to capture and reuse rainwater automatically. A rain sensor detects rainfall and activates a servo motor that opens the collection system.",
    students: ["Bruno V. Alves", "Francisco T. Arantes", "Luis Felipe B. B. Toscano"],
    focus: "water",
    sensor: "Rain sensor",
    actuator: "Servo motor collection system",
    sensorKind: "rain",
    actuatorKind: "servo",
  },
  {
    id: "greenfresh-tree",
    title: "GreenFresh",
    subtitle: "Artificial tree environmental station",
    quick: "An artificial tree monitors local conditions and supports nearby greenery.",
    description:
      "Our solution transforms an artificial tree into a smart environmental station for public spaces. Sensors monitor local conditions, while automated systems help manage and support the surrounding green area.",
    students: ["Eduardo M. V. Viegas", "Gabriela C. Marques", "Julia G. Jereissati", "Julia S. Leite", "Rodrigo M."],
    focus: "green",
    sensor: "Environmental sensors",
    actuator: "Automated green-area support systems",
    sensorKind: "environment",
    actuatorKind: "irrigation",
  },
  {
    id: "cyanoclean",
    title: "CyanoClean",
    subtitle: "Organic air filtration",
    quick: "Sensors open an organic filtration system only when purification is needed.",
    description:
      "Our solution creates an air filter that responds only when environmental conditions require it, while also using a mixed cyanobacteria-based organic filtration system. Sensors trigger a servo motor that opens the organic filtration system when air purification is needed.",
    students: ["Fabio D. S. N. Mattos", "Giancarlo P. Blumetti", "Leonardo P. G. Pinto"],
    focus: "air",
    sensor: "Environmental sensors",
    actuator: "Servo motor organic filtration door",
    sensorKind: "environment",
    actuatorKind: "servo",
  },
  {
    id: "coolpass",
    title: "CoolPass",
    subtitle: "Public pool comfort indicator",
    quick: "Water temperature is translated into a clear RGB LED status.",
    description:
      "Our solution gives public pools an easy way to monitor water conditions in real time. A temperature sensor monitors the water, while an RGB LED clearly indicates whether the temperature is comfortable.",
    students: ["Aline J. Sako", "Marcella F. Domingues", "Sophia V. Andrade"],
    focus: "water",
    sensor: "Temperature sensor",
    actuator: "RGB LED",
    sensorKind: "temperature",
    actuatorKind: "led",
  },
  {
    id: "starlake",
    title: "StarLake",
    subtitle: "Floodwater as park resource",
    quick: "Floodwater is stored and monitored so it can be reused later.",
    description:
      "Our solution transforms floodwater from a problem into a useful urban resource. A water-level sensor monitors the collected water so it can be reused later in the surrounding park.",
    students: ["Gabriela U. Santos", "Joao K. Schlochauer", "Paola P. Larocca"],
    focus: "water",
    sensor: "Water-level sensor",
    actuator: "Reuse storage system",
    sensorKind: "water",
    actuatorKind: "storage",
  },
  {
    id: "freshflow",
    title: "FreshFlow",
    subtitle: "CO2-triggered public filtration",
    quick: "A plaza opens filtration structures when CO2 readings show poor air quality.",
    description:
      "Our solution transforms a public plaza into an active system for improving urban air quality. A CO2 sensor detects poor air quality, and servo motors open the filtration structure when needed.",
    students: ["Guilherme M. S. Litwin", "Joao T. Ronzella"],
    focus: "air",
    sensor: "CO2 sensor",
    actuator: "Servo motors",
    sensorKind: "co2",
    actuatorKind: "servo",
  },
  {
    id: "ecobike",
    title: "EcoBike",
    subtitle: "Bike and car proximity warning",
    quick: "Nearby bikes activate visual and sound alerts for drivers.",
    description:
      "Our solution creates a safer way to detect and improve interaction between bicycles and cars on busy streets. An IR sensor detects nearby bikes and activates LEDs and a buzzer to warn drivers.",
    students: ["Felipe A. Franklin", "Gustavo V. O. Cheli", "Henrique G. Santos", "Joaquim S. G. Rosa", "Rafael R. Campos"],
    focus: "mobility",
    sensor: "IR sensor",
    actuator: "LEDs and buzzer",
    sensorKind: "ir",
    actuatorKind: "buzzer",
  },
  {
    id: "ecobreeze",
    title: "EcoBreeze",
    subtitle: "Extreme-heat transit cooling",
    quick: "Transit stations mist automatically when temperatures rise too far.",
    description:
      "Our solution makes public transportation spaces more comfortable during extreme heat. A temperature sensor detects high temperatures and automatically activates misting devices around the station.",
    students: ["Elena M. Antiquera", "Lara B. Sarhan", "Manuela L. T. Loureiro", "Maria Beatriz P. Veloso", "Stella P. Azzi"],
    focus: "mobility",
    sensor: "Temperature sensor",
    actuator: "Misting devices",
    sensorKind: "temperature",
    actuatorKind: "mist",
  },
  {
    id: "co2unter",
    title: "CO2UNTER",
    subtitle: "Hybrid filtration controller",
    quick: "A relay manages fans and equipment inside a building filtration system.",
    description:
      "Our solution gives buildings an active role in reducing urban air pollution. Sensors monitor conditions, while a relay controls fans and equipment inside the hybrid filtration system.",
    students: ["Frederico V. Maligo", "Gianluca S. Barone", "Patrick M. Collard"],
    focus: "air",
    sensor: "Environmental sensors",
    actuator: "Relay-controlled fans and equipment",
    sensorKind: "environment",
    actuatorKind: "relay",
  },
  {
    id: "greenbee",
    title: "GreenBee",
    subtitle: "Pollinator protection structure",
    quick: "Sensors monitor conditions while an automated structure protects pollinators.",
    description:
      "Our solution creates safer urban spaces for insects and pollinators. Environmental conditions are monitored by sensors, while an automated structure provides protection when needed.",
    students: ["Carolina O. Ramos", "Isabella S. Jafet", "Miguel F. B. Coxo", "Olivia Z. Manssur"],
    focus: "green",
    sensor: "Environmental sensors",
    actuator: "Automated protective structure",
    sensorKind: "environment",
    actuatorKind: "servo",
  },
  {
    id: "food-4-all",
    title: "Food 4 All",
    subtitle: "Food waste availability alerts",
    quick: "Tag cards and LEDs help manage products before they are discarded.",
    description:
      "Our solution helps supermarkets reduce food waste before products are unnecessarily discarded. Tag cards identify products, while LEDs and a servo-controlled system help manage food according to their expiration status, alerting the community when items are available.",
    students: ["Constanza F. Campofiorito", "Luiza B. Pato", "Patricia V. Pierotti"],
    focus: "waste",
    sensor: "Tag cards",
    actuator: "LEDs and servo-controlled system",
    sensorKind: "tag",
    actuatorKind: "servo",
  },
];

export default function ProjectsPage() {
  const [activeId, setActiveId] = useState(PROJECTS[0].id);
  const selectedProject = PROJECTS.find((project) => project.id === activeId) ?? PROJECTS[0];

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white">
      <Navbar />

      <section className="relative px-4 pb-16 pt-24 md:px-8">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.72) 0%, #000 38%, #000 100%), linear-gradient(120deg, rgba(124,58,237,0.10), rgba(6,182,212,0.06) 45%, rgba(34,197,94,0.05))",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.55) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        <div className="relative mx-auto max-w-7xl">
          <header className="mb-8 grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-end">
            <div>
              <p className="mb-3 text-[11px] font-mono uppercase tracking-[0.32em] text-white/30">
                Year 9 Makers
              </p>
              <h1 className="font-display text-4xl font-bold leading-[1.02] md:text-6xl">
                Meet The <span className="gradient-text">Projects</span>
              </h1>
            </div>
            <div className="grid grid-cols-3 gap-3 rounded-lg border border-white/8 bg-white/[0.035] p-3 backdrop-blur-xl">
              <Stat label="Projects" value={PROJECTS.length} />
              <Stat label="Focus" value={6} />
              <Stat label="Year" value={9} />
            </div>
          </header>

          <div className="sticky top-16 z-30 mb-7 rounded-lg border border-white/8 bg-black/82 p-3 backdrop-blur-2xl">
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {PROJECTS.map((project) => {
                const meta = FOCUS_META[project.focus];
                const active = selectedProject.id === project.id;
                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => setActiveId(project.id)}
                    className="h-9 flex-shrink-0 rounded-lg px-3 text-left text-[11px] font-semibold transition-all duration-200"
                    style={{
                      background: active ? meta.quiet : "rgba(255,255,255,0.025)",
                      border: `1px solid ${active ? `${meta.color}55` : "rgba(255,255,255,0.07)"}`,
                      color: active ? meta.color : "rgba(255,255,255,0.42)",
                    }}
                  >
                    {project.title}
                  </button>
                );
              })}
            </div>
          </div>

          <motion.div layout className="grid auto-rows-auto grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {PROJECTS.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                expanded={selectedProject.id === project.id}
                onToggle={() => setActiveId(project.id)}
              />
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-white/6 bg-black/35 px-3 py-3 text-center">
      <div className="font-display text-2xl font-bold text-white">{value}</div>
      <div className="mt-1 text-[10px] font-mono uppercase tracking-widest text-white/28">{label}</div>
    </div>
  );
}

function ProjectCard({
  project,
  index,
  expanded,
  onToggle,
}: {
  project: Project;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const meta = FOCUS_META[project.focus];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.025, 0.22), ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden rounded-lg border p-5 ${expanded ? "md:col-span-2 xl:col-span-2" : ""}`}
      style={{
        background: expanded
          ? `linear-gradient(145deg, ${meta.color}2E 0%, rgba(18,18,24,0.96) 34%, rgba(3,8,10,0.98) 100%)`
          : `linear-gradient(145deg, ${meta.quiet}, rgba(8,8,10,0.88) 34%, rgba(0,0,0,0.96))`,
        borderColor: expanded ? `${meta.color}88` : "rgba(255,255,255,0.08)",
        boxShadow: expanded
          ? `0 26px 80px rgba(0,0,0,0.58), 0 0 70px ${meta.quiet}, inset 0 1px 0 rgba(255,255,255,0.14), inset 0 0 0 1px ${meta.color}26`
          : "0 12px 36px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      <div className="absolute left-0 right-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${meta.color}70, transparent)` }} />

      <button type="button" onClick={onToggle} className="block w-full text-left" aria-expanded={expanded}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.26em]" style={{ color: meta.color }}>
              {FOCUS_META[project.focus].label}
            </p>
            <h2 className="font-display text-2xl font-bold leading-tight text-white md:text-3xl">
              {project.title}
            </h2>
            <p className="mt-1 text-sm font-medium text-white/38">{project.subtitle}</p>
          </div>
          <span
            className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full border transition-transform duration-300"
            style={{
              borderColor: `${meta.color}44`,
              background: `${meta.color}14`,
              color: meta.color,
              transform: expanded ? "rotate(45deg)" : "rotate(0deg)",
            }}
            aria-hidden
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
        </div>

        <p className="text-sm leading-relaxed text-white/62">{project.quick}</p>

        <div className="mt-5 border-t border-white/7 pt-4">
          <p className="mb-2 text-[10px] font-mono uppercase tracking-widest text-white/24">Students</p>
          <p className="text-xs leading-relaxed text-white/48">{project.students.join(", ")}</p>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-6 grid gap-6 border-t border-white/8 pt-6 lg:grid-cols-[1.02fr_0.98fr]">
              <section>
                <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.26em] text-white/26">
                  Full Project Legend
                </p>
                <p className="text-base leading-relaxed text-white/74">{project.description}</p>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <DetailLine label="Sensor" value={project.sensor} color="#06B6D4" />
                  <DetailLine label="Actuator" value={project.actuator} color="#22C55E" />
                  <DetailLine label="Focus Point" value={meta.label} color={meta.color} />
                </div>
              </section>

              <section className="min-h-[260px]">
                <ProjectTechAnimation project={project} />
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

function DetailLine({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="border-t border-white/8 pt-3">
      <div className="mb-2 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ background: color, boxShadow: `0 0 14px ${color}88` }} />
        <span className="text-[10px] font-mono uppercase tracking-widest text-white/24">{label}</span>
      </div>
      <p className="text-sm font-semibold leading-snug text-white/70">{value}</p>
    </div>
  );
}

function ProjectTechAnimation({ project }: { project: Project }) {
  const meta = FOCUS_META[project.focus];
  const gradientId = `flow-${project.id}`;

  return (
    <div
      className="relative h-full min-h-[260px] overflow-hidden rounded-lg border p-3"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.015))",
        borderColor: `${meta.color}30`,
      }}
    >
      <svg viewBox="0 0 640 300" className="h-full min-h-[236px] w-full" role="img" aria-label={`${project.sensor} activates ${project.actuator}`}>
        <defs>
          <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="50%" stopColor={meta.color} />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
        </defs>

        <path d="M130 150 C215 80 272 220 320 150 C372 74 434 220 512 150" fill="none" stroke={`url(#${gradientId})`} strokeWidth="3" strokeLinecap="round" opacity="0.42" />
        <motion.path
          d="M130 150 C215 80 272 220 320 150 C372 74 434 220 512 150"
          fill="none"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="2 20"
          animate={{ strokeDashoffset: [0, -132] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
        />

        {[0, 1, 2].map((item) => (
          <motion.circle
            key={item}
            r="6"
            fill={item === 0 ? "#06B6D4" : item === 1 ? meta.color : "#22C55E"}
            filter="drop-shadow(0 0 10px currentColor)"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              cx: [130, 238, 396, 512],
              cy: [150, 112, 190, 150],
            }}
            transition={{ duration: 3.2, repeat: Infinity, delay: item * 0.55, ease: "easeInOut" }}
          />
        ))}

        <DeviceShell x={52} y={70} title="Sensor" label={project.sensor} color="#06B6D4">
          <SensorGlyph kind={project.sensorKind} color="#67E8F9" />
        </DeviceShell>

        <g transform="translate(276 96)">
          <motion.rect
            x="0"
            y="0"
            width="88"
            height="108"
            rx="14"
            fill="rgba(255,255,255,0.045)"
            stroke={meta.color}
            strokeOpacity="0.48"
            animate={{ strokeOpacity: [0.32, 0.82, 0.32] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <rect x="24" y="22" width="40" height="40" rx="8" fill={`${meta.color}24`} stroke={meta.color} strokeOpacity="0.6" />
          <path d="M34 42h20M44 32v20" stroke={meta.color} strokeWidth="3" strokeLinecap="round" />
          <text x="44" y="86" textAnchor="middle" fill="rgba(255,255,255,0.42)" fontSize="11" fontFamily="monospace">ARDUINO</text>
          {[14, 28, 42, 56, 70].map((pin) => (
            <g key={pin}>
              <circle cx="-5" cy={pin} r="2" fill={meta.color} opacity="0.55" />
              <circle cx="93" cy={pin} r="2" fill={meta.color} opacity="0.55" />
            </g>
          ))}
        </g>

        <DeviceShell x={480} y={70} title="Actuator" label={project.actuator} color="#22C55E">
          <ActuatorGlyph kind={project.actuatorKind} color="#86EFAC" />
        </DeviceShell>
      </svg>
    </div>
  );
}

function DeviceShell({
  x,
  y,
  title,
  label,
  color,
  children,
}: {
  x: number;
  y: number;
  title: string;
  label: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="108" height="160" rx="16" fill="rgba(255,255,255,0.045)" stroke={color} strokeOpacity="0.45" />
      <motion.rect
        x="10"
        y="10"
        width="88"
        height="88"
        rx="14"
        fill={`${color}16`}
        stroke={color}
        strokeOpacity="0.42"
        animate={{ y: [10, 6, 10] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <g transform="translate(28 27)">{children}</g>
      <text x="54" y="122" textAnchor="middle" fill={color} fontSize="11" fontFamily="monospace" fontWeight="700">{title}</text>
      <foreignObject x="10" y="130" width="88" height="24">
        <p className="truncate text-center text-[10px] leading-6 text-white/42">{label}</p>
      </foreignObject>
    </g>
  );
}

function SensorGlyph({ kind, color }: { kind: SensorKind; color: string }) {
  switch (kind) {
    case "temperature":
      return (
        <g stroke={color} strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M24 6v31" />
          <circle cx="24" cy="42" r="10" fill={`${color}22`} />
          <path d="M24 20h12M24 30h9" />
        </g>
      );
    case "rain":
      return (
        <g fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
          <path d="M14 10c7-8 21-4 23 8 7 1 11 5 11 12 0 8-6 13-14 13H16C8 43 2 38 2 30c0-7 5-12 12-12" />
          <path d="M16 52l5-9M30 52l5-9M44 52l5-9" />
        </g>
      );
    case "soil":
      return (
        <g fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M26 52V26" />
          <path d="M26 28c-13 0-17-10-17-19 12 0 17 8 17 19Z" fill={`${color}18`} />
          <path d="M26 30c13 0 17-10 17-19-12 0-17 8-17 19Z" fill={`${color}18`} />
          <path d="M6 54h40" />
        </g>
      );
    case "water":
      return (
        <g fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
          <rect x="9" y="10" width="34" height="42" rx="5" />
          <path d="M12 36c8-8 18 8 28 0" />
          <path d="M18 20h16M18 28h16" />
        </g>
      );
    case "turbidity":
      return (
        <g fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
          <path d="M8 22c8-8 16 8 24 0s16 8 24 0" />
          <path d="M8 36c8-8 16 8 24 0s16 8 24 0" />
          <circle cx="19" cy="48" r="2" fill={color} />
          <circle cx="34" cy="48" r="2" fill={color} />
          <circle cx="47" cy="48" r="2" fill={color} />
        </g>
      );
    case "ir":
      return (
        <g fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
          <rect x="10" y="22" width="18" height="20" rx="4" />
          <path d="M34 18c9 8 9 20 0 28M42 12c14 13 14 28 0 40" />
          <circle cx="19" cy="32" r="4" fill={`${color}33`} />
        </g>
      );
    case "co2":
      return (
        <g>
          <circle cx="28" cy="28" r="23" fill={`${color}18`} stroke={color} strokeWidth="3" />
          <text x="28" y="33" textAnchor="middle" fill={color} fontSize="16" fontFamily="monospace" fontWeight="700">CO2</text>
        </g>
      );
    case "ph":
      return (
        <g fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
          <path d="M18 6h20M22 6v28l-9 16h30l-9-16V6" />
          <text x="28" y="34" textAnchor="middle" fill={color} stroke="none" fontSize="15" fontFamily="monospace" fontWeight="700">pH</text>
        </g>
      );
    case "tag":
      return (
        <g fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
          <rect x="8" y="12" width="40" height="30" rx="5" />
          <path d="M16 20v14M23 20v14M31 20v14M39 20v14" />
          <path d="M18 50h20" />
        </g>
      );
    default:
      return (
        <g fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
          <circle cx="28" cy="28" r="20" />
          <path d="M28 8v8M28 40v8M8 28h8M40 28h8M15 15l6 6M41 15l-6 6M15 41l6-6M41 41l-6-6" />
        </g>
      );
  }
}

function ActuatorGlyph({ kind, color }: { kind: ActuatorKind; color: string }) {
  switch (kind) {
    case "mist":
      return (
        <g fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
          <path d="M28 8v18" />
          <path d="M16 28h24" />
          <motion.path d="M12 44c6-8 12 8 18 0s12 8 18 0" animate={{ opacity: [0.25, 1, 0.25], y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity }} />
          <circle cx="16" cy="36" r="2" fill={color} />
          <circle cx="28" cy="36" r="2" fill={color} />
          <circle cx="40" cy="36" r="2" fill={color} />
        </g>
      );
    case "servo":
      return (
        <g fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <rect x="11" y="23" width="34" height="22" rx="5" />
          <motion.path d="M28 23V8l18 8" animate={{ rotate: [-18, 18, -18] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "28px 23px" }} />
          <circle cx="28" cy="34" r="4" fill={`${color}33`} />
        </g>
      );
    case "led":
      return (
        <g fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
          <motion.circle cx="28" cy="24" r="14" fill={`${color}22`} animate={{ opacity: [0.35, 1, 0.35] }} transition={{ duration: 1.3, repeat: Infinity }} />
          <path d="M18 38h20M22 46h12M24 54h8M18 10l-6-6M38 10l6-6M48 24h8M0 24h8" />
        </g>
      );
    case "buzzer":
      return (
        <g fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
          <path d="M12 34h10l14 12V10L22 22H12v12Z" />
          <motion.path d="M42 20c5 5 5 11 0 16" animate={{ opacity: [0.2, 1, 0.2], x: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity }} />
          <motion.path d="M48 14c9 9 9 19 0 28" animate={{ opacity: [0.2, 0.9, 0.2], x: [0, 6, 0] }} transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }} />
        </g>
      );
    case "relay":
      return (
        <g fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <rect x="10" y="14" width="36" height="32" rx="5" />
          <motion.path d="M18 34l8-12 8 12 8-12" animate={{ opacity: [0.35, 1, 0.35] }} transition={{ duration: 1.5, repeat: Infinity }} />
          <path d="M0 30h10M46 30h10" />
        </g>
      );
    case "fan":
      return (
        <g fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
          <circle cx="28" cy="28" r="5" fill={`${color}33`} />
          <motion.g animate={{ rotate: 360 }} transition={{ duration: 1.7, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "28px 28px" }}>
            <path d="M28 23c12-18 25-4 10 5" />
            <path d="M33 31c20 2 13 22-2 10" />
            <path d="M24 31c-8 18-25 4-10-5" />
          </motion.g>
          <circle cx="28" cy="28" r="24" opacity="0.35" />
        </g>
      );
    case "conveyor":
      return (
        <g fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="30" width="44" height="14" rx="7" />
          <motion.path d="M15 37h25" animate={{ strokeDashoffset: [0, -40] }} strokeDasharray="6 7" transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} />
          <path d="M16 30l6-12h14l6 12" />
          <circle cx="17" cy="37" r="4" />
          <circle cx="39" cy="37" r="4" />
        </g>
      );
    case "irrigation":
      return (
        <g fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
          <path d="M10 20h22v10" />
          <path d="M32 30h12" />
          <motion.path d="M18 42c4-7 8 7 12 0s8 7 12 0" animate={{ opacity: [0.3, 1, 0.3], y: [0, 5, 0] }} transition={{ duration: 1.8, repeat: Infinity }} />
          <path d="M14 52h34" />
        </g>
      );
    case "storage":
      return (
        <g fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
          <rect x="10" y="12" width="36" height="38" rx="6" />
          <motion.path d="M14 35c8-8 18 8 28 0" animate={{ y: [-2, 4, -2] }} transition={{ duration: 2.3, repeat: Infinity }} />
          <path d="M18 8h20M20 54h16" />
        </g>
      );
    default:
      return (
        <g fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
          <path d="M12 18h32v26H12z" />
          <path d="M20 18V8h16v10" />
          <motion.path d="M20 31h16" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.5, repeat: Infinity }} />
        </g>
      );
  }
}

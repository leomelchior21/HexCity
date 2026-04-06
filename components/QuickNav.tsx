"use client";
import { useState, useEffect, useRef } from "react";

const sections = [
  { id: "project",   label: "The Project"    },
  { id: "megacities",label: "Mega Cities"    },
  { id: "focus",     label: "Focus Points"   },
  { id: "cities",    label: "The Cities"     },
  { id: "structure", label: "City Structure" },
  { id: "flow",      label: "Project Flow"   },
  { id: "build",     label: "How We Build"   },
  { id: "why",       label: "Why It Matters" },
];

export default function QuickNav() {
  const [active, setActive] = useState("");
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.5;
      setVisible(past);

      if (!past) return;

      const midY = window.scrollY + window.innerHeight * 0.35;
      let hit = "";
      let idx = -1;
      for (let i = 0; i < sections.length; i++) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= midY) {
          hit = sections[i].id;
          idx = i;
        }
      }
      setActive(hit);
      setActiveIndex(idx);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed left-7 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3 transition-all duration-700 ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5 pointer-events-none"
      }`}
    >
      {/* Track line */}
      <div
        className="absolute left-[5px] top-3 bottom-3 w-px"
        style={{ background: "rgba(255,255,255,0.04)" }}
      />
      {/* Active indicator — sliding pill */}
      {activeIndex >= 0 && (
        <div
          className="absolute left-[3px] w-[6px] rounded-full bg-white/60 transition-all duration-500 ease-out"
          style={{
            top: `${activeIndex * 32 + 12}px`,
            height: "8px",
            boxShadow: "0 0 8px rgba(255,255,255,0.3)",
          }}
        />
      )}
      {sections.map((s, i) => (
        <NavDot key={s.id} section={s} isActive={active === s.id} index={i} />
      ))}
    </div>
  );
}

function NavDot({
  section,
  isActive,
  index,
}: {
  section: (typeof sections)[0];
  isActive: boolean;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const show = hovered || isActive;

  const scrollTo = () =>
    document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <button
      onClick={scrollTo}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-2.5 group"
      title={section.label}
      style={{
        transitionDelay: isActive ? "0ms" : `${index * 30}ms`,
      }}
    >
      <div
        className="rounded-full flex-shrink-0 transition-all duration-300"
        style={{
          width:  isActive ? 8 : hovered ? 6 : 3,
          height: isActive ? 8 : hovered ? 6 : 3,
          background: isActive
            ? "#ffffff"
            : hovered
            ? "rgba(255,255,255,0.55)"
            : "rgba(255,255,255,0.15)",
          boxShadow: isActive ? "0 0 8px rgba(255,255,255,0.35)" : "none",
        }}
      />
      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{ maxWidth: show ? "140px" : "0px", opacity: show ? 1 : 0 }}
      >
        <span
          className="text-[10px] font-mono tracking-widest uppercase whitespace-nowrap"
          style={{ color: isActive ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.4)" }}
        >
          {section.label}
        </span>
      </div>
    </button>
  );
}

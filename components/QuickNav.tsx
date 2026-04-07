"use client";
import { useState, useEffect, useRef } from "react";

const sections = [
  { id: "project",    label: "The Project"    },
  { id: "focus",      label: "Focus Points"   },
  { id: "megacities", label: "Mega Cities"    },
  { id: "structure",  label: "CitySim Invite" },
  { id: "flow",       label: "Project Flow"   },
  { id: "build",      label: "Feedback Loop"  },
  { id: "why",        label: "Why It Matters" },
];

const NAV_ITEM_HEIGHT = 36;

export default function QuickNav() {
  const [active, setActive] = useState("");
  const [visible, setVisible] = useState(false);
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
      className={`fixed left-7 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col transition-all duration-700 ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5 pointer-events-none"
      }`}
      style={{
        marginTop: -(sections.length * NAV_ITEM_HEIGHT) / 2,
      }}
    >
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
      className="flex items-center group"
      title={section.label}
      style={{
        height: NAV_ITEM_HEIGHT,
      }}
    >
      {/* Dot */}
      <div className="relative w-3 flex items-center justify-center">
        {/* Track line */}
        {index > 0 && (
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-px"
            style={{
              height: NAV_ITEM_HEIGHT,
              background: "rgba(255,255,255,0.06)",
              top: -NAV_ITEM_HEIGHT / 2,
            }}
          />
        )}

        {/* Active ring */}
        {isActive && (
          <div
            className="absolute w-3 h-3 rounded-full transition-all duration-500"
            style={{
              border: "1px solid rgba(255,255,255,0.3)",
              animation: "navPulse 2s ease-in-out infinite",
            }}
          />
        )}

        {/* Dot circle */}
        <div
          className="rounded-full transition-all duration-300 relative z-10"
          style={{
            width: isActive ? 8 : hovered ? 6 : 3,
            height: isActive ? 8 : hovered ? 6 : 3,
            background: isActive
              ? "#ffffff"
              : hovered
              ? "rgba(255,255,255,0.55)"
              : "rgba(255,255,255,0.18)",
            boxShadow: isActive ? "0 0 10px rgba(255,255,255,0.4)" : "none",
          }}
        />
      </div>

      {/* Label */}
      <div
        className="overflow-hidden transition-all duration-300 ease-out ml-2.5"
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

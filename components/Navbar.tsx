"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { href: "/",               label: "Home"           },
  { href: "/design-thinking",label: "Design Thinking"},
  { href: "/lab",            label: "Ardudeck"       },
  { href: "/simulation",     label: "City Sim"       },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const pathname                = usePathname();
  const isHome                  = pathname === "/";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={
        scrolled
          ? {
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(28px) saturate(180%)",
              WebkitBackdropFilter: "blur(28px) saturate(180%)",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              boxShadow: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 24px rgba(0,0,0,0.5)",
            }
          : { background: "transparent" }
      }
    >
      <div className="max-w-5xl mx-auto px-8 md:px-16 h-16 flex items-center justify-between">

        {/* Logo — hidden on home page */}
        {!isHome && (
          <Link href="/" className="flex items-center opacity-90 hover:opacity-100 transition-opacity">
            <Image
              src="/hexcity-logo-white.svg"
              alt="HEXCITY"
              width={110}
              height={34}
              className="h-6 w-auto object-contain"
              priority
            />
          </Link>
        )}

        {isHome && <div />}

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group"
              style={{
                color: pathname === l.href ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.38)",
              }}
            >
              {/* Active/hover glass pill */}
              <span
                className="absolute inset-0 rounded-lg transition-all duration-200"
                style={
                  pathname === l.href
                    ? {
                        background: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.09)",
                        boxShadow: "0 1px 0 0 rgba(255,255,255,0.08) inset",
                      }
                    : { opacity: 0 }
                }
              />
              <span
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              />
              <span className="relative group-hover:text-white/80 transition-colors duration-200">
                {l.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Phase pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[10px] text-white/28 font-mono tracking-wide">APR 2026 · Ideation</span>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white/40 hover:text-white/70 p-2 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="menu"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
            {open ? (
              <path fillRule="evenodd" clipRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              />
            ) : (
              <path fillRule="evenodd" clipRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div
          className="md:hidden px-6 py-4 flex flex-col gap-1 border-t"
          style={{
            background: "rgba(0,0,0,0.90)",
            backdropFilter: "blur(28px) saturate(180%)",
            WebkitBackdropFilter: "blur(28px) saturate(180%)",
            borderColor: "rgba(255,255,255,0.05)",
          }}
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                color: pathname === l.href ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.38)",
                background: pathname === l.href ? "rgba(255,255,255,0.06)" : "transparent",
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

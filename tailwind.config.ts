import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hex: {
          purple:         "#7C3AED",
          "purple-light": "#A78BFA",
          "purple-dark":  "#5B21B6",
          cyan:           "#06B6D4",
          green:          "#22C55E",
          amber:          "#F59E0B",
          red:            "#EF4444",
          // Focus point colors
          energy:         "#F59E0B",
          water:          "#06B6D4",
          air:            "#7DD3FC",
          mobility:       "#F97316",
          waste:          "#EF4444",
          greens:         "#22C55E",
        },
      },
      fontFamily: {
        sans:      ["var(--font-inter)", "system-ui", "sans-serif"],
        display:   ["Monument Extended", "Space Grotesk", "system-ui", "sans-serif"],
        monument:  ["Monument Extended", "Space Grotesk", "sans-serif"],
      },
      animation: {
        "hex-pulse":   "hexPulse 3s ease-in-out infinite",
        "float":       "float 6s ease-in-out infinite",
        "float-slow":  "float 10s ease-in-out infinite",
        "glow":        "glow 2s ease-in-out infinite alternate",
        "slide-in":    "slideIn 0.6s ease-out",
        "fade-up":     "fadeUp 0.8s ease-out",
        "fade-in":     "fadeIn 0.6s ease-out",
        "spin-slow":   "spin 20s linear infinite",
        "spin-very-slow": "spin 40s linear infinite",
        "pulse-ring":  "pulseRing 2s ease-out infinite",
        "shimmer":     "shimmer 2.5s linear infinite",
        "liquid-glow": "liquidGlow 3s ease-in-out infinite alternate",
      },
      keyframes: {
        hexPulse: {
          "0%, 100%": { opacity: "0.12", transform: "scale(1)" },
          "50%":       { opacity: "0.30", transform: "scale(1.015)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-14px)" },
        },
        glow: {
          "0%":   { boxShadow: "0 0 20px rgba(124,58,237,0.25)" },
          "100%": { boxShadow: "0 0 50px rgba(124,58,237,0.6)" },
        },
        liquidGlow: {
          "0%":   { boxShadow: "0 0 30px rgba(124,58,237,0.2), 0 8px 32px rgba(0,0,0,0.6)" },
          "100%": { boxShadow: "0 0 60px rgba(124,58,237,0.4), 0 8px 32px rgba(0,0,0,0.6)" },
        },
        slideIn: {
          "0%":   { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(32px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pulseRing: {
          "0%":   { transform: "scale(0.8)", opacity: "0.8" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
      backdropBlur: {
        xs:  "2px",
        "2xl": "40px",
        "3xl": "60px",
      },
      backgroundImage: {
        "glass-shine": "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.06) 100%)",
      },
      transitionTimingFunction: {
        "spring":      "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "smooth-out":  "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;

"use client";
import { useRef, useEffect, useState, useCallback } from "react";

// ─── Mouse parallax hook for 3D tilt effects ────────────────────────────────
export function useMouseParallax(intensity = 8) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setRotation({
        x: (0.5 - y) * intensity,
        y: (x - 0.5) * intensity,
      });
    },
    [intensity]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMouseEnter = () => {
      setIsHovered(true);
      window.addEventListener("mousemove", handleMouseMove);
    };
    const onMouseLeave = () => {
      setIsHovered(false);
      setRotation({ x: 0, y: 0 });
      window.removeEventListener("mousemove", handleMouseMove);
    };

    el.addEventListener("mouseenter", onMouseEnter);
    el.addEventListener("mouseleave", onMouseLeave);
    return () => {
      el.removeEventListener("mouseenter", onMouseEnter);
      el.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return { ref, rotation, isHovered };
}

// ─── Tilt style helper ──────────────────────────────────────────────────────
export function tiltStyle(rotation: { x: number; y: number }, isHovered: boolean) {
  return {
    transform: isHovered
      ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.02, 1.02, 1.02)`
      : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
    transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    transformStyle: "preserve-3d" as const,
  };
}

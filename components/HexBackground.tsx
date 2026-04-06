"use client";
import { useEffect, useRef } from "react";

const R = 50;
const COL_STEP = R * 1.5;
const ROW_STEP = R * Math.sqrt(3);
const COL_OFFSET = ROW_STEP / 2;

function hexPoints(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(" ");
}

export default function HexBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W * window.devicePixelRatio;
    canvas.height = H * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    mouseRef.current = { x: W / 2, y: H / 2 };

    const cols = Math.ceil(W / COL_STEP) + 3;
    const rows = Math.ceil(H / ROW_STEP) + 3;

    type HexData = { x: number; y: number; baseR: number; phase: number };
    const hexes: HexData[] = [];

    for (let col = -1; col < cols; col++) {
      for (let row = -1; row < rows; row++) {
        hexes.push({
          x: col * COL_STEP + R,
          y: row * ROW_STEP + (col % 2 === 1 ? COL_OFFSET : 0) + ROW_STEP / 2,
          baseR: R * (0.12 + Math.random() * 0.08),
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    // Connection lines between nearby hexes
    const connections: [number, number][] = [];
    const maxDist = COL_STEP * 1.8;
    for (let i = 0; i < hexes.length; i++) {
      for (let j = i + 1; j < hexes.length; j++) {
        const d = Math.hypot(hexes[i].x - hexes[j].x, hexes[i].y - hexes[j].y);
        if (d < maxDist) connections.push([i, j]);
      }
    }

    let t = 0;
    function animate() {
      t += 0.006;
      ctx.clearRect(0, 0, W, H);

      const m = mouseRef.current;
      const maxDistToMouse = Math.hypot(W / 2, H / 2);

      // Draw connection lines
      for (let c = 0; c < connections.length; c++) {
        const [i, j] = connections[c];
        const hi = hexes[i];
        const hj = hexes[j];
        const midX = (hi.x + hj.x) / 2;
        const midY = (hi.y + hj.y) / 2;
        const distToMouse = Math.hypot(midX - m.x, midY - m.y);
        const influence = Math.max(0, 1 - distToMouse / (maxDistToMouse * 0.6));

        const wave = 0.5 + 0.5 * Math.sin(t * 1.5 - distToMouse * 0.008);
        const alpha = 0.02 + influence * 0.06 * wave;

        ctx.beginPath();
        ctx.moveTo(hi.x, hi.y);
        ctx.lineTo(hj.x, hj.y);
        ctx.strokeStyle = `rgba(167,139,250,${alpha.toFixed(3)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Draw hexagons
      for (let i = 0; i < hexes.length; i++) {
        const h = hexes[i];
        const distToMouse = Math.hypot(h.x - m.x, h.y - m.y);
        const influence = Math.max(0, 1 - distToMouse / (maxDistToMouse * 0.5));

        const wave = Math.sin(t * 1.8 - distToMouse * 0.006 + h.phase) * 0.3;
        const drawR = h.baseR * (1 + influence * 0.8 + wave * 0.3);
        const strokeAlpha = 0.04 + influence * 0.18 + wave * 0.05;
        const brightAlpha = 0.08 + influence * 0.25;

        // Purple tint for nearby hexes
        const purple = influence > 0.3;

        ctx.beginPath();
        const pts = hexPoints(h.x, h.y, drawR).split(" ").map(p => {
          const [x, y] = p.split(",").map(Number);
          return { x, y };
        });
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let j = 1; j < pts.length; j++) ctx.lineTo(pts[j].x, pts[j].y);
        ctx.closePath();

        if (purple) {
          ctx.fillStyle = `rgba(124,58,237,${(brightAlpha * 0.3).toFixed(3)})`;
          ctx.fill();
        }

        ctx.strokeStyle = purple
          ? `rgba(167,139,250,${brightAlpha.toFixed(3)})`
          : `rgba(255,255,255,${strokeAlpha.toFixed(3)})`;
        ctx.lineWidth = purple ? 1 : 0.5;
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    animate();
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}

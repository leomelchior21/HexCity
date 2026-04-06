"use client";

import { useRef, useEffect, useCallback, useState } from "react";

// ─── Geometry constants ──────────────────────────────────────────────────
const R = 44; // circumradius for street graph
const R_DRAW = 34; // visual polygon radius
const H_HEX = R * Math.sqrt(3);
const COL_STEP = R * 1.5;
const ROW_STEP = H_HEX;
const COL_OFFSET = H_HEX / 2;
const NCOLS = 10;
const NROWS = 6;

// ─── Types ───────────────────────────────────────────────────────────────
export type EntityType = "pedestrian" | "bike" | "car" | "bus";
type HexType = "building" | "vegetation";

export interface SimState {
  hexes: { col: number; row: number; id: string; type: HexType; seed: number; x: number; y: number }[];
  nodes: Record<string, { id: string; x: number; y: number; neighbors: string[] }>;
  entities: {
    type: EntityType;
    fromId: string;
    toId: string;
    progress: number;
    x: number;
    y: number;
    color: string;
    speed: number;
    dirX: number;
    dirY: number;
    trail: { x: number; y: number; age: number }[];
    active: boolean;
  }[];
  tick: number;
  congestion: number;
  avgSpeed: number;
  efficiency: number;
}

// ─── Entity properties ────────────────────────────────────────────────────
const EPROPS: Record<EntityType, {
  r: number;
  colors: string[];
  speed: number;
  bias: number;
  trailColor: string;
  glowSize: number;
}> = {
  pedestrian: {
    r: 2,
    colors: ["#f8fafc", "#e2e8f0", "#94a3b8", "#cbd5e1"],
    speed: 0.012,
    bias: 0.28,
    trailColor: "rgba(200,210,220,",
    glowSize: 0,
  },
  bike: {
    r: 2.5,
    colors: ["#22c55e", "#4ade80", "#86efac", "#a3e635"],
    speed: 0.022,
    bias: 0.55,
    trailColor: "rgba(34,197,94,",
    glowSize: 8,
  },
  car: {
    r: 3.5,
    colors: ["#ef4444", "#dc2626", "#f87171", "#fca5a5"],
    speed: 0.038,
    bias: 0.72,
    trailColor: "rgba(239,68,68,",
    glowSize: 12,
  },
  bus: {
    r: 5,
    colors: ["#facc15", "#fbbf24", "#fde047", "#eab308"],
    speed: 0.028,
    bias: 0.82,
    trailColor: "rgba(245,158,11,",
    glowSize: 16,
  },
};

// ─── Geometry helpers ─────────────────────────────────────────────────────
function hexVerts(cx: number, cy: number, r = R): [number, number][] {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as [number, number];
  });
}

function nid(x: number, y: number): string {
  return `${Math.round(x)},${Math.round(y)}`;
}

function hexCenter(col: number, row: number, ox: number, oy: number) {
  return {
    x: ox + col * COL_STEP + R,
    y: oy + row * ROW_STEP + (col % 2 === 1 ? COL_OFFSET : 0) + H_HEX / 2,
  };
}

// ─── Module-level grid cache ─────────────────────────────────────────────
type HexBase = { col: number; row: number; id: string; seed: number; x: number; y: number };
let _base: HexBase[] | null = null;
let _nodes: Record<string, { id: string; x: number; y: number; neighbors: string[] }> | null = null;

function initGrid(svgW: number, svgH: number) {
  if (_base) return;
  const gridW = NCOLS * COL_STEP + R;
  const gridH = NROWS * ROW_STEP + COL_OFFSET;
  const ox = (svgW - gridW) / 2;
  const oy = (svgH - gridH) / 2;

  let s = 0xc0ffee;
  const rng = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };

  _base = [];
  for (let row = 0; row < NROWS; row++) {
    for (let col = 0; col < NCOLS; col++) {
      const { x, y } = hexCenter(col, row, ox, oy);
      _base.push({ col, row, id: `${col},${row}`, seed: rng(), x, y });
    }
  }

  _nodes = {};
  for (const h of _base) {
    const verts = hexVerts(h.x, h.y);
    for (let i = 0; i < 6; i++) {
      const [ax, ay] = verts[i];
      const [bx, by] = verts[(i + 1) % 6];
      const a = nid(ax, ay);
      const b = nid(bx, by);
      if (!_nodes[a]) _nodes[a] = { id: a, x: ax, y: ay, neighbors: [] };
      if (!_nodes[b]) _nodes[b] = { id: b, x: bx, y: by, neighbors: [] };
      if (!_nodes[a].neighbors.includes(b)) _nodes[a].neighbors.push(b);
      if (!_nodes[b].neighbors.includes(a)) _nodes[b].neighbors.push(a);
    }
  }
}

// ─── Pool entity management ──────────────────────────────────────────────
const MAX_ENTITIES = 1000;
let nextEntityId = 0;
const entityPool: {
  id: number;
  type: EntityType;
  fromId: string;
  toId: string;
  progress: number;
  x: number;
  y: number;
  color: string;
  speed: number;
  dirX: number;
  dirY: number;
  trail: { x: number; y: number; age: number }[];
  active: boolean;
}[] = [];

function getPoolEntity() {
  for (let i = 0; i < entityPool.length; i++) {
    if (!entityPool[i].active) return entityPool[i];
  }
  if (entityPool.length < MAX_ENTITIES) {
    const e = {
      id: nextEntityId++,
      type: "car" as EntityType,
      fromId: "",
      toId: "",
      progress: 0,
      x: 0,
      y: 0,
      color: "#fff",
      speed: 0.03,
      dirX: 0,
      dirY: 0,
      trail: [],
      active: false,
    };
    entityPool.push(e);
    return e;
  }
  return null;
}

// ─── Simulation state ────────────────────────────────────────────────────
let simHexes: { col: number; row: number; id: string; type: HexType; seed: number; x: number; y: number }[] = [];
let simNodes: Record<string, { id: string; x: number; y: number; neighbors: string[] }> = {};
let simTick = 0;
let simPaused = false;
let simTargets: Record<EntityType, number> = { car: 8, bus: 3, bike: 6, pedestrian: 10 };
let simVegRatio = 0.3;
let simCongestion = 0;
let simAvgSpeed = 0;
let simEfficiency = 100;
let simSpeedMultiplier = 1;
let simPrevTargets: Record<EntityType, number> = { car: 0, bus: 0, bike: 0, pedestrian: 0 };

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function spawnEntity(type: EntityType) {
  // Prefer intersections with 3+ neighbors for organic routing, fallback to any node
  let ids = Object.keys(simNodes).filter(id => simNodes[id].neighbors.length >= 3);
  if (!ids.length) ids = Object.keys(simNodes);
  if (!ids.length) return;
  const fromId = pick(ids);
  const from = simNodes[fromId];
  if (!from || !from.neighbors.length) return;
  const toId = pick(from.neighbors);
  const to = simNodes[toId];
  if (!to) return;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const p = EPROPS[type];

  const e = getPoolEntity();
  if (!e) return;
  e.id = nextEntityId++;
  e.type = type;
  e.fromId = fromId;
  e.toId = toId;
  e.progress = 0;
  e.x = from.x;
  e.y = from.y;
  e.color = pick(p.colors);
  e.speed = p.speed * (0.75 + Math.random() * 0.5);
  e.dirX = dx / len;
  e.dirY = dy / len;
  e.trail = [];
  e.active = true;
}

function tickLogic() {
  if (simPaused) {
    simTick++;
    return;
  }
  // Run multiple ticks for speed > 1
  const ticks = Math.max(1, Math.round(simSpeedMultiplier));
  for (let t = 0; t < ticks; t++) {
    simTick++;
    const nodes = simNodes;
    tickStep(nodes);
  }

  let total = 0;
  let speedSum = 0;
  for (let i = 0; i < entityPool.length; i++) {
    if (entityPool[i].active) {
      total++;
      speedSum += EPROPS[entityPool[i].type].speed;
    }
  }
  simCongestion = Math.min(100, Math.round((total / 80) * 100));
  simAvgSpeed = total === 0 ? 0 : Math.round((speedSum / total) * 1800);
  simEfficiency = Math.min(100, Math.max(0, 100 - Math.round(simCongestion * 0.35)));
}

function tickStep(nodes: Record<string, { id: string; x: number; y: number; neighbors: string[] }>) {

  for (let i = 0; i < entityPool.length; i++) {
    const e = entityPool[i];
    if (!e.active) continue;
    const from = nodes[e.fromId];
    const to = nodes[e.toId];
    if (!from || !to) {
      e.active = false;
      continue;
    }
    e.progress += e.speed;
    if (e.progress >= 1) {
      const cands = to.neighbors.filter(id => id !== e.fromId);
      const pool2 = cands.length ? cands : to.neighbors;
      let nextId: string;
      if (pool2.length === 1) {
        nextId = pool2[0];
      } else {
        const bias = EPROPS[e.type].bias;
        let bestId = pool2[0];
        let bestScore = -999;
        for (let j = 0; j < pool2.length; j++) {
          const n = nodes[pool2[j]];
          const ddx = n.x - to.x;
          const ddy = n.y - to.y;
          const ll = Math.hypot(ddx, ddy) || 1;
          const dot = (ddx / ll) * e.dirX + (ddy / ll) * e.dirY;
          const score = dot * bias + Math.random() * (1 - bias);
          if (score > bestScore) { bestScore = score; bestId = pool2[j]; }
        }
        nextId = bestId;
      }
      const nxt = nodes[nextId];
      const ddx = nxt.x - to.x;
      const ddy = nxt.y - to.y;
      const ll = Math.hypot(ddx, ddy) || 1;
      e.trail.push({ x: e.x, y: e.y, age: 0 });
      if (e.trail.length > 8) e.trail.shift();
      e.fromId = e.toId;
      e.toId = nextId;
      e.progress = 0;
      e.x = to.x;
      e.y = to.y;
      e.dirX = ddx / ll;
      e.dirY = ddy / ll;
    } else {
      e.x = from.x + (to.x - from.x) * e.progress;
      e.y = from.y + (to.y - from.y) * e.progress;
    }
  }

  // Spawn/despawn every 15 ticks OR when targets change
  const targetsChanged = (["car", "bus", "bike", "pedestrian"] as EntityType[]).some(
    t => simTargets[t] !== simPrevTargets[t]
  );

  if (simTick % 15 === 0 || targetsChanged) {
    for (const type of ["car", "bus", "bike", "pedestrian"] as EntityType[]) {
      const target = simTargets[type] ?? 0;
      let current = 0;
      for (let i = 0; i < entityPool.length; i++) {
        if (entityPool[i].active && entityPool[i].type === type) current++;
      }
      const diff = target - current;

      if (diff > 0) {
        // Spawn all needed entities immediately
        for (let i = 0; i < diff; i++) spawnEntity(type);
      } else if (diff < 0) {
        // Remove excess entities
        let removed = 0;
        for (let i = entityPool.length - 1; i >= 0 && removed < -diff; i--) {
          if (entityPool[i].active && entityPool[i].type === type) {
            entityPool[i].active = false;
            removed++;
          }
        }
      }
    }
    // Update prev targets
    simPrevTargets = { ...simTargets };
  }

  let total = 0;
  let speedSum = 0;
  for (let i = 0; i < entityPool.length; i++) {
    if (entityPool[i].active) {
      total++;
      speedSum += EPROPS[entityPool[i].type].speed;
    }
  }
  simCongestion = Math.min(100, Math.round((total / 80) * 100));
  simAvgSpeed = total === 0 ? 0 : Math.round((speedSum / total) * 1800);
  simEfficiency = Math.min(100, Math.max(0, 100 - Math.round(simCongestion * 0.35)));
}

let selectedEntityId: string | null = null;

export function setSelectedEntityId(id: string | null) {
  selectedEntityId = id;
}
let hexPolygons: { points: [number, number][]; x: number; y: number; type: HexType }[] = [];
let offscreenCanvas: OffscreenCanvas | null = null;
let offscreenCtx: OffscreenCanvasRenderingContext2D | null = null;
let lastHexTypes: string = "";

function buildHexPolygons() {
  hexPolygons = simHexes.map(h => ({
    points: hexVerts(h.x, h.y, R_DRAW).map(([x, y]) => [x, y]),
    x: h.x,
    y: h.y,
    type: h.type,
  }));
}

function renderOffscreen() {
  if (!offscreenCtx || !offscreenCanvas) return;
  const ctx = offscreenCtx;
  const w = offscreenCanvas.width;
  const h = offscreenCanvas.height;

  ctx.clearRect(0, 0, w, h);

  // Draw hex buildings
  for (let i = 0; i < hexPolygons.length; i++) {
    const hex = hexPolygons[i];
    const isVeg = hex.type === "vegetation";

    // Building base
    ctx.beginPath();
    const pts = hex.points;
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let j = 1; j < pts.length; j++) ctx.lineTo(pts[j][0], pts[j][1]);
    ctx.closePath();

    if (isVeg) {
      ctx.fillStyle = "#0a2015";
      ctx.fill();
      ctx.strokeStyle = "rgba(34,197,94,0.28)";
      ctx.lineWidth = 1;
      ctx.stroke();
    } else {
      // 3D extrusion effect
      ctx.fillStyle = "#0e1a32";
      ctx.fill();
      ctx.strokeStyle = "rgba(59,130,246,0.28)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Extruded top face (pseudo-3D)
      const topOffset = -4;
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1] + topOffset);
      for (let j = 1; j < pts.length; j++) ctx.lineTo(pts[j][0], pts[j][1] + topOffset);
      ctx.closePath();
      ctx.fillStyle = "rgba(30,50,80,0.6)";
      ctx.fill();
      ctx.strokeStyle = "rgba(59,130,246,0.15)";
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Side faces
      for (let j = 0; j < pts.length; j++) {
        const next = (j + 1) % pts.length;
        ctx.beginPath();
        ctx.moveTo(pts[j][0], pts[j][1]);
        ctx.lineTo(pts[next][0], pts[next][1]);
        ctx.lineTo(pts[next][0], pts[next][1] + topOffset);
        ctx.lineTo(pts[j][0], pts[j][1] + topOffset);
        ctx.closePath();
        ctx.fillStyle = j % 2 === 0 ? "rgba(15,25,50,0.5)" : "rgba(20,35,65,0.4)";
        ctx.fill();
      }
    }

    // Vegetation emoji
    if (isVeg) {
      ctx.font = "16px serif";
      ctx.textAlign = "center";
      ctx.fillText("🌿", hex.x, hex.y + 6);
    }
  }
}

function renderFrame(
  ctx: CanvasRenderingContext2D,
  zoom: number,
  dayNight: number,
  showHeatmap: boolean
) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#06080e";
  ctx.fillRect(0, 0, w, h);

  // Apply zoom transform
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.scale(zoom, zoom);
  ctx.translate(-w / 2, -h / 2);

  // Blit offscreen hex grid
  if (offscreenCanvas) {
    ctx.drawImage(offscreenCanvas, 0, 0);
  }

  // Heat map overlay
  if (showHeatmap) {
    for (let i = 0; i < entityPool.length; i++) {
      const e = entityPool[i];
      if (!e.active) continue;
      const gradient = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, 20);
      const intensity = e.type === "car" || e.type === "bus" ? 0.4 : 0.2;
      gradient.addColorStop(0, `rgba(239,68,68,${intensity})`);
      gradient.addColorStop(1, "rgba(239,68,68,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(e.x - 20, e.y - 20, 40, 40);
    }
  }

  // Entity trails
  for (let i = 0; i < entityPool.length; i++) {
    const e = entityPool[i];
    if (!e.active) continue;
    const p = EPROPS[e.type];
    if (p.glowSize === 0) continue;

    for (let t = 0; t < e.trail.length; t++) {
      const tr = e.trail[t];
      tr.age += 0.016; // approximate delta per frame
      const alpha = Math.max(0, 1 - tr.age * 3);
      if (alpha <= 0) continue;
      ctx.beginPath();
      ctx.arc(tr.x, tr.y, p.r * 0.7 * alpha, 0, Math.PI * 2);
      ctx.fillStyle = p.trailColor + (alpha * 0.35).toFixed(3) + ")";
      ctx.fill();
    }
    // Clean old trail points
    e.trail = e.trail.filter(tr => tr.age < 0.4);
  }

  // Entities
  const time = Date.now() * 0.004;
  for (let i = 0; i < entityPool.length; i++) {
    const e = entityPool[i];
    if (!e.active) continue;
    const p = EPROPS[e.type];
    const isSelected = selectedEntityId === e.id.toString();

    // Selection ring
    if (isSelected) {
      const pulseR = p.r + 8 + Math.sin(time * 3) * 3;
      ctx.beginPath();
      ctx.arc(e.x, e.y, pulseR, 0, Math.PI * 2);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(e.x, e.y, pulseR + 4, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Glow
    if (p.glowSize > 0) {
      const gradient = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, p.r + p.glowSize);
      gradient.addColorStop(0, e.color + "30");
      gradient.addColorStop(1, e.color + "00");
      ctx.beginPath();
      ctx.arc(e.x, e.y, p.r + p.glowSize, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // Main body
    ctx.beginPath();
    ctx.arc(e.x, e.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = e.color;
    ctx.globalAlpha = e.type === "pedestrian" ? 0.75 : 0.95;
    ctx.fill();
    ctx.globalAlpha = 1;

    // Inner highlight
    ctx.beginPath();
    ctx.arc(e.x - p.r * 0.2, e.y - p.r * 0.2, p.r * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fill();
  }

  ctx.restore();

  // Day/night overlay
  if (dayNight !== 0.5) {
    const nightAlpha = dayNight < 0.5 ? (0.5 - dayNight) * 0.6 : 0;
    const dayAlpha = dayNight > 0.5 ? (dayNight - 0.5) * 0.15 : 0;
    if (nightAlpha > 0) {
      ctx.fillStyle = `rgba(5,5,30,${nightAlpha.toFixed(3)})`;
      ctx.fillRect(0, 0, w, h);
    }
    if (dayAlpha > 0) {
      ctx.fillStyle = `rgba(255,240,200,${dayAlpha.toFixed(3)})`;
      ctx.fillRect(0, 0, w, h);
    }
  }
}

// ─── React Component ──────────────────────────────────────────────────────
interface Props {
  width: number;
  height: number;
  zoom: number;
  vegRatio: number;
  targets: Record<EntityType, number>;
  paused: boolean;
  dayNight: number; // 0 = midnight, 0.5 = noon, 1 = midnight
  showHeatmap: boolean;
  speed: number;
  onStatsChange: (stats: { congestion: number; avgSpeed: number; efficiency: number; total: number }) => void;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  onEntityClick?: (entity: { type: EntityType; speed: number; x: number; y: number; color: string; fromId: string; toId: string } | null) => void;
}

export default function CanvasSimGrid({
  width,
  height,
  zoom,
  vegRatio,
  targets,
  paused,
  dayNight,
  showHeatmap,
  speed,
  onStatsChange,
  canvasRef: externalCanvasRef,
  onEntityClick,
}: Props) {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = externalCanvasRef || internalCanvasRef;
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const accumulatorRef = useRef<number>(0);
  const dirtyRef = useRef(true);
  const renderDirtyRef = useRef(true);

  const FIXED_DT = 1000 / 60; // 60Hz logic tick

  // Speed multiplier from props — affects how many logic ticks run per frame
  const speedMultiplierRef = useRef(1);

  const updateVeg = useCallback(() => {
    simHexes = _base!.map(h => ({
      ...h,
      type: h.seed < vegRatio ? "vegetation" : "building",
    }));
    const typeSig = simHexes.map(h => h.type[0]).join("");
    if (typeSig !== lastHexTypes) {
      lastHexTypes = typeSig;
      buildHexPolygons();
      renderOffscreen();
      renderDirtyRef.current = true;
    }
  }, [vegRatio]);

  useEffect(() => {
    initGrid(width, height);
    simNodes = _nodes!;
    simTargets = targets;
    simPaused = paused;
    simVegRatio = vegRatio;
    updateVeg();
    dirtyRef.current = true;
  }, [width, height, vegRatio, paused]);

  useEffect(() => {
    simTargets = targets;
  }, [targets]);

  useEffect(() => {
    simPaused = paused;
  }, [paused]);

  useEffect(() => {
    simSpeedMultiplier = speed;
  }, [speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Setup offscreen canvas
    offscreenCanvas = new OffscreenCanvas(width, height);
    offscreenCtx = offscreenCanvas.getContext("2d");
    if (offscreenCtx) {
      offscreenCanvas.width = width;
      offscreenCanvas.height = height;
    }

    buildHexPolygons();
    renderOffscreen();
    renderDirtyRef.current = true;

    // Main loop with fixed timestep
    const loop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;
      accumulatorRef.current += Math.min(dt, 100); // cap to prevent spiral

      let logicRan = false;
      while (accumulatorRef.current >= FIXED_DT) {
        tickLogic();
        accumulatorRef.current -= FIXED_DT;
        logicRan = true;
        renderDirtyRef.current = true;
      }

      if (renderDirtyRef.current || dirtyRef.current) {
        renderFrame(ctx, zoom, dayNight, showHeatmap);
        renderDirtyRef.current = false;
        dirtyRef.current = false;

        // Report stats every ~30 frames
        if (simTick % 30 === 0) {
          let total = 0;
          for (let i = 0; i < entityPool.length; i++) {
            if (entityPool[i].active) total++;
          }
          onStatsChange({
            congestion: simCongestion,
            avgSpeed: simAvgSpeed,
            efficiency: simEfficiency,
            total,
          });
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    // Entity click handler
    const handleClick = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas || !onEntityClick) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top) * scaleY;

      // Transform to world coordinates
      const wx = (mx - width / 2) / zoom + width / 2;
      const wy = (my - height / 2) / zoom + height / 2;

      let closest: typeof entityPool[number] | null = null;
      let closestDist = 15; // picking radius
      let closestId = -1;

      for (let i = 0; i < entityPool.length; i++) {
        const ent = entityPool[i];
        if (!ent.active) continue;
        const p = EPROPS[ent.type];
        const dist = Math.hypot(ent.x - wx, ent.y - wy);
        if (dist < closestDist) {
          closestDist = dist;
          closest = ent;
          closestId = ent.id;
        }
      }

      if (closest) {
        selectedEntityId = closestId.toString();
        onEntityClick({
          type: closest.type,
          speed: Math.round(EPROPS[closest.type].speed * 1800),
          x: Math.round(closest.x),
          y: Math.round(closest.y),
          color: closest.color,
          fromId: closest.fromId,
          toId: closest.toId,
        });
      } else {
        onEntityClick(null);
      }
    };

    canvasRef.current?.addEventListener("click", handleClick);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      canvasRef.current?.removeEventListener("click", handleClick);
    };
  }, [canvasRef, width, height, zoom, dayNight, showHeatmap, onStatsChange, onEntityClick]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}

// ─── Public API (compatible with old interface) ──────────────────────────
export function createInitialState(svgW: number, svgH: number, vegRatio = 0.3): SimState {
  initGrid(svgW, svgH);
  simHexes = _base!.map(h => ({ ...h, type: h.seed < vegRatio ? "vegetation" : "building" }));
  simNodes = _nodes!;
  simTick = 0;
  simCongestion = 0;
  simAvgSpeed = 0;
  simEfficiency = 100;
  buildHexPolygons();
  return {
    hexes: simHexes,
    nodes: simNodes,
    entities: [],
    tick: simTick,
    congestion: simCongestion,
    avgSpeed: simAvgSpeed,
    efficiency: simEfficiency,
  };
}

export function updateVegRatio(state: SimState, vegRatio: number): SimState {
  simVegRatio = vegRatio;
  simHexes = _base!.map(h => ({ ...h, type: h.seed < vegRatio ? "vegetation" : "building" }));
  lastHexTypes = ""; // force rebuild
  return { ...state, hexes: simHexes };
}

export function tickSimulation(state: SimState, targets: Record<EntityType, number>): SimState {
  // Compatibility shim — not used by new component but kept for old interface
  return state;
}

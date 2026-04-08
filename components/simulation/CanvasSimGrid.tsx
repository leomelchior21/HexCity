"use client";

import { useRef, useEffect, useCallback } from "react";

// ─── Geometry constants ──────────────────────────────────────────────────
const R = 44;
const R_DRAW = 34;
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
    r: 1.0,
    colors: ["#f8fafc", "#e2e8f0", "#94a3b8", "#cbd5e1"],
    speed: 0.00192, // ~4 km/h (20% slower)
    bias: 0.28,
    trailColor: "rgba(200,210,220,",
    glowSize: 0,
  },
  bike: {
    r: 1.0,
    colors: ["#22c55e", "#4ade80", "#86efac", "#a3e635"],
    speed: 0.005, // ~15 km/h
    bias: 0.55,
    trailColor: "rgba(34,197,94,",
    glowSize: 0,
  },
  car: {
    r: 2.52,
    colors: ["#ef4444", "#dc2626", "#f87171", "#fca5a5"],
    speed: 0.012, // ~50 km/h
    bias: 0.72,
    trailColor: "rgba(239,68,68,",
    glowSize: 0,
  },
  bus: {
    r: 3.6,
    colors: ["#facc15", "#fbbf24", "#fde047", "#eab308"],
    speed: 0.008, // ~25 km/h
    bias: 0.82,
    trailColor: "rgba(245,158,11,",
    glowSize: 0,
  },
};

// ─── Lane offsets (pixels right of travel direction) ─────────────────────
// Apothem gap per side = (R - R_DRAW) * √3/2 ≈ 8.66px — keep within that
const LANE_OFFSET: Record<EntityType, number> = {
  pedestrian: 7.5, // sidewalk, outermost
  bike:       3.0, // bike lane (right of center, left of car lane)
  car:        0,   // center lane
  bus:        0,   // center lane
};

// ─── Roundabout constants ─────────────────────────────────────────────────
const ROUNDABOUT_R     = 5;    // visual circle radius
const ROUNDABOUT_BLEND = 0.28; // fraction of edge where curving starts

// ─── Rounded-rect helper (avoids ctx.roundRect browser compat issues) ────
function drawRoundRect(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  const minR = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + minR, y);
  ctx.arcTo(x + w, y,     x + w, y + h, minR);
  ctx.arcTo(x + w, y + h, x,     y + h, minR);
  ctx.arcTo(x,     y + h, x,     y,     minR);
  ctx.arcTo(x,     y,     x + w, y,     minR);
  ctx.closePath();
}

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
      speed: 0.012,
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
  // Pedestrians walk at fixed pace; others get slight random variation
  e.speed = type === "pedestrian" ? p.speed : p.speed * (0.75 + Math.random() * 0.5);
  e.dirX = dx / len;
  e.dirY = dy / len;
  e.trail = [];
  e.active = true;
}

function tickLogic() {
  if (simPaused) { simTick++; return; }
  const ticks = Math.max(1, Math.round(simSpeedMultiplier));
  for (let t = 0; t < ticks; t++) {
    simTick++;
    tickStep(simNodes);
  }

  let total = 0, speedSum = 0;
  for (let i = 0; i < entityPool.length; i++) {
    if (entityPool[i].active) { total++; speedSum += EPROPS[entityPool[i].type].speed; }
  }
  simCongestion = Math.min(100, Math.round((total / 80) * 100));
  simAvgSpeed   = total === 0 ? 0 : Math.round((speedSum / total) * 1800);
  simEfficiency = Math.min(100, Math.max(0, 100 - Math.round(simCongestion * 0.35)));
}

function tickStep(nodes: Record<string, { id: string; x: number; y: number; neighbors: string[] }>) {
  for (let i = 0; i < entityPool.length; i++) {
    const e = entityPool[i];
    if (!e.active) continue;
    const from = nodes[e.fromId];
    const to   = nodes[e.toId];
    if (!from || !to) { e.active = false; continue; }

    // ── Car-following braking ─────────────────────────────────────────────
    let advance = e.speed;
    if (e.type === "pedestrian") {
      // Slight hesitation near intersections (progress 0.88–1.0) — slows but never stops
      if (e.progress > 0.88) {
        const t = (e.progress - 0.88) / 0.12; // 0→1
        advance *= Math.max(0.35, 1 - t * 0.65);
      }
    }
    if (e.type === "car" || e.type === "bus") {
      let minGap = 1.0;
      for (let j = 0; j < entityPool.length; j++) {
        if (j === i || !entityPool[j].active) continue;
        const oth = entityPool[j];
        if (oth.fromId !== e.fromId || oth.toId !== e.toId) continue;
        if (oth.progress <= e.progress) continue;
        const gap = oth.progress - e.progress;
        if (gap < minGap) { minGap = gap; if (minGap < 0.05) break; }
      }
      const SAFE = 0.08, BRAKE = 0.16;
      if (minGap < SAFE)        advance = 0;
      else if (minGap < BRAKE)  advance *= (minGap - SAFE) / (BRAKE - SAFE);
    }

    e.progress += advance;

    if (e.progress >= 1) {
      const cands = to.neighbors.filter(id => id !== e.fromId);
      const pool2 = cands.length ? cands : to.neighbors;
      let nextId: string;
      if (pool2.length === 1) {
        nextId = pool2[0];
      } else if (e.type === "pedestrian" && pool2.length >= 2) {
        // Pedestrians prefer to follow the hex edge (turn) over crossing the street
        // Sort candidates by dot product (ascending) — lowest dot = biggest turn = following hex edge
        const scored = pool2.map(id => {
          const n = nodes[id];
          const ddx = n.x - to.x, ddy = n.y - to.y;
          const ll = Math.hypot(ddx, ddy) || 1;
          const dot = (ddx / ll) * e.dirX + (ddy / ll) * e.dirY;
          return { id, dot };
        }).sort((a, b) => a.dot - b.dot);
        // 65% chance: follow edge (lowest dot), 35% chance: cross street (random from rest)
        nextId = Math.random() < 0.65 ? scored[0].id : scored[Math.floor(1 + Math.random() * (scored.length - 1))].id;
      } else {
        const bias = EPROPS[e.type].bias;
        let bestId = pool2[0], bestScore = -999;
        for (let j = 0; j < pool2.length; j++) {
          const n = nodes[pool2[j]];
          const ddx = n.x - to.x, ddy = n.y - to.y;
          const ll = Math.hypot(ddx, ddy) || 1;
          const dot = (ddx / ll) * e.dirX + (ddy / ll) * e.dirY;
          const score = dot * bias + Math.random() * (1 - bias);
          if (score > bestScore) { bestScore = score; bestId = pool2[j]; }
        }
        nextId = bestId;
      }
      const nxt = nodes[nextId];
      const ddx = nxt.x - to.x, ddy = nxt.y - to.y;
      const ll = Math.hypot(ddx, ddy) || 1;
      e.trail.push({ x: e.x, y: e.y, age: 0 });
      if (e.trail.length > 8) e.trail.shift();
      e.fromId = e.toId;
      e.toId   = nextId;
      e.progress = 0;
      e.x = to.x; e.y = to.y;
      e.dirX = ddx / ll; e.dirY = ddy / ll;
    } else {
      e.x = from.x + (to.x - from.x) * e.progress;
      e.y = from.y + (to.y - from.y) * e.progress;
    }
  }

  // Spawn / despawn
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
        for (let i = 0; i < diff; i++) spawnEntity(type);
      } else if (diff < 0) {
        let removed = 0;
        for (let i = entityPool.length - 1; i >= 0 && removed < -diff; i--) {
          if (entityPool[i].active && entityPool[i].type === type) {
            entityPool[i].active = false;
            removed++;
          }
        }
      }
    }
    simPrevTargets = { ...simTargets };
  }

  let total = 0, speedSum = 0;
  for (let i = 0; i < entityPool.length; i++) {
    if (entityPool[i].active) { total++; speedSum += EPROPS[entityPool[i].type].speed; }
  }
  simCongestion = Math.min(100, Math.round((total / 80) * 100));
  simAvgSpeed   = total === 0 ? 0 : Math.round((speedSum / total) * 1800);
  simEfficiency = Math.min(100, Math.max(0, 100 - Math.round(simCongestion * 0.35)));
}

let selectedEntityId: string | null = null;
export function setSelectedEntityId(id: string | null) { selectedEntityId = id; }

let hexPolygons: { points: [number, number][]; x: number; y: number; type: HexType }[] = [];
let offscreenCanvas: OffscreenCanvas | null = null;
let offscreenCtx: OffscreenCanvasRenderingContext2D | null = null;
let lastHexTypes = "";

function buildHexPolygons() {
  hexPolygons = simHexes.map(h => ({
    points: hexVerts(h.x, h.y, R_DRAW).map(([x, y]) => [x, y]),
    x: h.x, y: h.y, type: h.type,
  }));
}

// ─── Street markings + roundabouts (baked into offscreen layer) ───────────
function renderStreetMarkings(ctx: OffscreenCanvasRenderingContext2D) {
  const nodeIds = Object.keys(simNodes);
  if (!nodeIds.length) return;

  const visited = new Set<string>();
  for (const nodeId of nodeIds) {
    const node = simNodes[nodeId];
    for (const neighborId of node.neighbors) {
      const edgeKey = nodeId < neighborId
        ? `${nodeId}|${neighborId}`
        : `${neighborId}|${nodeId}`;
      if (visited.has(edgeKey)) continue;
      visited.add(edgeKey);

      const nb = simNodes[neighborId];
      if (!nb) continue;
      const dx = nb.x - node.x, dy = nb.y - node.y;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len, uy = dy / len; // unit along edge
      const nx = -uy, ny = ux;            // left-normal of edge

      // Shorten edge ends — leave room for roundabout circles
      const skip = ROUNDABOUT_R + 2;
      const fx = node.x + ux * skip, fy = node.y + uy * skip;
      const tx = nb.x   - ux * skip, ty = nb.y   - uy * skip;

      // Sidewalk lines — both sides
      ctx.setLineDash([]);
      ctx.strokeStyle = "rgba(160,175,210,0.35)";
      ctx.lineWidth = 1.2;
      for (const s of [1, -1]) {
        ctx.beginPath();
        ctx.moveTo(fx + nx * 8.5 * s, fy + ny * 8.5 * s);
        ctx.lineTo(tx + nx * 8.5 * s, ty + ny * 8.5 * s);
        ctx.stroke();
      }

      // Bike lane dashes — green, both sides
      ctx.setLineDash([4, 7]);
      ctx.strokeStyle = "rgba(34,197,94,0.55)";
      ctx.lineWidth = 1.2;
      for (const s of [1, -1]) {
        ctx.beginPath();
        ctx.moveTo(fx + nx * 3.5 * s, fy + ny * 3.5 * s);
        ctx.lineTo(tx + nx * 3.5 * s, ty + ny * 3.5 * s);
        ctx.stroke();
      }

      // Center dashed line — white
      ctx.setLineDash([5, 7]);
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(tx, ty);
      ctx.stroke();

      ctx.setLineDash([]);
    }
  }

  // ── Roundabout circles at every graph node ────────────────────────────
  for (const nodeId of nodeIds) {
    const n = simNodes[nodeId];
    // Outer ring (asphalt)
    ctx.beginPath();
    ctx.arc(n.x, n.y, ROUNDABOUT_R, 0, Math.PI * 2);
    ctx.fillStyle = "#090d18";
    ctx.fill();
    ctx.strokeStyle = "rgba(140,160,210,0.18)";
    ctx.lineWidth = 0.8;
    ctx.stroke();
    // Inner island (tiny green)
    ctx.beginPath();
    ctx.arc(n.x, n.y, ROUNDABOUT_R * 0.42, 0, Math.PI * 2);
    ctx.fillStyle = "#0d1f14";
    ctx.fill();
  }
}

// ─── Offscreen hex grid render ────────────────────────────────────────────
function renderOffscreen() {
  if (!offscreenCtx || !offscreenCanvas) return;
  const ctx = offscreenCtx;
  const w = offscreenCanvas.width, h = offscreenCanvas.height;
  ctx.clearRect(0, 0, w, h);

  for (let i = 0; i < hexPolygons.length; i++) {
    const hex = hexPolygons[i];
    const isVeg = hex.type === "vegetation";
    const pts = hex.points;

    ctx.beginPath();
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
      ctx.fillStyle = "#0e1a32";
      ctx.fill();
      ctx.strokeStyle = "rgba(59,130,246,0.28)";
      ctx.lineWidth = 1;
      ctx.stroke();
      // Extruded top face
      const topOff = -4;
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1] + topOff);
      for (let j = 1; j < pts.length; j++) ctx.lineTo(pts[j][0], pts[j][1] + topOff);
      ctx.closePath();
      ctx.fillStyle = "rgba(30,50,80,0.6)";
      ctx.fill();
      ctx.strokeStyle = "rgba(59,130,246,0.15)";
      ctx.lineWidth = 0.5;
      ctx.stroke();
      // Side faces
      for (let j = 0; j < pts.length; j++) {
        const nxt = (j + 1) % pts.length;
        ctx.beginPath();
        ctx.moveTo(pts[j][0],   pts[j][1]);
        ctx.lineTo(pts[nxt][0], pts[nxt][1]);
        ctx.lineTo(pts[nxt][0], pts[nxt][1] + topOff);
        ctx.lineTo(pts[j][0],   pts[j][1]   + topOff);
        ctx.closePath();
        ctx.fillStyle = j % 2 === 0 ? "rgba(15,25,50,0.5)" : "rgba(20,35,65,0.4)";
        ctx.fill();
      }
    }

    if (isVeg) {
      ctx.font = "16px serif";
      ctx.textAlign = "center";
      ctx.fillText("🌿", hex.x, hex.y + 6);
    }
  }

  // Street markings + roundabouts on top of hexes
  renderStreetMarkings(ctx);
}

// ─── Main render frame ────────────────────────────────────────────────────
function renderFrame(
  ctx: CanvasRenderingContext2D,
  zoom: number,
  dayNight: number,
  showHeatmap: boolean
) {
  const w = ctx.canvas.width, h = ctx.canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#06080e";
  ctx.fillRect(0, 0, w, h);

  // Zoom transform
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.scale(zoom, zoom);
  ctx.translate(-w / 2, -h / 2);

  if (offscreenCanvas) ctx.drawImage(offscreenCanvas, 0, 0);

  // Heatmap overlay
  if (showHeatmap) {
    for (let i = 0; i < entityPool.length; i++) {
      const e = entityPool[i];
      if (!e.active) continue;
      const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, 20);
      const intensity = e.type === "car" || e.type === "bus" ? 0.4 : 0.2;
      g.addColorStop(0, `rgba(239,68,68,${intensity})`);
      g.addColorStop(1, "rgba(239,68,68,0)");
      ctx.fillStyle = g;
      ctx.fillRect(e.x - 20, e.y - 20, 40, 40);
    }
  }

  // ─── PASS 1 — Trails (below entities for z-order) ───────────────────────
  for (let i = 0; i < entityPool.length; i++) {
    const e = entityPool[i];
    if (!e.active) continue;
    const p = EPROPS[e.type];
    if (p.glowSize === 0) continue;

    // Right-perpendicular for lane offset
    const rX = -e.dirY, rY = e.dirX;
    const lo = LANE_OFFSET[e.type];

    for (let t = 0; t < e.trail.length; t++) {
      const tr = e.trail[t];
      tr.age += 0.016;
      const alpha = Math.max(0, 1 - tr.age * 3);
      if (alpha <= 0) continue;
      ctx.beginPath();
      ctx.arc(tr.x + rX * lo, tr.y + rY * lo, p.r * 0.7 * alpha, 0, Math.PI * 2);
      ctx.fillStyle = p.trailColor + (alpha * 0.35).toFixed(3) + ")";
      ctx.fill();
    }
    e.trail = e.trail.filter(tr => tr.age < 0.4);
  }

  // ─── PASS 2 — Entities ──────────────────────────────────────────────────
  const time = Date.now() * 0.004;
  for (let i = 0; i < entityPool.length; i++) {
    const e = entityPool[i];
    if (!e.active) continue;
    const p = EPROPS[e.type];
    const isSelected = selectedEntityId === e.id.toString();

    // ── Lane offset: right-perpendicular of travel direction ──────────────
    const lo = LANE_OFFSET[e.type];
    const rX = -e.dirY; // right-perp X in screen coords
    const rY =  e.dirX; // right-perp Y in screen coords

    let vx = e.x + rX * lo;
    let vy = e.y + rY * lo;

    // ── Roundabout blend — only cars and buses curve around the island ──────
    if (e.type === "car" || e.type === "bus") {
      // Approach blend (progress → 1)
      const toNode = simNodes[e.toId];
      if (toNode) {
        const frac = 1 - e.progress;
        if (frac < ROUNDABOUT_BLEND) {
          const t = frac / ROUNDABOUT_BLEND;
          const eased = t * t;
          const orbitR = ROUNDABOUT_R + lo * 0.65;
          const entX = toNode.x + rX * orbitR;
          const entY = toNode.y + rY * orbitR;
          vx = entX + (vx - entX) * eased;
          vy = entY + (vy - entY) * eased;
        }
      }
      // Departure blend (progress → 0 on new edge)
      const fromNode = simNodes[e.fromId];
      if (fromNode) {
        const frac = e.progress;
        if (frac < ROUNDABOUT_BLEND) {
          const t = frac / ROUNDABOUT_BLEND;
          const eased = t * t;
          const orbitR = ROUNDABOUT_R + lo * 0.65;
          const extX = fromNode.x + rX * orbitR;
          const extY = fromNode.y + rY * orbitR;
          vx = extX + (vx - extX) * eased;
          vy = extY + (vy - extY) * eased;
        }
      }
    }

    // ── Selection ring ────────────────────────────────────────────────────
    if (isSelected) {
      const selR = (e.type === "bus" ? 10 : p.r) + 8 + Math.sin(time * 3) * 3;
      ctx.beginPath();
      ctx.arc(vx, vy, selR, 0, Math.PI * 2);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(vx, vy, selR + 4, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // ── Bus: elongated capsule ────────────────────────────────────────────
    if (e.type === "bus") {
      const busHL = 6.4;     // half-length (scaled with r)
      const busHW = p.r;     // half-width (= 3.6)
      const angle = Math.atan2(e.dirY, e.dirX);

      ctx.save();
      ctx.translate(vx, vy);
      ctx.rotate(angle);

      // Glow
      const gBus = ctx.createRadialGradient(0, 0, 0, 0, 0, busHL + p.glowSize);
      gBus.addColorStop(0, e.color + "28");
      gBus.addColorStop(1, e.color + "00");
      ctx.beginPath();
      ctx.ellipse(0, 0, busHL + p.glowSize, busHW + p.glowSize * 0.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = gBus;
      ctx.fill();

      // Body
      ctx.globalAlpha = 0.95;
      drawRoundRect(ctx, -busHL, -busHW, busHL * 2, busHW * 2, busHW);
      ctx.fillStyle = e.color;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Windows (centered vertically)
      ctx.fillStyle = "rgba(0,0,0,0.40)";
      const winY = -busHW * 0.45, winH = busHW * 0.9;
      for (let wx = -busHL + 2.5; wx < busHL - 3; wx += 4.5) {
        ctx.fillRect(wx, winY, 2.8, winH);
      }

      // Top shine
      ctx.globalAlpha = 0.18;
      drawRoundRect(ctx, -busHL + 1, -busHW + 1, (busHL - 1) * 2, busHW * 0.6, busHW - 1);
      ctx.fillStyle = "rgba(255,255,255,1)";
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.restore();

    } else {
      // ── Circle entities (car, bike, pedestrian) ───────────────────────────

      // Glow
      if (p.glowSize > 0) {
        const g = ctx.createRadialGradient(vx, vy, 0, vx, vy, p.r + p.glowSize);
        g.addColorStop(0, e.color + "30");
        g.addColorStop(1, e.color + "00");
        ctx.beginPath();
        ctx.arc(vx, vy, p.r + p.glowSize, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }

      // Body
      ctx.beginPath();
      ctx.arc(vx, vy, p.r, 0, Math.PI * 2);
      ctx.fillStyle = e.color;
      ctx.globalAlpha = e.type === "pedestrian" ? 0.75 : 0.95;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Inner highlight
      ctx.beginPath();
      ctx.arc(vx - p.r * 0.2, vy - p.r * 0.2, p.r * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fill();
    }
  }

  ctx.restore();

  // Day/night overlay
  if (dayNight !== 0.5) {
    const nightAlpha = dayNight < 0.5 ? (0.5 - dayNight) * 0.6 : 0;
    const dayAlpha   = dayNight > 0.5 ? (dayNight - 0.5) * 0.15 : 0;
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
  dayNight: number;
  showHeatmap: boolean;
  speed: number;
  onStatsChange: (stats: { congestion: number; avgSpeed: number; efficiency: number; total: number }) => void;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  onEntityClick?: (entity: { type: EntityType; speed: number; x: number; y: number; color: string; fromId: string; toId: string } | null) => void;
}

export default function CanvasSimGrid({
  width, height, zoom, vegRatio, targets, paused,
  dayNight, showHeatmap, speed,
  onStatsChange, canvasRef: externalCanvasRef, onEntityClick,
}: Props) {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = externalCanvasRef || internalCanvasRef;
  const animFrameRef    = useRef<number>(0);
  const lastTimeRef     = useRef<number>(0);
  const accumulatorRef  = useRef<number>(0);
  const dirtyRef        = useRef(true);
  const renderDirtyRef  = useRef(true);

  const FIXED_DT = 1000 / 60;

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
    simNodes    = _nodes!;
    simTargets  = targets;
    simPaused   = paused;
    simVegRatio = vegRatio;
    updateVeg();
    dirtyRef.current = true;
  }, [width, height, vegRatio, paused]);

  useEffect(() => { simTargets = targets; }, [targets]);
  useEffect(() => { simPaused  = paused;  }, [paused]);
  useEffect(() => { simSpeedMultiplier = speed; }, [speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    offscreenCanvas = new OffscreenCanvas(width, height);
    offscreenCtx    = offscreenCanvas.getContext("2d");
    if (offscreenCtx) {
      offscreenCanvas.width  = width;
      offscreenCanvas.height = height;
    }

    buildHexPolygons();
    renderOffscreen();
    renderDirtyRef.current = true;

    const loop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;
      accumulatorRef.current += Math.min(dt, 100);

      while (accumulatorRef.current >= FIXED_DT) {
        tickLogic();
        accumulatorRef.current -= FIXED_DT;
        renderDirtyRef.current = true;
      }

      if (renderDirtyRef.current || dirtyRef.current) {
        renderFrame(ctx, zoom, dayNight, showHeatmap);
        renderDirtyRef.current = false;
        dirtyRef.current = false;

        if (simTick % 30 === 0) {
          let total = 0;
          for (let i = 0; i < entityPool.length; i++) {
            if (entityPool[i].active) total++;
          }
          onStatsChange({ congestion: simCongestion, avgSpeed: simAvgSpeed, efficiency: simEfficiency, total });
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    const handleClick = (ev: MouseEvent) => {
      const c = canvasRef.current;
      if (!c || !onEntityClick) return;
      const rect   = c.getBoundingClientRect();
      const scaleX = c.width / rect.width;
      const scaleY = c.height / rect.height;
      const mx = (ev.clientX - rect.left) * scaleX;
      const my = (ev.clientY - rect.top)  * scaleY;
      const wx = (mx - width / 2)  / zoom + width / 2;
      const wy = (my - height / 2) / zoom + height / 2;

      let closest: typeof entityPool[number] | null = null;
      let closestDist = 15, closestId = -1;
      for (let i = 0; i < entityPool.length; i++) {
        const ent = entityPool[i];
        if (!ent.active) continue;
        const dist = Math.hypot(ent.x - wx, ent.y - wy);
        if (dist < closestDist) { closestDist = dist; closest = ent; closestId = ent.id; }
      }

      if (closest) {
        selectedEntityId = closestId.toString();
        onEntityClick({
          type: closest.type,
          speed: Math.round(EPROPS[closest.type].speed * 1800),
          x: Math.round(closest.x), y: Math.round(closest.y),
          color: closest.color,
          fromId: closest.fromId, toId: closest.toId,
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

// ─── Public API (compat shim) ─────────────────────────────────────────────
export function createInitialState(svgW: number, svgH: number, vegRatio = 0.3): SimState {
  initGrid(svgW, svgH);
  simHexes = _base!.map(h => ({ ...h, type: h.seed < vegRatio ? "vegetation" : "building" }));
  simNodes = _nodes!;
  simTick = 0; simCongestion = 0; simAvgSpeed = 0; simEfficiency = 100;
  buildHexPolygons();
  return { hexes: simHexes, nodes: simNodes, entities: [], tick: simTick, congestion: simCongestion, avgSpeed: simAvgSpeed, efficiency: simEfficiency };
}

export function updateVegRatio(state: SimState, vegRatio: number): SimState {
  simVegRatio = vegRatio;
  simHexes = _base!.map(h => ({ ...h, type: h.seed < vegRatio ? "vegetation" : "building" }));
  lastHexTypes = "";
  return { ...state, hexes: simHexes };
}

export function tickSimulation(state: SimState, _targets: Record<EntityType, number>): SimState {
  return state;
}

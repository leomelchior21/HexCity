"use client";

// ─── Geometry constants ──────────────────────────────────────────────────
const R = 44;        // circumradius — used for street graph node positions
const R_DRAW = 34;   // visual polygon radius — gap between hexes ≈ 17px (streets)
const H_HEX = R * Math.sqrt(3);
const COL_STEP = R * 1.5;
const ROW_STEP = H_HEX;
const COL_OFFSET = H_HEX / 2;
const NCOLS = 10;
const NROWS = 6;

function hexCenter(col: number, row: number, ox: number, oy: number) {
  return {
    x: ox + col * COL_STEP + R,
    y: oy + row * ROW_STEP + (col % 2 === 1 ? COL_OFFSET : 0) + H_HEX / 2,
  };
}

// Flat-top hex vertices at 0°, 60°, 120°, 180°, 240°, 300°
function hexVerts(cx: number, cy: number, r = R): [number, number][] {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as [number, number];
  });
}

function hexPts(cx: number, cy: number): string {
  return hexVerts(cx, cy, R_DRAW)
    .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
}

// Round to nearest integer for stable node deduplication
function nid(x: number, y: number): string {
  return `${Math.round(x)},${Math.round(y)}`;
}

// ─── Types ───────────────────────────────────────────────────────────────
type HexType = "building" | "vegetation";
export type EntityType = "pedestrian" | "bike" | "car" | "bus";

export interface HexCell {
  col: number;
  row: number;
  id: string;
  type: HexType;
  seed: number;
  x: number;
  y: number;
}

export interface StreetNode {
  id: string;
  x: number;
  y: number;
  neighbors: string[];
}

export interface Entity {
  id: string;
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
}

export interface SimState {
  hexes: HexCell[];
  nodes: Record<string, StreetNode>;
  entities: Entity[];
  paused: boolean;
  tick: number;
  congestion: number;
  avgSpeed: number;
  efficiency: number;
}

// ─── Module-level cache (positions & graph never change after init) ───────
type HexBase = Omit<HexCell, "type">;
let _base: HexBase[] | null = null;
let _nodes: Record<string, StreetNode> | null = null;

function initGrid(svgW: number, svgH: number) {
  if (_base) return;

  const gridW = NCOLS * COL_STEP + R;
  const gridH = NROWS * ROW_STEP + COL_OFFSET;
  const ox = (svgW - gridW) / 2;
  const oy = (svgH - gridH) / 2;

  // Deterministic LCG for stable seeds across renders
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

  // Build street graph from hex vertices
  // Interior vertices are shared by 3 hexes → 3-way T-intersections
  // Entities walk node-to-node along these edges (the street network)
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

// ─── Public API ───────────────────────────────────────────────────────────
export function createInitialState(svgW: number, svgH: number, vegRatio = 0.3): SimState {
  initGrid(svgW, svgH);
  return {
    hexes: _base!.map(h => ({ ...h, type: h.seed < vegRatio ? "vegetation" : "building" })),
    nodes: _nodes!,
    entities: [],
    paused: false,
    tick: 0,
    congestion: 0,
    avgSpeed: 0,
    efficiency: 100,
  };
}

export function updateVegRatio(state: SimState, vegRatio: number): SimState {
  return {
    ...state,
    hexes: state.hexes.map(h => ({
      ...h,
      type: h.seed < vegRatio ? "vegetation" : "building",
    })),
  };
}

// ─── Entity properties ────────────────────────────────────────────────────
const EPROPS: Record<EntityType, {
  r: number;
  colors: string[];
  speed: number;
  bias: number; // 0=random turns, 1=always straight
}> = {
  pedestrian: {
    r: 2,
    colors: ["#f8fafc", "#e2e8f0", "#94a3b8", "#cbd5e1"],
    speed: 0.012,
    bias: 0.28,
  },
  bike: {
    r: 2.5,
    colors: ["#22c55e", "#4ade80", "#86efac", "#a3e635"],
    speed: 0.022,
    bias: 0.55,
  },
  car: {
    r: 3.5,
    colors: ["#ef4444", "#f97316", "#06b6d4", "#8b5cf6", "#ec4899", "#eab308"],
    speed: 0.038,
    bias: 0.72,
  },
  bus: {
    r: 5,
    colors: ["#f59e0b", "#fbbf24", "#fb923c"],
    speed: 0.028,
    bias: 0.82,
  },
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function spawnOne(
  nodes: Record<string, StreetNode>,
  entities: Entity[],
  type: EntityType
): Entity[] {
  // Only spawn at T-intersections (3+ neighbors) so entities have routing choices
  const ids = Object.keys(nodes).filter(id => nodes[id].neighbors.length >= 3);
  if (!ids.length) return entities;

  const fromId = pick(ids);
  const from = nodes[fromId];
  const toId = pick(from.neighbors);
  const to = nodes[toId];
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const p = EPROPS[type];

  return [
    ...entities,
    {
      id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type,
      fromId,
      toId,
      progress: 0,
      x: from.x,
      y: from.y,
      color: pick(p.colors),
      speed: p.speed * (0.75 + Math.random() * 0.5),
      dirX: dx / len,
      dirY: dy / len,
    },
  ];
}

// ─── Simulation tick ──────────────────────────────────────────────────────
export function tickSimulation(
  state: SimState,
  targets: Record<EntityType, number>
): SimState {
  if (state.paused) return { ...state, tick: state.tick + 1 };

  const { nodes } = state;
  const tick = state.tick + 1;

  // Move all entities along the street graph
  let entities: Entity[] = state.entities.map(e => {
    const from = nodes[e.fromId];
    const to = nodes[e.toId];
    if (!from || !to) return e;

    const progress = e.progress + e.speed;

    if (progress >= 1) {
      // Arrived at node — pick next with direction bias for organic flow
      const cands = to.neighbors.filter(id => id !== e.fromId);
      const pool = cands.length ? cands : to.neighbors;

      let nextId: string;
      if (pool.length === 1) {
        nextId = pool[0];
      } else {
        const bias = EPROPS[e.type].bias;
        const scored = pool.map(id => {
          const n = nodes[id];
          const dx = n.x - to.x;
          const dy = n.y - to.y;
          const len = Math.hypot(dx, dy) || 1;
          const dot = (dx / len) * e.dirX + (dy / len) * e.dirY;
          // dot = 1 means same direction, -1 means U-turn
          return { id, score: dot * bias + Math.random() * (1 - bias) };
        });
        scored.sort((a, b) => b.score - a.score);
        nextId = scored[0].id;
      }

      const nxt = nodes[nextId];
      const dx = nxt.x - to.x;
      const dy = nxt.y - to.y;
      const len = Math.hypot(dx, dy) || 1;
      return {
        ...e,
        fromId: e.toId,
        toId: nextId,
        progress: 0,
        x: to.x,
        y: to.y,
        dirX: dx / len,
        dirY: dy / len,
      };
    }

    // Linear interpolation along street edge
    return {
      ...e,
      progress,
      x: from.x + (to.x - from.x) * progress,
      y: from.y + (to.y - from.y) * progress,
    };
  });

  // Auto-spawn / despawn every 15 ticks to match target counts
  if (tick % 15 === 0) {
    for (const type of ["car", "bus", "bike", "pedestrian"] as EntityType[]) {
      const target = targets[type] ?? 0;
      let current = entities.filter(e => e.type === type).length;
      const diff = Math.abs(target - current);
      const batch = Math.min(diff, Math.max(1, Math.ceil(diff / 3)));

      if (current < target) {
        for (let i = 0; i < batch; i++) {
          entities = spawnOne(nodes, entities, type);
          current++;
        }
      } else if (current > target) {
        for (let i = 0; i < batch && current > target; i++) {
          const idx = entities.map(e => e.type).lastIndexOf(type);
          if (idx !== -1) {
            entities = [...entities.slice(0, idx), ...entities.slice(idx + 1)];
            current--;
          }
        }
      }
    }
  }

  const total = entities.length;
  const congestion = Math.min(100, Math.round((total / 80) * 100));
  const avgSpeed =
    total === 0
      ? 0
      : Math.round(
          (entities.reduce((s, e) => s + EPROPS[e.type].speed, 0) / total) * 1800
        );
  const efficiency = Math.min(100, Math.max(0, 100 - Math.round(congestion * 0.35)));

  return { ...state, entities, tick, congestion, avgSpeed, efficiency };
}

// ─── Render ───────────────────────────────────────────────────────────────
const HEX_STYLE: Record<HexType, { fill: string; stroke: string }> = {
  building:   { fill: "#0e1a32", stroke: "rgba(59,130,246,0.28)" },
  vegetation: { fill: "#0a2015", stroke: "rgba(34,197,94,0.28)"  },
};

interface Props {
  state: SimState;
  width: number;
  height: number;
  zoom: number;
}

export default function HexSimGrid({ state, width, height, zoom }: Props) {
  const vw = width / zoom;
  const vh = height / zoom;
  const vx = (width - vw) / 2;
  const vy = (height - vh) / 2;

  return (
    <svg
      viewBox={`${vx.toFixed(0)} ${vy.toFixed(0)} ${vw.toFixed(0)} ${vh.toFixed(0)}`}
      width={width}
      height={height}
      className="w-full h-full"
      style={{ background: "#06080e" }}
    >
      {/* City blocks — dark fills with colored borders */}
      {state.hexes.map(h => {
        const st = HEX_STYLE[h.type];
        return (
          <g key={h.id}>
            <polygon
              points={hexPts(h.x, h.y)}
              fill={st.fill}
              stroke={st.stroke}
              strokeWidth="1"
            />
            {h.type === "vegetation" && (
              <text
                x={h.x}
                y={h.y + 6}
                textAnchor="middle"
                fontSize="16"
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                🌿
              </text>
            )}
          </g>
        );
      })}

      {/* Agents — walk along the street gaps between hex blocks */}
      {state.entities.map(e => {
        const p = EPROPS[e.type];
        return (
          <g key={e.id}>
            {(e.type === "car" || e.type === "bus") && (
              <circle cx={e.x} cy={e.y} r={p.r + 3} fill={e.color} opacity={0.1} />
            )}
            <circle
              cx={e.x}
              cy={e.y}
              r={p.r}
              fill={e.color}
              opacity={e.type === "pedestrian" ? 0.65 : 0.9}
              style={
                e.type !== "pedestrian"
                  ? { filter: `drop-shadow(0 0 ${p.r}px ${e.color}aa)` }
                  : undefined
              }
            />
          </g>
        );
      })}
    </svg>
  );
}

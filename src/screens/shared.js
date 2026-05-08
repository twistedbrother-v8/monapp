import React from "react";
import { TYPE_ICONS } from "../config/data";

export const C = {
  bg:       "#000000",
  surface:  "#3A3A40",
  surface2: "#2a2a2f",
  border:   "rgba(255,255,255,0.08)",
  blue:     "#2157FF",
  blueGlow: "rgba(33,87,255,0.15)",
  text:     "#ffffff",
  muted:    "#8e8e93",
  muted2:   "#aeaeb2",
  green:    "#89fc68",
  yellow:   "#ffb133",
  red:      "#fc3f35",
  purple:   "#bf5af2",
  orange:   "#ffb133",
};

export const card = (extra = {}) => ({
  background: C.surface, borderRadius: 16,
  border: `1px solid ${C.border}`, padding: "16px", marginBottom: 12, ...extra,
});

export const btn = (extra = {}) => ({
  background: C.blue, color: "white", border: "none",
  borderRadius: 14, padding: "15px 20px", fontSize: 15, fontWeight: 700,
  cursor: "pointer", width: "100%", display: "flex",
  alignItems: "center", justifyContent: "center", gap: 8,
  boxShadow: `0 4px 20px ${C.blue}55`, ...extra,
});

export const input = {
  width: "100%", background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10, padding: "0 14px", height: 44,
  color: C.text, fontSize: 14, boxSizing: "border-box",
  outline: "none", colorScheme: "dark", marginBottom: 10,
};

export const ITEM_COLORS = {
  huile: "#f97316", freins: "#ef4444", pneus: "#64748b",
  eclairage: "#eab308", batterie: "#22c55e", essuie: "#2157FF",
  suspension: "#8b5cf6", filtre: "#06b6d4", chaine: "#f97316",
  fixations: "#94a3b8", attelage: "#94a3b8",
  refroidissement: "#60a5fa", laveglace: "#38bdf8", liquidefrein: "#f43f5e",
  feuxavant: "#fbbf24", feuxarriere: "#f87171", clignotants: "#fb923c",
  clim: "#34d399",
};

export function VehicleChip({ v, active, setActive }) {
  const on = v.id === active?.id;
  return (
    <button onClick={() => setActive(v)} style={{
      flexShrink: 0, borderRadius: 20, padding: "7px 16px",
      fontSize: 13, cursor: "pointer", fontWeight: 700, border: "none",
      background: on ? C.green : C.blue,
      color: on ? "#000" : "white",
      boxShadow: on ? `0 2px 12px ${C.green}44` : `0 2px 8px ${C.blue}44`,
      transition: "all 0.2s",
    }}>
      {TYPE_ICONS[v.type]} {v.name}
    </button>
  );
}

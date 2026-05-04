import React from "react";
import { TYPE_ICONS, TYPE_LABELS } from "../config/data";
import { getProgress } from "../utils/helpers";

export function StatusDots({ ok, bientot, probleme }) {
  return (
    <div style={{ display: "flex", gap: 10, margin: "8px 0" }}>
      {[["#22c55e", ok], ["#f59e0b", bientot], ["#ef4444", probleme]].map(([c, on], i) => (
        <div key={i} style={{
          width: 52, height: 52, borderRadius: "50%",
          background: on ? c : "#22263a",
          border: `2px solid ${on ? c + "88" : "rgba(255,255,255,0.07)"}`,
          boxShadow: on ? `0 0 22px ${c}55` : "none",
          transition: "all 0.4s",
        }} />
      ))}
    </div>
  );
}

export function ProgressBar({ pct, verified, total }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>
        <span style={{ fontWeight: 700, letterSpacing: 1, fontSize: 11 }}>PROGRESSION</span>
        <span style={{ color: "white", fontWeight: 700 }}>{verified} / {total} vérifiés</span>
      </div>
      <div style={{ height: 8, background: "#22263a", borderRadius: 20, overflow: "hidden" }}>
        <div style={{
          width: pct + "%", height: "100%",
          background: "linear-gradient(90deg, #2563eb, #60a5fa)",
          boxShadow: "0 0 12px rgba(59,130,246,0.5)",
          borderRadius: 20, transition: "width 0.6s ease",
        }} />
      </div>
    </div>
  );
}

export function VehicleCard({ v, isActive, onClick, onDelete }) {
  const p = getProgress(v);
  return (
    <div onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "14px 16px", borderRadius: 16, marginBottom: 12,
      cursor: "pointer", transition: "all 0.25s",
      background: isActive ? "rgba(59,130,246,0.12)" : "#1a1d27",
      border: isActive ? "1px solid #3b82f6" : "1px solid rgba(255,255,255,0.07)",
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
        background: "#22263a",
      }}>
        {TYPE_ICONS[v.type]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#f1f5f9" }}>
          {v.name}
          {v.immat && (
            <span style={{
              fontSize: 11, marginLeft: 8, fontWeight: 600,
              color: "#3b82f6", background: "rgba(59,130,246,0.12)",
              padding: "2px 8px", borderRadius: 20,
            }}>{v.immat}</span>
          )}
        </div>
        <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>
          {TYPE_LABELS[v.type]} · {p.ok} OK
          {p.problems > 0 && <span style={{ color: "#ef4444", marginLeft: 4 }}>· {p.problems} problème{p.problems > 1 ? "s" : ""}</span>}
        </div>
        <div style={{ height: 3, background: "#22263a", borderRadius: 10, marginTop: 6, overflow: "hidden" }}>
          <div style={{
            width: p.pct + "%", height: "100%",
            background: isActive ? "linear-gradient(90deg,#3b82f6,#60a5fa)" : "#1e3a8a",
            borderRadius: 10, transition: "width 0.5s ease",
          }} />
        </div>
      </div>
      {isActive && (
        <button onClick={e => { e.stopPropagation(); onDelete(); }} style={{
          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
          color: "#ef4444", borderRadius: 10, width: 32, height: 32,
          fontSize: 14, cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>✕</button>
      )}
    </div>
  );
}
// src/screens/index.jsx
import React, { useState } from "react";
import { TYPE_ICONS, TYPE_LABELS, STATE_COLOR } from "../config/data";
import { getProgress } from "../utils/helpers";

const C = {
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

const card = (extra = {}) => ({
  background: C.surface, borderRadius: 16,
  border: `1px solid ${C.border}`, padding: "16px", marginBottom: 12, ...extra,
});

const btn = (extra = {}) => ({
  background: C.blue, color: "white", border: "none",
  borderRadius: 14, padding: "15px 20px", fontSize: 15, fontWeight: 700,
  cursor: "pointer", width: "100%", display: "flex",
  alignItems: "center", justifyContent: "center", gap: 8,
  boxShadow: `0 4px 20px ${C.blue}55`, ...extra,
});

const input = {
  width: "100%", background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10, padding: "0 14px", height: 44,
  color: C.text, fontSize: 14, boxSizing: "border-box",
  outline: "none", colorScheme: "dark", marginBottom: 10,
};

const ITEM_COLORS = {
  huile: "#f97316", freins: "#ef4444", pneus: "#64748b",
  eclairage: "#eab308", batterie: "#22c55e", essuie: "#2157FF",
  suspension: "#8b5cf6", filtre: "#06b6d4", chaine: "#f97316",
  fixations: "#94a3b8", attelage: "#94a3b8",
  refroidissement: "#60a5fa", laveglace: "#38bdf8", liquidefrein: "#f43f5e",
  feuxavant: "#fbbf24", feuxarriere: "#f87171", clignotants: "#fb923c",
  clim: "#34d399",
};

function VehicleChip({ v, active, setActive }) {
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

// ─── ACCUEIL ──────────────────────────────────────────────────────
export function AccueilScreen({ vehicles, setVehicles, active, setActive, setTab, name, setName, immat, setImmat, type, setType, addVehicle, deleteVehicle, leaveSharedVehicle, docs, prog, t = {} }) {
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editImmat, setEditImmat] = useState("");
  const [editType, setEditType] = useState("voiture");
  const [editKm, setEditKm] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const startEdit = () => {
    setEditName(active.name);
    setEditImmat(active.immat || "");
    setEditType(active.type);
    setEditKm(active.km || "");
    setEditMode(true);
  };

  const saveEdit = () => {
    if (!editName.trim()) return;
    setVehicles(prev => {
      const updated = prev.map(v => v.id === active.id ? { ...v, name: editName.trim(), immat: editImmat.trim().toUpperCase(), type: editType, km: editKm } : v);
      setActive(updated.find(v => v.id === active.id));
      return updated;
    });
    setEditMode(false);
  };
  if (!active) {
    return (
      <div style={{ padding: "20px 16px" }}>
        {vehicles.length === 0 && (
          <div style={{ background: "linear-gradient(135deg, #1a2a4a, #2157FF22)", border: `1px solid ${C.blue}33`, borderRadius: 18, padding: 20, marginBottom: 16, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🚗</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 6 }}>{t.bienvenue || "Bienvenue sur CHECKAR ! 🚗"}</div>
            <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{t.bienvenueMsg || "Commencez par ajouter votre véhicule pour suivre son entretien."}</div>
          </div>
        )}
        <div style={{ background: C.surface, borderRadius: 20, padding: 20, marginBottom: 16 }}>
          <p style={{ color: C.muted2, marginBottom: 16, marginTop: 0, fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>{t.ajouterVehicule || '+ AJOUTER UN VÉHICULE'}</p>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 6, fontWeight: 700 }}>TYPE</div>
          <select value={type} onChange={e => setType(e.target.value)} style={input}>
            <option value="voiture">🚘 Voiture</option>
            <option value="moto">🏍️ Moto</option>
          </select>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 6, fontWeight: 700 }}>NOM</div>
          <input style={input} value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Peugeot 208..." />
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 6, fontWeight: 700 }}>IMMATRICULATION</div>
          <input style={{ ...input, textTransform: "uppercase", letterSpacing: 2 }} value={immat} onChange={e => setImmat(e.target.value)} placeholder="AB-123-CD" />
          <button style={btn()} onClick={addVehicle}>+ Ajouter le véhicule</button>
        </div>
        {vehicles.map(v => {
          const p = getProgress(v);
          return (
            <div key={v.id} onClick={() => setActive(v)} style={{ background: C.surface, borderRadius: 16, padding: "14px 16px", marginBottom: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontSize: 36 }}>{TYPE_ICONS[v.type]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>{v.name}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{TYPE_LABELS[v.type]}{v.immat ? ` · ${v.immat}` : ""}</div>
                <div style={{ fontSize: 12, color: p.problems > 0 ? C.red : C.green, marginTop: 4, fontWeight: 600 }}>
                  {p.ok} OK{p.problems > 0 ? ` · ${p.problems} problème(s)` : " ·  Tout roule !"}
                </div>
              </div>
              <span style={{ color: C.muted, fontSize: 20 }}>›</span>
            </div>
          );
        })}
      </div>
    );
  }

  const vals       = Object.values(active.checks || {});
  const hasOk      = vals.includes("OK");
  const hasBientot = vals.includes("BIENTOT");
  const hasProb    = vals.includes("PROBLEME");
  const lastEntry  = active.history?.[active.history.length - 1];
  const alertDocs  = docs.filter(d => !active || d.vehicleId === active?.id);
  const kmTotal    = active.km ? parseInt(active.km).toLocaleString() : null;

  const score = prog.total === 0 ? 0 : Math.round((prog.ok / prog.total) * 100);
  const scoreColor = score >= 75 ? C.green : score >= 40 ? C.yellow : C.red;
  const r = 54, cx = 70, cy = 70;
  const circ = 2 * Math.PI * r;
  const dashArr = circ * 0.75;
  const dashOffset = dashArr - (dashArr * score / 100);

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "10px 16px 0" }}>
        {vehicles.map(v => <VehicleChip key={v.id} v={v} active={active} setActive={setActive} />)}
        <button onClick={() => setActive(null)} style={{ flexShrink: 0, borderRadius: 20, padding: "7px 14px", fontSize: 12, cursor: "pointer", border: `1px solid ${C.border}`, background: "transparent", color: C.blue, fontWeight: 600 }}>+ Nouveau</button>
      </div>

      <div style={{ margin: "12px 16px 0", borderRadius: 20, overflow: "hidden", height: 180, position: "relative", background: "#111" }}>
        {active.photo ? (
          <img src={active.photo} alt={active.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(180deg, #1a1a2e, #000)", fontSize: 80 }}>{TYPE_ICONS[active.type]}</div>
        )}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(transparent, #000)" }} />
        <label style={{ position: "absolute", bottom: 10, right: 10, zIndex: 2, background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "5px 10px", color: "white", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
          📷 {active.photo ? "Changer" : "Photo"}
          <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
            const file = e.target.files[0]; if (!file) return;
            const reader = new FileReader();
            reader.onload = ev => {
              const img = new Image();
              img.onload = () => {
                const canvas = document.createElement("canvas");
                const MAX = 800; let w = img.width, h = img.height;
                if (w > h && w > MAX) { h = (h * MAX) / w; w = MAX; } else if (h > MAX) { w = (w * MAX) / h; h = MAX; }
                canvas.width = w; canvas.height = h;
                canvas.getContext("2d").drawImage(img, 0, 0, w, h);
                const photo = canvas.toDataURL("image/jpeg", 0.7);
                try { localStorage.setItem("photo_" + active.id, photo); } catch {}
                const updated = vehicles.map(v => v.id === active.id ? { ...v, photo } : v);
                setVehicles(updated); setActive(updated.find(v => v.id === active.id));
              };
              img.src = ev.target.result;
            };
            reader.readAsDataURL(file);
          }} />
        </label>
        {active.photo && (
          <button onClick={e => {
            e.preventDefault(); e.stopPropagation();
            
            const updated = vehicles.map(v => v.id === active.id ? { ...v, photo: null } : v);
            setVehicles(updated); setActive(updated.find(v => v.id === active.id));
            localStorage.removeItem("photo_" + active.id);
          }} style={{ position: "absolute", top: 10, right: 10, zIndex: 10, background: "rgba(252,63,53,0.85)", border: "none", borderRadius: 8, padding: "4px 8px", color: "white", fontSize: 11, cursor: "pointer" }}>✕</button>
        )}
        <div style={{ position: "absolute", bottom: 10, left: 14, zIndex: 2 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "white" }}>{active.name}</div>
          {active.immat && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>{active.immat}</div>}
        </div>
        <button onClick={() => active.isShared ? leaveSharedVehicle?.(active.id, active.ownerId) : setConfirmDelete(true)} style={{ position: "absolute", top: 10, left: 14, zIndex: 10, background: active?.isShared ? "rgba(255,161,0,0.15)" : "rgba(252,63,53,0.15)", border: `1px solid ${active?.isShared ? "rgba(255,161,0,0.3)" : "rgba(252,63,53,0.3)"}`, borderRadius: 8, padding: "4px 10px", color: active?.isShared ? C.yellow : C.red, fontSize: 10, fontWeight: 700, cursor: "pointer" }}>{active?.isShared ? "🚪 Quitter" : "🗑️"}</button>
        {!active.isShared && (
          <button onClick={startEdit} style={{ position: "absolute", top: 10, left: 60, zIndex: 10, background: "rgba(33,87,255,0.15)", border: "1px solid rgba(33,87,255,0.3)", borderRadius: 8, padding: "4px 10px", color: C.blue, fontSize: 10, fontWeight: 700, cursor: "pointer" }}>✏️</button>
        )}
      </div>

      {/* Modal confirmation suppression */}
      {confirmDelete && (
        <div style={{ margin: "10px 16px 0", background: C.red + "22", border: `1px solid ${C.red}44`, borderRadius: 16, padding: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.red, marginBottom: 8 }}>🗑️ Supprimer {active.name} ?</div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>Cette action supprimera le véhicule et toutes ses données. Elle est irréversible.</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setConfirmDelete(false)} style={{ flex: 1, background: C.surface, border: "none", borderRadius: 12, padding: 12, color: C.muted, cursor: "pointer", fontWeight: 700 }}>Annuler</button>
            <button onClick={() => { deleteVehicle(active.id); setConfirmDelete(false); }} style={{ flex: 1, background: C.red, border: "none", borderRadius: 12, padding: 12, color: "white", cursor: "pointer", fontWeight: 700 }}>🗑️ Supprimer</button>
          </div>
        </div>
      )}
      {editMode && (
        <div style={{ margin: "10px 16px 0", background: C.surface, borderRadius: 16, padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: C.text, marginBottom: 12 }}>✏️ Modifier le véhicule</div>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 5, fontWeight: 700 }}>TYPE</div>
          <select value={editType} onChange={e => setEditType(e.target.value)} style={input}>
            <option value="voiture">🚘 Voiture</option>
            <option value="moto">🏍️ Moto</option>
          </select>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 5, fontWeight: 700 }}>NOM</div>
          <input style={input} value={editName} onChange={e => setEditName(e.target.value)} placeholder="Ex: Peugeot 208..." />
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 5, fontWeight: 700 }}>IMMATRICULATION</div>
          <input style={{ ...input, textTransform: "uppercase", letterSpacing: 2 }} value={editImmat} onChange={e => setEditImmat(e.target.value)} placeholder="AB-123-CD" />
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 5, fontWeight: 700 }}>{t.kmActuel || "KILOMÉTRAGE ACTUEL"}</div>
          <input type="number" style={input} value={editKm} onChange={e => setEditKm(e.target.value)} placeholder="Ex: 85000" />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setEditMode(false)} style={{ flex: 1, background: C.surface, border: "none", borderRadius: 12, padding: 12, color: C.muted, cursor: "pointer", fontWeight: 700 }}>Annuler</button>
            <button onClick={saveEdit} style={{ flex: 2, background: C.blue, border: "none", borderRadius: 12, padding: 12, color: "white", cursor: "pointer", fontWeight: 700 }}>✅ Enregistrer</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
        <div style={{ position: "relative", width: 140, height: 100 }}>
          <svg width="140" height="100" viewBox="0 0 140 100">
            <path d={`M ${cx - r * Math.cos(Math.PI * 0.75)} ${cy - r * Math.sin(Math.PI * 0.75)} A ${r} ${r} 0 1 1 ${cx + r * Math.cos(Math.PI * 0.75)} ${cy - r * Math.sin(Math.PI * 0.75)}`} fill="none" stroke="#2a2a2f" strokeWidth="10" strokeLinecap="round" />
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={scoreColor} strokeWidth="10" strokeLinecap="round"
              strokeDasharray={`${dashArr} ${circ}`} strokeDashoffset={dashOffset}
              transform={`rotate(135, ${cx}, ${cy})`}
              style={{ filter: `drop-shadow(0 0 8px ${scoreColor}88)`, transition: "stroke-dashoffset 0.8s ease" }} />
            <text x={cx} y={cy - 6} textAnchor="middle" fontSize="9" fill={C.muted} fontWeight="700" letterSpacing="1">SCORE</text>
            <text x={cx} y={cy + 18} textAnchor="middle" fontSize="28" fill={scoreColor} fontWeight="900">{score}</text>
          </svg>
        </div>
      </div>

      <div style={{ padding: "12px 16px 0", display: "flex", flexDirection: "column", gap: 10 }}>

        {/* 1 — État du véhicule */}
        <div style={{ background: C.surface, borderRadius: 18, padding: 14 }}>
          <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>{t.etatVehicule || 'ÉTAT DU VÉHICULE'}</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: hasProb ? C.red : hasBientot ? C.yellow : C.green }}>
              {hasProb ? (t.unSouci || "⚠️ Y'a un souci !") : hasBientot ? (t.aSurveiller || "⏳ À surveiller") : (t.toutRoule || "✅ Tout roule !")}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {[[C.green, hasOk], [C.yellow, hasBientot], [C.red, hasProb]].map(([c, on], i) => (
                <div key={i} style={{ width: 20, height: 20, borderRadius: "50%", background: on ? c : c + "33", boxShadow: on ? `0 0 8px ${c}88` : "none" }} />
              ))}
            </div>
          </div>
        </div>

        {/* 2 — Rappels */}
        {alertDocs.length > 0 && (
          <div style={{ background: C.surface, borderRadius: 14, padding: "8px 12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ fontSize: 9, color: C.muted, fontWeight: 700, letterSpacing: 1 }}>{t.rappels || "RAPPELS"}</div>
              <span style={{ background: alertDocs.some(d => d.days <= 15) ? C.red : C.yellow, color: "black", borderRadius: 20, padding: "1px 7px", fontSize: 9, fontWeight: 800 }}>{alertDocs.length}</span>
            </div>
            {alertDocs.map(d => {
              const col = d.days <= 0 ? C.red : d.days <= 15 ? C.red : d.days <= 30 ? C.yellow : C.green;
              const labelTrad = d.type === "assurance" ? (t.assurance?.replace("🛡️ ", "") || d.label) : d.type === "controle" ? (t.controleTechnique?.replace("🚗 ", "") || d.label) : d.type === "revision" ? (t.revision || d.label) : d.label;
              return (
                <div key={d.id} onClick={() => setTab("documents")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 8, background: col + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>{d.icon}</div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.text }}>{labelTrad}</div>
                      <div style={{ fontSize: 10, color: col, fontWeight: 600 }}>{d.days <= 0 ? (t.expire || "Expiré 🔴") : `${t.dans || "Dans"} ${d.days} ${t.jours || "jours"}`}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: C.muted }}>{d.date} ›</div>
                </div>
              );
            })}
          </div>
        )}

        {/* 3 — Dernière vérif */}
        <div style={{ background: C.surface, borderRadius: 18, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 9, color: C.muted, fontWeight: 700, letterSpacing: 1 }}>{t.derniereVerif || 'DERNIÈRE VÉRIF'}</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: C.blue, marginTop: 3 }}>{lastEntry?.date || "—"}</div>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: C.green }}>{prog.ok}</div>
              <div style={{ fontSize: 9, color: C.muted, fontWeight: 700 }}>{t.ok || "OK"}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: C.yellow }}>{vals.filter(v => v === "BIENTOT").length}</div>
              <div style={{ fontSize: 9, color: C.muted, fontWeight: 700 }}>{t.bientot || "BIENTÔT"}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: prog.problems > 0 ? C.red : C.muted }}>{prog.problems}</div>
              <div style={{ fontSize: 9, color: C.muted, fontWeight: 700 }}>{t.probleme || "PROBLÈME"}</div>
            </div>
          </div>
        </div>

        {/* 3b — Kilométrage */}
        {kmTotal && (
          <div style={{ background: C.surface, borderRadius: 18, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 9, color: C.muted, fontWeight: 700, letterSpacing: 1 }}>{t.kmActuel || "KM TOTAL VÉHICULE"}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: C.text }}>{kmTotal} <span style={{ fontSize: 12, color: C.muted }}>km</span></div>
          </div>
        )}

        {/* 4 — On fait le tour */}
        <button style={{ background: C.blue, color: "white", border: "none", borderRadius: 18, padding: 16, fontSize: 15, fontWeight: 800, cursor: "pointer", letterSpacing: 0.5, boxShadow: `0 4px 20px ${C.blue}55` }} onClick={() => setTab("checklist")}>
          🚗 {t.onFaitLeTour || 'On fait le tour ?'}
        </button>

        {/* Bouton de secours */}
        <button onClick={() => setTab("secours")} style={{
          background: "linear-gradient(135deg, #cc0000, #ff1a1a)",
          color: "white", border: "none", borderRadius: 18,
          padding: "32px 16px", fontSize: 17, fontWeight: 900,
          cursor: "pointer", letterSpacing: 0.5,
          boxShadow: "0 4px 24px rgba(255,0,0,0.4)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          width: "100%",
        }}>
          <span style={{ fontSize: 32 }}>🆘</span>
          {t.boutonSecours || 'BOUTON DE SECOURS'}
          <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.85 }}>Accident · Assistance · Constat · Services proches</span>
        </button>
        <div style={{ height: 16 }} />
      </div>
    </div>
  );
}

// ─── CHECKLIST ────────────────────────────────────────────────────
function CheckItem({ item, state, onUpdate, t = {} }) {
  const icolor = ITEM_COLORS[item.id] || C.blue;
  return (
    <div style={{ background: state ? STATE_COLOR[state] + "15" : C.surface, borderRadius: 16, padding: "12px 14px", marginBottom: 8, border: `1px solid ${state ? STATE_COLOR[state] + "44" : "transparent"}`, display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 44, height: 44, borderRadius: 14, flexShrink: 0, background: icolor + "25", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{item.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{item.label}</div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{item.desc}</div>
      </div>
      <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
        {["OK", "BIENTOT", "PROBLEME"].map(st => {
          const on = state === st;
          const col = STATE_COLOR[st];
          const sym = { OK: "✓", BIENTOT: "!", PROBLEME: "X" }[st];
          return (
            <button key={st} onClick={() => onUpdate(item.id, st)} style={{ width: 34, height: 34, borderRadius: 10, border: "none", cursor: "pointer", background: on ? col : col + "22", color: on ? "#000" : col, fontSize: 15, fontWeight: 900, boxShadow: on ? `0 0 12px ${col}88` : "none", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center" }}>{sym}</button>
          );
        })}
      </div>
    </div>
  );
}

function GroupItem({ item, checks, onUpdate, t = {} }) {
  const [open, setOpen] = useState(false);
  const states = item.items.map(sub => checks?.[sub.id]);
  const hasProb = states.some(s => s === "PROBLEME");
  const hasBientot = states.some(s => s === "BIENTOT");
  const allDone = states.every(s => s);
  const groupColor = hasProb ? C.red : hasBientot ? C.yellow : allDone ? C.green : C.blue;

  return (
    <div style={{ marginBottom: 8 }}>
      <div onClick={() => setOpen(o => !o)} style={{ background: C.bg, borderRadius: 16, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", border: `1px solid ${allDone ? groupColor + "44" : C.border}`, marginBottom: open ? 6 : 0 }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, flexShrink: 0, background: groupColor + "25", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{item.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{item.label}</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
            {allDone
              ? `${states.filter(s => s === "OK").length} OK · ${states.filter(s => s === "PROBLEME").length} ${t.probleme || "problème(s)"}`
              : `${states.filter(Boolean).length} / ${item.items.length} ${t.verifie || "vérifiés"}`}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            {[[C.green, "OK"], [C.yellow, "BIENTOT"], [C.red, "PROBLEME"]].map(([c, st], i) => {
              const on = states.some(s => s === st);
              const sym = { OK: "✓", BIENTOT: "!", PROBLEME: "✗" }[st];
              return <div key={i} style={{ width: 34, height: 34, borderRadius: 10, background: on ? c : c + "22", boxShadow: on ? `0 0 12px ${c}88` : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 900, color: on ? "#000" : c + "66" }}>{on ? sym : ""}</div>;
            })}
          </div>
          <span style={{ color: C.muted, fontSize: 18, display: "inline-block", transition: "transform 0.2s", transform: open ? "rotate(90deg)" : "none" }}>›</span>
        </div>
      </div>
      {open && (
        <div style={{ paddingLeft: 14, borderLeft: `3px solid ${groupColor}44`, marginLeft: 6 }}>
          {item.items.map(sub => <CheckItem key={sub.id} item={sub} state={checks?.[sub.id]} onUpdate={onUpdate} t={t} />)}
        </div>
      )}
    </div>
  );
}

export function ChecklistScreen({ active, checklist, prog, updateCheck, setTab, t = {}, isPremium = true, onShowPremium }) {
  const [onglet, setOnglet] = useState("verification");
  const [photo, setPhoto] = useState(null);
  const [analyse, setAnalyse] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!active) return <div style={{ padding: 40, textAlign: "center", color: C.muted }}><div style={{ fontSize: 48, marginBottom: 12 }}>✅</div><div style={{ fontWeight: 600 }}>{t.choisirVehicule || "Choisis un véhicule depuis l'accueil"}</div></div>;

  const tabStyle = (on) => ({
    flex: 1, padding: "12px 0", borderRadius: 14, border: "none",
    cursor: "pointer", fontSize: 13, fontWeight: 700,
    background: on ? C.green : C.blue,
    color: on ? "#000" : "white",
    boxShadow: on ? `0 2px 12px ${C.green}44` : `0 2px 8px ${C.blue}44`,
  });

  const analyserPhoto = async () => {
    if (!photo) return;
    setLoading(true);
    setAnalyse(null);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: "image/jpeg", data: photo.split(",")[1] }
              },
              {
                type: "text",
                text: `Tu es un expert automobile. Analyse ce tableau de bord et identifie les voyants allumés. Pour chaque voyant, donne : 1) Son nom 2) Ce qu'il signifie 3) Son niveau de gravité (🔴 STOP - arrêtez-vous immédiatement / 🟠 ATTENTION - vérifiez bientôt / 🟢 INFO - pas urgent). Réponds en JSON avec ce format : {"voyants": [{"nom": "...", "signification": "...", "gravite": "STOP|ATTENTION|INFO", "emoji": "🔴|🟠|🟢", "action": "..."}]}. Si tu ne vois pas de voyant allumé, réponds {"voyants": [], "message": "Aucun voyant allumé détecté"}.`
              }
            ]
          }]
        })
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const result = JSON.parse(clean);
      setAnalyse(result);
    } catch (e) {
      setAnalyse({ error: "Impossible d'analyser la photo. Réessayez." });
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 16, background: C.bg, minHeight: "100vh" }}>

      {/* Onglets */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button style={tabStyle(onglet === "verification")} onClick={() => setOnglet("verification")}>
          ✅ {t.checklist || "Vérification"}
        </button>
        <button style={tabStyle(onglet === "diagnostic")} onClick={() => isPremium ? setOnglet("diagnostic") : onShowPremium?.()}>
          🔍 {isPremium ? "Diagnostic IA" : "🔒 Diagnostic IA"}
        </button>
      </div>

      {/* ── ONGLET VÉRIFICATION ── */}
      {onglet === "verification" && (
        <>
          <div style={{ background: C.surface, borderRadius: 18, padding: "14px 16px", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: C.muted, letterSpacing: 1 }}>{t.commentCaSePassee || "COMMENT ÇA SE PASSE ?"}</span>
              <span style={{ fontSize: 22, fontWeight: 900, color: prog.problems > 0 ? C.red : C.green }}>{prog.pct}%</span>
            </div>
            <div style={{ height: 10, background: "#1a1a1a", borderRadius: 20, overflow: "hidden", marginBottom: 8 }}>
              <div style={{ width: prog.pct + "%", height: "100%", background: prog.pct === 100 ? "#22ff00" : prog.pct >= 60 ? `linear-gradient(90deg, #ffa200, #22ff00)` : prog.pct >= 30 ? `linear-gradient(90deg, #ff0000, #ffa200)` : "#ff0000", borderRadius: 20, transition: "width 0.5s ease", boxShadow: prog.pct === 100 ? "0 0 10px #22ff0066" : "none" }} />
            </div>
            <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
              <span style={{ fontSize: 12, color: C.green, fontWeight: 700 }}>✓ {prog.ok} {t.ok || "OK"}</span>
              <span style={{ fontSize: 12, color: C.yellow, fontWeight: 700 }}>! {Object.values(active.checks || {}).filter(v => v === "BIENTOT").length} {t.bientot || "BIENTÔT"}</span>
              <span style={{ fontSize: 12, color: C.red, fontWeight: 700 }}>✗ {prog.problems} {(t.probleme || "PROBLÈME").toUpperCase()}{prog.problems !== 1 ? "S" : ""}</span>
            </div>
          </div>
          {checklist.map(item => item.group
            ? <GroupItem key={item.id} item={item} checks={active.checks} onUpdate={updateCheck} t={t} />
            : <CheckItem key={item.id} item={item} state={active.checks?.[item.id]} onUpdate={updateCheck} t={t} />
          )}
          <button style={{ marginTop: 8, background: C.blue, color: "white", border: "none", borderRadius: 18, padding: 16, fontSize: 15, fontWeight: 800, cursor: "pointer", width: "100%", boxShadow: `0 4px 20px ${C.blue}55` }} onClick={() => setTab("rapport")}>
            📊 {t.voirLeBilan || "Voir le bilan"}
          </button>
        </>
      )}

      {/* ── ONGLET DIAGNOSTIC IA ── */}
      {onglet === "diagnostic" && (
        <div>
          <div style={{ background: C.surface, borderRadius: 18, padding: 16, marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 6 }}>🔍 Diagnostic voyants</div>
            <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
              Prends une photo de ton tableau de bord — l'IA identifie les voyants allumés et te dit quoi faire.
            </div>
          </div>

          {/* Zone photo */}
          <label style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "24px 16px", background: C.surface, border: `2px dashed ${C.blue}44`, borderRadius: 18, cursor: "pointer", marginBottom: 14 }}>
            {photo ? (
              <img src={photo} alt="tableau de bord" style={{ width: "100%", borderRadius: 12, maxHeight: 220, objectFit: "cover" }} />
            ) : (
              <>
                <span style={{ fontSize: 48 }}>📷</span>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.blue }}>Prendre une photo</div>
                <div style={{ fontSize: 12, color: C.muted }}>Tableau de bord · Voyants</div>
              </>
            )}
            <input type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={e => {
              const file = e.target.files[0]; if (!file) return;
              const reader = new FileReader();
              reader.onload = ev => setPhoto(ev.target.result);
              reader.readAsDataURL(file);
            }} />
          </label>

          {photo && (
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              <button onClick={() => { setPhoto(null); setAnalyse(null); }} style={{ flex: 1, background: C.surface, border: "none", borderRadius: 14, padding: 14, color: C.muted, cursor: "pointer", fontWeight: 700 }}>
                🗑️ Supprimer
              </button>
              <button onClick={analyserPhoto} disabled={loading} style={{ flex: 2, background: C.blue, border: "none", borderRadius: 14, padding: 14, color: "white", cursor: "pointer", fontWeight: 700, fontSize: 14, opacity: loading ? 0.7 : 1 }}>
                {loading ? "⏳ Analyse en cours..." : "🔍 Analyser"}
              </button>
            </div>
          )}

          {/* Résultats */}
          {analyse && !analyse.error && (
            <div>
              {analyse.voyants?.length === 0 ? (
                <div style={{ background: C.green + "22", border: `1px solid ${C.green}44`, borderRadius: 16, padding: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.green }}>Aucun voyant allumé détecté !</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Tout semble normal.</div>
                </div>
              ) : (
                analyse.voyants?.map((v, i) => {
                  const col = v.gravite === "STOP" ? C.red : v.gravite === "ATTENTION" ? C.yellow : C.green;
                  return (
                    <div key={i} style={{ background: col + "15", border: `1px solid ${col}44`, borderRadius: 16, padding: 16, marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: 24 }}>{v.emoji}</span>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 800, color: C.text }}>{v.nom}</div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: col }}>{v.gravite}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 13, color: C.text, marginBottom: 6 }}>{v.signification}</div>
                      <div style={{ fontSize: 12, color: col, fontWeight: 600 }}>👉 {v.action}</div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {analyse?.error && (
            <div style={{ background: C.red + "22", border: `1px solid ${C.red}44`, borderRadius: 16, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 13, color: C.red }}>{analyse.error}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── DOCUMENTS ────────────────────────────────────────────────────
export function DocumentsScreen({ vehicles, active, setActive, docTab, setDocTab, docs, setDocs, localInvoices, setLocalInvoices, garageInfo, onSaveGarage, t = {} }) {
  const [form, setForm] = useState({ assOrg: "", assNum: "", assDate: "", assTel: "", ctDate: "", garNom: garageInfo?.nom || "", garTel: garageInfo?.tel || "", garRevDate: "" });
  const [garageSaved, setGarageSaved] = useState(false);
  const [showAssForm, setShowAssForm] = useState(false);
  const [showCtForm,  setShowCtForm]  = useState(false);
  const [showGarForm, setShowGarForm] = useState(false);
  const [showRevForm, setShowRevForm] = useState(false);

  React.useEffect(() => {
    setForm(f => ({ ...f, garNom: garageInfo?.nom || "", garTel: garageInfo?.tel || "" }));
  }, [garageInfo]);

  const myDocs  = docs.filter(d => !active || d.vehicleId === active?.id);
  const assDocs = myDocs.filter(d => d.type === "assurance");
  const ctDocs  = myDocs.filter(d => d.type === "controle");
  const myInvoices = (localInvoices || []).filter(i => !i.vehicleId || i.vehicleId === active?.id);

  const addDoc = (type, data) => {
    const diff = Math.ceil((new Date(data.date) - new Date()) / 86400000);
    setDocs(p => {
      const filtered = p.filter(d => !(d.type === type && (!active || d.vehicleId === active?.id)));
      return [...filtered, { id: Date.now(), type, ...data, date: new Date(data.date).toLocaleDateString("fr-FR"), rawDate: data.date, days: diff, status: diff <= 15 ? "Urgent" : diff <= 30 ? "Bientôt" : "OK", vehicleId: active?.id, vehicleName: active?.name }];
    });
  };

  const handleUpload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLocalInvoices(p => [...p, { id: Date.now(), name: file.name, size: (file.size / 1024).toFixed(1) + " Ko", date: new Date().toLocaleDateString("fr-FR"), type: file.type, data: ev.target.result, vehicleId: active?.id, vehicleName: active?.name }]);
    reader.readAsDataURL(file);
  };

  const pillColor = (days) => days <= 0 ? C.red : days <= 15 ? C.red : days <= 30 ? C.yellow : C.green;
  const pillLabel = (days) => days <= 0 ? (t.expireExclam || "Expiré 🔴") : days <= 15 ? (t.urgent || "Urgent ⚠️") : days <= 30 ? (t.bientotLabel || "Bientôt ⏳") : (t.okLabel || "OK ✅");
  const tabStyle  = (on) => ({ flex: 1, padding: "10px 0", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, transition: "all 0.2s", background: on ? C.green : C.blue, color: on ? "#000" : "white", boxShadow: on ? `0 2px 12px ${C.green}44` : `0 2px 8px ${C.blue}44` });
  const sCard     = (extra = {}) => ({ background: C.surface, borderRadius: 16, padding: "14px 16px", marginBottom: 10, ...extra });
  const sBtn      = (active2 = true, color = C.blue) => ({ background: active2 ? color : C.surface, color: active2 ? "white" : C.muted, border: "none", borderRadius: 14, padding: "13px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", width: "100%", marginBottom: 10, boxShadow: active2 ? `0 4px 16px ${color}44` : "none" });

  const callBtn = (tel, label) => (
    <a href={`tel:${tel.replace(/\s/g, "")}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: C.green + "22", border: `1px solid ${C.green}44`, borderRadius: 12, padding: "11px 14px", marginTop: 12, color: C.green, textDecoration: "none", fontSize: 14, fontWeight: 700 }}>
      📞 {label}
    </a>
  );

  return (
    <div style={{ padding: 16, background: C.bg, minHeight: "100vh" }}>
      {vehicles.length > 1 && (
        <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 14 }}>
          {vehicles.map(v => <VehicleChip key={v.id} v={v} active={active} setActive={setActive} />)}
        </div>
      )}
      {!active && <div style={{ background: C.yellow + "22", border: `1px solid ${C.yellow}44`, borderRadius: 14, padding: "12px 16px", marginBottom: 14 }}><span style={{ fontSize: 13, color: C.yellow }}>⚠️ {t.choisirVehiculeDocs || "Choisis un véhicule pour lier tes docs."}</span></div>}

      <div style={{ display: "flex", background: "rgba(255,255,255,0.06)", borderRadius: 24, padding: 4, marginBottom: 16, gap: 4, border: "1px solid rgba(255,255,255,0.08)" }}>
        <button style={tabStyle(docTab === "assurance")} onClick={() => setDocTab("assurance")}>{t.assurance || "🛡️ Assurance"}</button>
        <button style={tabStyle(docTab === "controle")}  onClick={() => setDocTab("controle")}>{t.controleTechnique || "🚗 Contrôle Technique"}</button>
        <button style={tabStyle(docTab === "garage")}    onClick={() => setDocTab("garage")}>{t.garage || "🔧 Garage"}</button>
      </div>

      {docTab === "assurance" && (
        <div>
          {assDocs.map(d => (
            <div key={d.id} style={sCard()}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, flexShrink: 0, background: C.blue + "25", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🛡️</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{t.assurance?.replace("🛡️ ", "") || "Assurance"}</div>
                    <span style={{ background: pillColor(d.days) + "25", color: pillColor(d.days), borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{pillLabel(d.days)}</span>
                  </div>
                  {d.org && <div style={{ fontSize: 12, color: C.muted2, marginTop: 3 }}>{d.org}</div>}
                  {d.num && <div style={{ fontSize: 12, color: C.muted }}>N° {d.num}</div>}
                  {d.tel && <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>📞 {d.tel}</div>}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                    <span style={{ fontSize: 12, color: pillColor(d.days), fontWeight: 700 }}>{d.days <= 0 ? (t.expireExclam || "Expiré 🔴") : `${t.expireDans || "Expire dans"} ${d.days} ${t.jours || "jours"}`}</span>
                    <span style={{ fontSize: 12, color: C.muted }}>{d.date}</span>
                  </div>
                </div>
                <button onClick={() => { setDocs(p => p.filter(x => x.id !== d.id)); }} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 16 }}>✕</button>
              </div>
              {d.tel && callBtn(d.tel, t.appelerAssurance || "Appeler l'assurance")}
            </div>
          ))}
          <button style={sBtn(!showAssForm)} onClick={() => setShowAssForm(f => !f)}>{showAssForm ? (t.annuler || "✕ Annuler") : assDocs.length > 0 ? (t.modifierAssurance || "✏️ Modifier l'assurance") : (t.ajouterAssurance || "➕ Ajouter l'assurance")}</button>
          {showAssForm && (
            <div style={sCard({ padding: 20 })}>
              {[[t.organisme || "ORGANISME","text","AXA, MAAF…","assOrg"],[t.contrat || "N° CONTRAT","text","123 456 789","assNum"],[t.telephone || "TÉLÉPHONE","tel","01 23 45 67 89","assTel"]].map(([label,type,ph,key]) => (
                <div key={key}><div style={{ fontSize: 11, color: C.muted, marginBottom: 5, fontWeight: 700 }}>{label}</div><input type={type} style={input} placeholder={ph} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} /></div>
              ))}
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 5, fontWeight: 700 }}>{t.dateEcheance || "DATE D'ÉCHÉANCE"}</div>
              <input type="date" style={input} value={form.assDate} onChange={e => setForm(f => ({ ...f, assDate: e.target.value }))} />
              <button style={sBtn(!!form.assDate)} onClick={() => {
                if (!form.assDate) return;
                addDoc("assurance", { label: "Assurance", icon: "🛡️", org: form.assOrg, num: form.assNum, tel: form.assTel, date: form.assDate });
                setForm(f => ({ ...f, assOrg: "", assNum: "", assDate: "", assTel: "" }));
                setShowAssForm(false);
              }}>{t.enregistrer || "✅ Enregistrer"}</button>
            </div>
          )}
        </div>
      )}

      {docTab === "controle" && (
        <div>
          {ctDocs.map(d => (
            <div key={d.id} style={sCard({ display: "flex", alignItems: "flex-start", gap: 14 })}>
              <div style={{ width: 46, height: 46, borderRadius: 14, flexShrink: 0, background: C.purple + "25", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🚗</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{t.controleTechnique?.replace("🚗 ", "") || "Contrôle technique"}</div>
                  <span style={{ background: pillColor(d.days) + "25", color: pillColor(d.days), borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{pillLabel(d.days)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontSize: 12, color: pillColor(d.days), fontWeight: 700 }}>{d.days <= 0 ? (t.expireExclam || "Expiré 🔴") : `${t.expireDans || "Expire dans"} ${d.days} ${t.jours || "jours"}`}</span>
                  <span style={{ fontSize: 12, color: C.muted }}>{d.date}</span>
                </div>
              </div>
              <button onClick={() => { setDocs(p => p.filter(x => x.id !== d.id)); }} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>
          ))}
          <button style={sBtn(!showCtForm)} onClick={() => setShowCtForm(f => !f)}>{showCtForm ? (t.annuler || "✕ Annuler") : ctDocs.length > 0 ? (t.modifierControle || "✏️ Modifier le contrôle") : (t.ajouterControle || "➕ Ajouter le contrôle technique")}</button>
          {showCtForm && (
            <div style={sCard({ padding: 20 })}>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 5, fontWeight: 700 }}>{t.dateEcheance || "DATE D'ÉCHÉANCE"}</div>
              <input type="date" style={input} value={form.ctDate} onChange={e => setForm(f => ({ ...f, ctDate: e.target.value }))} />
              {form.ctDate && (() => { const diff = Math.ceil((new Date(form.ctDate) - new Date()) / 86400000); const col = diff <= 15 ? C.red : diff <= 30 ? C.yellow : C.green; return <div style={{ background: col + "22", borderRadius: 10, padding: "10px 14px", marginBottom: 10, fontSize: 13 }}><span style={{ color: col, fontWeight: 700 }}>{diff > 0 ? `⏰ ${t.dans || "Dans"} ${diff} ${t.jours || "jours"}` : (t.expireExclam || "⚠️ Expiré 🔴")}</span></div>; })()}
              <button style={sBtn(!!form.ctDate)} onClick={() => { if (!form.ctDate) return; addDoc("controle", { label: "Contrôle technique", icon: "🚗", date: form.ctDate }); setForm(f => ({ ...f, ctDate: "" })); setShowCtForm(false); }}>{t.enregistrer || "✅ Enregistrer"}</button>
            </div>
          )}
        </div>
      )}

      {docTab === "garage" && (
        <div>
          {garageInfo?.nom && (
            <div style={sCard()}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, flexShrink: 0, background: C.orange + "25", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🔧</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{garageInfo.nom}</div>
                  {garageInfo.tel && <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>📞 {garageInfo.tel}</div>}
                </div>
              </div>
              {garageInfo.tel && callBtn(garageInfo.tel, t.appelerGarage || "Appeler le garage")}
            </div>
          )}
          <button style={sBtn(!showGarForm)} onClick={() => setShowGarForm(f => !f)}>{showGarForm ? (t.annuler || "✕ Annuler") : garageInfo?.nom ? (t.modifierGarage || "✏️ Modifier le garage") : (t.ajouterGarage || "➕ Ajouter le garage")}</button>
          {showGarForm && (
            <div style={sCard({ padding: 20 })}>
              {[[t.nomGarage || "NOM DU GARAGE","text","Garage Dupont…","garNom"],[t.telephone || "TÉLÉPHONE","tel","01 23 45 67 89","garTel"]].map(([label,type,ph,key]) => (
                <div key={key}><div style={{ fontSize: 11, color: C.muted, marginBottom: 5, fontWeight: 700 }}>{label}</div><input type={type} style={input} placeholder={ph} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} /></div>
              ))}
              <button style={sBtn(form.garNom.trim().length > 0, garageSaved ? C.green : C.blue)} onClick={() => { if (!form.garNom.trim()) return; onSaveGarage({ nom: form.garNom, tel: form.garTel }); setGarageSaved(true); setShowGarForm(false); setTimeout(() => setGarageSaved(false), 2000); }}>{garageSaved ? (t.enregistre || "✅ Enregistré !") : (t.enregistrerInfos || "💾 Enregistrer les infos")}</button>
            </div>
          )}

          {myDocs.filter(d => d.type === "revision").map(d => (
            <div key={d.id} style={sCard({ display: "flex", alignItems: "flex-start", gap: 14 })}>
              <div style={{ width: 46, height: 46, borderRadius: 14, flexShrink: 0, background: C.orange + "25", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🔩</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{t.revision || "Révision"}</div>
                  <span style={{ background: pillColor(d.days) + "25", color: pillColor(d.days), borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{pillLabel(d.days)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontSize: 12, color: pillColor(d.days), fontWeight: 700 }}>{d.days <= 0 ? (t.depasse || "Dépassée !") : `${t.dans || "Dans"} ${d.days} ${t.jours || "jours"}`}</span>
                  <span style={{ fontSize: 12, color: C.muted }}>{d.date}</span>
                </div>
              </div>
              <button onClick={() => { setDocs(p => p.filter(x => x.id !== d.id)); }} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>
          ))}
          <button style={sBtn(!showRevForm)} onClick={() => setShowRevForm(f => !f)}>{showRevForm ? (t.annuler || "✕ Annuler") : myDocs.filter(d => d.type === "revision").length > 0 ? (t.modifierRevision || "✏️ Modifier la révision") : (t.ajouterRevision || "➕ Ajouter une révision")}</button>
          {showRevForm && (
            <div style={sCard({ padding: 20 })}>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 5, fontWeight: 700 }}>{t.dateProchaineRevision || "DATE DE LA PROCHAINE RÉVISION"}</div>
              <input type="date" style={input} value={form.garRevDate} onChange={e => setForm(f => ({ ...f, garRevDate: e.target.value }))} />
              {form.garRevDate && (() => { const diff = Math.ceil((new Date(form.garRevDate) - new Date()) / 86400000); const col = diff <= 15 ? C.red : diff <= 30 ? C.yellow : C.green; return <div style={{ background: col + "22", borderRadius: 10, padding: "10px 14px", marginBottom: 10, fontSize: 13 }}><span style={{ color: col, fontWeight: 700 }}>{diff > 0 ? `⏰ ${t.dans || "Dans"} ${diff} ${t.jours || "jours"}` : "⚠️ Révision dépassée !"}</span></div>; })()}
              <button style={sBtn(!!form.garRevDate)} onClick={() => {
                if (!form.garRevDate) return;
                const diff = Math.ceil((new Date(form.garRevDate) - new Date()) / 86400000);
                setDocs(p => { const filtered = p.filter(d => !(d.type === "revision" && (!active || d.vehicleId === active?.id))); return [...filtered, { id: Date.now(), type: "revision", label: "Révision", icon: "🔩", date: new Date(form.garRevDate).toLocaleDateString("fr-FR"), rawDate: form.garRevDate, days: diff, status: diff <= 15 ? "Urgent" : diff <= 30 ? "Bientôt" : "OK", vehicleId: active?.id, vehicleName: active?.name }]; });
                setForm(f => ({ ...f, garRevDate: "" })); setShowRevForm(false);
              }}>{t.enregistrerRevision || "✅ Enregistrer la révision"}</button>
            </div>
          )}

          <div style={sCard({ padding: 20 })}>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 14 }}>{t.facturesDocuments || "📁 Factures & documents"}</div>
            <label style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "20px 16px", background: C.blue + "15", border: `2px dashed ${C.blue}44`, borderRadius: 14, cursor: "pointer", marginBottom: 14 }}>
              <span style={{ fontSize: 32 }}>📄</span>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 700, color: C.blue, fontSize: 14 }}>{t.ajouterFacture || "Ajouter une facture"}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{t.pdfImageDoc || "PDF, image, ou tout document"}</div>
              </div>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx" style={{ display: "none" }} onChange={handleUpload} />
            </label>
            {myInvoices.length === 0 ? <div style={{ textAlign: "center", color: C.muted, fontSize: 13, padding: "8px 0" }}>{t.aucuneFacture || "Pas encore de facture 📄"}</div> : myInvoices.map(inv => {
              const isImg = inv.type?.startsWith("image/"); const isPdf = inv.type === "application/pdf";
              return (
                <div key={inv.id} style={{ background: "#1a1a1a", borderRadius: 12, marginBottom: 8, padding: "10px 14px", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 22 }}>{isPdf ? "📄" : isImg ? "🖼️" : "📎"}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: C.text }}>{inv.name}</div>
                        <div style={{ fontSize: 11, color: C.muted }}>{inv.size} · {inv.date}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => { const a = document.createElement("a"); a.href = inv.data; a.download = inv.name; a.click(); }} style={{ background: C.blue + "25", border: "none", color: C.blue, borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 14 }}>⬇</button>
                      <button onClick={() => { setLocalInvoices(p => p.filter(i => i.id !== inv.id)); }} style={{ background: C.red + "22", border: "none", color: C.red, borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 14 }}>✕</button>
                    </div>
                  </div>
                  {isImg && <img src={inv.data} alt={inv.name} style={{ width: "100%", borderRadius: 8, maxHeight: 160, objectFit: "cover", marginTop: 8 }} />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DÉPENSES ─────────────────────────────────────────────────────
export function DepensesScreen({ active, vehicles, setVehicles, setActive, depenses, setDepenses, t = {} }) {
  const [sousOnglet, setSousOnglet] = useState("general");
  const [showForm, setShowForm] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [form, setForm] = useState({ date: "", montant: "", categorie: t.catGarage || "Garage", description: "", km: "", prixCarburant: "", litres: "" });
  const [scanning, setScanning] = useState(false);
  const [scanPhoto, setScanPhoto] = useState(null);

  const scanFacture = async (photoData) => {
    setScanning(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          messages: [{
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: "image/jpeg", data: photoData.split(",")[1] } },
              { type: "text", text: `Analyse cette facture de garage/station service et extrais les informations. Réponds UNIQUEMENT en JSON avec ce format exact : {"date": "YYYY-MM-DD", "montant": "XX.XX", "description": "description courte des travaux", "categorie": "Garage"} . Si tu ne trouves pas une info, mets "" pour cette valeur. La date doit être au format YYYY-MM-DD.` }
            ]
          }]
        })
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const result = JSON.parse(clean);
      setForm(f => ({
        ...f,
        date: result.date || f.date,
        montant: result.montant || f.montant,
        description: result.description || f.description,
        categorie: result.categorie || f.categorie,
      }));
      setShowForm(true);
      setScanPhoto(null);
    } catch (e) {
      alert("Impossible de lire la facture. Remplissez manuellement.");
    }
    setScanning(false);
  };

  if (!active) return <div style={{ padding: 40, textAlign: "center", color: C.muted }}><div style={{ fontSize: 48, marginBottom: 12 }}>💰</div><div style={{ fontWeight: 600 }}>{t.choisirVehicule || "Choisis un véhicule depuis l'accueil"}</div></div>;

  const myDep  = (depenses || []).filter(d => d.vehicleId === active.id);
  const depGen = myDep.filter(d => d.type === "general");
  const depCarb= myDep.filter(d => d.type === "carburant");
  const now        = new Date();
  const moisActuel = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
  const depMois    = myDep.filter(d => d.date?.startsWith(moisActuel));
  const totalMois  = depMois.reduce((s, d) => s + (parseFloat(d.montant) || 0), 0);
  const carbMois   = depCarb.filter(d => d.date?.startsWith(moisActuel)).sort((a,b) => a.km - b.km);
  const kmMois     = carbMois.length >= 2 ? carbMois[carbMois.length-1].km - carbMois[0].km : 0;
  const CAT_ICONS  = { [t.catFinancement||"Financement"]: "🏦", [t.catAssurance||"Assurance"]: "🛡️", [t.catControle||"Contrôle technique"]: "🚗", [t.catGarage||"Garage"]: "🔧", [t.catPeage||"Péage"]: "🛣️", [t.catLavage||"Lavage"]: "🚿" };
  const CATEGORIES = [t.catFinancement||"Financement", t.catAssurance||"Assurance", t.catControle||"Contrôle technique", t.catGarage||"Garage", t.catPeage||"Péage", t.catLavage||"Lavage"];
  const tabStyle   = (on) => ({ flex: 1, padding: "10px 0", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, transition: "all 0.2s", background: on ? C.green : C.blue, color: on ? "#000" : "white", boxShadow: on ? `0 2px 12px ${C.green}44` : `0 2px 8px ${C.blue}44` });

  const addDepense = () => {
    if (sousOnglet === "general") {
      if (!form.montant || !form.date) return;
      setDepenses(p => [...p, { id: Date.now(), type: "general", date: form.date, montant: form.montant, categorie: form.categorie, description: form.description, vehicleId: active.id, vehicleName: active.name }]);
    } else {
      if (!form.prixCarburant || !form.date || !form.km) return;
      setDepenses(p => [...p, { id: Date.now(), type: "carburant", date: form.date, montant: form.prixCarburant, km: form.km, litres: form.litres, vehicleId: active.id, vehicleName: active.name }]);
      // Mettre à jour le kilométrage du véhicule automatiquement
      if (setVehicles && form.km) {
        const newKm = parseInt(form.km) || 0;
        const currentKm = parseInt(active.km) || 0;
        if (newKm > currentKm) {
          setVehicles(prev => prev.map(v => v.id === active.id ? { ...v, km: String(newKm) } : v));
          setActive(prev => prev?.id === active.id ? { ...prev, km: String(newKm) } : prev);
        }
      }
    }
    setForm({ date: "", montant: "", categorie: "Garage", description: "", km: "", prixCarburant: "", litres: "" });
    setShowForm(false);
  };

  const coutKm = depCarb.length >= 2 ? depCarb.slice().sort((a,b) => a.km - b.km).reduce((acc, d, i, arr) => { if (i === 0) return acc; const kmDiff = d.km - arr[i-1].km; if (kmDiff > 0) acc.push({ km: d.km, cout: (parseFloat(d.montant) / kmDiff).toFixed(2) }); return acc; }, []) : [];

  return (
    <div style={{ padding: 16, background: C.bg, minHeight: "100vh" }}>
      {vehicles.length > 1 && <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 14 }}>{vehicles.map(v => <VehicleChip key={v.id} v={v} active={active} setActive={setActive} />)}</div>}

      <div style={card({ display: "flex", justifyContent: "space-between", alignItems: "center" })}>
        <div>
          <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, letterSpacing: 1 }}>{t.ceMoisCi || "CE MOIS-CI"}</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: C.text, marginTop: 2 }}>{totalMois.toFixed(2)} €</div>
          {kmMois > 0 && <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>🛣️ {kmMois.toLocaleString()} km {t.parcourus || "parcourus ce mois"}</div>}
          {(() => {
            const litresMois = depCarb.filter(d => d.date?.startsWith(moisActuel) && d.litres).reduce((s, d) => s + parseFloat(d.litres), 0);
            if (litresMois > 0 && kmMois > 0) {
              const conso = ((litresMois / kmMois) * 100).toFixed(1);
              return <div style={{ fontSize: 12, color: C.orange, marginTop: 4, fontWeight: 700 }}>⛽ {conso} L/100km</div>;
            }
            return null;
          })()}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: C.muted }}>{t.general?.replace("📋 ", "") || "Général"}</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{depMois.filter(d=>d.type==="general").reduce((s,d)=>s+(parseFloat(d.montant)||0),0).toFixed(2)} €</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>{t.carburant?.replace("⛽ ", "") || "Carburant"}</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{depMois.filter(d=>d.type==="carburant").reduce((s,d)=>s+(parseFloat(d.montant)||0),0).toFixed(2)} €</div>
        </div>
      </div>

      <div style={{ display: "flex", background: "rgba(255,255,255,0.06)", borderRadius: 24, padding: 4, marginBottom: 16, gap: 4, border: "1px solid rgba(255,255,255,0.08)" }}>
        <button style={tabStyle(sousOnglet === "general")}   onClick={() => setSousOnglet("general")}>{t.general || "📋 Général"}</button>
        <button style={tabStyle(sousOnglet === "carburant")} onClick={() => setSousOnglet("carburant")}>{t.carburant || "⛽ Carburant"}</button>
      </div>

      {sousOnglet === "general" && (
        <div>
          {depGen.length === 0 && !showForm && <div style={card({ textAlign: "center", padding: 32, color: C.muted })}><div style={{ fontSize: 36, marginBottom: 10 }}>💸</div><div>{t.rienIci || "Rien ici pour l'instant 💸"}</div></div>}
          {depGen.sort((a,b) => new Date(b.date) - new Date(a.date)).map(d => (
            <div key={d.id} style={card({ padding: "10px 14px" })}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{CAT_ICONS[d.categorie] || "💰"}</span>
                <div style={{ flex: 1 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ fontSize: 12, color: C.muted }}>{d.categorie}{d.description ? ` · ${d.description}` : ""} · {new Date(d.date).toLocaleDateString("fr-FR")}</div><div style={{ fontWeight: 800, fontSize: 15, color: C.text }}>{parseFloat(d.montant).toFixed(2)} €</div></div></div>
                <button onClick={() => setConfirmId(d.id)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 14 }}>✕</button>
              </div>
              {confirmId === d.id && (
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button onClick={() => setConfirmId(null)} style={{ flex: 1, background: C.surface, border: "none", borderRadius: 10, padding: "8px 0", color: C.muted, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>Annuler</button>
                  <button onClick={() => { setDepenses(p => p.filter(x => x.id !== d.id)); setConfirmId(null); }} style={{ flex: 1, background: C.red + "22", border: `1px solid ${C.red}44`, borderRadius: 10, padding: "8px 0", color: C.red, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>🗑️ Supprimer</button>
                </div>
              )}
            </div>
          ))}
          {/* Bouton scanner facture */}
          <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "rgba(33,87,255,0.1)", border: `1px solid ${C.blue}44`, borderRadius: 14, padding: 14, cursor: "pointer", marginBottom: 10, color: C.blue, fontWeight: 700, fontSize: 14 }}>
            {scanning ? "⏳ Analyse en cours..." : "📷 Scanner une facture"}
            <input type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={e => {
              const file = e.target.files[0]; if (!file) return;
              const reader = new FileReader();
              reader.onload = ev => scanFacture(ev.target.result);
              reader.readAsDataURL(file);
            }} />
          </label>
          <button style={btn({ background: showForm ? C.surface : C.blue, color: showForm ? C.muted : "white", boxShadow: "none", marginBottom: 12 })} onClick={() => setShowForm(f => !f)}>{showForm ? (t.annuler || "✕ Annuler") : (t.ajouterDepense || "➕ Ajouter une dépense")}</button>
          {showForm && (
            <div style={card({ padding: 20 })}>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 5, fontWeight: 700 }}>{t.date || "DATE"}</div>
              <input type="date" style={input} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 5, fontWeight: 700 }}>{t.categorie || "CATÉGORIE"}</div>
              <select style={input} value={form.categorie} onChange={e => setForm(f => ({ ...f, categorie: e.target.value }))}>{CATEGORIES.map(c => <option key={c} value={c}>{CAT_ICONS[c]} {c}</option>)}</select>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 5, fontWeight: 700 }}>{t.montant || "MONTANT (€)"}</div>
              <input type="number" style={input} placeholder="Ex: 150.00" value={form.montant} onChange={e => setForm(f => ({ ...f, montant: e.target.value }))} />
              {form.categorie === (t.catGarage || "Garage") && (<><div style={{ fontSize: 11, color: C.muted, marginBottom: 5, fontWeight: 700 }}>{t.description || "DESCRIPTION"}</div><input style={input} placeholder="Ex: Vidange + filtre huile" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></>)}
              <button style={btn({ opacity: form.montant && form.date && (form.categorie !== "Garage" || form.description) ? 1 : 0.5 })} onClick={addDepense}>{t.enregistrerDepense || "✅ Enregistrer"}</button>
            </div>
          )}
        </div>
      )}

      {sousOnglet === "carburant" && (
        <div>
          {depCarb.length === 0 && !showForm && <div style={card({ textAlign: "center", padding: 32, color: C.muted })}><div style={{ fontSize: 36, marginBottom: 10 }}>⛽</div><div>{t.premierPlein || "Premier plein à enregistrer ⛽"}</div></div>}
          {coutKm.length > 0 && (
            <div style={card()}>
              <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>{t.coutAuKm || "COÛT AU KM"}</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
                {coutKm.slice(-8).map((p, i) => { const max = Math.max(...coutKm.map(x => x.cout)); const h = max > 0 ? (p.cout / max) * 70 : 0; return <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}><div style={{ fontSize: 9, color: C.muted }}>{p.cout}€</div><div style={{ width: "100%", height: h + "px", borderRadius: "4px 4px 0 0", background: `linear-gradient(180deg, ${C.blue}, ${C.green})`, minHeight: 4 }} /></div>; })}
              </div>
              <div style={{ fontSize: 11, color: C.muted, textAlign: "center", marginTop: 8 }}>{t.moyenne || "Moyenne"} : {(coutKm.reduce((s,p) => s + parseFloat(p.cout), 0) / coutKm.length).toFixed(2)} €/km</div>
            </div>
          )}
          {depCarb.sort((a,b) => new Date(b.date) - new Date(a.date)).map(d => (
            <div key={d.id} style={card({ padding: "10px 14px" })}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>⛽</span>
                <div style={{ flex: 1 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ fontSize: 12, color: C.muted }}>📍 {parseInt(d.km).toLocaleString()} km · {new Date(d.date).toLocaleDateString("fr-FR")}</div><div style={{ fontWeight: 800, fontSize: 15, color: C.text }}>{parseFloat(d.montant).toFixed(2)} €</div></div></div>
                <button onClick={() => setConfirmId(d.id)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 14 }}>✕</button>
              </div>
              {confirmId === d.id && (
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button onClick={() => setConfirmId(null)} style={{ flex: 1, background: C.surface, border: "none", borderRadius: 10, padding: "8px 0", color: C.muted, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>Annuler</button>
                  <button onClick={() => { setDepenses(p => p.filter(x => x.id !== d.id)); setConfirmId(null); }} style={{ flex: 1, background: C.red + "22", border: `1px solid ${C.red}44`, borderRadius: 10, padding: "8px 0", color: C.red, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>🗑️ Supprimer</button>
                </div>
              )}
            </div>
          ))}
          <button style={btn({ background: showForm ? C.surface : C.blue, color: showForm ? C.muted : "white", boxShadow: "none", marginBottom: 12 })} onClick={() => setShowForm(f => !f)}>{showForm ? (t.annuler || "✕ Annuler") : (t.ajouterPlein || "➕ Ajouter un plein")}</button>
          {showForm && (
            <div style={card({ padding: 20 })}>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 5, fontWeight: 700 }}>{t.date || "DATE"}</div>
              <input type="date" style={input} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 5, fontWeight: 700 }}>{t.kilometrageCompteur || "KILOMÉTRAGE DU COMPTEUR"} *</div>
              <input type="number" style={input} placeholder="Ex: 85000" value={form.km} onChange={e => setForm(f => ({ ...f, km: e.target.value }))} />
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 5, fontWeight: 700 }}>{t.prix || "PRIX (€)"}</div>
              <input type="number" style={input} placeholder="Ex: 65.50" value={form.prixCarburant} onChange={e => setForm(f => ({ ...f, prixCarburant: e.target.value }))} />
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 5, fontWeight: 700 }}>LITRES</div>
              <input type="number" style={input} placeholder="Ex: 45.5" value={form.litres} onChange={e => setForm(f => ({ ...f, litres: e.target.value }))} />
              <button style={btn({ opacity: form.prixCarburant && form.date && form.km ? 1 : 0.5 })} onClick={addDepense}>{t.enregistrerPlein || "✅ Enregistrer le plein"}</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── PREMIUM HISTORIQUE ───────────────────────────────────────────
function PremiumHistorique({ active, depenses = [] }) {
  if (!active) return null;

  const myDep = depenses.filter(d => d.vehicleId === active.id);
  const carburant = myDep.filter(d => d.type === "carburant").sort((a, b) => a.km - b.km);
  
  // Total km depuis le début
  const totalKm = carburant.length >= 2
    ? carburant[carburant.length - 1].km - carburant[0].km
    : 0;

  // Total dépenses depuis le début
  const totalDepenses = myDep.reduce((s, d) => s + (parseFloat(d.montant) || 0), 0);

  // Grouper par mois
  const parMois = {};
  myDep.forEach(d => {
    if (!d.date) return;
    const mois = d.date.substring(0, 7); // "2026-04"
    if (!parMois[mois]) parMois[mois] = { depenses: 0, km: 0, carburant: [] };
    parMois[mois].depenses += parseFloat(d.montant) || 0;
    if (d.type === "carburant" && d.km) parMois[mois].carburant.push(parseInt(d.km));
  });

  // Calculer km par mois
  Object.keys(parMois).forEach(mois => {
    const kms = parMois[mois].carburant.sort((a, b) => a - b);
    parMois[mois].km = kms.length >= 2 ? kms[kms.length - 1] - kms[0] : 0;
  });

  const moisTries = Object.keys(parMois).sort().reverse();

  const formatMois = (str) => {
    const [y, m] = str.split("-");
    const noms = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
    return `${noms[parseInt(m) - 1]} ${y}`;
  };

  return (
    <div>
      {/* Total depuis le début */}
      <div style={{ background: "linear-gradient(135deg, #1a2a4a, #2157FF22)", border: `1px solid ${C.blue}33`, borderRadius: 18, padding: 20, marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>DEPUIS LE DÉBUT</div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 32, fontWeight: 900, color: C.orange }}>{totalDepenses.toFixed(0)} €</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Total dépenses</div>
          </div>
          {totalKm > 0 && (
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: C.green }}>{totalKm.toLocaleString()}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>km parcourus</div>
            </div>
          )}
        </div>
      </div>

      {/* Récapitulatif mois par mois */}
      <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>MOIS PAR MOIS</div>
      {moisTries.length === 0 ? (
        <div style={card({ textAlign: "center", padding: 32, color: C.muted })}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>📊</div>
          <div>Pas encore de données</div>
        </div>
      ) : moisTries.map(mois => (
        <div key={mois} style={card({ padding: "14px 16px" })}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{formatMois(mois)}</div>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              {parMois[mois].km > 0 && (
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: C.green }}>{parMois[mois].km.toLocaleString()} km</div>
                </div>
              )}
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.orange }}>{parMois[mois].depenses.toFixed(2)} €</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── HISTORIQUE ───────────────────────────────────────────────────
export function HistoriqueScreen({ active, vehicles, setActive, depenses = [], t = {}, isUltra = true, onShowPremium }) {
  const [onglet, setOnglet] = useState("recent");

  const history = [...(active?.history || [])].reverse();
  const historyRecent = history.slice(0, 10);

  const tabStyle = (on) => ({
    flex: 1, padding: "10px 0", borderRadius: 20, border: "none",
    cursor: "pointer", fontSize: 12, fontWeight: 700,
    background: on ? C.green : C.blue,
    color: on ? "#000" : "white",
    boxShadow: on ? `0 2px 12px ${C.green}44` : `0 2px 8px ${C.blue}44`,
  });

  const getDetails = (actions = []) => {
    const problemes = actions.filter(a => a.item?.includes("→ PROBLEME")).map(a => a.item.replace(" → PROBLEME", "").trim());
    const bientot = actions.filter(a => a.item?.includes("→ BIENTOT")).map(a => a.item.replace(" → BIENTOT", "").trim());
    return { problemes, bientot, hasProb: problemes.length > 0, hasBientot: bientot.length > 0 };
  };

  if (!active) return <div style={{ padding: 40, textAlign: "center", color: C.muted }}><div style={{ fontSize: 48, marginBottom: 12 }}>🕐</div><div style={{ fontWeight: 600 }}>{t.choisirVehicule || "Choisis un véhicule depuis l'accueil"}</div></div>;

  return (
    <div style={{ padding: 16, background: C.bg, minHeight: "100vh" }}>
      {vehicles.length > 1 && (
        <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 14 }}>
          {vehicles.map(v => <VehicleChip key={v.id} v={v} active={active} setActive={setActive} />)}
        </div>
      )}

      {/* Onglets */}
      <div style={{ display: "flex", background: "rgba(255,255,255,0.06)", borderRadius: 24, padding: 4, marginBottom: 16, gap: 4, border: "1px solid rgba(255,255,255,0.08)" }}>
        <button style={tabStyle(onglet === "recent")} onClick={() => setOnglet("recent")}>🕐 Récent</button>
        <button style={tabStyle(onglet === "premium")} onClick={() => isUltra ? setOnglet("premium") : onShowPremium?.()}>
          {isUltra ? "📊 Dépenses & km" : "🔒 Dépenses & km"}
        </button>
      </div>

      {/* Onglet récent */}
      {onglet === "recent" && (
        <>
          {historyRecent.length === 0 ? (
            <div style={card({ textAlign: "center", padding: 32, color: C.muted })}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📋</div>
              <div style={{ fontWeight: 600 }}>{t.pasDeVerif || 'Pas encore de vérif ici'}</div>
              <div style={{ fontSize: 12, marginTop: 6 }}>{t.lancerChecklist || 'Lance ta première checklist !'}</div>
            </div>
          ) : historyRecent.map((entry, i) => {
            const { problemes, bientot, hasProb, hasBientot } = getDetails(entry.actions);
            const okCount = (entry.actions || []).filter(a => a.item?.includes("→ OK")).length;
            const statusColor = hasProb ? C.red : hasBientot ? C.yellow : C.green;
            const statusLabel = hasProb ? "PROBLEME" : hasBientot ? "BIENTOT" : "OK";
            return (
              <div key={i} style={card()}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{entry.date}</span>
                  <span style={{ padding: "3px 12px", borderRadius: 20, fontSize: 11, fontWeight: 800, background: statusColor + "22", color: statusColor }}>{statusLabel}</span>
                </div>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: hasProb || hasBientot ? 10 : 0 }}>✓ {okCount} OK</div>
                {hasBientot && (
                  <div style={{ marginBottom: hasProb ? 8 : 0 }}>
                    {bientot.map((item, j) => (
                      <div key={j} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", marginBottom: 4, background: C.yellow + "15", borderRadius: 10, border: `1px solid ${C.yellow}33` }}>
                        <span style={{ fontSize: 13 }}>⚠️</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: C.yellow }}>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
                {hasProb && (
                  <div>
                    {problemes.map((item, j) => (
                      <div key={j} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", marginBottom: 4, background: C.red + "15", borderRadius: 10, border: `1px solid ${C.red}33` }}>
                        <span style={{ fontSize: 13 }}>🔴</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: C.red }}>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      {/* Onglet Premium - Historique illimité */}
      {onglet === "premium" && (
        <PremiumHistorique active={active} depenses={depenses} />
      )}
    </div>
  );
}

// ─── RAPPORT ──────────────────────────────────────────────────────
export function RapportScreen({ active, checklist, prog, docs, exportPDF, localInvoices, depenses, t = {} }) {
  if (!active) return <div style={{ padding: 40, textAlign: "center", color: C.muted }}><div style={{ fontSize: 48, marginBottom: 12 }}>📊</div><div style={{ fontWeight: 600 }}>{t.choisirVehicule || "Choisis un véhicule depuis l'accueil"}</div></div>;

  const problems = checklist.filter(item => active.checks?.[item.id] === "PROBLEME");
  const vals     = Object.values(active.checks || {});
  const today    = new Date().toLocaleDateString("fr-FR");
  const now2     = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const seen     = new Map();
  const reportDocs = docs.filter(d => !d.vehicleId || d.vehicleId === active.id).sort((a,b) => b.id - a.id).filter(d => { if (seen.has(d.type)) return false; seen.set(d.type, true); return true; });
  const myInvoices = (localInvoices || []).filter(i => !i.vehicleId || i.vehicleId === active.id);

  return (
    <div style={{ padding: 16, background: C.bg, minHeight: "100vh" }}>
      <div style={card({ display: "flex", justifyContent: "space-between", alignItems: "flex-start" })}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, color: C.blue, letterSpacing: 1 }}>CHECKAR</div>
          <div style={{ fontSize: 12, color: C.muted2, marginTop: 2 }}>{t.rapportInspection || "Rapport d'inspection"}</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{t.genere || "Généré le"} {today} {t.a || "à"} {now2}</div>
        </div>
        <button onClick={exportPDF} style={{ background: C.surface2, color: C.text, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "8px 14px", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>⬆ PDF</button>
      </div>

      <div style={card({ padding: "10px 14px", marginBottom: 8 })}>
        <div style={{ fontWeight: 800, fontSize: 17, color: C.text }}>{active.name}</div>
        {active.immat && <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>🪪 {active.immat} · {TYPE_LABELS[active.type]}</div>}
      </div>

      <div style={card({ padding: "10px 14px", marginBottom: 8 })}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 6 }}>
            {[[C.green, vals.includes("OK")],[C.yellow, vals.includes("BIENTOT")],[C.red, vals.includes("PROBLEME")]].map(([c,on],i) => (
              <div key={i} style={{ width: 26, height: 26, borderRadius: "50%", background: on ? c : C.surface2, border: `2px solid ${on ? c + "88" : C.border}`, boxShadow: on ? `0 0 10px ${c}55` : "none" }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 22, fontWeight: 900, color: C.green }}>{prog.ok}</div><div style={{ fontSize: 10, color: C.muted, fontWeight: 700 }}>{t.ok || "OK"}</div></div>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 22, fontWeight: 900, color: C.red }}>{prog.problems}</div><div style={{ fontSize: 10, color: C.muted, fontWeight: 700 }}>PROB.</div></div>
          </div>
        </div>
      </div>

      {(problems.length > 0 || reportDocs.length > 0) && (
        <div style={{ display: "flex", gap: 8 }}>
          {problems.length > 0 && (
            <div style={card({ flex: 1, padding: "12px" })}>
              <div style={{ fontSize: 10, fontWeight: 800, color: C.red, marginBottom: 8, letterSpacing: 0.5 }}>{t.aRegler || "⚠️ À régler"}</div>
              {problems.map(item => <div key={item.id} style={{ fontSize: 12, color: C.text, fontWeight: 600, marginBottom: 6 }}>{item.icon} {item.label}</div>)}
            </div>
          )}
          {reportDocs.length > 0 && (
            <div style={card({ flex: 1, padding: "12px" })}>
              <div style={{ fontSize: 10, fontWeight: 800, color: C.muted2, marginBottom: 8, letterSpacing: 0.5 }}>{t.aNePasOublier || "📅 À ne pas oublier"}</div>
              {reportDocs.map(d => { const col = d.days <= 0 ? C.red : d.days <= 15 ? C.red : d.days <= 30 ? C.yellow : C.green; return <div key={d.id} style={{ marginBottom: 6 }}><div style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>{d.icon} {d.label}</div><div style={{ fontSize: 11, color: col }}>{d.days <= 0 ? (t.expire || "Expiré") : `${t.dans || "Dans"} ${d.days} j`} · {d.date}</div></div>; })}
            </div>
          )}
        </div>
      )}

      <button style={btn()} onClick={exportPDF}>{t.telechargerPDF || "📄 Télécharger le rapport (PDF)"}</button>

      {/* Certificat d'entretien */}
      {(() => {
        const history = active.history || [];
        const depGarage = (depenses || []).filter(d => d.vehicleId === active.id && d.type === "general");
        if (history.length === 0 && depGarage.length === 0) return null;

        // Génération hash unique basé sur les données du véhicule
        const dataToHash = JSON.stringify({
          id: active.id,
          name: active.name,
          immat: active.immat,
          history: history.length,
          depenses: depGarage.length,
          lastUpdate: history[history.length - 1]?.date || "",
        });
        const hash = btoa(dataToHash).substring(0, 32).toUpperCase();
        const certId = `CHK-${active.id.toString().slice(-6)}-${hash.substring(0, 8)}`;
        const today = new Date().toLocaleDateString("fr-FR");

        const certData = {
          certificat: certId,
          vehicule: active.name,
          immat: active.immat || "—",
          verifications: history.length,
          depenses: depGarage.length,
          date: today,
          app: "CHECKAR",
        };
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify(certData))}`;

        return (
          <div style={{ background: "linear-gradient(135deg, #1a2a1a, #0a1a0a)", border: "2px solid #22ff0044", borderRadius: 20, padding: 20, marginTop: 8, textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#22ff00", letterSpacing: 2, marginBottom: 4 }}>🔗 CERTIFICAT D'ENTRETIEN</div>
            <div style={{ fontSize: 10, color: C.muted, marginBottom: 16 }}>Powered by CHECKAR — Bientôt sur Blockchain</div>
            <img src={qrUrl} alt="QR Certificat" style={{ width: 160, height: 160, borderRadius: 12, border: "2px solid #22ff0033" }} />
            <div style={{ marginTop: 12, background: "rgba(0,0,0,0.4)", borderRadius: 10, padding: "10px 14px" }}>
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>ID CERTIFICAT</div>
              <div style={{ fontSize: 12, fontWeight: 900, color: "#22ff00", letterSpacing: 2, fontFamily: "monospace" }}>{certId}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-around", marginTop: 12 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#22ff00" }}>{history.length}</div>
                <div style={{ fontSize: 10, color: C.muted }}>Vérifications</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#22ff00" }}>{depGarage.length}</div>
                <div style={{ fontSize: 10, color: C.muted }}>Interventions</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#22ff00" }}>{today}</div>
                <div style={{ fontSize: 10, color: C.muted }}>Généré le</div>
              </div>
            </div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 12, lineHeight: 1.5 }}>
              Scannez ce QR code pour vérifier l'authenticité du carnet d'entretien
            </div>
          </div>
        );
      })()}

      {myInvoices.length > 0 && (
        <div style={card()}>
          <div style={{ fontSize: 11, fontWeight: 800, color: C.muted2, marginBottom: 12, letterSpacing: 0.5 }}>📁 FACTURES & DOCUMENTS</div>
          {myInvoices.map(inv => {
            const isImg = inv.type?.startsWith("image/"); const isPdf = inv.type === "application/pdf";
            return (
              <div key={inv.id} style={{ background: C.surface2, borderRadius: 10, marginBottom: 8, padding: "10px 14px", border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 22 }}>{isPdf ? "📄" : isImg ? "🖼️" : "📎"}</span>
                    <div><div style={{ fontWeight: 600, fontSize: 13, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: C.text }}>{inv.name}</div><div style={{ fontSize: 11, color: C.muted }}>{inv.size} · {inv.date}</div></div>
                  </div>
                  <button onClick={() => { const a = document.createElement("a"); a.href = inv.data; a.download = inv.name; a.click(); }} style={{ background: C.blueGlow, border: "none", color: C.blue, borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>⬇ Télécharger</button>
                </div>
                {isImg && <img src={inv.data} alt={inv.name} style={{ width: "100%", borderRadius: 8, maxHeight: 160, objectFit: "cover", marginTop: 8 }} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── SECOURS ──────────────────────────────────────────────────────
export function SecoursScreen({ active, setTab, docs, t = {} }) {
  const [section, setSection] = useState(null);

  const stepStyle = (color) => ({
    display: "flex", alignItems: "flex-start", gap: 12,
    background: color + "15", border: `1px solid ${color}33`,
    borderRadius: 14, padding: "12px 14px", marginBottom: 10,
  });

  return (
    <div style={{ padding: 16, background: C.bg, minHeight: "100vh" }}>

      <div style={{ background: "linear-gradient(135deg, #cc0000, #ff1a1a)", borderRadius: 18, padding: "20px 16px", marginBottom: 16, textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🆘</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: "white" }}>{t.boutonSecours || 'BOUTON DE SECOURS'}</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 4 }}>{t.resteCalme || 'Reste calme, on est là. 👊'}</div>
      </div>

      {!section && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={() => setSection("accident")} style={{ background: C.surface, border: `1px solid ${C.red}44`, borderRadius: 16, padding: "18px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left", width: "100%" }}>
            <span style={{ fontSize: 32 }}>🚨</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.red }}>{t.enCasAccident || "En cas d'accident"}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{t.procedureSecurite || "Procédure · Sécurité · Assistance"}</div>
            </div>
            <span style={{ color: C.muted, fontSize: 20 }}>›</span>
          </button>

          <button onClick={() => setSection("constat")} style={{ background: C.surface, border: `1px solid ${C.yellow}44`, borderRadius: 16, padding: "18px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left", width: "100%" }}>
            <span style={{ fontSize: 32 }}>📋</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.yellow }}>{t.guideConstat || "Guide constat européen"}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{t.remplirSansErreur || "Remplir sans erreur étape par étape"}</div>
            </div>
            <span style={{ color: C.muted, fontSize: 20 }}>›</span>
          </button>

          <button onClick={() => setSection("services")} style={{ background: C.surface, border: `1px solid ${C.blue}44`, borderRadius: 16, padding: "18px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left", width: "100%" }}>
            <span style={{ fontSize: 32 }}>📍</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.blue }}>{t.servicesProches || "Services proches"}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{t.procedureSecurite || "Garage · Station service"}</div>
            </div>
            <span style={{ color: C.muted, fontSize: 20 }}>›</span>
          </button>
        </div>
      )}

      {section === "accident" && (
        <div>
          <button onClick={() => setSection(null)} style={{ background: C.surface, border: "none", borderRadius: 12, padding: "8px 14px", color: C.muted, cursor: "pointer", fontSize: 13, marginBottom: 16 }}>{t.retour || "← Retour"}</button>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.red, marginBottom: 14 }}>🚨 {t.procedureAccident || "Procédure accident"}</div>

          {[
            ["1", C.red,    t.accStep1Title || "Sécuriser la zone",      t.accStep1Desc || "Coupez le moteur. Mettez le gilet jaune AVANT de sortir du véhicule. Placez le triangle à 30m minimum."],
            ["2", C.yellow, t.accStep2Title || "Vérifier les blessés",   t.accStep2Desc || "Si blessé grave : appelez le 15 (SAMU) ou le 18 (pompiers). Ne déplacez pas les blessés."],
            ["3", C.blue,   t.accStep3Title || "Appeler les secours",    t.accStep3Desc || "Police/Gendarmerie : 17 · SAMU : 15 · Pompiers : 18 · Numéro européen : 112"],
            ["4", C.green,  t.accStep4Title || "Contacter l'assurance",  t.accStep4Desc || "Déclarez le sinistre dans les 5 jours ouvrés. Remplissez le constat à l'amiable."],
          ].map(([num, col, title, desc]) => (
            <div key={num} style={stepStyle(col)}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: col, color: col === C.yellow || col === C.green ? "black" : "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, flexShrink: 0 }}>{num}</div>
              <div>
                <div style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>{title}</div>
                <div style={{ fontSize: 13, color: C.text, marginTop: 3, fontWeight: 500 }}>{desc}</div>
              </div>
            </div>
          ))}

          <div style={{ background: C.surface, borderRadius: 16, padding: 16, marginTop: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: C.muted, letterSpacing: 1, marginBottom: 12 }}>{t.numerosUrgence || "NUMÉROS D'URGENCE"}</div>
            {[["🚑 SAMU", "15"], ["🚒 Pompiers", "18"], ["👮 Police", "17"], ["🌍 Européen", "112"]].map(([label, num]) => (
              <a key={num} href={`tel:${num}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", textDecoration: "none" }}>
                <span style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{label}</span>
                <span style={{ fontSize: 16, fontWeight: 900, color: C.red }}>📞 {num}</span>
              </a>
            ))}
            {(() => {
              const assDoc = docs.filter(d => d.type === "assurance" && d.vehicleId === active?.id && d.tel);
              if (assDoc.length === 0) return (
                <div style={{ padding: "10px 0", fontSize: 12, color: C.muted, fontStyle: "italic" }}>
                  {t.pasNumeroAssurance || "📋 Pas de numéro d'assurance enregistré"}
                </div>
              );
              return assDoc.map(d => (
                <a key={d.id} href={`tel:${d.tel.replace(/\s/g, "")}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid rgba(255,255,255,0.06)", textDecoration: "none" }}>
                  <span style={{ fontSize: 13, color: C.green, fontWeight: 600 }}>🛡️ {d.org || "Assurance"}</span>
                  <span style={{ fontSize: 16, fontWeight: 900, color: C.green }}>📞 {d.tel}</span>
                </a>
              ));
            })()}
          </div>
        </div>
      )}

      {section === "constat" && (
        <div>
          <button onClick={() => setSection(null)} style={{ background: C.surface, border: "none", borderRadius: 12, padding: "8px 14px", color: C.muted, cursor: "pointer", fontSize: 13, marginBottom: 16 }}>{t.retour || "← Retour"}</button>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.yellow, marginBottom: 14 }}>{t.guideConstatTitle || "📋 Guide constat européen"}</div>

          {[
            ["1", C.blue,   t.conStep1Title || "Date, heure et lieu",            t.conStep1Desc || "Notez la date, l'heure exacte et le lieu précis de l'accident."],
            ["2", C.blue,   t.conStep2Title || "Blessés ?",                      t.conStep2Desc || "Indiquez s'il y a des blessés, même légers."],
            ["3", C.blue,   t.conStep3Title || "Dommages matériels",             t.conStep3Desc || "Cochez si d'autres véhicules ou objets sont endommagés."],
            ["4", C.yellow, t.conStep4Title || "Témoins",                        t.conStep4Desc || "Notez les noms et coordonnées des témoins."],
            ["5", C.yellow, t.conStep5Title || "Véhicule A & B",                 t.conStep5Desc || "Chaque conducteur remplit SA colonne. Vérifiez les infos de l'autre."],
            ["6", C.yellow, t.conStep6Title || "Assurances",                     t.conStep6Desc || "Échangez numéros de contrat, noms des assureurs et coordonnées."],
            ["7", C.green,  t.conStep7Title || "Croquis de l'accident",          t.conStep7Desc || "Faites un schéma simple : position des véhicules, sens de circulation."],
            ["8", C.green,  t.conStep8Title || "Signatures obligatoires",        t.conStep8Desc || "Les DEUX conducteurs doivent signer. Chacun garde son exemplaire."],
            ["9", C.red,    t.conStep9Title || "Ne jamais reconnaître sa faute", t.conStep9Desc || "Ne signez aucun document sans l'accord de votre assureur."],
          ].map(([num, col, title, desc]) => (
            <div key={num} style={stepStyle(col)}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: col, color: col === C.yellow || col === C.green ? "black" : "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, flexShrink: 0 }}>{num}</div>
              <div>
                <div style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>{title}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {section === "services" && (
        <div>
          <button onClick={() => setSection(null)} style={{ background: C.surface, border: "none", borderRadius: 12, padding: "8px 14px", color: C.muted, cursor: "pointer", fontSize: 13, marginBottom: 16 }}>{t.retour || "← Retour"}</button>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.blue, marginBottom: 14 }}>{t.servicesProchesTitle || "📍 Services proches"}</div>

          {[
            { icon: "🔧", label: t.garageDépannage || "Garage / Dépannage", query: "garage+dépannage", color: C.orange },
            { icon: "⛽", label: t.stationService || "Station service",      query: "station+service",  color: C.yellow },
          ].map(({ icon, label, query, color }) => (
            <button key={query} onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  pos => window.open(`https://www.google.com/maps/search/${query}/@${pos.coords.latitude},${pos.coords.longitude},14z`, "_blank"),
                  () => window.open(`https://www.google.com/maps/search/${query}`, "_blank")
                );
              } else {
                window.open(`https://www.google.com/maps/search/${query}`, "_blank");
              }
            }} style={{ background: C.surface, border: `1px solid ${color}33`, borderRadius: 16, padding: "16px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, width: "100%", marginBottom: 10, textAlign: "left" }}>
              <div style={{ width: 46, height: 46, borderRadius: 14, background: color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{label}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{t.googleMapsOuvre || "Google Maps s'ouvre près de toi 📍"}</div>
              </div>
              <span style={{ fontSize: 20, color: C.muted }}>›</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

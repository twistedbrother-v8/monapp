import React, { useState } from "react";
import { STATE_COLOR } from "../config/data";
import { C, card, btn, ITEM_COLORS } from "./shared";

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
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button style={tabStyle(onglet === "verification")} onClick={() => setOnglet("verification")}>
          ✅ {t.checklist || "Vérification"}
        </button>
        <button style={tabStyle(onglet === "diagnostic")} onClick={() => isPremium ? setOnglet("diagnostic") : onShowPremium?.()}>
          🔍 {isPremium ? "Diagnostic IA" : "🔒 Diagnostic IA"}
        </button>
      </div>

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

      {onglet === "diagnostic" && (
        <div>
          <div style={{ background: C.surface, borderRadius: 18, padding: 16, marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 6 }}>🔍 Diagnostic voyants</div>
            <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
              Prends une photo de ton tableau de bord — l'IA identifie les voyants allumés et te dit quoi faire.
            </div>
          </div>

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

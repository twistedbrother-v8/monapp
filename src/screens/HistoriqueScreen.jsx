import React from "react";
import { C, card, VehicleChip } from "./shared";

export function HistoriqueScreen({ active, vehicles, setActive, depenses = [], t = {}, isPremium = true, isUltra = true, onShowPremium }) {
  const allHistory = [...(active?.history || [])].reverse();
  const cutoff3m = (() => { const d = new Date(); d.setMonth(d.getMonth() - 3); return d; })();
  const history = isUltra
    ? allHistory
    : isPremium
      ? allHistory.filter(h => { const [d, m, y] = h.date.split("/"); return new Date(`${y}-${m}-${d}`) >= cutoff3m; })
      : [];
  const historyRecent = history.slice(0, isUltra ? undefined : 50);

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

      {(
        <>
          {!isPremium && (
            <div style={{ background: C.surface, borderRadius: 18, padding: 24, textAlign: "center", border: `1px solid ${C.blue}33`, marginBottom: 14 }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🔒</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 6 }}>Historique verrouillé</div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 16, lineHeight: 1.6 }}>Accédez aux 3 derniers mois avec Premium, ou à l'historique illimité avec Ultra.</div>
              <button onClick={() => onShowPremium?.()} style={{ background: C.blue, border: "none", borderRadius: 14, padding: "12px 24px", color: "white", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>🔒 Voir les plans</button>
            </div>
          )}
          {isPremium && historyRecent.length === 0 ? (
            <div style={card({ textAlign: "center", padding: 32, color: C.muted })}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📋</div>
              <div style={{ fontWeight: 600 }}>{t.pasDeVerif || 'Pas encore de vérif ici'}</div>
              <div style={{ fontSize: 12, marginTop: 6 }}>{t.lancerChecklist || 'Lance ta première checklist !'}</div>
            </div>
          ) : isPremium && historyRecent.map((entry, i) => {
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
    </div>
  );
}

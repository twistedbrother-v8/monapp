import React, { useEffect } from "react";
import { TYPE_LABELS } from "../config/data";
import { C, card, btn } from "./shared";
import { saveCertificat } from "../config/firestore";

export function RapportScreen({ active, checklist, prog, docs, exportPDF, localInvoices, depenses, t = {}, isPremium = true, onShowPremium }) {
  useEffect(() => {
    if (!active) return;
    const historyNow = active.history || [];
    const depGarageNow = (depenses || []).filter(
      d => d.vehicleId === active.id && d.type === "general" && d.categorie === "Garage"
    );
    if (historyNow.length === 0 && depGarageNow.length === 0) return;
    const certId = `CHK-${active.id.toString().slice(-8)}`;
    const today = new Date().toLocaleDateString("fr-FR");
    saveCertificat(certId, {
      vehicleName: active.name,
      vehicleImmat: active.immat || "",
      nbVerif: historyNow.length,
      date: today,
      travaux: depGarageNow.map(d => ({
        date: d.date,
        desc: d.description || d.categorie,
        montant: d.montant,
      })),
    });
  }, [active, depenses]);

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
        <button onClick={isPremium ? exportPDF : () => onShowPremium?.()} style={{ background: isPremium ? C.surface2 : C.purple + "22", color: isPremium ? C.text : C.purple, border: `1px solid ${isPremium ? "rgba(255,255,255,0.08)" : C.purple + "44"}`, borderRadius: 10, padding: "8px 14px", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
          {isPremium ? "⬆ PDF" : "🔒 PDF"}
        </button>
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

      {isPremium
        ? <button style={btn()} onClick={exportPDF}>{t.telechargerPDF || "📄 Télécharger le rapport (PDF)"}</button>
        : <button style={btn({ background: C.purple, boxShadow: `0 4px 20px ${C.purple}55` })} onClick={() => onShowPremium?.()}>🔒 Export PDF — Premium requis</button>
      }

      {(() => {
        const history = active.history || [];
        const depGarage = (depenses || []).filter(d => d.vehicleId === active.id && d.type === "general" && d.categorie === "Garage");
        if (history.length === 0 && depGarage.length === 0) return null;

        const certId = `CHK-${active.id.toString().slice(-8)}`;
        const todayStr = new Date().toLocaleDateString("fr-FR");
        const publicUrl = `https://checkar-4a9ad.web.app/certificat.html?id=${certId}`;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(publicUrl)}`;

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
                <div style={{ fontSize: 20, fontWeight: 900, color: "#22ff00" }}>{todayStr}</div>
                <div style={{ fontSize: 10, color: C.muted }}>Généré le</div>
              </div>
            </div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 12, lineHeight: 1.5 }}>
              Scannez ce QR code pour voir l'historique complet des interventions
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

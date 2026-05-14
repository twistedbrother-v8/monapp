import React, { useState, useEffect } from "react";
import { C } from "./shared";

const GYRO_STYLE_ID = "gyrophare-keyframes";
function injectGyrophareCSS() {
  if (document.getElementById(GYRO_STYLE_ID)) return;
  const s = document.createElement("style");
  s.id = GYRO_STYLE_ID;
  s.textContent = `
    @keyframes gyro-gauche {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0; }
    }
    @keyframes gyro-droit {
      0%, 100% { opacity: 0; }
      50%       { opacity: 1; }
    }
    .gyro-gauche { animation: gyro-gauche 0.6s ease-in-out infinite; }
    .gyro-droit  { animation: gyro-droit  0.6s ease-in-out infinite; }
  `;
  document.head.appendChild(s);
}

export function SecoursScreen({ active, setTab, docs, t = {} }) {
  const [section, setSection] = useState(() => sessionStorage.getItem("secours_section") || null);

  useEffect(() => { injectGyrophareCSS(); }, []);

  const goSection = (s) => { sessionStorage.setItem("secours_section", s || ""); setSection(s); };
  const goBack = () => { sessionStorage.removeItem("secours_section"); setSection(null); };

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
          <button onClick={() => goSection("accident")} style={{ background: C.surface, border: `1px solid ${C.red}44`, borderRadius: 16, padding: "18px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left", width: "100%" }}>
            <span style={{ fontSize: 32 }}>🚨</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.red }}>{t.enCasAccident || "En cas d'accident"}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{t.procedureSecurite || "Procédure · Sécurité · Assistance"}</div>
            </div>
            <span style={{ color: C.muted, fontSize: 20 }}>›</span>
          </button>

          <button onClick={() => goSection("constat")} style={{ background: C.surface, border: `1px solid ${C.yellow}44`, borderRadius: 16, padding: "18px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left", width: "100%" }}>
            <span style={{ fontSize: 32 }}>📋</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.yellow }}>{t.guideConstat || "Guide constat européen"}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{t.remplirSansErreur || "Remplir sans erreur étape par étape"}</div>
            </div>
            <span style={{ color: C.muted, fontSize: 20 }}>›</span>
          </button>

          <button onClick={() => goSection("services")} style={{ background: C.surface, border: `1px solid ${C.blue}44`, borderRadius: 16, padding: "18px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left", width: "100%" }}>
            <span style={{ fontSize: 32 }}>📍</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.blue }}>{t.servicesProches || "Services proches"}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{t.procedureSecurite || "Garage · Station service"}</div>
            </div>
            <span style={{ color: C.muted, fontSize: 20 }}>›</span>
          </button>

          {/* APPEL RAPIDE */}
          <div style={{ marginTop: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: C.muted, letterSpacing: 1, marginBottom: 10 }}>
              {t.appelRapide || "APPEL RAPIDE"}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
              {[
                { num: "15", label: "SAMU" },
                { num: "18", label: "Pompiers" },
                { num: "17", label: "Police" },
                { num: "112", label: "Europe" },
              ].map(({ num, label }) => (
                <a key={num} href={`tel:${num}`} style={{ background: "#5c0000", borderRadius: 14, padding: "14px 10px", textAlign: "center", textDecoration: "none", display: "block" }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: "#ff2222", lineHeight: 1 }}>{num}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "white", marginTop: 4 }}>{label}</div>
                </a>
              ))}
            </div>

            {(() => {
              const assDoc = docs?.filter(d => d.type === "assurance" && d.vehicleId === active?.id && d.tel);
              if (!assDoc || assDoc.length === 0) return (
                <button disabled style={{ background: "#1a3a1a", border: "1px solid #2d5a2d", borderRadius: 14, padding: "14px 16px", width: "100%", cursor: "default", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>🛡️</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#4d7a4d" }}>
                    {t.assurance || "Assurance"} — {t.pasNumeroAssurance || "non renseignée"}
                  </span>
                </button>
              );
              return assDoc.map(d => (
                <a key={d.id} href={`tel:${d.tel.replace(/\s/g, "")}`} style={{ background: "#1a4a1a", border: "1px solid #2d7a2d", borderRadius: 14, padding: "14px 16px", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", textDecoration: "none", boxSizing: "border-box", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 20 }}>🛡️</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.green }}>{d.org || t.assurance || "Assurance"}</div>
                      <div style={{ fontSize: 15, fontWeight: 900, color: "white", marginTop: 1 }}>{d.tel}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 22 }}>📞</span>
                </a>
              ));
            })()}
          </div>
        </div>
      )}

      {section === "accident" && (
        <div>
          <button onClick={goBack} style={{ background: C.surface, border: "none", borderRadius: 12, padding: "8px 14px", color: C.muted, cursor: "pointer", fontSize: 13, marginBottom: 16 }}>{t.retour || "← Retour"}</button>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.red, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <span className="gyro-gauche">🚨</span>
            {(t.procedureAccident || "🚨 Procédure accident").replace(/^🚨\s*/, "")}
            <span className="gyro-droit">🚨</span>
          </div>

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
          <button onClick={goBack} style={{ background: C.surface, border: "none", borderRadius: 12, padding: "8px 14px", color: C.muted, cursor: "pointer", fontSize: 13, marginBottom: 16 }}>{t.retour || "← Retour"}</button>
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
          <button onClick={goBack} style={{ background: C.surface, border: "none", borderRadius: 12, padding: "8px 14px", color: C.muted, cursor: "pointer", fontSize: 13, marginBottom: 16 }}>{t.retour || "← Retour"}</button>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.blue, marginBottom: 14 }}>{t.servicesProchesTitle || "📍 Services proches"}</div>

          {[
            { icon: "🔧", label: t.garageDépannage || "Garage / Dépannage", query: "garage dépannage", color: C.orange },
            { icon: "⛽", label: t.stationService || "Station service",      query: "station service",  color: C.yellow },
          ].map(({ icon, label, query, color }) => (
            <button key={query} onClick={() => {
              window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, '_blank', 'noopener');
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

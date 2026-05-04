// src/components/ShareScreen.jsx
import React, { useState } from "react";
import { createInvitation, applyInvitation } from "../config/firestore";

const C = {
  bg:      "#000000",
  surface: "#3A3A40",
  border:  "rgba(255,255,255,0.08)",
  blue:    "#2157FF",
  green:   "#89fc68",
  red:     "#fc3f35",
  yellow:  "#ffb133",
  text:    "#ffffff",
  muted:   "#8e8e93",
};

export default function ShareScreen({ active, userId, onClose, onVehicleJoined }) {
  const [tab, setTab] = useState("partager");
  const [code, setCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [message, setMessage] = useState(null);
  const [copied, setCopied] = useState(false);

  const tabStyle = (on) => ({
    flex: 1, padding: "10px 0", borderRadius: 20, border: "none",
    cursor: "pointer", fontSize: 12, fontWeight: 700, transition: "all 0.2s",
    background: on ? "white" : C.blue,
    color: on ? "#000" : "white",
    boxShadow: on ? "0 2px 12px rgba(255,255,255,0.2)" : `0 2px 8px ${C.blue}44`,
  });

  const generateCode = async () => {
    if (!active) return;
    setLoading(true);
    const newCode = await createInvitation(userId, active.id, {
      name: active.name, type: active.type, immat: active.immat,
    });
    setCode(newCode);
    setLoading(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const joinVehicle = async () => {
    if (!inputCode.trim()) return;
    setLoading(true);
    setMessage(null);
    const result = await applyInvitation(inputCode.trim().toUpperCase(), userId);
    if (result.success) {
      setMessage({ type: "success", text: `✅ Véhicule "${result.vehicle.name}" ajouté !` });
      setTimeout(() => { onVehicleJoined(); onClose(); }, 2000);
    } else {
      setMessage({ type: "error", text: `❌ ${result.error}` });
    }
    setLoading(false);
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.85)", zIndex: 999,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}>
      <div style={{ background: C.surface, borderRadius: 24, padding: 24, width: "100%", maxWidth: 400 }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>👨‍👩‍👧 Partage familial</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.06)", borderRadius: 24, padding: 4, marginBottom: 20, gap: 4 }}>
          <button style={tabStyle(tab === "partager")} onClick={() => setTab("partager")}>📤 Partager</button>
          <button style={tabStyle(tab === "rejoindre")} onClick={() => setTab("rejoindre")}>📥 Rejoindre</button>
        </div>

        {/* ── PARTAGER ── */}
        {tab === "partager" && (
          <div>
            {active ? (
              <>
                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: "12px 16px", marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: C.muted, fontWeight: 700 }}>VÉHICULE À PARTAGER</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: C.text, marginTop: 4 }}>{active.name}</div>
                  {active.immat && <div style={{ fontSize: 12, color: C.muted }}>{active.immat}</div>}
                </div>

                {!code ? (
                  <button onClick={generateCode} disabled={loading} style={{
                    background: C.blue, color: "white", border: "none", borderRadius: 14,
                    padding: "14px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer",
                    width: "100%", opacity: loading ? 0.6 : 1,
                  }}>
                    {loading ? "⏳ Génération..." : "🔑 Générer un code"}
                  </button>
                ) : (
                  <div>
                    <div style={{ textAlign: "center", marginBottom: 16 }}>
                      <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, marginBottom: 8 }}>CODE D'INVITATION</div>
                      <div style={{
                        fontSize: 36, fontWeight: 900, color: C.blue, letterSpacing: 8,
                        background: "rgba(33,87,255,0.1)", borderRadius: 14, padding: "16px 20px",
                        border: `2px solid ${C.blue}44`,
                      }}>{code}</div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>⚠️ Code à usage unique — valable 1 seule fois</div>
                    </div>

                    <button onClick={copyCode} style={{
                      background: copied ? C.green + "22" : C.surface,
                      border: `1px solid ${copied ? C.green : C.border}`,
                      borderRadius: 14, padding: "13px 20px", fontSize: 14, fontWeight: 700,
                      cursor: "pointer", width: "100%", color: copied ? C.green : C.text, marginBottom: 10,
                    }}>
                      {copied ? "✅ Copié !" : "📋 Copier le code"}
                    </button>

                    <button onClick={() => setCode(null)} style={{
                      background: "none", border: "none", color: C.muted, cursor: "pointer",
                      width: "100%", fontSize: 13, padding: "8px 0",
                    }}>
                      Générer un nouveau code
                    </button>
                  </div>
                )}

                <div style={{ marginTop: 16, fontSize: 12, color: C.muted, textAlign: "center", lineHeight: 1.6 }}>
                  Envoie ce code par WhatsApp ou SMS. La personne l'entre dans l'app pour accéder au véhicule.
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", color: C.muted, padding: 20 }}>
                Sélectionne un véhicule depuis l'accueil d'abord 😊
              </div>
            )}
          </div>
        )}

        {/* ── REJOINDRE ── */}
        {tab === "rejoindre" && (
          <div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 16, lineHeight: 1.6 }}>
              Tu as reçu un code ? Entre-le ici pour accéder au véhicule partagé.
            </div>

            <input
              value={inputCode}
              onChange={e => setInputCode(e.target.value.toUpperCase())}
              placeholder="Ex: AB12CD34"
              style={{
                width: "100%", background: "#1a1a1a", border: `1px solid ${C.border}`,
                borderRadius: 10, padding: "12px 14px", height: 50,
                color: C.text, fontSize: 20, fontWeight: 800, letterSpacing: 4,
                boxSizing: "border-box", outline: "none", colorScheme: "dark",
                textAlign: "center", marginBottom: 12,
              }}
            />

            {message && (
              <div style={{
                background: message.type === "success" ? C.green + "22" : C.red + "22",
                border: `1px solid ${message.type === "success" ? C.green : C.red}44`,
                borderRadius: 10, padding: "10px 14px", marginBottom: 12,
                fontSize: 13, color: message.type === "success" ? C.green : C.red, fontWeight: 600,
              }}>{message.text}</div>
            )}

            <button onClick={joinVehicle} disabled={loading || !inputCode.trim()} style={{
              background: C.blue, color: "white", border: "none", borderRadius: 14,
              padding: "14px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer",
              width: "100%", opacity: loading || !inputCode.trim() ? 0.5 : 1,
            }}>
              {loading ? "⏳ Vérification..." : "✅ Rejoindre le véhicule"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

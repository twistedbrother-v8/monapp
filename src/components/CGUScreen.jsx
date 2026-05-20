// src/components/CGUScreen.jsx
import React, { useState } from "react";

const C = {
  bg:      "#000000",
  surface: "#3A3A40",
  border:  "rgba(255,255,255,0.08)",
  blue:    "#2157FF",
  text:    "#ffffff",
  muted:   "#8e8e93",
  muted2:  "#aeaeb2",
};

export default function CGUScreen({ onClose, onBack, showPrivacy }) {
  const [tab, setTab] = useState(showPrivacy ? "privacy" : "cgu");

  const tabStyle = (on) => ({
    flex: 1, padding: "10px 0", borderRadius: 20, border: "none",
    cursor: "pointer", fontSize: 12, fontWeight: 700, transition: "all 0.2s",
    background: on ? "white" : C.blue,
    color: on ? "#000" : "white",
    boxShadow: on ? "0 2px 12px rgba(255,255,255,0.2)" : `0 2px 8px ${C.blue}44`,
  });

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: C.bg, zIndex: 999, overflowY: "auto",
      fontFamily: "-apple-system, 'SF Pro Display', sans-serif",
      color: C.text, maxWidth: 430, margin: "0 auto",
    }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, background: C.bg, zIndex: 10 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>📋 Mentions légales</div>
        <button onClick={onClose} style={{ background: C.surface, border: "none", borderRadius: 10, padding: "6px 12px", color: C.muted, cursor: "pointer", fontSize: 13 }}>✕ Fermer</button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", background: "rgba(255,255,255,0.06)", borderRadius: 24, padding: 4, margin: "16px 16px 0", gap: 4, border: `1px solid ${C.border}` }}>
        <button style={tabStyle(tab === "cgu")} onClick={() => setTab("cgu")}>📄 CGU</button>
        <button style={tabStyle(tab === "confidentialite")} onClick={() => setTab("confidentialite")}>🔒 Confidentialité</button>
      </div>

      <div style={{ padding: "20px 16px 40px" }}>

        {/* ── CGU ── */}
        {tab === "cgu" && (
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: C.blue, marginBottom: 4 }}>Conditions Générales d'Utilisation</div>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 20 }}>CHECKAR — CheckApp Studio — Dernière mise à jour : mai 2026</div>

            {[
              {
                titre: "1. Présentation",
                texte: "CHECKAR est une application gratuite de gestion et d'entretien de véhicules, éditée par CheckApp Studio (checkapp-studio.fr). Elle permet à l'utilisateur de suivre l'état de ses véhicules, gérer ses documents, ses dépenses et d'accéder à des informations utiles en cas d'urgence.",
              },
              {
                titre: "2. Éditeur",
                texte: "L'application CHECKAR est éditée par CheckApp Studio. Site web : checkapp-studio.fr — Contact : contact@checkapp-studio.fr",
              },
              {
                titre: "3. Accès au service",
                texte: "L'application est accessible gratuitement à toute personne disposant d'un accès internet et d'un compte utilisateur. La création d'un compte nécessite une adresse email valide et un mot de passe. L'utilisateur est seul responsable de la confidentialité de ses identifiants.",
              },
              {
                titre: "4. Utilisation du service",
                texte: "L'utilisateur s'engage à utiliser l'application de manière loyale et conforme à sa destination. Il est interdit d'utiliser le service à des fins illicites, frauduleuses ou contraires aux bonnes mœurs. CheckApp Studio se réserve le droit de suspendre un compte en cas d'utilisation abusive.",
              },
              {
                titre: "5. Responsabilité",
                texte: "Les informations fournies par l'application (procédures d'urgence, guide constat, état du véhicule) sont données à titre indicatif. CheckApp Studio ne saurait être tenu responsable des décisions prises par l'utilisateur sur la base de ces informations. En cas d'urgence, contactez toujours les services officiels (15, 17, 18, 112).",
              },
              {
                titre: "6. Propriété intellectuelle",
                texte: "L'application CHECKAR, son code, son design et son contenu sont la propriété exclusive de CheckApp Studio et sont protégés par les droits de propriété intellectuelle. Toute reproduction, modification ou distribution sans autorisation écrite est interdite.",
              },
              {
                titre: "7. Disponibilité",
                texte: "CheckApp Studio s'efforce d'assurer la disponibilité du service 24h/24 et 7j/7. Cependant, des interruptions peuvent survenir pour maintenance ou en cas de force majeure. Aucune indemnisation ne pourra être réclamée pour ces interruptions.",
              },
              {
                titre: "8. Modification des CGU",
                texte: "CheckApp Studio se réserve le droit de modifier les présentes CGU à tout moment. L'utilisateur sera informé des modifications significatives. La poursuite de l'utilisation du service vaut acceptation des nouvelles conditions.",
              },
              {
                titre: "9. Droit applicable",
                texte: "Les présentes CGU sont soumises au droit français. En cas de litige, et à défaut de résolution amiable, les tribunaux français seront compétents.",
              },
              {
                titre: "10. Contact",
                texte: "Pour toute question concernant ces CGU, contactez CheckApp Studio à l'adresse : contact@checkapp-studio.fr",
              },
            ].map(({ titre, texte }) => (
              <div key={titre} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.blue, marginBottom: 6 }}>{titre}</div>
                <div style={{ fontSize: 13, color: C.muted2, lineHeight: 1.6 }}>{texte}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── CONFIDENTIALITÉ ── */}
        {tab === "confidentialite" && (
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: C.blue, marginBottom: 4 }}>Politique de Confidentialité</div>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 20 }}>CHECKAR — CheckApp Studio — Conforme au RGPD — Mai 2026</div>

            {[
              {
                titre: "1. Responsable du traitement",
                texte: "Le responsable du traitement des données est CheckApp Studio, éditeur de l'application CHECKAR. Contact : contact@checkapp-studio.fr — Site : checkapp-studio.fr",
              },
              {
                titre: "2. Données collectées",
                texte: "CHECKAR collecte uniquement les données nécessaires au fonctionnement du service : adresse email (pour la connexion), données véhicules (nom, immatriculation, type), documents (assurance, contrôle technique, garage), photos de factures, dépenses et historique d'entretien. Aucune donnée bancaire n'est collectée.",
              },
              {
                titre: "3. Finalité de la collecte",
                texte: "Vos données sont utilisées exclusivement pour le fonctionnement de l'application : synchronisation multi-appareils, sauvegarde de vos informations véhicules et génération de rapports d'entretien. Vos données ne sont jamais vendues ni cédées à des tiers.",
              },
              {
                titre: "4. Stockage des données",
                texte: "Vos données sont stockées de manière sécurisée via Firebase (Google Cloud), conforme aux normes européennes de protection des données (RGPD). Les photos de factures sont stockées sur Firebase Storage et accessibles uniquement par votre compte.",
              },
              {
                titre: "5. Localisation",
                texte: "L'application accède à votre position géographique uniquement lorsque vous utilisez la fonction 'Services proches'. Cette donnée n'est pas sauvegardée et sert uniquement à ouvrir Google Maps.",
              },
              {
                titre: "6. Vos droits (RGPD)",
                texte: "Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants : droit d'accès, droit de rectification, droit à l'effacement (droit à l'oubli), droit à la portabilité. Pour exercer ces droits, supprimez votre compte depuis l'application ou écrivez à contact@checkapp-studio.fr.",
              },
              {
                titre: "7. Cookies",
                texte: "CHECKAR n'utilise pas de cookies publicitaires ou de tracking. Seuls des cookies techniques nécessaires au fonctionnement de l'authentification Firebase sont utilisés.",
              },
              {
                titre: "8. Sécurité",
                texte: "CheckApp Studio met en œuvre toutes les mesures techniques appropriées pour protéger vos données contre tout accès non autorisé, perte ou divulgation. Les accès sont sécurisés par authentification Firebase.",
              },
              {
                titre: "9. Durée de conservation",
                texte: "Vos données sont conservées tant que votre compte est actif. En cas de suppression du compte, l'ensemble des données associées est définitivement supprimé dans un délai de 30 jours.",
              },
              {
                titre: "10. Contact",
                texte: "Pour toute question relative à vos données personnelles, contactez CheckApp Studio : contact@checkapp-studio.fr — checkapp-studio.fr",
              },
            ].map(({ titre, texte }) => (
              <div key={titre} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.blue, marginBottom: 6 }}>{titre}</div>
                <div style={{ fontSize: 13, color: C.muted2, lineHeight: 1.6 }}>{texte}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

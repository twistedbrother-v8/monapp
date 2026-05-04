// src/utils/helpers.js
import { getChecklist, getAllCheckIds } from "../config/data";

export function getProgress(vehicle, lang = "fr") {
  if (!vehicle) return { pct: 0, ok: 0, problems: 0, total: 0 };
  const checklist = getChecklist(vehicle.type, lang) || [];
  const ids = getAllCheckIds(checklist);
  let ok = 0, problems = 0;
  ids.forEach(id => {
    const s = vehicle.checks?.[id];
    if (s === "OK") ok++;
    else if (s === "PROBLEME") problems++;
  });
  return {
    pct: ids.length === 0 ? 0 : Math.round((ok / ids.length) * 100),
    ok, problems, total: ids.length,
  };
}

export const statusColor = (d) => {
  if (d?.days === undefined) return "#64748b";
  return d.days <= 15 ? "#ef4444" : d.days <= 30 ? "#f59e0b" : "#22c55e";
};

export const diffInfo = (dateStr) => {
  if (!dateStr) return { diff: 0, color: "#64748b", label: "" };
  const diff  = Math.ceil((new Date(dateStr) - new Date()) / 86400000);
  const color = diff <= 15 ? "#ef4444" : diff <= 30 ? "#f59e0b" : "#22c55e";
  return { diff, color, label: diff > 0 ? `dans ${diff} jours` : "expiré" };
};

export const frDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("fr-FR");

export const frDateLong = (dateStr) =>
  new Date(dateStr).toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

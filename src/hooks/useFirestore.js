import { useState, useEffect, useCallback, useRef } from "react";
import { saveKey, loadAll } from "../config/firestore";

export function useFirestore(userId) {
  const [syncStatus, setSyncStatus] = useState("✅ Synchronisé");
  const timers = useRef({});

  const load = useCallback(async () => {
    if (!userId) return null;
    setSyncStatus("⏳ Chargement...");
    const data = await loadAll(userId);
    setSyncStatus("✅ Synchronisé");
    return data;
  }, [userId]);

  const save = useCallback((key, data, delay = 1000) => {
    if (!userId) return;
    setSyncStatus("💾 Sauvegarde...");
    clearTimeout(timers.current[key]);
    timers.current[key] = setTimeout(async () => {
      await saveKey(userId, key, data);
      setSyncStatus("✅ Synchronisé");
    }, delay);
  }, [userId]);

  useEffect(() => {
    const t = timers.current;
    return () => Object.values(t).forEach(clearTimeout);
  }, []);

  return { load, save, syncStatus };
}

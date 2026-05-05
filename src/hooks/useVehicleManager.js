// src/hooks/useVehicleManager.js
import { useState, useCallback } from "react";
import { removeSharedVehicle } from "../config/firestore";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";

export function useVehicleManager(userId, load, save) {
  const [vehicles, setVehicles] = useState([]);
  const [sharedVehicles, setSharedVehicles] = useState([]);
  const [active, setActive] = useState(null);

  const loadVehicles = useCallback(async (data) => {
    if (!data?.vehicles) return;
    const vs = JSON.parse(data.vehicles);
    const vsWithPhotos = vs.map(v => {
      const checks = { ...v.checks };
      if (checks.pneus) delete checks.pneus;
      const history = (v.history || []).map(h => ({
        ...h,
        actions: (h.actions || []).filter(a => !a.item?.startsWith("Pneus →") && !a.item?.startsWith("Tyres →"))
      })).filter(h => h.actions.length > 0);
      return { ...v, checks, history, photo: localStorage.getItem("photo_" + v.id) || null };
    });
    setVehicles(vsWithPhotos);

    if (data.sharedVehicles) {
      const shared = JSON.parse(data.sharedVehicles);
      const sharedData = await Promise.all(shared.map(async (sv) => {
        try {
          const ownerSnap = await getDoc(doc(db, "autocheck", sv.ownerId));
          if (!ownerSnap.exists()) return null;
          const ownerData = ownerSnap.data();
          if (!ownerData.vehicles) return null;
          const ownerVehicles = JSON.parse(ownerData.vehicles);
          const vehicle = ownerVehicles.find(v => v.id === sv.vehicleId);
          if (!vehicle) return null;
          return { ...vehicle, isShared: true, ownerName: sv.vehicleName };
        } catch { return null; }
      }));
      setSharedVehicles(sharedData.filter(Boolean));
    }
  }, []);

  const addVehicle = useCallback((name, immat, type) => {
    if (!name.trim()) return;
    const v = { id: Date.now(), name: name.trim(), immat: immat.trim().toUpperCase(), type, history: [], checks: {}, garage: { nom: "", tel: "" } };
    setVehicles(prev => [...prev, v]);
    setActive(v);
  }, []);

  const deleteVehicle = useCallback((id, allVehicles, setDocs, setDepenses, save) => {
    const vehicle = allVehicles.find(v => v.id === id);
    if (vehicle?.isShared) return;
    setVehicles(prev => prev.filter(v => v.id !== id));
    setActive(prev => prev?.id === id ? null : prev);
    setDocs(prev => {
      const filtered = prev.filter(d => d.vehicleId !== id);
      save("docs", filtered);
      return filtered;
    });
    setDepenses(prev => {
      const filtered = prev.filter(d => d.vehicleId !== id);
      save("depenses", filtered);
      return filtered;
    });
  }, []);

  const leaveSharedVehicle = useCallback(async (vehicleId, ownerId) => {
    try {
      await removeSharedVehicle(userId, vehicleId, ownerId);
      setSharedVehicles(prev => prev.filter(v => v.id !== vehicleId));
      setActive(prev => prev?.id === vehicleId ? null : prev);
    } catch (e) {
      console.error("Erreur suppression partage:", e);
    }
  }, [userId]);

  const updateCheck = useCallback((itemId, newState, active, checklist) => {
    if (!active) return;
    const today = new Date().toLocaleDateString("fr-FR");
    const findLabel = (id) => {
      for (const item of checklist) {
        if (item.id === id) return item.label;
        if (item.group && item.items) {
          const sub = item.items.find(s => s.id === id);
          if (sub) return sub.label;
        }
      }
      return id;
    };
    const itemLabel = findLabel(itemId);
    const activeId = active.id;
    setVehicles(prev => {
      const updated = prev.map(v => {
        if (v.id !== activeId) return v;
        const newChecks = { ...v.checks, [itemId]: newState };
        const history = [...(v.history || [])];
        const idx = history.findIndex(h => h.date === today);
        const action = { item: `${itemLabel} → ${newState}` };
        if (idx !== -1) {
          const existingIdx = history[idx].actions.findIndex(a => a.item.startsWith(itemLabel + " →"));
          if (existingIdx !== -1) {
            const newActions = [...history[idx].actions];
            newActions[existingIdx] = action;
            history[idx] = { ...history[idx], actions: newActions };
          } else {
            history[idx] = { ...history[idx], actions: [...history[idx].actions, action] };
          }
        } else {
          history.push({ date: today, actions: [action] });
        }
        return { ...v, checks: newChecks, history };
      });
      const newActive = updated.find(v => v.id === activeId);
      if (newActive) setTimeout(() => setActive(newActive), 0);
      return updated;
    });
  }, []);

  const saveVehicle = useCallback((info, active) => {
    if (!active) return;
    setVehicles(prev => {
      const updated = prev.map(v => v.id === active.id ? { ...v, garage: info } : v);
      setActive(updated.find(v => v.id === active.id) ?? null);
      return updated;
    });
  }, []);

  return {
    vehicles, setVehicles,
    sharedVehicles, setSharedVehicles,
    active, setActive,
    loadVehicles,
    addVehicle,
    deleteVehicle,
    leaveSharedVehicle,
    updateCheck,
    saveVehicle,
  };
}

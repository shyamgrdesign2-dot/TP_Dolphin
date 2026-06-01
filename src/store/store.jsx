import { createContext, useContext, useMemo, useState, useCallback } from "react";
import {
  conversations as seedConversations,
  device as seedDevice,
  patientDB,
  todayStats,
} from "../data/mock.js";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [conversations, setConversations] = useState(seedConversations);
  const [device, setDevice] = useState(seedDevice);

  const assignPatient = useCallback((conversationId, patientId) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, assignedPatientId: patientId, status: "assigned" }
          : c
      )
    );
  }, []);

  const unassignPatient = useCallback((conversationId) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, assignedPatientId: null, status: "unassigned" }
          : c
      )
    );
  }, []);

  const toggleTask = useCallback((conversationId, taskIndex) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c;
        const tasks = c.tasks.map((t, i) =>
          i === taskIndex ? { ...t, done: !t.done } : t
        );
        return { ...c, tasks };
      })
    );
  }, []);

  const markCopied = useCallback((conversationId) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId ? { ...c, status: "copied" } : c
      )
    );
  }, []);

  const setDeviceStatus = useCallback((status) => {
    setDevice((d) => ({ ...d, status }));
  }, []);

  const value = useMemo(() => {
    const liveStats = {
      ...todayStats,
      pendingReview: conversations.filter((c) => c.status === "unassigned").length,
      assigned: conversations.filter((c) => c.status !== "unassigned").length,
      conversations: conversations.length,
    };
    return {
      conversations,
      device,
      patientDB,
      stats: liveStats,
      assignPatient,
      unassignPatient,
      toggleTask,
      markCopied,
      setDeviceStatus,
      getConversation: (id) => conversations.find((c) => c.id === id),
      getPatient: (id) => patientDB.find((p) => p.id === id) || null,
    };
  }, [conversations, device, assignPatient, unassignPatient, toggleTask, markCopied, setDeviceStatus]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

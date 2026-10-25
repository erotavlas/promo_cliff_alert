"use client";

import { useCallback, useEffect, useState } from "react";
import type { Subscription, SubscriptionInput } from "./types";

const KEY = "subtracker.v1";

function read(): Subscription[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Subscription[]) : [];
  } catch {
    return [];
  }
}

function write(list: Subscription[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

function newId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// Loads after mount so server-rendered HTML and the first browser render match.
export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSubscriptions(read());
    setLoaded(true);
  }, []);

  const commit = useCallback((next: Subscription[]) => {
    write(next);
    setSubscriptions(next);
  }, []);

  const add = useCallback(
    (input: SubscriptionInput): Subscription => {
      const sub: Subscription = { ...input, id: newId(), status: "active" };
      commit([...read(), sub]);
      return sub;
    },
    [commit],
  );

  // Skips names already stored, so a double click (or a second load) never duplicates.
  const addMany = useCallback(
    (inputs: SubscriptionInput[]) => {
      const existing = read();
      const have = new Set(existing.map((s) => s.name.trim().toLowerCase()));
      const subs = inputs
        .filter((input) => !have.has(input.name.trim().toLowerCase()))
        .map((input): Subscription => ({ ...input, id: newId(), status: "active" }));
      if (subs.length > 0) commit([...existing, ...subs]);
    },
    [commit],
  );

  const change = useCallback(
    (id: string, fn: (s: Subscription) => Subscription) =>
      commit(read().map((s) => (s.id === id ? fn(s) : s))),
    [commit],
  );

  const update = useCallback(
    (id: string, input: SubscriptionInput) =>
      change(id, (s) => ({ ...s, ...input })),
    [change],
  );

  const cancel = useCallback(
    (id: string) =>
      change(id, (s) => ({
        ...s,
        status: "cancelled",
        cancelledAt: new Date().toLocaleDateString("en-CA"), // YYYY-MM-DD, local time
      })),
    [change],
  );

  const restore = useCallback(
    (id: string) =>
      change(id, (s) => ({ ...s, status: "active", cancelledAt: undefined })),
    [change],
  );

  // Only cancelled subscriptions can be deleted (the UI never offers it on active ones).
  const remove = useCallback(
    (id: string) =>
      commit(read().filter((s) => !(s.id === id && s.status === "cancelled"))),
    [commit],
  );

  return { subscriptions, loaded, add, addMany, update, cancel, restore, remove };
}

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

  const addMany = useCallback(
    (inputs: SubscriptionInput[]) => {
      const subs = inputs.map(
        (input): Subscription => ({ ...input, id: newId(), status: "active" }),
      );
      commit([...read(), ...subs]);
    },
    [commit],
  );

  return { subscriptions, loaded, add, addMany };
}

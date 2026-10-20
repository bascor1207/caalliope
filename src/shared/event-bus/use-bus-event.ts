"use client";

import { useEffect, useRef } from "react";
import type { EventName, EventPayload } from "./contracts";
import { eventBus } from "./event-bus";

/** S'abonne à un événement d'intégration le temps de vie du composant. */
export function useBusEvent<N extends EventName>(name: N, handler: (payload: EventPayload<N>) => void) {
  const latest = useRef(handler);
  latest.current = handler;
  useEffect(() => eventBus.subscribe(name, (payload) => latest.current(payload)), [name]);
}

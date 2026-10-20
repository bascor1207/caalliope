import type { EventName, EventPayload } from "./contracts";

export type Unsubscribe = () => void;

export interface EventBus {
  publish<N extends EventName>(name: N, payload: EventPayload<N>): void;
  subscribe<N extends EventName>(name: N, handler: (payload: EventPayload<N>) => void): Unsubscribe;
}

const PREFIX = "koda:";

/**
 * Event bus porté par un EventTarget (window en production).
 * Les slices communiquent par CustomEvent sans se connaître ; les devtools du
 * navigateur voient passer chaque événement (monitorEvents(window, 'koda:cart.line-added')).
 */
export function createEventBus(target: EventTarget): EventBus {
  return {
    publish(name, payload) {
      target.dispatchEvent(new CustomEvent(PREFIX + name, { detail: payload }));
    },
    subscribe(name, handler) {
      const listener = (event: Event) => handler((event as CustomEvent).detail);
      target.addEventListener(PREFIX + name, listener);
      return () => target.removeEventListener(PREFIX + name, listener);
    },
  };
}

/** Côté serveur, aucun bus : publier est un no-op, s'abonner ne fait rien. */
const serverBus: EventBus = { publish: () => undefined, subscribe: () => () => undefined };

export const eventBus: EventBus = typeof window === "undefined" ? serverBus : createEventBus(window);

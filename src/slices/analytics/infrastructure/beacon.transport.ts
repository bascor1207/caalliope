import type { AnalyticsTransport } from "../application/ports";

export const TRACK_ENDPOINT = "/api/track";

/** Transport client : sendBeacon (survit à la fermeture de l'onglet), repli sur fetch keepalive. */
export const beaconTransport: AnalyticsTransport = {
  send(events) {
    const body = JSON.stringify(events);
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      if (navigator.sendBeacon(TRACK_ENDPOINT, new Blob([body], { type: "application/json" }))) return;
    }
    void fetch(TRACK_ENDPOINT, {
      method: "POST",
      body,
      headers: { "content-type": "application/json" },
      keepalive: true,
    }).catch(() => undefined);
  },
};

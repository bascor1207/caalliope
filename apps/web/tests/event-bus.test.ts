import { describe, expect, it, vi } from "vitest";
import { createEventBus } from "@/shared/event-bus";

describe("event bus (CustomEvent sur un EventTarget)", () => {
  it("livre le payload aux abonnés du bon événement seulement", () => {
    const bus = createEventBus(new EventTarget());
    const onAdded = vi.fn();
    const onCleared = vi.fn();
    bus.subscribe("cart.line-added", onAdded);
    bus.subscribe("cart.cleared", onCleared);

    bus.publish("cart.line-added", {
      productId: "p",
      name: "Hoodie",
      colorName: "Sauge",
      size: "M",
      qty: 1,
      count: 1,
      quick: false,
    });

    expect(onAdded).toHaveBeenCalledWith({
      productId: "p",
      name: "Hoodie",
      colorName: "Sauge",
      size: "M",
      qty: 1,
      count: 1,
      quick: false,
    });
    expect(onCleared).not.toHaveBeenCalled();
  });

  it("désabonne proprement", () => {
    const bus = createEventBus(new EventTarget());
    const handler = vi.fn();
    const unsubscribe = bus.subscribe("cart.open-requested", handler);
    unsubscribe();
    bus.publish("cart.open-requested", {});
    expect(handler).not.toHaveBeenCalled();
  });
});

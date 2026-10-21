import { createSlice, type Dispatch, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import type { EventBus, Unsubscribe } from "@/shared/event-bus";

/** Un toast porte une clé de message et ses paramètres ; l'UI traduit. */
export type Toast =
  | { id: string; kind: "cart-added"; params: { name: string; color: string; size: string }; action: "open-cart" }
  | { id: string; kind: "order-placed"; params: { ref: string } }
  | { id: string; kind: "subscribed"; params: Record<string, never> }
  | { id: string; kind: "message"; params: { text: string }; tone: "success" | "error" };

export type NewToast = Toast extends infer T ? (T extends { id: string } ? Omit<T, "id"> : never) : never;

export interface NotificationsState {
  toasts: Toast[];
}

const initialState: NotificationsState = { toasts: [] };

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    toastPushed: {
      reducer(state, action: PayloadAction<Toast>) {
        state.toasts = [...state.toasts.slice(-2), action.payload];
      },
      prepare: (toast: NewToast) => ({ payload: { ...toast, id: nanoid() } as Toast }),
    },
    toastDismissed(state, action: PayloadAction<{ id: string }>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload.id);
    },
  },
  selectors: {
    selectToasts: (state) => state.toasts,
  },
});

export const { toastPushed, toastDismissed } = notificationsSlice.actions;
export const { selectToasts } = notificationsSlice.selectors;
export const notificationsReducer = notificationsSlice.reducer;

/** Bus → store : les notifications écoutent les faits des autres slices sans les connaître. */
export function bindNotificationsToBus(bus: EventBus, dispatch: Dispatch): Unsubscribe {
  const subscriptions = [
    bus.subscribe("checkout.order-placed", (p) =>
      dispatch(toastPushed({ kind: "order-placed", params: { ref: p.ref } })),
    ),
    /* Ajout rapide depuis la collection : un toast avec « Voir le panier », la modale reste fermée. */
    bus.subscribe("cart.line-added", (p) => {
      if (p.quick) {
        dispatch(
          toastPushed({
            kind: "cart-added",
            params: { name: p.name, color: p.colorName, size: p.size },
            action: "open-cart",
          }),
        );
      }
    }),
    bus.subscribe("newsletter.subscribed", () => dispatch(toastPushed({ kind: "subscribed", params: {} }))),
    bus.subscribe("ui.notify", (p) =>
      dispatch(toastPushed({ kind: "message", params: { text: p.text }, tone: p.tone })),
    ),
  ];
  return () => {
    for (const unsubscribe of subscriptions) unsubscribe();
  };
}

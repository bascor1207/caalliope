import { createAsyncThunk, createSlice, type Dispatch, type TypedStartListening } from "@reduxjs/toolkit";
import type { EventBus } from "@/shared/event-bus";
import type { Order, ValidationErrors } from "../domain/order";
import type { PlaceOrderGateway, PlaceOrderInput } from "./ports";

interface Deps {
  bus: EventBus;
  placeOrderGateway: PlaceOrderGateway;
}

export interface CheckoutState {
  status: "idle" | "submitting" | "placed" | "rejected";
  errors: ValidationErrors;
  lastOrder: Order | null;
}

const initialState: CheckoutState = { status: "idle", errors: {}, lastOrder: null };

/** Thunk : soumet via la gateway injectée. En cas d'erreurs métier, rejette avec les codes. */
export const submitOrder = createAsyncThunk<Order, PlaceOrderInput, { extra: Deps; rejectValue: ValidationErrors }>(
  "checkout/submitOrder",
  async (input, api) => {
    try {
      const result = await api.extra.placeOrderGateway.place(input);
      return result.ok ? result.order : api.rejectWithValue(result.errors);
    } catch {
      return api.rejectWithValue({ cart: "network" });
    }
  },
);

export const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    checkoutReset: () => initialState,
  },
  extraReducers: (build) => {
    build
      .addCase(submitOrder.pending, (state) => {
        state.status = "submitting";
        state.errors = {};
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.status = "placed";
        state.lastOrder = action.payload;
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.status = "rejected";
        state.errors = action.payload ?? { cart: "network" };
      });
  },
  selectors: {
    selectCheckoutStatus: (state) => state.status,
    selectCheckoutErrors: (state) => state.errors,
    selectLastOrder: (state) => state.lastOrder,
  },
});

export const { checkoutReset } = checkoutSlice.actions;
export const { selectCheckoutStatus, selectCheckoutErrors, selectLastOrder } = checkoutSlice.selectors;
export const checkoutReducer = checkoutSlice.reducer;

/** Store → bus : une commande enregistrée est un fait que le panier et les notifications consomment. */
export function registerCheckoutListeners<S extends { checkout: CheckoutState }, D extends Dispatch, E extends Deps>(
  startListening: TypedStartListening<S, D, E>,
) {
  startListening({
    actionCreator: submitOrder.rejected,
    effect: (action, api) => {
      for (const code of Object.values(action.payload ?? { cart: "network" })) {
        if (code) api.extra.bus.publish("checkout.failed", { code });
      }
    },
  });
  startListening({
    actionCreator: submitOrder.fulfilled,
    effect: (action, api) => {
      const order = action.payload;
      api.extra.bus.publish("checkout.order-placed", {
        ref: order.ref,
        total: order.total,
        subtotal: order.subtotal,
        shipping: order.shipping,
        discount: 0,
        email: order.customer.email,
        items: order.lines.map((l) => ({
          productId: l.productId,
          colorKey: l.colorKey,
          size: l.size,
          qty: l.qty,
          price: l.unitPrice,
        })),
      });
    },
  });
}

import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { addLine, type Cart, countOf, emptyCart, type NewCartLine, removeLine, setQty, totalsOf } from "../domain/cart";

export interface CartState extends Cart {
  isOpen: boolean;
}

const initialState: CartState = { ...emptyCart(), isOpen: false };

/** Les reducers délèguent toute règle au domaine ; la slice ne fait que porter l'état. */
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    lineAdded(state, action: PayloadAction<{ line: NewCartLine; qty?: number }>) {
      state.lines = addLine(state, action.payload.line, action.payload.qty).lines;
    },
    qtySet(state, action: PayloadAction<{ key: string; qty: number }>) {
      state.lines = setQty(state, action.payload.key, action.payload.qty).lines;
    },
    lineRemoved(state, action: PayloadAction<{ key: string }>) {
      state.lines = removeLine(state, action.payload.key).lines;
    },
    cleared(state, _action: PayloadAction<{ reason: "order-placed" | "user" }>) {
      state.lines = [];
    },
    opened(state) {
      state.isOpen = true;
    },
    closed(state) {
      state.isOpen = false;
    },
  },
  selectors: {
    selectLines: (state) => state.lines,
    selectIsCartOpen: (state) => state.isOpen,
  },
});

export const { lineAdded, qtySet, lineRemoved, cleared, opened, closed } = cartSlice.actions;
export const { selectLines, selectIsCartOpen } = cartSlice.selectors;
export const selectCartCount = createSelector([selectLines], (lines) => countOf({ lines }));
export const selectCartTotals = createSelector([selectLines], (lines) => totalsOf({ lines }));
export const cartReducer = cartSlice.reducer;

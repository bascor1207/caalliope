import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { addLine, type Cart, countOf, emptyCart, type NewCartLine, removeLine, setQty, totalsOf } from "../domain/cart";

export interface LastAdded extends NewCartLine {
  qty: number;
}

export interface CartState extends Cart {
  isOpen: boolean;
  /** Dernier article ajouté : alimente la modale de confirmation / recommandations. */
  lastAdded: LastAdded | null;
  isAddedDialogOpen: boolean;
}

const initialState: CartState = { ...emptyCart(), isOpen: false, lastAdded: null, isAddedDialogOpen: false };

/** Les reducers délèguent toute règle au domaine ; la slice ne fait que porter l'état. */
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /** `quiet` : ajout rapide depuis la collection, confirmé par un toast (la modale reste fermée). */
    lineAdded(state, action: PayloadAction<{ line: NewCartLine; qty?: number; quiet?: boolean }>) {
      state.lines = addLine(state, action.payload.line, action.payload.qty).lines;
      state.lastAdded = { ...action.payload.line, qty: action.payload.qty ?? 1 };
      state.isAddedDialogOpen = !action.payload.quiet;
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
      state.isAddedDialogOpen = false;
    },
    closed(state) {
      state.isOpen = false;
    },
    addedDialogClosed(state) {
      state.isAddedDialogOpen = false;
    },
  },
  selectors: {
    selectLines: (state) => state.lines,
    selectIsCartOpen: (state) => state.isOpen,
    selectLastAdded: (state) => state.lastAdded,
    selectIsAddedDialogOpen: (state) => state.isAddedDialogOpen,
  },
});

export const { lineAdded, qtySet, lineRemoved, cleared, opened, closed, addedDialogClosed } = cartSlice.actions;
export const { selectLines, selectIsCartOpen, selectLastAdded, selectIsAddedDialogOpen } = cartSlice.selectors;
export const selectCartCount = createSelector([selectLines], (lines) => countOf({ lines }));
export const selectCartTotals = createSelector([selectLines], (lines) => totalsOf({ lines }));
export const cartReducer = cartSlice.reducer;

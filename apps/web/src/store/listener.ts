import type { TypedStartListening } from "@reduxjs/toolkit";
import type { AppDispatch, RootState, StoreDeps } from "./types";

/** Signature du `startListening` typé que chaque slice reçoit pour brancher ses réactions (store → bus). */
export type AppStartListening = TypedStartListening<RootState, AppDispatch, StoreDeps>;

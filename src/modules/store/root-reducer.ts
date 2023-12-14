import { combineReducers } from '@reduxjs/toolkit';
import { catalogReducer } from "@/modules/catalog/catalog.reducer";

export const rootReducer = combineReducers({ catalog: catalogReducer });


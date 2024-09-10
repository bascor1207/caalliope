import { createListenerMiddleware } from '@reduxjs/toolkit'


import type { RootState, AppDispatch } from '@/modules/app/core/store/create-store'
import type { TypedStartListening } from '@reduxjs/toolkit'
import type { AddListenerOverloads } from '@reduxjs/toolkit/src/listenerMiddleware/types';


export const listenerMiddleware = createListenerMiddleware();

export type AppStartListening = TypedStartListening<RootState, AppDispatch>;

export type EnhancedStartListening = AddListenerOverloads<void, RootState, AppDispatch>;

export const startAppListening: EnhancedStartListening = listenerMiddleware.startListening as EnhancedStartListening;

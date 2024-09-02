import { createListenerMiddleware, addListener } from '@reduxjs/toolkit'

import type { RootState, AppDispatch } from '@/modules/app/core/store/create-store'
import type { TypedStartListening, TypedAddListener } from '@reduxjs/toolkit'


export const listenerMiddleware = createListenerMiddleware()

export type AppStartListening = TypedStartListening<RootState, AppDispatch>

export const startAppListening =
    listenerMiddleware.startListening as AppStartListening

export const addAppListener = addListener as TypedAddListener<
    RootState,
    AppDispatch
>

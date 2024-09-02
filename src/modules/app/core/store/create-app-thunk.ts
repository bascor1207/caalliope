import { createAsyncThunk } from '@reduxjs/toolkit';

import type { AppDispatch,
  Dependencies,
  RootState, } from '@/modules/app/core/store/create-store'
import type { AsyncThunk, AsyncThunkPayloadCreator } from '@reduxjs/toolkit';

export function createAppAsyncThunk<RType, Payload = void>(
    typePrefix: string,
    payloadCreator: AsyncThunkPayloadCreator<RType, Payload, {
        state: RootState;
        dispatch: AppDispatch;
        extra: Dependencies;
        rejectValue?: unknown;
        serializedErrorType?: unknown;
        pendingMeta?: unknown;
        fulfilledMeta?: unknown;
        rejectedMeta?: unknown;
    }>
): AppAsyncThunk<RType, Payload> {
    return createAsyncThunk<RType, Payload, {
        state: RootState;
        dispatch: AppDispatch;
        extra: Dependencies;
        rejectValue?: unknown;
        serializedErrorType?: unknown;
        pendingMeta?: unknown;
        fulfilledMeta?: unknown;
        rejectedMeta?: unknown;
    }>(typePrefix, payloadCreator);
}


export type AppAsyncThunk<RType, T> = AsyncThunk<
    RType,
    T,
    {
      state: RootState;
      dispatch: AppDispatch;
      extra: Dependencies;
      rejectValue?: unknown;
      serializedErrorType?: unknown;
      pendingMeta?: unknown;
      fulfilledMeta?: unknown;
      rejectedMeta?: unknown;
    }
>;

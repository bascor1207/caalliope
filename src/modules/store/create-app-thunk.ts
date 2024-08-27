import { AsyncThunk, AsyncThunkPayloadCreator, createAsyncThunk } from '@reduxjs/toolkit';
import {
  AppDispatch,
  Dependencies,
  RootState,
} from '@/modules/store/create-store'

export function createAppAsyncThunk<RType = null, Payload>(
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

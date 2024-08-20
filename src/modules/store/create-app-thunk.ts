import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import {
  AppDispatch,
  Dependencies,
  RootState,
} from '@/modules/store/create-store'

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
  extra: Dependencies;
}>();

export type AppAsyncThunk = AsyncThunk<
    unknown,
    void,
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

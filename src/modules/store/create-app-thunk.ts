import { createAsyncThunk } from '@reduxjs/toolkit';
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

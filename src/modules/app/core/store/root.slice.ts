import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
    language: 'en' | 'fr';
}

const initialState: InitialState = {
    language: 'en',
};

export const rootSlice = createSlice({
    name: 'root',
    initialState,
    reducers: {
        setLanguage: (state, action: PayloadAction<'en' | 'fr'>) => {
            state.language = action.payload;
        },
    },
});

export const { setLanguage } = rootSlice.actions;
'use client';
import { NextUIProvider } from '@nextui-org/react';
import React from 'react';
import { Provider } from 'react-redux';

import type { RootState } from '@/modules/app/core/store/create-store';
import type { ReactNode } from 'react';

import { clientApp } from '@/modules/main.client';



export const AppWrapper = ({ children, initialState }: { children: ReactNode, initialState: RootState }) => {
    const store = clientApp(initialState).store;

    return (
        <NextUIProvider className='min-h-svh w-svw' locale='fr-FR'>
            <Provider store={store}>{ children }</Provider>
        </NextUIProvider>
    )
};

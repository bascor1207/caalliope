'use client';
import { Provider } from 'react-redux';
import { clientApp } from '@/modules/main.client';
import React, { ReactNode } from 'react';
import { NextUIProvider } from '@nextui-org/react';
import { RootState } from '@/modules/app/core/store/create-store';

export const AppWrapper = ({ children, initialState }: { children: ReactNode, initialState: RootState }) => {
    const store = clientApp(initialState).store;

    return (
        <NextUIProvider className='min-h-svh w-svw' locale='fr-FR'>
            <Provider store={store}>{ children }</Provider>
        </NextUIProvider>
    )
};

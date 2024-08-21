'use client';
import { Provider } from 'react-redux';
import { app } from '@/modules/main';
import React, { ReactNode } from 'react';
import { NextUIProvider } from '@nextui-org/react';
import nookies from 'nookies';
import { loggUser } from '@/modules/auth/core/store/auth.slice';

export const AppWrapper = ({ children }: { children: ReactNode }) => {
    const cookies = nookies.get(null);
    const token = cookies.token;

    if (token) {
        app.store.dispatch(loggUser())
    }

    return (
        <NextUIProvider className='min-h-svh w-svw' locale='fr-FR'>
            <Provider store={app.store}>{ children }</Provider>
        </NextUIProvider>
    )
};

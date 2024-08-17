'use client';
import { Provider } from 'react-redux';
import { app } from '@/modules/main';
import React, { ReactNode } from 'react';
import { NextUIProvider } from '@nextui-org/react'

export const AppWrapper = ({ children }: { children: ReactNode }) => {
    return (
        <NextUIProvider className='min-h-svh w-svw' locale='fr-FR'>
            <Provider store={app.store}>{ children }</Provider>;
        </NextUIProvider>
    )
};

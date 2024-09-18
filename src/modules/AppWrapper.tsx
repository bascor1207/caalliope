'use client';
import { NextUIProvider } from '@nextui-org/react';
import React, { useMemo } from 'react';
import { Provider } from 'react-redux';

import type { RootState } from '@/modules/app/core/store/create-store';
import type { ReactNode } from 'react';

import { clientApp } from '@/modules/main.client';

export const AppWrapper = ({ children, initialState, locale }: { children: ReactNode, initialState: RootState, locale: string }) => {
    const store = useMemo(() => clientApp(initialState).store, [initialState]);
    const fullLocale = `${locale}-${locale.toUpperCase()}`

    return (
        <NextUIProvider className='min-h-svh w-svw' locale={fullLocale}>
            <Provider store={store}>{ children }</Provider>
        </NextUIProvider>
    )
};

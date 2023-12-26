'use client';
import { Provider } from 'react-redux';
import { app } from '@/modules/main';
import React, { ReactNode } from 'react';

export const AppWrapper = ({ children }: { children: ReactNode }) => {
    return <Provider store={app.store}>{children}</Provider>;
};

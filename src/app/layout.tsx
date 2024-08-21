import type { Metadata } from 'next';
import React, { FC, PropsWithChildren } from 'react';

import { AppWrapper } from '@/modules/AppWrapper';

import './globals.css';
import { Footer } from '@/modules/ui/app-level/Footer';
import { Header } from '@/modules/ui/app-level/Header';
import { Modals } from '@/modules/ui/app-level/modals';
import { ssrApp } from '@/modules/main.ssr';
import { loggUser } from '@/modules/auth/core/store/auth.slice';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export const metadata: Metadata = {
    title: 'Caalliope',
    description: 'Your very first intuitive online bibliothèque',
};

const RootLayout: FC<PropsWithChildren> = async ({ children }) => {
    const cookieBag = cookies();
    const token = cookieBag.get('token')?.value
    const store = ssrApp.store

    if (token) {
        try {
            const { payload } = await jwtVerify(token, new TextEncoder().encode('mysecretkey'));
            // payload contient les informations décodées du token
            // store.dispatch(getUser(payload.id));
        } catch (error) {
            console.error('Échec de la vérification du token:', error);
        }
    }

    const initialState = JSON.parse(JSON.stringify(store.getState()));

    return (
        <html lang='fr' suppressHydrationWarning>
        <body className='light min-h-screen flex flex-col bg-background font-sans antialiased overflow-x-hidden'>
        <AppWrapper initialState={initialState}>
            <Modals/>

            {/* Layout Container */}
            <div className='flex flex-col min-h-screen'>
                <Header/>

                {/* Main content */}
                <main className='flex-grow p-4 sm:p-6 md:p-8 lg:p-12 bg-custom-grey w-full max-w-full z-0'>
                    {children}
                </main>

                {/* Footer */}
                <footer className='w-full p-4 sm:p-6 md:p-8 lg:p-12 bg-gray-800 text-white text-center'>
                    <Footer/>
                </footer>
            </div>
        </AppWrapper>
        </body>
        </html>
    );
};

export default RootLayout;

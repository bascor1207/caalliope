import { cookies } from 'next/headers';
import React from 'react';

import type { FC, PropsWithChildren } from 'react';

import { prefetchRootLayout } from '@/app/[locale]/prefetchRootLayout';
import { initI18next } from '@/app/i18n/server';
import { Footer } from '@/modules/app/ui/app-level/Footer';
import { Header } from '@/modules/app/ui/app-level/Header';
import { Modals } from '@/modules/app/ui/app-level/modals';
import { AppWrapper } from '@/modules/AppWrapper';

import './globals.css';

export async function generateMetadata() {
    return {
        title: 'Caalliope',
        description: 'Your very first intuitive online library',
        icons: '/favico.png',
        metadataBase: new URL('https://caalliope.vercel.app'),
    }
}

const RootLayout: FC<PropsWithChildren> = async ({ children }) => {
    const language = cookies().get('i18next')?.value || 'fr';
    await initI18next(language as 'en' | 'fr', 'translation');
    const initialState = await prefetchRootLayout()

    return (
        <html lang={language} suppressHydrationWarning>
            <body className='light min-h-screen flex flex-col bg-background font-sans antialiased overflow-x-hidden'>
            <AppWrapper initialState={initialState} locale={language}>
                <Modals/>

                {/* Layout Container */}
                <div className='flex flex-col min-h-screen'>
                    <Header/>

                    {/* Main content */}
                    <main className='flex-grow p-4 sm:p-6 md:p-8 lg:p-12 bg-custom-grey w-full max-w-full z-0'>
                        {children}
                    </main>

                    {/* Footer */}
                    <footer className='w-full p-4 sm:p-6 md:p-8 lg:p-12 bg-custom-purple text-center'>
                        <Footer/>
                    </footer>
                </div>
            </AppWrapper>
            </body>
        </html>
);
};

export default RootLayout;

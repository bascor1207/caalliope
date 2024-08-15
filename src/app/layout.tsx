import type { Metadata } from 'next';
import React, { FC, PropsWithChildren } from 'react';

import { AppWrapper } from '@/modules/AppWrapper';

import './globals.css';
import { Footer } from '@/modules/ui/app-level/Footer';
import { Header } from '@/modules/ui/app-level/Header';
import { Modals } from '@/modules/ui/app-level/modals';

export const metadata: Metadata = {
    title: 'Caalliope',
    description: 'Your very first intuitive online bibliothèque',
};

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
    return (
        <html lang='fr' suppressHydrationWarning>
            <body className='light min-h-screen flex flex-col bg-background font-sans antialiased'>
                <AppWrapper>
                    <Modals />

                    {/* Main Content Area */}
                    <div className='flex flex-col flex-grow'>
                        <Header />

                        {/* Main content */}
                        <main className='flex-grow p-4 sm:p-6 md:p-8 lg:p-12 bg-custom-grey'>
                            {children}
                        </main>
                    </div>

                    {/* Footer */}
                    <footer className='w-full p-4 sm:p-6 md:p-8 lg:p-12 bg-gray-800 text-white text-center'>
                        <Footer />
                    </footer>
                </AppWrapper>
            </body>
        </html>
    )
};

export default RootLayout;

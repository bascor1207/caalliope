'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { cn } from '@/lib/utils/core/cn';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';

export function SidebarComponent() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {!open && (
            <div
                onMouseEnter={() => setOpen(!open)}
                className='p-2 bg-primary text-white fixed top-4 left-4 z-50 flex items-center justify-center'
            >
                <svg
                    className='w-6 h-6'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M4 6h16M4 12h16m-7 6h7'
                    />
                </svg>
            </div>
            )}

            {/* Sidebar Overlay */}
            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: open ? 0 : '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={cn(
                    'fixed top-0 left-0 h-full bg-secondary/70 z-40 shadow-lg flex flex-col opacity-100',
                    'border-r border-gray-300',
                    open ? 'block' : 'hidden'
                )}
            >
                <Sidebar open={open} setOpen={setOpen}>
                    <SidebarBody className='justify-between gap-10 p-4'>
                        <div className='flex flex-col flex-1 overflow-x-hidden overflow-y-auto'>
                             <SidebarLogo/>
                                <div className='flex flex-col gap-2 mt-8'>
                            {LINKS_ITEMS.map((link, idx) => (
                                <SidebarLink key={idx} link={link}/>
                        ))}
                    </div>
                </div>
            </SidebarBody>
        </Sidebar>
</motion.div>
</>
)
    ;
}

const SidebarLogo = () => {
    return (
        <Link
            href='#'
            className='relative z-20 flex items-center py-1 space-x-2 text-sm font-normal text-black'
        >
            <div className='flex-shrink-0 w-6 h-5 bg-black rounded-tl-lg rounded-tr-sm rounded-bl-sm rounded-br-lg dark:bg-white' />
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='font-medium text-black whitespace-pre dark:text-white'
            >
                Lorem ipsum
            </motion.span>
        </Link>
    );
};

const LINKS_ITEMS = [
    {
        label: 'Profile',
        href: '/my-account',
        icon: (
            <Image
                src='/user.webp'
                alt='Mon compte'
                width={36}
                height={36}
            />
        ),
    },
    {
        label: 'My books',
        href: '/my-books',
        icon: (
            <Image
                src='/my-books.webp'
                alt='logo'
                width={36}
                height={36}
            />
        ),
    },
    {
        label: 'Logout',
        href: '#',
        icon: (
            <Image
                src='/logo.png'
                alt='logo'
                width={36}
                height={36}
            />
        ),
    },
];

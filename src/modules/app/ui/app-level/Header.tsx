'use client';

import {
 Avatar, Button, Select, SelectItem, Link
} from '@nextui-org/react';
import Image from 'next/image';
import { useTransition } from 'react';
import { twMerge } from 'tailwind-merge';

import { CustomSpinner } from '@/modules/app/ui/app-level/custom.spinner';
import { useHeader } from '@/modules/app/ui/app-level/useHeader';
import { CustomNavBar } from '@/modules/app/ui/component-level/custom.navbar';
import { AuthModel } from '@/modules/auth/core/model/auth.model';
import { toggleAuthModal } from '@/modules/auth/core/store/auth.slice';

export const Header = () => {
    const presenter = useHeader()
    const [isLoading, startTransition] = useTransition();

    const handleRouteChange = (url?: string) => {
        startTransition(() => url ?
            presenter.router.push(url) :
            presenter.router.push(`/${presenter.locale}/catalog`)
        );
    }

    return (
        <>
        {isLoading && <CustomSpinner />}
            <CustomNavBar
                renderLogo={() => (
                    <Link href={`/${presenter.locale}`}>
                        <Image src='/logo.png' alt={presenter.t('navbar.homePage')} width={150} height={150} />
                    </Link>
                )}
                renderMenuToggle={() => (
                    <Image src='/menu.svg' alt={presenter.t('navbar.menuIcon')} width={36} height={36} />
                )}
                renderRightContent={() => (
                    <>
                        <Select
                            className='bg-custom-grey w-1/4'
                            size='sm'
                            radius='sm'
                            aria-label={presenter.t('navbar.changeLanguage')}
                            defaultSelectedKeys={[presenter.locale as string]}
                            onChange={presenter.changeLanguage()}
                            items={presenter.languages}
                        >
                            {(language) => (
                                <SelectItem
                                    key={language.shortKeyForTrad}
                                    startContent={<Avatar alt={presenter.t(`navbar.${language.shortKeyForTrad}`)} className='w-4 h-4' src={`https://flagcdn.com/${language.shortKeyForSVG}.svg`} />}
                                >
                                    {presenter.t(`navbar.${language.shortKeyForTrad}`)}
                                </SelectItem>)}
                        </Select>
                        <Button
                            radius='md'
                            size='md'
                            onPress={() => handleRouteChange()}
                            variant='light'
                            className={twMerge(
                                'text-custom-dark-purple px-8',
                                'hover:text-black hover:bg-custom-grey',
                                'transition duration-150'
                            )}>
                            {presenter.t('navbar.catalog')}
                        </Button>

                        {!presenter.loggedUser && (
                            <>
                                <Button
                                    radius='md'
                                    size='md'
                                    onPress={() => presenter.dispatch(toggleAuthModal({ visible: true, type: AuthModel.AUTH_TYPES.SIGN_IN }))}
                                    variant='light'
                                    className={twMerge(
                                        'text-custom-dark-purple px-8',
                                        'hover:text-black hover:bg-custom-grey',
                                        'transition duration-150'
                                    )}>
                                    {presenter.t('navbar.signIn')}
                                </Button>

                                <Button
                                    radius='md'
                                    size='md'
                                    variant='light'
                                    onPress={() => presenter.dispatch(toggleAuthModal({ visible: true, type: AuthModel.AUTH_TYPES.SIGN_UP }))}
                                    className={twMerge(
                                        'text-custom-dark-purple px-8',
                                        'hover:text-black hover:bg-custom-grey',
                                        'transition duration-150'
                                    )}>
                                    {presenter.t('navbar.signUp')}
                                </Button>
                            </>
                        )}
                    </>
                )}
                renderMenuContent={() => (
                    <>
                        {presenter.linkItems.map((item, idx) => (
                            item.type === 'link' ? (
                                <Link
                                    as={Button}
                                    onPress={() => handleRouteChange(item.href)}
                                    href={item.href}
                                    className={twMerge('flex items-center bg-transparent justify-start gap-2 py-2 transition duration-150 hover:text-custom-dark-purple opacity-100')}
                                    key={idx}
                                >
                                    <span className='text-gray-900 text-sm whitespace-pre hover:text-custom-dark-purple'>
                                        {presenter.t(item.label)}
                                    </span>
                                </Link>
                            ) : (
                                <Button
                                    className={twMerge('flex items-center justify-start gap-2 py-2 bg-transparent transition duration-150 hover:text-custom-dark-purple opacity-100')}
                                    key={idx} onPress={() => item.onPress?.()}
                                >
                                     <span className='text-gray-900 text-sm whitespace-pre hover:text-custom-dark-purple'>
                                        {presenter.t(item.label)}
                                    </span>
                                </Button>
                            )
                            ))}
                        </>
                )}
                showMenu={true}
            />
        </>
    );
}

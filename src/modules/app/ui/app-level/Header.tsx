'use client';

import Image from 'next/image';
import { Avatar, Button, Select, SelectItem, Link } from '@nextui-org/react';
import { twMerge } from 'tailwind-merge';
import { CustomNavBar } from '@/modules/app/ui/component-level/custom.navbar';
import { toggleAuthModal } from '@/modules/auth/core/store/auth.slice';
import { AuthModel } from '@/modules/auth/model/auth.model';
import { useHeader } from '@/modules/app/ui/app-level/useHeader';

export const Header = () => {
    const presenter = useHeader()

    return (
        <CustomNavBar
            renderLogo={() => (
                <Link href='/'>
                    <Image src='/logo.png' alt={presenter.t('navbar.homePage')} width={200} height={200} />
                </Link>
            )}
            renderMenuToggle={() => (
                <Image src='/menu.svg' alt={presenter.t('navbar.menuIcon')} width={36} height={36} />
            )}
            renderRightContent={() => (
                <>
                    <Select
                        defaultSelectedKeys={[presenter.t(`navbar.${presenter.i18n.language}`)]}
                        className='bg-custom-grey w-1/4'
                        labelPlacement='inside'
                        size='sm'
                        radius='sm'
                        aria-label={presenter.t('navbar.changeLanguage')}
                        onChange={presenter.changeLanguage()}
                    >
                        {presenter.languages.map((language) => {
                            const shortKeyForSVG = language === 'English' ? 'gb' : 'fr';
                            const shortKeyForTrad = language === 'English' ? 'en' : 'fr';
                            return (
                                <SelectItem
                                    key={language}
                                    startContent={
                                        <Avatar alt={presenter.t(`navbar.${language}`)} className='w-4 h-4' src={`https://flagcdn.com/${shortKeyForSVG}.svg`} />
                                    }
                                >
                                    {presenter.t(`navbar.${shortKeyForTrad}`)}
                                </SelectItem>
                            )
                        })}
                    </Select>
                    <Button
                        radius='md'
                        size='md'
                        onPress={() => presenter.router.push('/catalog')}
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
                                href={item.href}
                                className={twMerge('flex items-center justify-start gap-2 py-2 transition duration-150 hover:text-custom-dark-purple opacity-100')}
                                key={idx}
                            >
                                <span className='text-gray-900 text-sm whitespace-pre hover:text-custom-dark-purple'>
                                    {presenter.t(item.label)}
                                </span>
                            </Link>
                        ) : (
                            <Button
                                className={twMerge('flex items-center justify-start gap-2 py-2 transition duration-150 hover:text-custom-dark-purple opacity-100')}
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
    );
}

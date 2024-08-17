'use client';
import React, { ChangeEvent, useState } from 'react';
import {
    Navbar,
    NavbarContent,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarBrand, Select, SelectItem
} from '@nextui-org/react';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';

type CustomNavBarProps = {
    renderLogo?: () => React.ReactNode;
    renderMenuToggle?: () => React.ReactNode;
    renderLeftContent?: () => React.ReactNode;
    renderCenterContent?: () => React.ReactNode;
    renderRightContent?: () => React.ReactNode;
    renderMenuContent?: () => React.ReactNode;
    showMenu?: boolean;
    isMenuOpen?: boolean;
    setIsMenuOpen?: (isOpen: boolean) => void;
    onMenuOpenChange?: (isOpen: boolean) => void;
};

export const CustomNavBar: React.FC<CustomNavBarProps> = ({
  renderLogo,
  renderMenuToggle,
  renderLeftContent,
  renderCenterContent,
  renderRightContent,
  renderMenuContent,
  showMenu = true,
  isMenuOpen: isMenuOpenProp,
  setIsMenuOpen: setIsMenuOpenProp,
  onMenuOpenChange,
  }) => {
    const [isMenuOpenState, setIsMenuOpenState] = useState(false);

    const isMenuOpen = isMenuOpenProp !== undefined ? isMenuOpenProp : isMenuOpenState;
    const setIsMenuOpen = setIsMenuOpenProp !== undefined ? setIsMenuOpenProp : setIsMenuOpenState;

    const handleMenuOpenChange = (open: boolean) => {
        setIsMenuOpen(open);
        if (onMenuOpenChange) {
            onMenuOpenChange(open);
        }
    };

    return (
        <Navbar
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={handleMenuOpenChange}
            className={twMerge('z-10 flex items-center justify-between w-full px-8')}
        >
            <NavbarContent className={twMerge('flex items-center justify-start')}>
                {renderMenuToggle && showMenu && (
                    <NavbarMenuToggle
                        onMouseEnter={() => setIsMenuOpen(true)}
                        className='ml-4'
                    >
                        {renderMenuToggle()}
                    </NavbarMenuToggle>
                )}
                {renderLeftContent && renderLeftContent()}
            </NavbarContent>

            {renderLogo && (
                <NavbarBrand className='flex justify-center items-center w-full'>
                    {renderLogo()}
                </NavbarBrand>
            )}

            <NavbarContent className={twMerge('sm:flex gap-4 items-center')}>
                {renderCenterContent && renderCenterContent()}
                {renderRightContent && renderRightContent()}
            </NavbarContent>

            {showMenu && (
                <NavbarMenu
                    className={twMerge('w-1/4 min-h-screen overflow-hidden bg-opacity-50 bg-custom-grey text-text-custom-color z-50')}
                    onMouseLeave={() => setIsMenuOpen(false)}
                >
                    <div className='flex flex-col gap-2 mt-14 pl-4 opacity-100'>
                        {renderMenuContent && renderMenuContent()}
                    </div>
                </NavbarMenu>
            )}
        </Navbar>
    );
};

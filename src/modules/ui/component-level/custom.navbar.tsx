'use client';
import React, { useState } from 'react';
import {
    Navbar,
    NavbarContent,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarBrand
} from '@nextui-org/react';
import { twMerge } from 'tailwind-merge';

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
            className={twMerge('z-10 px-8 py-4 bg-custom-purple shadow-md')}
            classNames={{ wrapper: 'max-w-full' }}
            shouldHideOnScroll
            onClick={() => setIsMenuOpen(false)}
        >
            <NavbarContent justify='start'>
                {renderMenuToggle && showMenu && (
                    <NavbarMenuToggle
                        onMouseEnter={() => setIsMenuOpen(true)}
                        className='ml-4'
                        icon={renderMenuToggle()}
                    />
                )}
                {renderLeftContent && renderLeftContent()}
            </NavbarContent>

            {renderLogo && (
                <NavbarContent justify='center'>
                    <NavbarBrand>
                        {renderLogo()}
                    </NavbarBrand>
                </NavbarContent>
            )}

            <NavbarContent justify='end'>
                {renderCenterContent && renderCenterContent()}
                {renderRightContent && renderRightContent()}
            </NavbarContent>

            {showMenu && (
                <NavbarMenu
                    className={twMerge('w-1/4 min-h-screen bg-opacity-50 bg-custom-grey text-custom-dark-purple z-50')}
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

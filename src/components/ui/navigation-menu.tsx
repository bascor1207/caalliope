import type { PropsWithChildren } from 'react';

import { clx } from '@/lib/utils/clx/clx-merge';
import { cn } from '@/lib/utils/core/cn';
import { cva } from '@/lib/utils/core/cva';
import ChevronDown from '@/components/icons/chevron-down';
// Primitives are CLI-installed by default, but @radix-ui can also be used
import * as NavigationMenuPrimitive from '@/components/primitives/navigation-menu';

const NavigationMenuLink = NavigationMenuPrimitive.Link;
const NavigationMenuItem = NavigationMenuPrimitive.Item;

const navigationMenuTriggerStyle = cva(
  'group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50',
);

const NavigationMenuContent = clx(
  NavigationMenuPrimitive.Content,
  'left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto',
);

const NavigationMenuViewportRoot = clx(
  NavigationMenuPrimitive.Viewport,
  'origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border border-gray-200 bg-white text-gray-950 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)] dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50',
);

const NavigationMenuIndicatorRoot = clx(
  NavigationMenuPrimitive.Indicator,
  'top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in',
);

const NavigationMenuRoot = clx(
  NavigationMenuPrimitive.Root,
  'relative z-10 flex max-w-max flex-1 items-center justify-center',
);

function NavigationMenu({ children }: PropsWithChildren) {
  return (
    <NavigationMenuRoot>
      {children}
      <NavigationMenuViewport />
    </NavigationMenuRoot>
  );
}

const NavigationMenuListRoot = clx(
  NavigationMenuPrimitive.List,
  'group flex flex-1 list-none items-center justify-center space-x-1',
);

function NavigationMenuList({ children }: PropsWithChildren) {
  return <NavigationMenuListRoot>{children}</NavigationMenuListRoot>;
}

function NavigationMenuIndicator() {
  return (
    <NavigationMenuIndicatorRoot>
      <div className='relative top-[60%] size-2 rotate-45 rounded-tl-sm bg-gray-200 shadow-md dark:bg-gray-800' />
    </NavigationMenuIndicatorRoot>
  );
}

//
const NavigationMenuTriggerRoot = clx(NavigationMenuPrimitive.Trigger, 'group');

function NavigationMenuTrigger({ children, ...props }: PropsWithChildren) {
  return (
    <NavigationMenuTriggerRoot className={cn(navigationMenuTriggerStyle())} {...props}>
      {children}
      <ChevronDown
        className='w-6 h-6 relative top-[1px] ml-1 transition duration-200 group-data-[state=open]:rotate-180'
        aria-hidden='true'
      />
    </NavigationMenuTriggerRoot>
  );
}

//

const ViewportWrapper = clx.div('absolute left-0 top-full flex justify-center');

function NavigationMenuViewport({ ...props }: any) {
  return (
    <ViewportWrapper>
      <NavigationMenuViewportRoot {...props} />
    </ViewportWrapper>
  );
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
};

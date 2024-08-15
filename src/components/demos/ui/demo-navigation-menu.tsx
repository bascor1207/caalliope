"use client";

import Link from "next/link";

import { clx } from "@/lib/utils/clx/clx-merge";
import { Flex } from "@/components/ui/containers";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

type TODO = any;

export default function DemoNavigationMenu() {
  return (
    <Flex className="h-[200px] items-start justify-start">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>UI</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="z-55 grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {UI_COMPONENTS.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>Motion</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="z-55 grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {MOTION_COMPONENTS.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/examples" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Examples
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </Flex>
  );
}

function ListItem({ title, children, ...props }: TODO) {
  const Anchor = clx.a(
    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50",
  );

  return (
    <li>
      <NavigationMenuLink asChild>
        <Anchor {...props}>
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-sm leading-snug line-clamp-2 text-gray-500 dark:text-gray-400">
            {children}
          </p>
        </Anchor>
      </NavigationMenuLink>
    </li>
  );
}

/*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
/*                        CONSTANTS                           */
/*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

const UI_COMPONENTS: { title: string; href: string; description: string }[] = [
  {
    title: "Accordion",
    href: "/components/ui/accordion",
    description:
      "A vertically stacked set of interactive headings that each reveal a section content.",
  },
  {
    title: "Avatar",
    href: "/components/ui/avatar",
    description: "An image element with a fallback for representing the user.",
  },
  {
    title: "Badge",
    href: "/components/ui/badge",
    description: "Displays a badge or component that looks like badge.",
  },
  {
    title: "Button",
    href: "/components/ui/button",
    description: "Displays a button or component that looks like button.",
  },
];

const MOTION_COMPONENTS: {
  title: string;
  href: string;
  description: string;
}[] = [
  {
    title: "Aurora Hero",
    href: "/components/motion/aurora-hero",
    description: "Displays a motion background looking like an aurora.",
  },
  {
    title: "Bouncing Line",
    href: "/components/motion/bouncing-line",
    description: "Displays a line that bounce when hovering it.",
  },
];

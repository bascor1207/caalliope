import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/** Link, redirect, usePathname, useRouter et getPathname conscients de la locale et des chemins localisés. */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);

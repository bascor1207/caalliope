import type { ComponentProps } from "react";
import { cn } from "./cn";

/** Placeholder de chargement : même gabarit que le contenu attendu, animation douce, invisible aux lecteurs d'écran. */
export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return <div aria-hidden="true" className={cn("animate-pulse rounded-[12px] bg-ink/8", className)} {...props} />;
}

/** Squelette d'une carte produit (grille, résultats, recommandations). */
export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-[16px] border border-line bg-white sm:rounded-card", className)}>
      <Skeleton className="aspect-[4/5] rounded-none" />
      <div className="grid gap-2.5 p-3 sm:px-[18px] sm:pt-4 sm:pb-[18px]">
        <div className="flex items-start justify-between gap-3">
          <div className="grid flex-1 gap-1.5">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-3 w-2/5" />
          </div>
          <Skeleton className="h-4 w-14" />
        </div>
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="size-[22px] rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

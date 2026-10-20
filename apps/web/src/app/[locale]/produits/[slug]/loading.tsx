import { ProductCardSkeleton, Skeleton } from "@/shared/ui";

export default function Loading() {
  return (
    <div className="container-k pt-10 pb-[clamp(72px,10vw,128px)]">
      <Skeleton className="mb-7 h-4 w-56" />
      <div className="grid items-start gap-8 md:grid-cols-[minmax(0,460px)_minmax(0,1fr)] md:gap-12 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)]">
        <div className="grid gap-3">
          <Skeleton className="aspect-[4/5] rounded-card" />
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="aspect-[4/5] w-14 rounded-[10px] md:w-16" />
            ))}
          </div>
        </div>
        <div className="grid content-start gap-6">
          <div className="grid gap-3">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-7 w-24" />
          </div>
          <Skeleton className="h-16" />
          <div className="flex gap-2.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="size-[30px] rounded-full" />
            ))}
          </div>
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-11 w-[52px] rounded-[10px]" />
            ))}
          </div>
          <Skeleton className="h-14 rounded-full" />
        </div>
      </div>
      <div className="mt-24 grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-5">
        {[0, 1, 2].map((i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

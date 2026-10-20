import { Skeleton } from "@/shared/ui";

export default function Loading() {
  return (
    <div className="container-k pt-10 pb-[clamp(72px,10vw,128px)]">
      <div className="mx-auto max-w-[760px]">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 mb-6 h-12 w-2/3" />
        <Skeleton className="mb-7 h-14 rounded-full" />
        <div className="grid gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="grid grid-cols-[72px_1fr_auto] items-center gap-4 rounded-[18px] border border-line p-3"
            >
              <Skeleton className="aspect-[4/5] w-[72px]" />
              <div className="grid gap-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { Skeleton } from "@/components/skeleton";

/** Squelette du dashboard pendant la lecture du store. */
export default function Loading() {
  return (
    <main className="mx-auto w-[min(1360px,100%-40px)] py-10 md:py-12">
      <div className="flex items-end justify-between gap-4">
        <div className="grid gap-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-10 w-72" />
        </div>
        <Skeleton className="h-10 w-44 rounded-full" />
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 md:gap-5 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="h-36 rounded-card" />
        ))}
      </div>
      <Skeleton className="mt-8 h-80 rounded-card" />
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-64 rounded-card" />
        <Skeleton className="h-64 rounded-card" />
      </div>
    </main>
  );
}

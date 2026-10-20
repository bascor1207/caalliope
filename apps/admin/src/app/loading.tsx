import { Skeleton } from "@/components/skeleton";

/** Squelette du dashboard pendant la lecture du store. */
export default function Loading() {
  return (
    <main className="mx-auto w-[min(1200px,100%-32px)] py-8">
      <div className="flex items-end justify-between gap-4">
        <div className="grid gap-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-10 w-72" />
        </div>
        <Skeleton className="h-10 w-44 rounded-full" />
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="h-28 rounded-card" />
        ))}
      </div>
      <Skeleton className="mt-6 h-72 rounded-card" />
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-64 rounded-card" />
        <Skeleton className="h-64 rounded-card" />
      </div>
    </main>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 overflow-hidden rounded-card bg-card shadow-sm">
        <Skeleton className="h-48 w-full sm:h-64" />
        <div className="relative px-6 pb-6 sm:px-8 sm:pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
            <div className="relative -mt-16 flex items-end sm:-mt-24">
              <Skeleton className="h-32 w-32 rounded-full border-4 border-card sm:h-48 sm:w-48" />
              <div className="ml-4 pb-4">
                <Skeleton className="mb-2 h-8 w-48 rounded-md" />
                <Skeleton className="h-5 w-32 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Skeleton className="h-12 w-full rounded-md" />
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-card" />
            ))}
          </div>
        </div>
        <Skeleton className="h-96 w-full rounded-card" />
      </div>
    </div>
  );
}

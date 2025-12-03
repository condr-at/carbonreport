import { Skeleton } from '@/components/ui/skeleton';

export function ProjectTabSkeleton() {
  return (
    <div className="space-y-6" aria-busy>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-xl border bg-card p-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-4" />
              </div>
              <div className="space-y-3 pt-4">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="space-y-2 border-b pb-4">
            <Skeleton className="h-5 w-52" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="max-h-[546px] space-y-4 overflow-hidden pt-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-56" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-start justify-between border-b pb-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-9 w-28" />
          </div>
          <div className="max-h-[546px] space-y-3 overflow-hidden pt-4">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="flex items-start gap-3">
                <Skeleton className="mt-1 h-5 w-5 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

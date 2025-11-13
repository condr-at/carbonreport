import { Skeleton } from '@/components/ui/skeleton';

export default function ReportLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2">
          {[1,2,3,4].map(i => (
            <Skeleton key={`section-skel-${i}`} className="h-28 w-full" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-12 w-full" />
        {[1,2,3,4,5,6,7,8].map(i => (
          <Skeleton key={`row-skel-${i}`} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}

import { Skeleton, SkeletonText } from "./Skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12" role="status" aria-label="Loading dashboard">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      {/* Score + Progress + Stats row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Carbon score card skeleton */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-10 w-36" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <div className="mb-4">
            <div className="flex justify-between mb-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-2.5 w-full rounded-full" />
          </div>
          <div className="space-y-2 pt-3 border-t border-gray-100">
            <Skeleton className="h-3 w-20" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>

        {/* Progress card skeleton */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
        </div>

        {/* Quick stats card skeleton */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-4 w-14" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart + Recommendations row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Chart card skeleton */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <Skeleton className="h-5 w-40 mb-4" />
          <div className="flex items-center justify-center h-[280px]">
            <Skeleton className="h-48 w-48 rounded-full" />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-28" />
            </div>
          </div>
        </div>

        {/* AI recommendations card skeleton */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <SkeletonText lines={6} />
        </div>
      </div>

      {/* History timeline skeleton */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <Skeleton className="h-5 w-28 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
              <div className="flex items-center gap-3">
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-3 w-28" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

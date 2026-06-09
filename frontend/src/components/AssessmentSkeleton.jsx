import { Skeleton } from "./Skeleton";

export default function AssessmentSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16" role="status" aria-label="Loading assessment">
      {/* Header skeleton */}
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <Skeleton className="h-8 w-72 mx-auto mb-3" />
        <Skeleton className="h-4 w-56 mx-auto" />
      </div>

      {/* Form skeleton */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
          {/* Transport field */}
          <div>
            <Skeleton className="h-4 w-48 mb-2" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>

          {/* Electricity field */}
          <div>
            <Skeleton className="h-4 w-52 mb-2" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>

          {/* Diet selector */}
          <div>
            <Skeleton className="h-4 w-44 mb-2" />
            <div className="grid grid-cols-3 gap-3 mt-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          </div>

          {/* Flights field */}
          <div>
            <Skeleton className="h-4 w-52 mb-2" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>

          {/* Shopping field */}
          <div>
            <Skeleton className="h-4 w-56 mb-2" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>

        {/* Submit button skeleton */}
        <Skeleton className="h-14 w-full rounded-xl" />
      </div>

      {/* Subtle loading indicator */}
      <div className="text-center mt-6">
        <div className="inline-flex items-center gap-2 text-sm text-gray-400">
          <div className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: "300ms" }} />
          <span className="ml-1">Calculating your carbon footprint...</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useCars } from "@/hooks/useCars";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { CollectionTimeline } from "@/components/CollectionTimeline";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function TimelinePage() {
  const { cars, loading } = useCars();

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-400">Loading timeline...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="p-8 border-b border-gray-700 bg-[#1a1a1a]">
        <h1 className="text-4xl font-bold text-[#eee] mb-2">
          Collection Timeline
        </h1>
        <p className="text-gray-400">
          Track your Hot Wheels collection growth, milestones, and acquisitions over time.
        </p>
      </div>

      <ErrorBoundary>
        <CollectionTimeline cars={cars} />
      </ErrorBoundary>
    </div>
  );
}

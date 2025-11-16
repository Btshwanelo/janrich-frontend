import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/untitled-card';

export const LoadingState: React.FC = () => {
  return (
    <div
      className="flex-1 p-4 lg:p-8 bg-gray-50"
      role="status"
      aria-label="Loading dashboard content"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Loading Chart */}
        <Card className="lg:col-span-2 border-none">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div>
                <div
                  className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"
                  aria-hidden="true"
                />
                <div
                  className="h-4 bg-gray-200 rounded w-64 animate-pulse"
                  aria-hidden="true"
                />
              </div>
              <div
                className="h-8 w-8 bg-gray-200 rounded animate-pulse"
                aria-hidden="true"
              />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div
              className="h-64 bg-gray-200 rounded animate-pulse"
              aria-hidden="true"
            />
          </CardContent>
        </Card>

        {/* Loading Goal Card */}
        <Card className="border-none">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div
                className="h-6 bg-gray-200 rounded w-32 animate-pulse"
                aria-hidden="true"
              />
              <div
                className="h-8 w-8 bg-gray-200 rounded animate-pulse"
                aria-hidden="true"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-6">
              <div
                className="h-64 w-64 bg-gray-200 rounded-full animate-pulse"
                aria-hidden="true"
              />
            </div>
            <div className="space-y-3">
              <div
                className="h-4 bg-gray-200 rounded w-full animate-pulse"
                aria-hidden="true"
              />
              <div
                className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"
                aria-hidden="true"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loading Table */}
      <Card className="border-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div
              className="h-6 bg-gray-200 rounded w-32 animate-pulse"
              aria-hidden="true"
            />
            <div
              className="h-8 bg-gray-200 rounded w-24 animate-pulse"
              aria-hidden="true"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-12 bg-gray-200 rounded animate-pulse"
                aria-hidden="true"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

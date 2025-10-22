import React, { memo } from 'react';
import { MoreHorizontal, FileText } from 'lucide-react';
import { Button } from '@/components/base/buttons/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/untitled-card';
import { ChartDataItem } from '@/types/dashboard';
import { DASHBOARD_CONSTANTS } from '@/constants/dashboard';

interface SavingsBreakdownChartProps {
  chartData: ChartDataItem[];
}

export const SavingsBreakdownChart: React.FC<SavingsBreakdownChartProps> = memo(({
  chartData,
}) => {
  return (
    <Card className="lg:col-span-2 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
              Savings breakdown
            </CardTitle>
            <p className="text-sm text-gray-600">
              Keep track of your savings and interest earned.
            </p>
          </div>
          <Button color="tertiary" size="sm" aria-label="More options">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Chart Area */}
        <div className="overflow-x-auto">
          <div 
            className="h-64 flex items-end justify-between gap-2 sm:gap-4 mb-6 px-2 sm:px-4 min-w-[600px]"
            role="img"
            aria-label="Monthly savings breakdown chart"
          >
            {chartData.map((item, index) => (
              <div
                key={`chart-item-${item.month}-${index}`}
                className="flex flex-col items-center flex-1 min-w-[40px]"
                role="img"
                aria-label={`${item.month}: ${item.blue} saved, ${item.orange} interest, ${item.gray} other`}
              >
                <div
                  className="w-full flex flex-col items-center relative"
                  style={{ height: `${DASHBOARD_CONSTANTS.CHART_HEIGHT}px` }}
                >
                  <div className="w-full flex flex-col justify-end items-center h-full gap-0.5">
                    <div
                      className="w-8 sm:w-12 bg-gray-200 rounded-t"
                      style={{
                        height: `${(item.gray / DASHBOARD_CONSTANTS.CHART_SCALE_FACTOR) * DASHBOARD_CONSTANTS.CHART_HEIGHT}px`,
                      }}
                    />
                    <div
                      className="w-8 sm:w-12 bg-blue-600 rounded-t"
                      style={{
                        height: `${(item.blue / DASHBOARD_CONSTANTS.CHART_SCALE_FACTOR) * DASHBOARD_CONSTANTS.CHART_HEIGHT}px`,
                      }}
                    />
                    <div
                      className="w-8 sm:w-12 bg-orange-500"
                      style={{
                        height: `${(item.orange / DASHBOARD_CONSTANTS.CHART_SCALE_FACTOR) * DASHBOARD_CONSTANTS.CHART_HEIGHT}px`,
                      }}
                    />
                  </div>
                </div>
                <span className="text-xs text-gray-600 mt-3 font-medium">
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-500 justify-center align-middle items-center flex mb-4 px-4">
          Month
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <Button
            color="secondary"
            size="md"
            className="gap-2"
            iconLeading={<FileText className="w-4 h-4" />}
          >
            <span>Get statement</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

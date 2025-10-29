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
  // Calculate maximum value for y-axis scale
  const maxValue = Math.max(
    ...chartData.map((item) => item.blue + item.orange + item.gray),
    1
  );

  // Generate y-axis tick values (5 ticks from 0 to maxValue)
  const generateYAxisTicks = () => {
    const ticks: number[] = [];
    const tickCount = 5;
    for (let i = 0; i < tickCount; i++) {
      ticks.push((maxValue / (tickCount - 1)) * i);
    }
    return ticks;
  };

  const yAxisTicks = generateYAxisTicks();

  // Format number for display
  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `R${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `R${(value / 1000).toFixed(0)}K`;
    }
    return `R${value.toFixed(0)}`;
  };

  return (
    <Card className="lg:col-span-2 shadow-sm">
      <CardHeader className="pb-4 border-b border-gray-200">
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
          <div className="flex gap-4 min-w-[600px]">
            {/* Y-Axis Title and Labels */}
            <div className="flex items-center gap-2 shrink-0">
              <div
                className="text-xs text-[#535862] whitespace-nowrap"
                style={{ 
                  writingMode: "vertical-rl", 
                  textOrientation: "mixed",
                  // transform: "scaleY(-1)"
                }}
              >
                Savings
              </div>
              <div className="flex flex-col justify-between h-64 pb-6">
                {yAxisTicks.reverse().map((tick, index) => (
                  <div
                    key={`y-axis-tick-${index}`}
                    className="text-xs text-gray-600 font-medium"
                    style={{
                      height: `${
                        DASHBOARD_CONSTANTS.CHART_HEIGHT /
                        (yAxisTicks.length - 1)
                      }px`,
                    }}
                  >
                    {formatValue(tick)}
                  </div>
                ))}
              </div>
            </div>

            {/* Chart Bars */}
            <div
              className="flex items-end justify-between gap-2 sm:gap-4 mb-6 px-2 sm:px-4 flex-1"
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
                          height: `${
                            (item.gray / maxValue) *
                            DASHBOARD_CONSTANTS.CHART_HEIGHT
                          }px`,
                        }}
                      />
                      <div
                        className="w-8 sm:w-12 bg-blue-600 rounded-t"
                        style={{
                          height: `${
                            (item.blue / maxValue) *
                            DASHBOARD_CONSTANTS.CHART_HEIGHT
                          }px`,
                        }}
                      />
                      <div
                        className="w-8 sm:w-12 bg-orange-500"
                        style={{
                          height: `${
                            (item.orange / maxValue) *
                            DASHBOARD_CONSTANTS.CHART_HEIGHT
                          }px`,
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
        </div>

        <div className="text-xs text-[#535862] justify-center align-middle items-center flex mb-4 px-4">
          Month
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200">
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

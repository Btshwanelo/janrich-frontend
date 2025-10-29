import React, { memo, useMemo } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/base/buttons/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/untitled-card";
import { CircularProgress } from "@/components/CircularProgress";
import { DASHBOARD_CONSTANTS, SAVINGS_MESSAGES } from "@/constants/dashboard";

interface SavingsGoalCardProps {
  savingsGoalPercentage: number;
  totalSaved: number;
  savingGoal: number;
}

export const SavingsGoalCard: React.FC<SavingsGoalCardProps> = memo(
  ({ savingsGoalPercentage, savingGoal, totalSaved }) => {
    // Validate and sanitize percentage to prevent NaN values
    const safePercentage =
      isNaN(savingsGoalPercentage) || !isFinite(savingsGoalPercentage)
        ? 0
        : Math.max(0, Math.min(100, savingsGoalPercentage));

    const progressColor = useMemo(() => {
      if (
        safePercentage >=
        DASHBOARD_CONSTANTS.SAVINGS_PROGRESS_THRESHOLDS.EXCELLENT
      ) {
        return "green";
      }
      if (
        safePercentage >= DASHBOARD_CONSTANTS.SAVINGS_PROGRESS_THRESHOLDS.GOOD
      ) {
        return "blue";
      }
      if (
        safePercentage >= DASHBOARD_CONSTANTS.SAVINGS_PROGRESS_THRESHOLDS.FAIR
      ) {
        return "yellow";
      }
      return "red";
    }, [safePercentage]);

    const message = useMemo(() => {
      const isGoalReached =
        safePercentage >=
        DASHBOARD_CONSTANTS.SAVINGS_PROGRESS_THRESHOLDS.EXCELLENT;
      return isGoalReached
        ? SAVINGS_MESSAGES.CONGRATULATIONS
        : SAVINGS_MESSAGES.KEEP_GOING;
    }, [safePercentage]);

    return (
      <Card className="border-2 border-blue-600 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Lets get going
            </CardTitle>
            <Button color="tertiary" size="sm" aria-label="More options">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Dynamic Circular Progress */}
          <div className="flex justify-center">
            <h2 className="text-[181D27] font-bold text-xl mb-6">
              R {totalSaved} OF R{savingGoal}
            </h2>
          </div>
          <div className="flex items-center justify-center mb-6">
            <CircularProgress
              percentage={safePercentage}
              size={DASHBOARD_CONSTANTS.CIRCULAR_PROGRESS_SIZE}
              strokeWidth={DASHBOARD_CONSTANTS.CIRCULAR_PROGRESS_STROKE_WIDTH}
              className="h-64 w-full"
              color={progressColor}
              aria-label={`Savings goal progress: ${safePercentage}% complete`}
            >
              <div className="flex flex-col items-center justify-center">
                <div className="text-3xl font-semibold text-[#535862] mb-1">
                  Savings goal
                </div>
                <div className="text-3xl font-semibold text-[#181D27]">
                  {safePercentage}%
                </div>
              </div>
            </CircularProgress>
          </div>

          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              {message.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {typeof message.description === "function"
                ? message.description(safePercentage)
                : message.description}
            </p>
          </div>

          <div className="flex justify-between items-end">
            <Button
              color="secondary"
              size="md"
              className="justify-center ml-auto"
            >
              <span>Beat the first deposit slump</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
);

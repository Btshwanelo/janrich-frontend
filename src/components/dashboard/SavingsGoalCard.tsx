import React, { memo, useMemo } from "react";
import { MoreHorizontal, FileText, Wallet } from "lucide-react";
import { User01, HelpCircle as HelpCircleIcon } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { Button as AriaButton } from "react-aria-components";
import { useRouter } from "next/navigation";
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
    const router = useRouter();
    
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
            <Dropdown.Root>
              <AriaButton
                className="cursor-pointer rounded-md text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:text-fg-quaternary_hover focus-visible:outline-2 focus-visible:outline-offset-2"
                aria-label="More options"
              >
                <MoreHorizontal className="w-5 h-5" />
              </AriaButton>
              <Dropdown.Popover className="w-56 bg-white border !border-gray-200 !ring-0 !outline-none [&_*]:outline-none [&_*]:ring-0 [&_*:focus]:outline-none [&_*:focus-visible]:outline-none [&_*:focus-visible]:ring-0">
                <Dropdown.Menu className="!outline-none">
                  <Dropdown.Item
                    icon={Wallet}
                    onAction={() => {
                      // Handle request payout action
                      // You can add a route or modal here
                    }}
                  >
                    Request Payout
                  </Dropdown.Item>
                  <Dropdown.Item
                    icon={FileText}
                    onAction={() => {
                      // Handle get statement action
                      // You can add a route or modal here
                    }}
                  >
                    Get Statement
                  </Dropdown.Item>
                  <Dropdown.Item
                    icon={HelpCircleIcon}
                    onAction={() => {
                      // Handle help and support action
                      // You can add a route or modal here
                    }}
                  >
                    Help and Support
                  </Dropdown.Item>
                  <Dropdown.Separator />
                  <Dropdown.Item
                    icon={User01}
                    onAction={() => router.push("/profile")}
                  >
                    Profile
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown.Root>
          </div>
        </CardHeader>
        <CardContent>
          {/* Dynamic Circular Progress */}
          <div className="flex justify-center">
            <h2 className="text-[181D27] font-bold text-xl">
              {totalSaved > 0 ? (
                <span className="text-[#34C759]"> R {totalSaved}</span>
              ) : (
                <span className=""> R {totalSaved}</span>
              )}{" "}
              of R{savingGoal}
            </h2>
          </div>
          <div className="flex items-center justify-center">
            <CircularProgress
              percentage={safePercentage}
              size={DASHBOARD_CONSTANTS.CIRCULAR_PROGRESS_SIZE}
              strokeWidth={DASHBOARD_CONSTANTS.CIRCULAR_PROGRESS_STROKE_WIDTH}
              className="h-52 w-full"
              color={progressColor}
              aria-label={`Savings goal progress: ${safePercentage}% complete`}
            >
              <div className="flex flex-col items-center justify-center">
                <div className="text-xl font-semibold text-[#535862] mb-1">
                  Savings goal
                </div>
                <div className="text-2xl font-semibold text-[#181D27]">
                  {safePercentage}%
                </div>
              </div>
            </CircularProgress>
          </div>

          <div className="mb-2 pb-2 border-b border-gray-200">
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

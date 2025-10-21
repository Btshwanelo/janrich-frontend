import { useMemo } from 'react';
import { Transaction, ChartDataItem, SavingsProgressResult } from '@/types/dashboard';
import { MONTH_NAMES, DASHBOARD_CONSTANTS } from '@/constants/dashboard';

export const useSavingsCalculation = (
  savingsGoal: number,
  transactions: Transaction[]
): SavingsProgressResult => {
  return useMemo(() => {
    // Initialize chart data for all 12 months
    const chartData: ChartDataItem[] = MONTH_NAMES.map((month) => ({
      month,
      orange: 0,
      blue: 0,
      gray: 0,
    }));

    // Filter only "Clear" status payments and group by month
    const clearPayments = transactions.filter(
      (payment) => payment.status === "Clear"
    );

    // Calculate savings per month (not cumulative)
    const monthlySavings: Record<number, number> = {};

    clearPayments.forEach((payment) => {
      const date = new Date(payment.payment_date);
      const monthIndex = date.getMonth(); // 0-11

      if (!monthlySavings[monthIndex]) {
        monthlySavings[monthIndex] = 0;
      }
      monthlySavings[monthIndex] += payment.amount;
    });

    // Build chart data with monthly totals only
    for (let i = 0; i < 12; i++) {
      if (monthlySavings[i]) {
        chartData[i].blue = monthlySavings[i];
      }
    }

    // Calculate total saved across all months
    const totalSaved = clearPayments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    // Calculate percentage
    const saving_goal_percentage = Math.min(
      Math.round((totalSaved / savingsGoal) * 100),
      100
    );

    return {
      chartData,
      saving_goal_percentage,
    };
  }, [savingsGoal, transactions]);
};

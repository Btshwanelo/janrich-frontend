export const DASHBOARD_CONSTANTS = {
  ITEMS_PER_PAGE: 5,
  CHART_HEIGHT: 200,
  CHART_SCALE_FACTOR: 10000,
  CIRCULAR_PROGRESS_SIZE: 400,
  CIRCULAR_PROGRESS_STROKE_WIDTH: 16,
  SAVINGS_PROGRESS_THRESHOLDS: {
    EXCELLENT: 100,
    GOOD: 75,
    FAIR: 50,
  },
} as const;

export const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export const SAVINGS_MESSAGES = {
  CONGRATULATIONS: {
    title: "Congratulations! You've reached your goal!",
    description: "You've successfully achieved your savings target. Consider setting a new goal to continue your financial journey.",
  },
  KEEP_GOING: {
    title: "The best way to win is to keep going.",
    description: (percentage: number) => 
      `You're ${percentage}% of the way there, you're more likely to meet your savings goal by December if you don't stop now.`,
  },
} as const;

export const EMPTY_STATE_CONFIG = {
  title: "First step to a million is R100",
  description: "Take the first step and make a deposit.",
  buttonText: "Pay yourself first",
} as const;

export interface Transaction {
  amount: number;
  currency: string;
  customer_id: string;
  customer_name: string;
  gateway: string;
  payment_date: string;
  payment_type: string;
  status: string;
  transaction_ref: string;
}

export interface ChartDataItem {
  month: string;
  orange: number;
  blue: number;
  gray: number;
}

export interface SavingsProgressResult {
  chartData: ChartDataItem[];
  saving_goal_percentage: number;
}

export interface DashboardState {
  activeTab: string;
  isModalOpen: boolean;
  isSidebarCollapsed: boolean;
  hasUserDismissedModal: boolean;
  savingsProgress: number;
  currentPage: number;
  itemsPerPage: number;
}

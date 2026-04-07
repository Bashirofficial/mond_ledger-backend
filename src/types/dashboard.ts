export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  transactionCount: number;
  periodStart: string;
  periodEnd: string;
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  color: string | null;
  totalAmount: number;
  count: number;
  percentage: number;
}

export interface MonthlyTrend {
  year: number;
  month: number;
  monthLabel: string; // Month label along with year - e.g. "Jan 2024"
  income: number;
  expenses: number;
  net: number;
}

export interface RecentActivity {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  categoryName: string;
  date: string;
  createdBy: string;
}

import txRepo from "../repository/transaction.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { Role } from "../generated/client/enums.js";

class TransactionService {
  // --------  CREATE TRANSACTIONS --------
  createTransaction(data: any, user: { id: string; role: Role }) {
    if (user.role !== Role.ADMIN) {
      throw new ApiError(403, "Only Admins can create transactions");
    }

    return txRepo.create({ ...data, userId: user.id });
  }

  // -------- UPDATE TRANSACTIONS --------
  async updateTransaction(
    id: string,
    data: any,
    user: { id: string; role: Role },
  ) {
    const existing = await txRepo.findById(id);
    if (!existing) {
      throw new ApiError(404, "Transaction not found");
    }

    if (user.role !== Role.ADMIN) {
      throw new ApiError(403, "Only admins can update this transaction");
    }

    return txRepo.update(id, data);
  }

  // -------- DELETE TRANSACTIONS (SOFT DELETE) --------
  async deleteTransaction(id: string, user: { id: string; role: Role }) {
    const existing = await txRepo.findById(id);
    if (!existing) {
      throw new ApiError(404, "Transaction not found");
    }

    if (user.role !== Role.ADMIN) {
      throw new ApiError(403, "Only admins can delete this transaction");
    }
    return txRepo.softDelete(id);
  }

  // -------- GET TRANSACTIONS WITH FILTERS & PAGINATION --------
  getTransactions(query: any, user: { id: string; role: Role }) {
    const { page, limit, ...filters } = query;

    /***
      - Admins/Analyst can see all transactions.
      - Viewers can only see their own transactions.
      - If user is admin, the userId filter will be undefined, so it will return all transactions.
    ***/
    return txRepo.findTransactions(Number(page) || 1, Number(limit) || 20, {
      ...filters,
      userId:
        user.role === Role.ADMIN || user.role === Role.ANALYST
          ? undefined
          : user.id,
    });
  }

  // -------- GET DASHBOARD DATA --------
  async getDashboardData(userId: string) {
    const [summary, categories, recentTransactions, trends] = await Promise.all(
      [
        txRepo.getSummary(userId),
        txRepo.getCategoryTotals(
          userId,
          new Date().getMonth() + 1,
          new Date().getFullYear(),
        ),
        txRepo.getRecentTransactions(userId),
        txRepo.getMonthlyTrends(userId),
      ],
    );

    const netBalance = summary.income - summary.expenses;
    const totalAmount = categories.reduce(
      (sum, c) => sum + Number(c._sum.amount || 0),
      0,
    );

    const categoryBreakdown = categories.map((c) => {
      const amount = Number(c._sum.amount || 0);
      return {
        categoryId: c.categoryId,
        total: amount,
        percentage:
          totalAmount > 0
            ? Number(((amount / totalAmount) * 100).toFixed(2))
            : 0,
      };
    });

    const trendMap = new Map();

    trends.forEach((t) => {
      if (!trendMap.has(t.month)) {
        trendMap.set(t.month, { income: 0, expenses: 0 });
      }
      const monthData = trendMap.get(t.month);
      if (t.type === "INCOME") {
        monthData.income = t.total;
      } else {
        monthData.expenses = t.total;
      }
    });

    const trendsData = Array.from(trendMap.entries()).map(([month, data]) => ({
      month,
      income: data.income,
      expenses: data.expenses,
      net: data.income - data.expenses,
    }));
    return {
      totalIncome: summary.income,
      totalExpenses: summary.expenses,
      netBalance,
      categoryBreakdown,
      recentTransactions,
      trends: trendsData,
    };
  }
}

export default new TransactionService();

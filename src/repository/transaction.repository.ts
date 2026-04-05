import prisma from "../db";
import { TransactionType } from "../generated/client/enums";

export interface TransactionFilters {
  userId: string;
  type?: TransactionType;
  categoryId?: string;
  startDate?: Date;
  endDate?: Date;
}

class TransactionRepository {
  create(data: any) {
    return prisma.transaction.create({ data });
  }

  update(id: string, data: any) {
    return prisma.transaction.update({
      where: { id },
      data,
    });
  }

  softDelete(id: string) {
    return prisma.transaction.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  /***
    - A multi-purpose method to find transactions with pagination, filtering by type, category, and date.
  ***/

  async findTransactions(page = 1, pageSize = 20, filters: TransactionFilters) {
    const { userId, type, categoryId, startDate, endDate } = filters;
    const skip = (page - 1) * pageSize;

    const where = {
      deletedAt: null,
      userId,
      ...(type && { type }),
      ...(categoryId && { categoryId }),
      ...(startDate || endDate
        ? {
            date: {
              ...(startDate && { gte: new Date(startDate) }),
              ...(endDate && { lte: new Date(endDate) }),
            },
          }
        : {}),
    };

    const [transactions, total] = await prisma.$transaction([
      prisma.transaction.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { date: "desc" },
        include: { category: true },
      }),
      prisma.transaction.count({ where }),
    ]);

    return {
      transactions,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /*** Get transaction summary for a user ***/
  async getSummary(userId: string) {
    const baseWhere = {
      userId,
      deletedAt: null,
    };

    const [income, expenses] = await prisma.$transaction([
      prisma.transaction.aggregate({
        where: {
          ...baseWhere,
          type: TransactionType.INCOME,
        },
        _sum: { amount: true },
      }),

      prisma.transaction.aggregate({
        where: {
          ...baseWhere,
          type: TransactionType.EXPENSE,
        },
        _sum: { amount: true },
      }),
    ]);

    return {
      income: Number(income._sum.amount || 0),
      expenses: Number(expenses._sum.amount || 0),
    };
  }

  getCategoryTotals(userId: string, month: number, year: number) {
    return prisma.transaction.groupBy({
      by: ["categoryId"],
      where: {
        userId,
        deletedAt: null,
      },
      _sum: { amount: true },
      _count: { id: true },
    });
  }

  getRecentTransactions(userId: string) {
    return prisma.transaction.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { category: true },
    });
  }

  getMonthlyTrends(userId: string) {
    return prisma.$queryRaw<{ month: string; type: string; total: number }[]>`
        SELECT
            TO_CHAR(date, 'YYYY-MM') as month,
            type,
            SUM(amount)::float as total
        FROM transactions
        WHERE "userId" = ${userId}
            AND "deletedAt" IS NULL
        GROUP BY month, type
        ORDER BY month ASC
    `;
  }
}

export default new TransactionRepository();

import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import txService from "../services/transaction.service.js";

// User helper function to extract user info from request
const getUser = (req: Request) => ({ id: req.user!.id, role: req.user!.role });

// -------- Controller Methods --------

const createTransaction = AsyncHandler(async (req: Request, res: Response) => {
  const user = getUser(req);

  const transaction = await txService.createTransaction(req.body, user);

  return res
    .status(201)
    .json(
      new ApiResponse(201, { transaction }, "Transaction created successfully"),
    );
});

const getTransactions = AsyncHandler(async (req: Request, res: Response) => {
  const user = getUser(req);

  const transactions = await txService.getTransactions(req.query, user);

  return res
    .status(200)
    .json(
      new ApiResponse(200, transactions, "Transactions retrieved successfully"),
    );
});

const updateTransaction = AsyncHandler(async (req: Request, res: Response) => {
  const user = getUser(req);
  const transactionId = req.params.id as string;

  const updated = await txService.updateTransaction(
    transactionId,
    req.body,
    user,
    {
      ip: req.ip,
      userAgent: req.get("user-agent"),
    },
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { transaction: updated },
        "Transaction updated successfully",
      ),
    );
});

const deleteTransaction = AsyncHandler(async (req: Request, res: Response) => {
  const user = getUser(req);
  const transactionId = req.params.id as string;
  const updated = await txService.deleteTransaction(transactionId, user, {
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { transaction: updated },
        "Transaction deleted successfully",
      ),
    );
});

const getDashboardData = AsyncHandler(async (req: Request, res: Response) => {
  const user = getUser(req);

  const summary = await txService.getDashboardData(user.id);

  return res
    .status(200)
    .json(new ApiResponse(200, summary, "Summary retrieved successfully"));
});

export {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getDashboardData,
};

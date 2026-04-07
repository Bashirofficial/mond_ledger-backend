import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import categoryService from "../services/category.service.js";

// -------- Controller Methods --------

const createCategory = AsyncHandler(async (req: Request, res: Response) => {
  const { name, description } = req.body;

  const category = await categoryService.createCategory(name, description);

  return res
    .status(201)
    .json(new ApiResponse(201, { category }, "Category created successfully"));
});

const getCategories = AsyncHandler(async (_req: Request, res: Response) => {
  const categories = await categoryService.getCategories();

  return res.json(
    new ApiResponse(200, { categories }, "Categories fetched successfully"),
  );
});

const getCategoryById = AsyncHandler(async (req: Request, res: Response) => {
  const categoryId = req.params.id as string;

  const category = await categoryService.getCategoryById(categoryId);

  return res.json(
    new ApiResponse(200, { category }, "Category fetched successfully"),
  );
});

export { createCategory, getCategories, getCategoryById };

import categoryRepo from "../repository/category.repository.js";
import { ApiError } from "../utils/ApiError.js";

class CategoryService {
  // -------- CREATE CATEGORY --------
  async createCategory(name: string, description?: string) {
    if (!name) {
      throw new ApiError(400, "Category name is required");
    }

    return categoryRepo.create(name, description);
  }

  // -------- GET ALL CATEGORIES --------
  async getCategories() {
    return categoryRepo.findAll();
  }

  // -------- GET CATEGORY BY ID --------
  async getCategoryById(id: string) {
    const category = await categoryRepo.findById(id);

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    return category;
  }
}

export default new CategoryService();

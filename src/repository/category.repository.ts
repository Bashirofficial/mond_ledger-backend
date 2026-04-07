import prisma from "../db/index.js";

class CategoryRepository {
  create(name: string, description?: string) {
    return prisma.category.create({
      data: {
        name,
        description,
      },
    });
  }

  findAll() {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  }

  findById(id: string) {
    return prisma.category.findUnique({
      where: { id },
    });
  }
}

export default new CategoryRepository();

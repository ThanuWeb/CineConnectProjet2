import { eq, and } from "drizzle-orm";
import { Category } from "../../Domain/Category";
import { db } from "../drizzle";
import { categories, filmsCategories } from "../schema";

export class CategoryRepository {
  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryById(id: string): Promise<Category | null> {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);
    return result.length > 0 ? result[0] : null;
  }

  async addCategory(category: Omit<Category, "id">): Promise<Category> {
    const [newCategory] = await db
      .insert(categories)
      .values(category)
      .returning();
    return newCategory;
  }

  async getCategoriesByFilmId(filmId: string): Promise<Category[]> {
    const result = await db
      .select({
        id: categories.id,
        name: categories.name,
        description: categories.description,
      })
      .from(filmsCategories)
      .innerJoin(categories, eq(filmsCategories.categoryId, categories.id))
      .where(eq(filmsCategories.filmId, filmId));
    return result;
  }

  async addFilmCategory(filmId: string, categoryId: string): Promise<void> {
    await db
      .insert(filmsCategories)
      .values({ filmId, categoryId })
      .onConflictDoNothing();
  }

  async removeFilmCategory(filmId: string, categoryId: string): Promise<void> {
    await db
      .delete(filmsCategories)
      .where(
        and(
          eq(filmsCategories.filmId, filmId),
          eq(filmsCategories.categoryId, categoryId),
        ),
      );
  }
}

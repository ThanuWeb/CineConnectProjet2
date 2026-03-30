import { eq, and } from "drizzle-orm";
import { db } from "../drizzle";
import { favorites } from "../schema";

export class FavoriteRepository {
  async countFavoritesByUser(userId: string): Promise<number> {
    const result = await db
      .select()
      .from(favorites)
      .where(eq(favorites.userId, userId));
    return result.length;
  }

  async addFavorite(userId: string, filmId: string) {
    return await db
      .insert(favorites)
      .values({ userId, filmId })
      .onConflictDoNothing()
      .returning();
  }

  async removeFavorite(userId: string, filmId: string) {
    await db
      .delete(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.filmId, filmId)));
  }

  async isFavorite(userId: string, filmId: string): Promise<boolean> {
    const result = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.filmId, filmId)));
    return result.length > 0;
  }
}

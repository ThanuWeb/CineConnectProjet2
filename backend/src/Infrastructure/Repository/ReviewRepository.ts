import { eq, and } from "drizzle-orm";
import { Review } from "../../Domain/Review";
import { db } from "../drizzle";
import { reviews, users } from "../schema";

export class ReviewRepository {
  async getReviewsByFilmId(filmId: string): Promise<any[]> {
    return await db
      .select({
        id: reviews.id,
        userId: reviews.userId,
        filmId: reviews.filmId,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        updatedAt: reviews.updatedAt,
        username: users.username,
        avatarUrl: users.avatarUrl,
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.filmId, filmId));
  }

  async getReviewByUserAndFilm(
    userId: string,
    filmId: string,
  ): Promise<Review | null> {
    const result = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.userId, userId), eq(reviews.filmId, filmId)))
      .limit(1);
    return result.length > 0 ? result[0] : null;
  }

  async addReview(
    review: Omit<Review, "id" | "createdAt" | "updatedAt">,
  ): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }

  async updateReview(
    id: string,
    updates: Partial<Pick<Review, "rating" | "comment">>,
  ): Promise<Review | null> {
    const [updated] = await db
      .update(reviews)
      .set(updates)
      .where(eq(reviews.id, id))
      .returning();
    return updated ?? null;
  }

  async deleteReview(id: string): Promise<void> {
    await db.delete(reviews).where(eq(reviews.id, id));
  }

  async getReviewById(id: string): Promise<Review | null> {
    const result = await db
      .select()
      .from(reviews)
      .where(eq(reviews.id, id))
      .limit(1);
    return result.length > 0 ? result[0] : null;
  }

  async countReviewsByUser(userId: string): Promise<number> {
    const result = await db
      .select()
      .from(reviews)
      .where(eq(reviews.userId, userId));
    return result.length;
  }
}

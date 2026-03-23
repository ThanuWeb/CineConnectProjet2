import { eq, and } from "drizzle-orm";
import { Review } from "../../Domain/Review";
import { db } from "../drizzle";
import { reviews } from "../schema";

export class ReviewRepository {
  async getReviewsByFilmId(filmId: string): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.filmId, filmId));
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
}

import { eq, and, or } from "drizzle-orm";
import { Friend } from "../../Domain/Friend";
import { db } from "../drizzle";
import { friends } from "../schema";

export class FriendRepository {
  async sendRequest(requesterId: string, addresseeId: string): Promise<Friend> {
    const [request] = await db
      .insert(friends)
      .values({ requesterId, addresseeId, status: "pending" })
      .returning();
    return request;
  }

  async updateStatus(id: string, status: string): Promise<Friend | null> {
    const [updated] = await db
      .update(friends)
      .set({ status })
      .where(eq(friends.id, id))
      .returning();
    return updated ?? null;
  }

  async getFriendsByUserId(userId: string): Promise<Friend[]> {
    return await db
      .select()
      .from(friends)
      .where(
        and(
          or(eq(friends.requesterId, userId), eq(friends.addresseeId, userId)),
          eq(friends.status, "accepted"),
        ),
      );
  }

  async getPendingRequests(userId: string): Promise<Friend[]> {
    return await db
      .select()
      .from(friends)
      .where(
        and(eq(friends.addresseeId, userId), eq(friends.status, "pending")),
      );
  }

  async getRequestById(id: string): Promise<Friend | null> {
    const result = await db
      .select()
      .from(friends)
      .where(eq(friends.id, id))
      .limit(1);
    return result.length > 0 ? result[0] : null;
  }

  async deleteFriend(id: string): Promise<void> {
    await db.delete(friends).where(eq(friends.id, id));
  }

  async countAcceptedFriends(userId: string): Promise<number> {
    const result = await db
      .select()
      .from(friends)
      .where(
        and(
          or(eq(friends.requesterId, userId), eq(friends.addresseeId, userId)),
          eq(friends.status, "accepted"),
        ),
      );
    return result.length;
  }
}

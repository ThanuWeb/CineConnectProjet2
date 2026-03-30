import { eq, and, or } from "drizzle-orm";
import { Message } from "../../Domain/Message";
import { db } from "../drizzle";
import { messages } from "../schema";

export class MessageRepository {
  async getConversation(userId1: string, userId2: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, userId1), eq(messages.receiverId, userId2)),
          and(eq(messages.senderId, userId2), eq(messages.receiverId, userId1)),
        ),
      );
  }

  async sendMessage(
    message: Omit<Message, "id" | "sentAt" | "isRead">,
  ): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  async markAsRead(id: string): Promise<Message | null> {
    const [updated] = await db
      .update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, id))
      .returning();
    return updated ?? null;
  }
}

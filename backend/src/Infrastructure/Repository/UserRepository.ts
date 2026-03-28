import { eq } from "drizzle-orm";
import { User } from "../../Domain/User";
import { db } from "../drizzle";
import { users } from "../schema";

export class UserRepository {
  async getUserByEmail(email: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return result.length > 0 ? result[0] : null;
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result.length > 0 ? result[0] : null;
  }

  async addUser(
    user: Omit<User, "id" | "createdAt" | "updatedAt">,
  ): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getAllUsers(): Promise<User[]> {
    const result = await db.select().from(users);
    return result;
  }

  async updateUser(
    id: string,
    updates: Partial<
      Pick<User, "username" | "bio" | "avatarUrl" | "preferences">
    >,
  ): Promise<User | null> {
    const [updated] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return updated ?? null;
  }
}

import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm/sql";
import { Pool, type PoolConfig } from "pg";
import type { NewUser, User, UserPort } from "@domain/user";

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  pw: text("pw").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  modified_at: timestamp("modified_at", { withTimezone: true }).notNull().defaultNow(),
});

export type UserPgDatabase = NodePgDatabase<{ users: typeof usersTable }>;

export type UserPgConfig = PoolConfig | string;

const toUser = (row: typeof usersTable.$inferSelect): User => ({
  id: row.id,
  name: row.name,
  pw: row.pw,
  created_at: row.created_at.toISOString(),
  modified_at: row.modified_at.toISOString(),
});

const createPool = (config: UserPgConfig): Pool =>
  typeof config === "string" ? new Pool({ connectionString: config }) : new Pool(config);

export const createUserPgDb = (config: UserPgConfig): UserPgDatabase => {
  const pool = createPool(config);
  return drizzle(pool, { schema: { users: usersTable } });
};

export class UserDrizzlePgRepo implements UserPort {
  constructor(private readonly db: UserPgDatabase) {}

  async createUser(input: NewUser): Promise<User> {
    const [created] = await this.db.insert(usersTable).values(input).returning().execute();
    if (!created) {
      throw new Error("failed to create user");
    }
    return toUser(created);
  }

  async getUserById(userId: string): Promise<User | null> {
    const [user] = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1)
      .execute();
    return user ? toUser(user) : null;
  }

  async listUsers(): Promise<User[]> {
    const users = await this.db.select().from(usersTable).execute();
    return users.map(toUser);
  }

  async updateUser(userId: string, input: Partial<NewUser>): Promise<User | null> {
    const patch = Object.fromEntries(
      Object.entries(input).filter(([, value]) => typeof value !== "undefined"),
    ) as Partial<NewUser>;

    if (Object.keys(patch).length === 0) {
      return this.getUserById(userId);
    }

    const [updated] = await this.db
      .update(usersTable)
      .set({ ...patch, modified_at: new Date() })
      .where(eq(usersTable.id, userId))
      .returning()
      .execute();

    return updated ? toUser(updated) : null;
  }

  async deleteUser(userId: string): Promise<boolean> {
    const [deleted] = await this.db
      .delete(usersTable)
      .where(eq(usersTable.id, userId))
      .returning({ id: usersTable.id })
      .execute();

    return Boolean(deleted);
  }
}

export const createUserPgRepo = (config: UserPgConfig): UserDrizzlePgRepo =>
  new UserDrizzlePgRepo(createUserPgDb(config));

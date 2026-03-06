import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  uniqueIndex,
  index,
  primaryKey,
} from "drizzle-orm/pg-core";

// Table users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Table films
export const films = pgTable(
  "films",
  {
    id: serial("id").primaryKey(),
    omdbId: varchar("omdb_id", { length: 50 }),
    title: varchar("title", { length: 255 }).notNull(),
    year: integer("year"),
    director: varchar("director", { length: 255 }),
    posterUrl: text("poster_url"),
    plot: text("plot"),
    runtimeMinutes: integer("runtime_minutes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    titleIndex: uniqueIndex("idx_films_title").on(table.title),
    yearIndex: index("idx_films_year").on(table.year),
  }),
);

// Table categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
});

// Table films_categories (many-to-many)
export const filmsCategories = pgTable(
  "films_categories",
  {
    filmId: integer("film_id")
      .notNull()
      .references(() => films.id, { onDelete: "cascade" }),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.filmId, table.categoryId] }),
  }),
);

// Table reviews
export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    filmId: integer("film_id")
      .notNull()
      .references(() => films.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueUserFilm: uniqueIndex("uq_review_user_film").on(
      table.userId,
      table.filmId,
    ),
  }),
);

// Table friends
export const friends = pgTable("friends", {
  id: serial("id").primaryKey(),
  requesterId: integer("requester_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  addresseeId: integer("addressee_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Table messages
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  receiverId: integer("receiver_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  isRead: boolean("is_read").default(false).notNull(),
});

import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  serial,
  jsonb,
} from "drizzle-orm/pg-core";

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  year: integer("year").notNull(),
  thumbnail: text("thumbnail"),
  thumbPosition: text("thumb_position").default("50% 50%"),
  videoUrl: text("video_url"),
  videoType: text("video_type"), // "youtube" | "vimeo" | "upload" | "google"
  videoFile: text("video_file"),
  videos: jsonb("videos").$type<Array<{ type: string; url: string }>>().default([]),
  location: text("location"),
  images: text("images").array().notNull().default([]),
  order: integer("order").notNull().default(0),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  section: text("section").notNull(), // "experience" | "education" | "skills" | "awards"
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  period: text("period"),
  details: text("details"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

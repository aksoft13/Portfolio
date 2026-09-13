import { db } from "@/db";
import { projects } from "@/db/schema";
import { desc, asc, eq, ne } from "drizzle-orm";

export async function getProjects() {
  try {
    return await Promise.race([
      db
        .select({
          id: projects.id,
          title: projects.title,
          category: projects.category,
          year: projects.year,
          thumbnail: projects.thumbnail,
          videoType: projects.videoType,
        })
        .from(projects)
        .orderBy(desc(projects.year), asc(projects.order)),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 3000)
      ),
    ]);
  } catch {
    return [];
  }
}

export async function getProject(id: number) {
  try {
    const rows = await Promise.race([
      db.select().from(projects).where(eq(projects.id, id)).limit(1),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 3000)
      ),
    ]);
    return rows[0] || null;
  } catch {
    return null;
  }
}

export async function getRelatedProjects(excludeId: number) {
  try {
    return await Promise.race([
      db
        .select({
          id: projects.id,
          title: projects.title,
          thumbnail: projects.thumbnail,
        })
        .from(projects)
        .where(ne(projects.id, excludeId))
        .orderBy(desc(projects.year), asc(projects.order))
        .limit(3),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 3000)
      ),
    ]);
  } catch {
    return [];
  }
}

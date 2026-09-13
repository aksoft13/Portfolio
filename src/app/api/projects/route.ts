import { db } from "@/db";
import { projects } from "@/db/schema";
import { desc, asc } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET() {
  const rows = await db
    .select()
    .from(projects)
    .orderBy(desc(projects.year), asc(projects.order));
  return Response.json(rows);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const [project] = await db
    .insert(projects)
    .values({
      title: body.title,
      description: body.description || null,
      category: body.category,
      year: parseInt(body.year),
      thumbnail: body.thumbnail || null,
      videoUrl: body.videoUrl || null,
      videoType: body.videoType || null,
      videoFile: body.videoFile || null,
      thumbPosition: body.thumbPosition || "50% 50%",
      images: body.images || [],
      order: parseInt(body.order) || 0,
      featured: body.featured || false,
    })
    .returning();

  return Response.json(project, { status: 201 });
}

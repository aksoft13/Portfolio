import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.id, parseInt(id)))
    .limit(1);

  if (!rows[0]) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json(rows[0]);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const [project] = await db
    .update(projects)
    .set({
      title: body.title,
      description: body.description || null,
      category: body.category,
      year: parseInt(body.year),
      thumbnail: body.thumbnail || null,
      videoUrl: body.videoUrl || null,
      videoType: body.videoType || null,
      videoFile: body.videoFile || null,
      videos: body.videos || [],
      videoLayout: body.videoLayout || "stack",
      thumbPosition: body.thumbPosition || "50% 50%",
      location: body.location || null,
      images: body.images || [],
      order: parseInt(body.order) ?? 0,
      featured: body.featured ?? false,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, parseInt(id)))
    .returning();

  return Response.json(project);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.delete(projects).where(eq(projects.id, parseInt(id)));
  return Response.json({ success: true });
}

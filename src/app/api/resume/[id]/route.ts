import { db } from "@/db";
import { resumes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const [item] = await db
    .update(resumes)
    .set({
      section: body.section,
      title: body.title,
      subtitle: body.subtitle || null,
      period: body.period || null,
      details: body.details || null,
      order: parseInt(body.order) || 0,
      updatedAt: new Date(),
    })
    .where(eq(resumes.id, parseInt(id)))
    .returning();

  return Response.json(item);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.delete(resumes).where(eq(resumes.id, parseInt(id)));
  return Response.json({ success: true });
}

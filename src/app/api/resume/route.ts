import { db } from "@/db";
import { resumes } from "@/db/schema";
import { asc } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET() {
  const rows = await db
    .select()
    .from(resumes)
    .orderBy(asc(resumes.section), asc(resumes.order));
  return Response.json(rows);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const [item] = await db
    .insert(resumes)
    .values({
      section: body.section,
      title: body.title,
      subtitle: body.subtitle || null,
      period: body.period || null,
      details: body.details || null,
      order: parseInt(body.order) || 0,
    })
    .returning();

  return Response.json(item, { status: 201 });
}

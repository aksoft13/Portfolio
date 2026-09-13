import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
    return NextResponse.json({ authenticated: true, email: payload.email });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

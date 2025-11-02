import { NextResponse } from "next/server";
import { insertScore } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body?.userId) {
    return NextResponse.json({ error: "Missing user" }, { status: 400 });
  }

  try {
    await insertScore({
      user_id: body.userId,
      score: Number(body.score ?? 0),
      max_combo: Number(body.maxCombo ?? 0),
      duration_ms: Number(body.durationMs ?? 0)
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to record" }, { status: 500 });
  }
}

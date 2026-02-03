import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData.entries());

  // TODO: Store in Supabase and notify team.
  return NextResponse.json({ ok: true, payload });
}

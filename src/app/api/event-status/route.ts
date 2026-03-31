import { NextResponse } from "next/server";

export async function GET() {
  const until = process.env.FREE_EVENT_UNTIL;
  if (!until) {
    return NextResponse.json({ active: false });
  }
  const deadline = new Date(until + "T23:59:59");
  const active = !isNaN(deadline.getTime()) && new Date() <= deadline;
  return NextResponse.json({
    active,
    until: active ? until : null,
  });
}

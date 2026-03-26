import { NextResponse } from "next/server";
import { MOCK_MENU_RESULT } from "@/lib/mock-data";

export async function POST() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return NextResponse.json(MOCK_MENU_RESULT);
}

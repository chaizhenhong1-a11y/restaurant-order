import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "restaurant-order",
    timestamp: new Date().toISOString()
  });
}

import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";

import { checkHealth } from "./health";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const result = await checkHealth(() => prisma.$queryRaw`SELECT 1`);
  return NextResponse.json(result.body, {
    headers: { "Cache-Control": "no-store" },
    status: result.status,
  });
}

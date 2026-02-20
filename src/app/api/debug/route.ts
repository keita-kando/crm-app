import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    TURSO_DATABASE_URL_EXISTS: !!process.env.TURSO_DATABASE_URL,
    TURSO_DATABASE_URL_LENGTH: process.env.TURSO_DATABASE_URL?.length ?? 0,
    TURSO_DATABASE_URL_PREFIX: process.env.TURSO_DATABASE_URL?.substring(0, 10) ?? "MISSING",
    TURSO_AUTH_TOKEN_EXISTS: !!process.env.TURSO_AUTH_TOKEN,
    DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
    DATABASE_URL_PREFIX: process.env.DATABASE_URL?.substring(0, 10) ?? "MISSING",
    NODE_ENV: process.env.NODE_ENV,
  });
}

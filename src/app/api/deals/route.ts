import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dealSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q") || "";
  const stage = searchParams.get("stage") || undefined;
  const accountId = searchParams.get("accountId") || undefined;

  const where = {
    AND: [
      q ? { name: { contains: q } } : {},
      stage ? { stage } : {},
      accountId ? { accountId } : {},
    ],
  };

  const deals = await prisma.deal.findMany({
    where,
    include: { account: true, contact: true },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ data: deals });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = dealSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { closeDate, ...rest } = parsed.data;
  const deal = await prisma.deal.create({
    data: {
      ...rest,
      closeDate: closeDate ? new Date(closeDate) : null,
    },
  });
  return NextResponse.json(deal, { status: 201 });
}

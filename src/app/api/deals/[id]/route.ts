import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dealSchema } from "@/lib/validations";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deal = await prisma.deal.findUnique({
    where: { id },
    include: {
      account: true,
      contact: true,
      activities: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  });
  if (!deal) {
    return NextResponse.json({ error: "商談が見つかりません" }, { status: 404 });
  }
  return NextResponse.json(deal);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = dealSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { closeDate, ...rest } = parsed.data;
  const deal = await prisma.deal.update({
    where: { id },
    data: {
      ...rest,
      closeDate: closeDate ? new Date(closeDate) : null,
    },
  });
  return NextResponse.json(deal);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.deal.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

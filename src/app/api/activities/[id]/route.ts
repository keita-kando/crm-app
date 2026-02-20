import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { activitySchema } from "@/lib/validations";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const activity = await prisma.activity.findUnique({
    where: { id },
    include: { account: true, contact: true, deal: true },
  });
  if (!activity) {
    return NextResponse.json({ error: "活動が見つかりません" }, { status: 404 });
  }
  return NextResponse.json(activity);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  // Allow partial updates (e.g., toggling completed)
  const existing = await prisma.activity.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "活動が見つかりません" }, { status: 404 });
  }

  const merged = { ...existing, ...body };
  const parsed = activitySchema.safeParse(merged);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { dueDate, ...rest } = parsed.data;
  const activity = await prisma.activity.update({
    where: { id },
    data: {
      ...rest,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });
  return NextResponse.json(activity);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.activity.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

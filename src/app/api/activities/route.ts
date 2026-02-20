import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { activitySchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type") || undefined;
  const completed = searchParams.get("completed");
  const accountId = searchParams.get("accountId") || undefined;
  const contactId = searchParams.get("contactId") || undefined;
  const dealId = searchParams.get("dealId") || undefined;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");

  const where = {
    AND: [
      type ? { type } : {},
      completed !== null ? { completed: completed === "true" } : {},
      accountId ? { accountId } : {},
      contactId ? { contactId } : {},
      dealId ? { dealId } : {},
    ],
  };

  const [activities, total] = await Promise.all([
    prisma.activity.findMany({
      where,
      include: { account: true, contact: true, deal: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.activity.count({ where }),
  ]);

  return NextResponse.json({ data: activities, total, page, limit });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = activitySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { dueDate, ...rest } = parsed.data;
  const activity = await prisma.activity.create({
    data: {
      ...rest,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });
  return NextResponse.json(activity, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q") || "";
  const accountId = searchParams.get("accountId") || undefined;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where = {
    AND: [
      q
        ? {
            OR: [
              { lastName: { contains: q } },
              { firstName: { contains: q } },
              { email: { contains: q } },
            ],
          }
        : {},
      accountId ? { accountId } : {},
    ],
  };

  const [contacts, total] = await Promise.all([
    prisma.contact.findMany({
      where,
      include: { account: true },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.contact.count({ where }),
  ]);

  return NextResponse.json({ data: contacts, total, page, limit });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const contact = await prisma.contact.create({ data: parsed.data });
  return NextResponse.json(contact, { status: 201 });
}

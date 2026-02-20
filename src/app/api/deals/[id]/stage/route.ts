import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEAL_STAGES } from "@/lib/constants";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { stage } = await request.json();

  const validStage = DEAL_STAGES.find((s) => s.value === stage);
  if (!validStage) {
    return NextResponse.json({ error: "無効なステージです" }, { status: 400 });
  }

  const deal = await prisma.deal.update({
    where: { id },
    data: { stage, probability: validStage.probability },
  });

  return NextResponse.json(deal);
}

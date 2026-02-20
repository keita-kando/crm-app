import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PipelineBoard } from "@/components/deals/pipeline-board";

export default async function DealsPage() {
  const deals = await prisma.deal.findMany({
    include: { account: true, contact: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="商談パイプライン"
        description={`${deals.length}件の商談`}
        actions={
          <Link href="/deals/new">
            <Button><Plus className="mr-2 h-4 w-4" />新規作成</Button>
          </Link>
        }
      />
      <PipelineBoard deals={deals} />
    </div>
  );
}

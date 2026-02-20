import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import { DEAL_STAGES } from "@/lib/constants";

interface Deal {
  id: string;
  name: string;
  amount: number | null;
  stage: string;
  account: { name: string } | null;
}

export function RecentDeals({ deals }: { deals: Deal[] }) {
  if (deals.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">商談がありません</p>
    );
  }
  return (
    <div className="space-y-3">
      {deals.map((deal) => {
        const stageInfo = DEAL_STAGES.find((s) => s.value === deal.stage);
        return (
          <Link
            key={deal.id}
            href={`/deals/${deal.id}`}
            className="flex items-center justify-between py-2 hover:bg-muted/50 rounded px-2 -mx-2 transition-colors"
          >
            <div>
              <p className="text-sm font-medium">{deal.name}</p>
              <p className="text-xs text-muted-foreground">
                {deal.account?.name || "---"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {formatCurrency(deal.amount)}
              </span>
              <Badge variant="secondary" className="text-xs">
                {stageInfo?.label || deal.stage}
              </Badge>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

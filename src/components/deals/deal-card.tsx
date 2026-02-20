import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

interface Deal {
  id: string;
  name: string;
  amount: number | null;
  probability: number;
  closeDate: Date | null;
  account: { name: string } | null;
}

export function DealCard({ deal }: { deal: Deal }) {
  return (
    <Link href={`/deals/${deal.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-3">
          <p className="text-sm font-medium text-blue-600 truncate">
            {deal.name}
          </p>
          <p className="text-xs text-muted-foreground mt-1 truncate">
            {deal.account?.name || "---"}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-semibold">
              {formatCurrency(deal.amount)}
            </span>
            <span className="text-xs text-muted-foreground">
              {deal.probability}%
            </span>
          </div>
          {deal.closeDate && (
            <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
              <CalendarDays className="h-3 w-3" />
              {formatDate(deal.closeDate)}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

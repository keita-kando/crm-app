import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AccountTable } from "@/components/accounts/account-table";

export default async function AccountsPage() {
  const accounts = await prisma.account.findMany({
    include: { _count: { select: { contacts: true, deals: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="取引先"
        description={`${accounts.length}件の取引先`}
        actions={
          <Link href="/accounts/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              新規作成
            </Button>
          </Link>
        }
      />
      <AccountTable accounts={accounts} />
    </div>
  );
}

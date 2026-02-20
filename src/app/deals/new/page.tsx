import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { DealForm } from "@/components/deals/deal-form";

export default async function NewDealPage({
  searchParams,
}: {
  searchParams: Promise<{ accountId?: string }>;
}) {
  const { accountId } = await searchParams;
  const [accounts, contacts] = await Promise.all([
    prisma.account.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.contact.findMany({
      orderBy: { lastName: "asc" },
      select: { id: true, firstName: true, lastName: true, accountId: true },
    }),
  ]);

  return (
    <div>
      <PageHeader title="商談の新規作成" />
      <DealForm
        accounts={accounts}
        contacts={contacts}
        defaultValues={accountId ? { name: "", stage: "リード", probability: 10, accountId } : undefined}
      />
    </div>
  );
}

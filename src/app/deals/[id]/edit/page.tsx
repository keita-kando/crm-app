import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { DealForm } from "@/components/deals/deal-form";

export default async function EditDealPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [deal, accounts, contacts] = await Promise.all([
    prisma.deal.findUnique({ where: { id } }),
    prisma.account.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.contact.findMany({
      orderBy: { lastName: "asc" },
      select: { id: true, firstName: true, lastName: true, accountId: true },
    }),
  ]);
  if (!deal) notFound();

  return (
    <div>
      <PageHeader title={`${deal.name} の編集`} />
      <DealForm
        dealId={id}
        accounts={accounts}
        contacts={contacts}
        defaultValues={{
          name: deal.name,
          amount: deal.amount || undefined,
          stage: deal.stage,
          probability: deal.probability,
          closeDate: deal.closeDate
            ? deal.closeDate.toISOString().split("T")[0]
            : undefined,
          description: deal.description || undefined,
          accountId: deal.accountId || undefined,
          contactId: deal.contactId || undefined,
        }}
      />
    </div>
  );
}

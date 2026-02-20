import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { AccountForm } from "@/components/accounts/account-form";

export const dynamic = 'force-dynamic';

export default async function EditAccountPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const account = await prisma.account.findUnique({ where: { id } });
  if (!account) notFound();

  return (
    <div>
      <PageHeader title={`${account.name} の編集`} />
      <AccountForm
        accountId={id}
        defaultValues={{
          name: account.name,
          industry: account.industry || undefined,
          phone: account.phone || undefined,
          website: account.website || undefined,
          address: account.address || undefined,
          description: account.description || undefined,
          annualRevenue: account.annualRevenue || undefined,
          employees: account.employees || undefined,
        }}
      />
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { ContactForm } from "@/components/contacts/contact-form";

export default async function NewContactPage({
  searchParams,
}: {
  searchParams: Promise<{ accountId?: string }>;
}) {
  const { accountId } = await searchParams;
  const accounts = await prisma.account.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <PageHeader title="担当者の新規作成" />
      <ContactForm
        accounts={accounts}
        defaultValues={
          accountId
            ? { firstName: "", lastName: "", accountId }
            : undefined
        }
      />
    </div>
  );
}

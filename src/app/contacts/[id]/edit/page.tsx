import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { ContactForm } from "@/components/contacts/contact-form";

export const dynamic = 'force-dynamic';

export default async function EditContactPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [contact, accounts] = await Promise.all([
    prisma.contact.findUnique({ where: { id } }),
    prisma.account.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!contact) notFound();

  return (
    <div>
      <PageHeader title={`${contact.lastName} ${contact.firstName} の編集`} />
      <ContactForm
        contactId={id}
        accounts={accounts}
        defaultValues={{
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email || undefined,
          phone: contact.phone || undefined,
          title: contact.title || undefined,
          department: contact.department || undefined,
          accountId: contact.accountId || undefined,
        }}
      />
    </div>
  );
}

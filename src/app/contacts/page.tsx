import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ContactTable } from "@/components/contacts/contact-table";

export default async function ContactsPage() {
  const contacts = await prisma.contact.findMany({
    include: { account: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="取引先責任者"
        description={`${contacts.length}件の担当者`}
        actions={
          <Link href="/contacts/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              新規作成
            </Button>
          </Link>
        }
      />
      <ContactTable contacts={contacts} />
    </div>
  );
}

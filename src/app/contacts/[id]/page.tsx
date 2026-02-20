import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/format";
import { DEAL_STAGES } from "@/lib/constants";
import { DeleteContactButton } from "@/components/contacts/delete-contact-button";

export const dynamic = 'force-dynamic';

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contact = await prisma.contact.findUnique({
    where: { id },
    include: {
      account: true,
      deals: { orderBy: { updatedAt: "desc" } },
      activities: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });

  if (!contact) notFound();

  return (
    <div>
      <PageHeader
        title={`${contact.lastName} ${contact.firstName}`}
        description={contact.title || undefined}
        actions={
          <div className="flex gap-2">
            <Link href={`/contacts/${id}/edit`}>
              <Button variant="outline"><Pencil className="mr-2 h-4 w-4" />編集</Button>
            </Link>
            <DeleteContactButton contactId={id} />
          </div>
        }
      />
      <Tabs defaultValue="detail">
        <TabsList>
          <TabsTrigger value="detail">詳細</TabsTrigger>
          <TabsTrigger value="deals">商談 ({contact.deals.length})</TabsTrigger>
          <TabsTrigger value="activities">活動 ({contact.activities.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="detail" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <dl className="grid gap-4 md:grid-cols-2">
                <div>
                  <dt className="text-sm text-muted-foreground">姓</dt>
                  <dd className="text-sm font-medium mt-1">{contact.lastName}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">名</dt>
                  <dd className="text-sm font-medium mt-1">{contact.firstName}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">メール</dt>
                  <dd className="text-sm font-medium mt-1">{contact.email || "---"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">電話番号</dt>
                  <dd className="text-sm font-medium mt-1">{contact.phone || "---"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">役職</dt>
                  <dd className="text-sm font-medium mt-1">{contact.title || "---"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">部署</dt>
                  <dd className="text-sm font-medium mt-1">{contact.department || "---"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">取引先</dt>
                  <dd className="text-sm font-medium mt-1">
                    {contact.account ? (
                      <Link href={`/accounts/${contact.account.id}`} className="text-blue-600 hover:underline">{contact.account.name}</Link>
                    ) : "---"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">作成日</dt>
                  <dd className="text-sm font-medium mt-1">{formatDate(contact.createdAt)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="deals" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {contact.deals.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">商談がありません</p>
              ) : (
                <div className="space-y-2">
                  {contact.deals.map((d) => {
                    const stageInfo = DEAL_STAGES.find((s) => s.value === d.stage);
                    return (
                      <Link key={d.id} href={`/deals/${d.id}`} className="flex items-center justify-between py-2 px-2 rounded hover:bg-muted/50 transition-colors">
                        <p className="text-sm font-medium text-blue-600">{d.name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{formatCurrency(d.amount)}</span>
                          <Badge variant="secondary">{stageInfo?.label || d.stage}</Badge>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activities" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {contact.activities.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">活動がありません</p>
              ) : (
                <div className="space-y-2">
                  {contact.activities.map((a) => (
                    <div key={a.id} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium">{a.subject}</p>
                        <p className="text-xs text-muted-foreground">{a.type}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(a.createdAt)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

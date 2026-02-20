import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { DEAL_STAGES } from "@/lib/constants";
import { DeleteAccountButton } from "@/components/accounts/delete-account-button";

export default async function AccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const account = await prisma.account.findUnique({
    where: { id },
    include: {
      contacts: { orderBy: { updatedAt: "desc" } },
      deals: { orderBy: { updatedAt: "desc" }, include: { contact: true } },
      activities: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });

  if (!account) notFound();

  return (
    <div>
      <PageHeader
        title={account.name}
        description={account.industry || undefined}
        actions={
          <div className="flex gap-2">
            <Link href={`/accounts/${id}/edit`}>
              <Button variant="outline">
                <Pencil className="mr-2 h-4 w-4" />
                編集
              </Button>
            </Link>
            <DeleteAccountButton accountId={id} />
          </div>
        }
      />
      <Tabs defaultValue="detail">
        <TabsList>
          <TabsTrigger value="detail">詳細</TabsTrigger>
          <TabsTrigger value="contacts">
            担当者 ({account.contacts.length})
          </TabsTrigger>
          <TabsTrigger value="deals">
            商談 ({account.deals.length})
          </TabsTrigger>
          <TabsTrigger value="activities">
            活動 ({account.activities.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="detail" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <dl className="grid gap-4 md:grid-cols-2">
                {[
                  { label: "電話番号", value: account.phone },
                  { label: "Webサイト", value: account.website },
                  { label: "住所", value: account.address },
                  { label: "業種", value: account.industry },
                  { label: "年間売上", value: formatCurrency(account.annualRevenue) },
                  { label: "従業員数", value: account.employees?.toLocaleString() },
                  { label: "作成日", value: formatDate(account.createdAt) },
                  { label: "更新日", value: formatDate(account.updatedAt) },
                ].map((item) => (
                  <div key={item.label}>
                    <dt className="text-sm text-muted-foreground">{item.label}</dt>
                    <dd className="text-sm font-medium mt-1">{item.value || "---"}</dd>
                  </div>
                ))}
              </dl>
              {account.description && (
                <div className="mt-4 pt-4 border-t">
                  <dt className="text-sm text-muted-foreground">説明</dt>
                  <dd className="text-sm mt-1 whitespace-pre-wrap">{account.description}</dd>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="contacts" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">担当者一覧</CardTitle>
              <Link href={`/contacts/new?accountId=${id}`}>
                <Button size="sm">追加</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {account.contacts.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">担当者がいません</p>
              ) : (
                <div className="space-y-2">
                  {account.contacts.map((c) => (
                    <Link key={c.id} href={`/contacts/${c.id}`} className="flex items-center justify-between py-2 px-2 rounded hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-blue-600">{c.lastName} {c.firstName}</p>
                        <p className="text-xs text-muted-foreground">{c.title || "---"} / {c.department || "---"}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{c.email || "---"}</p>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="deals" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">商談一覧</CardTitle>
              <Link href={`/deals/new?accountId=${id}`}>
                <Button size="sm">追加</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {account.deals.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">商談がありません</p>
              ) : (
                <div className="space-y-2">
                  {account.deals.map((d) => {
                    const stageInfo = DEAL_STAGES.find((s) => s.value === d.stage);
                    return (
                      <Link key={d.id} href={`/deals/${d.id}`} className="flex items-center justify-between py-2 px-2 rounded hover:bg-muted/50 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-blue-600">{d.name}</p>
                          <p className="text-xs text-muted-foreground">{d.contact ? `${d.contact.lastName} ${d.contact.firstName}` : "---"}</p>
                        </div>
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
              {account.activities.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">活動がありません</p>
              ) : (
                <div className="space-y-2">
                  {account.activities.map((a) => (
                    <div key={a.id} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium">{a.subject}</p>
                        <p className="text-xs text-muted-foreground">{a.type}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{formatDate(a.createdAt)}</span>
                        {a.completed && <Badge variant="secondary">完了</Badge>}
                      </div>
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

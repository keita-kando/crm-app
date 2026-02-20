import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { DEAL_STAGES } from "@/lib/constants";
import { DeleteDealButton } from "@/components/deals/delete-deal-button";

export const dynamic = 'force-dynamic';

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deal = await prisma.deal.findUnique({
    where: { id },
    include: {
      account: true,
      contact: true,
      activities: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });

  if (!deal) notFound();
  const stageInfo = DEAL_STAGES.find((s) => s.value === deal.stage);
  const stageIndex = stageInfo ? DEAL_STAGES.indexOf(stageInfo) : 0;

  return (
    <div>
      <PageHeader
        title={deal.name}
        description={stageInfo ? `ステージ: ${stageInfo.label}` : undefined}
        actions={
          <div className="flex gap-2">
            <Link href={`/deals/${id}/edit`}>
              <Button variant="outline"><Pencil className="mr-2 h-4 w-4" />編集</Button>
            </Link>
            <DeleteDealButton dealId={id} />
          </div>
        }
      />
      {/* Stage progress bar */}
      <div className="flex gap-1 mb-6">
        {DEAL_STAGES.filter((s) => s.value !== "失注").map((s, i) => (
          <div key={s.value} className="flex-1">
            <div className={`h-2 rounded-full ${i <= stageIndex ? s.color : "bg-muted"}`} />
            <p className="text-xs text-center mt-1 text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
      <Tabs defaultValue="detail">
        <TabsList>
          <TabsTrigger value="detail">詳細</TabsTrigger>
          <TabsTrigger value="activities">活動 ({deal.activities.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="detail" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <dl className="grid gap-4 md:grid-cols-2">
                <div>
                  <dt className="text-sm text-muted-foreground">金額</dt>
                  <dd className="text-sm font-medium mt-1">{formatCurrency(deal.amount)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">確度</dt>
                  <dd className="text-sm font-medium mt-1">{deal.probability}%</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">ステージ</dt>
                  <dd className="text-sm font-medium mt-1">{stageInfo?.label || deal.stage}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">完了予定日</dt>
                  <dd className="text-sm font-medium mt-1">{formatDate(deal.closeDate)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">取引先</dt>
                  <dd className="text-sm font-medium mt-1">
                    {deal.account ? (
                      <Link href={`/accounts/${deal.account.id}`} className="text-blue-600 hover:underline">{deal.account.name}</Link>
                    ) : "---"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">担当者</dt>
                  <dd className="text-sm font-medium mt-1">
                    {deal.contact ? (
                      <Link href={`/contacts/${deal.contact.id}`} className="text-blue-600 hover:underline">{deal.contact.lastName} {deal.contact.firstName}</Link>
                    ) : "---"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">作成日</dt>
                  <dd className="text-sm font-medium mt-1">{formatDate(deal.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">更新日</dt>
                  <dd className="text-sm font-medium mt-1">{formatDate(deal.updatedAt)}</dd>
                </div>
              </dl>
              {deal.description && (
                <div className="mt-4 pt-4 border-t">
                  <dt className="text-sm text-muted-foreground">説明</dt>
                  <dd className="text-sm mt-1 whitespace-pre-wrap">{deal.description}</dd>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activities" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {deal.activities.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">活動がありません</p>
              ) : (
                <div className="space-y-2">
                  {deal.activities.map((a) => (
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

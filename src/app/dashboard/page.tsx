import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/format";
import { DEAL_STAGES } from "@/lib/constants";
import { Building2, Handshake, TrendingUp, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { PipelineFunnel } from "@/components/dashboard/pipeline-funnel";
import { RecentDeals } from "@/components/dashboard/recent-deals";
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [totalAccounts, deals, upcomingTasks] = await Promise.all([
    prisma.account.count(),
    prisma.deal.findMany({
      include: { account: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.activity.findMany({
      where: { completed: false, dueDate: { not: null } },
      orderBy: { dueDate: "asc" },
      take: 5,
      include: { account: true, deal: true },
    }),
  ]);

  const wonDeals = deals.filter((d) => d.stage === "受注");
  const activeDeals = deals.filter(
    (d) => d.stage !== "受注" && d.stage !== "失注"
  );
  const totalRevenue = wonDeals.reduce((sum, d) => sum + (d.amount || 0), 0);
  const pipelineValue = activeDeals.reduce(
    (sum, d) => sum + (d.amount || 0),
    0
  );

  const dealsByStage = DEAL_STAGES.map((stage) => ({
    name: stage.label,
    value: deals.filter((d) => d.stage === stage.value).length,
    amount: deals
      .filter((d) => d.stage === stage.value)
      .reduce((sum, d) => sum + (d.amount || 0), 0),
    color: stage.color,
  }));

  const now = new Date();
  const revenueByMonth = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const monthDeals = wonDeals.filter((d) => {
      const updated = new Date(d.updatedAt);
      return updated >= date && updated <= monthEnd;
    });
    return {
      month: `${date.getMonth() + 1}月`,
      revenue: monthDeals.reduce((sum, d) => sum + (d.amount || 0), 0),
    };
  });

  const kpis = [
    {
      title: "取引先数",
      value: totalAccounts.toString(),
      icon: Building2,
      color: "text-blue-600",
    },
    {
      title: "進行中の商談",
      value: activeDeals.length.toString(),
      icon: Handshake,
      color: "text-cyan-600",
    },
    {
      title: "パイプライン合計",
      value: formatCurrency(pipelineValue),
      icon: TrendingUp,
      color: "text-orange-600",
    },
    {
      title: "受注金額",
      value: formatCurrency(totalRevenue),
      icon: Trophy,
      color: "text-green-600",
    },
  ];

  const recentDealsList = deals.slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-6">ダッシュボード</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">月別受注金額</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={revenueByMonth} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">パイプライン</CardTitle>
          </CardHeader>
          <CardContent>
            <PipelineFunnel data={dealsByStage} />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">最近の商談</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentDeals deals={recentDealsList} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">期限間近のタスク</CardTitle>
          </CardHeader>
          <CardContent>
            <UpcomingTasks tasks={upcomingTasks} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

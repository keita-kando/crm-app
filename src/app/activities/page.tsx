import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivityList } from "@/components/activities/activity-list";
import { TaskList } from "@/components/activities/task-list";
import { ActivityFormDialog } from "@/components/activities/activity-form-dialog";

export default async function ActivitiesPage() {
  const [activities, accounts, contacts, deals] = await Promise.all([
    prisma.activity.findMany({
      include: { account: true, contact: true, deal: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.account.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.contact.findMany({
      orderBy: { lastName: "asc" },
      select: { id: true, firstName: true, lastName: true },
    }),
    prisma.deal.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  const activityLogs = activities.filter((a) => a.type !== "タスク");
  const tasks = activities.filter((a) => a.type === "タスク");

  return (
    <div>
      <PageHeader
        title="活動・タスク"
        description={`${activities.length}件`}
        actions={
          <ActivityFormDialog accounts={accounts} contacts={contacts} deals={deals} />
        }
      />
      <Tabs defaultValue="activities">
        <TabsList>
          <TabsTrigger value="activities">活動ログ ({activityLogs.length})</TabsTrigger>
          <TabsTrigger value="tasks">タスク ({tasks.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="activities" className="mt-4">
          <ActivityList activities={activityLogs} />
        </TabsContent>
        <TabsContent value="tasks" className="mt-4">
          <TaskList tasks={tasks} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

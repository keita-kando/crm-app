import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: string;
  subject: string;
  dueDate: Date | null;
  priority: string;
  type: string;
  account: { name: string } | null;
  deal: { name: string } | null;
}

export function UpcomingTasks({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        期限間近のタスクはありません
      </p>
    );
  }
  const priorityColor = (p: string) => {
    if (p === "高") return "destructive" as const;
    if (p === "中") return "secondary" as const;
    return "outline" as const;
  };
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium">{task.subject}</p>
            <p className="text-xs text-muted-foreground">
              {task.account?.name || task.deal?.name || "---"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {formatDate(task.dueDate)}
            </span>
            <Badge variant={priorityColor(task.priority)} className="text-xs">
              {task.priority}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}

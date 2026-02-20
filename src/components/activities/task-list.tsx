"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";

interface Task {
  id: string;
  subject: string;
  dueDate: Date | null;
  completed: boolean;
  priority: string;
  account: { name: string } | null;
  deal: { name: string } | null;
}

export function TaskList({ tasks }: { tasks: Task[] }) {
  const router = useRouter();

  if (tasks.length === 0) {
    return <p className="text-sm text-muted-foreground py-8 text-center">タスクがありません</p>;
  }

  const toggleComplete = async (taskId: string, completed: boolean) => {
    await fetch(`/api/activities/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
    router.refresh();
  };

  const priorityVariant = (p: string) => {
    if (p === "高") return "destructive" as const;
    if (p === "中") return "secondary" as const;
    return "outline" as const;
  };

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <Card key={task.id} className={task.completed ? "opacity-60" : ""}>
          <CardContent className="py-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task.id, task.completed)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${task.completed ? "line-through" : ""}`}>
                  {task.subject}
                </p>
                <div className="flex gap-2 mt-1">
                  {task.account && <span className="text-xs text-muted-foreground">{task.account.name}</span>}
                  {task.deal && <span className="text-xs text-muted-foreground">{task.deal.name}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {task.dueDate && <span className="text-xs text-muted-foreground">{formatDate(task.dueDate)}</span>}
                <Badge variant={priorityVariant(task.priority)} className="text-xs">{task.priority}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

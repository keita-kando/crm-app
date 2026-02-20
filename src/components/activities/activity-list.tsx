import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/format";
import { Phone, Mail, MapPin, Users, CheckSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const typeIcons: Record<string, LucideIcon> = {
  "電話": Phone,
  "メール": Mail,
  "訪問": MapPin,
  "会議": Users,
  "タスク": CheckSquare,
};

interface Activity {
  id: string;
  type: string;
  subject: string;
  description: string | null;
  completed: boolean;
  createdAt: Date;
  account: { name: string } | null;
  contact: { firstName: string; lastName: string } | null;
  deal: { name: string } | null;
}

export function ActivityList({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return <p className="text-sm text-muted-foreground py-8 text-center">活動がありません</p>;
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => {
        const Icon = typeIcons[activity.type] || CheckSquare;
        return (
          <Card key={activity.id}>
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 rounded-full bg-muted">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{activity.subject}</p>
                    <span className="text-xs text-muted-foreground">{formatDateTime(activity.createdAt)}</span>
                  </div>
                  {activity.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{activity.description}</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">{activity.type}</Badge>
                    {activity.account && <Badge variant="secondary" className="text-xs">{activity.account.name}</Badge>}
                    {activity.deal && <Badge variant="secondary" className="text-xs">{activity.deal.name}</Badge>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Activity {
  id: string;
  type: string;
  description: string;
  time: string;
  icon: string;
}

const activities: Activity[] = [
  {
    id: "1",
    type: "member",
    description: "New member John Doe joined Green Earth Initiative",
    time: "2 minutes ago",
    icon: "👤",
  },
  {
    id: "2",
    type: "donation",
    description: "Received $5,000 donation from Tech Corp",
    time: "15 minutes ago",
    icon: "💰",
  },
  {
    id: "3",
    type: "event",
    description: "Community Cleanup Event started",
    time: "1 hour ago",
    icon: "📅",
  },
  {
    id: "4",
    type: "volunteer",
    description: "Sarah Johnson signed up for 5 volunteer hours",
    time: "3 hours ago",
    icon: "❤️",
  },
  {
    id: "5",
    type: "organization",
    description: "Urban Gardens Network updated their profile",
    time: "5 hours ago",
    icon: "🏢",
  },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-4 pb-4 border-b last:border-0">
                <div className="text-2xl">{activity.icon}</div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

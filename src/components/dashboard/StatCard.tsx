import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "increase" | "decrease";
  icon: LucideIcon;
  iconColor?: string;
}

export function StatCard({ title, value, change, changeType, icon: Icon, iconColor = "text-primary" }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
            {change && (
              <p className={cn(
                "text-sm mt-2 flex items-center gap-1",
                changeType === "increase" ? "text-success" : "text-destructive"
              )}>
                <span>{changeType === "increase" ? "↑" : "↓"} {change}</span>
                <span className="text-muted-foreground">vs last month</span>
              </p>
            )}
          </div>
          <div className={cn("h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center", iconColor)}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

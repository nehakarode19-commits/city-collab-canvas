import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface VolunteerCategoryCardProps {
  id: number;
  name: string;
  timeSlot: string;
  current: number;
  capacity: number;
  description: string;
  isSelected: boolean;
  onClick: () => void;
  onEdit: () => void;
}

export function VolunteerCategoryCard({
  name,
  timeSlot,
  current,
  capacity,
  description,
  isSelected,
  onClick,
  onEdit,
}: VolunteerCategoryCardProps) {
  const percentage = (current / capacity) * 100;
  const isFull = current >= capacity;

  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        isSelected && "ring-2 ring-primary shadow-lg"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-1">{name}</CardTitle>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{timeSlot}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Capacity</span>
            </div>
            <span className="font-semibold">
              {current} / {capacity}
            </span>
          </div>
          <Progress value={percentage} className="h-2" />
          <div className="flex items-center justify-between">
            <Badge
              variant={isFull ? "secondary" : "default"}
              className={cn(
                "text-xs",
                isFull && "bg-success/10 text-success hover:bg-success/20"
              )}
            >
              {percentage.toFixed(0)}% filled
            </Badge>
            {isFull && (
              <Badge variant="outline" className="text-xs text-destructive">
                Full
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

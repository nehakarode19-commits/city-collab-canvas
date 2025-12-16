import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";

interface DonationCardProps {
  id: number;
  title: string;
  category: string;
  subcategory: string;
  required: number;
  collected: number;
  description: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function DonationCard({
  id,
  title,
  category,
  subcategory,
  required,
  collected,
  description,
  onEdit,
  onDelete,
}: DonationCardProps) {
  const progress = (collected / required) * 100;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold line-clamp-1">{title}</CardTitle>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(id)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap mt-2">
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {subcategory}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">
              ${collected.toLocaleString()} / ${required.toLocaleString()}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">
            {progress.toFixed(0)}% funded
          </p>
        </div>

        <Button variant="outline" className="w-full" size="sm">
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}

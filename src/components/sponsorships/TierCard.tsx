import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface TierCardProps {
  id: number;
  name: string;
  price: number;
  color: string;
  benefits: string[];
  onEdit: (id: number) => void;
}

export function TierCard({ id, name, price, color, benefits, onEdit }: TierCardProps) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-border/50 relative overflow-hidden">
      <div className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r", color)} />
      
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">{name}</CardTitle>
            <Badge
              variant="secondary"
              className={cn("mt-2 bg-gradient-to-r text-white", color)}
            >
              ${price.toLocaleString()}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onEdit(id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Benefits Included
          </h4>
          <ul className="space-y-2">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

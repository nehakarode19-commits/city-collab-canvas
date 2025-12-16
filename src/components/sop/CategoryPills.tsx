import { Badge } from "@/components/ui/badge";
import { FileText, Shield, AlertTriangle, Wrench, Droplets, Trees } from "lucide-react";

interface CategoryPillsProps {
  categories: { id: string; name: string }[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const categoryIcons: Record<string, any> = {
  Safety: Shield,
  HR: FileText,
  Emergency: AlertTriangle,
  "Public Works": Wrench,
  Water: Droplets,
  "Parks & Rec": Trees,
};

export function CategoryPills({ categories, selectedCategory, onSelectCategory }: CategoryPillsProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-foreground">Categories</h3>
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={selectedCategory === "all" ? "default" : "outline"}
          className="cursor-pointer hover:bg-primary/90 transition-colors px-4 py-2"
          onClick={() => onSelectCategory("all")}
        >
          All Categories
        </Badge>
        {categories.map((cat) => {
          const Icon = categoryIcons[cat.name] || FileText;
          return (
            <Badge
              key={cat.id}
              variant={selectedCategory === cat.name ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/90 transition-colors px-4 py-2 flex items-center gap-2"
              onClick={() => onSelectCategory(cat.name)}
            >
              <Icon className="h-3 w-3" />
              {cat.name}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
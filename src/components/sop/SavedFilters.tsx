import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Star, StarOff, Trash2, Save } from "lucide-react";

interface FilterPreset {
  id: string;
  name: string;
  department: string;
  category: string;
  isDefault: boolean;
}

interface SavedFiltersProps {
  onApplyFilter: (department: string, category: string) => void;
  currentDepartment: string;
  currentCategory: string;
}

export function SavedFilters({ onApplyFilter, currentDepartment, currentCategory }: SavedFiltersProps) {
  const [presets, setPresets] = useState<FilterPreset[]>([
    { id: "1", name: "Fire Dept SOPs", department: "Fire Department", category: "all", isDefault: true },
    { id: "2", name: "Emergency Procedures", department: "all", category: "Emergency", isDefault: false },
  ]);
  const [filterName, setFilterName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSaveFilter = () => {
    if (!filterName.trim()) return;
    
    const newPreset: FilterPreset = {
      id: Date.now().toString(),
      name: filterName,
      department: currentDepartment,
      category: currentCategory,
      isDefault: false,
    };
    
    setPresets([...presets, newPreset]);
    setFilterName("");
    setIsDialogOpen(false);
  };

  const handleToggleDefault = (id: string) => {
    setPresets(presets.map(p => ({
      ...p,
      isDefault: p.id === id ? !p.isDefault : p.isDefault,
    })));
  };

  const handleDelete = (id: string) => {
    setPresets(presets.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Saved Filters</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Save className="mr-2 h-3 w-3" />
              Save Current Filter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Filter Preset</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Filter name (e.g., Fire Dept SOPs)"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Current: {currentDepartment} / {currentCategory}
                </p>
              </div>
              <Button onClick={handleSaveFilter} className="w-full">
                Save Filter
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <Badge
            key={preset.id}
            variant="secondary"
            className="cursor-pointer hover:bg-secondary/80 transition-colors px-3 py-1.5 flex items-center gap-2"
          >
            <button
              onClick={() => handleToggleDefault(preset.id)}
              className="hover:text-yellow-500 transition-colors"
            >
              {preset.isDefault ? (
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              ) : (
                <StarOff className="h-3 w-3" />
              )}
            </button>
            <span onClick={() => onApplyFilter(preset.department, preset.category)}>
              {preset.name}
            </span>
            <button
              onClick={() => handleDelete(preset.id)}
              className="hover:text-destructive transition-colors"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
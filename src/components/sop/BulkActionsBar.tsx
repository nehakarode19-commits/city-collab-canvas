import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Archive, Trash2, UserPlus, CheckCircle } from "lucide-react";

interface BulkActionsBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBulkPublish: () => void;
  onBulkArchive: () => void;
  onBulkDelete: () => void;
  onBulkAssign: () => void;
}

export function BulkActionsBar({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onBulkPublish,
  onBulkArchive,
  onBulkDelete,
  onBulkAssign,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedCount === totalCount}
              onCheckedChange={() => {
                if (selectedCount === totalCount) {
                  onDeselectAll();
                } else {
                  onSelectAll();
                }
              }}
            />
            <span className="font-medium">
              {selectedCount} of {totalCount} selected
            </span>
          </div>
          {selectedCount < totalCount && (
            <Button variant="link" size="sm" onClick={onSelectAll} className="h-auto p-0">
              Select all {totalCount}
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onBulkPublish}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Publish
          </Button>
          <Button variant="outline" size="sm" onClick={onBulkArchive}>
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </Button>
          <Button variant="outline" size="sm" onClick={onBulkAssign}>
            <UserPlus className="mr-2 h-4 w-4" />
            Assign Reviewers
          </Button>
          <Button variant="destructive" size="sm" onClick={onBulkDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
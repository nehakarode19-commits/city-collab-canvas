import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History, Download } from "lucide-react";

interface Version {
  version: string;
  date: string;
  author: string;
  changes: string;
}

interface VersionHistoryModalProps {
  sopTitle: string;
}

export function VersionHistoryModal({ sopTitle }: VersionHistoryModalProps) {
  // Mock data - in real app, fetch from database
  const versions: Version[] = [
    { version: "2.0", date: "2024-01-15", author: "John Doe", changes: "Major update: Added new safety protocols" },
    { version: "1.5", date: "2023-11-20", author: "Jane Smith", changes: "Updated contact information" },
    { version: "1.0", date: "2023-09-10", author: "Admin", changes: "Initial version" },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 text-xs">
          <History className="mr-1 h-3 w-3" />
          View History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Version History: {sopTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {versions.map((v, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant={index === 0 ? "default" : "secondary"}>
                    v{v.version}
                  </Badge>
                  {index === 0 && (
                    <Badge variant="outline" className="text-xs">Current</Badge>
                  )}
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date(v.date).toLocaleDateString()} • {v.author}
              </div>
              <p className="text-sm">{v.changes}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, CheckCircle, XCircle, Eye, Upload, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PreviewRow {
  email: string;
  fullName: string;
  department: string;
  role: string;
  status: "new" | "update" | "deactivate" | "error";
  errorMessage?: string;
  changes?: { field: string; from: string; to: string }[];
}

interface RosterUploadPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  previewData: PreviewRow[];
  onConfirm: () => void;
  fileName: string;
}

const statusConfig = {
  new: { label: "New", variant: "default" as const, icon: CheckCircle, color: "text-success" },
  update: { label: "Update", variant: "secondary" as const, icon: AlertTriangle, color: "text-warning" },
  deactivate: { label: "Pending Deactivation", variant: "destructive" as const, icon: XCircle, color: "text-destructive" },
  error: { label: "Error", variant: "destructive" as const, icon: XCircle, color: "text-destructive" },
};

export function RosterUploadPreview({ isOpen, onClose, previewData, onConfirm, fileName }: RosterUploadPreviewProps) {
  const [selectedRow, setSelectedRow] = useState<PreviewRow | null>(null);

  const stats = {
    new: previewData.filter(r => r.status === "new").length,
    update: previewData.filter(r => r.status === "update").length,
    deactivate: previewData.filter(r => r.status === "deactivate").length,
    errors: previewData.filter(r => r.status === "error").length,
  };

  const hasErrors = stats.errors > 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Upload Preview: {fileName}
          </DialogTitle>
          <DialogDescription>
            Review the changes before applying them to the system
          </DialogDescription>
        </DialogHeader>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-3">
          <Card className="bg-success/10 border-success/20">
            <CardContent className="py-3 text-center">
              <div className="text-2xl font-bold text-success">{stats.new}</div>
              <div className="text-xs text-muted-foreground">New Users</div>
            </CardContent>
          </Card>
          <Card className="bg-warning/10 border-warning/20">
            <CardContent className="py-3 text-center">
              <div className="text-2xl font-bold text-warning">{stats.update}</div>
              <div className="text-xs text-muted-foreground">Updates</div>
            </CardContent>
          </Card>
          <Card className="bg-destructive/10 border-destructive/20">
            <CardContent className="py-3 text-center">
              <div className="text-2xl font-bold text-destructive">{stats.deactivate}</div>
              <div className="text-xs text-muted-foreground">Deactivations</div>
            </CardContent>
          </Card>
          <Card className={`${hasErrors ? "bg-destructive/10 border-destructive" : "bg-muted"}`}>
            <CardContent className="py-3 text-center">
              <div className={`text-2xl font-bold ${hasErrors ? "text-destructive" : "text-muted-foreground"}`}>
                {stats.errors}
              </div>
              <div className="text-xs text-muted-foreground">Errors</div>
            </CardContent>
          </Card>
        </div>

        {hasErrors && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-sm text-destructive">
              {stats.errors} row(s) have errors and will be skipped. Fix issues and re-upload for complete processing.
            </span>
          </div>
        )}

        {/* Preview Table */}
        <ScrollArea className="h-[350px] border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewData.map((row, index) => {
                const config = statusConfig[row.status];
                const Icon = config.icon;
                return (
                  <TableRow key={index} className={row.status === "error" ? "bg-destructive/5" : ""}>
                    <TableCell className="font-mono text-sm">{row.email}</TableCell>
                    <TableCell>{row.fullName}</TableCell>
                    <TableCell>{row.department}</TableCell>
                    <TableCell>{row.role}</TableCell>
                    <TableCell>
                      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
                        <Icon className={`h-3 w-3 ${config.color}`} />
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {(row.errorMessage || row.changes) && (
                        <Button variant="ghost" size="sm" onClick={() => setSelectedRow(row)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={previewData.length === 0}>
            <Upload className="h-4 w-4 mr-2" />
            Apply Changes ({previewData.length - stats.errors} records)
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Row Detail Dialog */}
      <Dialog open={!!selectedRow} onOpenChange={(open) => !open && setSelectedRow(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedRow?.email}</DialogTitle>
            <DialogDescription>
              {selectedRow?.status === "error" ? "Error Details" : "Change Details"}
            </DialogDescription>
          </DialogHeader>
          {selectedRow?.errorMessage && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-sm text-destructive">{selectedRow.errorMessage}</p>
            </div>
          )}
          {selectedRow?.changes && (
            <div className="space-y-2">
              {selectedRow.changes.map((change, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                  <span className="text-sm font-medium w-24">{change.field}:</span>
                  <span className="text-sm text-muted-foreground">{change.from}</span>
                  <ArrowRight className="h-4 w-4" />
                  <span className="text-sm font-medium">{change.to}</span>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRow(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}

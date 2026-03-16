import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Search, Users, UserX, Briefcase, CheckCircle, AlertTriangle, X, FileSpreadsheet, Upload } from "lucide-react";
import { toast } from "sonner";

export interface ImportedMember {
  name: string;
  email: string;
  department: string;
  role: string;
  organization: string;
  phone: string;
  status: "active" | "retired" | "job_changed" | "new" | "unchanged";
  previousRole?: string;
  previousDepartment?: string;
  retiredDate?: string;
  newOrganization?: string;
  [key: string]: unknown;
}

interface ImportPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: ImportedMember[];
  fileName: string;
  onConfirmImport: () => void;
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
  active: { label: "Active", variant: "default", icon: <CheckCircle className="h-3 w-3" /> },
  retired: { label: "Retired", variant: "destructive", icon: <UserX className="h-3 w-3" /> },
  job_changed: { label: "Job Changed", variant: "outline", icon: <Briefcase className="h-3 w-3" /> },
  new: { label: "New Member", variant: "secondary", icon: <Users className="h-3 w-3" /> },
  unchanged: { label: "Unchanged", variant: "outline", icon: <CheckCircle className="h-3 w-3" /> },
};

export function ImportPreviewDialog({ open, onOpenChange, members, fileName, onConfirmImport }: ImportPreviewDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const retiredCount = members.filter(m => m.status === "retired").length;
  const jobChangedCount = members.filter(m => m.status === "job_changed").length;
  const newCount = members.filter(m => m.status === "new").length;
  const activeCount = members.filter(m => m.status === "active" || m.status === "unchanged").length;

  const filteredMembers = members.filter(member => {
    const matchesSearch =
      (member.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.department || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.organization || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Preview — {fileName}
          </DialogTitle>
          <DialogDescription>
            Review the data below before importing. Total {members.length} records found.
          </DialogDescription>
        </DialogHeader>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-3">
          <div className="rounded-lg border p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <CheckCircle className="h-3 w-3 text-success" /> Active
            </div>
            <span className="text-xl font-bold text-success">{activeCount}</span>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <UserX className="h-3 w-3 text-destructive" /> Retired
            </div>
            <span className="text-xl font-bold text-destructive">{retiredCount}</span>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <Briefcase className="h-3 w-3 text-warning" /> Job Changed
            </div>
            <span className="text-xl font-bold text-warning">{jobChangedCount}</span>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <Users className="h-3 w-3 text-primary" /> New
            </div>
            <span className="text-xl font-bold text-primary">{newCount}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
              <SelectItem value="job_changed">Job Changed</SelectItem>
              <SelectItem value="new">New Member</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto rounded-md border min-h-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky top-0 bg-background">#</TableHead>
                <TableHead className="sticky top-0 bg-background">Name</TableHead>
                <TableHead className="sticky top-0 bg-background">Email</TableHead>
                <TableHead className="sticky top-0 bg-background">Organization</TableHead>
                <TableHead className="sticky top-0 bg-background">Department</TableHead>
                <TableHead className="sticky top-0 bg-background">Role / Position</TableHead>
                <TableHead className="sticky top-0 bg-background">Phone</TableHead>
                <TableHead className="sticky top-0 bg-background">Status</TableHead>
                <TableHead className="sticky top-0 bg-background">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredMembers.map((member, index) => {
                  const config = statusConfig[member.status] || statusConfig.active;
                  return (
                    <TableRow
                      key={index}
                      className={
                        member.status === "retired" ? "bg-destructive/5" :
                        member.status === "job_changed" ? "bg-warning/5" :
                        member.status === "new" ? "bg-primary/5" : ""
                      }
                    >
                      <TableCell className="text-muted-foreground text-xs">{index + 1}</TableCell>
                      <TableCell className="font-medium">{member.name || "—"}</TableCell>
                      <TableCell className="text-sm">{member.email || "—"}</TableCell>
                      <TableCell>{member.organization || "—"}</TableCell>
                      <TableCell>
                        <div>
                          <span>{member.department || "—"}</span>
                          {member.status === "job_changed" && member.previousDepartment && (
                            <div className="text-xs text-muted-foreground line-through">{member.previousDepartment}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <span>{member.role || "—"}</span>
                          {member.status === "job_changed" && member.previousRole && (
                            <div className="text-xs text-muted-foreground line-through">{member.previousRole}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{member.phone || "—"}</TableCell>
                      <TableCell>
                        <Badge variant={config.variant} className="flex items-center gap-1 w-fit text-xs">
                          {config.icon}
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[150px]">
                        {member.status === "retired" && member.retiredDate && (
                          <span>Retired: {member.retiredDate}</span>
                        )}
                        {member.status === "job_changed" && member.newOrganization && (
                          <span>Moved to: {member.newOrganization}</span>
                        )}
                        {member.status === "job_changed" && !member.newOrganization && member.previousRole && (
                          <span>Was: {member.previousRole}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        <p className="text-xs text-muted-foreground">
          Showing {filteredMembers.length} of {members.length} records
        </p>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirmImport}>
            <Upload className="h-4 w-4 mr-2" />
            Confirm Import ({members.length} records)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
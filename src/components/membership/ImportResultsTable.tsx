import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Users, UserX, Briefcase, FileSpreadsheet, Upload } from "lucide-react";
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
  onConfirmImport: (members: ImportedMember[]) => void;
}

export function ImportPreviewDialog({ open, onOpenChange, members, fileName, onConfirmImport }: ImportPreviewDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [memberStatuses, setMemberStatuses] = useState<Record<number, "retired" | "job_changed">>({});
  const [selectedMembers, setSelectedMembers] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const filteredMembers = members.filter(member => {
    const matchesSearch =
      (member.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.department || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.organization || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const retiredCount = Object.values(memberStatuses).filter(s => s === "retired").length;
  const changedCount = Object.values(memberStatuses).filter(s => s === "job_changed").length;
  const unassignedCount = members.length - Object.keys(memberStatuses).length;

  const handleStatusChange = (index: number, status: "retired" | "job_changed") => {
    setMemberStatuses(prev => {
      const next = { ...prev };
      if (next[index] === status) {
        delete next[index];
      } else {
        next[index] = status;
      }
      return next;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      const allIndices = new Set(members.map((_, i) => i));
      setSelectedMembers(allIndices);
    } else {
      setSelectedMembers(new Set());
    }
  };

  const handleSelectMember = (index: number, checked: boolean) => {
    setSelectedMembers(prev => {
      const next = new Set(prev);
      if (checked) next.add(index);
      else next.delete(index);
      return next;
    });
    if (!checked) setSelectAll(false);
  };

  const handleBulkAssign = (status: "retired" | "job_changed") => {
    if (selectedMembers.size === 0) {
      toast.error("Please select members first");
      return;
    }
    setMemberStatuses(prev => {
      const next = { ...prev };
      selectedMembers.forEach(i => { next[i] = status; });
      return next;
    });
    toast.success(`${selectedMembers.size} members marked as ${status === "retired" ? "Retired" : "Change Member"}`);
  };

  const handleConfirm = () => {
    if (Object.keys(memberStatuses).length === 0) {
      toast.error("Please assign status to at least one member");
      return;
    }
    const updatedMembers = members.map((m, i) => ({
      ...m,
      status: memberStatuses[i] || m.status,
    }));
    onConfirmImport(updatedMembers);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Preview — {fileName}
          </DialogTitle>
          <DialogDescription>
            Assign each member as Retired or Change Member. Total {members.length} records found.
          </DialogDescription>
        </DialogHeader>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <UserX className="h-3 w-3 text-destructive" /> Retired
            </div>
            <span className="text-xl font-bold text-destructive">{retiredCount}</span>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <Briefcase className="h-3 w-3 text-warning" /> Change Member
            </div>
            <span className="text-xl font-bold text-warning">{changedCount}</span>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <Users className="h-3 w-3 text-muted-foreground" /> Unassigned
            </div>
            <span className="text-xl font-bold text-muted-foreground">{unassignedCount}</span>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              {selectedMembers.size} selected
            </span>
            <Button
              size="sm"
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive/10"
              onClick={() => handleBulkAssign("retired")}
              disabled={selectedMembers.size === 0}
            >
              <UserX className="h-3.5 w-3.5 mr-1" />
              Mark Retired
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-warning text-warning hover:bg-warning/10"
              onClick={() => handleBulkAssign("job_changed")}
              disabled={selectedMembers.size === 0}
            >
              <Briefcase className="h-3.5 w-3.5 mr-1" />
              Mark Change
            </Button>
          </div>
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
                <TableHead className="sticky top-0 bg-background w-[40px]">
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                  />
                </TableHead>
                <TableHead className="sticky top-0 bg-background">#</TableHead>
                <TableHead className="sticky top-0 bg-background">Name</TableHead>
                <TableHead className="sticky top-0 bg-background">Email</TableHead>
                <TableHead className="sticky top-0 bg-background">Organization</TableHead>
                <TableHead className="sticky top-0 bg-background">Department</TableHead>
                <TableHead className="sticky top-0 bg-background">Role</TableHead>
                <TableHead className="sticky top-0 bg-background">Phone</TableHead>
                <TableHead className="sticky top-0 bg-background min-w-[180px]">Assign Status</TableHead>
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
                filteredMembers.map((member, idx) => {
                  const realIndex = members.indexOf(member);
                  const assignedStatus = memberStatuses[realIndex];
                  return (
                    <TableRow
                      key={realIndex}
                      className={
                        assignedStatus === "retired" ? "bg-destructive/5" :
                        assignedStatus === "job_changed" ? "bg-warning/5" : ""
                      }
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedMembers.has(realIndex)}
                          onCheckedChange={(checked) => handleSelectMember(realIndex, !!checked)}
                        />
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">{realIndex + 1}</TableCell>
                      <TableCell className="font-medium">{member.name || "—"}</TableCell>
                      <TableCell className="text-sm">{member.email || "—"}</TableCell>
                      <TableCell>{member.organization || "—"}</TableCell>
                      <TableCell>{member.department || "—"}</TableCell>
                      <TableCell>{member.role || "—"}</TableCell>
                      <TableCell className="text-sm">{member.phone || "—"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Button
                            size="sm"
                            variant={assignedStatus === "retired" ? "default" : "outline"}
                            className={
                              assignedStatus === "retired"
                                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 h-7 text-xs px-2"
                                : "h-7 text-xs px-2 border-destructive/30 text-destructive hover:bg-destructive/10"
                            }
                            onClick={() => handleStatusChange(realIndex, "retired")}
                          >
                            <UserX className="h-3 w-3 mr-1" />
                            Retired
                          </Button>
                          <Button
                            size="sm"
                            variant={assignedStatus === "job_changed" ? "default" : "outline"}
                            className={
                              assignedStatus === "job_changed"
                                ? "bg-warning text-warning-foreground hover:bg-warning/90 h-7 text-xs px-2"
                                : "h-7 text-xs px-2 border-warning/30 text-warning hover:bg-warning/10"
                            }
                            onClick={() => handleStatusChange(realIndex, "job_changed")}
                          >
                            <Briefcase className="h-3 w-3 mr-1" />
                            Change
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        <p className="text-xs text-muted-foreground">
          Showing {filteredMembers.length} of {members.length} records • {retiredCount} Retired • {changedCount} Changed • {unassignedCount} Unassigned
        </p>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            <Upload className="h-4 w-4 mr-2" />
            Confirm Import ({Object.keys(memberStatuses).length} assigned)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

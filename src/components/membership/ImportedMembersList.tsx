import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserMinus, Briefcase, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ImportedMember {
  id: string;
  name: string;
  email: string;
  department: string;
  status: "retired" | "job_change";
  previousRole?: string;
  newRole?: string;
  importedAt: string;
  fileName: string;
}

interface ImportedMembersListProps {
  members: ImportedMember[];
  onClear: () => void;
}

export function ImportedMembersList({ members, onClear }: ImportedMembersListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "retired" | "job_change">("all");

  if (members.length === 0) return null;

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const retiredCount = members.filter((m) => m.status === "retired").length;
  const jobChangeCount = members.filter((m) => m.status === "job_change").length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Imported Members</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {members.length} member(s) imported from last upload
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClear}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>

        {/* Summary badges */}
        <div className="flex gap-3 mt-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20">
            <UserMinus className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">{retiredCount} Retired</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
            <Briefcase className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">{jobChangeCount} Changed Job</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
              <SelectItem value="job_change">Changed Job</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Previous Role</TableHead>
              <TableHead>New Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No members found matching your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.department}</TableCell>
                  <TableCell>
                    {member.status === "retired" ? (
                      <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                        <UserMinus className="h-3 w-3" />
                        Retired
                      </Badge>
                    ) : (
                      <Badge className="flex items-center gap-1 w-fit bg-primary">
                        <Briefcase className="h-3 w-3" />
                        Changed Job
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{member.previousRole || "—"}</TableCell>
                  <TableCell>
                    {member.status === "retired" ? (
                      <span className="text-muted-foreground italic">N/A</span>
                    ) : (
                      member.newRole || "—"
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Users, UserX, Briefcase, CheckCircle, AlertTriangle, X } from "lucide-react";

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

interface ImportResultsTableProps {
  members: ImportedMember[];
  fileName: string;
  onClose: () => void;
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode; color: string }> = {
  active: { label: "Active", variant: "default", icon: <CheckCircle className="h-3 w-3" />, color: "text-success" },
  retired: { label: "Retired", variant: "destructive", icon: <UserX className="h-3 w-3" />, color: "text-destructive" },
  job_changed: { label: "Job Changed", variant: "outline", icon: <Briefcase className="h-3 w-3" />, color: "text-warning" },
  new: { label: "New Member", variant: "secondary", icon: <Users className="h-3 w-3" />, color: "text-primary" },
  unchanged: { label: "Unchanged", variant: "outline", icon: <CheckCircle className="h-3 w-3" />, color: "text-muted-foreground" },
};

export function ImportResultsTable({ members, fileName, onClose }: ImportResultsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const retiredCount = members.filter(m => m.status === "retired").length;
  const jobChangedCount = members.filter(m => m.status === "job_changed").length;
  const newCount = members.filter(m => m.status === "new").length;
  const activeCount = members.filter(m => m.status === "active").length;

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Import Results — {fileName}</h3>
          <p className="text-sm text-muted-foreground">Total {members.length} records imported</p>
        </div>
        <Button variant="outline" size="sm" onClick={onClose}>
          <X className="h-4 w-4 mr-1" />
          Close Results
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm text-muted-foreground">Active</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-success">{activeCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <UserX className="h-4 w-4 text-destructive" />
              <span className="text-sm text-muted-foreground">Retired</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-destructive">{retiredCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-warning" />
              <span className="text-sm text-muted-foreground">Job Changed</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-warning">{jobChangedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">New Members</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-primary">{newCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Imported Members List</CardTitle>
          <CardDescription>Complete breakdown of all imported records with status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
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
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Role / Position</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member, index) => {
                    const config = statusConfig[member.status] || statusConfig.active;
                    return (
                      <TableRow key={index} className={member.status === "retired" ? "bg-destructive/5" : member.status === "job_changed" ? "bg-warning/5" : ""}>
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
                          <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
                            {config.icon}
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
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
        </CardContent>
      </Card>
    </div>
  );
}
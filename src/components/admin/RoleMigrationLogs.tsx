import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { History, Search, Download, ArrowRight, User, Shield, Users, Filter } from "lucide-react";
import { format } from "date-fns";

interface RoleMigration {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  previousRole: string | null;
  newRole: string;
  changedBy: string;
  changedAt: string;
  reason?: string;
}

const mockMigrations: RoleMigration[] = [
  { id: "1", userId: "u1", userName: "John Doe", userEmail: "john.doe@city.gov", previousRole: "staff", newRole: "department_manager", changedBy: "Admin User", changedAt: "2024-01-15T10:30:00Z", reason: "Promoted to department head" },
  { id: "2", userId: "u2", userName: "Jane Smith", userEmail: "jane.smith@city.gov", previousRole: "department_manager", newRole: "admin", changedBy: "Admin User", changedAt: "2024-01-14T15:45:00Z", reason: "New system administrator" },
  { id: "3", userId: "u3", userName: "Bob Wilson", userEmail: "bob.wilson@city.gov", previousRole: null, newRole: "staff", changedBy: "System", changedAt: "2024-01-13T09:00:00Z", reason: "Initial role assignment" },
  { id: "4", userId: "u4", userName: "Alice Johnson", userEmail: "alice.johnson@city.gov", previousRole: "admin", newRole: "department_manager", changedBy: "Admin User", changedAt: "2024-01-12T11:20:00Z", reason: "Role restructuring" },
  { id: "5", userId: "u5", userName: "Mike Brown", userEmail: "mike.brown@city.gov", previousRole: "staff", newRole: "staff", changedBy: "Admin User", changedAt: "2024-01-11T14:00:00Z", reason: "Department transfer" },
  { id: "6", userId: "u6", userName: "Sarah Davis", userEmail: "sarah.davis@city.gov", previousRole: "department_manager", newRole: "staff", changedBy: "Admin User", changedAt: "2024-01-10T16:30:00Z", reason: "Voluntary demotion" },
];

const roleConfig = {
  admin: { label: "Administrator", icon: Shield, color: "text-destructive" },
  department_manager: { label: "Dept. Manager", icon: Users, color: "text-primary" },
  staff: { label: "Staff", icon: User, color: "text-muted-foreground" },
};

export function RoleMigrationLogs() {
  const [migrations] = useState<RoleMigration[]>(mockMigrations);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filteredMigrations = migrations.filter(m => {
    const matchesSearch = 
      m.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.changedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || m.newRole === roleFilter || m.previousRole === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleExport = () => {
    const csv = [
      ["User", "Email", "Previous Role", "New Role", "Changed By", "Changed At", "Reason"].join(","),
      ...filteredMigrations.map(m => [
        m.userName, m.userEmail, m.previousRole || "None", m.newRole, 
        m.changedBy, m.changedAt, m.reason || ""
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "role_migration_logs.csv";
    a.click();
  };

  const getRoleDisplay = (role: string | null) => {
    if (!role) return <span className="text-muted-foreground">None</span>;
    const config = roleConfig[role as keyof typeof roleConfig];
    if (!config) return <span>{role}</span>;
    const Icon = config.icon;
    return (
      <div className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        <span className="text-sm">{config.label}</span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Role Migration Logs
          </CardTitle>
          <CardDescription>Track all role changes and assignments</CardDescription>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by user or admin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Administrator</SelectItem>
              <SelectItem value="department_manager">Dept. Manager</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Logs Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role Change</TableHead>
              <TableHead>Changed By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMigrations.map((migration) => (
              <TableRow key={migration.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{migration.userName}</p>
                    <p className="text-sm text-muted-foreground">{migration.userEmail}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getRoleDisplay(migration.previousRole)}
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    {getRoleDisplay(migration.newRole)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{migration.changedBy}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(migration.changedAt), "MMM d, yyyy HH:mm")}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                  {migration.reason || "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

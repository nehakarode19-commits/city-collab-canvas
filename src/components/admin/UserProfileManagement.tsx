import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, Search, Edit, Eye, Shield, Ban, CheckCircle, XCircle, 
  AlertTriangle, Download, Mail, Clock, MoreHorizontal 
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  department: string;
  role: "admin" | "department_manager" | "staff";
  status: "active" | "inactive" | "pending" | "suspended";
  verificationStatus: "verified" | "self-reported" | "pending";
  partnerAccess: boolean;
  lastActive: string;
  createdAt: string;
}

// Mock data for demonstration
const mockUsers: UserProfile[] = [
  { id: "1", email: "john.doe@city.gov", fullName: "John Doe", department: "IT", role: "admin", status: "active", verificationStatus: "verified", partnerAccess: true, lastActive: "2024-01-15T10:30:00Z", createdAt: "2023-06-01T00:00:00Z" },
  { id: "2", email: "jane.smith@city.gov", fullName: "Jane Smith", department: "Finance", role: "department_manager", status: "active", verificationStatus: "verified", partnerAccess: false, lastActive: "2024-01-14T15:45:00Z", createdAt: "2023-07-15T00:00:00Z" },
  { id: "3", email: "bob.wilson@city.gov", fullName: "Bob Wilson", department: "HR", role: "staff", status: "pending", verificationStatus: "pending", partnerAccess: false, lastActive: "2024-01-10T09:00:00Z", createdAt: "2024-01-05T00:00:00Z" },
  { id: "4", email: "alice.johnson@city.gov", fullName: "Alice Johnson", department: "Public Works", role: "staff", status: "active", verificationStatus: "self-reported", partnerAccess: false, lastActive: "2024-01-15T08:20:00Z", createdAt: "2023-09-20T00:00:00Z" },
  { id: "5", email: "mike.brown@city.gov", fullName: "Mike Brown", department: "Parks", role: "department_manager", status: "suspended", verificationStatus: "verified", partnerAccess: true, lastActive: "2024-01-01T12:00:00Z", createdAt: "2023-03-10T00:00:00Z" },
  { id: "6", email: "sarah.davis@city.gov", fullName: "Sarah Davis", department: "Legal", role: "staff", status: "inactive", verificationStatus: "verified", partnerAccess: false, lastActive: "2023-12-20T14:30:00Z", createdAt: "2023-08-25T00:00:00Z" },
];

const statusConfig = {
  active: { label: "Active", variant: "default" as const, color: "bg-success" },
  inactive: { label: "Inactive", variant: "secondary" as const, color: "bg-muted-foreground" },
  pending: { label: "Pending", variant: "outline" as const, color: "bg-warning" },
  suspended: { label: "Suspended", variant: "destructive" as const, color: "bg-destructive" },
};

const verificationConfig = {
  verified: { label: "Verified", icon: CheckCircle, color: "text-success" },
  "self-reported": { label: "Self-Reported", icon: AlertTriangle, color: "text-warning" },
  pending: { label: "Pending", icon: Clock, color: "text-muted-foreground" },
};

const roleLabels = {
  admin: "Administrator",
  department_manager: "Dept. Manager",
  staff: "Staff",
};

export function UserProfileManagement() {
  const [users] = useState<UserProfile[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === "active").length,
    pending: users.filter(u => u.status === "pending").length,
    verified: users.filter(u => u.verificationStatus === "verified").length,
  };

  const handleExport = () => {
    const csv = [
      ["Email", "Full Name", "Department", "Role", "Status", "Verification", "Partner Access", "Last Active"].join(","),
      ...filteredUsers.map(u => [
        u.email, u.fullName, u.department, u.role, u.status, 
        u.verificationStatus, u.partnerAccess ? "Yes" : "No", u.lastActive
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "user_profiles_export.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Users</span>
            </div>
            <div className="text-2xl font-bold mt-1">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm text-muted-foreground">Active</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-success">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-warning" />
              <span className="text-sm text-muted-foreground">Pending</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-warning">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Verified</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-primary">{stats.verified}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Actions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>User Profiles</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </div>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Partner Access</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const statusConf = statusConfig[user.status];
                const verifyConf = verificationConfig[user.verificationStatus];
                const VerifyIcon = verifyConf.icon;
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.fullName}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{roleLabels[user.role]}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConf.variant}>{statusConf.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <VerifyIcon className={`h-4 w-4 ${verifyConf.color}`} />
                        <span className="text-sm">{verifyConf.label}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch checked={user.partnerAccess} disabled />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(user.lastActive), "MMM d, HH:mm")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedUser(user); setIsEditOpen(true); }}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Activity
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Activation Link
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Ban className="h-4 w-4 mr-2" />
                            Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit User Profile</DialogTitle>
            <DialogDescription>
              {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <Tabs defaultValue="profile" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="access">Access</TabsTrigger>
                <TabsTrigger value="verification">Verification</TabsTrigger>
              </TabsList>
              <TabsContent value="profile" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input defaultValue={selectedUser.fullName} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <Input defaultValue={selectedUser.department} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select defaultValue={selectedUser.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              <TabsContent value="access" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <Select defaultValue={selectedUser.role}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="department_manager">Department Manager</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">Strategic Partner Access</p>
                    <p className="text-sm text-muted-foreground">Allow visibility of sponsored content</p>
                  </div>
                  <Switch defaultChecked={selectedUser.partnerAccess} />
                </div>
              </TabsContent>
              <TabsContent value="verification" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Verification Status</label>
                  <Select defaultValue={selectedUser.verificationStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="self-reported">Self-Reported</SelectItem>
                      <SelectItem value="pending">Pending Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    User joined: {format(new Date(selectedUser.createdAt), "MMMM d, yyyy")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Last active: {format(new Date(selectedUser.lastActive), "MMMM d, yyyy 'at' HH:mm")}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsEditOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

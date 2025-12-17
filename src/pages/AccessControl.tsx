import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, Users, Lock, Unlock, Key, UserCheck, Settings, 
  Plus, Edit, Search, Globe, Eye, EyeOff, CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

// Mock feed access rules
const mockFeedAccessRules = [
  { id: "1", feedName: "Official Announcements", accessType: "public", roles: ["all"], departments: ["all"], enabled: true },
  { id: "2", feedName: "Internal Updates", accessType: "internal", roles: ["staff", "department_manager", "admin"], departments: ["all"], enabled: true },
  { id: "3", feedName: "Department News", accessType: "department", roles: ["staff", "department_manager"], departments: ["specific"], enabled: true },
  { id: "4", feedName: "Executive Briefings", accessType: "restricted", roles: ["admin", "department_manager"], departments: ["executive"], enabled: true },
  { id: "5", feedName: "Federated Posts", accessType: "federated", roles: ["staff"], departments: ["all"], enabled: true },
  { id: "6", feedName: "Sponsor Resources", accessType: "opted-in", roles: ["staff"], departments: ["all"], enabled: true },
];

// Mock post permissions
const mockPostPermissions = [
  { id: "1", contentType: "Official Announcement", canCreate: ["admin", "verified_agency"], canEdit: ["admin"], canDelete: ["admin"], requiresApproval: false },
  { id: "2", contentType: "Department Update", canCreate: ["department_manager", "admin"], canEdit: ["department_manager", "admin"], canDelete: ["admin"], requiresApproval: true },
  { id: "3", contentType: "Internal Memo", canCreate: ["staff", "department_manager", "admin"], canEdit: ["author", "admin"], canDelete: ["admin"], requiresApproval: true },
  { id: "4", contentType: "Federated Post", canCreate: ["verified_agency"], canEdit: ["admin"], canDelete: ["admin"], requiresApproval: true },
  { id: "5", contentType: "Sponsor Content", canCreate: ["sponsor"], canEdit: ["admin"], canDelete: ["admin"], requiresApproval: true },
  { id: "6", contentType: "Emergency Alert", canCreate: ["admin", "emergency_services"], canEdit: ["admin"], canDelete: ["admin"], requiresApproval: false },
];

// Mock role assignments
const mockRoleAssignments = [
  { id: "1", user: "John Doe", email: "john.doe@city.gov", role: "admin", department: "IT", feeds: ["all"], postTypes: ["all"], assignedAt: "2023-06-01T00:00:00Z" },
  { id: "2", user: "Jane Smith", email: "jane.smith@city.gov", role: "department_manager", department: "Finance", feeds: ["internal", "department"], postTypes: ["department_update", "internal_memo"], assignedAt: "2023-07-15T00:00:00Z" },
  { id: "3", user: "Mike Johnson", email: "mike.johnson@city.gov", role: "staff", department: "Public Works", feeds: ["internal", "department"], postTypes: ["internal_memo"], assignedAt: "2023-08-01T00:00:00Z" },
  { id: "4", user: "Sarah Wilson", email: "sarah.wilson@city.gov", role: "department_manager", department: "HR", feeds: ["internal", "department"], postTypes: ["department_update", "internal_memo"], assignedAt: "2023-09-10T00:00:00Z" },
  { id: "5", user: "TechCo Partners", email: "contact@techco.com", role: "sponsor", department: "External", feeds: ["sponsor"], postTypes: ["sponsor_content"], assignedAt: "2024-01-05T00:00:00Z" },
  { id: "6", user: "City Police Dept", email: "dispatch@police.city.gov", role: "verified_agency", department: "Police", feeds: ["all"], postTypes: ["official", "emergency"], assignedAt: "2023-06-15T00:00:00Z" },
];

const accessTypeColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  public: "default",
  internal: "secondary",
  department: "outline",
  restricted: "destructive",
  federated: "secondary",
  "opted-in": "outline",
};

const roleColors: Record<string, string> = {
  admin: "bg-destructive text-destructive-foreground",
  department_manager: "bg-primary text-primary-foreground",
  staff: "bg-secondary text-secondary-foreground",
  sponsor: "bg-warning text-warning-foreground",
  verified_agency: "bg-success text-success-foreground",
};

export default function AccessControl() {
  const [activeTab, setActiveTab] = useState("feeds");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAssignRoleOpen, setIsAssignRoleOpen] = useState(false);

  const filteredAssignments = mockRoleAssignments.filter(assignment =>
    assignment.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalUsers: mockRoleAssignments.length,
    admins: mockRoleAssignments.filter(r => r.role === "admin").length,
    managers: mockRoleAssignments.filter(r => r.role === "department_manager").length,
    verifiedAgencies: mockRoleAssignments.filter(r => r.role === "verified_agency").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Access Control</h1>
          <p className="text-muted-foreground">Manage feed access, post permissions, and role assignments</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Users</span>
            </div>
            <div className="text-2xl font-bold mt-1">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-destructive" />
              <span className="text-sm text-muted-foreground">Admins</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-destructive">{stats.admins}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Managers</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-primary">{stats.managers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-success" />
              <span className="text-sm text-muted-foreground">Verified Agencies</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-success">{stats.verifiedAgencies}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="feeds" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Feed Access
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Post Permissions
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Role Assignments
          </TabsTrigger>
        </TabsList>

        {/* Feed Access Tab */}
        <TabsContent value="feeds">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Feed Access Rules</CardTitle>
                <CardDescription>Control which roles can access different feeds</CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feed Name</TableHead>
                    <TableHead>Access Type</TableHead>
                    <TableHead>Allowed Roles</TableHead>
                    <TableHead>Departments</TableHead>
                    <TableHead>Enabled</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockFeedAccessRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {rule.accessType === "public" ? (
                            <Globe className="h-4 w-4 text-muted-foreground" />
                          ) : rule.accessType === "restricted" ? (
                            <Lock className="h-4 w-4 text-destructive" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                          {rule.feedName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={accessTypeColors[rule.accessType]}>{rule.accessType}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {rule.roles.map((role) => (
                            <Badge key={role} variant="outline" className="text-xs">{role}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{rule.departments[0]}</TableCell>
                      <TableCell>
                        <Switch checked={rule.enabled} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Post Permissions Tab */}
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Post Type Permissions</CardTitle>
              <CardDescription>Define which roles can create, edit, and delete different content types</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Content Type</TableHead>
                    <TableHead>Can Create</TableHead>
                    <TableHead>Can Edit</TableHead>
                    <TableHead>Can Delete</TableHead>
                    <TableHead>Requires Approval</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPostPermissions.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell className="font-medium">{permission.contentType}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {permission.canCreate.map((role) => (
                            <Badge key={role} variant="outline" className="text-xs">{role}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {permission.canEdit.map((role) => (
                            <Badge key={role} variant="outline" className="text-xs">{role}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {permission.canDelete.map((role) => (
                            <Badge key={role} variant="outline" className="text-xs">{role}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {permission.requiresApproval ? (
                          <CheckCircle className="h-4 w-4 text-warning" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Role Assignments Tab */}
        <TabsContent value="roles">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>User Role Assignments</CardTitle>
                <CardDescription>Assign roles and permissions to users</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-[200px]"
                  />
                </div>
                <Dialog open={isAssignRoleOpen} onOpenChange={setIsAssignRoleOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Assign Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Assign Role to User</DialogTitle>
                      <DialogDescription>Configure user access to feeds and content types</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>User Email</Label>
                        <Input placeholder="user@city.gov" />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrator</SelectItem>
                            <SelectItem value="department_manager">Department Manager</SelectItem>
                            <SelectItem value="staff">Staff</SelectItem>
                            <SelectItem value="sponsor">Sponsor (Class B)</SelectItem>
                            <SelectItem value="verified_agency">Verified Agency (Class A.3)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Department</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="it">IT</SelectItem>
                            <SelectItem value="hr">HR</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="public-works">Public Works</SelectItem>
                            <SelectItem value="police">Police</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAssignRoleOpen(false)}>Cancel</Button>
                      <Button onClick={() => { toast.success("Role assigned successfully"); setIsAssignRoleOpen(false); }}>Assign Role</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Feed Access</TableHead>
                    <TableHead>Post Types</TableHead>
                    <TableHead>Assigned</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{assignment.user}</p>
                          <p className="text-sm text-muted-foreground">{assignment.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={roleColors[assignment.role]}>
                          {assignment.role.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>{assignment.department}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {assignment.feeds.slice(0, 2).map((feed) => (
                            <Badge key={feed} variant="outline" className="text-xs">{feed}</Badge>
                          ))}
                          {assignment.feeds.length > 2 && (
                            <Badge variant="outline" className="text-xs">+{assignment.feeds.length - 2}</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {assignment.postTypes.slice(0, 2).map((type) => (
                            <Badge key={type} variant="secondary" className="text-xs">{type}</Badge>
                          ))}
                          {assignment.postTypes.length > 2 && (
                            <Badge variant="secondary" className="text-xs">+{assignment.postTypes.length - 2}</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(assignment.assignedAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

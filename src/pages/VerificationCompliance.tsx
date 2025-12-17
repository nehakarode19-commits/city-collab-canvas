import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, CheckCircle, XCircle, Clock, AlertTriangle, Search, 
  FileCheck, UserCheck, Building2, Eye, ThumbsUp, ThumbsDown, History
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

// Mock user verification data
const mockUserVerifications = [
  { id: "1", name: "John Doe", email: "john.doe@city.gov", department: "IT", verificationStatus: "verified", verifiedBy: "System", verifiedAt: "2024-01-10T10:00:00Z", method: "domain", tags: ["staff", "it-admin"] },
  { id: "2", name: "Jane Smith", email: "jane.smith@city.gov", department: "Finance", verificationStatus: "verified", verifiedBy: "Admin User", verifiedAt: "2024-01-08T14:00:00Z", method: "manual", tags: ["manager", "budget-access"] },
  { id: "3", name: "Bob Wilson", email: "bob.wilson@gmail.com", department: "HR", verificationStatus: "self-reported", verifiedBy: null, verifiedAt: null, method: "self", tags: ["contractor"] },
  { id: "4", name: "Alice Johnson", email: "alice.j@city.gov", department: "Public Works", verificationStatus: "pending", verifiedBy: null, verifiedAt: null, method: "pending", tags: [] },
  { id: "5", name: "Mike Brown", email: "mike.brown@police.city.gov", department: "Police", verificationStatus: "verified", verifiedBy: "System", verifiedAt: "2024-01-05T09:00:00Z", method: "domain", tags: ["emergency", "first-responder"] },
  { id: "6", name: "Sarah Davis", email: "sarah.d@parks.city.gov", department: "Parks", verificationStatus: "self-reported", verifiedBy: null, verifiedAt: null, method: "self", tags: ["events"] },
];

// Mock agency verifications
const mockAgencyVerifications = [
  { id: "1", name: "City Police Department", domain: "police.city.gov", status: "verified", verifiedAt: "2023-06-01T00:00:00Z", contactEmail: "admin@police.city.gov", employeeCount: 450, lastAudit: "2024-01-01T00:00:00Z" },
  { id: "2", name: "Fire Department", domain: "fire.city.gov", status: "verified", verifiedAt: "2023-06-15T00:00:00Z", contactEmail: "chief@fire.city.gov", employeeCount: 280, lastAudit: "2024-01-05T00:00:00Z" },
  { id: "3", name: "Public Works", domain: "pw.city.gov", status: "verified", verifiedAt: "2023-07-01T00:00:00Z", contactEmail: "director@pw.city.gov", employeeCount: 520, lastAudit: "2023-12-15T00:00:00Z" },
  { id: "4", name: "Transportation Authority", domain: "transit.city.gov", status: "pending", verifiedAt: null, contactEmail: "info@transit.city.gov", employeeCount: 180, lastAudit: null },
  { id: "5", name: "Parks & Recreation", domain: "parks.city.gov", status: "verified", verifiedAt: "2023-08-01T00:00:00Z", contactEmail: "parks@city.gov", employeeCount: 150, lastAudit: "2023-11-20T00:00:00Z" },
  { id: "6", name: "Water Authority", domain: "water.city.gov", status: "expired", verifiedAt: "2022-06-01T00:00:00Z", contactEmail: "water@city.gov", employeeCount: 95, lastAudit: "2022-12-01T00:00:00Z" },
];

// Mock system tags
const mockSystemTags = [
  { id: "1", name: "staff", description: "Regular staff member", userCount: 245, isSystem: true, requiresVerification: false },
  { id: "2", name: "manager", description: "Department manager", userCount: 32, isSystem: true, requiresVerification: true },
  { id: "3", name: "admin", description: "System administrator", userCount: 5, isSystem: true, requiresVerification: true },
  { id: "4", name: "contractor", description: "External contractor", userCount: 18, isSystem: true, requiresVerification: false },
  { id: "5", name: "first-responder", description: "Emergency first responder", userCount: 89, isSystem: true, requiresVerification: true },
  { id: "6", name: "budget-access", description: "Has budget system access", userCount: 24, isSystem: false, requiresVerification: true },
];

const verificationStatusConfig = {
  verified: { label: "Verified", variant: "default" as const, icon: CheckCircle, color: "text-success" },
  "self-reported": { label: "Self-Reported", variant: "secondary" as const, icon: AlertTriangle, color: "text-warning" },
  pending: { label: "Pending", variant: "outline" as const, icon: Clock, color: "text-muted-foreground" },
  expired: { label: "Expired", variant: "destructive" as const, icon: XCircle, color: "text-destructive" },
};

export default function VerificationCompliance() {
  const [activeTab, setActiveTab] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<typeof mockUserVerifications[0] | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const filteredUsers = mockUserVerifications.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.verificationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalUsers: mockUserVerifications.length,
    verified: mockUserVerifications.filter(u => u.verificationStatus === "verified").length,
    selfReported: mockUserVerifications.filter(u => u.verificationStatus === "self-reported").length,
    pending: mockUserVerifications.filter(u => u.verificationStatus === "pending").length,
  };

  const handleApproveVerification = (userId: string) => {
    toast.success("User verification approved");
    setIsReviewOpen(false);
  };

  const handleRejectVerification = (userId: string) => {
    toast.info("User verification rejected");
    setIsReviewOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Verification & Compliance</h1>
          <p className="text-muted-foreground">Manage user and agency verification status</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Users</span>
            </div>
            <div className="text-2xl font-bold mt-1">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm text-muted-foreground">Verified</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-success">{stats.verified}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <span className="text-sm text-muted-foreground">Self-Reported</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-warning">{stats.selfReported}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Pending Review</span>
            </div>
            <div className="text-2xl font-bold mt-1">{stats.pending}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            User Verification
          </TabsTrigger>
          <TabsTrigger value="agencies" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Agency Verification
          </TabsTrigger>
          <TabsTrigger value="tags" className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            System Tags
          </TabsTrigger>
        </TabsList>

        {/* User Verification Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>User Verification Status</CardTitle>
                <CardDescription>Review and approve user verification requests</CardDescription>
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="self-reported">Self-Reported</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const statusConf = verificationStatusConfig[user.verificationStatus as keyof typeof verificationStatusConfig];
                    const StatusIcon = statusConf.icon;
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>
                          <Badge variant={statusConf.variant} className="flex items-center gap-1 w-fit">
                            <StatusIcon className={`h-3 w-3 ${statusConf.color}`} />
                            {statusConf.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.method}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                            ))}
                            {user.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs">+{user.tags.length - 2}</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {user.verifiedAt ? format(new Date(user.verifiedAt), "MMM d, yyyy") : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => { setSelectedUser(user); setIsReviewOpen(true); }}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {(user.verificationStatus === "pending" || user.verificationStatus === "self-reported") && (
                              <>
                                <Button variant="ghost" size="sm" onClick={() => handleApproveVerification(user.id)}>
                                  <ThumbsUp className="h-4 w-4 text-success" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleRejectVerification(user.id)}>
                                  <ThumbsDown className="h-4 w-4 text-destructive" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Agency Verification Tab */}
        <TabsContent value="agencies">
          <Card>
            <CardHeader>
              <CardTitle>Agency Verification</CardTitle>
              <CardDescription>Manage verified government agencies (Class A.3)</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agency Name</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Last Audit</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAgencyVerifications.map((agency) => {
                    const statusConf = verificationStatusConfig[agency.status as keyof typeof verificationStatusConfig];
                    const StatusIcon = statusConf.icon;
                    return (
                      <TableRow key={agency.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {agency.name}
                            {agency.status === "verified" && <Shield className="h-4 w-4 text-primary" />}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{agency.domain}</TableCell>
                        <TableCell>
                          <Badge variant={statusConf.variant} className="flex items-center gap-1 w-fit">
                            <StatusIcon className={`h-3 w-3 ${statusConf.color}`} />
                            {statusConf.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{agency.employeeCount}</TableCell>
                        <TableCell className="text-sm">{agency.contactEmail}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {agency.lastAudit ? format(new Date(agency.lastAudit), "MMM d, yyyy") : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm">
                              <History className="h-4 w-4" />
                            </Button>
                            {agency.status === "pending" && (
                              <Button variant="ghost" size="sm">
                                <CheckCircle className="h-4 w-4 text-success" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tags Tab */}
        <TabsContent value="tags">
          <Card>
            <CardHeader>
              <CardTitle>System Tags</CardTitle>
              <CardDescription>Manage verification tags and their requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tag Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>User Count</TableHead>
                    <TableHead>System Tag</TableHead>
                    <TableHead>Requires Verification</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSystemTags.map((tag) => (
                    <TableRow key={tag.id}>
                      <TableCell className="font-medium">
                        <Badge variant="outline">{tag.name}</Badge>
                      </TableCell>
                      <TableCell>{tag.description}</TableCell>
                      <TableCell>{tag.userCount}</TableCell>
                      <TableCell>
                        {tag.isSystem ? (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch checked={tag.requiresVerification} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Verification</DialogTitle>
            <DialogDescription>{selectedUser?.email}</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{selectedUser.department}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Current Status</p>
                  <Badge variant={verificationStatusConfig[selectedUser.verificationStatus as keyof typeof verificationStatusConfig].variant}>
                    {verificationStatusConfig[selectedUser.verificationStatus as keyof typeof verificationStatusConfig].label}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Verification Method</p>
                  <Badge variant="outline">{selectedUser.method}</Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Assigned Tags</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedUser.tags.length > 0 ? (
                    selectedUser.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No tags assigned</span>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsReviewOpen(false)}>Close</Button>
            {selectedUser && (selectedUser.verificationStatus === "pending" || selectedUser.verificationStatus === "self-reported") && (
              <>
                <Button variant="destructive" onClick={() => handleRejectVerification(selectedUser.id)}>
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button onClick={() => handleApproveVerification(selectedUser.id)}>
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

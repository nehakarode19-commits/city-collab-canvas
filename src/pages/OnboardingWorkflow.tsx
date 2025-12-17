import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, Plus, Edit, CheckCircle, XCircle, Globe, Mail, 
  Send, Link2, Shield, Clock, UserPlus, AlertTriangle, Eye 
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { RosterUploadPreview } from "@/components/admin/RosterUploadPreview";

type PlanType = "freemium" | "basic" | "professional" | "enterprise";

interface Organization {
  id: string;
  name: string;
  domain: string | null;
  domain_verified: boolean;
  plan_type: PlanType;
  external_collab_enabled: boolean;
  admin_email: string | null;
  verified_at: string | null;
  created_at: string;
}

interface PendingUser {
  id: string;
  email: string;
  fullName: string;
  department: string;
  inviteSent: boolean;
  inviteSentAt?: string;
  status: "pending" | "activated" | "expired";
  isRetiree: boolean;
  personalEmail?: string;
  domainVerified: boolean;
}

const planColors: Record<PlanType, "default" | "secondary" | "destructive" | "outline"> = {
  freemium: "outline",
  basic: "secondary",
  professional: "default",
  enterprise: "destructive",
};

const mockPendingUsers: PendingUser[] = [
  { id: "1", email: "john.doe@city.gov", fullName: "John Doe", department: "IT", inviteSent: true, inviteSentAt: "2024-01-14T10:00:00Z", status: "pending", isRetiree: false, domainVerified: true },
  { id: "2", email: "jane.smith@city.gov", fullName: "Jane Smith", department: "Finance", inviteSent: false, status: "pending", isRetiree: false, domainVerified: true },
  { id: "3", email: "bob.retiree@gmail.com", fullName: "Bob Wilson", department: "Former - Parks", inviteSent: true, inviteSentAt: "2024-01-10T14:00:00Z", status: "activated", isRetiree: true, personalEmail: "bob.retiree@gmail.com", domainVerified: false },
  { id: "4", email: "alice.new@city.gov", fullName: "Alice Johnson", department: "HR", inviteSent: true, inviteSentAt: "2024-01-05T09:00:00Z", status: "expired", isRetiree: false, domainVerified: true },
  { id: "5", email: "mike.pending@city.gov", fullName: "Mike Brown", department: "Public Works", inviteSent: false, status: "pending", isRetiree: false, domainVerified: true },
];

const statusConfig = {
  pending: { label: "Pending", variant: "outline" as const, icon: Clock, color: "text-muted-foreground" },
  activated: { label: "Activated", variant: "default" as const, icon: CheckCircle, color: "text-success" },
  expired: { label: "Expired", variant: "destructive" as const, icon: XCircle, color: "text-destructive" },
};

export default function OnboardingWorkflow() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    admin_email: "",
    plan_type: "freemium" as PlanType,
  });
  const [pendingUsers] = useState<PendingUser[]>(mockPendingUsers);
  const [showUploadPreview, setShowUploadPreview] = useState(false);

  const queryClient = useQueryClient();

  const { data: organizations, isLoading } = useQuery({
    queryKey: ["organizations-registry"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizations_registry")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Organization[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("organizations_registry").insert({
        name: data.name,
        domain: data.domain || null,
        admin_email: data.admin_email || null,
        plan_type: data.plan_type,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations-registry"] });
      toast.success("Organization registered");
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error) => toast.error("Failed to register: " + error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Organization> }) => {
      const { error } = await supabase
        .from("organizations_registry")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations-registry"] });
      toast.success("Organization updated");
      setEditingOrg(null);
      resetForm();
    },
    onError: () => toast.error("Failed to update"),
  });

  const verifyDomainMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("organizations_registry")
        .update({ domain_verified: true, verified_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations-registry"] });
      toast.success("Domain verified");
    },
    onError: () => toast.error("Failed to verify domain"),
  });

  const toggleCollabMutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      const { error } = await supabase
        .from("organizations_registry")
        .update({ external_collab_enabled: enabled })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations-registry"] });
      toast.success("Collaboration access updated");
    },
    onError: () => toast.error("Failed to update"),
  });

  const resetForm = () => {
    setFormData({
      name: "",
      domain: "",
      admin_email: "",
      plan_type: "freemium",
    });
  };

  const handleEdit = (org: Organization) => {
    setEditingOrg(org);
    setFormData({
      name: org.name,
      domain: org.domain || "",
      admin_email: org.admin_email || "",
      plan_type: org.plan_type,
    });
  };

  const handleSubmit = () => {
    if (editingOrg) {
      updateMutation.mutate({ id: editingOrg.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleSendMagicLink = (user: PendingUser) => {
    toast.success(`Magic link sent to ${user.email}`);
  };

  const handleResendInvite = (user: PendingUser) => {
    toast.success(`Invite resent to ${user.email}`);
  };

  const stats = {
    total: organizations?.length || 0,
    verified: organizations?.filter((o) => o.domain_verified).length || 0,
    paid: organizations?.filter((o) => o.plan_type !== "freemium").length || 0,
    collab: organizations?.filter((o) => o.external_collab_enabled).length || 0,
    pendingActivation: pendingUsers.filter(u => u.status === "pending").length,
    retirees: pendingUsers.filter(u => u.isRetiree).length,
  };

  // Mock preview data for roster upload
  const mockPreviewData = [
    { email: "new.user@city.gov", fullName: "New User", department: "IT", role: "staff", status: "new" as const },
    { email: "existing@city.gov", fullName: "Existing User", department: "HR", role: "staff", status: "update" as const, changes: [{ field: "Department", from: "Finance", to: "HR" }] },
    { email: "missing@city.gov", fullName: "Missing User", department: "Parks", role: "staff", status: "deactivate" as const },
    { email: "invalid-email", fullName: "", department: "", role: "", status: "error" as const, errorMessage: "Invalid email format" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Onboarding Workflow</h1>
          <p className="text-muted-foreground">Manage organization registration, user activation, and verification</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Organizations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">{stats.verified}</div>
            <p className="text-sm text-muted-foreground">Verified Domains</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">{stats.paid}</div>
            <p className="text-sm text-muted-foreground">Paid Plans</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">{stats.collab}</div>
            <p className="text-sm text-muted-foreground">External Collab</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-info">{stats.pendingActivation}</div>
            <p className="text-sm text-muted-foreground">Pending Activation</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-muted-foreground">{stats.retirees}</div>
            <p className="text-sm text-muted-foreground">Retirees</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="organizations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="organizations" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Organizations
          </TabsTrigger>
          <TabsTrigger value="activation" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            User Activation
          </TabsTrigger>
          <TabsTrigger value="verification" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Verification
          </TabsTrigger>
        </TabsList>

        {/* Organizations Tab */}
        <TabsContent value="organizations">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Registered Organizations</CardTitle>
                <CardDescription>Manage organization access and verification</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowUploadPreview(true)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Upload
                </Button>
                <Dialog
                  open={isCreateOpen || !!editingOrg}
                  onOpenChange={(open) => {
                    if (!open) {
                      setIsCreateOpen(false);
                      setEditingOrg(null);
                      resetForm();
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button onClick={() => setIsCreateOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Register Organization
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingOrg ? "Edit Organization" : "Register Organization"}</DialogTitle>
                      <DialogDescription>
                        Add organization details and configure access
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Organization Name</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="City of Springfield"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Domain</Label>
                        <Input
                          value={formData.domain}
                          onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                          placeholder="springfield.gov"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Admin Email</Label>
                        <Input
                          type="email"
                          value={formData.admin_email}
                          onChange={(e) => setFormData({ ...formData, admin_email: e.target.value })}
                          placeholder="admin@springfield.gov"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Plan Type</Label>
                        <Select
                          value={formData.plan_type}
                          onValueChange={(value) => setFormData({ ...formData, plan_type: value as PlanType })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="freemium">Freemium (Internal Only)</SelectItem>
                            <SelectItem value="basic">Basic</SelectItem>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="enterprise">Enterprise</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => { setIsCreateOpen(false); setEditingOrg(null); resetForm(); }}>
                        Cancel
                      </Button>
                      <Button onClick={handleSubmit} disabled={!formData.name}>
                        {editingOrg ? "Save Changes" : "Register"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : !organizations?.length ? (
                <div className="text-center py-8 text-muted-foreground">No organizations registered</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Organization</TableHead>
                      <TableHead>Domain</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Verified</TableHead>
                      <TableHead>External Collab</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organizations.map((org) => (
                      <TableRow key={org.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{org.name}</p>
                            {org.admin_email && (
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {org.admin_email}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {org.domain ? (
                            <span className="flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              {org.domain}
                            </span>
                          ) : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={planColors[org.plan_type]}>{org.plan_type}</Badge>
                        </TableCell>
                        <TableCell>
                          {org.domain_verified ? (
                            <CheckCircle className="h-4 w-4 text-success" />
                          ) : (
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={org.external_collab_enabled}
                            onCheckedChange={(checked) =>
                              toggleCollabMutation.mutate({ id: org.id, enabled: checked })
                            }
                            disabled={org.plan_type === "freemium"}
                          />
                        </TableCell>
                        <TableCell>{format(new Date(org.created_at), "MMM d, yyyy")}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(org)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            {!org.domain_verified && org.domain && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => verifyDomainMutation.mutate(org.id)}
                              >
                                <CheckCircle className="h-4 w-4 text-success" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Activation Tab */}
        <TabsContent value="activation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                Magic Link Activation
              </CardTitle>
              <CardDescription>Send activation links to pending users</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Domain Status</TableHead>
                    <TableHead>Invite Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingUsers.map((user) => {
                    const statusConf = statusConfig[user.status];
                    const StatusIcon = statusConf.icon;
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.fullName}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            {user.personalEmail && user.personalEmail !== user.email && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                Personal: {user.personalEmail}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>
                          {user.domainVerified ? (
                            <Badge variant="default" className="flex items-center gap-1 w-fit">
                              <CheckCircle className="h-3 w-3" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="flex items-center gap-1 w-fit">
                              <AlertTriangle className="h-3 w-3 text-warning" />
                              Non-.gov
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge variant={statusConf.variant} className="flex items-center gap-1 w-fit">
                              <StatusIcon className={`h-3 w-3 ${statusConf.color}`} />
                              {statusConf.label}
                            </Badge>
                            {user.inviteSentAt && (
                              <span className="text-xs text-muted-foreground">
                                Sent: {format(new Date(user.inviteSentAt), "MMM d, HH:mm")}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.isRetiree ? (
                            <Badge variant="secondary">Retiree</Badge>
                          ) : (
                            <Badge variant="outline">Active Employee</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {!user.inviteSent ? (
                              <Button size="sm" onClick={() => handleSendMagicLink(user)}>
                                <Send className="h-4 w-4 mr-1" />
                                Send Link
                              </Button>
                            ) : user.status === "expired" ? (
                              <Button size="sm" variant="outline" onClick={() => handleResendInvite(user)}>
                                <Send className="h-4 w-4 mr-1" />
                                Resend
                              </Button>
                            ) : user.status === "pending" ? (
                              <Button size="sm" variant="ghost" onClick={() => handleResendInvite(user)}>
                                <Send className="h-4 w-4 mr-1" />
                                Resend
                              </Button>
                            ) : null}
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

        {/* Verification Tab */}
        <TabsContent value="verification">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Government Domain Verification
                </CardTitle>
                <CardDescription>Verify .gov domain ownership</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Verification Process</h4>
                  <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                    <li>Admin enters their government email domain</li>
                    <li>System sends verification email to admin@[domain]</li>
                    <li>Admin clicks verification link</li>
                    <li>Domain is marked as verified</li>
                  </ol>
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Enter domain (e.g., springfield.gov)" />
                  <Button>
                    <Send className="h-4 w-4 mr-2" />
                    Verify
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Retiree Email Linking
                </CardTitle>
                <CardDescription>Link personal emails for retirees</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Retiree Onboarding</h4>
                  <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                    <li>Retiree is added via roster with personal email</li>
                    <li>Magic link sent to personal email</li>
                    <li>Retiree verifies identity via document upload</li>
                    <li>Admin approves and activates account</li>
                  </ol>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Pending Retiree Verifications</p>
                    <p className="text-sm text-muted-foreground">{stats.retirees} awaiting approval</p>
                  </div>
                  <Button variant="outline">
                    Review Queue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Upload Preview Modal */}
      <RosterUploadPreview
        isOpen={showUploadPreview}
        onClose={() => setShowUploadPreview(false)}
        previewData={mockPreviewData}
        onConfirm={() => {
          setShowUploadPreview(false);
          toast.success("Roster changes applied successfully");
        }}
        fileName="roster_january_2024.xlsx"
      />
    </div>
  );
}

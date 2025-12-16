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
import { Building2, Plus, Edit, CheckCircle, XCircle, Globe, Mail } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

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

const planColors: Record<PlanType, "default" | "secondary" | "destructive" | "outline"> = {
  freemium: "outline",
  basic: "secondary",
  professional: "default",
  enterprise: "destructive",
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

  const stats = {
    total: organizations?.length || 0,
    verified: organizations?.filter((o) => o.domain_verified).length || 0,
    paid: organizations?.filter((o) => o.plan_type !== "freemium").length || 0,
    collab: organizations?.filter((o) => o.external_collab_enabled).length || 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Onboarding Workflow</h1>
          <p className="text-muted-foreground">Manage organization registration and access levels</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Total Organizations</p>
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
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Registered Organizations</CardTitle>
            <CardDescription>Manage organization access and verification</CardDescription>
          </div>
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
    </div>
  );
}

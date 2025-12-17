import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Briefcase, Search, CheckCircle, XCircle, Eye, Shield, DollarSign } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type RetireeStatus = "pending" | "active" | "inactive" | "suspended";

interface Retiree {
  id: string;
  user_id: string;
  personal_email: string | null;
  identity_verified: boolean;
  status: RetireeStatus;
  guild_member: boolean;
  available_for_work: boolean;
  hourly_rate: number | null;
  bio: string | null;
  expertise: string[] | null;
  profiles?: { full_name: string; email: string };
}

const statusColors: Record<RetireeStatus, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  active: "default",
  inactive: "outline",
  suspended: "destructive",
};

export default function RetireeMarketplace() {
  const [statusFilter, setStatusFilter] = useState<RetireeStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRetiree, setSelectedRetiree] = useState<Retiree | null>(null);

  const queryClient = useQueryClient();

  // Mock data for demonstration
  const mockRetirees: Retiree[] = [
    { id: "1", user_id: "u1", personal_email: "john.personal@gmail.com", identity_verified: true, status: "active", guild_member: true, available_for_work: true, hourly_rate: 75, bio: "25 years experience in public administration", expertise: ["Project Management", "Budget Analysis"], profiles: { full_name: "John Anderson", email: "john.anderson@city.gov" } },
    { id: "2", user_id: "u2", personal_email: "mary.smith@yahoo.com", identity_verified: true, status: "active", guild_member: false, available_for_work: true, hourly_rate: 60, bio: "Former IT Director with expertise in systems integration", expertise: ["IT Management", "Cloud Systems"], profiles: { full_name: "Mary Smith", email: "mary.smith@city.gov" } },
    { id: "3", user_id: "u3", personal_email: null, identity_verified: false, status: "pending", guild_member: false, available_for_work: false, hourly_rate: null, bio: "Retired from Parks department", expertise: ["Landscape Design", "Event Planning"], profiles: { full_name: "Robert Johnson", email: "robert.johnson@city.gov" } },
    { id: "4", user_id: "u4", personal_email: "sandra.lee@outlook.com", identity_verified: true, status: "active", guild_member: true, available_for_work: true, hourly_rate: 85, bio: "Former City Planner with urban development expertise", expertise: ["Urban Planning", "Zoning", "Community Outreach"], profiles: { full_name: "Sandra Lee", email: "sandra.lee@city.gov" } },
    { id: "5", user_id: "u5", personal_email: "david.brown@gmail.com", identity_verified: true, status: "inactive", guild_member: false, available_for_work: false, hourly_rate: 50, bio: "30 years in public works maintenance", expertise: ["Infrastructure", "Safety Compliance"], profiles: { full_name: "David Brown", email: "david.brown@city.gov" } },
    { id: "6", user_id: "u6", personal_email: null, identity_verified: false, status: "suspended", guild_member: false, available_for_work: false, hourly_rate: null, bio: "Former Finance analyst", expertise: ["Financial Analysis", "Auditing"], profiles: { full_name: "Patricia White", email: "patricia.white@city.gov" } },
  ];

  const { data: dbRetirees, isLoading } = useQuery({
    queryKey: ["retirees", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("retirees")
        .select(`*, profiles:user_id(full_name, email)`)
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as unknown as Retiree[];
    },
  });

  const retirees = dbRetirees?.length ? dbRetirees : (statusFilter === "all" ? mockRetirees : mockRetirees.filter(r => r.status === statusFilter));

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: RetireeStatus }) => {
      const { error } = await supabase.from("retirees").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["retirees"] });
      toast.success("Retiree status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });

  const verifyIdentityMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("retirees")
        .update({ identity_verified: true })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["retirees"] });
      toast.success("Identity verified");
    },
    onError: () => toast.error("Failed to verify identity"),
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, available }: { id: string; available: boolean }) => {
      const { error } = await supabase
        .from("retirees")
        .update({ available_for_work: available })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["retirees"] });
      toast.success("Visibility updated");
    },
    onError: () => toast.error("Failed to update visibility"),
  });

  const filteredRetirees = retirees?.filter((r) =>
    r.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: retirees?.length || 0,
    active: retirees?.filter((r) => r.status === "active").length || 0,
    pending: retirees?.filter((r) => r.status === "pending").length || 0,
    verified: retirees?.filter((r) => r.identity_verified).length || 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
          <Briefcase className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Retiree Marketplace</h1>
          <p className="text-muted-foreground">Manage retiree profiles and marketplace visibility</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Total Retirees</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">{stats.active}</div>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">{stats.pending}</div>
            <p className="text-sm text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">{stats.verified}</div>
            <p className="text-sm text-muted-foreground">Verified</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Retiree Management</CardTitle>
            <CardDescription>Review and manage retiree profiles</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-8 w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as RetireeStatus | "all")}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : !filteredRetirees?.length ? (
            <div className="text-center py-8 text-muted-foreground">No retirees found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Personal Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Visible</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRetirees.map((retiree) => (
                  <TableRow key={retiree.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{retiree.profiles?.full_name}</p>
                        <p className="text-sm text-muted-foreground">{retiree.profiles?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{retiree.personal_email || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={statusColors[retiree.status]}>{retiree.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {retiree.identity_verified ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={retiree.available_for_work}
                        onCheckedChange={(checked) =>
                          toggleVisibilityMutation.mutate({ id: retiree.id, available: checked })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {retiree.hourly_rate ? `$${retiree.hourly_rate}/hr` : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedRetiree(retiree)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!retiree.identity_verified && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => verifyIdentityMutation.mutate(retiree.id)}
                          >
                            <Shield className="h-4 w-4 text-primary" />
                          </Button>
                        )}
                        {retiree.status === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                updateStatusMutation.mutate({ id: retiree.id, status: "active" })
                              }
                            >
                              <CheckCircle className="h-4 w-4 text-success" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                updateStatusMutation.mutate({ id: retiree.id, status: "suspended" })
                              }
                            >
                              <XCircle className="h-4 w-4 text-destructive" />
                            </Button>
                          </>
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

      {/* Retiree Details Dialog */}
      <Dialog open={!!selectedRetiree} onOpenChange={() => setSelectedRetiree(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedRetiree?.profiles?.full_name}</DialogTitle>
            <DialogDescription>Retiree Profile Details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Work Email</p>
                <p className="font-medium">{selectedRetiree?.profiles?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Personal Email</p>
                <p className="font-medium">{selectedRetiree?.personal_email || "Not provided"}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={statusColors[selectedRetiree?.status || "pending"]}>
                  {selectedRetiree?.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hourly Rate</p>
                <p className="font-medium flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {selectedRetiree?.hourly_rate || "Not set"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bio</p>
              <p className="text-sm">{selectedRetiree?.bio || "No bio provided"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Expertise</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedRetiree?.expertise?.length ? (
                  selectedRetiree.expertise.map((exp, i) => (
                    <Badge key={i} variant="outline">{exp}</Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No expertise listed</span>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRetiree(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

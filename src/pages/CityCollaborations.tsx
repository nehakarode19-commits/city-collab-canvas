import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Handshake, Plus, Send, Users, FolderOpen, CheckCircle, Clock, XCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

type CollaborationStatus = "pending" | "active" | "suspended" | "ended";

interface Collaboration {
  id: string;
  initiator_org_id: string;
  partner_org_id: string;
  collaboration_name: string;
  scope: string[];
  status: CollaborationStatus;
  invitation_sent_at: string | null;
  accepted_at: string | null;
  created_at: string;
  initiator_org?: { name: string };
  partner_org?: { name: string };
}

interface SharedWorkspace {
  id: string;
  collaboration_id: string;
  name: string;
  description: string | null;
  created_at: string;
  city_collaborations?: { collaboration_name: string };
}

const statusColors: Record<CollaborationStatus, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  active: "default",
  suspended: "destructive",
  ended: "outline",
};

const statusIcons: Record<CollaborationStatus, React.ReactNode> = {
  pending: <Clock className="h-3 w-3" />,
  active: <CheckCircle className="h-3 w-3" />,
  suspended: <XCircle className="h-3 w-3" />,
  ended: <XCircle className="h-3 w-3" />,
};

const scopeOptions = [
  { value: "event_planning", label: "Event Planning" },
  { value: "sop_sharing", label: "SOP Sharing" },
  { value: "resource_exchange", label: "Resource Exchange" },
  { value: "training", label: "Joint Training" },
  { value: "emergency_response", label: "Emergency Response" },
];

export default function CityCollaborations() {
  const [activeTab, setActiveTab] = useState("collaborations");
  const [isCreateCollabOpen, setIsCreateCollabOpen] = useState(false);
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);
  const [collabForm, setCollabForm] = useState({
    collaboration_name: "",
    partner_org_id: "",
    scope: [] as string[],
  });
  const [workspaceForm, setWorkspaceForm] = useState({
    collaboration_id: "",
    name: "",
    description: "",
  });

  const queryClient = useQueryClient();

  const { data: organizations } = useQuery({
    queryKey: ["organizations-registry"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizations_registry")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: collaborations, isLoading } = useQuery({
    queryKey: ["city-collaborations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("city_collaborations")
        .select(`
          *,
          initiator_org:organizations_registry!city_collaborations_initiator_org_id_fkey(name),
          partner_org:organizations_registry!city_collaborations_partner_org_id_fkey(name)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as Collaboration[];
    },
  });

  const { data: workspaces } = useQuery({
    queryKey: ["shared-workspaces"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shared_workspaces")
        .select(`*, city_collaborations(collaboration_name)`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as SharedWorkspace[];
    },
  });

  const createCollabMutation = useMutation({
    mutationFn: async (data: typeof collabForm) => {
      const { data: user } = await supabase.auth.getUser();
      const { error } = await supabase.from("city_collaborations").insert({
        collaboration_name: data.collaboration_name,
        partner_org_id: data.partner_org_id,
        scope: data.scope,
        created_by: user.user?.id,
        invitation_sent_at: new Date().toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["city-collaborations"] });
      toast.success("Collaboration invitation sent");
      setIsCreateCollabOpen(false);
      setCollabForm({ collaboration_name: "", partner_org_id: "", scope: [] });
    },
    onError: () => toast.error("Failed to create collaboration"),
  });

  const createWorkspaceMutation = useMutation({
    mutationFn: async (data: typeof workspaceForm) => {
      const { error } = await supabase.from("shared_workspaces").insert({
        collaboration_id: data.collaboration_id,
        name: data.name,
        description: data.description || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shared-workspaces"] });
      toast.success("Workspace created");
      setIsCreateWorkspaceOpen(false);
      setWorkspaceForm({ collaboration_id: "", name: "", description: "" });
    },
    onError: () => toast.error("Failed to create workspace"),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: CollaborationStatus }) => {
      const updateData: Record<string, unknown> = { status };
      if (status === "active") {
        updateData.accepted_at = new Date().toISOString();
      }
      const { error } = await supabase.from("city_collaborations").update(updateData).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["city-collaborations"] });
      toast.success("Status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });

  const toggleScope = (scope: string) => {
    setCollabForm((prev) => ({
      ...prev,
      scope: prev.scope.includes(scope)
        ? prev.scope.filter((s) => s !== scope)
        : [...prev.scope, scope],
    }));
  };

  const activeCollabs = collaborations?.filter((c) => c.status === "active") || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
          <Handshake className="h-5 w-5 text-info" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">City Collaborations</h1>
          <p className="text-muted-foreground">Manage inter-city partnerships and shared workspaces</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="collaborations" className="flex items-center gap-2">
            <Handshake className="h-4 w-4" />
            Collaborations
          </TabsTrigger>
          <TabsTrigger value="workspaces" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            Shared Workspaces
          </TabsTrigger>
        </TabsList>

        <TabsContent value="collaborations">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>City Partnerships</CardTitle>
                <CardDescription>Initiate and manage collaborations with other cities</CardDescription>
              </div>
              <Dialog open={isCreateCollabOpen} onOpenChange={setIsCreateCollabOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Send className="h-4 w-4 mr-2" />
                    Send Invitation
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Initiate Collaboration</DialogTitle>
                    <DialogDescription>Send a formal collaboration invitation to another city</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Collaboration Name</Label>
                      <Input
                        value={collabForm.collaboration_name}
                        onChange={(e) => setCollabForm({ ...collabForm, collaboration_name: e.target.value })}
                        placeholder="Regional Emergency Response Partnership"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Partner Organization</Label>
                      <Select
                        value={collabForm.partner_org_id}
                        onValueChange={(v) => setCollabForm({ ...collabForm, partner_org_id: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select organization" />
                        </SelectTrigger>
                        <SelectContent>
                          {organizations?.map((org) => (
                            <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Collaboration Scope</Label>
                      <div className="flex flex-wrap gap-2">
                        {scopeOptions.map((option) => (
                          <Badge
                            key={option.value}
                            variant={collabForm.scope.includes(option.value) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleScope(option.value)}
                          >
                            {option.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateCollabOpen(false)}>Cancel</Button>
                    <Button
                      onClick={() => createCollabMutation.mutate(collabForm)}
                      disabled={!collabForm.collaboration_name || !collabForm.partner_org_id}
                    >
                      Send Invitation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : !collaborations?.length ? (
                <div className="text-center py-8 text-muted-foreground">No collaborations yet</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Partner</TableHead>
                      <TableHead>Scope</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Invited</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {collaborations.map((collab) => (
                      <TableRow key={collab.id}>
                        <TableCell className="font-medium">{collab.collaboration_name}</TableCell>
                        <TableCell>{collab.partner_org?.name || "Unknown"}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {collab.scope.slice(0, 2).map((s) => (
                              <Badge key={s} variant="outline" className="text-xs">{s.replace("_", " ")}</Badge>
                            ))}
                            {collab.scope.length > 2 && (
                              <Badge variant="outline" className="text-xs">+{collab.scope.length - 2}</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusColors[collab.status]} className="flex items-center gap-1 w-fit">
                            {statusIcons[collab.status]}
                            {collab.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {collab.invitation_sent_at
                            ? format(new Date(collab.invitation_sent_at), "MMM d, yyyy")
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          {collab.status === "pending" && (
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateStatusMutation.mutate({ id: collab.id, status: "active" })}
                              >
                                <CheckCircle className="h-4 w-4 text-success" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateStatusMutation.mutate({ id: collab.id, status: "ended" })}
                              >
                                <XCircle className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workspaces">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Shared Workspaces</CardTitle>
                <CardDescription>Manage data sharing spaces for active collaborations</CardDescription>
              </div>
              <Dialog open={isCreateWorkspaceOpen} onOpenChange={setIsCreateWorkspaceOpen}>
                <DialogTrigger asChild>
                  <Button disabled={!activeCollabs.length}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Workspace
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Shared Workspace</DialogTitle>
                    <DialogDescription>Set up a data sharing space for a collaboration</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Collaboration</Label>
                      <Select
                        value={workspaceForm.collaboration_id}
                        onValueChange={(v) => setWorkspaceForm({ ...workspaceForm, collaboration_id: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select collaboration" />
                        </SelectTrigger>
                        <SelectContent>
                          {activeCollabs.map((c) => (
                            <SelectItem key={c.id} value={c.id}>{c.collaboration_name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Workspace Name</Label>
                      <Input
                        value={workspaceForm.name}
                        onChange={(e) => setWorkspaceForm({ ...workspaceForm, name: e.target.value })}
                        placeholder="Emergency Planning Documents"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={workspaceForm.description}
                        onChange={(e) => setWorkspaceForm({ ...workspaceForm, description: e.target.value })}
                        placeholder="Purpose and scope of this workspace..."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateWorkspaceOpen(false)}>Cancel</Button>
                    <Button
                      onClick={() => createWorkspaceMutation.mutate(workspaceForm)}
                      disabled={!workspaceForm.collaboration_id || !workspaceForm.name}
                    >
                      Create
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {!workspaces?.length ? (
                <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-2">
                  <FolderOpen className="h-8 w-8" />
                  <p>No shared workspaces yet</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Workspace</TableHead>
                      <TableHead>Collaboration</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workspaces.map((ws) => (
                      <TableRow key={ws.id}>
                        <TableCell className="font-medium">{ws.name}</TableCell>
                        <TableCell>{ws.city_collaborations?.collaboration_name}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{ws.description || "—"}</TableCell>
                        <TableCell>{format(new Date(ws.created_at), "MMM d, yyyy")}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Users className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

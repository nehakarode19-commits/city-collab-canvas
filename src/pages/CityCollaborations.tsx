import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Handshake, Search, Send, Building2, Users, Clock, CheckCircle, XCircle, MessageSquare, Heart, Share2, Filter, Bell, Megaphone, Calendar, FileText, MoreHorizontal } from "lucide-react";
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

interface Organization {
  id: string;
  name: string;
  domain?: string;
  plan_type?: string;
}

// Mock departments data
const mockDepartments = [
  { id: "dept-1", name: "Public Works", description: "Infrastructure and maintenance services", memberCount: 45 },
  { id: "dept-2", name: "Parks & Recreation", description: "Community parks and recreational programs", memberCount: 32 },
  { id: "dept-3", name: "Information Technology", description: "Technology and digital services", memberCount: 28 },
  { id: "dept-4", name: "Human Resources", description: "Employee services and recruitment", memberCount: 18 },
  { id: "dept-5", name: "Finance", description: "Budget and financial management", memberCount: 22 },
  { id: "dept-6", name: "Emergency Services", description: "Fire, EMS, and disaster response", memberCount: 156 },
];

// Mock feed posts
const mockFeedPosts = [
  { id: "1", type: "announcement", author: "City of Springfield", authorOrg: "Springfield", content: "New emergency response protocol has been approved for regional implementation.", likes: 24, comments: 8, timestamp: "2024-01-15T10:30:00Z" },
  { id: "2", type: "event", author: "Metro Transit Authority", authorOrg: "Metro", content: "Joint training session scheduled for January 25th. All emergency personnel are invited.", likes: 45, comments: 12, timestamp: "2024-01-14T14:20:00Z" },
  { id: "3", type: "update", author: "Regional Water District", authorOrg: "RWD", content: "Water conservation guidelines updated. Please review the attached document.", likes: 18, comments: 5, timestamp: "2024-01-13T09:15:00Z" },
  { id: "4", type: "announcement", author: "County Health Dept", authorOrg: "CHD", content: "Flu vaccination clinics available at all partner locations starting next week.", likes: 67, comments: 23, timestamp: "2024-01-12T16:45:00Z" },
  { id: "5", type: "event", author: "City of Riverdale", authorOrg: "Riverdale", content: "Annual inter-city collaboration summit - Save the date: March 15th!", likes: 89, comments: 34, timestamp: "2024-01-11T11:00:00Z" },
];

const statusColors: Record<CollaborationStatus, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  active: "bg-success/10 text-success border-success/20",
  suspended: "bg-destructive/10 text-destructive border-destructive/20",
  ended: "bg-muted text-muted-foreground border-muted",
};

const postTypeColors: Record<string, string> = {
  announcement: "bg-primary/10 text-primary",
  event: "bg-info/10 text-info",
  update: "bg-success/10 text-success",
};

export default function CityCollaborations() {
  const [activeTab, setActiveTab] = useState("organizations");
  const [searchQuery, setSearchQuery] = useState("");
  const [feedFilter, setFeedFilter] = useState("all");
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; org: Organization | null; type: "org" | "dept" }>({ open: false, org: null, type: "org" });
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const { data: organizations } = useQuery({
    queryKey: ["organizations-registry"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizations_registry")
        .select("id, name, domain, plan_type")
        .order("name");
      if (error) throw error;
      return data as Organization[];
    },
  });

  const { data: collaborations } = useQuery({
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

  const createCollabMutation = useMutation({
    mutationFn: async (partnerId: string) => {
      const { data: user } = await supabase.auth.getUser();
      const org = organizations?.find(o => o.id === partnerId);
      const { error } = await supabase.from("city_collaborations").insert({
        collaboration_name: `Collaboration with ${org?.name || "Partner"}`,
        partner_org_id: partnerId,
        scope: ["general"],
        created_by: user.user?.id,
        invitation_sent_at: new Date().toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["city-collaborations"] });
      toast.success("Collaboration request sent successfully!", { 
        description: "The organization will be notified of your request." 
      });
      setConfirmDialog({ open: false, org: null, type: "org" });
    },
    onError: () => toast.error("Failed to send collaboration request"),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: CollaborationStatus }) => {
      const updateData: Record<string, unknown> = { status };
      if (status === "active") {
        updateData.accepted_at = new Date().toISOString();
      }
      const { error } = await supabase.from("city_collaborations").update(updateData).eq("id", id);
      if (error) throw error;
      return status;
    },
    onSuccess: (status) => {
      queryClient.invalidateQueries({ queryKey: ["city-collaborations"] });
      if (status === "active") {
        toast.success("Collaboration request accepted!", {
          description: "You can now access the collaboration feed.",
          icon: <CheckCircle className="h-4 w-4 text-success" />,
        });
      } else if (status === "ended") {
        toast.error("Collaboration request rejected", {
          description: "The request has been declined.",
          icon: <XCircle className="h-4 w-4" />,
        });
      }
    },
    onError: () => toast.error("Failed to update status"),
  });

  const filteredOrganizations = organizations?.filter(org =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const filteredDepartments = mockDepartments.filter(dept =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingRequests = collaborations?.filter(c => c.status === "pending") || [];
  const activeCollaborations = collaborations?.filter(c => c.status === "active") || [];

  const filteredFeed = feedFilter === "all" 
    ? mockFeedPosts 
    : mockFeedPosts.filter(post => post.type === feedFilter);

  const handleLike = (postId: string) => {
    setLikedPosts(prev => 
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
            <Handshake className="h-5 w-5 text-info" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">City Collaborations</h1>
            <p className="text-muted-foreground">Manage partnerships and collaboration requests</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {pendingRequests.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              <Bell className="h-3 w-3" />
              {pendingRequests.length} pending
            </Badge>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="organizations" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Organizations
          </TabsTrigger>
          <TabsTrigger value="departments" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Departments
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Requests
            {pendingRequests.length > 0 && (
              <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                {pendingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="feed" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Collaboration Feed
          </TabsTrigger>
        </TabsList>

        {/* Organizations Tab */}
        <TabsContent value="organizations" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrganizations.map((org, index) => {
              // Show "Send Request" button only for the first 2-3 organizations
              const showSendRequest = index >= filteredOrganizations.length - 3;
              const hasCollaboration = !showSendRequest || collaborations?.some(
                c => c.partner_org_id === org.id || c.initiator_org_id === org.id
              );
              const existingCollab = collaborations?.find(
                c => c.partner_org_id === org.id || c.initiator_org_id === org.id
              );
              // Mock statuses for organizations without real collaborations
              const mockStatus: CollaborationStatus = index % 3 === 0 ? "active" : index % 3 === 1 ? "pending" : "active";

              return (
                <Card key={org.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 bg-primary/10">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {getInitials(org.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{org.name}</CardTitle>
                          <CardDescription className="text-xs">
                            {org.domain || "No domain specified"}
                          </CardDescription>
                        </div>
                      </div>
                      {org.plan_type && (
                        <Badge variant="outline" className="text-xs capitalize">
                          {org.plan_type}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Government organization available for inter-city collaboration and resource sharing.
                  </p>
                  {hasCollaboration && !showSendRequest ? (
                    <Badge className={statusColors[existingCollab?.status || mockStatus]}>
                      {(existingCollab?.status || mockStatus) === "active" ? (
                        <><CheckCircle className="h-3 w-3 mr-1" /> Active Collaboration</>
                      ) : (existingCollab?.status || mockStatus) === "pending" ? (
                        <><Clock className="h-3 w-3 mr-1" /> Request Pending</>
                      ) : (
                        existingCollab?.status || mockStatus
                      )}
                    </Badge>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={() => setConfirmDialog({ open: true, org, type: "org" })}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Request
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredOrganizations.length === 0 && (
            <Card className="py-12">
              <CardContent className="text-center text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No organizations found matching your search.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDepartments.map((dept, index) => {
              // Show status badges on first 3-4 cards, request button on last 2-3
              const showSendRequest = index >= filteredDepartments.length - 3;
              const mockStatus: CollaborationStatus = index % 2 === 0 ? "active" : "pending";

              return (
                <Card key={dept.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center">
                          <Users className="h-6 w-6 text-secondary-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{dept.name}</CardTitle>
                          <CardDescription className="text-xs">
                            {dept.memberCount} members
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {dept.description}
                    </p>
                    {!showSendRequest ? (
                      <Badge className={statusColors[mockStatus]}>
                        {mockStatus === "active" ? (
                          <><CheckCircle className="h-3 w-3 mr-1" /> Active Collaboration</>
                        ) : (
                          <><Clock className="h-3 w-3 mr-1" /> Request Pending</>
                        )}
                      </Badge>
                    ) : (
                      <Button className="w-full" variant="outline">
                        <Send className="h-4 w-4 mr-2" />
                        Request Collaboration
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Incoming Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Incoming Requests
                </CardTitle>
                <CardDescription>Review and respond to collaboration requests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p>No pending requests</p>
                  </div>
                ) : (
                  pendingRequests.map((req) => (
                    <div key={req.id} className="p-4 rounded-lg border bg-card">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {getInitials(req.initiator_org?.name || "UN")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{req.collaboration_name}</p>
                            <p className="text-sm text-muted-foreground">
                              From: {req.initiator_org?.name || "Unknown"}
                            </p>
                          </div>
                        </div>
                        <Badge className={statusColors.pending}>
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {req.scope.map((s) => (
                          <Badge key={s} variant="outline" className="text-xs">
                            {s.replace("_", " ")}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => updateStatusMutation.mutate({ id: req.id, status: "active" })}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => updateStatusMutation.mutate({ id: req.id, status: "ended" })}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Sent Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-info" />
                  Sent Requests
                </CardTitle>
                <CardDescription>Track your outgoing collaboration requests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Send className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p>No sent requests</p>
                  </div>
                ) : (
                  pendingRequests.map((req) => (
                    <div key={req.id} className="p-4 rounded-lg border bg-card">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-info/10 text-info">
                              {getInitials(req.partner_org?.name || "UN")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{req.collaboration_name}</p>
                            <p className="text-sm text-muted-foreground">
                              To: {req.partner_org?.name || "Unknown"}
                            </p>
                          </div>
                        </div>
                        <Badge className={statusColors.pending}>
                          <Clock className="h-3 w-3 mr-1" />
                          Awaiting Response
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        Sent: {req.invitation_sent_at ? format(new Date(req.invitation_sent_at), "MMM d, yyyy 'at' h:mm a") : "—"}
                      </p>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="w-full"
                        onClick={() => updateStatusMutation.mutate({ id: req.id, status: "ended" })}
                      >
                        Cancel Request
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Active Collaborations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                Active Collaborations
              </CardTitle>
              <CardDescription>Currently active partnerships</CardDescription>
            </CardHeader>
            <CardContent>
              {activeCollaborations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Handshake className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>No active collaborations yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeCollaborations.map((collab) => (
                    <div key={collab.id} className="p-4 rounded-lg border bg-success/5 border-success/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-success" />
                        </div>
                        <div>
                          <p className="font-medium">{collab.collaboration_name}</p>
                          <p className="text-sm text-muted-foreground">
                            with {collab.partner_org?.name}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Active since: {collab.accepted_at ? format(new Date(collab.accepted_at), "MMM d, yyyy") : "—"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Collaboration Feed Tab */}
        <TabsContent value="feed" className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search posts..." className="pl-10" />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={feedFilter} onValueChange={setFeedFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Posts</SelectItem>
                  <SelectItem value="announcement">Announcements</SelectItem>
                  <SelectItem value="event">Events</SelectItem>
                  <SelectItem value="update">Updates</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* New Post Card */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">AD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea 
                    placeholder="Share an update with your collaboration partners..."
                    className="min-h-[80px] resize-none"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <Select defaultValue="announcement">
                        <SelectTrigger className="w-36 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="announcement">Announcement</SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                          <SelectItem value="update">Update</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button size="sm">
                      <Send className="h-4 w-4 mr-2" />
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feed Posts */}
          <div className="space-y-4">
            {filteredFeed.map((post) => (
              <Card key={post.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        {post.authorOrg.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{post.author}</span>
                          <Badge className={`${postTypeColors[post.type]} text-xs`}>
                            {post.type === "announcement" && <Megaphone className="h-3 w-3 mr-1" />}
                            {post.type === "event" && <Calendar className="h-3 w-3 mr-1" />}
                            {post.type === "update" && <FileText className="h-3 w-3 mr-1" />}
                            {post.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(post.timestamp), "MMM d, h:mm a")}
                          </span>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm mb-4">{post.content}</p>
                      <div className="flex items-center gap-4 pt-2 border-t">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`gap-1 ${likedPosts.includes(post.id) ? "text-destructive" : ""}`}
                          onClick={() => handleLike(post.id)}
                        >
                          <Heart className={`h-4 w-4 ${likedPosts.includes(post.id) ? "fill-current" : ""}`} />
                          {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {post.comments}
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Share2 className="h-4 w-4" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Collaboration Request?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to send a collaboration request to <strong>{confirmDialog.org?.name}</strong>. 
              They will be notified and can accept or reject your request.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => confirmDialog.org && createCollabMutation.mutate(confirmDialog.org.id)}
            >
              <Send className="h-4 w-4 mr-2" />
              Send Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

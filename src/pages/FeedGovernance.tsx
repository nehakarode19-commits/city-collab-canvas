import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Megaphone, Shield, Eye, Filter, Users, FileText, Tag, 
  Plus, CheckCircle, XCircle, Clock, AlertTriangle, Globe, Lock, Building
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

// Mock data for feeds
const mockFeeds = [
  { id: "1", title: "City Hall Closure Notice", content: "City Hall will be closed on January 20th for Martin Luther King Jr. Day", status: "published", priority: "high", jurisdiction: "citywide", department: "Administration", author: "Mayor's Office", verifiedBadge: true, createdAt: "2024-01-15T10:00:00Z", publishedAt: "2024-01-15T10:30:00Z" },
  { id: "2", title: "New Parking Regulations", content: "Updated parking regulations effective February 1st", status: "pending", priority: "medium", jurisdiction: "downtown", department: "Public Works", author: "Transportation Dept", verifiedBadge: true, createdAt: "2024-01-14T14:00:00Z", publishedAt: null },
  { id: "3", title: "Emergency Weather Advisory", content: "Severe weather expected this weekend. Stay indoors.", status: "published", priority: "urgent", jurisdiction: "citywide", department: "Emergency Services", author: "Emergency Management", verifiedBadge: true, createdAt: "2024-01-13T08:00:00Z", publishedAt: "2024-01-13T08:05:00Z" },
  { id: "4", title: "Budget Meeting", content: "Annual budget review meeting scheduled for January 25th", status: "draft", priority: "low", jurisdiction: "internal", department: "Finance", author: "City Controller", verifiedBadge: false, createdAt: "2024-01-12T16:00:00Z", publishedAt: null },
  { id: "5", title: "IT System Maintenance", content: "Scheduled maintenance window on Saturday 2AM-6AM", status: "scheduled", priority: "medium", jurisdiction: "internal", department: "IT", author: "IT Department", verifiedBadge: true, createdAt: "2024-01-11T11:00:00Z", publishedAt: null },
  { id: "6", title: "Community Event: Town Hall", content: "Join us for an open town hall discussion on community safety", status: "published", priority: "medium", jurisdiction: "citywide", department: "Community Relations", author: "City Council", verifiedBadge: true, createdAt: "2024-01-10T09:00:00Z", publishedAt: "2024-01-10T09:15:00Z" },
];

// Mock data for sponsor feeds requiring approval
const mockSponsorFeeds = [
  { id: "s1", title: "Employee Wellness Program Launch", content: "Introducing our comprehensive wellness program with fitness discounts, mental health resources, and quarterly health screenings for all city employees.", sponsor: "HealthFirst Insurance", sponsorLogo: "🏥", sponsorTier: "Gold", targetAudience: "All Employees", category: "Benefits", status: "pending", submittedAt: "2024-01-16T09:00:00Z", reviewedAt: null, reviewedBy: null },
  { id: "s2", title: "Retirement Planning Workshop", content: "Free retirement planning sessions available this month. Learn about pension options, 401k strategies, and financial planning for your future.", sponsor: "SecureRetire Financial", sponsorLogo: "💼", sponsorTier: "Silver", targetAudience: "Staff 50+", category: "Financial", status: "pending", submittedAt: "2024-01-15T14:30:00Z", reviewedAt: null, reviewedBy: null },
  { id: "s3", title: "Professional Development Courses", content: "Access to 500+ online courses for skill development. Topics include leadership, project management, and technical certifications.", sponsor: "LearnPro Academy", sponsorLogo: "📚", sponsorTier: "Gold", targetAudience: "All Employees", category: "Training", status: "approved", submittedAt: "2024-01-14T11:00:00Z", reviewedAt: "2024-01-14T15:00:00Z", reviewedBy: "Admin" },
  { id: "s4", title: "Discount Program: Office Supplies", content: "Exclusive 30% discount on office supplies and equipment for all city departments. Valid through Q1 2024.", sponsor: "OfficeMax Pro", sponsorLogo: "📎", sponsorTier: "Bronze", targetAudience: "Department Heads", category: "Supplies", status: "rejected", submittedAt: "2024-01-13T10:00:00Z", reviewedAt: "2024-01-13T16:00:00Z", reviewedBy: "Admin", rejectionReason: "Content requires revision - pricing details unclear" },
  { id: "s5", title: "Mental Health Awareness Month", content: "Join us for a series of mental health workshops and access free counseling sessions throughout February.", sponsor: "MindCare Partners", sponsorLogo: "🧠", sponsorTier: "Platinum", targetAudience: "All Employees", category: "Wellness", status: "pending", submittedAt: "2024-01-16T08:00:00Z", reviewedAt: null, reviewedBy: null },
  { id: "s6", title: "Electric Vehicle Charging Stations", content: "New EV charging stations now available at City Hall parking. Special rates for city employees.", sponsor: "GreenCharge Solutions", sponsorLogo: "⚡", sponsorTier: "Gold", targetAudience: "All Employees", category: "Sustainability", status: "pending", submittedAt: "2024-01-15T16:00:00Z", reviewedAt: null, reviewedBy: null },
];

const sponsorTierColors: Record<string, string> = {
  Platinum: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
  Gold: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white",
  Silver: "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800",
  Bronze: "bg-gradient-to-r from-orange-300 to-orange-400 text-white",
};

// Mock data for verified agencies
const mockVerifiedAgencies = [
  { id: "1", name: "Mayor's Office", domain: "mayor.city.gov", verified: true, canBroadcast: true, postTypes: ["official", "emergency"], verifiedAt: "2023-06-01T00:00:00Z" },
  { id: "2", name: "City Police Department", domain: "police.city.gov", verified: true, canBroadcast: true, postTypes: ["official", "emergency", "alert"], verifiedAt: "2023-06-15T00:00:00Z" },
  { id: "3", name: "Fire Department", domain: "fire.city.gov", verified: true, canBroadcast: true, postTypes: ["emergency", "alert"], verifiedAt: "2023-07-01T00:00:00Z" },
  { id: "4", name: "Public Works", domain: "pw.city.gov", verified: true, canBroadcast: false, postTypes: ["official"], verifiedAt: "2023-07-15T00:00:00Z" },
  { id: "5", name: "Parks & Recreation", domain: "parks.city.gov", verified: true, canBroadcast: false, postTypes: ["official", "event"], verifiedAt: "2023-08-01T00:00:00Z" },
  { id: "6", name: "Transportation Authority", domain: "transit.city.gov", verified: false, canBroadcast: false, postTypes: [], verifiedAt: null },
];

// Mock visibility rules
const mockVisibilityRules = [
  { id: "1", name: "Official Feeds", postType: "official", visibleTo: ["all_users"], departments: ["all"], requiresVerification: true, enabled: true },
  { id: "2", name: "Emergency Alerts", postType: "emergency", visibleTo: ["all_users"], departments: ["all"], requiresVerification: true, enabled: true },
  { id: "3", name: "Internal Memos", postType: "internal", visibleTo: ["staff"], departments: ["specific"], requiresVerification: false, enabled: true },
  { id: "4", name: "Department Updates", postType: "department", visibleTo: ["department_members"], departments: ["specific"], requiresVerification: false, enabled: true },
  { id: "5", name: "Sponsor Content", postType: "sponsor", visibleTo: ["opted_in"], departments: ["all"], requiresVerification: true, enabled: true },
];

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  published: "default",
  pending: "secondary",
  draft: "outline",
  scheduled: "secondary",
  rejected: "destructive",
};

const priorityColors: Record<string, string> = {
  urgent: "bg-destructive text-destructive-foreground",
  high: "bg-warning text-warning-foreground",
  medium: "bg-primary text-primary-foreground",
  low: "bg-muted text-muted-foreground",
};

export default function FeedGovernance() {
  const [activeTab, setActiveTab] = useState("feeds");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [feedForm, setFeedForm] = useState({
    title: "",
    content: "",
    priority: "medium",
    jurisdiction: "citywide",
    department: "",
  });
  const [selectedSponsorFeed, setSelectedSponsorFeed] = useState<typeof mockSponsorFeeds[0] | null>(null);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handlePublish = (id: string) => {
    toast.success("Feed published successfully");
  };

  const handleReject = (id: string) => {
    toast.info("Feed rejected");
  };

  const handleSponsorApprove = (feed: typeof mockSponsorFeeds[0]) => {
    toast.success(`Sponsor feed "${feed.title}" approved and published`);
    setSelectedSponsorFeed(null);
    setIsPreviewOpen(false);
  };

  const handleSponsorReject = () => {
    if (!selectedSponsorFeed) return;
    toast.error(`Sponsor feed "${selectedSponsorFeed.title}" rejected`);
    setIsRejectDialogOpen(false);
    setRejectionReason("");
    setSelectedSponsorFeed(null);
  };

  const openRejectDialog = (feed: typeof mockSponsorFeeds[0]) => {
    setSelectedSponsorFeed(feed);
    setIsRejectDialogOpen(true);
  };

  const openPreview = (feed: typeof mockSponsorFeeds[0]) => {
    setSelectedSponsorFeed(feed);
    setIsPreviewOpen(true);
  };

  const sponsorStats = {
    pending: mockSponsorFeeds.filter(f => f.status === "pending").length,
    approved: mockSponsorFeeds.filter(f => f.status === "approved").length,
    rejected: mockSponsorFeeds.filter(f => f.status === "rejected").length,
  };

  const stats = {
    total: mockFeeds.length,
    published: mockFeeds.filter(a => a.status === "published").length,
    pending: mockFeeds.filter(a => a.status === "pending").length,
    agencies: mockVerifiedAgencies.filter(a => a.verified).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Megaphone className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Feed Governance</h1>
          <p className="text-muted-foreground">Manage feeds, visibility rules, and verified agencies</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Posts</span>
            </div>
            <div className="text-2xl font-bold mt-1">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm text-muted-foreground">Published</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-success">{stats.published}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-warning" />
              <span className="text-sm text-muted-foreground">Pending Review</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-warning">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Verified Agencies</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-primary">{stats.agencies}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="feeds" className="flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
            Feeds
          </TabsTrigger>
          <TabsTrigger value="sponsor-approval" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Sponsor Approval
            {sponsorStats.pending > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {sponsorStats.pending}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="agencies" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Verified Agencies
          </TabsTrigger>
          <TabsTrigger value="visibility" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Visibility Rules
          </TabsTrigger>
          <TabsTrigger value="filters" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Content Filters
          </TabsTrigger>
        </TabsList>

        {/* Feeds Tab */}
        <TabsContent value="feeds">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Official Feeds</CardTitle>
                <CardDescription>Create and manage official broadcasts</CardDescription>
              </div>
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Feed
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Create Official Feed</DialogTitle>
                    <DialogDescription>This will be broadcast to users based on jurisdiction</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={feedForm.title}
                        onChange={(e) => setFeedForm({ ...feedForm, title: e.target.value })}
                        placeholder="Feed title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Content</Label>
                      <Textarea
                        value={feedForm.content}
                        onChange={(e) => setFeedForm({ ...feedForm, content: e.target.value })}
                        placeholder="Feed content..."
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Priority</Label>
                        <Select value={feedForm.priority} onValueChange={(v) => setFeedForm({ ...feedForm, priority: v })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="urgent">Urgent</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Jurisdiction</Label>
                        <Select value={feedForm.jurisdiction} onValueChange={(v) => setFeedForm({ ...feedForm, jurisdiction: v })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="citywide">Citywide</SelectItem>
                            <SelectItem value="downtown">Downtown</SelectItem>
                            <SelectItem value="internal">Internal Only</SelectItem>
                            <SelectItem value="federated">Federated</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Select value={feedForm.department} onValueChange={(v) => setFeedForm({ ...feedForm, department: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="administration">Administration</SelectItem>
                          <SelectItem value="it">IT</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="public-works">Public Works</SelectItem>
                          <SelectItem value="emergency">Emergency Services</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                    <Button onClick={() => { toast.success("Feed created"); setIsCreateOpen(false); }}>Publish</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Jurisdiction</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockFeeds.map((feed) => (
                    <TableRow key={feed.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{feed.title}</span>
                          {feed.verifiedBadge && (
                            <Shield className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{feed.author}</p>
                          <p className="text-xs text-muted-foreground">{feed.department}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={priorityColors[feed.priority]}>
                          {feed.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {feed.jurisdiction === "citywide" ? (
                            <Globe className="h-3 w-3" />
                          ) : feed.jurisdiction === "internal" ? (
                            <Lock className="h-3 w-3" />
                          ) : null}
                          <span className="text-sm capitalize">{feed.jurisdiction}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusColors[feed.status]}>{feed.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(feed.createdAt), "MMM d, HH:mm")}
                      </TableCell>
                      <TableCell className="text-right">
                        {feed.status === "pending" && (
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handlePublish(feed.id)}>
                              <CheckCircle className="h-4 w-4 text-success" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleReject(feed.id)}>
                              <XCircle className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sponsor Approval Tab */}
        <TabsContent value="sponsor-approval">
          <div className="space-y-6">
            {/* Sponsor Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-warning" />
                    <span className="text-sm text-muted-foreground">Pending Review</span>
                  </div>
                  <div className="text-2xl font-bold mt-1 text-warning">{sponsorStats.pending}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm text-muted-foreground">Approved</span>
                  </div>
                  <div className="text-2xl font-bold mt-1 text-success">{sponsorStats.approved}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm text-muted-foreground">Rejected</span>
                  </div>
                  <div className="text-2xl font-bold mt-1 text-destructive">{sponsorStats.rejected}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Sponsor Feed Submissions
                </CardTitle>
                <CardDescription>
                  Review and approve content submitted by sponsors before it becomes visible to users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Feed Title</TableHead>
                      <TableHead>Sponsor</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Target Audience</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSponsorFeeds.map((feed) => (
                      <TableRow key={feed.id}>
                        <TableCell>
                          <div className="max-w-[200px]">
                            <p className="font-medium truncate">{feed.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{feed.content.slice(0, 60)}...</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{feed.sponsorLogo}</span>
                            <span className="text-sm">{feed.sponsor}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={sponsorTierColors[feed.sponsorTier]}>
                            {feed.sponsorTier}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span className="text-sm">{feed.targetAudience}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{feed.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            feed.status === "approved" ? "default" :
                            feed.status === "rejected" ? "destructive" : "secondary"
                          }>
                            {feed.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(feed.submittedAt), "MMM d, HH:mm")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => openPreview(feed)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {feed.status === "pending" && (
                              <>
                                <Button variant="ghost" size="sm" onClick={() => handleSponsorApprove(feed)}>
                                  <CheckCircle className="h-4 w-4 text-success" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => openRejectDialog(feed)}>
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
              </CardContent>
            </Card>

            {/* Guidelines Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Sponsor Content Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-success/30 bg-success/5">
                    <h4 className="font-medium text-success flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4" />
                      Approve If
                    </h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Content is relevant to target audience</li>
                      <li>• No misleading claims or false information</li>
                      <li>• Complies with sponsor tier permissions</li>
                      <li>• Professional tone and language</li>
                      <li>• Clear call-to-action without pressure</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
                    <h4 className="font-medium text-destructive flex items-center gap-2 mb-2">
                      <XCircle className="h-4 w-4" />
                      Reject If
                    </h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Contains spam or excessive promotion</li>
                      <li>• Targets unauthorized audience segments</li>
                      <li>• Violates content policies</li>
                      <li>• Misleading or inaccurate information</li>
                      <li>• Exceeds sponsor tier privileges</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Verified Agencies Tab */}
        <TabsContent value="agencies">
          <Card>
            <CardHeader>
              <CardTitle>Verified Agencies (Class A.3)</CardTitle>
              <CardDescription>Manage verified government agencies with broadcast permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agency Name</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Can Broadcast</TableHead>
                    <TableHead>Allowed Post Types</TableHead>
                    <TableHead>Verified Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockVerifiedAgencies.map((agency) => (
                    <TableRow key={agency.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {agency.name}
                          {agency.verified && <Shield className="h-4 w-4 text-primary" />}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{agency.domain}</TableCell>
                      <TableCell>
                        <Switch checked={agency.verified} />
                      </TableCell>
                      <TableCell>
                        <Switch checked={agency.canBroadcast} disabled={!agency.verified} />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {agency.postTypes.map((type) => (
                            <Badge key={type} variant="outline" className="text-xs">{type}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {agency.verifiedAt ? format(new Date(agency.verifiedAt), "MMM d, yyyy") : "—"}
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

        {/* Visibility Rules Tab */}
        <TabsContent value="visibility">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Visibility Rules</CardTitle>
                <CardDescription>Configure content visibility based on post types and roles</CardDescription>
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
                    <TableHead>Rule Name</TableHead>
                    <TableHead>Post Type</TableHead>
                    <TableHead>Visible To</TableHead>
                    <TableHead>Departments</TableHead>
                    <TableHead>Requires Verification</TableHead>
                    <TableHead>Enabled</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockVisibilityRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{rule.postType}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {rule.visibleTo.map((audience) => (
                            <Badge key={audience} variant="secondary" className="text-xs">
                              {audience.replace("_", " ")}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{rule.departments}</TableCell>
                      <TableCell>
                        {rule.requiresVerification ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch checked={rule.enabled} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Filters Tab */}
        <TabsContent value="filters">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Filtering Rules</CardTitle>
                <CardDescription>Define rules for content moderation and filtering</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">Official Feeds - Verified Only</p>
                    <p className="text-sm text-muted-foreground">Only Class A.3 verified agencies can create official feeds</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">Sponsor Content - Resource Library Only</p>
                    <p className="text-sm text-muted-foreground">Class B sponsors are restricted to posting in the Resource Library</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">Federated Posts - Admin Approval</p>
                    <p className="text-sm text-muted-foreground">External federated posts require admin approval before visibility</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">Emergency Broadcast Override</p>
                    <p className="text-sm text-muted-foreground">Emergency alerts bypass normal approval workflows</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">Internal Posts - Staff Only</p>
                    <p className="text-sm text-muted-foreground">Internal content is only visible to verified staff members</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Sponsor Feed Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Sponsor Feed Preview
            </DialogTitle>
            <DialogDescription>Review the sponsor content before approving or rejecting</DialogDescription>
          </DialogHeader>
          {selectedSponsorFeed && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <span className="text-2xl">{selectedSponsorFeed.sponsorLogo}</span>
                <div>
                  <p className="font-medium">{selectedSponsorFeed.sponsor}</p>
                  <Badge className={sponsorTierColors[selectedSponsorFeed.sponsorTier]}>
                    {selectedSponsorFeed.sponsorTier} Sponsor
                  </Badge>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{selectedSponsorFeed.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{selectedSponsorFeed.category}</Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {selectedSponsorFeed.targetAudience}
                  </span>
                </div>
              </div>
              <div className="p-4 rounded-lg border">
                <p className="text-sm leading-relaxed">{selectedSponsorFeed.content}</p>
              </div>
              <div className="text-sm text-muted-foreground">
                Submitted: {format(new Date(selectedSponsorFeed.submittedAt), "MMMM d, yyyy 'at' h:mm a")}
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
            {selectedSponsorFeed?.status === "pending" && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsPreviewOpen(false);
                    if (selectedSponsorFeed) openRejectDialog(selectedSponsorFeed);
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button onClick={() => selectedSponsorFeed && handleSponsorApprove(selectedSponsorFeed)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve & Publish
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Reason Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              Reject Sponsor Feed
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this sponsor content. The sponsor will be notified.
            </DialogDescription>
          </DialogHeader>
          {selectedSponsorFeed && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="font-medium text-sm">{selectedSponsorFeed.title}</p>
                <p className="text-xs text-muted-foreground">by {selectedSponsorFeed.sponsor}</p>
              </div>
              <div className="space-y-2">
                <Label>Rejection Reason</Label>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why this content is being rejected..."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Quick Reasons</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Content policy violation",
                    "Misleading information",
                    "Unauthorized audience",
                    "Requires revision",
                    "Exceeds tier privileges",
                  ].map((reason) => (
                    <Button
                      key={reason}
                      variant="outline"
                      size="sm"
                      onClick={() => setRejectionReason(reason)}
                    >
                      {reason}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSponsorReject} disabled={!rejectionReason}>
              <XCircle className="h-4 w-4 mr-2" />
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

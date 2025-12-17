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

// Mock data for announcements
const mockAnnouncements = [
  { id: "1", title: "City Hall Closure Notice", content: "City Hall will be closed on January 20th for Martin Luther King Jr. Day", status: "published", priority: "high", jurisdiction: "citywide", department: "Administration", author: "Mayor's Office", verifiedBadge: true, createdAt: "2024-01-15T10:00:00Z", publishedAt: "2024-01-15T10:30:00Z" },
  { id: "2", title: "New Parking Regulations", content: "Updated parking regulations effective February 1st", status: "pending", priority: "medium", jurisdiction: "downtown", department: "Public Works", author: "Transportation Dept", verifiedBadge: true, createdAt: "2024-01-14T14:00:00Z", publishedAt: null },
  { id: "3", title: "Emergency Weather Advisory", content: "Severe weather expected this weekend. Stay indoors.", status: "published", priority: "urgent", jurisdiction: "citywide", department: "Emergency Services", author: "Emergency Management", verifiedBadge: true, createdAt: "2024-01-13T08:00:00Z", publishedAt: "2024-01-13T08:05:00Z" },
  { id: "4", title: "Budget Meeting Announcement", content: "Annual budget review meeting scheduled for January 25th", status: "draft", priority: "low", jurisdiction: "internal", department: "Finance", author: "City Controller", verifiedBadge: false, createdAt: "2024-01-12T16:00:00Z", publishedAt: null },
  { id: "5", title: "IT System Maintenance", content: "Scheduled maintenance window on Saturday 2AM-6AM", status: "scheduled", priority: "medium", jurisdiction: "internal", department: "IT", author: "IT Department", verifiedBadge: true, createdAt: "2024-01-11T11:00:00Z", publishedAt: null },
  { id: "6", title: "Community Event: Town Hall", content: "Join us for an open town hall discussion on community safety", status: "published", priority: "medium", jurisdiction: "citywide", department: "Community Relations", author: "City Council", verifiedBadge: true, createdAt: "2024-01-10T09:00:00Z", publishedAt: "2024-01-10T09:15:00Z" },
];

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
  { id: "1", name: "Official Announcements", postType: "official", visibleTo: ["all_users"], departments: ["all"], requiresVerification: true, enabled: true },
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
  const [activeTab, setActiveTab] = useState("announcements");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: "",
    priority: "medium",
    jurisdiction: "citywide",
    department: "",
  });

  const handlePublish = (id: string) => {
    toast.success("Announcement published successfully");
  };

  const handleReject = (id: string) => {
    toast.info("Announcement rejected");
  };

  const stats = {
    total: mockAnnouncements.length,
    published: mockAnnouncements.filter(a => a.status === "published").length,
    pending: mockAnnouncements.filter(a => a.status === "pending").length,
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
          <p className="text-muted-foreground">Manage announcements, visibility rules, and verified agencies</p>
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
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="announcements" className="flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
            Announcements
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

        {/* Announcements Tab */}
        <TabsContent value="announcements">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Official Announcements</CardTitle>
                <CardDescription>Create and manage official broadcasts</CardDescription>
              </div>
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Announcement
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Create Official Announcement</DialogTitle>
                    <DialogDescription>This will be broadcast to users based on jurisdiction</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={announcementForm.title}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                        placeholder="Announcement title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Content</Label>
                      <Textarea
                        value={announcementForm.content}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                        placeholder="Announcement content..."
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Priority</Label>
                        <Select value={announcementForm.priority} onValueChange={(v) => setAnnouncementForm({ ...announcementForm, priority: v })}>
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
                        <Select value={announcementForm.jurisdiction} onValueChange={(v) => setAnnouncementForm({ ...announcementForm, jurisdiction: v })}>
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
                      <Select value={announcementForm.department} onValueChange={(v) => setAnnouncementForm({ ...announcementForm, department: v })}>
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
                    <Button onClick={() => { toast.success("Announcement created"); setIsCreateOpen(false); }}>Publish</Button>
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
                  {mockAnnouncements.map((announcement) => (
                    <TableRow key={announcement.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{announcement.title}</span>
                          {announcement.verifiedBadge && (
                            <Shield className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{announcement.author}</p>
                          <p className="text-xs text-muted-foreground">{announcement.department}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={priorityColors[announcement.priority]}>
                          {announcement.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {announcement.jurisdiction === "citywide" ? (
                            <Globe className="h-3 w-3" />
                          ) : announcement.jurisdiction === "internal" ? (
                            <Lock className="h-3 w-3" />
                          ) : null}
                          <span className="text-sm capitalize">{announcement.jurisdiction}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusColors[announcement.status]}>{announcement.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(announcement.createdAt), "MMM d, HH:mm")}
                      </TableCell>
                      <TableCell className="text-right">
                        {announcement.status === "pending" && (
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handlePublish(announcement.id)}>
                              <CheckCircle className="h-4 w-4 text-success" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleReject(announcement.id)}>
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
                    <p className="font-medium">Official Announcements - Verified Only</p>
                    <p className="text-sm text-muted-foreground">Only Class A.3 verified agencies can create official announcements</p>
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
    </div>
  );
}

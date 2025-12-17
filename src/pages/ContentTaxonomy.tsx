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
  Tag, Folder, FileText, Plus, Edit, Trash2, CheckCircle, 
  Search, Building, BookOpen, Archive, Download
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

// Mock content types
const mockContentTypes = [
  { id: "1", name: "Standard Operating Procedures", code: "SOP", count: 45, department: "all", icon: "file-text", active: true },
  { id: "2", name: "Templates", code: "TPL", count: 32, department: "all", icon: "file", active: true },
  { id: "3", name: "Policy Documents", code: "POL", count: 18, department: "administration", icon: "shield", active: true },
  { id: "4", name: "Training Materials", code: "TRN", count: 24, department: "hr", icon: "book", active: true },
  { id: "5", name: "Sponsor Resources", code: "SPR", count: 12, department: "marketing", icon: "briefcase", active: true },
  { id: "6", name: "Emergency Protocols", code: "EMG", count: 8, department: "emergency", icon: "alert", active: true },
];

// Mock department tags
const mockDepartmentTags = [
  { id: "1", name: "Public Works", code: "PW", contentCount: 28, color: "#3B82F6" },
  { id: "2", name: "Information Technology", code: "IT", contentCount: 42, color: "#10B981" },
  { id: "3", name: "Finance", code: "FIN", contentCount: 19, color: "#F59E0B" },
  { id: "4", name: "Human Resources", code: "HR", contentCount: 31, color: "#8B5CF6" },
  { id: "5", name: "Parks & Recreation", code: "PRK", contentCount: 15, color: "#EC4899" },
  { id: "6", name: "Emergency Services", code: "EMS", contentCount: 22, color: "#EF4444" },
];

// Mock resource library items
const mockResourceItems = [
  { id: "1", title: "IT Security Best Practices", type: "SOP", department: "IT", author: "IT Security Team", status: "published", isSponsor: false, createdAt: "2024-01-10T10:00:00Z", downloads: 156 },
  { id: "2", title: "Employee Onboarding Checklist", type: "TPL", department: "HR", author: "HR Department", status: "published", isSponsor: false, createdAt: "2024-01-08T14:30:00Z", downloads: 89 },
  { id: "3", title: "Budget Request Template", type: "TPL", department: "Finance", author: "City Controller", status: "published", isSponsor: false, createdAt: "2024-01-05T09:00:00Z", downloads: 234 },
  { id: "4", title: "Cybersecurity Training Guide", type: "TRN", department: "IT", author: "TechCo Partners", status: "pending", isSponsor: true, createdAt: "2024-01-12T11:00:00Z", downloads: 0 },
  { id: "5", title: "Fleet Maintenance Manual", type: "SOP", department: "Public Works", author: "Fleet Manager", status: "published", isSponsor: false, createdAt: "2024-01-03T16:00:00Z", downloads: 67 },
  { id: "6", title: "Workplace Safety Poster", type: "SPR", department: "HR", author: "SafeWork Inc", status: "pending", isSponsor: true, createdAt: "2024-01-14T08:00:00Z", downloads: 0 },
];

export default function ContentTaxonomy() {
  const [activeTab, setActiveTab] = useState("types");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddTypeOpen, setIsAddTypeOpen] = useState(false);
  const [isAddTagOpen, setIsAddTagOpen] = useState(false);

  const handleApproveContent = (id: string) => {
    toast.success("Content approved and published");
  };

  const handleRejectContent = (id: string) => {
    toast.info("Content rejected");
  };

  const filteredResources = mockResourceItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalContent: mockResourceItems.length,
    published: mockResourceItems.filter(i => i.status === "published").length,
    pendingReview: mockResourceItems.filter(i => i.status === "pending").length,
    sponsorContent: mockResourceItems.filter(i => i.isSponsor).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Tag className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Content Taxonomy</h1>
          <p className="text-muted-foreground">Manage content types, department tags, and resource library</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Content</span>
            </div>
            <div className="text-2xl font-bold mt-1">{stats.totalContent}</div>
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
              <Archive className="h-4 w-4 text-warning" />
              <span className="text-sm text-muted-foreground">Pending Review</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-warning">{stats.pendingReview}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Sponsor Content</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-primary">{stats.sponsorContent}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="types" className="flex items-center gap-2">
            <Folder className="h-4 w-4" />
            Content Types
          </TabsTrigger>
          <TabsTrigger value="departments" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Department Tags
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Resource Library
          </TabsTrigger>
        </TabsList>

        {/* Content Types Tab */}
        <TabsContent value="types">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Content Types</CardTitle>
                <CardDescription>Define and manage content categorization</CardDescription>
              </div>
              <Dialog open={isAddTypeOpen} onOpenChange={setIsAddTypeOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Type
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Content Type</DialogTitle>
                    <DialogDescription>Create a new content classification</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Type Name</Label>
                      <Input placeholder="e.g., Standard Operating Procedures" />
                    </div>
                    <div className="space-y-2">
                      <Label>Code</Label>
                      <Input placeholder="e.g., SOP" maxLength={4} />
                    </div>
                    <div className="space-y-2">
                      <Label>Department Restriction</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          <SelectItem value="it">IT</SelectItem>
                          <SelectItem value="hr">HR</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddTypeOpen(false)}>Cancel</Button>
                    <Button onClick={() => { toast.success("Content type added"); setIsAddTypeOpen(false); }}>Add Type</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Content Count</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockContentTypes.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell className="font-medium">{type.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{type.code}</Badge>
                      </TableCell>
                      <TableCell>{type.count}</TableCell>
                      <TableCell className="capitalize">{type.department}</TableCell>
                      <TableCell>
                        <Switch checked={type.active} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Department Tags Tab */}
        <TabsContent value="departments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Department Tags</CardTitle>
                <CardDescription>Tag content by department for easy filtering</CardDescription>
              </div>
              <Dialog open={isAddTagOpen} onOpenChange={setIsAddTagOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tag
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Department Tag</DialogTitle>
                    <DialogDescription>Create a new department tag for content categorization</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Department Name</Label>
                      <Input placeholder="e.g., Public Works" />
                    </div>
                    <div className="space-y-2">
                      <Label>Code</Label>
                      <Input placeholder="e.g., PW" maxLength={4} />
                    </div>
                    <div className="space-y-2">
                      <Label>Color</Label>
                      <Input type="color" defaultValue="#3B82F6" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddTagOpen(false)}>Cancel</Button>
                    <Button onClick={() => { toast.success("Department tag added"); setIsAddTagOpen(false); }}>Add Tag</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {mockDepartmentTags.map((tag) => (
                  <Card key={tag.id} className="relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: tag.color }} />
                    <CardContent className="pt-4 pl-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{tag.name}</p>
                          <p className="text-sm text-muted-foreground">{tag.code}</p>
                        </div>
                        <Badge variant="secondary">{tag.contentCount} items</Badge>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resource Library Tab */}
        <TabsContent value="library">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Resource Library Management</CardTitle>
                <CardDescription>Review and manage content in the resource library</CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-[250px]"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Downloads</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResources.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.title}</span>
                          {item.isSponsor && (
                            <Badge variant="outline" className="text-xs">Sponsor</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.type}</Badge>
                      </TableCell>
                      <TableCell>{item.department}</TableCell>
                      <TableCell className="text-sm">{item.author}</TableCell>
                      <TableCell>
                        <Badge variant={item.status === "published" ? "default" : "secondary"}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Download className="h-3 w-3 text-muted-foreground" />
                          {item.downloads}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {item.status === "pending" && (
                            <>
                              <Button variant="ghost" size="sm" onClick={() => handleApproveContent(item.id)}>
                                <CheckCircle className="h-4 w-4 text-success" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleRejectContent(item.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
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

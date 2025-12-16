import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Search, Download, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SavedFilters } from "@/components/sop/SavedFilters";
import { CategoryPills } from "@/components/sop/CategoryPills";
import { BulkActionsBar } from "@/components/sop/BulkActionsBar";
import { VersionHistoryModal } from "@/components/sop/VersionHistoryModal";

interface SOP {
  id: string;
  title: string;
  description: string | null;
  tags: string[];
  version: string;
  updated_at: string;
  department: { name: string } | null;
  category: { name: string } | null;
  file_path: string | null;
  file_name: string | null;
  status?: "draft" | "under_review" | "approved" | "retired";
}

const statusColors = {
  draft: "bg-gray-500",
  under_review: "bg-yellow-500",
  approved: "bg-green-500",
  retired: "bg-red-500",
};

const statusLabels = {
  draft: "Draft",
  under_review: "Under Review",
  approved: "Approved",
  retired: "Retired",
};

export default function SOPLibrary() {
  const [sops, setSops] = useState<SOP[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [departments, setDepartments] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedSOPs, setSelectedSOPs] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Mock SOPs for display
    const mockSOPs: SOP[] = [
      {
        id: "mock-1",
        title: "Emergency Evacuation Procedures",
        description: "Standard procedures for building evacuation during emergencies",
        tags: ["emergency", "safety", "protocol"],
        version: "2.1",
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        department: { name: "Public Safety" },
        category: { name: "Emergency" },
        file_path: null,
        file_name: "evacuation-procedures.pdf",
        status: "approved",
      },
      {
        id: "mock-2",
        title: "Water Quality Testing Standards",
        description: "Monthly water quality testing and reporting procedures",
        tags: ["water", "testing", "compliance"],
        version: "1.5",
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        department: { name: "Public Works" },
        category: { name: "Water" },
        file_path: null,
        file_name: "water-testing.pdf",
        status: "approved",
      },
      {
        id: "mock-3",
        title: "Employee Onboarding Checklist",
        description: "Comprehensive checklist for new employee onboarding",
        tags: ["hr", "onboarding", "training"],
        version: "3.0",
        updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        department: { name: "Human Resources" },
        category: { name: "HR" },
        file_path: null,
        file_name: "onboarding-checklist.pdf",
        status: "under_review",
      },
      {
        id: "mock-4",
        title: "Park Maintenance Schedule",
        description: "Seasonal maintenance procedures for city parks",
        tags: ["parks", "maintenance", "seasonal"],
        version: "1.8",
        updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        department: { name: "Parks & Recreation" },
        category: { name: "Parks & Rec" },
        file_path: null,
        file_name: "park-maintenance.pdf",
        status: "approved",
      },
      {
        id: "mock-5",
        title: "Workplace Safety Guidelines",
        description: "General safety guidelines for all municipal employees",
        tags: ["safety", "guidelines", "ppe"],
        version: "2.3",
        updated_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        department: { name: "Public Safety" },
        category: { name: "Safety" },
        file_path: null,
        file_name: "safety-guidelines.pdf",
        status: "draft",
      },
    ];
    
    // Fetch SOPs from database
    const { data: sopsData, error: sopsError } = await supabase
      .from("sops")
      .select(`
        *,
        department:departments(name),
        category:categories(name)
      `)
      .order("updated_at", { ascending: false });

    if (sopsError) {
      toast({
        title: "Error",
        description: "Failed to load SOPs",
        variant: "destructive",
      });
    }
    
    // Combine mock data with real data
    const sopsWithStatus = (sopsData || []).map((sop, idx) => ({
      ...sop,
      status: ["approved", "draft", "under_review", "approved"][idx % 4] as any,
    }));
    
    setSops([...mockSOPs, ...sopsWithStatus]);

    // Fetch departments
    const { data: deptData } = await supabase
      .from("departments")
      .select("*")
      .order("name");
    setDepartments(deptData || []);

    // Fetch categories from database
    const { data: catData } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    
    // Mock categories for display
    const mockCategories = [
      { id: "cat-1", name: "Safety" },
      { id: "cat-2", name: "HR" },
      { id: "cat-3", name: "Emergency" },
      { id: "cat-4", name: "Public Works" },
      { id: "cat-5", name: "Water" },
      { id: "cat-6", name: "Parks & Rec" },
    ];
    
    // Combine mock and real categories
    const allCategories = [...mockCategories, ...(catData || [])];
    const uniqueCategories = Array.from(
      new Map(allCategories.map(cat => [cat.name, cat])).values()
    );
    setCategories(uniqueCategories);

    setLoading(false);
  };

  const filteredSOPs = sops.filter((sop) => {
    const matchesSearch = sop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sop.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === "all" || sop.department?.name === selectedDepartment;
    const matchesCategory = selectedCategory === "all" || sop.category?.name === selectedCategory;
    return matchesSearch && matchesDepartment && matchesCategory;
  });

  const handleDownload = async (filePath: string | null, fileName: string | null) => {
    if (!filePath) return;

    const { data, error } = await supabase.storage
      .from("sops")
      .download(filePath);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
      return;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || "document.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSelectSOP = (id: string) => {
    const newSelected = new Set(selectedSOPs);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedSOPs(newSelected);
  };

  const handleSelectAll = () => {
    setSelectedSOPs(new Set(filteredSOPs.map(sop => sop.id)));
  };

  const handleDeselectAll = () => {
    setSelectedSOPs(new Set());
  };

  const handleBulkAction = (action: string) => {
    toast({
      title: "Bulk Action",
      description: `${action} ${selectedSOPs.size} SOPs`,
    });
    setSelectedSOPs(new Set());
  };

  const handleApplyFilter = (department: string, category: string) => {
    setSelectedDepartment(department);
    setSelectedCategory(category);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SOP Library</h1>
          <p className="text-muted-foreground mt-2">
            Standard Operating Procedures for municipal operations
          </p>
        </div>
        <Button onClick={() => navigate("/sop/upload")} size="lg" className="shadow-lg">
          <FileText className="mr-2 h-4 w-4" />
          Upload SOP
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold">Filters</CardTitle>
          <CardDescription className="text-base">Search and filter SOPs by criteria</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search SOPs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-11"
            />
          </div>

          <SavedFilters
            onApplyFilter={handleApplyFilter}
            currentDepartment={selectedDepartment}
            currentCategory={selectedCategory}
          />

          <CategoryPills
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Department</h3>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <BulkActionsBar
        selectedCount={selectedSOPs.size}
        totalCount={filteredSOPs.length}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onBulkPublish={() => handleBulkAction("Published")}
        onBulkArchive={() => handleBulkAction("Archived")}
        onBulkDelete={() => handleBulkAction("Deleted")}
        onBulkAssign={() => handleBulkAction("Assigned reviewers to")}
      />

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedSOPs.size === filteredSOPs.length && filteredSOPs.length > 0}
                    onCheckedChange={() => {
                      if (selectedSOPs.size === filteredSOPs.length) {
                        handleDeselectAll();
                      } else {
                        handleSelectAll();
                      }
                    }}
                  />
                </TableHead>
                <TableHead className="font-semibold">Title</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Department</TableHead>
                <TableHead className="font-semibold">Tags</TableHead>
                <TableHead className="font-semibold">Version</TableHead>
                <TableHead className="font-semibold">Last Updated</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredSOPs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-lg font-medium">No SOPs found</p>
                    <p className="text-sm">Upload your first SOP to get started</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSOPs.map((sop) => (
                  <TableRow key={sop.id} className="group">
                    <TableCell>
                      <Checkbox
                        checked={selectedSOPs.has(sop.id)}
                        onCheckedChange={() => handleSelectSOP(sop.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{sop.title}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[sop.status || "draft"]}>
                        {statusLabels[sop.status || "draft"]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {sop.category?.name ? (
                        <Badge variant="secondary">{sop.category.name}</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {sop.department?.name || <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {sop.tags.length > 0 ? (
                          sop.tags.slice(0, 2).map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                        {sop.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{sop.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{sop.version}</span>
                        <VersionHistoryModal sopTitle={sop.title} />
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(sop.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/sop/${sop.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownload(sop.file_path, sop.file_name)}
                          disabled={!sop.file_path}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
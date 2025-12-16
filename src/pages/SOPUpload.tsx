import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TagInput } from "@/components/sop/TagInput";
import { FileDropzone } from "@/components/sop/FileDropzone";

export default function SOPUpload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [versionType, setVersionType] = useState<"major" | "minor">("minor");
  const [file, setFile] = useState<File | null>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: deptData } = await supabase
      .from("departments")
      .select("*")
      .order("name");
    setDepartments(deptData || []);

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
  };

  const generateVersion = () => {
    // Auto-generate version based on selection
    // In real app, fetch latest version and increment
    return versionType === "major" ? "2.0" : "1.1";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !categoryId || !file) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Not authenticated");
      }

      // Upload file
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("sops")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Insert SOP record with auto-generated version
      const version = generateVersion();
      const { data, error: insertError } = await supabase
        .from("sops")
        .insert({
          title,
          description: description || null,
          department_id: departmentId || null,
          category_id: categoryId,
          tags: tags,
          version,
          file_path: filePath,
          file_name: file.name,
          file_size: file.size,
          created_by: user.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "SOP uploaded successfully",
      });

      navigate(`/sop/${data.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/sop-library")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upload SOP</h1>
          <p className="text-muted-foreground mt-2">
            Add a new Standard Operating Procedure
          </p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Upload Form</CardTitle>
          <CardDescription>Complete all required fields to upload your SOP</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* SOP Details Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-1">SOP Details</h3>
                <p className="text-sm text-muted-foreground">Basic information about the document</p>
              </div>
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter SOP title"
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description of the SOP"
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>

            {/* Metadata Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-1">Metadata</h3>
                <p className="text-sm text-muted-foreground">Categorization and organizational details</p>
              </div>
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={departmentId} onValueChange={setDepartmentId}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-destructive">*</span>
                  </Label>
                  <Select value={categoryId} onValueChange={setCategoryId} required>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <TagInput tags={tags} onChange={setTags} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="versionType">Version Type</Label>
                <Select value={versionType} onValueChange={(v: any) => setVersionType(v)}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minor">Minor Update (1.0 → 1.1)</SelectItem>
                    <SelectItem value="major">Major Update (1.0 → 2.0)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Version will be auto-generated: {generateVersion()}
                </p>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-1">File Upload</h3>
                <p className="text-sm text-muted-foreground">Upload your SOP document</p>
              </div>
              <Separator />

              <div className="space-y-2">
                <Label>
                  Document File <span className="text-destructive">*</span>
                </Label>
                <FileDropzone file={file} onChange={setFile} />
              </div>
            </div>

            <Separator />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/sop-library")}
                size="lg"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} size="lg">
                <Upload className="mr-2 h-4 w-4" />
                {loading ? "Uploading..." : "Upload SOP"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
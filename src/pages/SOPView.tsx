import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SOPView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sop, setSop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchSOP();
    }
  }, [id]);

  const fetchSOP = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("sops")
      .select(`
        *,
        department:departments(name),
        category:categories(name),
        created_by_profile:profiles!sops_created_by_fkey(full_name)
      `)
      .eq("id", id)
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load SOP",
        variant: "destructive",
      });
      navigate("/sop-library");
    } else {
      setSop(data);
      if (data.file_path) {
        const { data: urlData } = await supabase.storage
          .from("sops")
          .createSignedUrl(data.file_path, 3600);
        if (urlData) {
          setFileUrl(urlData.signedUrl);
        }
      }
    }
    setLoading(false);
  };

  const handleDownload = async () => {
    if (!sop?.file_path) return;

    const { data, error } = await supabase.storage
      .from("sops")
      .download(sop.file_path);

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
    a.download = sop.file_name || "document.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!sop) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/sop-library")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{sop.title}</h1>
          <p className="text-muted-foreground mt-1">Version {sop.version}</p>
        </div>
        <Button onClick={handleDownload} disabled={!sop.file_path}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {fileUrl ? (
                <iframe
                  src={fileUrl}
                  className="w-full h-[600px] rounded-lg border"
                  title={sop.title}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-[600px] border rounded-lg bg-muted/20">
                  <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No file available for preview</p>
                </div>
              )}
            </CardContent>
          </Card>

          {sop.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{sop.description}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Category</p>
                {sop.category?.name ? (
                  <Badge variant="secondary" className="mt-1">
                    {sop.category.name}
                  </Badge>
                ) : (
                  <p className="text-sm mt-1">Not specified</p>
                )}
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-muted-foreground">Department</p>
                <p className="text-sm mt-1">{sop.department?.name || "Not specified"}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-muted-foreground">Tags</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {sop.tags.length > 0 ? (
                    sop.tags.map((tag: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm">No tags</p>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-muted-foreground">Created By</p>
                <p className="text-sm mt-1">
                  {sop.created_by_profile?.full_name || "Unknown"}
                </p>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p className="text-sm mt-1">
                  {new Date(sop.updated_at).toLocaleDateString()}
                </p>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <p className="text-sm mt-1">
                  {new Date(sop.created_at).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollText, Plus, Edit, Trash2, Eye, CheckCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface Disclaimer {
  id: string;
  title: string;
  content: string;
  version: string;
  is_active: boolean;
  requires_acceptance: boolean;
  created_at: string;
}

export default function LegalDisclaimers() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDisclaimer, setEditingDisclaimer] = useState<Disclaimer | null>(null);
  const [previewDisclaimer, setPreviewDisclaimer] = useState<Disclaimer | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    version: "1.0",
    is_active: true,
    requires_acceptance: true,
  });

  const queryClient = useQueryClient();

  const { data: disclaimers, isLoading } = useQuery({
    queryKey: ["legal-disclaimers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("legal_disclaimers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Disclaimer[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { data: user } = await supabase.auth.getUser();
      const { error } = await supabase.from("legal_disclaimers").insert({
        ...data,
        created_by: user.user?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["legal-disclaimers"] });
      toast.success("Disclaimer created successfully");
      setIsCreateOpen(false);
      resetForm();
    },
    onError: () => toast.error("Failed to create disclaimer"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase
        .from("legal_disclaimers")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["legal-disclaimers"] });
      toast.success("Disclaimer updated successfully");
      setEditingDisclaimer(null);
      resetForm();
    },
    onError: () => toast.error("Failed to update disclaimer"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("legal_disclaimers")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["legal-disclaimers"] });
      toast.success("Disclaimer deleted");
    },
    onError: () => toast.error("Failed to delete disclaimer"),
  });

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      version: "1.0",
      is_active: true,
      requires_acceptance: true,
    });
  };

  const handleEdit = (disclaimer: Disclaimer) => {
    setEditingDisclaimer(disclaimer);
    setFormData({
      title: disclaimer.title,
      content: disclaimer.content,
      version: disclaimer.version,
      is_active: disclaimer.is_active,
      requires_acceptance: disclaimer.requires_acceptance,
    });
  };

  const handleSubmit = () => {
    if (editingDisclaimer) {
      updateMutation.mutate({ id: editingDisclaimer.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
            <ScrollText className="h-5 w-5 text-warning" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Legal Disclaimers</h1>
            <p className="text-muted-foreground">Manage Code of Conduct and legal agreements</p>
          </div>
        </div>
        <Dialog open={isCreateOpen || !!editingDisclaimer} onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setEditingDisclaimer(null);
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Disclaimer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingDisclaimer ? "Edit Disclaimer" : "Create Disclaimer"}</DialogTitle>
              <DialogDescription>
                Create legal text that users must accept during onboarding
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Code of Conduct"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Version</Label>
                  <Input
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="1.0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter the legal disclaimer text..."
                  rows={10}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label>Active</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.requires_acceptance}
                    onCheckedChange={(checked) => setFormData({ ...formData, requires_acceptance: checked })}
                  />
                  <Label>Requires Acceptance</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsCreateOpen(false);
                setEditingDisclaimer(null);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!formData.title || !formData.content}>
                {editingDisclaimer ? "Save Changes" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Disclaimers</CardTitle>
          <CardDescription>Legal documents that users must agree to</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : !disclaimers?.length ? (
            <div className="text-center py-8 text-muted-foreground">
              No disclaimers created yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requires Acceptance</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {disclaimers.map((disclaimer) => (
                  <TableRow key={disclaimer.id}>
                    <TableCell className="font-medium">{disclaimer.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">v{disclaimer.version}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={disclaimer.is_active ? "default" : "secondary"}>
                        {disclaimer.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {disclaimer.requires_acceptance ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>{format(new Date(disclaimer.created_at), "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPreviewDisclaimer(disclaimer)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(disclaimer)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMutation.mutate(disclaimer.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={!!previewDisclaimer} onOpenChange={() => setPreviewDisclaimer(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewDisclaimer?.title}</DialogTitle>
            <DialogDescription>Version {previewDisclaimer?.version}</DialogDescription>
          </DialogHeader>
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-sm">{previewDisclaimer?.content}</pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

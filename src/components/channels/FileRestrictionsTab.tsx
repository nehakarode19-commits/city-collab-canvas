import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, FileUp, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FileRestriction {
  id: string;
  channel_id: string;
  allowed_file_types: string[];
  max_file_size_mb: number;
  channels?: { name: string };
}

const commonFileTypes = [
  { value: "image/jpeg", label: "JPEG Images" },
  { value: "image/png", label: "PNG Images" },
  { value: "image/gif", label: "GIF Images" },
  { value: "application/pdf", label: "PDF Documents" },
  { value: "application/msword", label: "Word Documents" },
  { value: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", label: "Word Documents (DOCX)" },
  { value: "application/vnd.ms-excel", label: "Excel Spreadsheets" },
  { value: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", label: "Excel Spreadsheets (XLSX)" },
  { value: "text/plain", label: "Text Files" },
  { value: "video/mp4", label: "MP4 Videos" },
];

export function FileRestrictionsTab() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRestriction, setEditingRestriction] = useState<FileRestriction | null>(null);
  const [formData, setFormData] = useState({
    channel_id: "",
    allowed_file_types: ["image/jpeg", "image/png", "application/pdf"] as string[],
    max_file_size_mb: 10,
  });

  const queryClient = useQueryClient();

  const { data: restrictions, isLoading } = useQuery({
    queryKey: ["file-restrictions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("file_upload_restrictions")
        .select(`
          *,
          channels:channel_id(name)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as FileRestriction[];
    },
  });

  const { data: channels } = useQuery({
    queryKey: ["channels-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("channels")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("file_upload_restrictions").insert({
        channel_id: data.channel_id,
        allowed_file_types: data.allowed_file_types,
        max_file_size_mb: data.max_file_size_mb,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["file-restrictions"] });
      toast.success("Restriction created");
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error) => toast.error("Failed to create restriction: " + error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase
        .from("file_upload_restrictions")
        .update({
          allowed_file_types: data.allowed_file_types,
          max_file_size_mb: data.max_file_size_mb,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["file-restrictions"] });
      toast.success("Restriction updated");
      setEditingRestriction(null);
      resetForm();
    },
    onError: () => toast.error("Failed to update restriction"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("file_upload_restrictions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["file-restrictions"] });
      toast.success("Restriction removed");
    },
    onError: () => toast.error("Failed to remove restriction"),
  });

  const resetForm = () => {
    setFormData({
      channel_id: "",
      allowed_file_types: ["image/jpeg", "image/png", "application/pdf"],
      max_file_size_mb: 10,
    });
  };

  const handleEdit = (restriction: FileRestriction) => {
    setEditingRestriction(restriction);
    setFormData({
      channel_id: restriction.channel_id,
      allowed_file_types: restriction.allowed_file_types,
      max_file_size_mb: restriction.max_file_size_mb,
    });
  };

  const handleSubmit = () => {
    if (editingRestriction) {
      updateMutation.mutate({ id: editingRestriction.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const addFileType = (type: string) => {
    if (!formData.allowed_file_types.includes(type)) {
      setFormData({
        ...formData,
        allowed_file_types: [...formData.allowed_file_types, type],
      });
    }
  };

  const removeFileType = (type: string) => {
    setFormData({
      ...formData,
      allowed_file_types: formData.allowed_file_types.filter((t) => t !== type),
    });
  };

  const getFileTypeLabel = (type: string) => {
    return commonFileTypes.find((t) => t.value === type)?.label || type;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>File Upload Restrictions</CardTitle>
          <CardDescription>Configure allowed file types and size limits per channel</CardDescription>
        </div>
        <Dialog
          open={isCreateOpen || !!editingRestriction}
          onOpenChange={(open) => {
            if (!open) {
              setIsCreateOpen(false);
              setEditingRestriction(null);
              resetForm();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Restriction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingRestriction ? "Edit Restriction" : "Add File Restriction"}
              </DialogTitle>
              <DialogDescription>
                Configure file upload restrictions for a channel
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Channel</Label>
                <Select
                  value={formData.channel_id}
                  onValueChange={(value) => setFormData({ ...formData, channel_id: value })}
                  disabled={!!editingRestriction}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                  <SelectContent>
                    {channels?.map((channel) => (
                      <SelectItem key={channel.id} value={channel.id}>
                        {channel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Max File Size (MB)</Label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={formData.max_file_size_mb}
                  onChange={(e) =>
                    setFormData({ ...formData, max_file_size_mb: parseInt(e.target.value) || 10 })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Allowed File Types</Label>
                <Select onValueChange={addFileType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add file type" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonFileTypes
                      .filter((t) => !formData.allowed_file_types.includes(t.value))
                      .map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.allowed_file_types.map((type) => (
                    <Badge key={type} variant="secondary" className="flex items-center gap-1">
                      {getFileTypeLabel(type)}
                      <button onClick={() => removeFileType(type)} className="hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateOpen(false);
                  setEditingRestriction(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!formData.channel_id || formData.allowed_file_types.length === 0}
              >
                {editingRestriction ? "Save Changes" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : !restrictions?.length ? (
          <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-2">
            <FileUp className="h-8 w-8" />
            <p>No file restrictions configured</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Channel</TableHead>
                <TableHead>Allowed Types</TableHead>
                <TableHead>Max Size</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {restrictions.map((restriction) => (
                <TableRow key={restriction.id}>
                  <TableCell className="font-medium">{restriction.channels?.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[300px]">
                      {restriction.allowed_file_types.slice(0, 3).map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {getFileTypeLabel(type)}
                        </Badge>
                      ))}
                      {restriction.allowed_file_types.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{restriction.allowed_file_types.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{restriction.max_file_size_mb} MB</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(restriction)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMutation.mutate(restriction.id)}
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
  );
}

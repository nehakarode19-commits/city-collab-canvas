import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Eye, FileWarning } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

type ContentStatus = "pending" | "approved" | "rejected" | "flagged";

interface ContentItem {
  id: string;
  user_id: string;
  channel_id: string | null;
  content: string;
  content_type: string;
  status: ContentStatus;
  moderated_by: string | null;
  moderated_at: string | null;
  created_at: string;
  profiles?: { full_name: string; email: string };
  channels?: { name: string } | null;
}

const statusColors: Record<ContentStatus, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
  flagged: "outline",
};

export function ContentModerationTab() {
  const [statusFilter, setStatusFilter] = useState<ContentStatus | "all">("pending");
  const [previewContent, setPreviewContent] = useState<ContentItem | null>(null);

  const queryClient = useQueryClient();

  const { data: content, isLoading } = useQuery({
    queryKey: ["moderation-content", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("content")
        .select(`
          *,
          profiles!content_user_id_fkey(full_name, email),
          channels:channel_id(name)
        `)
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as unknown as ContentItem[];
    },
  });

  const moderateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ContentStatus }) => {
      const { data: user } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("content")
        .update({
          status,
          moderated_by: user.user?.id,
          moderated_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) throw error;

      // If rejecting, log the removal
      if (status === "rejected") {
        const contentItem = content?.find((c) => c.id === id);
        if (contentItem) {
          await supabase.from("content_removal_logs").insert({
            content_id: id,
            removed_by: user.user?.id,
            reason: "Content rejected during moderation",
            original_content: contentItem.content,
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moderation-content"] });
      toast.success("Content moderated");
    },
    onError: () => toast.error("Failed to moderate content"),
  });

  const pendingCount = content?.filter((c) => c.status === "pending").length || 0;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Content Moderation Queue
              {pendingCount > 0 && (
                <Badge variant="destructive">{pendingCount} pending</Badge>
              )}
            </CardTitle>
            <CardDescription>Review and moderate user-submitted content</CardDescription>
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as ContentStatus | "all")}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : !content?.length ? (
            <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-2">
              <FileWarning className="h-8 w-8" />
              <p>No content to moderate</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Author</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Preview</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {content.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.profiles?.full_name}</p>
                        <p className="text-sm text-muted-foreground">{item.profiles?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.content_type}</Badge>
                    </TableCell>
                    <TableCell>{item.channels?.name || "—"}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {item.content.slice(0, 50)}...
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColors[item.status]}>{item.status}</Badge>
                    </TableCell>
                    <TableCell>{format(new Date(item.created_at), "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPreviewContent(item)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {item.status === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                moderateMutation.mutate({ id: item.id, status: "approved" })
                              }
                            >
                              <Check className="h-4 w-4 text-success" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                moderateMutation.mutate({ id: item.id, status: "rejected" })
                              }
                            >
                              <X className="h-4 w-4 text-destructive" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Content Preview Dialog */}
      <Dialog open={!!previewContent} onOpenChange={() => setPreviewContent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Content Preview</DialogTitle>
            <DialogDescription>
              Posted by {previewContent?.profiles?.full_name} on{" "}
              {previewContent?.created_at &&
                format(new Date(previewContent.created_at), "MMMM d, yyyy")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Badge variant="outline">{previewContent?.content_type}</Badge>
              <Badge variant={statusColors[previewContent?.status || "pending"]}>
                {previewContent?.status}
              </Badge>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <pre className="whitespace-pre-wrap font-sans text-sm">
                {previewContent?.content}
              </pre>
            </div>
            {previewContent?.status === "pending" && (
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    moderateMutation.mutate({ id: previewContent.id, status: "rejected" });
                    setPreviewContent(null);
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => {
                    moderateMutation.mutate({ id: previewContent.id, status: "approved" });
                    setPreviewContent(null);
                  }}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

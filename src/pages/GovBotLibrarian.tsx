import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Plus, Link, FileText, CheckCircle, XCircle, Eye, Clock, Globe } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface TrustedUrl {
  id: string;
  url: string;
  domain: string;
  category: string | null;
  is_active: boolean;
  last_crawled_at: string | null;
  crawl_frequency_hours: number;
  created_at: string;
}

interface GovBotContent {
  id: string;
  source_url_id: string;
  title: string;
  summary: string | null;
  status: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  govbot_trusted_urls?: { url: string; domain: string };
}

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
};

const categoryOptions = [
  { value: "legislation", label: "Legislation" },
  { value: "regulations", label: "Regulations" },
  { value: "announcements", label: "Announcements" },
  { value: "guidelines", label: "Guidelines" },
  { value: "reports", label: "Reports" },
];

export default function GovBotLibrarian() {
  const [activeTab, setActiveTab] = useState("content");
  const [isAddUrlOpen, setIsAddUrlOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState<GovBotContent | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [urlForm, setUrlForm] = useState({
    url: "",
    category: "",
    crawl_frequency_hours: 24,
  });

  const queryClient = useQueryClient();

  const { data: trustedUrls, isLoading: loadingUrls } = useQuery({
    queryKey: ["govbot-urls"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("govbot_trusted_urls")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as TrustedUrl[];
    },
  });

  const { data: content, isLoading: loadingContent } = useQuery({
    queryKey: ["govbot-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("govbot_content")
        .select(`*, govbot_trusted_urls(url, domain)`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as GovBotContent[];
    },
  });

  const addUrlMutation = useMutation({
    mutationFn: async (data: typeof urlForm) => {
      const { data: user } = await supabase.auth.getUser();
      const url = new URL(data.url);
      const { error } = await supabase.from("govbot_trusted_urls").insert({
        url: data.url,
        domain: url.hostname,
        category: data.category || null,
        crawl_frequency_hours: data.crawl_frequency_hours,
        added_by: user.user?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["govbot-urls"] });
      toast.success("URL added to trusted list");
      setIsAddUrlOpen(false);
      setUrlForm({ url: "", category: "", crawl_frequency_hours: 24 });
    },
    onError: (error) => toast.error("Failed to add URL: " + error.message),
  });

  const toggleUrlMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase
        .from("govbot_trusted_urls")
        .update({ is_active: active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["govbot-urls"] });
      toast.success("URL status updated");
    },
    onError: () => toast.error("Failed to update URL"),
  });

  const moderateContentMutation = useMutation({
    mutationFn: async ({ id, status, reason }: { id: string; status: string; reason?: string }) => {
      const { data: user } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("govbot_content")
        .update({
          status,
          reviewed_by: user.user?.id,
          reviewed_at: new Date().toISOString(),
          rejection_reason: reason || null,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["govbot-content"] });
      toast.success("Content moderated");
      setPreviewContent(null);
      setRejectReason("");
    },
    onError: () => toast.error("Failed to moderate content"),
  });

  const pendingCount = content?.filter((c) => c.status === "pending").length || 0;
  const activeUrlsCount = trustedUrls?.filter((u) => u.is_active).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
          <Bot className="h-5 w-5 text-success" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">GovBot Librarian</h1>
          <p className="text-muted-foreground">Manage trusted sources and moderate retrieved content</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{trustedUrls?.length || 0}</div>
            <p className="text-sm text-muted-foreground">Total URLs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">{activeUrlsCount}</div>
            <p className="text-sm text-muted-foreground">Active Sources</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{content?.length || 0}</div>
            <p className="text-sm text-muted-foreground">Total Content</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">{pendingCount}</div>
            <p className="text-sm text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Content Queue
            {pendingCount > 0 && (
              <Badge variant="destructive" className="ml-1">{pendingCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="urls" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            Trusted URLs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content Review Queue</CardTitle>
              <CardDescription>Approve or reject content retrieved by GovBot</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingContent ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : !content?.length ? (
                <div className="text-center py-8 text-muted-foreground">No content to review</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Retrieved</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {content.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium max-w-[250px] truncate">{item.title}</TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1 text-sm">
                            <Globe className="h-3 w-3" />
                            {item.govbot_trusted_urls?.domain}
                          </span>
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
                                  onClick={() => moderateContentMutation.mutate({ id: item.id, status: "approved" })}
                                >
                                  <CheckCircle className="h-4 w-4 text-success" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setPreviewContent(item)}
                                >
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
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="urls">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Trusted URL Sources</CardTitle>
                <CardDescription>Manage the curated list of government sources</CardDescription>
              </div>
              <Dialog open={isAddUrlOpen} onOpenChange={setIsAddUrlOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add URL
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Trusted URL</DialogTitle>
                    <DialogDescription>Add a government source for GovBot to crawl</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>URL</Label>
                      <Input
                        value={urlForm.url}
                        onChange={(e) => setUrlForm({ ...urlForm, url: e.target.value })}
                        placeholder="https://www.government.gov/news"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select
                        value={urlForm.category}
                        onValueChange={(v) => setUrlForm({ ...urlForm, category: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Crawl Frequency (hours)</Label>
                      <Input
                        type="number"
                        value={urlForm.crawl_frequency_hours}
                        onChange={(e) => setUrlForm({ ...urlForm, crawl_frequency_hours: parseInt(e.target.value) || 24 })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddUrlOpen(false)}>Cancel</Button>
                    <Button onClick={() => addUrlMutation.mutate(urlForm)} disabled={!urlForm.url}>
                      Add URL
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {loadingUrls ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : !trustedUrls?.length ? (
                <div className="text-center py-8 text-muted-foreground">No trusted URLs configured</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Domain</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Last Crawled</TableHead>
                      <TableHead>Active</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trustedUrls.map((urlItem) => (
                      <TableRow key={urlItem.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{urlItem.domain}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[300px]">{urlItem.url}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {urlItem.category ? (
                            <Badge variant="outline">{urlItem.category}</Badge>
                          ) : "—"}
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {urlItem.crawl_frequency_hours}h
                          </span>
                        </TableCell>
                        <TableCell>
                          {urlItem.last_crawled_at
                            ? format(new Date(urlItem.last_crawled_at), "MMM d, HH:mm")
                            : "Never"}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={urlItem.is_active}
                            onCheckedChange={(checked) =>
                              toggleUrlMutation.mutate({ id: urlItem.id, active: checked })
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Content Preview/Reject Dialog */}
      <Dialog open={!!previewContent} onOpenChange={() => { setPreviewContent(null); setRejectReason(""); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{previewContent?.title}</DialogTitle>
            <DialogDescription>
              Source: {previewContent?.govbot_trusted_urls?.domain}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Summary</Label>
              <p className="mt-1">{previewContent?.summary || "No summary available"}</p>
            </div>
            {previewContent?.status === "pending" && (
              <div className="space-y-2">
                <Label>Rejection Reason (if rejecting)</Label>
                <Textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Reason for rejecting this content..."
                />
              </div>
            )}
          </div>
          <DialogFooter>
            {previewContent?.status === "pending" ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (previewContent) {
                      moderateContentMutation.mutate({
                        id: previewContent.id,
                        status: "rejected",
                        reason: rejectReason,
                      });
                    }
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => {
                    if (previewContent) {
                      moderateContentMutation.mutate({ id: previewContent.id, status: "approved" });
                    }
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setPreviewContent(null)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

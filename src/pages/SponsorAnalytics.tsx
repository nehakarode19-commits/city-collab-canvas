import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Plus, Eye, Download, MousePointer, Users, FileText, TrendingUp } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

interface SponsorContract {
  id: string;
  sponsor_id: string;
  contract_start: string;
  contract_end: string;
  guaranteed_impressions: number | null;
  actual_impressions: number;
  status: string;
}

interface SponsorAnalytic {
  id: string;
  sponsor_id: string;
  period_start: string;
  period_end: string;
  impressions: number;
  content_downloads: number;
  engagement_clicks: number;
  unique_viewers: number;
}

export default function SponsorAnalytics() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isCreateContractOpen, setIsCreateContractOpen] = useState(false);
  const [contractForm, setContractForm] = useState({
    sponsor_id: "",
    contract_start: "",
    contract_end: "",
    guaranteed_impressions: "",
  });

  const queryClient = useQueryClient();

  const { data: contracts, isLoading: loadingContracts } = useQuery({
    queryKey: ["sponsor-contracts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsor_visibility_contracts")
        .select("*")
        .order("contract_start", { ascending: false });
      if (error) throw error;
      return data as SponsorContract[];
    },
  });

  const { data: analytics } = useQuery({
    queryKey: ["sponsor-analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsor_analytics")
        .select("*")
        .order("period_start", { ascending: false })
        .limit(30);
      if (error) throw error;
      return data as SponsorAnalytic[];
    },
  });

  const createContractMutation = useMutation({
    mutationFn: async (data: typeof contractForm) => {
      const { error } = await supabase.from("sponsor_visibility_contracts").insert({
        sponsor_id: data.sponsor_id,
        contract_start: data.contract_start,
        contract_end: data.contract_end,
        guaranteed_impressions: parseInt(data.guaranteed_impressions) || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sponsor-contracts"] });
      toast.success("Contract created");
      setIsCreateContractOpen(false);
      setContractForm({ sponsor_id: "", contract_start: "", contract_end: "", guaranteed_impressions: "" });
    },
    onError: () => toast.error("Failed to create contract"),
  });

  // Aggregate stats
  const totalImpressions = analytics?.reduce((acc, a) => acc + a.impressions, 0) || 0;
  const totalDownloads = analytics?.reduce((acc, a) => acc + a.content_downloads, 0) || 0;
  const totalClicks = analytics?.reduce((acc, a) => acc + a.engagement_clicks, 0) || 0;
  const totalViewers = analytics?.reduce((acc, a) => acc + a.unique_viewers, 0) || 0;

  // Chart data
  const chartData = analytics?.slice(0, 12).reverse().map((a) => ({
    period: format(new Date(a.period_start), "MMM d"),
    impressions: a.impressions,
    downloads: a.content_downloads,
    clicks: a.engagement_clicks,
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-chart-1/10 flex items-center justify-center">
          <BarChart3 className="h-5 w-5 text-chart-1" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sponsor Analytics</h1>
          <p className="text-muted-foreground">Track sponsor performance and manage contracts</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Impressions</span>
            </div>
            <div className="text-2xl font-bold mt-1">{totalImpressions.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Downloads</span>
            </div>
            <div className="text-2xl font-bold mt-1">{totalDownloads.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <MousePointer className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Clicks</span>
            </div>
            <div className="text-2xl font-bold mt-1">{totalClicks.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Unique Viewers</span>
            </div>
            <div className="text-2xl font-bold mt-1">{totalViewers.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="contracts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Contracts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Performance Over Time</CardTitle>
              <CardDescription>Engagement metrics across all sponsors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="period" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="impressions" name="Impressions" fill="hsl(var(--chart-1))" />
                    <Bar dataKey="clicks" name="Clicks" fill="hsl(var(--chart-2))" />
                    <Bar dataKey="downloads" name="Downloads" fill="hsl(var(--chart-3))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Visibility Contracts</CardTitle>
                <CardDescription>Manage sponsor visibility agreements</CardDescription>
              </div>
              <Dialog open={isCreateContractOpen} onOpenChange={setIsCreateContractOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Contract
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Visibility Contract</DialogTitle>
                    <DialogDescription>Define sponsor visibility guarantees</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Sponsor ID</Label>
                      <Input
                        value={contractForm.sponsor_id}
                        onChange={(e) => setContractForm({ ...contractForm, sponsor_id: e.target.value })}
                        placeholder="Enter sponsor ID"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={contractForm.contract_start}
                          onChange={(e) => setContractForm({ ...contractForm, contract_start: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={contractForm.contract_end}
                          onChange={(e) => setContractForm({ ...contractForm, contract_end: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Guaranteed Impressions</Label>
                      <Input
                        type="number"
                        value={contractForm.guaranteed_impressions}
                        onChange={(e) => setContractForm({ ...contractForm, guaranteed_impressions: e.target.value })}
                        placeholder="10000"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateContractOpen(false)}>Cancel</Button>
                    <Button onClick={() => createContractMutation.mutate(contractForm)}>Create</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {loadingContracts ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : !contracts?.length ? (
                <div className="text-center py-8 text-muted-foreground">No contracts found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sponsor ID</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Guaranteed</TableHead>
                      <TableHead>Actual</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contracts.map((contract) => {
                      const progress = contract.guaranteed_impressions
                        ? Math.min((contract.actual_impressions / contract.guaranteed_impressions) * 100, 100)
                        : 0;
                      return (
                        <TableRow key={contract.id}>
                          <TableCell className="font-mono text-sm">{contract.sponsor_id.slice(0, 8)}...</TableCell>
                          <TableCell>
                            {format(new Date(contract.contract_start), "MMM d")} - {format(new Date(contract.contract_end), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>{contract.guaranteed_impressions?.toLocaleString() || "—"}</TableCell>
                          <TableCell>{contract.actual_impressions.toLocaleString()}</TableCell>
                          <TableCell className="w-[150px]">
                            <div className="flex items-center gap-2">
                              <Progress value={progress} className="h-2" />
                              <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={contract.status === "active" ? "default" : "secondary"}>
                              {contract.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

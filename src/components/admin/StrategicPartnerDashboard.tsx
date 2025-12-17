import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, Eye, MousePointer, Download, TrendingUp, 
  BarChart3, CheckCircle, Clock, XCircle, Edit 
} from "lucide-react";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";

interface Partner {
  id: string;
  name: string;
  tier: "gold" | "silver" | "bronze";
  status: "active" | "pending" | "expired";
  visibility: boolean;
  impressions: number;
  clicks: number;
  engagement: number;
  lastContent: string;
}

const mockPartners: Partner[] = [
  { id: "1", name: "TechCorp Solutions", tier: "gold", status: "active", visibility: true, impressions: 45230, clicks: 2341, engagement: 5.2, lastContent: "2024-01-10" },
  { id: "2", name: "SafeGuard Insurance", tier: "silver", status: "active", visibility: true, impressions: 28450, clicks: 1234, engagement: 4.3, lastContent: "2024-01-12" },
  { id: "3", name: "Municipal Finance Group", tier: "gold", status: "active", visibility: false, impressions: 52100, clicks: 3120, engagement: 6.0, lastContent: "2024-01-08" },
  { id: "4", name: "GreenCity Consulting", tier: "bronze", status: "pending", visibility: false, impressions: 0, clicks: 0, engagement: 0, lastContent: "-" },
  { id: "5", name: "PublicWorks Pro", tier: "silver", status: "expired", visibility: false, impressions: 18920, clicks: 890, engagement: 4.7, lastContent: "2023-12-15" },
];

const performanceData = [
  { month: "Aug", impressions: 32000, clicks: 1600 },
  { month: "Sep", impressions: 38000, clicks: 1900 },
  { month: "Oct", impressions: 42000, clicks: 2100 },
  { month: "Nov", impressions: 48000, clicks: 2400 },
  { month: "Dec", impressions: 52000, clicks: 2800 },
  { month: "Jan", impressions: 58000, clicks: 3100 },
];

const tierDistribution = [
  { name: "Gold", value: 2, color: "hsl(45, 100%, 50%)" },
  { name: "Silver", value: 2, color: "hsl(0, 0%, 70%)" },
  { name: "Bronze", value: 1, color: "hsl(30, 60%, 50%)" },
];

const tierColors = {
  gold: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
  silver: "bg-gray-400/20 text-gray-600 border-gray-400/30",
  bronze: "bg-orange-500/20 text-orange-600 border-orange-500/30",
};

const statusConfig = {
  active: { label: "Active", variant: "default" as const, icon: CheckCircle },
  pending: { label: "Pending", variant: "outline" as const, icon: Clock },
  expired: { label: "Expired", variant: "destructive" as const, icon: XCircle },
};

export function StrategicPartnerDashboard() {
  const [partners] = useState<Partner[]>(mockPartners);

  const totalImpressions = partners.reduce((sum, p) => sum + p.impressions, 0);
  const totalClicks = partners.reduce((sum, p) => sum + p.clicks, 0);
  const avgEngagement = partners.filter(p => p.engagement > 0).reduce((sum, p) => sum + p.engagement, 0) / partners.filter(p => p.engagement > 0).length;
  const activePartners = partners.filter(p => p.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Active Partners</span>
            </div>
            <div className="text-2xl font-bold mt-1">{activePartners}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Total Impressions</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-primary">{(totalImpressions / 1000).toFixed(1)}K</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <MousePointer className="h-4 w-4 text-success" />
              <span className="text-sm text-muted-foreground">Total Clicks</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-success">{(totalClicks / 1000).toFixed(1)}K</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-warning" />
              <span className="text-sm text-muted-foreground">Avg Engagement</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-warning">{avgEngagement.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Overview
            </CardTitle>
            <CardDescription>Impressions and clicks over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Line type="monotone" dataKey="impressions" stroke="hsl(var(--primary))" strokeWidth={2} name="Impressions" />
                <Line type="monotone" dataKey="clicks" stroke="hsl(var(--success))" strokeWidth={2} name="Clicks" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tier Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Partner Tiers</CardTitle>
            <CardDescription>Distribution by tier</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={tierDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {tierDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {tierDistribution.map((tier) => (
                <div key={tier.name} className="flex items-center gap-1 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tier.color }} />
                  <span>{tier.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Partners Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Strategic Partners</CardTitle>
            <CardDescription>Manage partner visibility and sponsorship rights</CardDescription>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Impressions</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partners.map((partner) => {
                const statusConf = statusConfig[partner.status];
                const StatusIcon = statusConf.icon;
                return (
                  <TableRow key={partner.id}>
                    <TableCell className="font-medium">{partner.name}</TableCell>
                    <TableCell>
                      <Badge className={tierColors[partner.tier]} variant="outline">
                        {partner.tier.charAt(0).toUpperCase() + partner.tier.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConf.variant} className="flex items-center gap-1 w-fit">
                        <StatusIcon className="h-3 w-3" />
                        {statusConf.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch checked={partner.visibility} disabled={partner.status !== "active"} />
                    </TableCell>
                    <TableCell>{partner.impressions.toLocaleString()}</TableCell>
                    <TableCell>{partner.clicks.toLocaleString()}</TableCell>
                    <TableCell>
                      {partner.engagement > 0 ? (
                        <span className={partner.engagement > 5 ? "text-success" : "text-muted-foreground"}>
                          {partner.engagement.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

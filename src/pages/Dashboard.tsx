import { Building2, Users, Calendar, DollarSign, Award, Heart } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const donationData = [
  { month: "Jan", amount: 4000 },
  { month: "Feb", amount: 3000 },
  { month: "Mar", amount: 5000 },
  { month: "Apr", amount: 4500 },
  { month: "May", amount: 6000 },
  { month: "Jun", amount: 5500 },
];

const memberGrowthData = [
  { month: "Jan", members: 120 },
  { month: "Feb", members: 145 },
  { month: "Mar", members: 178 },
  { month: "Apr", members: 210 },
  { month: "May", members: 256 },
  { month: "Jun", members: 289 },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your platform overview.</p>
      </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Organizations"
          value="48"
          change="+12%"
          changeType="increase"
          icon={Building2}
          iconColor="text-primary"
          href="/organizations"
        />
        <StatCard
          title="Total Members"
          value="289"
          change="+18%"
          changeType="increase"
          icon={Users}
          iconColor="text-accent"
          href="/members"
        />
        <StatCard
          title="Active Events"
          value="12"
          change="+5"
          changeType="increase"
          icon={Calendar}
          iconColor="text-info"
          href="/events"
        />
        <StatCard
          title="Donations Received"
          value="$45,230"
          change="+23%"
          changeType="increase"
          icon={DollarSign}
          iconColor="text-success"
          href="/donations"
        />
        <StatCard
          title="Active Sponsorships"
          value="8"
          change="+2"
          changeType="increase"
          icon={Award}
          iconColor="text-warning"
          href="/sponsorships"
        />
        <StatCard
          title="Volunteers Active"
          value="156"
          change="+34"
          changeType="increase"
          icon={Heart}
          iconColor="text-destructive"
          href="/volunteering"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Donation Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={donationData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Member Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={memberGrowthData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar dataKey="members" fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <RecentActivity />
    </div>
  );
};

export default Dashboard;

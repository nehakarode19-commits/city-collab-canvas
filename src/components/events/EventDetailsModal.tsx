import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Search,
  Download,
  Filter
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface EventDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: {
    id: string;
    title: string;
    date: string;
    location: string;
    organization: string;
    attendees: number;
    status: string;
  } | null;
}

interface Attendee {
  id: string;
  name: string;
  email: string;
  company: string;
  status: "completed" | "pending" | "cancelled";
}

export const EventDetailsModal = ({ open, onOpenChange, event }: EventDetailsModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");

  if (!event) return null;

  // Mock data for charts and statistics
  const registrationData = [
    { date: "Aug 10", registrations: 45, checkIns: 0 },
    { date: "Aug 15", registrations: 120, checkIns: 0 },
    { date: "Aug 20", registrations: 280, checkIns: 0 },
    { date: "Aug 24", registrations: 420, checkIns: 350 },
    { date: "Aug 25", registrations: 420, checkIns: 380 },
    { date: "Aug 26", registrations: 420, checkIns: 400 },
    { date: "Aug 27", registrations: 420, checkIns: 415 },
    { date: "Aug 28", registrations: 420, checkIns: 420 },
  ];

  const ticketDistribution = [
    { name: "General", value: 250, color: "hsl(var(--primary))" },
    { name: "Member", value: 120, color: "hsl(var(--secondary))" },
    { name: "VIP", value: 50, color: "hsl(var(--accent))" },
  ];

  const geographicData = [
    { location: "California", count: 180 },
    { location: "New York", count: 120 },
    { location: "Texas", count: 80 },
    { location: "Florida", count: 40 },
  ];

  const mockAttendees: Attendee[] = [
    { id: "1", name: "John Smith", email: "john.smith@company.com", company: "Tech Corp", status: "completed" },
    { id: "2", name: "Sarah Johnson", email: "sarah.j@business.com", company: "Business Inc", status: "completed" },
    { id: "3", name: "Michael Brown", email: "m.brown@startup.io", company: "StartUp IO", status: "pending" },
    { id: "4", name: "Emily Davis", email: "emily.d@enterprise.com", company: "Enterprise Ltd", status: "completed" },
    { id: "5", name: "David Wilson", email: "d.wilson@company.com", company: "Tech Corp", status: "cancelled" },
  ];

  const filteredAttendees = mockAttendees.filter(attendee => {
    const matchesSearch = attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         attendee.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || attendee.status === statusFilter;
    const matchesCompany = companyFilter === "all" || attendee.company === companyFilter;
    return matchesSearch && matchesStatus && matchesCompany;
  });

  const companies = Array.from(new Set(mockAttendees.map(a => a.company)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{event.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">420</div>
                <p className="text-xs text-muted-foreground">+12% from last event</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Checked In</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">420</div>
                <p className="text-xs text-muted-foreground">100% attendance rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,280</div>
                <p className="text-xs text-muted-foreground">+18% from target</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78.4%</div>
                <p className="text-xs text-muted-foreground">Above average</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Badge variant={event.status === "completed" ? "default" : "secondary"} className="text-xs">
                  {event.status}
                </Badge>
                <p className="text-xs text-muted-foreground mt-2">Aug 24-28, 2025</p>
              </CardContent>
            </Card>
          </div>

          {/* Event Info Banner */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{event.location} (Hybrid: Main Hall + Zoom)</span>
                  </div>
                </div>
                <Badge variant="outline">Hybrid Event</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for different sections */}
          <Tabs defaultValue="metrics" className="w-full">
            <TabsList>
              <TabsTrigger value="metrics">Event Metrics</TabsTrigger>
              <TabsTrigger value="demographics">Demographics</TabsTrigger>
              <TabsTrigger value="attendees">Attendees</TabsTrigger>
            </TabsList>

            {/* Event Metrics Tab */}
            <TabsContent value="metrics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Registration Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Registration & Check-In Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={registrationData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="date" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="registrations" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          name="Registrations"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="checkIns" 
                          stroke="hsl(var(--secondary))" 
                          strokeWidth={2}
                          name="Check-ins"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Ticket Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Ticket Type Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={ticketDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="hsl(var(--primary))"
                          dataKey="value"
                        >
                          {ticketDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Revenue Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Revenue by Ticket Type</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ticketDistribution.map((ticket) => (
                    <div key={ticket.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{ticket.name}</span>
                        <span className="text-sm font-bold">
                          ${(ticket.value * (ticket.name === "VIP" ? 150 : ticket.name === "Member" ? 80 : 60)).toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div 
                          className="h-full transition-all"
                          style={{ 
                            width: `${(ticket.value / 420) * 100}%`,
                            backgroundColor: ticket.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Demographics Tab */}
            <TabsContent value="demographics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Geographic Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={geographicData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="location" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="hsl(var(--primary))" name="Attendees" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Top Cities</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { city: "Los Angeles", count: 95 },
                      { city: "New York City", count: 85 },
                      { city: "San Francisco", count: 70 },
                      { city: "Austin", count: 45 },
                    ].map((city) => (
                      <div key={city.city} className="flex items-center justify-between">
                        <span className="text-sm">{city.city}</span>
                        <Badge variant="secondary">{city.count}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Demographic Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average Age</span>
                      <span className="text-sm font-medium">34 years</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">First-time Attendees</span>
                      <span className="text-sm font-medium">62%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Repeat Attendees</span>
                      <span className="text-sm font-medium">38%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">International</span>
                      <span className="text-sm font-medium">8%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Attendees Tab */}
            <TabsContent value="attendees" className="space-y-4">
              {/* Filters */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by name or email..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={companyFilter} onValueChange={setCompanyFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by company" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Companies</SelectItem>
                        {companies.map(company => (
                          <SelectItem key={company} value={company}>{company}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Attendees Table */}
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAttendees.length > 0 ? (
                        filteredAttendees.map((attendee) => (
                          <TableRow key={attendee.id}>
                            <TableCell className="font-medium">{attendee.id}</TableCell>
                            <TableCell>{attendee.name}</TableCell>
                            <TableCell className="text-muted-foreground">{attendee.email}</TableCell>
                            <TableCell>{attendee.company}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusColor(attendee.status)}>
                                {attendee.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground">
                            No attendees found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Pagination Info */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Showing {filteredAttendees.length} of {mockAttendees.length} attendees</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="outline" size="sm" disabled>Next</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

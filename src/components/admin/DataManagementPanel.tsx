import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Database, Download, Clock, User, Shield, 
  LogOut, Activity, Calendar, FileText 
} from "lucide-react";
import { format } from "date-fns";

interface UserActivity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}

interface DeactivationRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  deactivatedAt: string;
  reason: string;
  deactivatedBy: string;
  scheduledDeletion?: string;
}

const mockActivities: UserActivity[] = [
  { id: "1", userId: "u1", userName: "John Doe", action: "login", details: "Logged in from 192.168.1.1", timestamp: "2024-01-15T10:30:00Z" },
  { id: "2", userId: "u2", userName: "Jane Smith", action: "upload", details: "Uploaded SOP: Safety Guidelines v2.0", timestamp: "2024-01-15T10:25:00Z" },
  { id: "3", userId: "u1", userName: "John Doe", action: "role_change", details: "Changed role for user Bob Wilson", timestamp: "2024-01-15T10:20:00Z" },
  { id: "4", userId: "u3", userName: "Alice Johnson", action: "download", details: "Downloaded quarterly report", timestamp: "2024-01-15T10:15:00Z" },
  { id: "5", userId: "u2", userName: "Jane Smith", action: "channel_create", details: "Created channel: Finance Updates", timestamp: "2024-01-15T10:10:00Z" },
  { id: "6", userId: "u4", userName: "Mike Brown", action: "logout", details: "Session ended", timestamp: "2024-01-15T10:05:00Z" },
];

const mockDeactivations: DeactivationRecord[] = [
  { id: "1", userId: "u5", userName: "Tom Harris", userEmail: "tom.harris@city.gov", deactivatedAt: "2024-01-14T09:00:00Z", reason: "Roster sync - not in latest upload", deactivatedBy: "System", scheduledDeletion: "2024-02-14T00:00:00Z" },
  { id: "2", userId: "u6", userName: "Emily Clark", userEmail: "emily.clark@city.gov", deactivatedAt: "2024-01-10T14:30:00Z", reason: "Employment terminated", deactivatedBy: "Admin User", scheduledDeletion: "2024-02-10T00:00:00Z" },
  { id: "3", userId: "u7", userName: "David Lee", userEmail: "david.lee@city.gov", deactivatedAt: "2024-01-05T11:00:00Z", reason: "User request", deactivatedBy: "Admin User" },
  { id: "4", userId: "u8", userName: "Linda Martinez", userEmail: "linda.martinez@city.gov", deactivatedAt: "2023-12-28T16:00:00Z", reason: "Retirement", deactivatedBy: "Admin User" },
];

const actionIcons: Record<string, React.ElementType> = {
  login: LogOut,
  logout: LogOut,
  upload: FileText,
  download: Download,
  role_change: Shield,
  channel_create: Activity,
};

const actionColors: Record<string, string> = {
  login: "text-success",
  logout: "text-muted-foreground",
  upload: "text-primary",
  download: "text-info",
  role_change: "text-warning",
  channel_create: "text-accent",
};

export function DataManagementPanel() {
  const [activities] = useState<UserActivity[]>(mockActivities);
  const [deactivations] = useState<DeactivationRecord[]>(mockDeactivations);
  const [timeRange, setTimeRange] = useState("7d");

  const handleExportActivities = () => {
    const csv = [
      ["User", "Action", "Details", "Timestamp"].join(","),
      ...activities.map(a => [a.userName, a.action, a.details, a.timestamp].join(","))
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "user_activity_log.csv";
    a.click();
  };

  const handleExportDeactivations = () => {
    const csv = [
      ["User", "Email", "Deactivated At", "Reason", "Deactivated By", "Scheduled Deletion"].join(","),
      ...deactivations.map(d => [
        d.userName, d.userEmail, d.deactivatedAt, d.reason, 
        d.deactivatedBy, d.scheduledDeletion || "N/A"
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "deactivation_log.csv";
    a.click();
  };

  return (
    <Tabs defaultValue="activity" className="space-y-6">
      <TabsList>
        <TabsTrigger value="activity" className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          User Activity
        </TabsTrigger>
        <TabsTrigger value="deactivations" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Deactivation Timeline
        </TabsTrigger>
      </TabsList>

      {/* User Activity Tab */}
      <TabsContent value="activity">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Historical User Activity
              </CardTitle>
              <CardDescription>Track user actions and system events</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[150px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleExportActivities}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => {
                  const Icon = actionIcons[activity.action] || Activity;
                  const color = actionColors[activity.action] || "text-muted-foreground";
                  return (
                    <TableRow key={activity.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{activity.userName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                          <Icon className={`h-3 w-3 ${color}`} />
                          {activity.action.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate">
                        {activity.details}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(activity.timestamp), "MMM d, HH:mm:ss")}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Deactivation Timeline Tab */}
      <TabsContent value="deactivations">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Deactivation Timeline
              </CardTitle>
              <CardDescription>Track user deactivations and scheduled deletions</CardDescription>
            </div>
            <Button variant="outline" onClick={handleExportDeactivations}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Deactivated</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>By</TableHead>
                  <TableHead>Scheduled Deletion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deactivations.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.userName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{record.userEmail}</TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(record.deactivatedAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {record.reason}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{record.deactivatedBy}</Badge>
                    </TableCell>
                    <TableCell>
                      {record.scheduledDeletion ? (
                        <span className="text-sm text-destructive">
                          {format(new Date(record.scheduledDeletion), "MMM d, yyyy")}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Not scheduled</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

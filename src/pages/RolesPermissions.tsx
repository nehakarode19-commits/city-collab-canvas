import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Shield, Users as UsersIcon, User, Settings, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RoleMigrationLogs } from "@/components/admin/RoleMigrationLogs";

const roleDescriptions = {
  admin: {
    title: "Administrator",
    description: "Full system access with all permissions. Can manage users, departments, categories, and channels.",
    icon: Shield,
    color: "text-red-500",
  },
  department_manager: {
    title: "Department Manager",
    description: "Manage department-specific resources. Can upload SOPs, create channels, and manage department content.",
    icon: UsersIcon,
    color: "text-blue-500",
  },
  staff: {
    title: "Staff",
    description: "Basic access to view and participate. Can view SOPs and participate in channel discussions.",
    icon: User,
    color: "text-green-500",
  },
};

const permissions = {
  admin: [
    { id: "manage_users", label: "Manage Users", enabled: true },
    { id: "manage_departments", label: "Manage Departments", enabled: true },
    { id: "manage_categories", label: "Manage Categories", enabled: true },
    { id: "manage_channels", label: "Manage Channels", enabled: true },
    { id: "delete_sops", label: "Delete SOPs", enabled: true },
    { id: "view_all_sops", label: "View All SOPs", enabled: true },
  ],
  department_manager: [
    { id: "upload_sops", label: "Upload SOPs", enabled: true },
    { id: "create_channels", label: "Create Department Channels", enabled: true },
    { id: "manage_dept_sops", label: "Manage Department SOPs", enabled: true },
    { id: "update_sops", label: "Update SOPs", enabled: true },
  ],
  staff: [
    { id: "view_sops", label: "View SOPs", enabled: true },
    { id: "participate_channels", label: "Participate in Channels", enabled: true },
    { id: "send_messages", label: "Send Messages", enabled: true },
  ],
};

export default function RolesPermissions() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select(`
        *,
        user_roles(role)
      `)
      .order("full_name");
    setUsers(data || []);
    setLoading(false);
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    await supabase.from("user_roles").delete().eq("user_id", userId);

    const { error } = await supabase.from("user_roles").insert([{
      user_id: userId,
      role: newRole as any,
    }]);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Success", description: "User role updated" });
      fetchUsers();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Roles & Permissions</h1>
        <p className="text-muted-foreground mt-1">
          Manage user roles, assign permissions, and configure access controls across the platform
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview">Roles Overview</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Migration Logs
          </TabsTrigger>
        </TabsList>

        {/* Roles Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(roleDescriptions).map(([key, role]) => {
              const Icon = role.icon;
              return (
                <Card key={key} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-primary/10 ${role.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">{role.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {role.description}
                    </p>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="permissions" className="border-none">
                        <AccordionTrigger className="text-sm py-2">
                          View Permissions
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 pt-2">
                            {permissions[key as keyof typeof permissions].map((perm) => (
                              <div key={perm.id} className="flex items-center gap-2 text-sm">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                <span className="text-muted-foreground">{perm.label}</span>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Permission Control Tab */}
        <TabsContent value="permissions" className="space-y-6">
          {Object.entries(roleDescriptions).map(([key, role]) => {
            const Icon = role.icon;
            return (
              <Card key={key}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-primary/10 ${role.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle>{role.title}</CardTitle>
                      <CardDescription>{role.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {permissions[key as keyof typeof permissions].map((perm) => (
                      <div key={perm.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                        <Label htmlFor={`${key}-${perm.id}`} className="flex-1 cursor-pointer">
                          {perm.label}
                        </Label>
                        <Switch
                          id={`${key}-${perm.id}`}
                          checked={perm.enabled}
                          disabled
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <div className="flex justify-end gap-4">
            <Button variant="outline">Cancel</Button>
            <Button disabled>
              Save Changes
              <span className="ml-2 text-xs opacity-75">(Read-only)</span>
            </Button>
          </div>
        </TabsContent>

        {/* User Management Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>User Role Management</CardTitle>
                  <CardDescription>Assign roles to users and manage their permissions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Current Role</TableHead>
                    <TableHead className="text-right">Assign Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.full_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.user_roles?.[0]?.role ? (
                          <Badge variant="secondary">
                            {roleDescriptions[user.user_roles[0].role as keyof typeof roleDescriptions]?.title || user.user_roles[0].role}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">No role assigned</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Select
                          defaultValue={user.user_roles?.[0]?.role || "staff"}
                          onValueChange={(value) => handleUpdateUserRole(user.id, value)}
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrator</SelectItem>
                            <SelectItem value="department_manager">
                              Department Manager
                            </SelectItem>
                            <SelectItem value="staff">Staff</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Migration Logs Tab */}
        <TabsContent value="logs">
          <RoleMigrationLogs />
        </TabsContent>
      </Tabs>
    </div>
  );
}

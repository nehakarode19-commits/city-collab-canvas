import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, UserX } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface UserBan {
  id: string;
  user_id: string;
  channel_id: string | null;
  banned_by: string | null;
  ban_date: string;
  expires_at: string | null;
  reason: string | null;
  is_global: boolean;
  profiles?: { full_name: string; email: string };
  channels?: { name: string } | null;
  banned_by_profile?: { full_name: string } | null;
}

export function UserBansTab() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    user_id: "",
    channel_id: "",
    reason: "",
    is_global: false,
    expires_at: "",
  });

  const queryClient = useQueryClient();

  // Mock data for demonstration
  const mockBans: UserBan[] = [
    { id: "1", user_id: "u1", channel_id: null, banned_by: "admin1", ban_date: "2024-01-15T10:00:00Z", expires_at: null, reason: "Repeated spam violations", is_global: true, profiles: { full_name: "Tom Wilson", email: "tom.wilson@city.gov" }, channels: null, banned_by_profile: { full_name: "Admin User" } },
    { id: "2", user_id: "u2", channel_id: "ch1", banned_by: "admin1", ban_date: "2024-01-12T14:30:00Z", expires_at: "2024-02-12T14:30:00Z", reason: "Inappropriate content in channel", is_global: false, profiles: { full_name: "Lisa Brown", email: "lisa.brown@city.gov" }, channels: { name: "General Discussion" }, banned_by_profile: { full_name: "Admin User" } },
    { id: "3", user_id: "u3", channel_id: null, banned_by: "admin2", ban_date: "2024-01-10T09:15:00Z", expires_at: "2024-01-17T09:15:00Z", reason: "Harassment of other users", is_global: true, profiles: { full_name: "Mark Davis", email: "mark.davis@city.gov" }, channels: null, banned_by_profile: { full_name: "Jane Manager" } },
    { id: "4", user_id: "u4", channel_id: "ch2", banned_by: "admin1", ban_date: "2024-01-08T16:45:00Z", expires_at: null, reason: "Sharing confidential information", is_global: false, profiles: { full_name: "Amy Clark", email: "amy.clark@city.gov" }, channels: { name: "HR Updates" }, banned_by_profile: { full_name: "Admin User" } },
    { id: "5", user_id: "u5", channel_id: null, banned_by: "admin2", ban_date: "2024-01-05T11:00:00Z", expires_at: "2024-01-12T11:00:00Z", reason: "Multiple policy violations", is_global: true, profiles: { full_name: "Chris Moore", email: "chris.moore@city.gov" }, channels: null, banned_by_profile: { full_name: "Jane Manager" } },
  ];

  const { data: dbBans, isLoading } = useQuery({
    queryKey: ["user-bans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_bans")
        .select(`
          *,
          profiles!user_bans_user_id_fkey(full_name, email),
          channels:channel_id(name),
          banned_by_profile:profiles!user_bans_banned_by_fkey(full_name)
        `)
        .order("ban_date", { ascending: false });
      if (error) throw error;
      return data as unknown as UserBan[];
    },
  });

  const bans = dbBans?.length ? dbBans : mockBans;

  const { data: users } = useQuery({
    queryKey: ["profiles-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .order("full_name");
      if (error) throw error;
      return data;
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
      const { data: user } = await supabase.auth.getUser();
      const { error } = await supabase.from("user_bans").insert({
        user_id: data.user_id,
        channel_id: data.channel_id || null,
        reason: data.reason || null,
        is_global: data.is_global,
        expires_at: data.expires_at || null,
        banned_by: user.user?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-bans"] });
      toast.success("User banned successfully");
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error) => toast.error("Failed to ban user: " + error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("user_bans").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-bans"] });
      toast.success("Ban removed");
    },
    onError: () => toast.error("Failed to remove ban"),
  });

  const resetForm = () => {
    setFormData({
      user_id: "",
      channel_id: "",
      reason: "",
      is_global: false,
      expires_at: "",
    });
  };

  const isActiveBan = (ban: UserBan) => {
    if (!ban.expires_at) return true;
    return new Date(ban.expires_at) > new Date();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>User Bans</CardTitle>
          <CardDescription>Manage global and channel-specific user bans</CardDescription>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ban User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ban User</DialogTitle>
              <DialogDescription>
                Create a new ban for a user globally or in a specific channel
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>User</Label>
                <Select
                  value={formData.user_id}
                  onValueChange={(value) => setFormData({ ...formData, user_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users?.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.full_name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Global Ban</Label>
                  <p className="text-sm text-muted-foreground">Ban from all channels</p>
                </div>
                <Switch
                  checked={formData.is_global}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_global: checked, channel_id: "" })
                  }
                />
              </div>

              {!formData.is_global && (
                <div className="space-y-2">
                  <Label>Channel</Label>
                  <Select
                    value={formData.channel_id}
                    onValueChange={(value) => setFormData({ ...formData, channel_id: value })}
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
              )}

              <div className="space-y-2">
                <Label>Expires At (optional)</Label>
                <Input
                  type="datetime-local"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Reason</Label>
                <Textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Reason for the ban..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => createMutation.mutate(formData)}
                disabled={!formData.user_id || (!formData.is_global && !formData.channel_id)}
              >
                Ban User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : !bans?.length ? (
          <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-2">
            <UserX className="h-8 w-8" />
            <p>No active bans</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Banned By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bans.map((ban) => (
                <TableRow key={ban.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{ban.profiles?.full_name}</p>
                      <p className="text-sm text-muted-foreground">{ban.profiles?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {ban.is_global ? (
                      <Badge variant="destructive">Global</Badge>
                    ) : (
                      <Badge variant="outline">{ban.channels?.name || "Unknown"}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {ban.reason || "—"}
                  </TableCell>
                  <TableCell>{ban.banned_by_profile?.full_name || "System"}</TableCell>
                  <TableCell>
                    <Badge variant={isActiveBan(ban) ? "destructive" : "secondary"}>
                      {isActiveBan(ban) ? "Active" : "Expired"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {ban.expires_at
                      ? format(new Date(ban.expires_at), "MMM d, yyyy HH:mm")
                      : "Never"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(ban.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
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

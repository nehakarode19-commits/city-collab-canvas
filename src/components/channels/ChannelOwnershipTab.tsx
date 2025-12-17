import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Users, Crown } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface ChannelOwnership {
  id: string;
  channel_id: string;
  user_id: string;
  ownership_date: string;
  is_primary: boolean;
  channels?: { name: string };
  profiles?: { full_name: string; email: string };
}

export function ChannelOwnershipTab() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    channel_id: "",
    user_id: "",
    is_primary: false,
  });

  const queryClient = useQueryClient();

  // Mock data for demonstration
  const mockOwnerships: ChannelOwnership[] = [
    { id: "1", channel_id: "ch1", user_id: "u1", ownership_date: "2024-01-10T10:00:00Z", is_primary: true, channels: { name: "General Announcements" }, profiles: { full_name: "John Doe", email: "john.doe@city.gov" } },
    { id: "2", channel_id: "ch2", user_id: "u2", ownership_date: "2024-01-08T14:30:00Z", is_primary: true, channels: { name: "IT Support" }, profiles: { full_name: "Jane Smith", email: "jane.smith@city.gov" } },
    { id: "3", channel_id: "ch3", user_id: "u3", ownership_date: "2024-01-05T09:15:00Z", is_primary: false, channels: { name: "HR Updates" }, profiles: { full_name: "Mike Johnson", email: "mike.johnson@city.gov" } },
    { id: "4", channel_id: "ch4", user_id: "u4", ownership_date: "2024-01-03T16:45:00Z", is_primary: true, channels: { name: "Finance Team" }, profiles: { full_name: "Sarah Wilson", email: "sarah.wilson@city.gov" } },
    { id: "5", channel_id: "ch5", user_id: "u5", ownership_date: "2024-01-01T11:00:00Z", is_primary: true, channels: { name: "Public Works" }, profiles: { full_name: "David Brown", email: "david.brown@city.gov" } },
    { id: "6", channel_id: "ch1", user_id: "u6", ownership_date: "2023-12-28T08:30:00Z", is_primary: false, channels: { name: "General Announcements" }, profiles: { full_name: "Emily Davis", email: "emily.davis@city.gov" } },
  ];

  const { data: dbOwnerships, isLoading } = useQuery({
    queryKey: ["channel-ownership"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("channel_ownership")
        .select(`
          *,
          channels:channel_id(name),
          profiles:user_id(full_name, email)
        `)
        .order("ownership_date", { ascending: false });
      if (error) throw error;
      return data as ChannelOwnership[];
    },
  });

  const ownerships = dbOwnerships?.length ? dbOwnerships : mockOwnerships;

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

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("channel_ownership").insert({
        channel_id: data.channel_id,
        user_id: data.user_id,
        is_primary: data.is_primary,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channel-ownership"] });
      toast.success("Ownership assigned");
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error) => toast.error("Failed to assign ownership: " + error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("channel_ownership").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channel-ownership"] });
      toast.success("Ownership removed");
    },
    onError: () => toast.error("Failed to remove ownership"),
  });

  const togglePrimaryMutation = useMutation({
    mutationFn: async ({ id, is_primary }: { id: string; is_primary: boolean }) => {
      const { error } = await supabase
        .from("channel_ownership")
        .update({ is_primary })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channel-ownership"] });
      toast.success("Ownership updated");
    },
    onError: () => toast.error("Failed to update ownership"),
  });

  const resetForm = () => {
    setFormData({
      channel_id: "",
      user_id: "",
      is_primary: false,
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Channel Ownership</CardTitle>
          <CardDescription>Assign and manage channel owners</CardDescription>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Assign Owner
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Channel Owner</DialogTitle>
              <DialogDescription>
                Assign a user as owner of a channel
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
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
                  <Label>Primary Owner</Label>
                  <p className="text-sm text-muted-foreground">Mark as the main owner</p>
                </div>
                <Switch
                  checked={formData.is_primary}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_primary: checked })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => createMutation.mutate(formData)}
                disabled={!formData.channel_id || !formData.user_id}
              >
                Assign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : !ownerships?.length ? (
          <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-2">
            <Users className="h-8 w-8" />
            <p>No channel ownership assigned</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Channel</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Primary</TableHead>
                <TableHead>Assigned</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ownerships.map((ownership) => (
                <TableRow key={ownership.id}>
                  <TableCell className="font-medium">{ownership.channels?.name}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{ownership.profiles?.full_name}</p>
                      <p className="text-sm text-muted-foreground">{ownership.profiles?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {ownership.is_primary && <Crown className="h-4 w-4 text-warning" />}
                      <Switch
                        checked={ownership.is_primary}
                        onCheckedChange={(checked) =>
                          togglePrimaryMutation.mutate({ id: ownership.id, is_primary: checked })
                        }
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(ownership.ownership_date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(ownership.id)}
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

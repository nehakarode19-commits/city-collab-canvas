import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, AlertTriangle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

type ViolationType = "spam" | "harassment" | "hate_speech" | "misinformation" | "inappropriate_content" | "other";
type ModerationAction = "warning" | "content_removal" | "temp_ban" | "perm_ban" | "mute";

interface ViolationLog {
  id: string;
  user_id: string;
  content_id: string | null;
  violation_type: ViolationType;
  action_taken: ModerationAction;
  action_by: string | null;
  notes: string | null;
  created_at: string;
  profiles?: { full_name: string; email: string };
  action_by_profile?: { full_name: string } | null;
}

const violationTypeLabels: Record<ViolationType, string> = {
  spam: "Spam",
  harassment: "Harassment",
  hate_speech: "Hate Speech",
  misinformation: "Misinformation",
  inappropriate_content: "Inappropriate Content",
  other: "Other",
};

const actionLabels: Record<ModerationAction, string> = {
  warning: "Warning",
  content_removal: "Content Removal",
  temp_ban: "Temporary Ban",
  perm_ban: "Permanent Ban",
  mute: "Mute",
};

const violationColors: Record<ViolationType, "default" | "secondary" | "destructive" | "outline"> = {
  spam: "secondary",
  harassment: "destructive",
  hate_speech: "destructive",
  misinformation: "outline",
  inappropriate_content: "default",
  other: "outline",
};

export function ViolationLogsTab() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    user_id: "",
    violation_type: "" as ViolationType,
    action_taken: "" as ModerationAction,
    notes: "",
  });

  const queryClient = useQueryClient();

  const { data: violations, isLoading } = useQuery({
    queryKey: ["violation-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("violation_logs")
        .select(`
          *,
          profiles!violation_logs_user_id_fkey(full_name, email),
          action_by_profile:profiles!violation_logs_action_by_fkey(full_name)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as ViolationLog[];
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
      const { data: user } = await supabase.auth.getUser();
      const { error } = await supabase.from("violation_logs").insert({
        user_id: data.user_id,
        violation_type: data.violation_type,
        action_taken: data.action_taken,
        notes: data.notes || null,
        action_by: user.user?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["violation-logs"] });
      toast.success("Violation logged");
      setIsCreateOpen(false);
      resetForm();
    },
    onError: () => toast.error("Failed to log violation"),
  });

  const resetForm = () => {
    setFormData({
      user_id: "",
      violation_type: "" as ViolationType,
      action_taken: "" as ModerationAction,
      notes: "",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Violation Logs</CardTitle>
          <CardDescription>Track Code of Conduct violations and actions taken</CardDescription>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Log Violation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Violation</DialogTitle>
              <DialogDescription>
                Record a Code of Conduct violation and action taken
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

              <div className="space-y-2">
                <Label>Violation Type</Label>
                <Select
                  value={formData.violation_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, violation_type: value as ViolationType })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(violationTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Action Taken</Label>
                <Select
                  value={formData.action_taken}
                  onValueChange={(value) =>
                    setFormData({ ...formData, action_taken: value as ModerationAction })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(actionLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional details about the violation..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => createMutation.mutate(formData)}
                disabled={!formData.user_id || !formData.violation_type || !formData.action_taken}
              >
                Log Violation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : !violations?.length ? (
          <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-2">
            <AlertTriangle className="h-8 w-8" />
            <p>No violations logged</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Violation Type</TableHead>
                <TableHead>Action Taken</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Action By</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {violations.map((violation) => (
                <TableRow key={violation.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{violation.profiles?.full_name}</p>
                      <p className="text-sm text-muted-foreground">{violation.profiles?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={violationColors[violation.violation_type]}>
                      {violationTypeLabels[violation.violation_type]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{actionLabels[violation.action_taken]}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {violation.notes || "—"}
                  </TableCell>
                  <TableCell>{violation.action_by_profile?.full_name || "System"}</TableCell>
                  <TableCell>
                    {format(new Date(violation.created_at), "MMM d, yyyy HH:mm")}
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

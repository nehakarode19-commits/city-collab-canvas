import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserCog, Eye, Bell, Award, CheckCircle2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

type ProfileVisibility = "public" | "members_only" | "private";

interface UserPreference {
  id: string;
  user_id: string;
  profile_visibility: ProfileVisibility;
  sponsor_posting_enabled: boolean;
  disclaimer_accepted: boolean;
  disclaimer_accepted_at: string | null;
  email_notifications: boolean;
}

export default function UserPreferences() {
  const [preferences, setPreferences] = useState<Partial<UserPreference>>({
    profile_visibility: "public",
    sponsor_posting_enabled: false,
    email_notifications: true,
  });

  const queryClient = useQueryClient();

  const { data: userPrefs, isLoading } = useQuery({
    queryKey: ["user-preferences"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return null;

      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.user.id)
        .maybeSingle();

      if (error) throw error;
      return data as UserPreference | null;
    },
  });

  const { data: activeDisclaimers } = useQuery({
    queryKey: ["active-disclaimers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("legal_disclaimers")
        .select("*")
        .eq("is_active", true)
        .eq("requires_acceptance", true);
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (userPrefs) {
      setPreferences(userPrefs);
    }
  }, [userPrefs]);

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<UserPreference>) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      if (userPrefs) {
        const { error } = await supabase
          .from("user_preferences")
          .update(data)
          .eq("user_id", user.user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("user_preferences").insert({
          ...data,
          user_id: user.user.id,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-preferences"] });
      toast.success("Preferences saved");
    },
    onError: () => toast.error("Failed to save preferences"),
  });

  const acceptDisclaimerMutation = useMutation({
    mutationFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const updateData = {
        disclaimer_accepted: true,
        disclaimer_accepted_at: new Date().toISOString(),
      };

      if (userPrefs) {
        const { error } = await supabase
          .from("user_preferences")
          .update(updateData)
          .eq("user_id", user.user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("user_preferences").insert({
          ...updateData,
          user_id: user.user.id,
          profile_visibility: "public",
          sponsor_posting_enabled: false,
          email_notifications: true,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-preferences"] });
      toast.success("Disclaimer accepted");
    },
    onError: () => toast.error("Failed to accept disclaimer"),
  });

  const handleSave = () => {
    saveMutation.mutate(preferences);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <UserCog className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Preferences</h1>
          <p className="text-muted-foreground">Manage your visibility and notification settings</p>
        </div>
      </div>

      {/* Disclaimer Acceptance */}
      {activeDisclaimers && activeDisclaimers.length > 0 && !userPrefs?.disclaimer_accepted && (
        <Card className="border-warning">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <CheckCircle2 className="h-5 w-5" />
              Code of Conduct Acceptance Required
            </CardTitle>
            <CardDescription>
              You must accept the following agreements to continue using the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeDisclaimers.map((disclaimer) => (
              <div key={disclaimer.id} className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">{disclaimer.title}</h4>
                <pre className="whitespace-pre-wrap text-sm text-muted-foreground max-h-40 overflow-y-auto">
                  {disclaimer.content}
                </pre>
              </div>
            ))}
            <Button onClick={() => acceptDisclaimerMutation.mutate()} className="w-full">
              I Accept the Code of Conduct
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer Accepted Status */}
      {userPrefs?.disclaimer_accepted && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <div>
                <p className="font-medium">Code of Conduct Accepted</p>
                {userPrefs.disclaimer_accepted_at && (
                  <p className="text-sm text-muted-foreground">
                    Accepted on {format(new Date(userPrefs.disclaimer_accepted_at), "MMMM d, yyyy")}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Visibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Profile Visibility
            </CardTitle>
            <CardDescription>Control who can see your profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Visibility Setting</Label>
              <Select
                value={preferences.profile_visibility}
                onValueChange={(value: ProfileVisibility) =>
                  setPreferences({ ...preferences, profile_visibility: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <Badge variant="default">Public</Badge>
                      <span className="text-sm">Anyone can view</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="members_only">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Members Only</Badge>
                      <span className="text-sm">Only logged-in users</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Private</Badge>
                      <span className="text-sm">Only you can view</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Manage your email notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch
                checked={preferences.email_notifications}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, email_notifications: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Sponsor Posting */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Sponsor Settings
            </CardTitle>
            <CardDescription>Configure sponsor-related features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Sponsor Posting</Label>
                <p className="text-sm text-muted-foreground">
                  Allow sponsors to post content on your behalf
                </p>
              </div>
              <Switch
                checked={preferences.sponsor_posting_enabled}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, sponsor_posting_enabled: checked })
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saveMutation.isPending}>
          {saveMutation.isPending ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
}

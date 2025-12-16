import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Copy, RefreshCw, Save, Settings as SettingsIcon } from "lucide-react";
import { z } from "zod";

// Validation schema
const membershipSettingsSchema = z.object({
  membershipType: z.string().min(1, { message: "Membership type is required" }),
  expiresInDays: z.number()
    .int({ message: "Must be a whole number" })
    .positive({ message: "Must be greater than 0" })
    .max(365, { message: "Cannot exceed 365 days" }),
  maxUses: z.number()
    .int({ message: "Must be a whole number" })
    .positive({ message: "Must be greater than 0" })
    .max(1000, { message: "Cannot exceed 1000 uses" }),
});

type MembershipSettings = z.infer<typeof membershipSettingsSchema>;

const Settings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [regenerateDialogOpen, setRegenerateDialogOpen] = useState(false);
  
  const [settings, setSettings] = useState<MembershipSettings>({
    membershipType: "",
    expiresInDays: 30,
    maxUses: 50,
  });

  const [inviteUrl, setInviteUrl] = useState(
    "https://citycollab.app/invite/abc123xyz456"
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof MembershipSettings, value: string | number) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const validateSettings = (): boolean => {
    try {
      membershipSettingsSchema.parse(settings);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      toast({
        title: "Link copied successfully",
        description: "The invite link has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try copying the link manually.",
        variant: "destructive",
      });
    }
  };

  const handleRegenerateLink = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Generate new random invite code
    const newCode = Math.random().toString(36).substring(2, 15) + 
                    Math.random().toString(36).substring(2, 15);
    const newUrl = `https://citycollab.app/invite/${newCode}`;
    
    setInviteUrl(newUrl);
    setRegenerateDialogOpen(false);
    setLoading(false);
    
    toast({
      title: "New invite link generated",
      description: "The old invite link has been invalidated.",
    });
  };

  const handleSaveSettings = async () => {
    if (!validateSettings()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before saving.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setLoading(false);
    
    toast({
      title: "Membership Settings Updated Successfully",
      description: "All changes have been saved.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage membership types and invite links
          </p>
        </div>
        <SettingsIcon className="h-8 w-8 text-muted-foreground" />
      </div>

      {/* Membership Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Membership Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Membership Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="membership-type">
              Membership Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={settings.membershipType}
              onValueChange={(value) => handleInputChange("membershipType", value)}
            >
              <SelectTrigger id="membership-type">
                <SelectValue placeholder="Select membership type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic Member</SelectItem>
                <SelectItem value="premium">Premium Member</SelectItem>
                <SelectItem value="volunteer">Volunteer</SelectItem>
                <SelectItem value="sponsor">Sponsor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            {errors.membershipType && (
              <p className="text-sm text-destructive">{errors.membershipType}</p>
            )}
          </div>

          {/* Invite Link Management */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold">Invite Link Management</h3>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Expires In Days */}
              <div className="space-y-2">
                <Label htmlFor="expires-days">
                  Expires (days) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="expires-days"
                  type="number"
                  min="1"
                  max="365"
                  value={settings.expiresInDays}
                  onChange={(e) =>
                    handleInputChange("expiresInDays", parseInt(e.target.value) || 0)
                  }
                  placeholder="Enter number of days"
                />
                {errors.expiresInDays && (
                  <p className="text-sm text-destructive">{errors.expiresInDays}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Maximum: 365 days
                </p>
              </div>

              {/* Max Uses */}
              <div className="space-y-2">
                <Label htmlFor="max-uses">
                  Max Uses <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={settings.maxUses.toString()}
                  onValueChange={(value) =>
                    handleInputChange("maxUses", parseInt(value))
                  }
                >
                  <SelectTrigger id="max-uses">
                    <SelectValue placeholder="Select max uses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 uses</SelectItem>
                    <SelectItem value="50">50 uses</SelectItem>
                    <SelectItem value="100">100 uses</SelectItem>
                    <SelectItem value="500">500 uses</SelectItem>
                    <SelectItem value="1000">1000 uses</SelectItem>
                  </SelectContent>
                </Select>
                {errors.maxUses && (
                  <p className="text-sm text-destructive">{errors.maxUses}</p>
                )}
              </div>
            </div>

            {/* Current Invite URL */}
            <div className="space-y-2">
              <Label htmlFor="invite-url">Current Invite URL</Label>
              <div className="flex gap-2">
                <Input
                  id="invite-url"
                  value={inviteUrl}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                  title="Copy link"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setRegenerateDialogOpen(true)}
                  disabled={loading}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate
                </Button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button
              onClick={handleSaveSettings}
              disabled={loading}
              size="lg"
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Saving..." : "Save Setting"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Regenerate Confirmation Dialog */}
      <AlertDialog open={regenerateDialogOpen} onOpenChange={setRegenerateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Regenerate Invite Link?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to regenerate the invite link? The old link will
              stop working immediately and cannot be recovered.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading} className="active:bg-destructive active:text-destructive-foreground">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRegenerateLink}
              disabled={loading}
            >
              {loading ? "Regenerating..." : "Regenerate Link"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;

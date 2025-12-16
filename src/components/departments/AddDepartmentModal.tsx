import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Upload, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface AddDepartmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddDepartmentModal({ open, onOpenChange }: AddDepartmentModalProps) {
  const [departmentData, setDepartmentData] = useState({
    name: "",
    email: "",
    phone: "",
    head: "",
    website: "",
    address: "",
    mission: "",
    sops: [] as File[],
  });

  const [zulipStatus, setZulipStatus] = useState<"pending" | "created" | "failed">("pending");
  
  const [permissions, setPermissions] = useState({
    accessChannels: false,
    accessDocuments: false,
    manageSOPs: false,
    crossCityCollaboration: false,
    adminAccess: false,
  });

  const handleInputChange = (field: string, value: string) => {
    setDepartmentData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setDepartmentData((prev) => ({
        ...prev,
        sops: [...prev.sops, ...filesArray],
      }));
      toast.success(`${filesArray.length} file(s) uploaded successfully`);
    }
  };

  const handlePermissionChange = (permission: keyof typeof permissions, checked: boolean) => {
    setPermissions((prev) => ({ ...prev, [permission]: checked }));
  };

  const handleSubmit = () => {
    if (!departmentData.name || !departmentData.email || !departmentData.phone || !departmentData.head || !departmentData.mission) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Simulate Zulip room creation
    setTimeout(() => {
      setZulipStatus("created");
      toast.success("Department created successfully", {
        description: "Zulip room has been auto-created and permissions have been assigned.",
      });
    }, 1500);

    console.log("Department Data:", departmentData);
    console.log("Permissions:", permissions);
  };

  const handleCancel = () => {
    setDepartmentData({
      name: "",
      email: "",
      phone: "",
      head: "",
      website: "",
      address: "",
      mission: "",
      sops: [],
    });
    setPermissions({
      accessChannels: false,
      accessDocuments: false,
      manageSOPs: false,
      crossCityCollaboration: false,
      adminAccess: false,
    });
    setZulipStatus("pending");
    onOpenChange(false);
  };

  const getZulipStatusIcon = () => {
    switch (zulipStatus) {
      case "created":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add / Edit Department</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Configure department details, Zulip integration, and permissions.
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Department Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Department Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Department Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={departmentData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Public Works"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Department Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={departmentData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="department@city.gov"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Department Phone <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={departmentData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="head">
                  Department Head <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={departmentData.head}
                  onValueChange={(value) => handleInputChange("head", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department head" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john-smith">John Smith</SelectItem>
                    <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="michael-davis">Michael Davis</SelectItem>
                    <SelectItem value="emily-brown">Emily Brown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Department Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={departmentData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="https://example.city.gov/department"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Department Address</Label>
                <Input
                  id="address"
                  value={departmentData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="123 Main St, City Hall"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="mission">
                  Department Mission/Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="mission"
                  value={departmentData.mission}
                  onChange={(e) => handleInputChange("mission", e.target.value)}
                  placeholder="Describe the department's mission, goals, and responsibilities..."
                  rows={4}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="sops">Department-specific SOPs</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="sops"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("sops")?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload SOPs
                  </Button>
                </div>
                {departmentData.sops.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {departmentData.sops.map((file, index) => (
                      <Badge key={index} variant="secondary" className="mr-2">
                        {file.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Zulip Integration & Permissions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Zulip Integration & Permissions</h3>
            
            <div className="space-y-4">
              {/* Zulip Status */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  {getZulipStatusIcon()}
                  <div>
                    <p className="font-medium">Auto-created Zulip Room</p>
                    <p className="text-sm text-muted-foreground">
                      {zulipStatus === "created" && "Room successfully created"}
                      {zulipStatus === "pending" && "Room will be created upon saving"}
                      {zulipStatus === "failed" && "Room creation failed"}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    zulipStatus === "created"
                      ? "default"
                      : zulipStatus === "failed"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {zulipStatus}
                </Badge>
              </div>

              <Separator />

              {/* Permissions */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Department Permissions</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Permissions will be automatically linked to the Zulip room once created.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="accessChannels"
                      checked={permissions.accessChannels}
                      onCheckedChange={(checked) =>
                        handlePermissionChange("accessChannels", checked as boolean)
                      }
                    />
                    <Label htmlFor="accessChannels" className="cursor-pointer font-normal">
                      Access to Collaboration Channels
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="accessDocuments"
                      checked={permissions.accessDocuments}
                      onCheckedChange={(checked) =>
                        handlePermissionChange("accessDocuments", checked as boolean)
                      }
                    />
                    <Label htmlFor="accessDocuments" className="cursor-pointer font-normal">
                      Access to Department Documents & SOPs
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="manageSOPs"
                      checked={permissions.manageSOPs}
                      onCheckedChange={(checked) =>
                        handlePermissionChange("manageSOPs", checked as boolean)
                      }
                    />
                    <Label htmlFor="manageSOPs" className="cursor-pointer font-normal">
                      Manage and Upload SOPs
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="crossCityCollaboration"
                      checked={permissions.crossCityCollaboration}
                      onCheckedChange={(checked) =>
                        handlePermissionChange("crossCityCollaboration", checked as boolean)
                      }
                    />
                    <Label htmlFor="crossCityCollaboration" className="cursor-pointer font-normal">
                      Enable Cross-City Collaboration
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="adminAccess"
                      checked={permissions.adminAccess}
                      onCheckedChange={(checked) =>
                        handlePermissionChange("adminAccess", checked as boolean)
                      }
                    />
                    <Label htmlFor="adminAccess" className="cursor-pointer font-normal">
                      Department Admin Access
                    </Label>
                  </div>
                </div>
              </div>

              {/* Cross-City Collaboration Info */}
              {permissions.crossCityCollaboration && (
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <h4 className="font-semibold text-sm mb-1">Cross-City Collaboration Enabled</h4>
                  <p className="text-sm text-muted-foreground">
                    This department can now connect and collaborate with similar departments from other cities
                    via dedicated Zulip rooms and shared channels.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Save Department
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

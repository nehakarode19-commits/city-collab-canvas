import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface EditSessionDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: any;
}

export function EditSessionDrawer({ open, onOpenChange, session }: EditSessionDrawerProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    maxSponsors: "1",
    package: "",
    sponsorable: false,
    benefits: "",
    visibility: "public",
  });

  useEffect(() => {
    if (session) {
      setFormData({
        title: session.title || "",
        price: session.price?.toString() || "",
        maxSponsors: "1",
        package: session.package || "",
        sponsorable: session.sponsorable || false,
        benefits: "",
        visibility: "public",
      });
    }
  }, [session]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Session Updated",
      description: "Sponsorship details have been saved successfully.",
    });
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Session Sponsorship</DrawerTitle>
          <DrawerDescription>
            Modify sponsorship details for this session
          </DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="px-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Session Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="sponsorable"
              checked={formData.sponsorable}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, sponsorable: checked })
              }
            />
            <Label htmlFor="sponsorable">Enable Sponsorship</Label>
          </div>

          {formData.sponsorable && (
            <>
              <div className="space-y-2">
                <Label htmlFor="package">Sponsorship Package *</Label>
                <Select
                  value={formData.package}
                  onValueChange={(value) => setFormData({ ...formData, package: value })}
                >
                  <SelectTrigger className={!formData.package ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select package" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Platinum">Platinum</SelectItem>
                    <SelectItem value="Gold">Gold</SelectItem>
                    <SelectItem value="Silver">Silver</SelectItem>
                  </SelectContent>
                </Select>
                {!formData.package && (
                  <p className="text-sm text-destructive">Package is required when sponsorship is enabled</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required={formData.sponsorable}
                  className={formData.sponsorable && !formData.price ? "border-destructive" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxSponsors">Max Sponsors</Label>
                <Input
                  id="maxSponsors"
                  type="number"
                  min="1"
                  value={formData.maxSponsors}
                  onChange={(e) => setFormData({ ...formData, maxSponsors: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits">Sponsor Benefits</Label>
                <Textarea
                  id="benefits"
                  placeholder="List benefits for sponsors..."
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="visibility">Visibility</Label>
                <Select
                  value={formData.visibility}
                  onValueChange={(value) => setFormData({ ...formData, visibility: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <DrawerFooter>
            <Button type="submit">Save Changes</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}

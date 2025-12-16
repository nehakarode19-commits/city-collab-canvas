import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useToast } from "@/hooks/use-toast";

interface AssignSponsorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: any;
  assetType: string;
}

export function AssignSponsorModal({
  open,
  onOpenChange,
  asset,
  assetType,
}: AssignSponsorModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    sponsorOrg: "",
    contactName: "",
    contactEmail: "",
    amount: "",
    package: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.sponsorOrg || !formData.amount || !formData.package) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sponsor Assigned",
      description: `Successfully assigned sponsor to ${assetType}`,
    });
    
    setFormData({
      sponsorOrg: "",
      contactName: "",
      contactEmail: "",
      amount: "",
      package: "",
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Sponsor</DialogTitle>
          <DialogDescription>
            Assign a sponsor to {asset?.title || asset?.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sponsorOrg">Sponsor Organization *</Label>
            <Input
              id="sponsorOrg"
              placeholder="Enter organization name"
              value={formData.sponsorOrg}
              onChange={(e) => setFormData({ ...formData, sponsorOrg: e.target.value })}
              required
              className={!formData.sponsorOrg ? "border-destructive" : ""}
            />
            {!formData.sponsorOrg && (
              <p className="text-sm text-destructive">Organization name is required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactName">Contact Name</Label>
            <Input
              id="contactName"
              placeholder="Primary contact person"
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              placeholder="contact@organization.com"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
            />
          </div>

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
                <SelectItem value="Bronze">Bronze</SelectItem>
              </SelectContent>
            </Select>
            {!formData.package && (
              <p className="text-sm text-destructive">Package selection is required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Sponsorship Amount ($) *</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              className={!formData.amount ? "border-destructive" : ""}
            />
            {!formData.amount && (
              <p className="text-sm text-destructive">Amount is required</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Assign Sponsor</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

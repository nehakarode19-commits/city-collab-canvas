import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface EditDonationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  donationId: number | null;
}

export function EditDonationModal({ open, onOpenChange, donationId }: EditDonationModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Changes Saved",
      description: "The donation campaign has been updated successfully.",
    });
    
    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Donation Campaign</DialogTitle>
          <DialogDescription>
            Update the details of this donation campaign.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Campaign Title *</Label>
              <Input
                id="edit-title"
                placeholder="e.g., Community Food Bank"
                defaultValue="Pinjrapole"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category *</Label>
              <Select defaultValue="animal">
                <SelectTrigger id="edit-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="animal">Animal Welfare</SelectItem>
                  <SelectItem value="social">Social Welfare</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-subcategory">Subcategory *</Label>
              <Select defaultValue="item">
                <SelectTrigger id="edit-subcategory">
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monetary">Monetary Donation</SelectItem>
                  <SelectItem value="item">Item Donation</SelectItem>
                  <SelectItem value="scholarship">Scholarship</SelectItem>
                  <SelectItem value="supplies">Medical Supplies</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-required">Required Amount ($) *</Label>
              <Input
                id="edit-required"
                type="number"
                defaultValue="20000"
                min="0"
                step="100"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-collected">Already Collected ($)</Label>
              <Input
                id="edit-collected"
                type="number"
                defaultValue="10000"
                min="0"
                step="100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-event">Associated Event</Label>
              <Select>
                <SelectTrigger id="edit-event">
                  <SelectValue placeholder="Select event (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="charity">Charity Gala</SelectItem>
                  <SelectItem value="fundraiser">Fundraiser 2024</SelectItem>
                  <SelectItem value="marathon">Marathon Event</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description *</Label>
            <Textarea
              id="edit-description"
              defaultValue="Support our animal welfare initiative with essential supplies and care items."
              rows={4}
              required
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

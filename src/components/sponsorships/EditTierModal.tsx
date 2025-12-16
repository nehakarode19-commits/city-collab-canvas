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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, X } from "lucide-react";

interface EditTierModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tierId: number | null;
}

export function EditTierModal({ open, onOpenChange, tierId }: EditTierModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [benefits, setBenefits] = useState([
    "Premium booth location",
    "Logo on all marketing materials",
    "Speaking opportunity",
  ]);

  const handleAddBenefit = () => {
    setBenefits([...benefits, ""]);
  };

  const handleRemoveBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...benefits];
    newBenefits[index] = value;
    setBenefits(newBenefits);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Tier Updated",
      description: "The sponsorship tier has been updated successfully.",
    });
    
    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Sponsorship Tier</DialogTitle>
          <DialogDescription>
            Update the tier details, pricing, and benefits.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tier-name">Tier Name *</Label>
              <Input
                id="tier-name"
                placeholder="e.g., Platinum"
                defaultValue="Platinum"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tier-price">Price ($) *</Label>
              <Input
                id="tier-price"
                type="number"
                placeholder="50000"
                defaultValue="50000"
                min="0"
                step="100"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tier-description">Description</Label>
            <Textarea
              id="tier-description"
              placeholder="Describe this tier level..."
              rows={2}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Benefits *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddBenefit}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Benefit
              </Button>
            </div>
            <div className="space-y-2">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={benefit}
                    onChange={(e) => handleBenefitChange(index, e.target.value)}
                    placeholder={`Benefit ${index + 1}`}
                    required
                  />
                  {benefits.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveBenefit(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
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

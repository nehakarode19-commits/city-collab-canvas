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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

interface LogBenefitsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogBenefitsModal({ open, onOpenChange }: LogBenefitsModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState<Date>();

  const benefits = [
    { id: "booth", label: "Premium booth location assigned" },
    { id: "marketing", label: "Logo added to marketing materials" },
    { id: "speaking", label: "Speaking slot confirmed" },
    { id: "tickets", label: "VIP tickets delivered" },
    { id: "social", label: "Social media posts published" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Benefits Logged",
      description: "Sponsor benefits have been recorded successfully.",
    });
    
    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log Sponsor Benefits</DialogTitle>
          <DialogDescription>
            Record the delivery of benefits to sponsors.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sponsor-select">Select Sponsor *</Label>
            <Select required>
              <SelectTrigger id="sponsor-select">
                <SelectValue placeholder="Choose sponsor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="techcorp">Tech Corp - Platinum</SelectItem>
                <SelectItem value="innovation">Innovation Inc - Gold</SelectItem>
                <SelectItem value="global">Global Solutions - Silver</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Benefits Delivered *</Label>
            <div className="space-y-3 rounded-lg border p-4">
              {benefits.map((benefit) => (
                <div key={benefit.id} className="flex items-center space-x-2">
                  <Checkbox id={benefit.id} />
                  <label
                    htmlFor={benefit.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {benefit.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Delivery Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !deliveryDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deliveryDate ? (
                    format(deliveryDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={deliveryDate}
                  onSelect={setDeliveryDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional details about benefit delivery..."
              rows={3}
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
              {loading ? "Logging..." : "Log Benefits"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

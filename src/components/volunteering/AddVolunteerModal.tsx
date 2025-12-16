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

interface AddVolunteerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddVolunteerModal({ open, onOpenChange }: AddVolunteerModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Volunteer Added",
      description: "The volunteer has been successfully registered.",
    });

    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Volunteer</DialogTitle>
          <DialogDescription>
            Register or assign a new volunteer to an event category.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="volunteer-name">Volunteer Name *</Label>
              <Input
                id="volunteer-name"
                placeholder="e.g., John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact *</Label>
              <Input
                id="contact"
                type="email"
                placeholder="volunteer@email.com"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event">Event *</Label>
              <Select required>
                <SelectTrigger id="event">
                  <SelectValue placeholder="Select event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="festival">Festival of Lights Celebration</SelectItem>
                  <SelectItem value="gala">Annual Charity Gala</SelectItem>
                  <SelectItem value="marathon">Community Marathon</SelectItem>
                  <SelectItem value="workshop">Youth Workshop Series</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="registration">Registration Desk</SelectItem>
                  <SelectItem value="usher">Usher</SelectItem>
                  <SelectItem value="av">AV Support</SelectItem>
                  <SelectItem value="food">Food Services</SelectItem>
                  <SelectItem value="cleanup">Cleanup Crew</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="slot-timing">Slot Timing *</Label>
              <Select required>
                <SelectTrigger id="slot-timing">
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">8:00 AM - 10:00 AM</SelectItem>
                  <SelectItem value="midday">10:00 AM - 2:00 PM</SelectItem>
                  <SelectItem value="afternoon">2:00 PM - 5:00 PM</SelectItem>
                  <SelectItem value="evening">5:00 PM - 8:00 PM</SelectItem>
                  <SelectItem value="fullday">9:00 AM - 5:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Previous Experience</Label>
            <Select>
              <SelectTrigger id="experience">
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="first">First Time Volunteer</SelectItem>
                <SelectItem value="some">Some Experience</SelectItem>
                <SelectItem value="experienced">Experienced Volunteer</SelectItem>
                <SelectItem value="expert">Expert/Leadership</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="active:bg-destructive active:text-destructive-foreground"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Volunteer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

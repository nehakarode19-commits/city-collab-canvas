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

interface CreateDonationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  category: string;
  title: string;
  amount: string;
  description: string;
}

interface FormErrors {
  category?: string;
  title?: string;
  amount?: string;
  description?: string;
}

export function CreateDonationModal({ open, onOpenChange }: CreateDonationModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    category: "",
    title: "",
    amount: "",
    description: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setFormData({
        category: "",
        title: "",
        amount: "",
        description: "",
      });
      setErrors({});
      setTouched({});
    }
  }, [open]);

  // Validate field
  const validateField = (name: keyof FormData, value: string): string | undefined => {
    switch (name) {
      case "category":
        if (!value) return "Please select a donation category";
        break;
      case "title":
        if (!value.trim()) return "Donation title is required";
        break;
      case "amount":
        if (!value) return "Donation amount is required";
        if (parseFloat(value) <= 0) return "Amount must be a positive number";
        break;
      case "description":
        if (value.length > 500) return "Description must not exceed 500 characters";
        break;
    }
    return undefined;
  };

  // Handle field change
  const handleFieldChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  // Handle field blur
  const handleFieldBlur = (name: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      formData.category &&
      formData.title.trim() &&
      formData.amount &&
      parseFloat(formData.amount) > 0 &&
      formData.description.length <= 500 &&
      Object.values(errors).every((error) => !error)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: FormErrors = {};
    (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({
        category: true,
        title: true,
        amount: true,
        description: true,
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Campaign Created",
      description: "The donation campaign has been created successfully.",
    });
    
    setLoading(false);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setFormData({
      category: "",
      title: "",
      amount: "",
      description: "",
    });
    setErrors({});
    setTouched({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Create Donation Campaign
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Fill in the details below to create a new donation campaign.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Donation Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-foreground">
                Donation Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleFieldChange("category", value)}
              >
                <SelectTrigger
                  id="category"
                  className={`bg-background border-input ${
                    errors.category && touched.category ? "border-destructive" : ""
                  }`}
                  onBlur={() => handleFieldBlur("category")}
                >
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border z-50">
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                  <SelectItem value="social">Social Welfare</SelectItem>
                  <SelectItem value="animal">Animal Welfare</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && touched.category && (
                <p className="text-sm text-destructive">{errors.category}</p>
              )}
            </div>

            {/* Donation Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-foreground">
                Donation Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter campaign title"
                value={formData.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                onBlur={() => handleFieldBlur("title")}
                className={`bg-background border-input text-foreground ${
                  errors.title && touched.title ? "border-destructive" : ""
                }`}
              />
              {errors.title && touched.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            {/* Donation Amount Needed */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-foreground">
                Donation Amount Needed <span className="text-destructive">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleFieldChange("amount", e.target.value)}
                onBlur={() => handleFieldBlur("amount")}
                className={`bg-background border-input text-foreground ${
                  errors.amount && touched.amount ? "border-destructive" : ""
                }`}
              />
              {errors.amount && touched.amount && (
                <p className="text-sm text-destructive">{errors.amount}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter campaign description here"
                value={formData.description}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                onBlur={() => handleFieldBlur("description")}
                maxLength={500}
                className={`bg-background border-input text-foreground min-h-[80px] ${
                  errors.description && touched.description ? "border-destructive" : ""
                }`}
              />
              <div className="flex justify-between items-center">
                {errors.description && touched.description ? (
                  <p className="text-sm text-destructive">{errors.description}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {formData.description.length}/500 characters
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
              className="bg-muted text-foreground hover:bg-muted/80 active:bg-destructive active:text-destructive-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid() || loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

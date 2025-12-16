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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface CreateDonationRecordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface IndividualFormData {
  fullName: string;
  email: string;
  amount: string;
  campaign: string;
  source: string;
  dateReceived: Date | undefined;
  softCredit: string;
}

interface OrganizationFormData {
  organizationName: string;
  primaryContact: string;
  amount: string;
  campaign: string;
  source: string;
  dateReceived: Date | undefined;
  softCredit: string;
}

interface FormErrors {
  [key: string]: string | undefined;
}

export function CreateDonationRecordModal({
  open,
  onOpenChange,
}: CreateDonationRecordModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("individual");

  const [individualData, setIndividualData] = useState<IndividualFormData>({
    fullName: "",
    email: "",
    amount: "",
    campaign: "",
    source: "",
    dateReceived: undefined,
    softCredit: "",
  });

  const [organizationData, setOrganizationData] = useState<OrganizationFormData>({
    organizationName: "",
    primaryContact: "",
    amount: "",
    campaign: "",
    source: "",
    dateReceived: undefined,
    softCredit: "",
  });

  const [individualErrors, setIndividualErrors] = useState<FormErrors>({});
  const [organizationErrors, setOrganizationErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setIndividualData({
        fullName: "",
        email: "",
        amount: "",
        campaign: "",
        source: "",
        dateReceived: undefined,
        softCredit: "",
      });
      setOrganizationData({
        organizationName: "",
        primaryContact: "",
        amount: "",
        campaign: "",
        source: "",
        dateReceived: undefined,
        softCredit: "",
      });
      setIndividualErrors({});
      setOrganizationErrors({});
      setTouched({});
      setActiveTab("individual");
    }
  }, [open]);

  // Validate individual fields
  const validateIndividualField = (name: keyof IndividualFormData, value: any): string | undefined => {
    switch (name) {
      case "fullName":
        if (!value || !value.trim()) return "Full name is required";
        break;
      case "email":
        if (!value || !value.trim()) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Invalid email format";
        break;
      case "amount":
        if (!value) return "Amount is required";
        if (parseFloat(value) <= 0) return "Amount must be a positive number";
        break;
      case "source":
        if (!value) return "Source is required";
        break;
      case "dateReceived":
        if (!value) return "Date received is required";
        break;
    }
    return undefined;
  };

  // Validate organization fields
  const validateOrganizationField = (name: keyof OrganizationFormData, value: any): string | undefined => {
    switch (name) {
      case "organizationName":
        if (!value || !value.trim()) return "Organization name is required";
        break;
      case "primaryContact":
        if (!value || !value.trim()) return "Primary contact is required";
        break;
      case "amount":
        if (!value) return "Amount is required";
        if (parseFloat(value) <= 0) return "Amount must be a positive number";
        break;
      case "source":
        if (!value) return "Source is required";
        break;
      case "dateReceived":
        if (!value) return "Date received is required";
        break;
    }
    return undefined;
  };

  // Handle individual field change
  const handleIndividualFieldChange = (name: keyof IndividualFormData, value: any) => {
    setIndividualData((prev) => ({ ...prev, [name]: value }));

    if (touched[`individual-${name}`]) {
      const error = validateIndividualField(name, value);
      setIndividualErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  // Handle organization field change
  const handleOrganizationFieldChange = (name: keyof OrganizationFormData, value: any) => {
    setOrganizationData((prev) => ({ ...prev, [name]: value }));

    if (touched[`organization-${name}`]) {
      const error = validateOrganizationField(name, value);
      setOrganizationErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  // Handle field blur
  const handleFieldBlur = (prefix: string, name: string) => {
    setTouched((prev) => ({ ...prev, [`${prefix}-${name}`]: true }));

    if (prefix === "individual") {
      const error = validateIndividualField(name as keyof IndividualFormData, individualData[name as keyof IndividualFormData]);
      setIndividualErrors((prev) => ({ ...prev, [name]: error }));
    } else {
      const error = validateOrganizationField(name as keyof OrganizationFormData, organizationData[name as keyof OrganizationFormData]);
      setOrganizationErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  // Check if individual form is valid
  const isIndividualFormValid = () => {
    return (
      individualData.fullName.trim() &&
      individualData.email.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(individualData.email) &&
      individualData.amount &&
      parseFloat(individualData.amount) > 0 &&
      individualData.source &&
      individualData.dateReceived &&
      Object.values(individualErrors).every((error) => !error)
    );
  };

  // Check if organization form is valid
  const isOrganizationFormValid = () => {
    return (
      organizationData.organizationName.trim() &&
      organizationData.primaryContact.trim() &&
      organizationData.amount &&
      parseFloat(organizationData.amount) > 0 &&
      organizationData.source &&
      organizationData.dateReceived &&
      Object.values(organizationErrors).every((error) => !error)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isIndividual = activeTab === "individual";
    const data = isIndividual ? individualData : organizationData;

    // Validate all fields
    const newErrors: FormErrors = {};
    if (isIndividual) {
      (Object.keys(individualData) as Array<keyof IndividualFormData>).forEach((key) => {
        const error = validateIndividualField(key, individualData[key]);
        if (error) newErrors[key] = error;
      });
    } else {
      (Object.keys(organizationData) as Array<keyof OrganizationFormData>).forEach((key) => {
        const error = validateOrganizationField(key, organizationData[key]);
        if (error) newErrors[key] = error;
      });
    }

    if (Object.keys(newErrors).length > 0) {
      if (isIndividual) {
        setIndividualErrors(newErrors);
      } else {
        setOrganizationErrors(newErrors);
      }
      // Mark all fields as touched
      const touchedFields: Record<string, boolean> = {};
      Object.keys(data).forEach((key) => {
        touchedFields[`${activeTab}-${key}`] = true;
      });
      setTouched(touchedFields);
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Donation Created",
      description: `${isIndividual ? "Individual" : "Organization"} donation record has been created successfully.`,
    });

    setLoading(false);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setIndividualData({
      fullName: "",
      email: "",
      amount: "",
      campaign: "",
      source: "",
      dateReceived: undefined,
      softCredit: "",
    });
    setOrganizationData({
      organizationName: "",
      primaryContact: "",
      amount: "",
      campaign: "",
      source: "",
      dateReceived: undefined,
      softCredit: "",
    });
    setIndividualErrors({});
    setOrganizationErrors({});
    setTouched({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Create Donation
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Record a new donation from an individual or organization.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="individual">Individual</TabsTrigger>
            <TabsTrigger value="organization">Organization</TabsTrigger>
          </TabsList>

          {/* Individual Donation Form */}
          <TabsContent value="individual">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-foreground">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter full name"
                    value={individualData.fullName}
                    onChange={(e) => handleIndividualFieldChange("fullName", e.target.value)}
                    onBlur={() => handleFieldBlur("individual", "fullName")}
                    className={`bg-background border-input text-foreground ${
                      individualErrors.fullName && touched["individual-fullName"] ? "border-destructive" : ""
                    }`}
                  />
                  {individualErrors.fullName && touched["individual-fullName"] && (
                    <p className="text-sm text-destructive">{individualErrors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={individualData.email}
                    onChange={(e) => handleIndividualFieldChange("email", e.target.value)}
                    onBlur={() => handleFieldBlur("individual", "email")}
                    className={`bg-background border-input text-foreground ${
                      individualErrors.email && touched["individual-email"] ? "border-destructive" : ""
                    }`}
                  />
                  {individualErrors.email && touched["individual-email"] && (
                    <p className="text-sm text-destructive">{individualErrors.email}</p>
                  )}
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-foreground">
                    Amount <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                    value={individualData.amount}
                    onChange={(e) => handleIndividualFieldChange("amount", e.target.value)}
                    onBlur={() => handleFieldBlur("individual", "amount")}
                    className={`bg-background border-input text-foreground ${
                      individualErrors.amount && touched["individual-amount"] ? "border-destructive" : ""
                    }`}
                  />
                  {individualErrors.amount && touched["individual-amount"] && (
                    <p className="text-sm text-destructive">{individualErrors.amount}</p>
                  )}
                </div>

                {/* Campaign (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="campaign" className="text-foreground">
                    Campaign (Optional)
                  </Label>
                  <Select
                    value={individualData.campaign}
                    onValueChange={(value) => handleIndividualFieldChange("campaign", value)}
                  >
                    <SelectTrigger id="campaign" className="bg-background border-input">
                      <SelectValue placeholder="Select campaign" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border z-50">
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="food-bank">Community Food Bank</SelectItem>
                      <SelectItem value="education">Education Fund</SelectItem>
                      <SelectItem value="healthcare">Healthcare Drive</SelectItem>
                      <SelectItem value="animal">Pinjrapole</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Source */}
                <div className="space-y-2">
                  <Label htmlFor="source" className="text-foreground">
                    Source <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={individualData.source}
                    onValueChange={(value) => handleIndividualFieldChange("source", value)}
                  >
                    <SelectTrigger
                      id="source"
                      className={`bg-background border-input ${
                        individualErrors.source && touched["individual-source"] ? "border-destructive" : ""
                      }`}
                      onBlur={() => handleFieldBlur("individual", "source")}
                    >
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border z-50">
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="mail">Mail</SelectItem>
                      <SelectItem value="direct">Direct</SelectItem>
                    </SelectContent>
                  </Select>
                  {individualErrors.source && touched["individual-source"] && (
                    <p className="text-sm text-destructive">{individualErrors.source}</p>
                  )}
                </div>

                {/* Date Received */}
                <div className="space-y-2">
                  <Label className="text-foreground">
                    Date Received <span className="text-destructive">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-background border-input",
                          !individualData.dateReceived && "text-muted-foreground",
                          individualErrors.dateReceived && touched["individual-dateReceived"] && "border-destructive"
                        )}
                        onBlur={() => handleFieldBlur("individual", "dateReceived")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {individualData.dateReceived ? (
                          format(individualData.dateReceived, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-background border-border z-50" align="start">
                      <Calendar
                        mode="single"
                        selected={individualData.dateReceived}
                        onSelect={(date) => handleIndividualFieldChange("dateReceived", date)}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  {individualErrors.dateReceived && touched["individual-dateReceived"] && (
                    <p className="text-sm text-destructive">{individualErrors.dateReceived}</p>
                  )}
                </div>

                {/* Soft-credit to Member (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="softCredit" className="text-foreground">
                    Soft-credit to Member (Optional)
                  </Label>
                  <Select
                    value={individualData.softCredit}
                    onValueChange={(value) => handleIndividualFieldChange("softCredit", value)}
                  >
                    <SelectTrigger id="softCredit" className="bg-background border-input">
                      <SelectValue placeholder="Select member" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border z-50">
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="member1">John Smith</SelectItem>
                      <SelectItem value="member2">Jane Doe</SelectItem>
                      <SelectItem value="member3">Mike Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter className="gap-2 mt-6">
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
                  disabled={!isIndividualFormValid() || loading}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {loading ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          {/* Organization Donation Form */}
          <TabsContent value="organization">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Organization Name */}
                <div className="space-y-2">
                  <Label htmlFor="organizationName" className="text-foreground">
                    Organization <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="organizationName"
                    type="text"
                    placeholder="Enter organization name"
                    value={organizationData.organizationName}
                    onChange={(e) => handleOrganizationFieldChange("organizationName", e.target.value)}
                    onBlur={() => handleFieldBlur("organization", "organizationName")}
                    className={`bg-background border-input text-foreground ${
                      organizationErrors.organizationName && touched["organization-organizationName"]
                        ? "border-destructive"
                        : ""
                    }`}
                  />
                  {organizationErrors.organizationName && touched["organization-organizationName"] && (
                    <p className="text-sm text-destructive">{organizationErrors.organizationName}</p>
                  )}
                </div>

                {/* Primary Contact */}
                <div className="space-y-2">
                  <Label htmlFor="primaryContact" className="text-foreground">
                    Primary Contact <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="primaryContact"
                    type="text"
                    placeholder="Enter contact name"
                    value={organizationData.primaryContact}
                    onChange={(e) => handleOrganizationFieldChange("primaryContact", e.target.value)}
                    onBlur={() => handleFieldBlur("organization", "primaryContact")}
                    className={`bg-background border-input text-foreground ${
                      organizationErrors.primaryContact && touched["organization-primaryContact"]
                        ? "border-destructive"
                        : ""
                    }`}
                  />
                  {organizationErrors.primaryContact && touched["organization-primaryContact"] && (
                    <p className="text-sm text-destructive">{organizationErrors.primaryContact}</p>
                  )}
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="orgAmount" className="text-foreground">
                    Amount <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="orgAmount"
                    type="number"
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                    value={organizationData.amount}
                    onChange={(e) => handleOrganizationFieldChange("amount", e.target.value)}
                    onBlur={() => handleFieldBlur("organization", "amount")}
                    className={`bg-background border-input text-foreground ${
                      organizationErrors.amount && touched["organization-amount"] ? "border-destructive" : ""
                    }`}
                  />
                  {organizationErrors.amount && touched["organization-amount"] && (
                    <p className="text-sm text-destructive">{organizationErrors.amount}</p>
                  )}
                </div>

                {/* Campaign (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="orgCampaign" className="text-foreground">
                    Campaign (Optional)
                  </Label>
                  <Select
                    value={organizationData.campaign}
                    onValueChange={(value) => handleOrganizationFieldChange("campaign", value)}
                  >
                    <SelectTrigger id="orgCampaign" className="bg-background border-input">
                      <SelectValue placeholder="Select campaign" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border z-50">
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="food-bank">Community Food Bank</SelectItem>
                      <SelectItem value="education">Education Fund</SelectItem>
                      <SelectItem value="healthcare">Healthcare Drive</SelectItem>
                      <SelectItem value="animal">Pinjrapole</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Source */}
                <div className="space-y-2">
                  <Label htmlFor="orgSource" className="text-foreground">
                    Source <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={organizationData.source}
                    onValueChange={(value) => handleOrganizationFieldChange("source", value)}
                  >
                    <SelectTrigger
                      id="orgSource"
                      className={`bg-background border-input ${
                        organizationErrors.source && touched["organization-source"] ? "border-destructive" : ""
                      }`}
                      onBlur={() => handleFieldBlur("organization", "source")}
                    >
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border z-50">
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="fundraising">Fundraising Event</SelectItem>
                      <SelectItem value="grant">Grant</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="direct">Direct</SelectItem>
                    </SelectContent>
                  </Select>
                  {organizationErrors.source && touched["organization-source"] && (
                    <p className="text-sm text-destructive">{organizationErrors.source}</p>
                  )}
                </div>

                {/* Date Received */}
                <div className="space-y-2">
                  <Label className="text-foreground">
                    Date Received <span className="text-destructive">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-background border-input",
                          !organizationData.dateReceived && "text-muted-foreground",
                          organizationErrors.dateReceived &&
                            touched["organization-dateReceived"] &&
                            "border-destructive"
                        )}
                        onBlur={() => handleFieldBlur("organization", "dateReceived")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {organizationData.dateReceived ? (
                          format(organizationData.dateReceived, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-background border-border z-50" align="start">
                      <Calendar
                        mode="single"
                        selected={organizationData.dateReceived}
                        onSelect={(date) => handleOrganizationFieldChange("dateReceived", date)}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  {organizationErrors.dateReceived && touched["organization-dateReceived"] && (
                    <p className="text-sm text-destructive">{organizationErrors.dateReceived}</p>
                  )}
                </div>

                {/* Soft-credit to Member (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="orgSoftCredit" className="text-foreground">
                    Soft-credit to Member (Optional)
                  </Label>
                  <Select
                    value={organizationData.softCredit}
                    onValueChange={(value) => handleOrganizationFieldChange("softCredit", value)}
                  >
                    <SelectTrigger id="orgSoftCredit" className="bg-background border-input">
                      <SelectValue placeholder="Select member" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border z-50">
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="member1">John Smith</SelectItem>
                      <SelectItem value="member2">Jane Doe</SelectItem>
                      <SelectItem value="member3">Mike Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter className="gap-2 mt-6">
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
                  disabled={!isOrganizationFormValid() || loading}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {loading ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

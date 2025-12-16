import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Upload, X, Plus, Trash2, GripVertical, MapPin, Clock, Image as ImageIcon, Users, Bell, Building2, FileText, HelpCircle, Award } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

const basicInfoSchema = z.object({
  organizationType: z.string().min(1, "Organization type is required"),
  organizationName: z.string().min(1, "Organization name is required"),
  department: z.array(z.string()).min(1, "At least one department is required"),
  position: z.array(z.string()).min(1, "At least one position is required"),
  organizationMail: z.string().email().optional().or(z.literal("")),
  primaryContactName: z.string().min(1, "Primary contact name is required"),
  primaryEmail: z.string().email().optional().or(z.literal("")),
  primaryPhone: z.string().min(1, "Primary phone is required"),
  website: z.string().url().optional().or(z.literal("")),
  foundYear: z.string().min(1, "Found year is required"),
  address: z.string().min(1, "Address is required"),
  legalStatus: z.string().optional(),
  taxId: z.string().optional(),
  whatsapp: z.string().url().optional().or(z.literal("")),
  facebook: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  publicProfile: z.string().min(1, "Public profile is required"),
});

interface AddOrganizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const organizationTypes = ["Non-Profit", "Government", "Corporate", "Educational", "Religious"];
const departments = ["Fire", "Police Department", "Emergency Services", "Administration", "Community Outreach"];
const positions = ["Director", "Manager", "Coordinator", "Volunteer", "Staff"];
const legalStatuses = ["Registered", "Non-Registered", "Pending"];
const publicProfiles = ["Public", "Private", "Internal"];

export function AddOrganizationModal({ open, onOpenChange }: AddOrganizationModalProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  
  // History & Milestones state
  const [milestones, setMilestones] = useState<Array<{id: string; year: string; title: string; description: string; image: string | null}>>([]);
  
  // Membership Type state
  const [membershipTypes, setMembershipTypes] = useState<Array<{id: string; name: string; description: string; benefits: string; fee: string; duration: string; active: boolean}>>([]);
  
  // Contact and Location state
  const [contacts, setContacts] = useState<Array<{id: string; name: string; role: string; email: string; phone: string}>>([]);
  
  // Hours & Status state
  const [weeklyHours, setWeeklyHours] = useState<Array<{day: string; open: string; close: string; closed: boolean}>>([
    {day: "Monday", open: "09:00", close: "17:00", closed: false},
    {day: "Tuesday", open: "09:00", close: "17:00", closed: false},
    {day: "Wednesday", open: "09:00", close: "17:00", closed: false},
    {day: "Thursday", open: "09:00", close: "17:00", closed: false},
    {day: "Friday", open: "09:00", close: "17:00", closed: false},
    {day: "Saturday", open: "10:00", close: "14:00", closed: false},
    {day: "Sunday", open: "", close: "", closed: true},
  ]);
  const [alwaysOpen, setAlwaysOpen] = useState(false);
  const [temporarilyClosed, setTemporarilyClosed] = useState(false);
  
  // Gallery state
  const [galleryImages, setGalleryImages] = useState<Array<{id: string; url: string; caption: string; album: string}>>([]);
  
  // Committee & Leadership state
  const [committeeMembers, setCommitteeMembers] = useState<Array<{id: string; name: string; role: string; email: string; phone: string; photo: string | null}>>([]);
  
  // Notice Board state
  const [notices, setNotices] = useState<Array<{id: string; title: string; description: string; publishDate: string; status: string; attachment: string | null}>>([]);
  
  // Banking state
  const [bankingInfo, setBankingInfo] = useState({bankName: "", accountNumber: "", routing: "", address: "", document: null as string | null});
  
  // Documents state
  const [documents, setDocuments] = useState<Array<{id: string; name: string; category: string; url: string}>>([]);
  
  // FAQ state
  const [faqs, setFaqs] = useState<Array<{id: string; question: string; answer: string}>>([]);
  
  // Sponsorship state
  const [sponsors, setSponsors] = useState<Array<{id: string; logo: string | null; tier: string; details: string}>>([]);

  const form = useForm<z.infer<typeof basicInfoSchema>>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      organizationType: "",
      organizationName: "",
      department: [],
      position: [],
      organizationMail: "",
      primaryContactName: "",
      primaryEmail: "",
      primaryPhone: "",
      website: "",
      foundYear: "",
      address: "",
      legalStatus: "",
      taxId: "",
      whatsapp: "",
      facebook: "",
      twitter: "",
      linkedin: "",
      publicProfile: "",
    },
  });

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleDepartment = (dept: string) => {
    const updated = selectedDepartments.includes(dept)
      ? selectedDepartments.filter((d) => d !== dept)
      : [...selectedDepartments, dept];
    setSelectedDepartments(updated);
    form.setValue("department", updated);
  };

  const togglePosition = (pos: string) => {
    const updated = selectedPositions.includes(pos)
      ? selectedPositions.filter((p) => p !== pos)
      : [...selectedPositions, pos];
    setSelectedPositions(updated);
    form.setValue("position", updated);
  };

  const onSubmit = async (data: z.infer<typeof basicInfoSchema>) => {
    if (!logoPreview) {
      toast({
        title: "Error",
        description: "Logo is required",
        variant: "destructive",
      });
      return;
    }

    console.log("Form data:", data);
    
    toast({
      title: "Success",
      description: "Organization created successfully",
    });
    
    onOpenChange(false);
    form.reset();
    setSelectedDepartments([]);
    setSelectedPositions([]);
    setLogoPreview(null);
    setBannerPreview(null);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => (currentYear - i).toString());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Organization</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 lg:grid-cols-12 w-full">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="membership">Membership</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="hours">Hours</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="committee">Committee</TabsTrigger>
            <TabsTrigger value="notice">Notice</TabsTrigger>
            <TabsTrigger value="banking">Banking</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="sponsorship">Sponsorship</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 pt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="organizationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Type *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {organizationTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="organizationName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter organization name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="department"
                    render={() => (
                      <FormItem>
                        <FormLabel>Department *</FormLabel>
                        <div className="flex flex-wrap gap-2">
                          {departments.map((dept) => (
                            <Button
                              key={dept}
                              type="button"
                              variant={selectedDepartments.includes(dept) ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleDepartment(dept)}
                            >
                              {dept}
                              {selectedDepartments.includes(dept) && (
                                <X className="ml-2 h-3 w-3" />
                              )}
                            </Button>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="position"
                    render={() => (
                      <FormItem>
                        <FormLabel>Position *</FormLabel>
                        <div className="flex flex-wrap gap-2">
                          {positions.map((pos) => (
                            <Button
                              key={pos}
                              type="button"
                              variant={selectedPositions.includes(pos) ? "default" : "outline"}
                              size="sm"
                              onClick={() => togglePosition(pos)}
                            >
                              {pos}
                              {selectedPositions.includes(pos) && (
                                <X className="ml-2 h-3 w-3" />
                              )}
                            </Button>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="organizationMail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Mail</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="organization@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="primaryContactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Contact Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter contact name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="primaryEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="contact@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="primaryPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Phone *</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="foundYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Found Year *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="legalStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Legal Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {legalStatuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="taxId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter tax ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter full address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="whatsapp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp</FormLabel>
                        <FormControl>
                          <Input placeholder="https://wa.me/..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook</FormLabel>
                        <FormControl>
                          <Input placeholder="https://facebook.com/..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter</FormLabel>
                        <FormControl>
                          <Input placeholder="https://twitter.com/..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <FormControl>
                          <Input placeholder="https://linkedin.com/..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <FormLabel>Logo Upload *</FormLabel>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      {logoPreview ? (
                        <div className="relative">
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="mx-auto max-h-32 rounded"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="mt-2"
                            onClick={() => setLogoPreview(null)}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                          <p className="mt-2 text-sm text-muted-foreground">
                            Click to upload logo (PNG/JPEG, max 5MB)
                          </p>
                          <input
                            type="file"
                            accept="image/png,image/jpeg"
                            className="hidden"
                            onChange={handleLogoUpload}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <FormLabel>Banner Image</FormLabel>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      {bannerPreview ? (
                        <div className="relative">
                          <img
                            src={bannerPreview}
                            alt="Banner preview"
                            className="mx-auto max-h-32 rounded"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="mt-2"
                            onClick={() => setBannerPreview(null)}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                          <p className="mt-2 text-sm text-muted-foreground">
                            Click to upload banner (PNG/JPEG, max 5MB)
                          </p>
                          <input
                            type="file"
                            accept="image/png,image/jpeg"
                            className="hidden"
                            onChange={handleBannerUpload}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="publicProfile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Public Profile *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select profile type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {publicProfiles.map((profile) => (
                            <SelectItem key={profile} value={profile}>
                              {profile}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="active:bg-destructive active:text-destructive-foreground">
                    Cancel
                  </Button>
                  <Button type="submit">Save Organization</Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="history" className="pt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">History & Milestones</h3>
                <Button
                  type="button"
                  onClick={() => setMilestones([...milestones, {id: Date.now().toString(), year: "", title: "", description: "", image: null}])}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Milestone
                </Button>
              </div>
              
              {milestones.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No milestones added yet
                </div>
              ) : (
                <div className="space-y-4">
                  {milestones.map((milestone, index) => (
                    <div key={milestone.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Milestone {index + 1}</h4>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => setMilestones(milestones.filter(m => m.id !== milestone.id))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Year/Date</label>
                          <Input
                            type="text"
                            placeholder="2024"
                            value={milestone.year}
                            onChange={(e) => {
                              const updated = [...milestones];
                              updated[index].year = e.target.value;
                              setMilestones(updated);
                            }}
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Title</label>
                          <Input
                            placeholder="Milestone title"
                            value={milestone.title}
                            onChange={(e) => {
                              const updated = [...milestones];
                              updated[index].title = e.target.value;
                              setMilestones(updated);
                            }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          placeholder="Describe this milestone..."
                          value={milestone.description}
                          onChange={(e) => {
                            const updated = [...milestones];
                            updated[index].description = e.target.value;
                            setMilestones(updated);
                          }}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Image</label>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center">
                          {milestone.image ? (
                            <div className="relative">
                              <img src={milestone.image} alt="Milestone" className="mx-auto max-h-32 rounded" />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="mt-2"
                                onClick={() => {
                                  const updated = [...milestones];
                                  updated[index].image = null;
                                  setMilestones(updated);
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <label className="cursor-pointer">
                              <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                              <p className="mt-2 text-sm text-muted-foreground">Upload image</p>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      const updated = [...milestones];
                                      updated[index].image = reader.result as string;
                                      setMilestones(updated);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="membership" className="pt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Membership Types</h3>
                <Button
                  type="button"
                  onClick={() => setMembershipTypes([...membershipTypes, {id: Date.now().toString(), name: "", description: "", benefits: "", fee: "", duration: "", active: true}])}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Membership Type
                </Button>
              </div>
              
              {membershipTypes.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No membership types added yet
                </div>
              ) : (
                <div className="space-y-4">
                  {membershipTypes.map((type, index) => (
                    <div key={type.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                          <h4 className="font-medium">Type {index + 1}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Active</span>
                            <Switch
                              checked={type.active}
                              onCheckedChange={(checked) => {
                                const updated = [...membershipTypes];
                                updated[index].active = checked;
                                setMembershipTypes(updated);
                              }}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => setMembershipTypes(membershipTypes.filter(t => t.id !== type.id))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Name</label>
                          <Input
                            placeholder="e.g., Gold Member"
                            value={type.name}
                            onChange={(e) => {
                              const updated = [...membershipTypes];
                              updated[index].name = e.target.value;
                              setMembershipTypes(updated);
                            }}
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Fee</label>
                          <Input
                            placeholder="$100"
                            value={type.fee}
                            onChange={(e) => {
                              const updated = [...membershipTypes];
                              updated[index].fee = e.target.value;
                              setMembershipTypes(updated);
                            }}
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Duration</label>
                          <Input
                            placeholder="1 year"
                            value={type.duration}
                            onChange={(e) => {
                              const updated = [...membershipTypes];
                              updated[index].duration = e.target.value;
                              setMembershipTypes(updated);
                            }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          placeholder="Describe this membership type..."
                          value={type.description}
                          onChange={(e) => {
                            const updated = [...membershipTypes];
                            updated[index].description = e.target.value;
                            setMembershipTypes(updated);
                          }}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Benefits</label>
                        <Textarea
                          placeholder="List the benefits..."
                          value={type.benefits}
                          onChange={(e) => {
                            const updated = [...membershipTypes];
                            updated[index].benefits = e.target.value;
                            setMembershipTypes(updated);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="contact" className="pt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Additional Contacts</h3>
                <Button
                  type="button"
                  onClick={() => setContacts([...contacts, {id: Date.now().toString(), name: "", role: "", email: "", phone: ""}])}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact
                </Button>
              </div>
              
              {contacts.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No additional contacts added yet
                </div>
              ) : (
                <div className="space-y-4">
                  {contacts.map((contact, index) => (
                    <div key={contact.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Contact {index + 1}</h4>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => setContacts(contacts.filter(c => c.id !== contact.id))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Name</label>
                          <Input
                            placeholder="Contact name"
                            value={contact.name}
                            onChange={(e) => {
                              const updated = [...contacts];
                              updated[index].name = e.target.value;
                              setContacts(updated);
                            }}
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Role</label>
                          <Input
                            placeholder="Position/Role"
                            value={contact.role}
                            onChange={(e) => {
                              const updated = [...contacts];
                              updated[index].role = e.target.value;
                              setContacts(updated);
                            }}
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Email</label>
                          <Input
                            type="email"
                            placeholder="email@example.com"
                            value={contact.email}
                            onChange={(e) => {
                              const updated = [...contacts];
                              updated[index].email = e.target.value;
                              setContacts(updated);
                            }}
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Phone</label>
                          <Input
                            placeholder="+1 (555) 123-4567"
                            value={contact.phone}
                            onChange={(e) => {
                              const updated = [...contacts];
                              updated[index].phone = e.target.value;
                              setContacts(updated);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Location Preview</h3>
                <div className="border rounded-lg p-4 bg-muted/50 flex items-center justify-center h-64">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p>Google Maps Preview</p>
                    <p className="text-sm">Map integration placeholder</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hours" className="pt-4">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Switch checked={alwaysOpen} onCheckedChange={setAlwaysOpen} />
                  <span className="text-sm font-medium">Always Open</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={temporarilyClosed} onCheckedChange={setTemporarilyClosed} />
                  <span className="text-sm font-medium">Temporarily Closed</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Weekly Schedule</h3>
                {weeklyHours.map((day, index) => (
                  <div key={day.day} className="border rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-24 font-medium">{day.day}</div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={!day.closed}
                          onCheckedChange={(checked) => {
                            const updated = [...weeklyHours];
                            updated[index].closed = !checked;
                            setWeeklyHours(updated);
                          }}
                        />
                        <span className="text-sm">Open</span>
                      </div>
                      
                      {!day.closed && (
                        <>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <Input
                              type="time"
                              className="w-32"
                              value={day.open}
                              onChange={(e) => {
                                const updated = [...weeklyHours];
                                updated[index].open = e.target.value;
                                setWeeklyHours(updated);
                              }}
                            />
                          </div>
                          
                          <span>to</span>
                          
                          <div className="flex items-center gap-2">
                            <Input
                              type="time"
                              className="w-32"
                              value={day.close}
                              onChange={(e) => {
                                const updated = [...weeklyHours];
                                updated[index].close = e.target.value;
                                setWeeklyHours(updated);
                              }}
                            />
                          </div>
                        </>
                      )}
                      
                      {day.closed && (
                        <span className="text-muted-foreground">Closed</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="pt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Gallery Images</h3>
                <Button
                  type="button"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.multiple = true;
                    input.onchange = (e) => {
                      const files = (e.target as HTMLInputElement).files;
                      if (files) {
                        Array.from(files).forEach(file => {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setGalleryImages([...galleryImages, {id: Date.now().toString() + Math.random(), url: reader.result as string, caption: "", album: "General"}]);
                          };
                          reader.readAsDataURL(file);
                        });
                      }
                    };
                    input.click();
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Images
                </Button>
              </div>
              
              {galleryImages.length === 0 ? (
                <div className="border-2 border-dashed rounded-lg p-12 text-center">
                  <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No images uploaded yet</p>
                  <p className="text-sm text-muted-foreground">Click "Upload Images" to add photos</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryImages.map((image, index) => (
                    <div key={image.id} className="border rounded-lg p-2 space-y-2">
                      <div className="relative">
                        <img src={image.url} alt="Gallery" className="w-full h-32 object-cover rounded" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1"
                          onClick={() => setGalleryImages(galleryImages.filter(img => img.id !== image.id))}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <Input
                        placeholder="Caption"
                        value={image.caption}
                        onChange={(e) => {
                          const updated = [...galleryImages];
                          updated[index].caption = e.target.value;
                          setGalleryImages(updated);
                        }}
                      />
                      
                      <Input
                        placeholder="Album"
                        value={image.album}
                        onChange={(e) => {
                          const updated = [...galleryImages];
                          updated[index].album = e.target.value;
                          setGalleryImages(updated);
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="committee" className="pt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Committee & Leadership</h3>
                <Button
                  type="button"
                  onClick={() => setCommitteeMembers([...committeeMembers, {id: Date.now().toString(), name: "", role: "", email: "", phone: "", photo: null}])}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </div>
              
              {committeeMembers.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Users className="h-12 w-12 mx-auto mb-2" />
                  <p>No committee members added yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {committeeMembers.map((member, index) => (
                    <div key={member.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                          <h4 className="font-medium">Member {index + 1}</h4>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => setCommitteeMembers(committeeMembers.filter(m => m.id !== member.id))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Name</label>
                          <Input
                            placeholder="Member name"
                            value={member.name}
                            onChange={(e) => {
                              const updated = [...committeeMembers];
                              updated[index].name = e.target.value;
                              setCommitteeMembers(updated);
                            }}
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Role</label>
                          <Select
                            value={member.role}
                            onValueChange={(value) => {
                              const updated = [...committeeMembers];
                              updated[index].role = value;
                              setCommitteeMembers(updated);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="President">President</SelectItem>
                              <SelectItem value="Vice President">Vice President</SelectItem>
                              <SelectItem value="Secretary">Secretary</SelectItem>
                              <SelectItem value="Treasurer">Treasurer</SelectItem>
                              <SelectItem value="Member">Member</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Email</label>
                          <Input
                            type="email"
                            placeholder="email@example.com"
                            value={member.email}
                            onChange={(e) => {
                              const updated = [...committeeMembers];
                              updated[index].email = e.target.value;
                              setCommitteeMembers(updated);
                            }}
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Phone</label>
                          <Input
                            placeholder="+1 (555) 123-4567"
                            value={member.phone}
                            onChange={(e) => {
                              const updated = [...committeeMembers];
                              updated[index].phone = e.target.value;
                              setCommitteeMembers(updated);
                            }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Photo</label>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center">
                          {member.photo ? (
                            <div className="relative">
                              <img src={member.photo} alt="Member" className="mx-auto h-24 w-24 rounded-full object-cover" />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="mt-2"
                                onClick={() => {
                                  const updated = [...committeeMembers];
                                  updated[index].photo = null;
                                  setCommitteeMembers(updated);
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <label className="cursor-pointer">
                              <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                              <p className="mt-2 text-sm text-muted-foreground">Upload photo</p>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      const updated = [...committeeMembers];
                                      updated[index].photo = reader.result as string;
                                      setCommitteeMembers(updated);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notice" className="pt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Notice Board</h3>
                <Button
                  type="button"
                  onClick={() => setNotices([...notices, {id: Date.now().toString(), title: "", description: "", publishDate: "", status: "Draft", attachment: null}])}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Notice
                </Button>
              </div>
              
              {notices.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Bell className="h-12 w-12 mx-auto mb-2" />
                  <p>No notices added yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notices.map((notice, index) => (
                    <div key={notice.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">Notice {index + 1}</h4>
                          <Badge variant={notice.status === "Published" ? "default" : notice.status === "Draft" ? "secondary" : "outline"}>
                            {notice.status}
                          </Badge>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => setNotices(notices.filter(n => n.id !== notice.id))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Title</label>
                          <Input
                            placeholder="Notice title"
                            value={notice.title}
                            onChange={(e) => {
                              const updated = [...notices];
                              updated[index].title = e.target.value;
                              setNotices(updated);
                            }}
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Publish Date</label>
                          <Input
                            type="date"
                            value={notice.publishDate}
                            onChange={(e) => {
                              const updated = [...notices];
                              updated[index].publishDate = e.target.value;
                              setNotices(updated);
                            }}
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Status</label>
                          <Select
                            value={notice.status}
                            onValueChange={(value) => {
                              const updated = [...notices];
                              updated[index].status = value;
                              setNotices(updated);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Draft">Draft</SelectItem>
                              <SelectItem value="Published">Published</SelectItem>
                              <SelectItem value="Archived">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          placeholder="Notice description..."
                          value={notice.description}
                          onChange={(e) => {
                            const updated = [...notices];
                            updated[index].description = e.target.value;
                            setNotices(updated);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="banking" className="pt-4">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Banking Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Bank Name</label>
                  <Input
                    placeholder="Bank name"
                    value={bankingInfo.bankName}
                    onChange={(e) => setBankingInfo({...bankingInfo, bankName: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Account Number</label>
                  <Input
                    type="password"
                    placeholder="****1234"
                    value={bankingInfo.accountNumber}
                    onChange={(e) => setBankingInfo({...bankingInfo, accountNumber: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Routing/IFSC</label>
                  <Input
                    placeholder="Routing or IFSC code"
                    value={bankingInfo.routing}
                    onChange={(e) => setBankingInfo({...bankingInfo, routing: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Bank Address</label>
                <Textarea
                  placeholder="Bank branch address"
                  value={bankingInfo.address}
                  onChange={(e) => setBankingInfo({...bankingInfo, address: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Verification Document</label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  {bankingInfo.document ? (
                    <div className="relative">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-sm">Document uploaded</p>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="mt-2"
                        onClick={() => setBankingInfo({...bankingInfo, document: null})}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">Upload voided check or verification document</p>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setBankingInfo({...bankingInfo, document: reader.result as string});
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="pt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Documents</h3>
                <Button
                  type="button"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        setDocuments([...documents, {id: Date.now().toString(), name: file.name, category: "General", url: URL.createObjectURL(file)}]);
                      }
                    };
                    input.click();
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </div>
              
              {documents.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <FileText className="h-12 w-12 mx-auto mb-2" />
                  <p>No documents uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc, index) => (
                    <div key={doc.id} className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <Badge variant="outline">{doc.category}</Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Select
                          value={doc.category}
                          onValueChange={(value) => {
                            const updated = [...documents];
                            updated[index].category = value;
                            setDocuments(updated);
                          }}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Legal">Legal</SelectItem>
                            <SelectItem value="Financial">Financial</SelectItem>
                            <SelectItem value="General">General</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => setDocuments(documents.filter(d => d.id !== doc.id))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="faq" className="pt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">FAQ</h3>
                <Button
                  type="button"
                  onClick={() => setFaqs([...faqs, {id: Date.now().toString(), question: "", answer: ""}])}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add FAQ
                </Button>
              </div>
              
              {faqs.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <HelpCircle className="h-12 w-12 mx-auto mb-2" />
                  <p>No FAQs added yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={faq.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                          <h4 className="font-medium">FAQ {index + 1}</h4>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => setFaqs(faqs.filter(f => f.id !== faq.id))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Question</label>
                        <Input
                          placeholder="Enter question"
                          value={faq.question}
                          onChange={(e) => {
                            const updated = [...faqs];
                            updated[index].question = e.target.value;
                            setFaqs(updated);
                          }}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Answer</label>
                        <Textarea
                          placeholder="Enter answer"
                          value={faq.answer}
                          onChange={(e) => {
                            const updated = [...faqs];
                            updated[index].answer = e.target.value;
                            setFaqs(updated);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="sponsorship" className="pt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Sponsorship & Branding</h3>
                <Button
                  type="button"
                  onClick={() => setSponsors([...sponsors, {id: Date.now().toString(), logo: null, tier: "Gold", details: ""}])}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Sponsor
                </Button>
              </div>
              
              {sponsors.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Award className="h-12 w-12 mx-auto mb-2" />
                  <p>No sponsors added yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sponsors.map((sponsor, index) => (
                    <div key={sponsor.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">Sponsor {index + 1}</h4>
                          <Badge variant={sponsor.tier === "Platinum" ? "default" : sponsor.tier === "Gold" ? "secondary" : "outline"}>
                            {sponsor.tier}
                          </Badge>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => setSponsors(sponsors.filter(s => s.id !== sponsor.id))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Tier</label>
                          <Select
                            value={sponsor.tier}
                            onValueChange={(value) => {
                              const updated = [...sponsors];
                              updated[index].tier = value;
                              setSponsors(updated);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Platinum">Platinum</SelectItem>
                              <SelectItem value="Gold">Gold</SelectItem>
                              <SelectItem value="Silver">Silver</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Sponsor Details</label>
                        <Textarea
                          placeholder="Enter sponsor details..."
                          value={sponsor.details}
                          onChange={(e) => {
                            const updated = [...sponsors];
                            updated[index].details = e.target.value;
                            setSponsors(updated);
                          }}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Sponsor Logo</label>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center">
                          {sponsor.logo ? (
                            <div className="relative">
                              <img src={sponsor.logo} alt="Sponsor logo" className="mx-auto max-h-24 rounded" />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="mt-2"
                                onClick={() => {
                                  const updated = [...sponsors];
                                  updated[index].logo = null;
                                  setSponsors(updated);
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <label className="cursor-pointer">
                              <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                              <p className="mt-2 text-sm text-muted-foreground">Upload sponsor logo</p>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      const updated = [...sponsors];
                                      updated[index].logo = reader.result as string;
                                      setSponsors(updated);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

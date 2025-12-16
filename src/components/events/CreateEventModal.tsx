import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { CalendarIcon, Plus, Trash2, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CreateEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TicketType {
  id: string;
  name: string;
  price: string;
  benefits: string;
}

interface VolunteerActivity {
  id: string;
  title: string;
  description: string;
  fromDate: Date | undefined;
  toDate: Date | undefined;
  fromTime: string;
  toTime: string;
  numVolunteers: string;
}

interface AgendaItem {
  id: string;
  activityName: string;
  startTime: string;
  endTime: string;
  date: Date | undefined;
  speakers: string;
  venue: string;
  description: string;
}

interface DonationItem {
  id: string;
  category: string;
  title: string;
  quantity: string;
  amountNeeded: string;
  fromDate: Date | undefined;
  toDate: Date | undefined;
  fromTime: string;
  toTime: string;
  description: string;
}

interface SponsorItem {
  id: string;
  organization: string;
  contact: string;
  status: string;
  amount: string;
  benefits: string;
  sopFile: File | null;
}

export const CreateEventModal = ({ open, onOpenChange }: CreateEventModalProps) => {
  const [activeTab, setActiveTab] = useState("info");
  
  // Event Information
  const [eventName, setEventName] = useState("");
  const [eventCategory, setEventCategory] = useState("");
  const [visibility, setVisibility] = useState("");
  const [description, setDescription] = useState("");
  const [eventPrice, setEventPrice] = useState("");
  const [department, setDepartment] = useState("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [timezone, setTimezone] = useState("");
  const [eventType, setEventType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [address, setAddress] = useState("");

  // Tickets
  const [regStartDate, setRegStartDate] = useState<Date>();
  const [regEndDate, setRegEndDate] = useState<Date>();
  const [tickets, setTickets] = useState<TicketType[]>([]);

  // Volunteers
  const [volunteerActivities, setVolunteerActivities] = useState<VolunteerActivity[]>([]);

  // Agenda
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);

  // Donation
  const [donations, setDonations] = useState<DonationItem[]>([]);

  // Sponsorship
  const [sponsors, setSponsors] = useState<SponsorItem[]>([]);

  // Communication
  const [inviteTemplate, setInviteTemplate] = useState("");
  const [reminderSchedule, setReminderSchedule] = useState("");

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTicket = () => {
    setTickets([...tickets, { id: Date.now().toString(), name: "", price: "", benefits: "" }]);
  };

  const removeTicket = (id: string) => {
    setTickets(tickets.filter(t => t.id !== id));
  };

  const updateTicket = (id: string, field: keyof TicketType, value: string) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const addVolunteerActivity = () => {
    setVolunteerActivities([...volunteerActivities, {
      id: Date.now().toString(),
      title: "",
      description: "",
      fromDate: undefined,
      toDate: undefined,
      fromTime: "",
      toTime: "",
      numVolunteers: ""
    }]);
  };

  const removeVolunteerActivity = (id: string) => {
    setVolunteerActivities(volunteerActivities.filter(v => v.id !== id));
  };

  const updateVolunteerActivity = (id: string, field: keyof VolunteerActivity, value: any) => {
    setVolunteerActivities(volunteerActivities.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const addAgendaItem = () => {
    setAgendaItems([...agendaItems, {
      id: Date.now().toString(),
      activityName: "",
      startTime: "",
      endTime: "",
      date: undefined,
      speakers: "",
      venue: "",
      description: ""
    }]);
  };

  const removeAgendaItem = (id: string) => {
    setAgendaItems(agendaItems.filter(a => a.id !== id));
  };

  const updateAgendaItem = (id: string, field: keyof AgendaItem, value: any) => {
    setAgendaItems(agendaItems.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const addDonation = () => {
    setDonations([...donations, {
      id: Date.now().toString(),
      category: "",
      title: "",
      quantity: "",
      amountNeeded: "",
      fromDate: undefined,
      toDate: undefined,
      fromTime: "",
      toTime: "",
      description: ""
    }]);
  };

  const removeDonation = (id: string) => {
    setDonations(donations.filter(d => d.id !== id));
  };

  const updateDonation = (id: string, field: keyof DonationItem, value: any) => {
    setDonations(donations.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const addSponsor = () => {
    setSponsors([...sponsors, {
      id: Date.now().toString(),
      organization: "",
      contact: "",
      status: "",
      amount: "",
      benefits: "",
      sopFile: null
    }]);
  };

  const removeSponsor = (id: string) => {
    setSponsors(sponsors.filter(s => s.id !== id));
  };

  const updateSponsor = (id: string, field: keyof SponsorItem, value: any) => {
    setSponsors(sponsors.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSopUpload = (id: string, file: File | null) => {
    if (file && file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }
    updateSponsor(id, "sopFile", file);
  };

  const handleSubmit = () => {
    if (!eventName || !eventCategory || !visibility) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success("Event created successfully!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Fill in the event details across different tabs. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-7 w-full">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
            <TabsTrigger value="donation">Donation</TabsTrigger>
            <TabsTrigger value="sponsorship">Sponsorship</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
          </TabsList>

          {/* Event Information Tab */}
          <TabsContent value="info" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventName">Event Name *</Label>
                <Input
                  id="eventName"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Enter event name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventCategory">Event Category *</Label>
                <Select value={eventCategory} onValueChange={setEventCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="seminar">Seminar</SelectItem>
                    <SelectItem value="meetup">Meetup</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="visibility">Visibility *</Label>
                <Select value={visibility} onValueChange={setVisibility}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="internal">Internal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventPrice">Event Price *</Label>
                <Select value={eventPrice} onValueChange={setEventPrice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select price type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fire">Fire</SelectItem>
                    <SelectItem value="police">Police</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventType">Event Type</Label>
                <Select value={eventType} onValueChange={setEventType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-person">In Person</SelectItem>
                    <SelectItem value="virtual">Virtual</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter event description"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="est">EST</SelectItem>
                    <SelectItem value="pst">PST</SelectItem>
                    <SelectItem value="cst">CST</SelectItem>
                    <SelectItem value="mst">MST</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Overall Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="Enter capacity"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Search location"
              />
            </div>

            <div className="space-y-2">
              <Label>Event Banner</Label>
              <div className="border-2 border-dashed rounded-lg p-4">
                {bannerPreview ? (
                  <div className="relative">
                    <img src={bannerPreview} alt="Banner preview" className="w-full h-48 object-cover rounded" />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setBannerFile(null);
                        setBannerPreview("");
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="mt-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerUpload}
                        className="hidden"
                        id="banner-upload"
                      />
                      <Label htmlFor="banner-upload" className="cursor-pointer text-primary hover:underline">
                        Upload banner image
                      </Label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Tickets Tab */}
          <TabsContent value="tickets" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Registration Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !regStartDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {regStartDate ? format(regStartDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={regStartDate} onSelect={setRegStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Registration End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !regEndDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {regEndDate ? format(regEndDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={regEndDate} onSelect={setRegEndDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label>Ticket Types</Label>
              <Button onClick={addTicket} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Ticket
              </Button>
            </div>

            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Ticket Details</Label>
                    <Button size="icon" variant="ghost" onClick={() => removeTicket(ticket.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Ticket Type</Label>
                      <Input
                        value={ticket.name}
                        onChange={(e) => updateTicket(ticket.id, "name", e.target.value)}
                        placeholder="e.g., VIP, General, Member"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price</Label>
                      <Input
                        type="number"
                        value={ticket.price}
                        onChange={(e) => updateTicket(ticket.id, "price", e.target.value)}
                        placeholder="Enter price"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Benefits</Label>
                    <Textarea
                      value={ticket.benefits}
                      onChange={(e) => updateTicket(ticket.id, "benefits", e.target.value)}
                      placeholder="Enter ticket benefits"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Volunteers Tab */}
          <TabsContent value="volunteers" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <Label>Volunteer Activities</Label>
              <Button onClick={addVolunteerActivity} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Activity
              </Button>
            </div>

            <div className="space-y-4">
              {volunteerActivities.map((activity) => (
                <div key={activity.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Activity Details</Label>
                    <Button size="icon" variant="ghost" onClick={() => removeVolunteerActivity(activity.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Activity Title</Label>
                    <Input
                      value={activity.title}
                      onChange={(e) => updateVolunteerActivity(activity.id, "title", e.target.value)}
                      placeholder="Enter activity title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={activity.description}
                      onChange={(e) => updateVolunteerActivity(activity.id, "description", e.target.value)}
                      placeholder="Enter description"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>From Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !activity.fromDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {activity.fromDate ? format(activity.fromDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={activity.fromDate} onSelect={(date) => updateVolunteerActivity(activity.id, "fromDate", date)} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>To Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !activity.toDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {activity.toDate ? format(activity.toDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={activity.toDate} onSelect={(date) => updateVolunteerActivity(activity.id, "toDate", date)} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>From Time</Label>
                      <Input
                        type="time"
                        value={activity.fromTime}
                        onChange={(e) => updateVolunteerActivity(activity.id, "fromTime", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>To Time</Label>
                      <Input
                        type="time"
                        value={activity.toTime}
                        onChange={(e) => updateVolunteerActivity(activity.id, "toTime", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label>Number of Volunteers</Label>
                      <Input
                        type="number"
                        value={activity.numVolunteers}
                        onChange={(e) => updateVolunteerActivity(activity.id, "numVolunteers", e.target.value)}
                        placeholder="Enter number of volunteers needed"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Agenda Tab */}
          <TabsContent value="agenda" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <Label>Event Agenda</Label>
              <Button onClick={addAgendaItem} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Session
              </Button>
            </div>

            <div className="space-y-4">
              {agendaItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Session Details</Label>
                    <Button size="icon" variant="ghost" onClick={() => removeAgendaItem(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Activity Name</Label>
                    <Input
                      value={item.activityName}
                      onChange={(e) => updateAgendaItem(item.id, "activityName", e.target.value)}
                      placeholder="Enter activity name"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        value={item.startTime}
                        onChange={(e) => updateAgendaItem(item.id, "startTime", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        value={item.endTime}
                        onChange={(e) => updateAgendaItem(item.id, "endTime", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !item.date && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {item.date ? format(item.date, "PP") : "Date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={item.date} onSelect={(date) => updateAgendaItem(item.id, "date", date)} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Speakers</Label>
                      <Input
                        value={item.speakers}
                        onChange={(e) => updateAgendaItem(item.id, "speakers", e.target.value)}
                        placeholder="Enter speaker names"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Venue</Label>
                      <Input
                        value={item.venue}
                        onChange={(e) => updateAgendaItem(item.id, "venue", e.target.value)}
                        placeholder="Enter venue"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={item.description}
                      onChange={(e) => updateAgendaItem(item.id, "description", e.target.value)}
                      placeholder="Enter session description"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Donation Tab */}
          <TabsContent value="donation" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <Label>Donation Campaigns</Label>
              <Button onClick={addDonation} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Campaign
              </Button>
            </div>

            <div className="space-y-4">
              {donations.map((donation) => (
                <div key={donation.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Campaign Details</Label>
                    <Button size="icon" variant="ghost" onClick={() => removeDonation(donation.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Donation Category</Label>
                      <Select value={donation.category} onValueChange={(value) => updateDonation(donation.id, "category", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fundraising">Fund Raising</SelectItem>
                          <SelectItem value="item">Item Donation</SelectItem>
                          <SelectItem value="sponsorship">Sponsorship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Donation Title</Label>
                      <Input
                        value={donation.title}
                        onChange={(e) => updateDonation(donation.id, "title", e.target.value)}
                        placeholder="Enter title"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Item Quantity</Label>
                      <Input
                        type="number"
                        value={donation.quantity}
                        onChange={(e) => updateDonation(donation.id, "quantity", e.target.value)}
                        placeholder="Enter quantity"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Amount Needed</Label>
                      <Input
                        type="number"
                        value={donation.amountNeeded}
                        onChange={(e) => updateDonation(donation.id, "amountNeeded", e.target.value)}
                        placeholder="Enter amount"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>From Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !donation.fromDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {donation.fromDate ? format(donation.fromDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={donation.fromDate} onSelect={(date) => updateDonation(donation.id, "fromDate", date)} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>To Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !donation.toDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {donation.toDate ? format(donation.toDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={donation.toDate} onSelect={(date) => updateDonation(donation.id, "toDate", date)} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>From Time</Label>
                      <Input
                        type="time"
                        value={donation.fromTime}
                        onChange={(e) => updateDonation(donation.id, "fromTime", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>To Time</Label>
                      <Input
                        type="time"
                        value={donation.toTime}
                        onChange={(e) => updateDonation(donation.id, "toTime", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={donation.description}
                      onChange={(e) => updateDonation(donation.id, "description", e.target.value)}
                      placeholder="Enter campaign description"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Sponsorship Tab */}
          <TabsContent value="sponsorship" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <Label>Sponsors</Label>
              <Button onClick={addSponsor} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Sponsor
              </Button>
            </div>

            <div className="space-y-4">
              {sponsors.map((sponsor) => (
                <div key={sponsor.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Sponsor Details</Label>
                    <Button size="icon" variant="ghost" onClick={() => removeSponsor(sponsor.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Sponsor Organization</Label>
                      <Input
                        value={sponsor.organization}
                        onChange={(e) => updateSponsor(sponsor.id, "organization", e.target.value)}
                        placeholder="Enter organization name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Sponsor Contact</Label>
                      <Input
                        value={sponsor.contact}
                        onChange={(e) => updateSponsor(sponsor.id, "contact", e.target.value)}
                        placeholder="Enter contact info"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Sponsorship Status</Label>
                      <Select value={sponsor.status} onValueChange={(value) => updateSponsor(sponsor.id, "status", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="declined">Declined</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Sponsor Amount</Label>
                      <Input
                        type="number"
                        value={sponsor.amount}
                        onChange={(e) => updateSponsor(sponsor.id, "amount", e.target.value)}
                        placeholder="Enter amount"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>SOP Template</Label>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleSopUpload(sponsor.id, e.target.files?.[0] || null)}
                    />
                    {sponsor.sopFile && (
                      <p className="text-sm text-muted-foreground">{sponsor.sopFile.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Benefits</Label>
                    <Textarea
                      value={sponsor.benefits}
                      onChange={(e) => updateSponsor(sponsor.id, "benefits", e.target.value)}
                      placeholder="Enter sponsor benefits"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Communication Tab */}
          <TabsContent value="communication" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="inviteTemplate">Invite Email Template</Label>
              <Textarea
                id="inviteTemplate"
                value={inviteTemplate}
                onChange={(e) => setInviteTemplate(e.target.value)}
                placeholder="Enter email template content"
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminderSchedule">Reminder Schedule</Label>
              <Textarea
                id="reminderSchedule"
                value={reminderSchedule}
                onChange={(e) => setReminderSchedule(e.target.value)}
                placeholder="Enter reminder schedule details"
                rows={4}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="active:bg-destructive active:text-destructive-foreground">
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create Event
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, UserX, TrendingUp, Plus } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { VolunteerCategoryCard } from "@/components/volunteering/VolunteerCategoryCard";
import { VolunteerListTable } from "@/components/volunteering/VolunteerListTable";
import { AddVolunteerModal } from "@/components/volunteering/AddVolunteerModal";
import { EditCategoryModal } from "@/components/volunteering/EditCategoryModal";
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

const categories = [
  {
    id: 1,
    name: "Registration Desk",
    timeSlot: "8:00 AM - 10:00 AM",
    current: 3,
    capacity: 6,
    description: "Welcome guests and manage event registration",
  },
  {
    id: 2,
    name: "Usher",
    timeSlot: "10:00 AM - 2:00 PM",
    current: 8,
    capacity: 10,
    description: "Guide attendees to their seats and assist with directions",
  },
  {
    id: 3,
    name: "AV Support",
    timeSlot: "9:00 AM - 5:00 PM",
    current: 2,
    capacity: 4,
    description: "Technical support for audio and visual equipment",
  },
  {
    id: 4,
    name: "Food Services",
    timeSlot: "11:00 AM - 3:00 PM",
    current: 5,
    capacity: 8,
    description: "Serve refreshments and manage catering area",
  },
  {
    id: 5,
    name: "Cleanup Crew",
    timeSlot: "4:00 PM - 6:00 PM",
    current: 4,
    capacity: 10,
    description: "Post-event cleanup and venue restoration",
  },
];

const mockVolunteers = {
  1: [
    { id: 1, name: "Sarah Johnson", slot: "8:00 AM - 10:00 AM", contact: "sarah@email.com" },
    { id: 2, name: "Mike Chen", slot: "8:00 AM - 10:00 AM", contact: "mike@email.com" },
    { id: 3, name: "Emily Davis", slot: "8:00 AM - 10:00 AM", contact: "emily@email.com" },
  ],
  2: [
    { id: 4, name: "John Smith", slot: "10:00 AM - 2:00 PM", contact: "john@email.com" },
    { id: 5, name: "Lisa Brown", slot: "10:00 AM - 2:00 PM", contact: "lisa@email.com" },
    { id: 6, name: "David Wilson", slot: "10:00 AM - 2:00 PM", contact: "david@email.com" },
    { id: 7, name: "Anna Martinez", slot: "10:00 AM - 2:00 PM", contact: "anna@email.com" },
    { id: 8, name: "Chris Taylor", slot: "10:00 AM - 2:00 PM", contact: "chris@email.com" },
    { id: 9, name: "Rachel Green", slot: "10:00 AM - 2:00 PM", contact: "rachel@email.com" },
    { id: 10, name: "Tom Anderson", slot: "10:00 AM - 2:00 PM", contact: "tom@email.com" },
    { id: 11, name: "Jessica White", slot: "10:00 AM - 2:00 PM", contact: "jessica@email.com" },
  ],
};

const Volunteering = () => {
  const [addVolunteerOpen, setAddVolunteerOpen] = useState(false);
  const [editCategoryOpen, setEditCategoryOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [eventDate, setEventDate] = useState<Date>();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedCategoryData, setSelectedCategoryData] = useState<any>(null);

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory(categoryId);
  };

  const handleEditCategory = (category: any) => {
    setSelectedCategoryData(category);
    setEditCategoryOpen(true);
  };

  const currentVolunteers = selectedCategory ? mockVolunteers[selectedCategory as keyof typeof mockVolunteers] || [] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Volunteering</h1>
          <p className="text-muted-foreground mt-1">Manage volunteers and assignments</p>
        </div>
        <Button onClick={() => setAddVolunteerOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Volunteers
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Volunteers (This Year)"
          value="287"
          change="+42"
          changeType="increase"
          icon={Users}
          iconColor="text-primary"
        />
        <StatCard
          title="Active Volunteers"
          value="156"
          change="+18"
          changeType="increase"
          icon={UserCheck}
          iconColor="text-success"
        />
        <StatCard
          title="Hours Contributed"
          value="2,450"
          change="+15%"
          changeType="increase"
          icon={TrendingUp}
          iconColor="text-info"
        />
        <StatCard
          title="Pending Assignments"
          value="23"
          change="-5"
          changeType="decrease"
          icon={UserX}
          iconColor="text-muted-foreground"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={selectedEvent} onValueChange={setSelectedEvent}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select Event" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="festival">Festival of Lights Celebration</SelectItem>
            <SelectItem value="gala">Annual Charity Gala</SelectItem>
            <SelectItem value="marathon">Community Marathon</SelectItem>
            <SelectItem value="workshop">Youth Workshop Series</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !eventDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {eventDate ? format(eventDate, "PPP") : <span>Date of Event</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={eventDate}
              onSelect={setEventDate}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Volunteering Categories */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Volunteering Categories</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <VolunteerCategoryCard
              key={category.id}
              {...category}
              isSelected={selectedCategory === category.id}
              onClick={() => handleCategoryClick(category.id)}
              onEdit={() => handleEditCategory(category)}
            />
          ))}
        </div>
      </div>

      {/* Volunteer List Table */}
      {selectedCategory && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Volunteers - {categories.find(c => c.id === selectedCategory)?.name}
          </h2>
          <VolunteerListTable volunteers={currentVolunteers} />
        </div>
      )}

      {/* Modals */}
      <AddVolunteerModal open={addVolunteerOpen} onOpenChange={setAddVolunteerOpen} />
      <EditCategoryModal
        open={editCategoryOpen}
        onOpenChange={setEditCategoryOpen}
        category={selectedCategoryData}
      />
    </div>
  );
};

export default Volunteering;

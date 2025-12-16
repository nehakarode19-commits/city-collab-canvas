import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreateEventModal } from "@/components/events/CreateEventModal";
import { EventDetailsModal } from "@/components/events/EventDetailsModal";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  organization: string;
  attendees: number;
  status: "upcoming" | "ongoing" | "completed";
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Community Cleanup Drive",
    date: "2024-12-15",
    location: "Central Park",
    organization: "Green Earth Initiative",
    attendees: 45,
    status: "upcoming",
  },
  {
    id: "2",
    title: "Tech Workshop for Youth",
    date: "2024-11-20",
    location: "Tech Hub",
    organization: "Tech for Good",
    attendees: 32,
    status: "ongoing",
  },
  {
    id: "3",
    title: "Urban Gardening Session",
    date: "2024-11-25",
    location: "Community Garden",
    organization: "Urban Gardens Network",
    attendees: 28,
    status: "upcoming",
  },
  {
    id: "4",
    title: "Education Fundraiser",
    date: "2024-10-30",
    location: "City Hall",
    organization: "Youth Education Fund",
    attendees: 120,
    status: "completed",
  },
];

const Events = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setDetailsModalOpen(true);
  };

  const getStatusColor = (status: Event["status"]) => {
    switch (status) {
      case "upcoming":
        return "default";
      case "ongoing":
        return "default";
      case "completed":
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground mt-1">Manage all platform events</p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      <CreateEventModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
      <EventDetailsModal 
        open={detailsModalOpen} 
        onOpenChange={setDetailsModalOpen}
        event={selectedEvent}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockEvents.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <Badge variant={getStatusColor(event.status)}>{event.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{event.attendees} attendees</span>
              </div>
              <div className="pt-2">
                <p className="text-sm font-medium text-foreground">{event.organization}</p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleViewDetails(event)}
                >
                  View Details
                </Button>
                <Button size="sm" className="flex-1">Manage</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Events;

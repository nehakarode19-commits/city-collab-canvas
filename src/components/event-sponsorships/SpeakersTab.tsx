import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, Edit } from "lucide-react";
import { AssignSponsorModal } from "./AssignSponsorModal";

interface Speaker {
  id: string;
  name: string;
  role: string;
  bio: string;
  sponsorable: boolean;
  price: number;
  status: "available" | "confirmed";
  initials: string;
}

const mockSpeakers: Speaker[] = [
  {
    id: "1",
    name: "Dr. Sarah Chen",
    role: "Keynote Speaker",
    bio: "Leading expert in sustainable urban development with 20+ years experience...",
    sponsorable: true,
    price: 15000,
    status: "confirmed",
    initials: "SC",
  },
  {
    id: "2",
    name: "Michael Torres",
    role: "Panel Moderator",
    bio: "Award-winning journalist specializing in technology and innovation...",
    sponsorable: true,
    price: 8000,
    status: "available",
    initials: "MT",
  },
  {
    id: "3",
    name: "Jennifer Liu",
    role: "Workshop Leader",
    bio: "Data scientist and educator passionate about making analytics accessible...",
    sponsorable: true,
    price: 5000,
    status: "available",
    initials: "JL",
  },
  {
    id: "4",
    name: "Robert Jackson",
    role: "Keynote Speaker",
    bio: "Former city manager and consultant on municipal digital transformation...",
    sponsorable: true,
    price: 12000,
    status: "confirmed",
    initials: "RJ",
  },
];

export function SpeakersTab() {
  const [speakers] = useState<Speaker[]>(mockSpeakers);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);

  const handleAssignSponsor = (speaker: Speaker) => {
    setSelectedSpeaker(speaker);
    setAssignModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {speakers.map((speaker) => (
          <Card key={speaker.id} className="rounded-2xl shadow-md">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                    {speaker.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="font-semibold text-lg">{speaker.name}</h3>
                    <p className="text-sm text-muted-foreground">{speaker.role}</p>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {speaker.bio}
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <Badge variant={speaker.sponsorable ? "default" : "secondary"}>
                      {speaker.sponsorable ? "Sponsorable" : "Not Sponsorable"}
                    </Badge>
                    {speaker.price > 0 && (
                      <span className="text-sm font-semibold">
                        ${speaker.price.toLocaleString()}
                      </span>
                    )}
                    <Badge variant={speaker.status === "confirmed" ? "default" : "outline"}>
                      {speaker.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    {speaker.sponsorable && (
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleAssignSponsor(speaker)}
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Assign Sponsor
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AssignSponsorModal
        open={assignModalOpen}
        onOpenChange={setAssignModalOpen}
        asset={selectedSpeaker}
        assetType="speaker"
      />
    </div>
  );
}

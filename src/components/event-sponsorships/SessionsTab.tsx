import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, UserPlus } from "lucide-react";
import { EditSessionDrawer } from "./EditSessionDrawer";
import { AssignSponsorModal } from "./AssignSponsorModal";

interface Session {
  id: string;
  title: string;
  time: string;
  room: string;
  sponsorable: boolean;
  package: string;
  price: number;
  status: "available" | "confirmed" | "pending";
}

const mockSessions: Session[] = [
  {
    id: "1",
    title: "Opening Keynote: Future of Technology",
    time: "09:00 AM - 10:00 AM",
    room: "Main Hall",
    sponsorable: true,
    package: "Platinum",
    price: 25000,
    status: "confirmed",
  },
  {
    id: "2",
    title: "Panel: AI in Government",
    time: "10:30 AM - 11:30 AM",
    room: "Conference Room A",
    sponsorable: true,
    package: "Gold",
    price: 15000,
    status: "available",
  },
  {
    id: "3",
    title: "Workshop: Data Analytics",
    time: "02:00 PM - 03:30 PM",
    room: "Workshop Space",
    sponsorable: false,
    package: "-",
    price: 0,
    status: "available",
  },
  {
    id: "4",
    title: "Closing Ceremony",
    time: "05:00 PM - 06:00 PM",
    room: "Main Hall",
    sponsorable: true,
    package: "Silver",
    price: 8000,
    status: "pending",
  },
];

export function SessionsTab() {
  const [sessions] = useState<Session[]>(mockSessions);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const handleEdit = (session: Session) => {
    setSelectedSession(session);
    setEditDrawerOpen(true);
  };

  const handleAssignSponsor = (session: Session) => {
    setSelectedSession(session);
    setAssignModalOpen(true);
  };

  const getStatusVariant = (status: Session["status"]) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "available":
        return "outline";
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Session Title</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Sponsorable</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell className="font-medium">{session.title}</TableCell>
                <TableCell className="text-muted-foreground">{session.time}</TableCell>
                <TableCell className="text-muted-foreground">{session.room}</TableCell>
                <TableCell>
                  <Badge variant={session.sponsorable ? "default" : "secondary"}>
                    {session.sponsorable ? "Yes" : "No"}
                  </Badge>
                </TableCell>
                <TableCell>{session.package}</TableCell>
                <TableCell>
                  {session.price > 0 ? `$${session.price.toLocaleString()}` : "-"}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(session.status)}>
                    {session.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(session)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {session.sponsorable && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleAssignSponsor(session)}
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Assign
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditSessionDrawer
        open={editDrawerOpen}
        onOpenChange={setEditDrawerOpen}
        session={selectedSession}
      />

      <AssignSponsorModal
        open={assignModalOpen}
        onOpenChange={setAssignModalOpen}
        asset={selectedSession}
        assetType="session"
      />
    </div>
  );
}

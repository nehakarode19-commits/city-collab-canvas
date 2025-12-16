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
import { Edit, UserPlus, Plus } from "lucide-react";
import { AssignSponsorModal } from "./AssignSponsorModal";
import { EditBoothDrawer } from "./EditBoothDrawer";

interface Booth {
  id: string;
  name: string;
  zone: string;
  size: string;
  type: string;
  basePrice: number;
  status: "available" | "confirmed" | "reserved";
}

const mockBooths: Booth[] = [
  {
    id: "1",
    name: "Premium Booth A1",
    zone: "Main Exhibition Hall",
    size: "10x10 ft",
    type: "Premium Corner",
    basePrice: 5000,
    status: "confirmed",
  },
  {
    id: "2",
    name: "Standard Booth B5",
    zone: "Secondary Hall",
    size: "8x8 ft",
    type: "Standard",
    basePrice: 3000,
    status: "available",
  },
  {
    id: "3",
    name: "Premium Booth A2",
    zone: "Main Exhibition Hall",
    size: "10x10 ft",
    type: "Premium",
    basePrice: 4500,
    status: "reserved",
  },
  {
    id: "4",
    name: "Large Booth C1",
    zone: "Innovation Zone",
    size: "15x15 ft",
    type: "Large Premium",
    basePrice: 8000,
    status: "available",
  },
];

export function BoothsTab() {
  const [booths] = useState<Booth[]>(mockBooths);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);

  const handleEdit = (booth: Booth) => {
    setSelectedBooth(booth);
    setEditDrawerOpen(true);
  };

  const handleAssignSponsor = (booth: Booth) => {
    setSelectedBooth(booth);
    setAssignModalOpen(true);
  };

  const getStatusVariant = (status: Booth["status"]) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "reserved":
        return "secondary";
      case "available":
        return "outline";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Booth
        </Button>
      </div>

      <div className="rounded-2xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booth Name</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Base Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {booths.map((booth) => (
              <TableRow key={booth.id}>
                <TableCell className="font-medium">{booth.name}</TableCell>
                <TableCell className="text-muted-foreground">{booth.zone}</TableCell>
                <TableCell className="text-muted-foreground">{booth.size}</TableCell>
                <TableCell>
                  <Badge variant="outline">{booth.type}</Badge>
                </TableCell>
                <TableCell className="font-semibold">
                  ${booth.basePrice.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(booth.status)}>
                    {booth.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(booth)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {booth.status === "available" && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleAssignSponsor(booth)}
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

      <EditBoothDrawer
        open={editDrawerOpen}
        onOpenChange={setEditDrawerOpen}
        booth={selectedBooth}
      />

      <AssignSponsorModal
        open={assignModalOpen}
        onOpenChange={setAssignModalOpen}
        asset={selectedBooth}
        assetType="booth"
      />
    </div>
  );
}

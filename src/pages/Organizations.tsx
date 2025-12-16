import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";
import { AddOrganizationModal } from "@/components/organizations/AddOrganizationModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface Organization {
  id: string;
  name: string;
  type: string;
  members: number;
  events: number;
  status: "active" | "inactive";
  contact: string;
}

const mockOrganizations: Organization[] = [
  {
    id: "1",
    name: "Green Earth Initiative",
    type: "Environmental",
    members: 45,
    events: 8,
    status: "active",
    contact: "contact@greenearth.org",
  },
  {
    id: "2",
    name: "Tech for Good",
    type: "Technology",
    members: 32,
    events: 5,
    status: "active",
    contact: "info@techforgood.org",
  },
  {
    id: "3",
    name: "Urban Gardens Network",
    type: "Community",
    members: 28,
    events: 12,
    status: "active",
    contact: "hello@urbangardens.org",
  },
  {
    id: "4",
    name: "Youth Education Fund",
    type: "Education",
    members: 56,
    events: 3,
    status: "inactive",
    contact: "contact@youthfund.org",
  },
];

const Organizations = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Organizations</h1>
          <p className="text-muted-foreground mt-1">Manage all registered organizations</p>
        </div>
        <Button onClick={() => setAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Organization
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organization Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Events</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockOrganizations.map((org) => (
              <TableRow key={org.id}>
                <TableCell className="font-medium">{org.name}</TableCell>
                <TableCell>{org.type}</TableCell>
                <TableCell>{org.members}</TableCell>
                <TableCell>{org.events}</TableCell>
                <TableCell className="text-muted-foreground">{org.contact}</TableCell>
                <TableCell>
                  <Badge variant={org.status === "active" ? "default" : "secondary"}>
                    {org.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">View</Button>
                  <Button variant="ghost" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <AddOrganizationModal open={addModalOpen} onOpenChange={setAddModalOpen} />
    </div>
  );
};

export default Organizations;

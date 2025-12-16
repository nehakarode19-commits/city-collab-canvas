import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";
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
import { AddDepartmentModal } from "@/components/departments/AddDepartmentModal";

interface Department {
  id: string;
  name: string;
  email: string;
  phone: string;
  head: string;
  members: number;
  status: "active" | "inactive";
  zulipRoomStatus: "created" | "pending" | "failed";
}

const mockDepartments: Department[] = [
  {
    id: "1",
    name: "Public Works",
    email: "publicworks@city.gov",
    phone: "(555) 123-4567",
    head: "John Smith",
    members: 24,
    status: "active",
    zulipRoomStatus: "created",
  },
  {
    id: "2",
    name: "Fire Department",
    email: "fire@city.gov",
    phone: "(555) 234-5678",
    head: "Sarah Johnson",
    members: 45,
    status: "active",
    zulipRoomStatus: "created",
  },
  {
    id: "3",
    name: "Police Department",
    email: "police@city.gov",
    phone: "(555) 345-6789",
    head: "Michael Davis",
    members: 68,
    status: "active",
    zulipRoomStatus: "created",
  },
];

const Departments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Department Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage department details, set up Zulip rooms, and configure permissions for cross-city collaboration.
          </p>
        </div>
        <Button onClick={() => setAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Department
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search departments..."
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
              <TableHead>Department Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Department Head</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Zulip Room</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockDepartments.map((dept) => (
              <TableRow key={dept.id}>
                <TableCell className="font-medium">{dept.name}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="text-muted-foreground">{dept.email}</div>
                    <div className="text-muted-foreground">{dept.phone}</div>
                  </div>
                </TableCell>
                <TableCell>{dept.head}</TableCell>
                <TableCell>{dept.members}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      dept.zulipRoomStatus === "created"
                        ? "default"
                        : dept.zulipRoomStatus === "pending"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {dept.zulipRoomStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={dept.status === "active" ? "default" : "secondary"}>
                    {dept.status}
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

      <AddDepartmentModal open={addModalOpen} onOpenChange={setAddModalOpen} />
    </div>
  );
};

export default Departments;

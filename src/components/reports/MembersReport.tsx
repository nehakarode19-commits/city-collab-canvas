import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface MembersReportProps {
  filters: any;
}

const mockMembers = [
  {
    id: 1,
    name: "John Anderson",
    email: "john.anderson@email.com",
    organization: "Los Angeles Downtown Chapter",
    role: "Admin",
    joinedDate: "2023-01-15",
    eventsAttended: 12,
    donations: 1500,
    status: "active",
  },
  {
    id: 2,
    name: "Sarah Williams",
    email: "sarah.williams@email.com",
    organization: "Manhattan Chapter",
    role: "Member",
    joinedDate: "2023-03-22",
    eventsAttended: 8,
    donations: 750,
    status: "active",
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "michael.chen@email.com",
    organization: "San Francisco Tech Chapter",
    role: "Volunteer",
    joinedDate: "2023-05-10",
    eventsAttended: 15,
    donations: 2200,
    status: "active",
  },
  {
    id: 4,
    name: "Jessica Martinez",
    email: "jessica.martinez@email.com",
    organization: "Houston Central Chapter",
    role: "Member",
    joinedDate: "2023-07-08",
    eventsAttended: 6,
    donations: 500,
    status: "active",
  },
  {
    id: 5,
    name: "David Rodriguez",
    email: "david.rodriguez@email.com",
    organization: "Miami South Beach Chapter",
    role: "Member",
    joinedDate: "2023-02-18",
    eventsAttended: 3,
    donations: 250,
    status: "inactive",
  },
];

export function MembersReport({ filters }: MembersReportProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Members Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Member Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead className="text-center">Events</TableHead>
                <TableHead className="text-right">Donations</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMembers.map((member) => (
                <TableRow key={member.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {member.email}
                  </TableCell>
                  <TableCell className="text-sm">{member.organization}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{member.role}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{member.joinedDate}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{member.eventsAttended}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-success">
                    ${member.donations.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={member.status === "active" ? "default" : "secondary"}
                    >
                      {member.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
}

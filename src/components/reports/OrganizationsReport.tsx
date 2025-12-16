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

interface OrganizationsReportProps {
  filters: any;
}

const mockOrganizations = [
  {
    id: 1,
    name: "Los Angeles Downtown Chapter",
    location: "Los Angeles, California",
    activeMembers: 145,
    totalEvents: 28,
    totalDonations: 45230,
    sponsors: 12,
    status: "active",
  },
  {
    id: 2,
    name: "Manhattan Chapter",
    location: "New York City, New York",
    activeMembers: 203,
    totalEvents: 42,
    totalDonations: 67800,
    sponsors: 18,
    status: "active",
  },
  {
    id: 3,
    name: "San Francisco Tech Chapter",
    location: "San Francisco, California",
    activeMembers: 156,
    totalEvents: 35,
    totalDonations: 52100,
    sponsors: 15,
    status: "active",
  },
  {
    id: 4,
    name: "Houston Central Chapter",
    location: "Houston, Texas",
    activeMembers: 98,
    totalEvents: 22,
    totalDonations: 34500,
    sponsors: 10,
    status: "active",
  },
  {
    id: 5,
    name: "Miami South Beach Chapter",
    location: "Miami, Florida",
    activeMembers: 89,
    totalEvents: 18,
    totalDonations: 28900,
    sponsors: 7,
    status: "inactive",
  },
];

export function OrganizationsReport({ filters }: OrganizationsReportProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Organizations Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Organization Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-center">Active Members</TableHead>
                <TableHead className="text-center">Total Events</TableHead>
                <TableHead className="text-right">Total Donations</TableHead>
                <TableHead className="text-center">Sponsors</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrganizations.map((org) => (
                <TableRow key={org.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {org.location}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{org.activeMembers}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{org.totalEvents}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-success">
                    ${org.totalDonations.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{org.sponsors}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={org.status === "active" ? "default" : "secondary"}
                    >
                      {org.status}
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

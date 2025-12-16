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
import { format } from "date-fns";

interface EventsReportProps {
  filters: any;
}

const mockEvents = [
  {
    id: 1,
    name: "Community Fundraiser Gala",
    organization: "Los Angeles Downtown Chapter",
    date: "2024-03-15",
    attendees: 245,
    volunteers: 35,
    donations: 12500,
    status: "completed",
  },
  {
    id: 2,
    name: "Tech Networking Mixer",
    organization: "San Francisco Tech Chapter",
    date: "2024-02-28",
    attendees: 180,
    volunteers: 22,
    donations: 8400,
    status: "completed",
  },
  {
    id: 3,
    name: "Spring Youth Workshop",
    organization: "Manhattan Chapter",
    date: "2024-04-10",
    attendees: 120,
    volunteers: 18,
    donations: 5600,
    status: "upcoming",
  },
  {
    id: 4,
    name: "Annual Charity Marathon",
    organization: "Houston Central Chapter",
    date: "2024-05-20",
    attendees: 450,
    volunteers: 60,
    donations: 25000,
    status: "upcoming",
  },
  {
    id: 5,
    name: "Summer Beach Cleanup",
    organization: "Miami South Beach Chapter",
    date: "2024-01-22",
    attendees: 95,
    volunteers: 28,
    donations: 3200,
    status: "completed",
  },
];

export function EventsReport({ filters }: EventsReportProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Events Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Attendees</TableHead>
                <TableHead className="text-center">Volunteers</TableHead>
                <TableHead className="text-right">Donations</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEvents.map((event) => (
                <TableRow key={event.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell className="text-sm">{event.organization}</TableCell>
                  <TableCell className="text-sm">
                    {format(new Date(event.date), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{event.attendees}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{event.volunteers}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-success">
                    ${event.donations.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={event.status === "completed" ? "default" : "secondary"}
                      className={
                        event.status === "upcoming"
                          ? "bg-primary/10 text-primary hover:bg-primary/20"
                          : ""
                      }
                    >
                      {event.status}
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

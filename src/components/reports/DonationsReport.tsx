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

interface DonationsReportProps {
  filters: any;
}

const mockDonations = [
  {
    id: 1,
    donorName: "Tech Corp Inc.",
    organization: "San Francisco Tech Chapter",
    amount: 25000,
    date: "2024-01-18",
    type: "Corporate",
    campaign: "Annual Platinum Package",
    status: "completed",
  },
  {
    id: 2,
    donorName: "John Doe",
    organization: "Los Angeles Downtown Chapter",
    amount: 5000,
    date: "2024-01-15",
    type: "Individual",
    campaign: "Community Food Bank",
    status: "completed",
  },
  {
    id: 3,
    donorName: "Community Alliance",
    organization: "Manhattan Chapter",
    amount: 15000,
    date: "2024-01-22",
    type: "Collaboration",
    campaign: "Education Fund",
    status: "completed",
  },
  {
    id: 4,
    donorName: "Jane Smith",
    organization: "Houston Central Chapter",
    amount: 3000,
    date: "2024-01-20",
    type: "Individual",
    campaign: "Healthcare Drive",
    status: "pending",
  },
  {
    id: 5,
    donorName: "Miami Foundation",
    organization: "Miami South Beach Chapter",
    amount: 10000,
    date: "2024-02-05",
    type: "Corporate",
    campaign: "Beach Cleanup Initiative",
    status: "completed",
  },
];

export function DonationsReport({ filters }: DonationsReportProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Donations Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Donor Name</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDonations.map((donation) => (
                <TableRow key={donation.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{donation.donorName}</TableCell>
                  <TableCell className="text-sm">{donation.organization}</TableCell>
                  <TableCell className="text-right font-semibold text-success">
                    ${donation.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm">
                    {format(new Date(donation.date), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        donation.type === "Corporate"
                          ? "bg-primary/10 text-primary"
                          : donation.type === "Individual"
                          ? "bg-success/10 text-success"
                          : "bg-accent/10 text-accent"
                      }
                    >
                      {donation.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{donation.campaign}</TableCell>
                  <TableCell>
                    <Badge
                      variant={donation.status === "completed" ? "default" : "secondary"}
                    >
                      {donation.status}
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

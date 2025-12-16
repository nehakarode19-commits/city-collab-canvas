import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Send, Check } from "lucide-react";

interface Chapter {
  id: number;
  srNo: number;
  name: string;
  location: string;
  activeMembers: number;
  events: number;
  activeSponsors: number;
  contactName: string;
  contactNumber: string;
  requestStatus: string | null;
}

interface ChaptersTableProps {
  chapters: Chapter[];
  onSendRequest: (chapter: Chapter) => void;
  requestStatus: Record<number, string>;
}

export function ChaptersTable({ chapters, onSendRequest, requestStatus }: ChaptersTableProps) {
  const getRequestButton = (chapter: Chapter) => {
    const status = requestStatus[chapter.id] || chapter.requestStatus;

    if (status === "accepted") {
      return (
        <Badge variant="default" className="bg-success hover:bg-success text-white">
          <Check className="mr-1 h-3 w-3" />
          Connected
        </Badge>
      );
    }

    if (status === "sent") {
      return (
        <Badge variant="secondary">
          <Check className="mr-1 h-3 w-3" />
          Sent
        </Badge>
      );
    }

    return (
      <Button
        size="sm"
        onClick={() => onSendRequest(chapter)}
      >
        <Send className="mr-2 h-4 w-4" />
        Send
      </Button>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Listing</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[80px]">SR No</TableHead>
                <TableHead className="w-[200px]">Chapter Name</TableHead>
                <TableHead>Chapter Location</TableHead>
                <TableHead className="text-center">Active Members</TableHead>
                <TableHead className="text-center">Events</TableHead>
                <TableHead className="text-center">Active Sponsors</TableHead>
                <TableHead>Contact Name</TableHead>
                <TableHead>Contact Number</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chapters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No chapters found
                  </TableCell>
                </TableRow>
              ) : (
                chapters.map((chapter) => (
                  <TableRow key={chapter.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{chapter.srNo}</TableCell>
                    <TableCell className="font-medium">{chapter.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {chapter.location}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{chapter.activeMembers}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{chapter.events}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{chapter.activeSponsors}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{chapter.contactName}</TableCell>
                    <TableCell className="text-sm font-mono">
                      {chapter.contactNumber}
                    </TableCell>
                    <TableCell className="text-right">
                      {getRequestButton(chapter)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {chapters.length > 0 && (
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
        )}
      </CardContent>
    </Card>
  );
}

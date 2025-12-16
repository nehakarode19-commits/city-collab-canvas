import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import { format } from "date-fns";

interface Collaboration {
  id: number;
  chapter1: string;
  chapter2: string;
  type: string;
  status: "ongoing" | "completed" | "pending";
  startDate: string;
  events: number;
}

interface CollaborationsTableProps {
  collaborations: Collaboration[];
}

export function CollaborationsTable({ collaborations }: CollaborationsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing":
        return "bg-primary/10 text-primary hover:bg-primary/20";
      case "completed":
        return "bg-success/10 text-success hover:bg-success/20";
      case "pending":
        return "bg-muted text-muted-foreground hover:bg-muted/80";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Collaboration Dashboard</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary">
              Ongoing: {collaborations.filter((c) => c.status === "ongoing").length}
            </Badge>
            <Badge variant="outline" className="bg-success/10 text-success">
              Completed: {collaborations.filter((c) => c.status === "completed").length}
            </Badge>
            <Badge variant="outline">
              Pending: {collaborations.filter((c) => c.status === "pending").length}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Chapter 1</TableHead>
                <TableHead>Chapter 2</TableHead>
                <TableHead>Collaboration Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead className="text-center">Events</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collaborations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No collaborations found
                  </TableCell>
                </TableRow>
              ) : (
                collaborations.map((collab) => (
                  <TableRow key={collab.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{collab.chapter1}</TableCell>
                    <TableCell className="font-medium">{collab.chapter2}</TableCell>
                    <TableCell className="text-sm">{collab.type}</TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(collab.startDate), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{collab.events}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusColor(collab.status)}>
                        {collab.status.charAt(0).toUpperCase() + collab.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

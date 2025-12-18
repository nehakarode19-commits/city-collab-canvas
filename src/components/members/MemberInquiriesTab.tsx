import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, CheckCircle, XCircle, Eye, Clock, 
  User, Mail, Building, Calendar, MessageSquare
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface MemberInquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  department: string;
  position: string;
  reason: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
}

const mockInquiries: MemberInquiry[] = [
  {
    id: "1",
    fullName: "Michael Thompson",
    email: "m.thompson@springfield.gov",
    phone: "(555) 234-5678",
    organization: "City of Springfield",
    department: "Public Works",
    position: "Project Manager",
    reason: "Looking to connect with other city officials for infrastructure collaboration.",
    submittedAt: "2024-01-15T09:30:00Z",
    status: "pending"
  },
  {
    id: "2",
    fullName: "Sarah Martinez",
    email: "s.martinez@riverside.gov",
    phone: "(555) 345-6789",
    organization: "City of Riverside",
    department: "Planning",
    position: "Urban Planner",
    reason: "Interested in sharing best practices for urban development projects.",
    submittedAt: "2024-01-14T14:20:00Z",
    status: "pending"
  },
  {
    id: "3",
    fullName: "David Chen",
    email: "d.chen@lakewood.gov",
    phone: "(555) 456-7890",
    organization: "City of Lakewood",
    department: "IT",
    position: "Systems Administrator",
    reason: "Want to participate in cross-city technology initiatives.",
    submittedAt: "2024-01-13T11:45:00Z",
    status: "pending"
  },
  {
    id: "4",
    fullName: "Jennifer Wilson",
    email: "j.wilson@oakdale.gov",
    phone: "(555) 567-8901",
    organization: "City of Oakdale",
    department: "Finance",
    position: "Budget Analyst",
    reason: "Seeking networking opportunities with finance professionals in government.",
    submittedAt: "2024-01-12T16:00:00Z",
    status: "approved"
  },
  {
    id: "5",
    fullName: "Robert Brown",
    email: "r.brown@email.com",
    phone: "(555) 678-9012",
    organization: "Unknown",
    department: "N/A",
    position: "Consultant",
    reason: "General interest in government operations.",
    submittedAt: "2024-01-11T10:15:00Z",
    status: "rejected"
  },
];

export function MemberInquiriesTab() {
  const [inquiries, setInquiries] = useState<MemberInquiry[]>(mockInquiries);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<MemberInquiry | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const pendingInquiries = inquiries.filter(i => i.status === "pending");
  const approvedInquiries = inquiries.filter(i => i.status === "approved");
  const rejectedInquiries = inquiries.filter(i => i.status === "rejected");

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = 
      inquiry.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.organization.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleApprove = (id: string) => {
    setInquiries(prev => prev.map(i => 
      i.id === id ? { ...i, status: "approved" as const } : i
    ));
    toast.success("Member inquiry approved successfully");
    setIsDetailOpen(false);
  };

  const handleReject = () => {
    if (selectedInquiry) {
      setInquiries(prev => prev.map(i => 
        i.id === selectedInquiry.id ? { ...i, status: "rejected" as const } : i
      ));
      toast.success("Member inquiry rejected");
      setIsRejectDialogOpen(false);
      setIsDetailOpen(false);
      setRejectionReason("");
    }
  };

  const openRejectDialog = (inquiry: MemberInquiry) => {
    setSelectedInquiry(inquiry);
    setIsRejectDialogOpen(true);
  };

  const statusConfig = {
    pending: { label: "Pending", variant: "outline" as const, color: "text-warning" },
    approved: { label: "Approved", variant: "default" as const, color: "text-success" },
    rejected: { label: "Rejected", variant: "destructive" as const, color: "text-destructive" },
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-warning" />
              <span className="text-sm text-muted-foreground">Pending</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-warning">{pendingInquiries.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm text-muted-foreground">Approved</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-success">{approvedInquiries.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-destructive" />
              <span className="text-sm text-muted-foreground">Rejected</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-destructive">{rejectedInquiries.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Inquiries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Member Inquiries</CardTitle>
          <CardDescription>Review and approve incoming membership requests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or organization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInquiries.map((inquiry) => {
                const status = statusConfig[inquiry.status];
                return (
                  <TableRow key={inquiry.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{inquiry.fullName}</p>
                        <p className="text-sm text-muted-foreground">{inquiry.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{inquiry.organization}</TableCell>
                    <TableCell>{inquiry.department}</TableCell>
                    <TableCell>{inquiry.position}</TableCell>
                    <TableCell>{format(new Date(inquiry.submittedAt), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedInquiry(inquiry);
                            setIsDetailOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {inquiry.status === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-success hover:text-success"
                              onClick={() => handleApprove(inquiry.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => openRejectDialog(inquiry)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Member Inquiry Details</DialogTitle>
            <DialogDescription>
              Review the membership request details
            </DialogDescription>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{selectedInquiry.fullName}</p>
                  <Badge variant={statusConfig[selectedInquiry.status].variant}>
                    {statusConfig[selectedInquiry.status].label}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                  <p className="text-sm font-medium">{selectedInquiry.email}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building className="h-4 w-4" />
                    Organization
                  </div>
                  <p className="text-sm font-medium">{selectedInquiry.organization}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    Position
                  </div>
                  <p className="text-sm font-medium">{selectedInquiry.position}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Submitted
                  </div>
                  <p className="text-sm font-medium">
                    {format(new Date(selectedInquiry.submittedAt), "MMM d, yyyy 'at' HH:mm")}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  Reason for Joining
                </div>
                <p className="text-sm p-3 rounded-lg bg-muted/50">{selectedInquiry.reason}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            {selectedInquiry?.status === "pending" && (
              <>
                <Button variant="outline" onClick={() => openRejectDialog(selectedInquiry)}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button onClick={() => handleApprove(selectedInquiry.id)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
            {selectedInquiry?.status !== "pending" && (
              <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Inquiry</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this membership request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRejectionReason("Unable to verify government affiliation")}
              >
                Unverified affiliation
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRejectionReason("Incomplete application information")}
              >
                Incomplete info
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRejectionReason("Does not meet eligibility requirements")}
              >
                Not eligible
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject Inquiry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
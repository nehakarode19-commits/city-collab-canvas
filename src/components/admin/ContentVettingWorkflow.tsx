import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, CheckCircle, XCircle, Clock, Eye, 
  ThumbsUp, ThumbsDown, AlertTriangle, Image, Link, FileVideo 
} from "lucide-react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ContentSubmission {
  id: string;
  partnerId: string;
  partnerName: string;
  title: string;
  type: "article" | "image" | "video" | "link";
  status: "pending" | "approved" | "rejected" | "revision";
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  preview: string;
}

const mockSubmissions: ContentSubmission[] = [
  { id: "1", partnerId: "p1", partnerName: "TechCorp Solutions", title: "Digital Transformation Guide for Cities", type: "article", status: "pending", submittedAt: "2024-01-15T10:30:00Z", preview: "A comprehensive guide to help municipal governments navigate the digital transformation journey..." },
  { id: "2", partnerId: "p2", partnerName: "SafeGuard Insurance", title: "Winter Safety Tips Infographic", type: "image", status: "pending", submittedAt: "2024-01-14T15:45:00Z", preview: "Infographic showcasing winter safety protocols for public employees..." },
  { id: "3", partnerId: "p3", partnerName: "Municipal Finance Group", title: "Budget Planning Webinar Recording", type: "video", status: "approved", submittedAt: "2024-01-12T09:00:00Z", reviewedAt: "2024-01-13T11:00:00Z", reviewedBy: "Admin User", preview: "Recording of our recent webinar on municipal budget planning best practices..." },
  { id: "4", partnerId: "p1", partnerName: "TechCorp Solutions", title: "Free IT Assessment Offer", type: "link", status: "rejected", submittedAt: "2024-01-10T14:20:00Z", reviewedAt: "2024-01-11T09:30:00Z", reviewedBy: "Admin User", rejectionReason: "Content is too promotional. Please focus on providing value rather than direct sales messaging.", preview: "Click here to claim your free IT assessment..." },
  { id: "5", partnerId: "p2", partnerName: "SafeGuard Insurance", title: "Emergency Response Training Video", type: "video", status: "revision", submittedAt: "2024-01-08T11:00:00Z", reviewedAt: "2024-01-09T14:00:00Z", reviewedBy: "Admin User", rejectionReason: "Video quality needs improvement. Please resubmit with higher resolution.", preview: "Training video covering emergency response procedures..." },
];

const statusConfig = {
  pending: { label: "Pending Review", variant: "outline" as const, icon: Clock, color: "text-muted-foreground" },
  approved: { label: "Approved", variant: "default" as const, icon: CheckCircle, color: "text-success" },
  rejected: { label: "Rejected", variant: "destructive" as const, icon: XCircle, color: "text-destructive" },
  revision: { label: "Needs Revision", variant: "secondary" as const, icon: AlertTriangle, color: "text-warning" },
};

const typeIcons = {
  article: FileText,
  image: Image,
  video: FileVideo,
  link: Link,
};

export function ContentVettingWorkflow() {
  const [submissions] = useState<ContentSubmission[]>(mockSubmissions);
  const [selectedContent, setSelectedContent] = useState<ContentSubmission | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [activeTab, setActiveTab] = useState("pending");

  const filteredSubmissions = submissions.filter(s => {
    if (activeTab === "pending") return s.status === "pending";
    if (activeTab === "approved") return s.status === "approved";
    if (activeTab === "rejected") return s.status === "rejected" || s.status === "revision";
    return true;
  });

  const stats = {
    pending: submissions.filter(s => s.status === "pending").length,
    approved: submissions.filter(s => s.status === "approved").length,
    rejected: submissions.filter(s => s.status === "rejected" || s.status === "revision").length,
  };

  const handleApprove = () => {
    // In a real app, this would call an API
    setReviewDialogOpen(false);
    setSelectedContent(null);
  };

  const handleReject = () => {
    // In a real app, this would call an API with rejectionReason
    setReviewDialogOpen(false);
    setSelectedContent(null);
    setRejectionReason("");
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setActiveTab("pending")}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Pending Review</span>
            </div>
            <div className="text-2xl font-bold mt-1">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-success transition-colors" onClick={() => setActiveTab("approved")}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm text-muted-foreground">Approved</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-success">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-destructive transition-colors" onClick={() => setActiveTab("rejected")}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-destructive" />
              <span className="text-sm text-muted-foreground">Rejected/Revision</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-destructive">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Content List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Content Submissions
          </CardTitle>
          <CardDescription>Review and approve partner content before publication</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="pending">
                Pending ({stats.pending})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({stats.approved})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({stats.rejected})
              </TabsTrigger>
            </TabsList>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Content</TableHead>
                  <TableHead>Partner</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((content) => {
                  const statusConf = statusConfig[content.status];
                  const StatusIcon = statusConf.icon;
                  const TypeIcon = typeIcons[content.type];
                  return (
                    <TableRow key={content.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <TypeIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{content.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>{content.partnerName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{content.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConf.variant} className="flex items-center gap-1 w-fit">
                          <StatusIcon className={`h-3 w-3 ${statusConf.color}`} />
                          {statusConf.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(content.submittedAt), "MMM d, HH:mm")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => { setSelectedContent(content); setReviewDialogOpen(true); }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {content.status === "pending" && (
                            <>
                              <Button variant="ghost" size="sm" className="text-success hover:text-success">
                                <ThumbsUp className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                <ThumbsDown className="h-4 w-4" />
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
          </Tabs>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Content</DialogTitle>
            <DialogDescription>
              Submitted by {selectedContent?.partnerName}
            </DialogDescription>
          </DialogHeader>
          {selectedContent && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">{selectedContent.title}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline">{selectedContent.type}</Badge>
                  <span>•</span>
                  <span>Submitted {format(new Date(selectedContent.submittedAt), "MMM d, yyyy 'at' HH:mm")}</span>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm">{selectedContent.preview}</p>
              </div>

              {selectedContent.status === "pending" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rejection Reason (if applicable)</label>
                  <Textarea
                    placeholder="Explain why the content is being rejected or needs revision..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </div>
              )}

              {selectedContent.rejectionReason && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  <p className="text-sm font-medium text-destructive">Rejection Reason:</p>
                  <p className="text-sm text-muted-foreground mt-1">{selectedContent.rejectionReason}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Close
            </Button>
            {selectedContent?.status === "pending" && (
              <>
                <Button variant="destructive" onClick={handleReject} disabled={!rejectionReason}>
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button onClick={handleApprove}>
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

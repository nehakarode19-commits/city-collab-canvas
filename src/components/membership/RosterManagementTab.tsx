import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, Download, FileSpreadsheet, CheckCircle, XCircle, Clock, AlertTriangle, Users, UserMinus, Briefcase } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "sonner";
import { ImportedMembersList, ImportedMember } from "./ImportedMembersList";

interface RosterUpload {
  id: string;
  file_name: string;
  status: string;
  total_records: number;
  new_users: number;
  updated_users: number;
  deactivated_users: number;
  errors: unknown[];
  created_at: string;
  processed_at: string | null;
}

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  processing: "outline",
  completed: "default",
  failed: "destructive",
};

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="h-3 w-3" />,
  processing: <Clock className="h-3 w-3 animate-spin" />,
  completed: <CheckCircle className="h-3 w-3" />,
  failed: <XCircle className="h-3 w-3" />,
};

export function RosterManagementTab() {
  const [isDragging, setIsDragging] = useState(false);
  const [showMemberStatusDialog, setShowMemberStatusDialog] = useState(false);
  const [memberStatusType, setMemberStatusType] = useState<"retired" | "job_change" | null>(null);
  const [importedMembers, setImportedMembers] = useState<ImportedMember[]>([]);

  // Mock data for demonstration
  const mockUploads: RosterUpload[] = [
    { id: "1", file_name: "Q1_2024_roster.xlsx", status: "completed", total_records: 245, new_users: 12, updated_users: 28, deactivated_users: 3, errors: [], created_at: "2024-01-15T10:30:00Z", processed_at: "2024-01-15T10:35:00Z" },
    { id: "2", file_name: "December_updates.csv", status: "completed", total_records: 180, new_users: 5, updated_users: 15, deactivated_users: 8, errors: [], created_at: "2024-01-10T14:20:00Z", processed_at: "2024-01-10T14:25:00Z" },
    { id: "3", file_name: "IT_dept_roster.xlsx", status: "processing", total_records: 45, new_users: 2, updated_users: 8, deactivated_users: 0, errors: [], created_at: "2024-01-08T09:00:00Z", processed_at: null },
    { id: "4", file_name: "HR_annual_review.csv", status: "failed", total_records: 320, new_users: 0, updated_users: 0, deactivated_users: 0, errors: [{ row: 45, message: "Invalid email format" }], created_at: "2024-01-05T16:45:00Z", processed_at: null },
    { id: "5", file_name: "Finance_team.xlsx", status: "completed", total_records: 62, new_users: 4, updated_users: 10, deactivated_users: 1, errors: [], created_at: "2024-01-02T11:15:00Z", processed_at: "2024-01-02T11:18:00Z" },
    { id: "6", file_name: "Parks_dept_update.csv", status: "pending", total_records: 38, new_users: 0, updated_users: 0, deactivated_users: 0, errors: [], created_at: "2024-01-01T08:00:00Z", processed_at: null },
  ];

  const { data: dbUploads, isLoading } = useQuery({
    queryKey: ["roster-uploads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roster_uploads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data as RosterUpload[];
    },
  });

  const uploads = dbUploads?.length ? dbUploads : mockUploads;

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0], null);
    }
  }, []);

  const handleFileUpload = (file: File, statusType: "retired" | "job_change" | null) => {
    // Validate file type
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload an Excel or CSV file");
      return;
    }

    // Generate mock imported members based on status type
    const mockNames = [
      { name: "Rajesh Kumar", email: "rajesh.kumar@city.gov", dept: "Public Works", prevRole: "Senior Engineer" },
      { name: "Priya Sharma", email: "priya.sharma@city.gov", dept: "Finance", prevRole: "Budget Analyst" },
      { name: "Amit Patel", email: "amit.patel@city.gov", dept: "IT", prevRole: "System Administrator" },
      { name: "Sunita Verma", email: "sunita.verma@city.gov", dept: "HR", prevRole: "HR Manager" },
      { name: "Vikram Singh", email: "vikram.singh@city.gov", dept: "Parks & Recreation", prevRole: "Park Supervisor" },
      { name: "Meena Joshi", email: "meena.joshi@city.gov", dept: "Health", prevRole: "Health Inspector" },
    ];

    const status = statusType || "retired";
    const newImported: ImportedMember[] = mockNames.map((m, i) => ({
      id: `imp-${Date.now()}-${i}`,
      name: m.name,
      email: m.email,
      department: m.dept,
      status: i % 3 === 0 ? "retired" : status,
      previousRole: m.prevRole,
      newRole: status === "job_change" && i % 3 !== 0 ? "Transferred to " + ["Admin", "Operations", "Planning"][i % 3] : undefined,
      importedAt: new Date().toISOString(),
      fileName: file.name,
    }));

    setImportedMembers(newImported);
    toast.success(`${newImported.length} members imported from "${file.name}"`);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0], null);
    }
  };

  const downloadTemplate = () => {
    // Create a simple CSV template
    const headers = "Email,Full Name,Department,Role\n";
    const example = "john.doe@city.gov,John Doe,IT,Staff\n";
    const blob = new Blob([headers + example], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "roster_template.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Template downloaded");
  };

  const lastUpload = uploads?.[0];
  const stats = lastUpload
    ? {
        total: lastUpload.total_records,
        new: lastUpload.new_users,
        updated: lastUpload.updated_users,
        deactivated: lastUpload.deactivated_users,
      }
    : { total: 0, new: 0, updated: 0, deactivated: 0 };

  return (
    <div className="space-y-6">
      {/* Stats from last upload */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Records</span>
            </div>
            <div className="text-2xl font-bold mt-1">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm text-muted-foreground">New Users</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-success">{stats.new}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <span className="text-sm text-muted-foreground">Updated</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-warning">{stats.updated}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-destructive" />
              <span className="text-sm text-muted-foreground">Deactivated</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-destructive">{stats.deactivated}</div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Roster</CardTitle>
          <CardDescription>
            Upload an Excel or CSV file to update the user roster. The system will compare with existing data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Drag and drop your roster file here</p>
            <p className="text-sm text-muted-foreground mt-1">
              Supported formats: .xlsx, .xls, .csv
            </p>
            <div className="mt-4 flex items-center justify-center gap-4">
              <Button onClick={() => setShowMemberStatusDialog(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Browse Files
              </Button>
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload History */}
      {/* Imported Members List */}
      <ImportedMembersList members={importedMembers} onClear={() => setImportedMembers([])} />

      {/* Upload History */}
      <Card>
        <CardHeader>
          <CardTitle>Upload History</CardTitle>
          <CardDescription>Recent roster uploads and their processing status</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : !uploads?.length ? (
            <div className="text-center py-8 text-muted-foreground">No uploads yet</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Changes</TableHead>
                  <TableHead>Uploaded</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploads.map((upload) => (
                  <TableRow key={upload.id}>
                    <TableCell className="font-medium">{upload.file_name}</TableCell>
                    <TableCell>
                      <Badge variant={statusColors[upload.status]} className="flex items-center gap-1 w-fit">
                        {statusIcons[upload.status]}
                        {upload.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{upload.total_records}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-success">+{upload.new_users}</span>
                        <span className="text-warning">~{upload.updated_users}</span>
                        <span className="text-destructive">-{upload.deactivated_users}</span>
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(upload.created_at), "MMM d, HH:mm")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      {/* Member Status Dialog */}
      <Dialog open={showMemberStatusDialog} onOpenChange={setShowMemberStatusDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Member Status Update</DialogTitle>
            <DialogDescription>
              Please select the reason for uploading a roster update.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4">
            <Button
              variant={memberStatusType === "retired" ? "default" : "outline"}
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => setMemberStatusType("retired")}
            >
              <UserMinus className="h-6 w-6" />
              <span className="font-medium">Member Retired</span>
              <span className="text-xs text-muted-foreground">The member has retired from service</span>
            </Button>
            <Button
              variant={memberStatusType === "job_change" ? "default" : "outline"}
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => setMemberStatusType("job_change")}
            >
              <Briefcase className="h-6 w-6" />
              <span className="font-medium">Changed Job</span>
              <span className="text-xs text-muted-foreground">The member has changed their position or department</span>
            </Button>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setShowMemberStatusDialog(false); setMemberStatusType(null); }}>
              Cancel
            </Button>
            <label>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    handleFileUpload(files[0], memberStatusType);
                  }
                  setShowMemberStatusDialog(false);
                  setMemberStatusType(null);
                }}
                className="hidden"
                disabled={!memberStatusType}
              />
              <Button asChild disabled={!memberStatusType}>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Continue & Upload
                </span>
              </Button>
            </label>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

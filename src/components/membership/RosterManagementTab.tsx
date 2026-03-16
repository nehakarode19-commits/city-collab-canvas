import { useState, useCallback, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Upload, Download, FileSpreadsheet, CheckCircle, XCircle, Clock, AlertTriangle, Users, UserX, Briefcase } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { ImportPreviewDialog, type ImportedMember } from "./ImportResultsTable";

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
  const [importedMembers, setImportedMembers] = useState<ImportedMember[]>([]);
  const [importFileName, setImportFileName] = useState("");
  const [showResults, setShowResults] = useState(false);

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
      handleFileUpload(files[0]);
    }
  }, []);

  const parseExcelFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);

        if (jsonData.length === 0) {
          toast.error("The file is empty or has no valid data");
          return;
        }

        // Map Excel columns to ImportedMember structure
        const members: ImportedMember[] = jsonData.map((row) => {
          const name = String(row["Name"] || row["Full Name"] || row["full_name"] || row["name"] || "");
          const email = String(row["Email"] || row["email"] || row["E-mail"] || "");
          const department = String(row["Department"] || row["department"] || row["Dept"] || "");
          const role = String(row["Role"] || row["Position"] || row["role"] || row["position"] || row["Title"] || "");
          const organization = String(row["Organization"] || row["organization"] || row["Org"] || row["Company"] || "");
          const phone = String(row["Phone"] || row["phone"] || row["Contact"] || "");
          const rawStatus = String(row["Status"] || row["status"] || row["Member Status"] || "active").toLowerCase().trim();
          const previousRole = String(row["Previous Role"] || row["previous_role"] || row["Old Role"] || row["Old Position"] || "");
          const previousDepartment = String(row["Previous Department"] || row["previous_department"] || row["Old Department"] || "");
          const retiredDate = String(row["Retired Date"] || row["retired_date"] || row["Retirement Date"] || "");
          const newOrganization = String(row["New Organization"] || row["new_organization"] || "");

          let status: ImportedMember["status"] = "active";
          if (rawStatus.includes("retire")) status = "retired";
          else if (rawStatus.includes("job") || rawStatus.includes("change") || rawStatus.includes("moved") || rawStatus.includes("transferred")) status = "job_changed";
          else if (rawStatus.includes("new")) status = "new";
          else if (rawStatus.includes("active")) status = "active";
          else if (rawStatus.includes("unchanged") || rawStatus.includes("same")) status = "unchanged";

          return {
            name,
            email,
            department,
            role,
            organization,
            phone,
            status,
            previousRole: previousRole !== "undefined" && previousRole !== "" ? previousRole : undefined,
            previousDepartment: previousDepartment !== "undefined" && previousDepartment !== "" ? previousDepartment : undefined,
            retiredDate: retiredDate !== "undefined" && retiredDate !== "" ? retiredDate : undefined,
            newOrganization: newOrganization !== "undefined" && newOrganization !== "" ? newOrganization : undefined,
          };
        });

        setImportedMembers(members);
        setImportFileName(file.name);
        setShowResults(true);

        const retired = members.filter(m => m.status === "retired").length;
        const jobChanged = members.filter(m => m.status === "job_changed").length;
        toast.success(`Imported ${members.length} records — ${retired} retired, ${jobChanged} job changed`);
      } catch (err) {
        toast.error("Failed to parse the file. Please check the format.");
        console.error("Excel parse error:", err);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleFileUpload = (file: File) => {
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
      toast.error("Please upload an Excel or CSV file");
      return;
    }
    parseExcelFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const downloadTemplate = () => {
    const headers = "Name,Email,Department,Role,Organization,Phone,Status,Previous Role,Previous Department,Retired Date,New Organization\n";
    const ex1 = "John Doe,john.doe@city.gov,IT,Staff,City of Springfield,(555) 123-4567,active,,,\n";
    const ex2 = "Jane Smith,jane@city.gov,Finance,Analyst,City of Riverside,(555) 234-5678,retired,,,2024-01-01,\n";
    const ex3 = "Bob Lee,bob@city.gov,HR,Manager,City of Lakewood,(555) 345-6789,job_changed,Developer,IT,,City of Oakdale\n";
    const blob = new Blob([headers + ex1 + ex2 + ex3], { type: "text/csv" });
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

  const handleConfirmImport = () => {
    toast.success(`Successfully imported ${importedMembers.length} records`);
    setShowResults(false);
    setImportedMembers([]);
    setImportFileName("");
  };

  const clearPreview = () => {
    setShowResults(false);
    setImportedMembers([]);
    setImportFileName("");
  };

  return (
    <>
      <ImportPreviewDialog
        open={showResults}
        onOpenChange={(open) => { if (!open) clearPreview(); }}
        members={importedMembers}
        fileName={importFileName}
        onConfirmImport={handleConfirmImport}
      />
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
                <label>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Browse Files
                    </span>
                  </Button>
                </label>
                <Button variant="outline" onClick={downloadTemplate}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

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
      </div>
    </>
  );
}

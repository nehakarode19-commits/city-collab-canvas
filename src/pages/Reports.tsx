import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, Filter } from "lucide-react";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { OrganizationsReport } from "@/components/reports/OrganizationsReport";
import { MembersReport } from "@/components/reports/MembersReport";
import { EventsReport } from "@/components/reports/EventsReport";
import { DonationsReport } from "@/components/reports/DonationsReport";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Reports = () => {
  const [activeFilters, setActiveFilters] = useState({
    dateRange: { from: undefined, to: undefined },
    location: "all",
    status: "all",
  });

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
  };

  const handleExport = (format: "csv" | "pdf" | "excel") => {
    // Export logic will be implemented here
    console.log(`Exporting as ${format}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-1">
            Generate and export comprehensive reports
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport("csv")}>
              <FileText className="mr-2 h-4 w-4" />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("pdf")}>
              <FileText className="mr-2 h-4 w-4" />
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("excel")}>
              <FileText className="mr-2 h-4 w-4" />
              Export as Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ReportFilters onChange={handleFilterChange} />
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <Tabs defaultValue="organizations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
        </TabsList>

        <TabsContent value="organizations">
          <OrganizationsReport filters={activeFilters} />
        </TabsContent>

        <TabsContent value="members">
          <MembersReport filters={activeFilters} />
        </TabsContent>

        <TabsContent value="events">
          <EventsReport filters={activeFilters} />
        </TabsContent>

        <TabsContent value="donations">
          <DonationsReport filters={activeFilters} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;

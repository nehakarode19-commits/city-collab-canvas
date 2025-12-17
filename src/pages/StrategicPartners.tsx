import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StrategicPartnerDashboard } from "@/components/admin/StrategicPartnerDashboard";
import { ContentVettingWorkflow } from "@/components/admin/ContentVettingWorkflow";
import { Building2, FileCheck, BarChart3 } from "lucide-react";

export default function StrategicPartners() {
  const [activeTab, setActiveTab] = useState("partners");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Strategic Partners</h1>
          <p className="text-muted-foreground">Manage Class B sponsors and content vetting</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
          <TabsTrigger value="partners" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Partner Analytics
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            Content Vetting
          </TabsTrigger>
        </TabsList>

        <TabsContent value="partners">
          <StrategicPartnerDashboard />
        </TabsContent>

        <TabsContent value="content">
          <ContentVettingWorkflow />
        </TabsContent>
      </Tabs>
    </div>
  );
}

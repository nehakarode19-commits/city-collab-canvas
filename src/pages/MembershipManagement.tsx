import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RosterManagementTab } from "@/components/membership/RosterManagementTab";
import { ProfileIntelligenceTab } from "@/components/membership/ProfileIntelligenceTab";
import { UserProfileManagement } from "@/components/admin/UserProfileManagement";
import { DataManagementPanel } from "@/components/admin/DataManagementPanel";
import { Users, Upload, Tags, User, Database } from "lucide-react";

export default function MembershipManagement() {
  const [activeTab, setActiveTab] = useState("roster");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Users className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Membership & Identity</h1>
          <p className="text-muted-foreground">Manage roster, skills, user profiles, and data</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="roster" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Roster
          </TabsTrigger>
          <TabsTrigger value="profiles" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            User Profiles
          </TabsTrigger>
          <TabsTrigger value="intelligence" className="flex items-center gap-2">
            <Tags className="h-4 w-4" />
            Intelligence
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roster">
          <RosterManagementTab />
        </TabsContent>
        <TabsContent value="profiles">
          <UserProfileManagement />
        </TabsContent>
        <TabsContent value="intelligence">
          <ProfileIntelligenceTab />
        </TabsContent>
        <TabsContent value="data">
          <DataManagementPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

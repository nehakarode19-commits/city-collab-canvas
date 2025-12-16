import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RosterManagementTab } from "@/components/membership/RosterManagementTab";
import { ProfileIntelligenceTab } from "@/components/membership/ProfileIntelligenceTab";
import { Users, Upload, Tags } from "lucide-react";

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
          <p className="text-muted-foreground">Manage roster, skills, and user profiles</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
          <TabsTrigger value="roster" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Roster Management
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Tags className="h-4 w-4" />
            Profile Intelligence
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roster">
          <RosterManagementTab />
        </TabsContent>
        <TabsContent value="profile">
          <ProfileIntelligenceTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

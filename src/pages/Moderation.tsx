import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserBansTab } from "@/components/moderation/UserBansTab";
import { ContentModerationTab } from "@/components/moderation/ContentModerationTab";
import { ViolationLogsTab } from "@/components/moderation/ViolationLogsTab";
import { Shield, Ban, AlertTriangle, FileWarning } from "lucide-react";

export default function Moderation() {
  const [activeTab, setActiveTab] = useState("bans");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
          <Shield className="h-5 w-5 text-destructive" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Moderation</h1>
          <p className="text-muted-foreground">Manage user bans, content moderation, and violations</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="bans" className="flex items-center gap-2">
            <Ban className="h-4 w-4" />
            User Bans
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileWarning className="h-4 w-4" />
            Content Queue
          </TabsTrigger>
          <TabsTrigger value="violations" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Violations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bans">
          <UserBansTab />
        </TabsContent>
        <TabsContent value="content">
          <ContentModerationTab />
        </TabsContent>
        <TabsContent value="violations">
          <ViolationLogsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

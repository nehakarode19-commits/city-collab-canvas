import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChannelListTab } from "@/components/channels/ChannelListTab";
import { ChannelOwnershipTab } from "@/components/channels/ChannelOwnershipTab";
import { FileRestrictionsTab } from "@/components/channels/FileRestrictionsTab";
import { Hash, Users, FileUp } from "lucide-react";

export default function ChannelManagement() {
  const [activeTab, setActiveTab] = useState("channels");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Hash className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Channel Management</h1>
          <p className="text-muted-foreground">Create channels, manage ownership, and configure settings</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="channels" className="flex items-center gap-2">
            <Hash className="h-4 w-4" />
            Channels
          </TabsTrigger>
          <TabsTrigger value="ownership" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Ownership
          </TabsTrigger>
          <TabsTrigger value="files" className="flex items-center gap-2">
            <FileUp className="h-4 w-4" />
            File Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="channels">
          <ChannelListTab />
        </TabsContent>
        <TabsContent value="ownership">
          <ChannelOwnershipTab />
        </TabsContent>
        <TabsContent value="files">
          <FileRestrictionsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

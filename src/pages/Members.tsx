import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Users, Upload, User } from "lucide-react";
import { AddMemberModal } from "@/components/members/AddMemberModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RosterManagementTab } from "@/components/membership/RosterManagementTab";
import { UserProfileManagement } from "@/components/admin/UserProfileManagement";

const Members = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profiles");

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Members</h1>
            <p className="text-muted-foreground">Manage roster and user profiles</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
            <TabsTrigger value="profiles" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              User Profiles
            </TabsTrigger>
            <TabsTrigger value="roster" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Roster
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profiles" className="space-y-4">
            <div className="flex items-center justify-end">
              <Button onClick={() => setAddModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Government Employee
              </Button>
            </div>
            <UserProfileManagement />
          </TabsContent>

          <TabsContent value="roster">
            <RosterManagementTab />
          </TabsContent>
        </Tabs>
      </div>
      
      <AddMemberModal open={addModalOpen} onOpenChange={setAddModalOpen} />
    </>
  );
};

export default Members;

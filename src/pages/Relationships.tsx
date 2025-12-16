import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, CheckCircle2, Network, Search } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { HierarchyTree } from "@/components/relationships/HierarchyTree";
import { ChaptersTable } from "@/components/relationships/ChaptersTable";
import { CollaborationsTable } from "@/components/relationships/CollaborationsTable";
import { SendRequestModal } from "@/components/relationships/SendRequestModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockChapters = [
  {
    id: 1,
    srNo: 1,
    name: "Los Angeles Downtown Chapter",
    location: "Los Angeles, California",
    activeMembers: 145,
    events: 28,
    activeSponsors: 12,
    contactName: "John Anderson",
    contactNumber: "+1 (310) 555-0123",
    requestStatus: null,
  },
  {
    id: 2,
    srNo: 2,
    name: "Manhattan Chapter",
    location: "New York City, New York",
    activeMembers: 203,
    events: 42,
    activeSponsors: 18,
    contactName: "Sarah Williams",
    contactNumber: "+1 (212) 555-0124",
    requestStatus: "sent",
  },
  {
    id: 3,
    srNo: 3,
    name: "San Francisco Tech Chapter",
    location: "San Francisco, California",
    activeMembers: 156,
    events: 35,
    activeSponsors: 15,
    contactName: "Michael Chen",
    contactNumber: "+1 (415) 555-0125",
    requestStatus: "accepted",
  },
  {
    id: 4,
    srNo: 4,
    name: "Houston Central Chapter",
    location: "Houston, Texas",
    activeMembers: 98,
    events: 22,
    activeSponsors: 10,
    contactName: "Jessica Martinez",
    contactNumber: "+1 (713) 555-0126",
    requestStatus: null,
  },
  {
    id: 5,
    srNo: 5,
    name: "Miami South Beach Chapter",
    location: "Miami, Florida",
    activeMembers: 89,
    events: 18,
    activeSponsors: 7,
    contactName: "David Rodriguez",
    contactNumber: "+1 (305) 555-0127",
    requestStatus: "sent",
  },
  {
    id: 6,
    srNo: 6,
    name: "Brooklyn Chapter",
    location: "Brooklyn, New York",
    activeMembers: 87,
    events: 16,
    activeSponsors: 8,
    contactName: "Emily Thompson",
    contactNumber: "+1 (718) 555-0128",
    requestStatus: null,
  },
  {
    id: 7,
    srNo: 7,
    name: "Austin Downtown Chapter",
    location: "Austin, Texas",
    activeMembers: 125,
    events: 30,
    activeSponsors: 11,
    contactName: "Robert Brown",
    contactNumber: "+1 (512) 555-0129",
    requestStatus: "accepted",
  },
];

const mockCollaborations = [
  {
    id: 1,
    chapter1: "Los Angeles Downtown Chapter",
    chapter2: "San Francisco Tech Chapter",
    type: "Joint Event",
    status: "ongoing" as const,
    startDate: "2024-01-15",
    events: 3,
  },
  {
    id: 2,
    chapter1: "Manhattan Chapter",
    chapter2: "Brooklyn Chapter",
    type: "Resource Sharing",
    status: "completed" as const,
    startDate: "2023-11-10",
    events: 5,
  },
  {
    id: 3,
    chapter1: "Houston Central Chapter",
    chapter2: "Austin Downtown Chapter",
    type: "Volunteer Exchange",
    status: "pending" as const,
    startDate: "2024-02-01",
    events: 0,
  },
];

const Relationships = () => {
  const [sendRequestOpen, setSendRequestOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [searchCommunity, setSearchCommunity] = useState("");
  const [searchLocation, setSearchLocation] = useState("all");
  const [chapterRequestStatus, setChapterRequestStatus] = useState<Record<number, string>>({});

  const handleSendRequest = (chapter: any) => {
    setSelectedChapter(chapter);
    setSendRequestOpen(true);
  };

  const handleRequestSent = (chapterId: number) => {
    setChapterRequestStatus((prev) => ({ ...prev, [chapterId]: "sent" }));
  };

  const filteredChapters = mockChapters.filter((chapter) => {
    const matchesCommunity = chapter.name.toLowerCase().includes(searchCommunity.toLowerCase());
    const matchesLocation =
      searchLocation === "all" || chapter.location.includes(searchLocation);
    return matchesCommunity && matchesLocation;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Relationships & Collaboration</h1>
          <p className="text-muted-foreground mt-1">
            Manage chapter hierarchies and collaborations
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Sent Requests"
          value="34"
          change="+8"
          changeType="increase"
          icon={Send}
          iconColor="text-primary"
        />
        <StatCard
          title="Connections Accepted"
          value="28"
          change="+12"
          changeType="increase"
          icon={CheckCircle2}
          iconColor="text-success"
        />
        <StatCard
          title="Hierarchy Status"
          value="156"
          change="+5"
          changeType="increase"
          icon={Network}
          iconColor="text-info"
        />
      </div>

      {/* Visual Hierarchy Tree */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Hierarchy Visualization</h2>
        <HierarchyTree />
      </div>

      {/* Tabs for Chapters and Collaborations */}
      <Tabs defaultValue="chapters" className="space-y-6">
        <TabsList>
          <TabsTrigger value="chapters">Chapters</TabsTrigger>
          <TabsTrigger value="collaborations">Collaborations</TabsTrigger>
        </TabsList>

        {/* Chapters Tab */}
        <TabsContent value="chapters" className="space-y-6">
          {/* Search & Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[250px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search for Community..."
                      value={searchCommunity}
                      onChange={(e) => setSearchCommunity(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Select value={searchLocation} onValueChange={setSearchLocation}>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Search for Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="California">California</SelectItem>
                    <SelectItem value="New York">New York</SelectItem>
                    <SelectItem value="Texas">Texas</SelectItem>
                    <SelectItem value="Florida">Florida</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Chapters Table */}
          <ChaptersTable
            chapters={filteredChapters}
            onSendRequest={handleSendRequest}
            requestStatus={chapterRequestStatus}
          />
        </TabsContent>

        {/* Collaborations Tab */}
        <TabsContent value="collaborations">
          <CollaborationsTable collaborations={mockCollaborations} />
        </TabsContent>
      </Tabs>

      {/* Send Request Modal */}
      <SendRequestModal
        open={sendRequestOpen}
        onOpenChange={setSendRequestOpen}
        chapter={selectedChapter}
        onRequestSent={() => {
          if (selectedChapter) {
            handleRequestSent(selectedChapter.id);
          }
        }}
      />
    </div>
  );
};

export default Relationships;

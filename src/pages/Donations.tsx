import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DollarSign, TrendingUp, Users, Calendar, Plus, Search } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { DonationCard } from "@/components/donations/DonationCard";
import { DonorTable } from "@/components/donations/DonorTable";
import { CreateDonationModal } from "@/components/donations/CreateDonationModal";
import { CreateDonationRecordModal } from "@/components/donations/CreateDonationRecordModal";
import { EditDonationModal } from "@/components/donations/EditDonationModal";
import { DeleteDonationModal } from "@/components/donations/DeleteDonationModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockDonations = [
  {
    id: 1,
    title: "Pinjrapole",
    category: "Animal Welfare",
    subcategory: "Item Donation",
    required: 20000,
    collected: 10000,
    description: "Support our animal welfare initiative with essential supplies and care items.",
  },
  {
    id: 2,
    title: "Community Food Bank",
    category: "Social Welfare",
    subcategory: "Monetary Donation",
    required: 50000,
    collected: 35000,
    description: "Help us provide nutritious meals to families in need across the city.",
  },
  {
    id: 3,
    title: "Education Fund",
    category: "Education",
    subcategory: "Scholarship",
    required: 100000,
    collected: 75000,
    description: "Empower underprivileged students with access to quality education.",
  },
  {
    id: 4,
    title: "Healthcare Drive",
    category: "Healthcare",
    subcategory: "Medical Supplies",
    required: 30000,
    collected: 18000,
    description: "Provide essential medical supplies to rural healthcare centers.",
  },
];

const mockDonors = [
  {
    id: 1,
    name: "John Doe",
    amount: 5000,
    invoiceRef: "INV-2024-001",
    date: "2024-01-15",
    type: "Individual",
  },
  {
    id: 2,
    name: "Tech Corp Inc.",
    amount: 25000,
    invoiceRef: "INV-2024-002",
    date: "2024-01-18",
    type: "Corporate",
  },
  {
    id: 3,
    name: "Jane Smith",
    amount: 3000,
    invoiceRef: "INV-2024-003",
    date: "2024-01-20",
    type: "Individual",
  },
  {
    id: 4,
    name: "Community Alliance",
    amount: 15000,
    invoiceRef: "INV-2024-004",
    date: "2024-01-22",
    type: "Collaboration",
  },
];

const Donations = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [donationType, setDonationType] = useState("all");
  const [createCampaignModalOpen, setCreateCampaignModalOpen] = useState(false);
  const [createDonationModalOpen, setCreateDonationModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<number | null>(null);

  const handleEdit = (id: number) => {
    setSelectedDonation(id);
    setEditModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setSelectedDonation(id);
    setDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Donations</h1>
          <p className="text-muted-foreground mt-1">Manage campaigns, donors, and contributions</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setCreateCampaignModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
          <Button onClick={() => setCreateDonationModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Donation
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Donations (This Year)"
          value="$145,230"
          change="+23%"
          changeType="increase"
          icon={DollarSign}
          iconColor="text-success"
        />
        <StatCard
          title="Active Donors"
          value="342"
          change="+12"
          changeType="increase"
          icon={Users}
          iconColor="text-primary"
        />
        <StatCard
          title="This Month"
          value="$18,780"
          change="+8%"
          changeType="increase"
          icon={Calendar}
          iconColor="text-accent"
        />
        <StatCard
          title="Donation Growth"
          value="+15%"
          change="vs last month"
          changeType="increase"
          icon={TrendingUp}
          iconColor="text-info"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList>
          <TabsTrigger value="campaigns">Donation Campaigns</TabsTrigger>
          <TabsTrigger value="donors">Donor List</TabsTrigger>
        </TabsList>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search campaigns..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Select value={eventFilter} onValueChange={setEventFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Choose Event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="charity">Charity Gala</SelectItem>
                    <SelectItem value="fundraiser">Fundraiser 2024</SelectItem>
                    <SelectItem value="marathon">Marathon Event</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={donationType} onValueChange={setDonationType}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Donation Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="individual">Individual Donations</SelectItem>
                    <SelectItem value="corporate">Corporate Sponsorships</SelectItem>
                    <SelectItem value="collaboration">Collaboration Donations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Donation Items Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {mockDonations.map((donation) => (
              <DonationCard
                key={donation.id}
                {...donation}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </TabsContent>

        {/* Donors Tab */}
        <TabsContent value="donors">
          <DonorTable donors={mockDonors} />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CreateDonationModal open={createCampaignModalOpen} onOpenChange={setCreateCampaignModalOpen} />
      <CreateDonationRecordModal open={createDonationModalOpen} onOpenChange={setCreateDonationModalOpen} />
      <EditDonationModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        donationId={selectedDonation}
      />
      <DeleteDonationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        donationId={selectedDonation}
      />
    </div>
  );
};

export default Donations;

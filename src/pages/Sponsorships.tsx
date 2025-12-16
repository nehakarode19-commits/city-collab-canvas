import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, UserCheck, UserX, Plus, ClipboardList } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { TierCard } from "@/components/sponsorships/TierCard";
import { SponsorCard } from "@/components/sponsorships/SponsorCard";
import { PackagesTable } from "@/components/sponsorships/PackagesTable";
import { CreateSponsorModal } from "@/components/sponsorships/CreateSponsorModal";
import { CreatePackageModal } from "@/components/sponsorships/CreatePackageModal";
import { EditTierModal } from "@/components/sponsorships/EditTierModal";
import { LogBenefitsModal } from "@/components/sponsorships/LogBenefitsModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tiers = [
  {
    id: 1,
    name: "Platinum",
    price: 50000,
    color: "from-slate-400 to-slate-600",
    benefits: [
      "Premium booth location",
      "Logo on all marketing materials",
      "Speaking opportunity",
      "VIP event tickets (10)",
      "Dedicated social media posts",
      "Press release mention",
    ],
  },
  {
    id: 2,
    name: "Gold",
    price: 25000,
    color: "from-yellow-400 to-yellow-600",
    benefits: [
      "Standard booth location",
      "Logo on website",
      "VIP event tickets (5)",
      "Social media mentions",
      "Newsletter feature",
    ],
  },
  {
    id: 3,
    name: "Silver",
    price: 10000,
    color: "from-gray-300 to-gray-500",
    benefits: [
      "Logo on website",
      "VIP event tickets (2)",
      "Social media mention",
      "Program listing",
    ],
  },
];

const mockSponsors = [
  { id: 1, name: "Tech Corp", tier: "Platinum", status: "active" as const, logo: "TC" },
  { id: 2, name: "Innovation Inc", tier: "Gold", status: "active" as const, logo: "II" },
  { id: 3, name: "Global Solutions", tier: "Silver", status: "active" as const, logo: "GS" },
  { id: 4, name: "Digital Ventures", tier: "Gold", status: "inactive" as const, logo: "DV" },
];

const mockPackages = [
  {
    id: 1,
    name: "Annual Platinum Package",
    price: 50000,
    dueDate: "2024-12-31",
    deliveredOn: "2024-01-15",
    quantity: 3,
    benefits: "All Platinum Benefits",
  },
  {
    id: 2,
    name: "Q1 Gold Sponsorship",
    price: 25000,
    dueDate: "2024-03-31",
    deliveredOn: "2024-01-20",
    quantity: 5,
    benefits: "All Gold Benefits",
  },
  {
    id: 3,
    name: "Event Silver Package",
    price: 10000,
    dueDate: "2024-06-30",
    deliveredOn: null,
    quantity: 8,
    benefits: "All Silver Benefits",
  },
];

const Sponsorships = () => {
  const [createSponsorOpen, setCreateSponsorOpen] = useState(false);
  const [createPackageOpen, setCreatePackageOpen] = useState(false);
  const [editTierOpen, setEditTierOpen] = useState(false);
  const [logBenefitsOpen, setLogBenefitsOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<number | null>(null);

  const handleEditTier = (tierId: number) => {
    setSelectedTier(tierId);
    setEditTierOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sponsorships</h1>
          <p className="text-muted-foreground mt-1">Manage sponsors, packages, and benefits</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setLogBenefitsOpen(true)}>
            <ClipboardList className="mr-2 h-4 w-4" />
            Log Benefits
          </Button>
          <Button variant="outline" onClick={() => setCreatePackageOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Package
          </Button>
          <Button onClick={() => setCreateSponsorOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Sponsor
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Sponsors (This Year)"
          value="47"
          change="+8"
          changeType="increase"
          icon={Users}
          iconColor="text-primary"
        />
        <StatCard
          title="Sponsor Revenue"
          value="$485,000"
          change="+23%"
          changeType="increase"
          icon={DollarSign}
          iconColor="text-success"
        />
        <StatCard
          title="Active Sponsors"
          value="42"
          change="+5"
          changeType="increase"
          icon={UserCheck}
          iconColor="text-info"
        />
        <StatCard
          title="Inactive Sponsors"
          value="5"
          change="-2"
          changeType="decrease"
          icon={UserX}
          iconColor="text-muted-foreground"
        />
      </div>

      {/* Sponsorship Tiers */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Sponsorship Tiers</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier) => (
            <TierCard key={tier.id} {...tier} onEdit={handleEditTier} />
          ))}
        </div>
      </div>

      {/* Tabs for Sponsors and Packages */}
      <Tabs defaultValue="sponsors" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sponsors">Sponsor Accounts</TabsTrigger>
          <TabsTrigger value="packages">Sponsor Packages</TabsTrigger>
        </TabsList>

        {/* Sponsor Accounts Tab */}
        <TabsContent value="sponsors">
          <div>
            <h2 className="text-xl font-semibold mb-4">Sponsor Accounts</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {mockSponsors.map((sponsor) => (
                <SponsorCard key={sponsor.id} {...sponsor} />
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Packages Tab */}
        <TabsContent value="packages">
          <PackagesTable packages={mockPackages} />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CreateSponsorModal open={createSponsorOpen} onOpenChange={setCreateSponsorOpen} />
      <CreatePackageModal open={createPackageOpen} onOpenChange={setCreatePackageOpen} />
      <EditTierModal
        open={editTierOpen}
        onOpenChange={setEditTierOpen}
        tierId={selectedTier}
      />
      <LogBenefitsModal open={logBenefitsOpen} onOpenChange={setLogBenefitsOpen} />
    </div>
  );
};

export default Sponsorships;

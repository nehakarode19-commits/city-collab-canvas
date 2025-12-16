import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Edit, Plus } from "lucide-react";
import { CreateDealModal } from "./CreateDealModal";

interface Deal {
  id: string;
  sponsorName: string;
  assetName: string;
  assetType: "Session" | "Speaker" | "Booth";
  package: string;
  amount: number;
  status: "prospect" | "negotiation" | "confirmed" | "declined";
  owner: string;
}

const mockDeals: Deal[] = [
  {
    id: "1",
    sponsorName: "Tech Corp Solutions",
    assetName: "Opening Keynote",
    assetType: "Session",
    package: "Platinum",
    amount: 25000,
    status: "confirmed",
    owner: "Sarah Johnson",
  },
  {
    id: "2",
    sponsorName: "Innovation Partners",
    assetName: "Dr. Sarah Chen",
    assetType: "Speaker",
    package: "Gold",
    amount: 15000,
    status: "negotiation",
    owner: "Michael Torres",
  },
  {
    id: "3",
    sponsorName: "Digital Ventures Ltd",
    assetName: "Premium Booth A1",
    assetType: "Booth",
    package: "Silver",
    amount: 5000,
    status: "confirmed",
    owner: "Jennifer Liu",
  },
  {
    id: "4",
    sponsorName: "Global Tech Inc",
    assetName: "AI Panel Discussion",
    assetType: "Session",
    package: "Gold",
    amount: 15000,
    status: "prospect",
    owner: "Sarah Johnson",
  },
];

export function DealsTab() {
  const [deals] = useState<Deal[]>(mockDeals);
  const [createDealOpen, setCreateDealOpen] = useState(false);

  const getStatusVariant = (status: Deal["status"]) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "negotiation":
        return "secondary";
      case "prospect":
        return "outline";
      case "declined":
        return "destructive";
    }
  };

  const getAssetTypeColor = (type: Deal["assetType"]) => {
    switch (type) {
      case "Session":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Speaker":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "Booth":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Sponsorship Pipeline</h3>
          <p className="text-sm text-muted-foreground">
            Track and manage sponsorship deals across all assets
          </p>
        </div>
        <Button onClick={() => setCreateDealOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Deal
        </Button>
      </div>

      <div className="rounded-2xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sponsor Name</TableHead>
              <TableHead>Asset Name</TableHead>
              <TableHead>Asset Type</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals.map((deal) => (
              <TableRow key={deal.id}>
                <TableCell className="font-medium">{deal.sponsorName}</TableCell>
                <TableCell className="text-muted-foreground">{deal.assetName}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getAssetTypeColor(deal.assetType)}>
                    {deal.assetType}
                  </Badge>
                </TableCell>
                <TableCell>{deal.package}</TableCell>
                <TableCell className="font-semibold">
                  ${deal.amount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(deal.status)}>
                    {deal.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{deal.owner}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CreateDealModal
        open={createDealOpen}
        onOpenChange={setCreateDealOpen}
      />
    </div>
  );
}

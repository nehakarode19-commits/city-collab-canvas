import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SponsorCardProps {
  id: number;
  name: string;
  tier: string;
  status: "active" | "inactive";
  logo: string;
}

export function SponsorCard({ id, name, tier, status, logo }: SponsorCardProps) {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Platinum":
        return "bg-gradient-to-r from-slate-400 to-slate-600 text-white";
      case "Gold":
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case "Silver":
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {logo}
                </div>
                <div>
                  <h3 className="font-semibold line-clamp-1">{name}</h3>
                  <Badge
                    variant="secondary"
                    className={cn("mt-1", getTierColor(tier))}
                  >
                    {tier}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant={status === "active" ? "default" : "secondary"}>
                {status === "active" ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xl">
              {logo}
            </div>
            <div>
              <DialogTitle className="text-2xl">{name}</DialogTitle>
              <Badge className={cn("mt-1", getTierColor(tier))}>{tier}</Badge>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="info" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">Information</TabsTrigger>
            <TabsTrigger value="package">Package</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 mt-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Company Name</Label>
                  <p className="font-medium mt-1">{name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tier</Label>
                  <p className="font-medium mt-1">{tier}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Contact Email</Label>
                  <p className="font-medium mt-1">contact@{name.toLowerCase().replace(/\s+/g, '')}.com</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p className="font-medium mt-1">+1 (555) 123-4567</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Address</Label>
                <p className="font-medium mt-1">123 Business St, Suite 100, City, State 12345</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <Label htmlFor="status-toggle">Active Status</Label>
                <Switch id="status-toggle" defaultChecked={status === "active"} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="package" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <h4 className="font-semibold">Current Package</h4>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Package Type</span>
                  <span className="font-medium">{tier} Tier</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-medium text-success">
                    ${tier === "Platinum" ? "50,000" : tier === "Gold" ? "25,000" : "10,000"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date</span>
                  <span className="font-medium">Jan 1, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">End Date</span>
                  <span className="font-medium">Dec 31, 2024</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="benefits" className="space-y-3 mt-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-3 bg-success/10 rounded-lg">
                <div className="h-2 w-2 rounded-full bg-success" />
                <span className="text-sm">Logo on all marketing materials</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-success/10 rounded-lg">
                <div className="h-2 w-2 rounded-full bg-success" />
                <span className="text-sm">VIP event tickets allocated</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                <span className="text-sm text-muted-foreground">Social media posts - Pending</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-3 mt-4">
            <div className="space-y-3">
              <div className="flex gap-3 p-3 rounded-lg border">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                  JD
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Package renewed</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 rounded-lg border">
                <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center text-success font-semibold text-sm">
                  SY
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Benefits delivered</p>
                  <p className="text-xs text-muted-foreground">1 week ago</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

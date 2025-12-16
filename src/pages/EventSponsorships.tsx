import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SessionsTab } from "@/components/event-sponsorships/SessionsTab";
import { SpeakersTab } from "@/components/event-sponsorships/SpeakersTab";
import { BoothsTab } from "@/components/event-sponsorships/BoothsTab";
import { DealsTab } from "@/components/event-sponsorships/DealsTab";
import { DollarSign, Target, Package, Users } from "lucide-react";

const EventSponsorships = () => {
  const [activeTab, setActiveTab] = useState("sessions");

  const summaryStats = [
    {
      title: "Total Sponsorship Goal",
      value: "$500,000",
      icon: Target,
      description: "Target revenue",
    },
    {
      title: "Confirmed Sponsorship",
      value: "$324,000",
      icon: DollarSign,
      description: "64.8% of goal",
    },
    {
      title: "Assets Available",
      value: "47",
      icon: Package,
      description: "Sessions, Speakers, Booths",
    },
    {
      title: "Sponsors Confirmed",
      value: "12",
      icon: Users,
      description: "Active partnerships",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Event Sponsorship Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage Sponsorships for Sessions, Speakers, and Booths
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryStats.map((stat) => (
          <Card key={stat.title} className="rounded-2xl shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs Section */}
      <Card className="rounded-2xl shadow-lg">
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="speakers">Speakers</TabsTrigger>
              <TabsTrigger value="booths">Booths</TabsTrigger>
              <TabsTrigger value="deals">Deals Pipeline</TabsTrigger>
            </TabsList>

            <TabsContent value="sessions" className="mt-6">
              <SessionsTab />
            </TabsContent>

            <TabsContent value="speakers" className="mt-6">
              <SpeakersTab />
            </TabsContent>

            <TabsContent value="booths" className="mt-6">
              <BoothsTab />
            </TabsContent>

            <TabsContent value="deals" className="mt-6">
              <DealsTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventSponsorships;

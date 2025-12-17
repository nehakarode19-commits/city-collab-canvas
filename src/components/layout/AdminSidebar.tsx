import { Home, Building2, Users, Calendar, DollarSign, Award, Heart, Network, BarChart3, FileText, Building, Trophy, Hash, Handshake, Bot, Megaphone } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const mainNavItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "SOP Library", url: "/sop-library", icon: FileText },
  { title: "Departments", url: "/departments", icon: Building },
  { title: "Organizations", url: "/organizations", icon: Building2 },
  { title: "Members", url: "/members", icon: Users },
  { title: "Events", url: "/events", icon: Calendar },
  { title: "Event Sponsorships", url: "/event-sponsorships", icon: Trophy },
  { title: "Donations", url: "/donations", icon: DollarSign },
  { title: "Sponsorships", url: "/sponsorships", icon: Award },
  { title: "Volunteering", url: "/volunteering", icon: Heart },
  { title: "Relationships", url: "/relationships", icon: Network },
  { title: "Feed Governance", url: "/feed-governance", icon: Megaphone },
  { title: "Channel Management", url: "/channels", icon: Hash },
  { title: "Sponsor Analytics", url: "/sponsor-analytics", icon: BarChart3 },
  { title: "City Collaborations", url: "/collaborations", icon: Handshake },
  { title: "GovBot Librarian", url: "/govbot", icon: Bot },
  { title: "Reports", url: "/reports", icon: BarChart3 },
];

export function AdminSidebar() {
  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="px-6 py-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">CC</span>
          </div>
          <span className="font-semibold text-sidebar-foreground">City Collab</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

import { Home, Building2, Users, Calendar, DollarSign, Award, Heart, Network, BarChart3, Settings, FileText, Building, Trophy, Shield, Hash, ScrollText, UserCog, Briefcase, Handshake, Bot, Megaphone, Tag, Lock, FileCheck, UserCheck } from "lucide-react";
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
];

const adminNavItems = [
  { title: "Feed Governance", url: "/feed-governance", icon: Megaphone },
  { title: "Content Taxonomy", url: "/content-taxonomy", icon: Tag },
  { title: "Access Control", url: "/access-control", icon: Lock },
  { title: "Verification", url: "/verification", icon: UserCheck },
  { title: "Strategic Partners", url: "/strategic-partners", icon: FileCheck },
  { title: "Channel Management", url: "/channels", icon: Hash },
  { title: "Moderation", url: "/moderation", icon: Shield },
  { title: "Legal Disclaimers", url: "/legal-disclaimers", icon: ScrollText },
  { title: "Retiree Marketplace", url: "/retiree-marketplace", icon: Briefcase },
  { title: "Onboarding", url: "/onboarding", icon: Building2 },
  { title: "Sponsor Analytics", url: "/sponsor-analytics", icon: BarChart3 },
  { title: "City Collaborations", url: "/collaborations", icon: Handshake },
  { title: "GovBot Librarian", url: "/govbot", icon: Bot },
];

const secondaryNavItems = [
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "User Preferences", url: "/user-preferences", icon: UserCog },
  { title: "Roles & Permissions", url: "/roles-permissions", icon: Shield },
  { title: "Admin Settings", url: "/admin-settings", icon: Settings },
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

        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
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

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
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

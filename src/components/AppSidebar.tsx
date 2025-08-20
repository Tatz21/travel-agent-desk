import { 
  LayoutDashboard, 
  Users, 
  Calculator, 
  CreditCard, 
  Phone,
  Plane,
  Bus,
  Hotel,
  BookOpen
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Flight Booking", url: "/dashboard/flights", icon: Plane },
  { title: "Bus Booking", url: "/dashboard/buses", icon: Bus },
  { title: "Hotel Booking", url: "/dashboard/hotels", icon: Hotel },
  { title: "Bookings", url: "/dashboard/bookings", icon: BookOpen },
];

const serviceItems = [
  { title: "Group Booking Enquiry", url: "/dashboard/group-booking", icon: Users },
  { title: "Service Charge", url: "/dashboard/service-charge", icon: Calculator },
  { title: "Bank Account Details", url: "/dashboard/bank-details", icon: CreditCard },
  { title: "Contact Representative", url: "/dashboard/contact", icon: Phone },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return currentPath === '/dashboard';
    }
    return currentPath.startsWith(path);
  };

  const getNavCls = (path: string) => {
    return isActive(path) 
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
      : "hover:bg-sidebar-accent/50";
  };

  return (
    <Sidebar className={state === "collapsed" ? "w-14" : "w-60"} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === '/dashboard'} className={getNavCls(item.url)}>
                      <item.icon className="h-4 w-4" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Services</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {serviceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls(item.url)}>
                      <item.icon className="h-4 w-4" />
                      {state !== "collapsed" && <span>{item.title}</span>}
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
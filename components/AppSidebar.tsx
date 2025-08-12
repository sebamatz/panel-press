"use client"

import type * as React from "react"
import Link from "next/link"
import {
  Home,
  Package,
  Layers,
  Settings,
  FileText,
  Users,
  BarChart3,
  ShoppingCart,
  Phone,
  ChevronRight,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Menu data with proper links
const data = {
  navMain: [
    {
      title: "Αρχική",
      url: "/",
      icon: Home,
    },
    {
      title: "Προϊόντα",
      url: "/products",
      icon: Package,
      items: [
        {
          title: "Πάνελ Αλουμινίου",
          url: "/products/aluminum-panels",
        },
        {
          title: "Κάγκελα Αλουμινίου",
          url: "/products/aluminum-railings",
        },
        {
          title: "Θωρακισμένες Πόρτες",
          url: "/products/armored-doors",
        },
        {
          title: "Πόρτες Αποθήκης",
          url: "/products/storage-doors",
        },
        {
          title: "Πόρτες Πυρασφάλειας",
          url: "/products/fire-doors",
        },
        {
          title: "Επενδύσεις Προφίλ",
          url: "/products/profile-cladding",
        },
      ],
    },
    {
      title: "Σειρές Προϊόντων",
      url: "/series",
      icon: Layers,
      items: [
        {
          title: "Σειρά 5000/7000",
          url: "/series/5000-7000",
        },
        {
          title: "Σειρά 6000 με INOX",
          url: "/series/6000-inox",
        },
        {
          title: "Σειρά 3000 Παραδοσιακά",
          url: "/series/3000-traditional",
        },
        {
          title: "Σειρά 1000 με Κορνίζα",
          url: "/series/1000-frame",
        },
        {
          title: "Σειρά 8000 Geometry",
          url: "/series/8000-geometry",
        },
        {
          title: "ABS Series",
          url: "/series/abs",
        },
      ],
    },
    {
      title: "Παραγγελίες",
      url: "/orders",
      icon: ShoppingCart,
      items: [
        {
          title: "Νέα Παραγγελία",
          url: "/orders/new",
        },
        {
          title: "Ιστορικό Παραγγελιών",
          url: "/orders/history",
        },
        {
          title: "Κατάσταση Παραγγελίας",
          url: "/orders/status",
        },
      ],
    },
    {
      title: "Αναφορές",
      url: "/reports",
      icon: BarChart3,
      items: [
        {
          title: "Πωλήσεις",
          url: "/reports/sales",
        },
        {
          title: "Στατιστικά",
          url: "/reports/statistics",
        },
        {
          title: "Εκθέσεις",
          url: "/reports/exports",
        },
      ],
    },
    {
      title: "Τεκμηρίωση",
      url: "/documentation",
      icon: FileText,
      items: [
        {
          title: "Τεχνικά Φυλλάδια",
          url: "/documentation/technical-sheets",
        },
        {
          title: "Οδηγίες Εγκατάστασης",
          url: "/documentation/installation-guides",
        },
        {
          title: "Χρωματολόγιο RENOLIT",
          url: "/documentation/renolit-colors",
        },
        {
          title: "Πιστοποιητικά",
          url: "/documentation/certificates",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Πελάτες",
      url: "/customers",
      icon: Users,
    },
    {
      title: "Επικοινωνία",
      url: "/contact",
      icon: Phone,
    },
    {
      title: "Ρυθμίσεις",
      url: "/settings",
      icon: Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-green-600 text-white">
            <Package className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Panel Press S.A</span>
            <span className="truncate text-xs text-muted-foreground">Aluminum Systems</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Κύριο Μενού</SidebarGroupLabel>
          <SidebarGroupContent>
            {/* <SidebarMenu>
              {data.navMain.map((item) => (
                <Collapsible key={item.title} asChild defaultOpen={item.title === "Προϊόντα"}>
                  <SidebarMenuItem>
                    {item.items?.length ? (
                      <>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                            <item.icon />
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items?.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                  <Link href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                    ) : (
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu> */}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="sm" tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

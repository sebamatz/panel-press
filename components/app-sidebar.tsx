"use client"

import type * as React from "react"
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

// Menu data
const data = {
  navMain: [
    {
      title: "Αρχική",
      url: "#",
      icon: Home,
    },
    {
      title: "Προϊόντα",
      url: "#",
      icon: Package,
      items: [
        {
          title: "Πάνελ Αλουμινίου",
          url: "#",
        },
        {
          title: "Κάγκελα Αλουμινίου",
          url: "#",
        },
        {
          title: "Θωρακισμένες Πόρτες",
          url: "#",
        },
        {
          title: "Πόρτες Αποθήκης",
          url: "#",
        },
        {
          title: "Πόρτες Πυρασφάλειας",
          url: "#",
        },
        {
          title: "Επενδύσεις Προφίλ",
          url: "#",
        },
      ],
    },
    {
      title: "Σειρές Προϊόντων",
      url: "#",
      icon: Layers,
      items: [
        {
          title: "Σειρά 5000/7000",
          url: "#",
        },
        {
          title: "Σειρά 6000 με INOX",
          url: "#",
        },
        {
          title: "Σειρά 3000 Παραδοσιακά",
          url: "#",
        },
        {
          title: "Σειρά 1000 με Κορνίζα",
          url: "#",
        },
        {
          title: "Σειρά 8000 Geometry",
          url: "#",
        },
        {
          title: "ABS Series",
          url: "#",
        },
      ],
    },
    {
      title: "Παραγγελίες",
      url: "#",
      icon: ShoppingCart,
      items: [
        {
          title: "Νέα Παραγγελία",
          url: "#",
        },
        {
          title: "Ιστορικό Παραγγελιών",
          url: "#",
        },
        {
          title: "Κατάσταση Παραγγελίας",
          url: "#",
        },
      ],
    },
    {
      title: "Αναφορές",
      url: "#",
      icon: BarChart3,
      items: [
        {
          title: "Πωλήσεις",
          url: "#",
        },
        {
          title: "Στατιστικά",
          url: "#",
        },
        {
          title: "Εκθέσεις",
          url: "#",
        },
      ],
    },
    {
      title: "Τεκμηρίωση",
      url: "#",
      icon: FileText,
      items: [
        {
          title: "Τεχνικά Φυλλάδια",
          url: "#",
        },
        {
          title: "Οδηγίες Εγκατάστασης",
          url: "#",
        },
        {
          title: "Χρωματολόγιο RENOLIT",
          url: "#",
        },
        {
          title: "Πιστοποιητικά",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Πελάτες",
      url: "#",
      icon: Users,
    },
    {
      title: "Επικοινωνία",
      url: "#",
      icon: Phone,
    },
    {
      title: "Ρυθμίσεις",
      url: "#",
      icon: Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-green-600 text-white">
            <Package className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Panel Press S.A</span>
            <span className="truncate text-xs text-muted-foreground">Aluminum Systems</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Κύριο Μενού</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
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
                                  <a href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                    ) : (
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="sm" tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#" className="font-normal">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-green-600 text-white text-xs">
                  TM
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Τάσος Μουζάκης</span>
                  <span className="truncate text-xs text-muted-foreground">tasos@panelpress.gr</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

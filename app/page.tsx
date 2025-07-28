"use client"

import { Header } from "@/components/header"
import { AppSidebar } from "@/components/app-sidebar"
import { ProductGrid } from "@/components/product-grid"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function PanelPressPortal() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 p-6">
          <ProductGrid />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

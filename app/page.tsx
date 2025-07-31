"use client"

import { Header } from "@/components/header"
import { AppSidebar } from "@/components/AppSidebar"
import { DynamicProductGrid } from "@/components/ProductGrid"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ReduxDebug } from "@/components/ReduxDebug"
import { ToastDemo } from "@/components/ToastDemo"
import { useGlobalErrorHandler } from "@/hooks/useGlobalErrorHandler"

export default function PanelPressPortal() {
  // Set up global error handling
  useGlobalErrorHandler()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
          <ReduxDebug />
        <Header />
        <main className="flex-1 p-6">
          <DynamicProductGrid />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

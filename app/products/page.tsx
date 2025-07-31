"use client"

import { Header } from "@/components/header"
import { AppSidebar } from "@/components/AppSidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function ProductsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Προϊόντα</h1>
            <p className="text-gray-600">Σελίδα προϊόντων - υπό κατασκευή</p>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

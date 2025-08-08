"use client"

import { Header } from "@/components/header"
import { DynamicProductGrid } from "@/components/ProductGrid"
import { RTKQueryDebug } from "@/components/RTKQueryDebug"
import { ToastDemo } from "@/components/ToastDemo"
import { useGlobalErrorHandler } from "@/hooks/useGlobalErrorHandler"

export default function PanelPressPortal() {
  // Set up global error handling
  useGlobalErrorHandler()

  return (
    <>
      <Header />
      <main className="flex-1 p-6">
        <div className="space-y-6">
          <RTKQueryDebug />
          <DynamicProductGrid />
        </div>
      </main>
    </>
  )
}

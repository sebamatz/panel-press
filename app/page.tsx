"use client"

import { Header } from "@/components/header"
import { DynamicProductGrid } from "@/components/ProductGrid"
import { ReduxDebug } from "@/components/ReduxDebug"
import { ToastDemo } from "@/components/ToastDemo"
import { useGlobalErrorHandler } from "@/hooks/useGlobalErrorHandler"

export default function PanelPressPortal() {
  // Set up global error handling
  useGlobalErrorHandler()

  return (
    <>
      <ReduxDebug />
      <Header />
      <main className="flex-1 p-6">
        <DynamicProductGrid />
      </main>
    </>
  )
}

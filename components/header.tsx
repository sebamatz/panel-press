"use client"

import { Search, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="text-2xl font-bold">
            <span className="text-green-700">PANEL</span>
            <span className="text-lime-500">.</span>
            <span className="text-green-700">PRESS</span>
            <span className="text-sm font-normal text-gray-500 ml-2">S.A</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Αναζήτηση προϊόντων..." className="pl-10 w-64" />
          </div>
  
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}

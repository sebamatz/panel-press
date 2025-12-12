"use client";

import { Search, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";

const API_SERVERS = {
  remote: {
    label: "Remote Server",
    value: "https://www.alfaeorders.com:19443",
  },
  local: {
    label: "Local Server",
    value: "https://gmapi.kfertilizers.gr:19581",
  },
} as const;

export function Header() {
  const [apiServer, setApiServer] = useState<string>(() => {
    // Initialize from localStorage if available, otherwise use default
    if (typeof window !== "undefined") {
      const savedServer = localStorage.getItem("searchValue");
      return savedServer || API_SERVERS.remote.value;
    }
    return API_SERVERS.remote.value;
  });

  useEffect(() => {
    // Load saved server from localStorage on mount
    if (typeof window !== "undefined") {
      const savedServer = localStorage.getItem("searchValue");
      if (savedServer) {
        setApiServer(savedServer);
      } else {
        // Set default if nothing is saved
        localStorage.setItem("searchValue", API_SERVERS.remote.value);
      }
    }
  }, []);

  const handleServerChange = (value: string) => {
    setApiServer(value);
    if (typeof window !== "undefined") {
      localStorage.setItem("searchValue", value);
    }
    // Changes will be applied to next API calls without reload
  };

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
        <div className="flex gap-2 items-center">
          <label className="text-sm text-gray-600 whitespace-nowrap">
            API Server:
          </label>
          <Select value={apiServer} onValueChange={handleServerChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select server" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={API_SERVERS.remote.value}>
                {API_SERVERS.remote.label}
              </SelectItem>
              <SelectItem value={API_SERVERS.local.value}>
                {API_SERVERS.local.label}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Αναζήτηση προϊόντων..."
              className="pl-10 w-64"
            />
          </div>

          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

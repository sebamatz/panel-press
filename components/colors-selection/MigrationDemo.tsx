"use client"

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ColorCompany from "./ColorCompany";
import ColorSelections from "./ColorSelections";
import OrderOptions from "./OrderOptions";
import Branches from "./Branches";

export default function MigrationDemo() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Component Migration Demo
        </h1>
        <p className="text-lg text-gray-600">
          Components migrated from Material-UI to Tailwind CSS and shadcn/ui
        </p>
        <Badge variant="secondary" className="text-sm">
          Migration Complete
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Color Company Component */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Color Company</span>
              <Badge variant="outline">Migrated</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ColorCompany />
          </CardContent>
        </Card>

        {/* Branches Component */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Branches</span>
              <Badge variant="outline">Migrated</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Branches />
          </CardContent>
        </Card>

        {/* Order Options Component */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Order Options</span>
              <Badge variant="outline">Migrated</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <OrderOptions isDisabled={false} />
          </CardContent>
        </Card>

        {/* Color Selections Component */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Color Selections</span>
              <Badge variant="outline">Migrated</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ColorSelections />
          </CardContent>
        </Card>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Migration Summary
        </h3>
        <ul className="space-y-2 text-green-700">
          <li>✅ Replaced Material-UI components with shadcn/ui equivalents</li>
          <li>✅ Converted Material-UI Grid to Tailwind CSS grid system</li>
          <li>✅ Replaced Material-UI Select with shadcn/ui Select</li>
          <li>✅ Replaced Material-UI RadioGroup with shadcn/ui RadioGroup</li>
          <li>✅ Replaced Material-UI TextField with shadcn/ui Input</li>
          <li>✅ Replaced Material-UI Autocomplete with shadcn/ui Combobox</li>
          <li>✅ Added proper TypeScript types</li>
          <li>✅ Implemented responsive design with Tailwind CSS</li>
          <li>✅ Removed external dependencies and created mock implementations</li>
        </ul>
      </div>
    </div>
  );
}

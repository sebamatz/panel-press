"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Combobox,
  ProductCombobox,
  ComboboxItem,
} from "@/components/ui/combobox";
import { Package, User, Building, Car } from "lucide-react";

// Sample data for different use cases
const products: ComboboxItem[] = [
  {
    id: 1,
    name: "Laptop",
    description: "High-performance laptop",
    price: 1200,
  },
  {
    id: 2,
    name: "Smartphone",
    description: "Latest smartphone model",
    price: 800,
  },
  { id: 3, name: "Tablet", description: "10-inch tablet", price: 500 },
  {
    id: 4,
    name: "Headphones",
    description: "Wireless noise-canceling",
    price: 200,
  },
];

const users: ComboboxItem[] = [
  {
    id: 1,
    name: "John Doe",
    description: "Software Engineer",
    email: "john@example.com",
  },
  {
    id: 2,
    name: "Jane Smith",
    description: "Product Manager",
    email: "jane@example.com",
  },
  {
    id: 3,
    name: "Bob Johnson",
    description: "Designer",
    email: "bob@example.com",
  },
];

const companies: ComboboxItem[] = [
  {
    id: 1,
    name: "Tech Corp",
    description: "Technology company",
    industry: "Technology",
  },
  {
    id: 2,
    name: "Design Studio",
    description: "Creative agency",
    industry: "Creative",
  },
  {
    id: 3,
    name: "Consulting Group",
    description: "Business consulting",
    industry: "Consulting",
  },
];

export function ComboboxDemo() {
  const [selectedProduct, setSelectedProduct] =
    React.useState<ComboboxItem | null>(null);
  const [selectedUser, setSelectedUser] = React.useState<ComboboxItem | null>(
    null
  );
  const [selectedCompany, setSelectedCompany] =
    React.useState<ComboboxItem | null>(null);

  // Custom render function for users
  const renderUserItem = (user: ComboboxItem) => (
    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-md">
      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
        <User className="h-4 w-4 text-blue-600" />
      </div>
      <div className="flex-1">
        <div className="font-medium">{user.name}</div>
        <div className="text-sm text-gray-500">{user.description}</div>
        <div className="text-xs text-gray-400">{user.email}</div>
      </div>
    </div>
  );

  // Custom render function for companies
  const renderCompanyItem = (company: ComboboxItem) => (
    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-md">
      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
        <Building className="h-4 w-4 text-purple-600" />
      </div>
      <div className="flex-1">
        <div className="font-medium">{company.name}</div>
        <div className="text-sm text-gray-500">{company.description}</div>
        <div className="text-xs text-gray-400">
          Industry: {company.industry}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Combobox Examples
        </h1>
        <p className="text-gray-600">
          Different ways to use the reusable combobox component
        </p>
      </div>

      {/* Product Combobox (Specialized) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Product Combobox (Specialized)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProductCombobox
            products={products}
            value={selectedProduct}
            onValueChange={setSelectedProduct}
          />
          {selectedProduct && (
            <div className="p-3 bg-green-50 rounded-md">
              <p className="text-sm">
                <strong>Selected:</strong> {selectedProduct.name} - $
                {selectedProduct.price}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Combobox (Custom Render) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>User Combobox (Custom Render)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Combobox
            items={users}
            value={selectedUser}
            onValueChange={setSelectedUser}
            placeholder="Select a user..."
            searchPlaceholder="Search users..."
            emptyMessage="No users found."
            renderItem={renderUserItem}
            icon={<User className="h-5 w-5" />}
          />
          {selectedUser && (
            <div className="p-3 bg-blue-50 rounded-md">
              <p className="text-sm">
                <strong>Selected:</strong> {selectedUser.name} (
                {selectedUser.email})
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Company Combobox (Custom Render) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Company Combobox (Custom Render)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Combobox
            items={companies}
            value={selectedCompany}
            onValueChange={setSelectedCompany}
            placeholder="Select a company..."
            searchPlaceholder="Search companies..."
            emptyMessage="No companies found."
            renderItem={renderCompanyItem}
            icon={<Building className="h-5 w-5" />}
            showBadge={true}
            badgeText="Active"
          />
          {selectedCompany && (
            <div className="p-3 bg-purple-50 rounded-md">
              <p className="text-sm">
                <strong>Selected:</strong> {selectedCompany.name} (
                {selectedCompany.industry})
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle>Usage Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Basic Usage:</h4>
              <pre className="bg-white p-2 rounded text-xs overflow-x-auto">
                {`<Combobox
  items={items}
  value={selectedItem}
  onValueChange={setSelectedItem}
/>`}
              </pre>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Product Combobox:</h4>
              <pre className="bg-white p-2 rounded text-xs overflow-x-auto">
                {`<ProductCombobox
  products={products}
  value={selectedProduct}
  onValueChange={setSelectedProduct}
/>`}
              </pre>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Custom Render:</h4>
              <pre className="bg-white p-2 rounded text-xs overflow-x-auto">
                {`<Combobox
  items={items}
  renderItem={customRenderFunction}
  icon={<CustomIcon />}
  showBadge={true}
/>`}
              </pre>
            </div>
            <div>
              <h4 className="font-semibold mb-2">With Loading State:</h4>
              <pre className="bg-white p-2 rounded text-xs overflow-x-auto">
                {`<Combobox
  items={items}
  loading={isLoading}
  disabled={isDisabled}
/>`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

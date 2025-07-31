'use client'

import React from 'react'
import { InfoCard } from '@/components/ui/InfoCard'
import { StatusCard } from '@/components/ui/StatusCard'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { 
  ShoppingCart, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Package,
  Download,
  Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ReusableComponentsDemo() {
  return (
    <Container size="xl" className="space-y-8">
      <Section 
        title="Reusable Components Demo" 
        subtitle="Examples of how to use the new reusable components"
        align="center"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* InfoCard Examples */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">InfoCard Examples</h3>
            
            <InfoCard
              variant="success"
              title="Success Message"
              icon={<CheckCircle className="h-4 w-4" />}
            >
              <p>This is a success message with custom styling and icon.</p>
            </InfoCard>

            <InfoCard
              variant="warning"
              title="Warning Message"
              icon={<AlertTriangle className="h-4 w-4" />}
            >
              <p>This is a warning message with different styling.</p>
            </InfoCard>

            <InfoCard
              variant="info"
              title="Information"
              icon={<Info className="h-4 w-4" />}
            >
              <p>This is an informational message with blue styling.</p>
            </InfoCard>

            <InfoCard
              variant="error"
              title="Error Message"
              showHeader={false}
            >
              <p>This is an error message without a header.</p>
            </InfoCard>
          </div>

          {/* StatusCard Examples */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">StatusCard Examples</h3>
            
            <StatusCard
              status="success"
              title="Operation Completed"
              badgeText="Success"
            >
              <p>The operation was completed successfully.</p>
            </StatusCard>

            <StatusCard
              status="loading"
              title="Processing"
              showBadge={false}
            >
              <p>Please wait while we process your request...</p>
            </StatusCard>

            <StatusCard
              status="error"
              title="Something went wrong"
            >
              <p>An error occurred while processing your request.</p>
            </StatusCard>

            <StatusCard
              status="info"
              title="System Status"
              badgeText="Online"
            >
              <p>All systems are running normally.</p>
            </StatusCard>
          </div>
        </div>
      </Section>

      {/* Container Examples */}
      <Section title="Container Examples" spacing="lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Container variant="card" size="sm" padding="md" shadow="sm">
            <h4 className="font-medium mb-2">Small Card Container</h4>
            <p className="text-sm text-gray-600">This is a small container with card styling.</p>
          </Container>

          <Container variant="bordered" size="sm" padding="lg" rounded="lg">
            <h4 className="font-medium mb-2">Bordered Container</h4>
            <p className="text-sm text-gray-600">This container has a border and larger padding.</p>
          </Container>

          <Container variant="filled" size="sm" padding="md" shadow="md">
            <h4 className="font-medium mb-2">Filled Container</h4>
            <p className="text-sm text-gray-600">This container has a filled background.</p>
          </Container>
        </div>
      </Section>

      {/* Complex Example */}
      <Section title="Complex Example" subtitle="Combining multiple components">
        <div className="space-y-6">
          <InfoCard
            variant="success"
            title="Order Information"
            icon={<ShoppingCart className="h-4 w-4" />}
          >
            <div className="space-y-4">
              <p>Your order has been processed successfully.</p>
              
              <Container variant="bordered" padding="sm" className="bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Order #12345</span>
                  <span className="text-sm text-gray-600">€299.99</span>
                </div>
              </Container>

              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <Download className="h-3 w-3 mr-1" />
                  Download Invoice
                </Button>
                <Button size="sm" variant="outline">
                  <Eye className="h-3 w-3 mr-1" />
                  View Details
                </Button>
              </div>
            </div>
          </InfoCard>

          <StatusCard
            status="info"
            title="Next Steps"
            badgeText="Action Required"
          >
            <div className="space-y-2">
              <p>Please complete the following steps:</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Review your order details</li>
                <li>Confirm shipping address</li>
                <li>Complete payment verification</li>
              </ul>
            </div>
          </StatusCard>
        </div>
      </Section>
    </Container>
  )
} 
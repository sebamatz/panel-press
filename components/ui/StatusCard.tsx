import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface StatusCardProps {
  children: React.ReactNode
  status: 'success' | 'warning' | 'error' | 'info' | 'loading'
  title?: string
  className?: string
  showBadge?: boolean
  badgeText?: string
}

const statusStyles = {
  success: {
    card: 'bg-green-50 border-green-200',
    badge: 'bg-green-100 text-green-800 border-green-300',
    text: 'text-green-700'
  },
  warning: {
    card: 'bg-yellow-50 border-yellow-200',
    badge: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    text: 'text-yellow-700'
  },
  error: {
    card: 'bg-red-50 border-red-200',
    badge: 'bg-red-100 text-red-800 border-red-300',
    text: 'text-red-700'
  },
  info: {
    card: 'bg-blue-50 border-blue-200',
    badge: 'bg-blue-100 text-blue-800 border-blue-300',
    text: 'text-blue-700'
  },
  loading: {
    card: 'bg-gray-50 border-gray-200',
    badge: 'bg-gray-100 text-gray-800 border-gray-300',
    text: 'text-gray-700'
  }
}

const statusIcons = {
  success: '✅',
  warning: '⚠️',
  error: '❌',
  info: 'ℹ️',
  loading: '⏳'
}

export function StatusCard({
  children,
  status,
  title,
  className,
  showBadge = true,
  badgeText
}: StatusCardProps) {
  const styles = statusStyles[status]
  const icon = statusIcons[status]
  const defaultBadgeText = badgeText || status.charAt(0).toUpperCase() + status.slice(1)

  return (
    <Card className={cn(styles.card, className)}>
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start justify-between mb-3">
          {title && (
            <h3 className={cn('font-bold text-sm md:text-base', styles.text)}>
              {icon} {title}
            </h3>
          )}
          {showBadge && (
            <Badge variant="outline" className={cn('text-xs', styles.badge)}>
              {defaultBadgeText}
            </Badge>
          )}
        </div>
        <div className={cn('text-xs md:text-sm', styles.text)}>
          {children}
        </div>
      </CardContent>
    </Card>
  )
} 
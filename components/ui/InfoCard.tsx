import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface InfoCardProps {
  children: React.ReactNode
  title?: string
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  className?: string
  headerClassName?: string
  contentClassName?: string
  showHeader?: boolean
  icon?: React.ReactNode
}

const variantStyles = {
  default: {
    card: 'bg-white border-gray-200',
    header: 'text-gray-900',
    content: 'text-gray-700'
  },
  success: {
    card: 'bg-green-50 border-green-200',
    header: 'text-green-800',
    content: 'text-green-700'
  },
  warning: {
    card: 'bg-yellow-50 border-yellow-200',
    header: 'text-yellow-800',
    content: 'text-yellow-700'
  },
  error: {
    card: 'bg-red-50 border-red-200',
    header: 'text-red-800',
    content: 'text-red-700'
  },
  info: {
    card: 'bg-blue-50 border-blue-200',
    header: 'text-blue-800',
    content: 'text-blue-700'
  }
}

export function InfoCard({
  children,
  title,
  variant = 'default',
  className,
  headerClassName,
  contentClassName,
  showHeader = true,
  icon
}: InfoCardProps) {
  const styles = variantStyles[variant]

  return (
    <Card className={cn(styles.card, className)}>
      {showHeader && title && (
        <CardHeader className={cn('pb-2', headerClassName)}>
          <CardTitle className={cn('text-sm md:text-base flex items-center', styles.header)}>
            {icon && <span className="mr-2">{icon}</span>}
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn('p-4 md:p-6', styles.content, contentClassName)}>
        {children}
      </CardContent>
    </Card>
  )
} 
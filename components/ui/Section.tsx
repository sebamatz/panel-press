import React from 'react'
import { cn } from '@/lib/utils'

interface SectionProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  className?: string
  titleClassName?: string
  subtitleClassName?: string
  contentClassName?: string
  spacing?: 'none' | 'sm' | 'md' | 'lg'
  align?: 'left' | 'center' | 'right'
}

const spacingClasses = {
  none: '',
  sm: 'space-y-2',
  md: 'space-y-4',
  lg: 'space-y-6'
}

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right'
}

export function Section({
  children,
  title,
  subtitle,
  className,
  titleClassName,
  subtitleClassName,
  contentClassName,
  spacing = 'md',
  align = 'left'
}: SectionProps) {
  return (
    <section className={cn(spacingClasses[spacing], className)}>
      {(title || subtitle) && (
        <div className={cn('mb-4', alignClasses[align])}>
          {title && (
            <h2 className={cn('text-xl font-semibold text-gray-900', titleClassName)}>
              {title}
            </h2>
          )}
          {subtitle && (
            <p className={cn('text-sm text-gray-600 mt-1', subtitleClassName)}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className={cn(contentClassName)}>
        {children}
      </div>
    </section>
  )
} 
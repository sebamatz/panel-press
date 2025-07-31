import React from 'react'
import { cn } from '@/lib/utils'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'card' | 'bordered' | 'filled'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  as?: React.ElementType
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full'
}

const paddingClasses = {
  none: '',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6'
}

const roundedClasses = {
  none: '',
  sm: 'rounded',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl'
}

const shadowClasses = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg'
}

const variantClasses = {
  default: 'bg-white',
  card: 'bg-white border border-gray-200',
  bordered: 'border border-gray-200',
  filled: 'bg-gray-50'
}

export function Container({
  children,
  className,
  variant = 'default',
  size = 'full',
  padding = 'md',
  rounded = 'md',
  shadow = 'none',
  as: Component = 'div'
}: ContainerProps) {
  const ComponentToRender = Component as React.ComponentType<any>
  
  return (
    <ComponentToRender
      className={cn(
        'mx-auto',
        sizeClasses[size],
        paddingClasses[padding],
        roundedClasses[rounded],
        shadowClasses[shadow],
        variantClasses[variant],
        className
      )}
    >
      {children}
    </ComponentToRender>
  )
} 
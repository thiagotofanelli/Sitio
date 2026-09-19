import React, { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'green' | 'gold' | 'gray' | 'red'
  icon?: ReactNode
}

export function Badge({ className, variant = 'green', icon, children, ...props }: BadgeProps) {
  const variants = {
    green: 'bg-[#1B4332]/10 text-[#1B4332]',
    gold: 'bg-[#D4A373]/10 text-[#C58F4E]',
    gray: 'bg-gray-100 text-gray-600',
    red: 'bg-red-50 text-red-600'
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors',
        variants[variant],
        className
      )}
      {...props}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </div>
  )
}

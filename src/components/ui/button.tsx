'use client'

import React, { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'default'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
  icon?: ReactNode
  href?: string
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, icon, children, href, asChild, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) focus:outline-none focus:ring-2 focus:ring-offset-2'
    
    const variants = {
      primary: 'bg-[#1B4332] hover:bg-[#2D6A4F] text-white focus:ring-[#1B4332]',
      default: 'bg-[#1B4332] hover:bg-[#2D6A4F] text-white focus:ring-[#1B4332]',
      secondary: 'bg-[#D4A373] hover:bg-[#C58F4E] text-white focus:ring-[#D4A373]',
      outline: 'border-2 border-[#1B4332] text-[#1B4332] hover:bg-[#1B4332] hover:text-white focus:ring-[#1B4332]',
      ghost: 'text-[#1F2937] hover:bg-gray-100 focus:ring-gray-100'
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
      icon: 'p-2 w-9 h-9'
    }

    const classes = cn(
      baseStyles,
      variants[variant],
      sizes[size],
      (loading || props.disabled) && 'opacity-70 cursor-not-allowed',
      className
    )

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        className: cn(classes, (children.props as any).className),
        ref,
        ...props,
      })
    }

    const content = (
      <>
        {loading && (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {!loading && icon && <span className="mr-2">{icon}</span>}
        {children}
      </>
    )

    if (href) {
      return (
        <a href={href} className={classes} ref={ref as React.Ref<HTMLAnchorElement>} {...(props as any)}>
          {content}
        </a>
      )
    }

    return (
      <button className={classes} ref={ref as React.Ref<HTMLButtonElement>} disabled={loading || props.disabled} {...props}>
        {content}
      </button>
    )
  }
)
Button.displayName = 'Button'

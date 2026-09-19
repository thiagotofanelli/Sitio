'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string
  error?: string
  type?: string
}

export const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ className, label, error, type = 'text', required, ...props }, ref) => {
    const inputClasses = cn(
      'w-full border border-[#E9ECEF] rounded-xl px-4 py-3 bg-white text-[#1F2937]',
      'transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent',
      'placeholder:text-gray-400',
      error && 'border-red-500 focus:ring-red-500',
      className
    )

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#1F2937] mb-1.5">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        {type === 'textarea' ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={inputClasses}
            required={required}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            type={type}
            ref={ref as React.Ref<HTMLInputElement>}
            className={inputClasses}
            required={required}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

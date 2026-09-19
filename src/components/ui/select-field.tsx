'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface Option {
  value: string
  label: string
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: Option[]
  error?: string
  placeholder?: string
}

export const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ className, label, options, error, required, placeholder, ...props }, ref) => {
    const selectClasses = cn(
      'w-full border border-[#E9ECEF] rounded-xl px-4 py-3 bg-white text-[#1F2937]',
      'transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent',
      'appearance-none cursor-pointer',
      error && 'border-red-500 focus:ring-red-500',
      className
    )

    return (
      <div className="w-full relative">
        {label && (
          <label className="block text-sm font-medium text-[#1F2937] mb-1.5">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={selectClasses}
            required={required}
            {...props}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)
SelectField.displayName = 'SelectField'

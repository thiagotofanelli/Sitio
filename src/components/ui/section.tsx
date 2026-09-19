'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string
  title?: string
  subtitle?: string
}

export function Section({ id, title, subtitle, className, children, ...props }: SectionProps) {
  return (
    <section id={id} className={cn('py-16 md:py-24', className)} {...props}>
      <div className="max-w-7xl mx-auto px-4">
        {(title || subtitle) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="text-center mb-12 md:mb-16"
          >
            {title && (
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#1F2937] mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  )
}

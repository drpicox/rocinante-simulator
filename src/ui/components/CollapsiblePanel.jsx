/**
 * CollapsiblePanel Component
 *
 * Reusable collapsible panel with smooth animations
 * Supports icons, custom styling, and persistent state
 */

import React, { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export function CollapsiblePanel({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
  storageKey = null,
  className = '',
  headerClassName = '',
  contentClassName = ''
}) {
  // Use localStorage if storageKey is provided
  const [isOpen, setIsOpen] = useState(() => {
    if (storageKey) {
      const stored = localStorage.getItem(storageKey)
      return stored !== null ? JSON.parse(stored) : defaultOpen
    }
    return defaultOpen
  })

  // Save state to localStorage when it changes
  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(isOpen))
    }
  }, [isOpen, storageKey])

  const toggle = () => setIsOpen(!isOpen)

  return (
    <div
      className={`bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600 rounded-xl shadow-xl overflow-hidden ${className}`}
    >
      {/* Header */}
      <button
        onClick={toggle}
        className={`w-full px-6 py-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors ${headerClassName}`}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5" />}
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>

      {/* Content with smooth transition */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className={`px-6 pb-6 ${contentClassName}`}>
          {children}
        </div>
      </div>
    </div>
  )
}

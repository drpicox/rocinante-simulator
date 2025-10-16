/**
 * FloatingPanel Component
 *
 * A floating overlay panel for full-screen map interface
 */

import React from 'react'
import { X } from 'lucide-react'

export function FloatingPanel({
  title,
  icon: Icon,
  children,
  isOpen,
  onClose,
  position = 'right',
  maxWidth = 'max-w-md'
}) {
  if (!isOpen) return null

  const positionClasses = {
    right: 'right-4 top-4',
    left: 'left-4 top-4',
    'bottom-right': 'right-4 bottom-4',
    'bottom-left': 'left-4 bottom-4'
  }

  return (
    <div
      className={`fixed ${positionClasses[position]} ${maxWidth} w-full z-50 animate-slide-in`}
      style={{ maxHeight: 'calc(100vh - 2rem)' }}
    >
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-600 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between bg-slate-800/80 border-b border-slate-600">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-5 h-5 text-blue-400" />}
            <h3 className="font-semibold text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded transition-colors"
          >
            <X className="w-4 h-4 text-slate-400 hover:text-white" />
          </button>
        </div>

        {/* Content with scroll */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

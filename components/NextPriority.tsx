'use client'

import React from 'react'

type NextPriorityProps = {
  nextPriority: string
}

const NextPriority: React.FC<NextPriorityProps> = ({ nextPriority }) => {
  if (!nextPriority) return null

  return (
    <div className="border border-blue-200 bg-blue-50 text-blue-900 rounded-2xl px-4 py-3 shadow-sm">
      <div className="text-xs uppercase tracking-widest text-blue-700 mb-1">Next priority</div>
      <p className="text-sm font-semibold leading-relaxed">{nextPriority}</p>
    </div>
  )
}

export default NextPriority

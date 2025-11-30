'use client'

import React from 'react'

type WarningsProps = {
  warnings: string[]
}

const Warnings: React.FC<WarningsProps> = ({ warnings }) => {
  if (!warnings || warnings.length === 0) return null

  return (
    <div className="space-y-2">
      {warnings.map((warning) => (
        <div
          key={warning}
          className="border border-red-200 bg-red-50 text-red-800 rounded-2xl px-4 py-3 shadow-sm"
        >
          <div className="font-semibold text-sm">Warning</div>
          <p className="text-sm leading-relaxed">{warning}</p>
        </div>
      ))}
    </div>
  )
}

export default Warnings

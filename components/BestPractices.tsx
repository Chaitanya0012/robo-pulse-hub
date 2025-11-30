'use client'

import React from 'react'

type BestPracticesProps = {
  bestPractices: string[]
}

const BestPractices: React.FC<BestPracticesProps> = ({ bestPractices }) => {
  if (!bestPractices || bestPractices.length === 0) return null

  return (
    <div className="space-y-2">
      {bestPractices.map((tip) => (
        <div
          key={tip}
          className="border border-emerald-200 bg-emerald-50 text-emerald-800 rounded-2xl px-4 py-3 shadow-sm"
        >
          <div className="font-semibold text-sm">Best practice</div>
          <p className="text-sm leading-relaxed">{tip}</p>
        </div>
      ))}
    </div>
  )
}

export default BestPractices

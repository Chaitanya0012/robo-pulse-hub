'use client'

import React from 'react'

type MemoryDebugProps = {
  memory: unknown[]
}

const MemoryDebug: React.FC<MemoryDebugProps> = ({ memory }) => {
  if (!memory || memory.length === 0) return null

  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 shadow-inner">
      <div className="text-xs uppercase tracking-widest text-amber-400 mb-2">Memory debug</div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {memory.map((chunk, index) => (
          <pre
            key={index}
            className="bg-slate-800 rounded-lg p-3 text-xs whitespace-pre-wrap border border-slate-700"
          >
            {JSON.stringify(chunk, null, 2)}
          </pre>
        ))}
      </div>
    </div>
  )
}

export default MemoryDebug

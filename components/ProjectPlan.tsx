'use client'

import React, { useState } from 'react'

export type PlanStep = {
  title: string
  description: string
  prerequisites?: string[]
  resources?: string[]
}

type ProjectPlanProps = {
  plan: PlanStep[]
}

const ProjectPlan: React.FC<ProjectPlanProps> = ({ plan }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  if (!plan || plan.length === 0) return null

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="p-4 border-b border-slate-100">
        <p className="text-xs uppercase tracking-widest text-slate-500">Project plan</p>
        <p className="text-lg font-semibold text-slate-900">Step-by-step roadmap</p>
      </div>
      <div className="divide-y divide-slate-100">
        {plan.map((step, index) => {
          const isOpen = openIndex === index
          return (
            <div key={step.title} className="p-4">
              <button
                className="w-full flex items-center justify-between text-left"
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                  <p className="text-xs text-slate-500">Step {index + 1}</p>
                </div>
                <span className={`text-xl transition-transform ${isOpen ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              {isOpen && (
                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  <p className="leading-relaxed">{step.description}</p>
                  {step.prerequisites && step.prerequisites.length > 0 && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                      <p className="text-xs uppercase text-amber-700 font-semibold mb-1">Prerequisites</p>
                      <ul className="list-disc list-inside space-y-1">
                        {step.prerequisites.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {step.resources && step.resources.length > 0 && (
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
                      <p className="text-xs uppercase text-indigo-700 font-semibold mb-1">Resources</p>
                      <ul className="list-disc list-inside space-y-1">
                        {step.resources.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProjectPlan

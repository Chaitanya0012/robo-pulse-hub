'use client'

import React, { useEffect, useState } from 'react'
import ChatUI from '../../../components/ChatUI'
import BestPractices from '../../../components/BestPractices'
import NextPriority from '../../../components/NextPriority'
import ProjectPlan, { PlanStep } from '../../../components/ProjectPlan'
import Warnings from '../../../components/Warnings'
import { useParams } from 'next/navigation'

type Guidance = {
  warnings?: string[]
  best_practices?: string[]
  next_priority?: string
  meta_cognition_prompts?: string[]
}

type NavigatorResponse = {
  mode: string
  message: string
  plan?: PlanStep[]
  guidance?: Guidance
  questions?: string[]
  analysis?: Record<string, unknown>
}

const ProjectPage: React.FC = () => {
  const params = useParams<{ projectId: string }>()
  const projectId = params?.projectId
  const [plan, setPlan] = useState<PlanStep[]>([])
  const [guidance, setGuidance] = useState<Guidance>({})

  useEffect(() => {
    const fetchInitialPlan = async () => {
      if (!projectId) return
      const response = await fetch('/api/navigator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: 'Initialize project navigator', projectId, mode: 'project_plan' }),
      })
      if (!response.ok) return
      const data: { navigator: NavigatorResponse } = await response.json()
      setPlan(data.navigator.plan ?? [])
      setGuidance(data.navigator.guidance ?? {})
    }

    fetchInitialPlan()
  }, [projectId])

  if (!projectId) {
    return <div className="p-6 text-red-600">Project ID missing from route.</div>
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <div className="flex flex-col gap-4">
        <ChatUI
          projectId={projectId}
          initialPlan={plan}
          onResponse={(res) => {
            setPlan(res.plan ?? [])
            setGuidance(res.guidance ?? {})
          }}
        />
        {guidance.warnings && guidance.warnings.length > 0 && <Warnings warnings={guidance.warnings} />}
        {guidance.best_practices && guidance.best_practices.length > 0 && (
          <BestPractices bestPractices={guidance.best_practices} />
        )}
        {guidance.next_priority && <NextPriority nextPriority={guidance.next_priority} />}
        {plan.length > 0 && <ProjectPlan plan={plan} />}
      </div>
    </div>
  )
}

export default ProjectPage

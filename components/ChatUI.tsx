'use client'

import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import BestPractices from './BestPractices'
import MemoryDebug from './MemoryDebug'
import NextPriority from './NextPriority'
import ProjectPlan, { PlanStep } from './ProjectPlan'
import Warnings from './Warnings'

type Guidance = {
  warnings?: string[]
  best_practices?: string[]
  meta_cognition_prompts?: string[]
  next_priority?: string
}

type NavigatorResponse = {
  mode: string
  message: string
  questions?: string[]
  analysis?: Record<string, unknown>
  plan?: PlanStep[]
  guidance?: Guidance
  memory?: unknown[]
}

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  questions?: string[]
  guidance?: Guidance
  plan?: PlanStep[]
}

type ChatUIProps = {
  projectId: string
  onResponse?: (response: NavigatorResponse) => void
  initialPlan?: PlanStep[]
}

const ChatUI: React.FC<ChatUIProps> = ({ projectId, onResponse, initialPlan = [] }) => {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [latestGuidance, setLatestGuidance] = useState<Guidance>({})
  const [plan, setPlan] = useState<PlanStep[]>(initialPlan)
  const [memory, setMemory] = useState<unknown[]>([])
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const submitMessage = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userEntry: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userEntry])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/navigator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: userEntry.content, projectId, mode: 'live_guidance' }),
      })

      if (!response.ok) {
        throw new Error('Failed to contact navigator')
      }

      const data: { navigator: NavigatorResponse; memories?: unknown[] } = await response.json()
      const navigator = data.navigator
      const assistantEntry: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: navigator.message,
        timestamp: Date.now(),
        questions: navigator.questions,
        guidance: navigator.guidance,
        plan: navigator.plan,
      }

      setMessages((prev) => [...prev, assistantEntry])
      setLatestGuidance(navigator.guidance ?? {})
      setPlan(navigator.plan ?? plan)
      setMemory(data.memories ?? memory)
      onResponse?.(navigator)
    } catch (error) {
      const assistantEntry: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Navigator encountered an error. Please try again.',
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, assistantEntry])
    } finally {
      setLoading(false)
    }
  }

  const metaPrompts = useMemo(() => latestGuidance.meta_cognition_prompts ?? [], [latestGuidance])

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white/80 border border-slate-200 rounded-2xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">Project</p>
            <p className="text-lg font-semibold text-slate-900">Navigator Chat</p>
          </div>
          {loading && <div className="text-sm text-blue-600 animate-pulse">Thinking...</div>}
        </div>
        <div
          ref={listRef}
          className="min-h-[320px] max-h-[480px] overflow-y-auto space-y-3 pr-1"
        >
          {messages.length === 0 && (
            <div className="text-center text-slate-500 text-sm py-10 border rounded-lg border-dashed border-slate-200">
              Ask anything about your robotics project to begin.
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-50 text-slate-900 border border-slate-100'
                }`}
              >
                <div className="text-xs uppercase tracking-wide mb-1 opacity-70">
                  {message.role === 'user' ? 'You' : 'Assistant'}
                </div>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                {message.questions && message.questions.length > 0 && (
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">
                    {message.questions.map((q) => (
                      <li key={q} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={submitMessage} className="mt-4 flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want to build..."
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-sm disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>

      {latestGuidance.warnings && latestGuidance.warnings.length > 0 && (
        <Warnings warnings={latestGuidance.warnings} />
      )}
      {latestGuidance.best_practices && latestGuidance.best_practices.length > 0 && (
        <BestPractices bestPractices={latestGuidance.best_practices} />
      )}
      {latestGuidance.next_priority && <NextPriority nextPriority={latestGuidance.next_priority} />}
      {metaPrompts.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
          <p className="text-indigo-700 font-semibold mb-2">Meta-cognition prompts</p>
          <ul className="space-y-2 text-sm text-indigo-800 list-disc list-inside">
            {metaPrompts.map((prompt) => (
              <li key={prompt}>{prompt}</li>
            ))}
          </ul>
        </div>
      )}
      {plan.length > 0 && <ProjectPlan plan={plan} />}
      {memory.length > 0 && <MemoryDebug memory={memory} />}
    </div>
  )
}

export default ChatUI

import { useEffect, useState } from 'react'

import { Sparkles, CheckCircle2, Loader2, CircleDashed, Users, Gauge } from 'lucide-react'

export const LoadingPipeline: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: 'Profile Extraction & Intent Parsing',
      desc: 'GroqCloud analyzing business domain, target segment, scale, and search vectors',
      icon: Sparkles
    },
    {
      title: 'B2B & B2C Discovery Querying',
      desc: 'Searching the web for B2B prospects with Tavily and local businesses with Geoapify',
      icon: Users
    },
    {
      title: 'Fit Scoring & Rationalization',
      desc: 'Groq model scoring leads (0-100) and generating personalized fit rationales',
      icon: Gauge
    }
  ]

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 1200)
    const timer2 = setTimeout(() => setCurrentStep(2), 2400)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      {/* Intentional Pipeline Header */}
      <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-xs mb-8">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-6">
          <div>
            <h3 className="text-base font-semibold text-zinc-900 flex items-center">
              <Loader2 className="w-4 h-4 mr-2 text-indigo-600 animate-spin" />
              Executing Lead Discovery Pipeline
            </h3>
            <p className="text-xs text-zinc-600 mt-0.5">
              Live multi-agent execution pipeline in progress
            </p>
          </div>
          <span className="inline-flex items-center rounded-full bg-indigo-50 border border-indigo-100/80 px-2.5 py-1 text-xs font-medium text-indigo-700">
            Step {Math.min(currentStep + 1, 3)} of 3
          </span>
        </div>

        {/* Steps progression */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isDone = index < currentStep
            const isCurrent = index === currentStep
            const StepIcon = step.icon

            return (
              <div
                key={index}
                className={`flex items-start space-x-3.5 p-3 rounded-xl transition-all ${
                  isCurrent
                    ? 'bg-zinc-50 border border-zinc-200/70'
                    : isDone
                    ? 'bg-transparent'
                    : 'opacity-50'
                }`}
              >
                <div className="pt-0.5">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : isCurrent ? (
                    <div className="relative flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
                      <StepIcon className="w-2.5 h-2.5 text-indigo-600 absolute" />
                    </div>
                  ) : (
                    <CircleDashed className="w-5 h-5 text-zinc-300" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-medium ${
                        isCurrent
                          ? 'text-zinc-900'
                          : isDone
                          ? 'text-zinc-700'
                          : 'text-zinc-600'
                      }`}
                    >
                      {step.title}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-600">
                      {isDone ? 'COMPLETED' : isCurrent ? 'PROCESSING' : 'PENDING'}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 mt-0.5">{step.desc}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Shimmer line */}
        <div className="mt-6 pt-4 border-t border-zinc-100">
          <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-700 rounded-full"
              style={{
                width: `${currentStep === 0 ? 33 : currentStep === 1 ? 66 : 100}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Shimmer skeleton table rows preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="h-4 w-32 bg-zinc-200 rounded animate-pulse" />
          <div className="h-4 w-20 bg-zinc-200 rounded animate-pulse" />
        </div>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-zinc-200/60 bg-white p-4 shadow-2xs space-y-3 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-200" />
                <div className="space-y-1.5">
                  <div className="h-4 w-40 bg-zinc-200 rounded" />
                  <div className="h-3 w-28 bg-zinc-100 rounded" />
                </div>
              </div>
              <div className="h-6 w-16 bg-zinc-100 rounded-md" />
            </div>
            <div className="h-3 w-full bg-zinc-100 rounded" />
            <div className="h-3 w-4/5 bg-zinc-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

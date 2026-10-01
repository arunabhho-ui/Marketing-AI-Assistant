import type { FC } from 'react'
import { SearchX, ArrowLeft, RefreshCw, Lightbulb } from 'lucide-react'

interface EmptyStateProps {
  onReset: () => void
  onTryExample: (query: string) => void
}

export const EmptyState: FC<EmptyStateProps> = ({ onReset, onTryExample }) => {
  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-4 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-400 shadow-xs mb-5">
        <SearchX className="h-8 w-8 text-zinc-400" />
      </div>

      <h3 className="text-lg font-semibold text-zinc-900 tracking-tight">
        No matching leads found
      </h3>
      <p className="mt-2 text-sm text-zinc-600 max-w-md mx-auto">
        We couldn&apos;t identify high-confidence B2B companies or B2C locations matching this exact criteria.
      </p>

      {/* Suggested tips */}
      <div className="mt-6 rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-4 text-left">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 flex items-center mb-2">
          <Lightbulb className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
          Suggestions to optimize discovery:
        </h4>
        <ul className="text-xs text-zinc-600 space-y-1.5 list-disc list-inside">
          <li>Broaden geographic scope (e.g. mention regional or nationwide vs. single zip code)</li>
          <li>Include target buyer persona titles (e.g. &quot;VP Operations&quot;, &quot;Procurement Lead&quot;)</li>
          <li>Clarify the core value proposition (e.g. cost reduction, compliance, foot traffic)</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onReset}
          className="inline-flex items-center rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          Edit Business Description
        </button>

        <button
          onClick={() =>
            onTryExample(
              'A cloud-based telematics platform for mid-sized cold-chain logistics fleets to reduce temperature spoilage.'
            )
          }
          className="inline-flex items-center rounded-lg bg-zinc-900 px-3.5 py-2 text-xs font-medium text-white hover:bg-zinc-800 transition-colors shadow-2xs cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Try Sample Logistics SaaS Query
        </button>
      </div>
    </div>
  )
}

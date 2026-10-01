import { useState } from 'react'
import type { FC, KeyboardEvent, FormEvent } from 'react'
import { ArrowRight, Sparkles, CornerDownLeft, Target, Building2, Store } from 'lucide-react'
import { EXAMPLE_PROMPTS } from '../data/mockLeads'

interface SearchInputProps {
  value: string
  onChange: (val: string) => void
  onSubmit: () => void
  isLoading?: boolean
}

export const SearchInput: FC<SearchInputProps> = ({
  value,
  onChange,
  onSubmit,
  isLoading = false
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Adhere to modern web guidance: verify isComposing before handling Enter
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !e.nativeEvent.isComposing) {
      e.preventDefault()
      if (value.trim()) {
        onSubmit()
      }
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      onSubmit()
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Intro hero text */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-1.5 rounded-full border border-zinc-200/80 bg-zinc-100/70 px-3 py-1 text-xs font-medium text-zinc-600 mb-4">
          <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
          <span>Universal B2B & B2C Discovery Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 leading-tight">
          Find your ideal clients in minutes.
        </h1>
        <p className="mt-3 text-base text-zinc-600 max-w-xl mx-auto">
          Describe any offering in natural language. We analyze your market, extract ideal target criteria, and discover verified high-fit prospects.
        </p>
      </div>

      {/* Main input card */}
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`relative rounded-2xl border bg-white p-4 transition-all duration-200 ${
            isFocused
              ? 'border-zinc-400 ring-4 ring-zinc-900/5 shadow-md'
              : 'border-zinc-200/90 hover:border-zinc-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100 text-xs text-zinc-600">
            <span className="font-medium text-zinc-700 flex items-center">
              <Target className="w-3.5 h-3.5 mr-1.5 text-zinc-500" />
              Business / Offering Description
            </span>
            <span className="text-[11px] text-zinc-600">
              {value.length > 0 ? `${value.length} characters` : 'Free text input'}
            </span>
          </div>

          <label htmlFor="business-description" className="sr-only">
            Describe the business, product, or service you want to find customers for
          </label>
          <textarea
            id="business-description"
            rows={4}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the business, product, or service you want to find customers for..."
            className="w-full resize-none border-0 bg-transparent p-1 text-base text-zinc-900 placeholder:text-zinc-600 focus:outline-hidden focus:ring-0 leading-relaxed font-normal"
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-100">
            <div className="flex items-center space-x-2 text-xs text-zinc-600">
              <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
                <Building2 className="w-3 h-3 mr-1 text-zinc-500" />
                B2B Web Search
              </span>
              <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
                <Store className="w-3 h-3 mr-1 text-zinc-500" />
                B2C Places
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="hidden sm:inline-flex items-center text-[11px] text-zinc-600">
                <kbd className="rounded border border-zinc-200 bg-zinc-50 px-1 py-0.5 font-mono text-[10px] text-zinc-500 mr-1">
                  ⌘ / Ctrl
                </kbd>
                <kbd className="rounded border border-zinc-200 bg-zinc-50 px-1 py-0.5 font-mono text-[10px] text-zinc-500 mr-1.5">
                  <CornerDownLeft className="inline w-2.5 h-2.5" />
                </kbd>
                to run
              </span>

              <button
                type="submit"
                disabled={!value.trim() || isLoading}
                className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 shadow-xs cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-1.5 text-indigo-400" />
                    Find Clients
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Preset example prompt pills */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-zinc-600 uppercase tracking-wider">
            Or try an example business offering:
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_PROMPTS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChange(sample.query)}
              className="inline-flex items-center rounded-lg border border-zinc-200/90 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 transition-colors shadow-2xs text-left cursor-pointer"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 mr-2" />
              {sample.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

import { Sparkles, Compass, RefreshCw, LayoutTemplate } from 'lucide-react'
import type { ViewState } from '../types'

interface HeaderProps {
  currentView: ViewState
  onSelectView: (view: ViewState) => void
  onReset: () => void
}

export const Header: React.FC<HeaderProps> = ({ currentView, onSelectView, onReset }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onReset}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-xs">
            <Compass className="h-4.5 w-4.5 text-zinc-100" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-base tracking-tight text-zinc-900">Client Finder</span>
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 border border-zinc-200/60">
              <Sparkles className="mr-1 h-3 w-3 text-indigo-500" />
              Phase 4 · B2B (Tavily) & B2C (Geoapify) Active
            </span>
          </div>
        </div>

        {/* State Previewer Controls for reviewer/user */}
        <div className="flex items-center space-x-2">
          <div className="hidden lg:flex items-center rounded-lg border border-zinc-200 bg-zinc-50/80 p-0.5 text-xs text-zinc-600">
            <span className="px-2 py-1 text-[11px] font-medium text-zinc-600 flex items-center">
              <LayoutTemplate className="w-3 h-3 mr-1" />
              State Preview:
            </span>
            <button
              onClick={() => onSelectView('landing')}
              className={`rounded-md px-2.5 py-1 font-medium transition-all ${
                currentView === 'landing'
                  ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/80'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              1. Landing
            </button>
            <button
              onClick={() => onSelectView('confirm-profile')}
              className={`rounded-md px-2.5 py-1 font-medium transition-all ${
                currentView === 'confirm-profile'
                  ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/80'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              2. Confirm Profile
            </button>
            <button
              onClick={() => onSelectView('loading')}
              className={`rounded-md px-2.5 py-1 font-medium transition-all ${
                currentView === 'loading'
                  ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/80'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              3. Loading Pipeline
            </button>
            <button
              onClick={() => onSelectView('results')}
              className={`rounded-md px-2.5 py-1 font-medium transition-all ${
                currentView === 'results'
                  ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/80'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              4. Results
            </button>
            <button
              onClick={() => onSelectView('empty')}
              className={`rounded-md px-2.5 py-1 font-medium transition-all ${
                currentView === 'empty'
                  ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/80'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Empty
            </button>
          </div>

          <button
            onClick={onReset}
            title="Reset to Landing view"
            className="flex items-center space-x-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors shadow-2xs cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 text-zinc-500" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  )
}

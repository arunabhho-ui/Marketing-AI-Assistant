import { Compass, RefreshCw } from 'lucide-react'

interface HeaderProps {
  onReset: () => void
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onReset}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-xs">
            <Compass className="h-4.5 w-4.5 text-zinc-100" />
          </div>
          <span className="font-semibold text-base tracking-tight text-zinc-900">Client Finder</span>
        </div>

        <div className="flex items-center space-x-2">
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

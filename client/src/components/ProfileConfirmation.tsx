import { useState } from 'react'
import type { FC, KeyboardEvent } from 'react'
import {
  Sparkles,
  Building2,
  Store,
  MapPin,
  Users,
  Tag,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  X,
  Plus,
  HelpCircle,
  Cpu
} from 'lucide-react'
import type { StructuredProfile, AudienceType } from '../types'

interface ProfileConfirmationProps {
  initialProfile: StructuredProfile
  businessDescription: string
  meta?: {
    isLiveGroq?: boolean
    modelUsed?: string | null
    notice?: string | null
  }
  onConfirm: (confirmedProfile: StructuredProfile) => void
  onBack: () => void
  onReExtract: () => void
  isExtracting?: boolean
}

export const ProfileConfirmation: FC<ProfileConfirmationProps> = ({
  initialProfile,
  businessDescription,
  meta,
  onConfirm,
  onBack,
  onReExtract,
  isExtracting = false
}) => {
  const [profile, setProfile] = useState<StructuredProfile>(initialProfile)
  const [newKeyword, setNewKeyword] = useState('')

  const handleAudienceChange = (type: AudienceType) => {
    setProfile((prev) => ({ ...prev, audience_type: type }))
  }

  const handleAddKeyword = () => {
    const trimmed = newKeyword.trim()
    if (trimmed && !profile.keywords.includes(trimmed)) {
      setProfile((prev) => ({
        ...prev,
        keywords: [...prev.keywords, trimmed]
      }))
      setNewKeyword('')
    }
  }

  const handleKeywordKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddKeyword()
    }
  }

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setProfile((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== keywordToRemove)
    }))
  }

  const handleResetToDefault = () => {
    setProfile(initialProfile)
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 py-4 animate-in fade-in duration-200">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center rounded-md bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 text-xs font-semibold text-indigo-700">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-indigo-600" />
              Step 2 of 3
            </span>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
              Confirm Your Target Profile
            </h2>
          </div>
          <p className="text-xs text-zinc-600 mt-1">
            GroqCloud extracted these discovery parameters from your description. Review and refine them before launching discovery.
          </p>
        </div>

        {/* Extraction status pill */}
        <div className="flex items-center space-x-2">
          {meta?.isLiveGroq ? (
            <span className="inline-flex items-center rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Live Groq ({meta.modelUsed || 'openai/gpt-oss-20b'})
            </span>
          ) : (
            <span
              className="inline-flex items-center rounded-lg border border-amber-200 bg-amber-50/80 px-2.5 py-1 text-xs font-medium text-amber-800 shadow-2xs"
              title="Add GROQ_API_KEY to your .env file to enable live GroqCloud extraction"
            >
              <Cpu className="w-3.5 h-3.5 mr-1 text-amber-600" />
              Local Extraction Engine
            </span>
          )}

          <button
            type="button"
            onClick={onReExtract}
            disabled={isExtracting}
            className="inline-flex items-center rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 mr-1 ${isExtracting ? 'animate-spin' : ''}`} />
            {isExtracting ? 'Re-extracting...' : 'Re-extract'}
          </button>
        </div>
      </div>

      {meta?.notice && (
        <div className="rounded-xl border border-amber-200/80 bg-amber-50/60 p-3.5 text-xs text-amber-900 flex items-start space-x-2">
          <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Notice: </span>
            <span>{meta.notice}</span>
          </div>
        </div>
      )}

      {/* Original input context accordion */}
      <div className="rounded-xl border border-zinc-200/70 bg-zinc-50/60 p-3.5 text-xs">
        <span className="font-medium text-zinc-700 block mb-1">Source Business Offering:</span>
        <p className="text-zinc-600 italic leading-relaxed">&ldquo;{businessDescription}&rdquo;</p>
      </div>

      {/* Main editable profile form card */}
      <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-xs space-y-6">
        {/* Field 1: Audience Type Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-2">
            Target Audience Segment
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleAudienceChange('B2B')}
              className={`flex items-center justify-center space-x-2 rounded-xl border p-3 text-xs font-medium transition-all cursor-pointer ${
                profile.audience_type === 'B2B'
                  ? 'border-indigo-600 bg-indigo-50/60 text-indigo-950 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              <Building2 className={`w-4 h-4 ${profile.audience_type === 'B2B' ? 'text-indigo-600' : 'text-zinc-400'}`} />
              <span>B2B Companies & Decision Makers</span>
            </button>

            <button
              type="button"
              onClick={() => handleAudienceChange('B2C')}
              className={`flex items-center justify-center space-x-2 rounded-xl border p-3 text-xs font-medium transition-all cursor-pointer ${
                profile.audience_type === 'B2C'
                  ? 'border-emerald-600 bg-emerald-50/60 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              <Store className={`w-4 h-4 ${profile.audience_type === 'B2C' ? 'text-emerald-600' : 'text-zinc-400'}`} />
              <span>B2C Places & Consumers</span>
            </button>

            <button
              type="button"
              onClick={() => handleAudienceChange('both')}
              className={`flex items-center justify-center space-x-2 rounded-xl border p-3 text-xs font-medium transition-all cursor-pointer ${
                profile.audience_type === 'both'
                  ? 'border-zinc-900 bg-zinc-100 text-zinc-950 ring-2 ring-zinc-900/10 shadow-xs'
                  : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              <span className="flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-zinc-400">+</span>
                <Store className="w-3.5 h-3.5 text-emerald-600" />
              </span>
              <span>Both (Universal)</span>
            </button>
          </div>
        </div>

        {/* 2-column core parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-zinc-100">
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center">
              <Tag className="w-3.5 h-3.5 mr-1.5 text-zinc-500" />
              Core Industry / Category
            </label>
            <input
              type="text"
              value={profile.category}
              onChange={(e) => setProfile({ ...profile, category: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-hidden"
              placeholder="e.g. Cold-Chain Fleet Telematics"
            />
          </div>

          {/* Geography */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-zinc-500" />
              Target Geography & Regions
            </label>
            <input
              type="text"
              value={profile.geography}
              onChange={(e) => setProfile({ ...profile, geography: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-hidden"
              placeholder="e.g. United States, Regional Metros"
            />
          </div>

          {/* Company size (if B2B or both) */}
          {(profile.audience_type === 'B2B' || profile.audience_type === 'both') && (
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center">
                <Building2 className="w-3.5 h-3.5 mr-1.5 text-zinc-500" />
                Target Company Size / Scale (B2B)
              </label>
              <input
                type="text"
                value={profile.target_company_size}
                onChange={(e) => setProfile({ ...profile, target_company_size: e.target.value })}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-hidden"
                placeholder="e.g. 50 - 500 employees, Mid-Market Carriers"
              />
            </div>
          )}

          {/* Consumer segment (if B2C or both) */}
          {(profile.audience_type === 'B2C' || profile.audience_type === 'both') && (
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center">
                <Users className="w-3.5 h-3.5 mr-1.5 text-zinc-500" />
                Target Consumer Profile / Places (B2C)
              </label>
              <input
                type="text"
                value={profile.target_consumer_segment}
                onChange={(e) => setProfile({ ...profile, target_consumer_segment: e.target.value })}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-hidden"
                placeholder="e.g. Adults 35-65, Executive Health Seekers"
              />
            </div>
          )}

          {/* Budget / Scale */}
          <div className={profile.audience_type === 'both' ? 'md:col-span-2' : ''}>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center">
              <DollarSign className="w-3.5 h-3.5 mr-1.5 text-zinc-500" />
              Budget / Pricing / Purchasing Signal
            </label>
            <input
              type="text"
              value={profile.budget_scale_signal}
              onChange={(e) => setProfile({ ...profile, budget_scale_signal: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-hidden"
              placeholder="e.g. $10,000 - $50,000 ACV"
            />
          </div>
        </div>

        {/* Keywords Tag Manager */}
        <div className="pt-2 border-t border-zinc-100">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-zinc-700 flex items-center">
              <Tag className="w-3.5 h-3.5 mr-1.5 text-zinc-500" />
              Discovery & Scraping Keywords ({profile.keywords.length})
            </label>
            <span className="text-[11px] text-zinc-400">Click &times; to remove or add custom keywords below</span>
          </div>

          {/* Keyword tags pill list */}
          <div className="flex flex-wrap gap-2 mb-3">
            {profile.keywords.map((kw, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded-lg bg-zinc-100 border border-zinc-200/80 px-2.5 py-1 text-xs font-medium text-zinc-800 transition-colors"
              >
                <span>{kw}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(kw)}
                  className="ml-1.5 text-zinc-400 hover:text-zinc-700 focus:outline-hidden cursor-pointer"
                  title="Remove keyword"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          {/* Add keyword input */}
          <div className="flex items-center space-x-2 max-w-md">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={handleKeywordKeyDown}
              placeholder="Type keyword and press Enter..."
              className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-hidden"
            />
            <button
              type="button"
              onClick={handleAddKeyword}
              disabled={!newKeyword.trim()}
              className="inline-flex items-center rounded-lg bg-zinc-100 border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-200 transition-colors disabled:opacity-40 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add
            </button>
          </div>
        </div>

        {/* AI Synopsis */}
        <div className="pt-2 border-t border-zinc-100">
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
            AI Target Positioning Summary
          </label>
          <textarea
            rows={2}
            value={profile.summary}
            onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-hidden leading-relaxed"
            placeholder="Synopsis of target client and purchasing triggers..."
          />
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            Back to Description
          </button>

          <button
            type="button"
            onClick={handleResetToDefault}
            className="inline-flex items-center rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 transition-colors shadow-2xs cursor-pointer"
            title="Reset edits to initial Groq extraction"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset Edits
          </button>
        </div>

        <button
          type="button"
          onClick={() => onConfirm(profile)}
          className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-zinc-900 px-6 py-2.5 text-xs font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.98] shadow-xs cursor-pointer"
        >
          <span>Confirm & Launch Discovery</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  )
}

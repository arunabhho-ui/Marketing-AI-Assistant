import type { StructuredProfile, Lead } from '../types'

export interface ExtractResponse {
  success: boolean
  data: StructuredProfile
  meta: {
    isLiveGroq: boolean
    modelUsed: string | null
    notice: string | null
  }
}

export interface DiscoveryResponse {
  success: boolean
  data: Lead[]
  meta: {
    audience?: string
    isLiveTavily?: boolean
    isLiveGeoapify?: boolean
    searchQuery?: string | null
    notice?: string | null
    count: number
  }
}

export async function fetchProfileExtraction(description: string): Promise<ExtractResponse> {
  const response = await fetch('/api/extract-profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ description })
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `HTTP ${response.status}: Failed to extract profile`)
  }

  return response.json()
}

export async function fetchB2BDiscovery(profile: StructuredProfile): Promise<DiscoveryResponse> {
  const response = await fetch('/api/discover-b2b', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ profile })
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `HTTP ${response.status}: Failed to discover B2B leads`)
  }

  return response.json()
}

export async function fetchB2CDiscovery(profile: StructuredProfile): Promise<DiscoveryResponse> {
  const response = await fetch('/api/discover-b2c', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ profile })
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `HTTP ${response.status}: Failed to discover B2C leads`)
  }

  return response.json()
}

/**
 * Universal discovery endpoint: Automatically handles B2B, B2C, or both based on profile.audience_type
 */
export async function fetchDiscovery(profile: StructuredProfile): Promise<DiscoveryResponse> {
  const response = await fetch('/api/discover', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ profile })
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `HTTP ${response.status}: Failed to execute discovery pipeline`)
  }

  return response.json()
}

export async function fetchHealth(): Promise<{
  status: string
  config: {
    groqConfigured: boolean
    tavilyConfigured: boolean
    geoapifyConfigured: boolean
  }
}> {
  const response = await fetch('/api/health')
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.statusText}`)
  }
  return response.json()
}

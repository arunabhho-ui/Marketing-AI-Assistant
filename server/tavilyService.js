const TAVILY_SEARCH_URL = 'https://api.tavily.com/search'

function buildSearchQuery(profile) {
  const keywords = (profile.keywords || []).slice(0, 5).join(', ')
  const targetSegment = [profile.target_consumer_segment, profile.target_company_size]
    .filter((value) => value && value !== 'N/A')
    .join('; ')
  const profileText = `${profile.category || ''} ${profile.target_consumer_segment || ''} ${(profile.keywords || []).join(' ')}`
  const buyerTypes = /agri|farm|crop|farmer/i.test(profileText)
    ? 'agricultural lenders and banks, crop insurers, agri-input and seed suppliers, farmer producer organizations and cooperatives, food processors, and agritech platforms with farmer distribution networks'
    : 'resellers, distributors, service providers, associations, institutional buyers, and platforms serving the target customer segment'

  return [
    `Find named B2B customer organizations in ${profile.geography} that could purchase, license, distribute, or integrate ${profile.category}`,
    `Potential buyer types: ${buyerTypes}`,
    `Target segment: ${targetSegment}`,
    `Prioritize organizations already serving this segment or showing relevant adoption and partnership signals. Include evidence in the source pages. Exclude direct product competitors, software vendor roundups, and generic market reports.`,
    `Related terms: ${keywords}`
  ].filter(Boolean).join('. ')
}

function normalizeResult(result, index, profile) {
  let hostname = ''
  try {
    hostname = new URL(result.url).hostname.replace(/^www\./, '')
  } catch {
    hostname = 'Web source'
  }

  const title = result.title?.trim() || hostname
  const snippet = result.content?.trim() || 'No summary was provided by the search result.'

  return {
    id: `b2b-tavily-${index}-${Buffer.from(result.url || title).toString('base64url').slice(0, 12)}`,
    name: title,
    type: 'B2B',
    company: hostname,
    title: 'Potential buyer or partner',
    location: profile.geography || 'Not specified',
    contactUrl: result.url,
    employeeCount: profile.target_company_size || 'Not available from web search',
    industry: profile.category || 'Not specified',
    fitScore: Math.round(Math.max(0, Math.min(100, (result.score || 0) * 100))),
    reason: snippet,
    tags: ['Tavily web result', 'Potential B2B prospect'],
    raw_data: {
      title: result.title,
      url: result.url,
      content: result.content,
      score: result.score
    }
  }
}

export async function searchB2BLeads(profile, apiKey = process.env.TAVILY_API_KEY) {
  if (!apiKey || !apiKey.trim()) {
    return {
      leads: [],
      isLiveTavily: false,
      notice: 'TAVILY_API_KEY is required for B2B web search. Add it to the root .env file.'
    }
  }

  const query = buildSearchQuery(profile)

  try {
    const response = await fetch(TAVILY_SEARCH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey.trim(),
        query,
        topic: 'general',
        search_depth: 'advanced',
        max_results: 15,
        include_answer: false,
        include_raw_content: false
      })
    })

    const payload = await response.json().catch(() => ({}))
    if (!response.ok) {
      const message = payload.detail || payload.message || `Tavily returned HTTP ${response.status}`
      throw new Error(message)
    }

    const results = Array.isArray(payload.results) ? payload.results : []
    return {
      leads: results.map((result, index) => normalizeResult(result, index, profile)),
      isLiveTavily: true,
      searchQuery: query,
      notice: results.length === 0
        ? 'Tavily completed the web search but found no relevant results for this profile.'
        : 'B2B prospects are web-search matches. Review the source evidence before outreach.'
    }
  } catch (error) {
    const message = error?.message || String(error)
    console.error('[TavilyService] Web search failed:', message)
    return {
      leads: [],
      isLiveTavily: false,
      searchQuery: query,
      notice: `Tavily B2B web search is unavailable: ${message}`
    }
  }
}
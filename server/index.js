import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { extractProfile } from './groqService.js'
import { searchB2BLeads } from './tavilyService.js'
import { searchB2CLeads } from './geoapifyService.js'
import { scoreLeadsUntilTarget } from './scoringService.js'

// Load environment variables from parent root or current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env') })
dotenv.config() // fallback to server/.env if present

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    config: {
      groqConfigured: Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim() !== ''),
      tavilyConfigured: Boolean(process.env.TAVILY_API_KEY && process.env.TAVILY_API_KEY.trim() !== ''),
      geoapifyConfigured: Boolean(process.env.GEOAPIFY_API_KEY && process.env.GEOAPIFY_API_KEY.trim() !== '')
    }
  })
})

/**
 * Phase 2 Endpoint: Extract structured customer profile
 * POST /api/extract-profile
 * Body: { description: string }
 */
app.post('/api/extract-profile', async (req, res) => {
  try {
    const { description } = req.body

    if (!description || typeof description !== 'string' || !description.trim()) {
      return res.status(400).json({
        error: 'Missing required field "description" in request body.'
      })
    }

    console.log(`[API] Extracting profile for query (${description.length} chars): "${description.substring(0, 80)}..."`)

    const result = await extractProfile(description.trim())

    return res.json({
      success: true,
      data: result.profile,
      meta: {
        isLiveGroq: result.isLiveGroq,
        modelUsed: result.modelUsed || null,
        notice: result.notice || null
      }
    })
  } catch (error) {
    console.error('[API] /api/extract-profile error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to extract profile: ' + error.message
    })
  }
})

/**
 * Phase 3 Endpoint: B2B Prospect Discovery via Tavily web search
 * POST /api/discover-b2b
 * Body: { profile: object }
 */
app.post('/api/discover-b2b', async (req, res) => {
  try {
    const { profile } = req.body

    if (!profile || typeof profile !== 'object') {
      return res.status(400).json({
        error: 'Missing required field "profile" object in request body.'
      })
    }

    console.log(`[API] Initiating B2B discovery for category: "${profile.category}", geo: "${profile.geography}"`)

    const result = await searchB2BLeads(profile)
    const candidates = (result.leads || []).slice(0, 15).map((lead) => ({
      ...lead,
      type: 'B2B',
      reason: lead.reason || `Web result relevant to ${profile.category}. Review the source before outreach.`,
      tags: lead.tags || ['B2B', 'Tavily web result', 'Potential buyer or partner']
    }))
    const scoring = await scoreLeadsUntilTarget({ ...profile, audience_type: 'B2B' }, candidates)

    return res.json({
      success: true,
      data: scoring.scoredLeads,
      meta: {
        isLiveTavily: result.isLiveTavily,
        searchQuery: result.searchQuery || null,
        isLiveGroq: scoring.isLiveGroq,
        evaluatedCount: scoring.evaluatedCount,
        notice: [result.notice, scoring.notice].filter(Boolean).join(' ') || null,
        count: scoring.scoredLeads.length
      }
    })
  } catch (error) {
    console.error('[API] /api/discover-b2b error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to discover B2B leads: ' + error.message
    })
  }
})

/**
 * Phase 4 Endpoint: B2C Place & Consumer Discovery via Geoapify
 * POST /api/discover-b2c
 * Body: { profile: object }
 */
app.post('/api/discover-b2c', async (req, res) => {
  try {
    const { profile } = req.body

    if (!profile || typeof profile !== 'object') {
      return res.status(400).json({
        error: 'Missing required field "profile" object in request body.'
      })
    }

    console.log(`[API] Initiating B2C discovery for category: "${profile.category}", geo: "${profile.geography}"`)

    const result = await searchB2CLeads(profile)
    const candidates = (result.leads || []).slice(0, 15).map((place) => ({
      ...place,
      type: 'B2C',
      reason: place.reason || `Local place relevant to ${profile.category}.`,
      tags: place.tags || ['B2C', place.place_type || 'Facility']
    }))
    const scoring = await scoreLeadsUntilTarget({ ...profile, audience_type: 'B2C' }, candidates)

    return res.json({
      success: true,
      data: scoring.scoredLeads,
      meta: {
        isLiveGeoapify: result.isLiveGeoapify,
        isLiveGroq: scoring.isLiveGroq,
        evaluatedCount: scoring.evaluatedCount,
        notice: [result.notice, scoring.notice].filter(Boolean).join(' ') || null,
        count: scoring.scoredLeads.length
      }
    })
  } catch (error) {
    console.error('[API] /api/discover-b2c error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to discover B2C leads: ' + error.message
    })
  }
})

/**
 * Universal Discovery Endpoint: Dynamically orchestrates B2B, B2C, or both based on profile
 * POST /api/discover
 * Body: { profile: object }
 */
app.post('/api/discover', async (req, res) => {
  try {
    const { profile } = req.body

    if (!profile || typeof profile !== 'object') {
      return res.status(400).json({
        error: 'Missing required field "profile" object in request body.'
      })
    }

    const audience = profile.audience_type || 'both'
    console.log(`[API] Universal discovery triggered for audience "${audience}" (${profile.category})`)

    let allLeads = []
    const meta = {
      audience,
      isLiveTavily: false,
      isLiveGeoapify: false,
      searchQuery: null,
      notices: []
    }

    if (audience === 'B2B') {
      const b2bRes = await searchB2BLeads(profile)
      meta.isLiveTavily = b2bRes.isLiveTavily
      meta.searchQuery = b2bRes.searchQuery || null
      if (b2bRes.notice) meta.notices.push(b2bRes.notice)
      allLeads = (b2bRes.leads || []).slice(0, 15).map((l) => ({
        ...l,
        type: 'B2B',
        reason: l.reason || `Web result relevant to ${profile.category} in ${l.location}. Review the source before treating it as a qualified prospect.`,
        tags: l.tags || ['B2B', profile.category?.split(' ')[0] || 'Business', 'Tavily web result']
      }))
    } else if (audience === 'B2C') {
      const b2cRes = await searchB2CLeads(profile)
      meta.isLiveGeoapify = b2cRes.isLiveGeoapify
      if (b2cRes.notice) meta.notices.push(b2cRes.notice)
      allLeads = (b2cRes.leads || []).slice(0, 15).map((l) => ({
        ...l,
        type: 'B2C',
        reason: l.reason || `Target local facility matching ${profile.category} in ${l.location}.`,
        tags: l.tags || ['B2C', l.place_type || 'Facility']
      }))
    } else {
      // Both B2B and B2C
      const [b2bRes, b2cRes] = await Promise.all([
        searchB2BLeads(profile),
        searchB2CLeads(profile)
      ])

      meta.isLiveTavily = b2bRes.isLiveTavily
      meta.searchQuery = b2bRes.searchQuery || null
      meta.isLiveGeoapify = b2cRes.isLiveGeoapify
      if (b2bRes.notice) meta.notices.push(b2bRes.notice)
      if (b2cRes.notice) meta.notices.push(b2cRes.notice)

      const b2bEnriched = (b2bRes.leads || []).slice(0, 15).map((l) => ({
        ...l,
        type: 'B2B',
        reason: l.reason || `Web result relevant to ${profile.category}. Review the source before treating it as a qualified prospect.`,
        tags: l.tags || ['B2B', 'Tavily web result', 'Potential buyer or partner']
      }))

      const b2cEnriched = (b2cRes.leads || []).slice(0, 15).map((l) => ({
        ...l,
        type: 'B2C',
        reason: l.reason || `Key community outpatient/retail location for ${profile.category}.`,
        tags: l.tags || ['B2C', l.place_type || 'Facility']
      }))

      // Interleave results cleanly
      allLeads = []
      const maxLen = Math.max(b2bEnriched.length, b2cEnriched.length)
      for (let i = 0; i < maxLen; i++) {
        if (b2bEnriched[i]) allLeads.push(b2bEnriched[i])
        if (b2cEnriched[i]) allLeads.push(b2cEnriched[i])
      }
    }
    
    const wantsB2B = audience === 'B2B' || audience === 'both' || !['B2B', 'B2C'].includes(audience)
    const wantsB2C = audience === 'B2C' || audience === 'both' || !['B2B', 'B2C'].includes(audience)
    const b2bCandidates = allLeads.filter((lead) => lead.type === 'B2B').slice(0, 15)
    const b2cCandidates = allLeads.filter((lead) => lead.type === 'B2C').slice(0, 15)
    const [b2bScoring, b2cScoring] = await Promise.all([
      wantsB2B
        ? scoreLeadsUntilTarget({ ...profile, audience_type: 'B2B' }, b2bCandidates)
        : Promise.resolve({ scoredLeads: [], evaluatedCount: 0, isLiveGroq: false }),
      wantsB2C
        ? scoreLeadsUntilTarget({ ...profile, audience_type: 'B2C' }, b2cCandidates)
        : Promise.resolve({ scoredLeads: [], evaluatedCount: 0, isLiveGroq: false })
    ])
    meta.evaluated = { B2B: b2bScoring.evaluatedCount, B2C: b2cScoring.evaluatedCount }
    meta.isLiveGroq = b2bScoring.isLiveGroq || b2cScoring.isLiveGroq
    meta.modelUsed = b2bScoring.modelUsed || b2cScoring.modelUsed || null
    if (b2bScoring.notice) meta.notices.push(`B2B: ${b2bScoring.notice}`)
    if (b2cScoring.notice) meta.notices.push(`B2C: ${b2cScoring.notice}`)

    allLeads = []
    const maxQualified = Math.max(b2bScoring.scoredLeads.length, b2cScoring.scoredLeads.length)
    for (let i = 0; i < maxQualified; i++) {
      if (b2bScoring.scoredLeads[i]) allLeads.push(b2bScoring.scoredLeads[i])
      if (b2cScoring.scoredLeads[i]) allLeads.push(b2cScoring.scoredLeads[i])
    }

    return res.json({
      success: true,
      data: allLeads,
      meta: {
        ...meta,
        count: allLeads.length,
        notice: meta.notices.join(' ') || null
      }
    })
  } catch (error) {
    console.error('[API] /api/discover error:', error)
    return res.status(500).json({
      success: false,
      error: 'Discovery pipeline failed: ' + error.message
    })
  }
})

app.listen(PORT, () => {
  console.log(`[Server] Client Finder API running at http://localhost:${PORT}`)
  console.log(`[Server] GroqCloud: ${process.env.GROQ_API_KEY ? 'Configured ✓' : 'Fallback active'}`)
  console.log(`[Server] Tavily: ${process.env.TAVILY_API_KEY ? 'Configured' : 'Not configured'}`)
  console.log(`[Server] Geoapify: ${process.env.GEOAPIFY_API_KEY ? 'Configured ✓' : 'Fallback active'}`)
})

import test from 'node:test'
import assert from 'node:assert/strict'
import { searchB2BLeads } from '../tavilyService.js'

const profile = {
  category: 'Satellite-based farmer decision assistant',
  geography: 'India',
  target_company_size: 'SMB to enterprise',
  target_consumer_segment: 'Indian farmers',
  keywords: ['agriculture', 'crop health', 'satellite imagery']
}

test('Tavily search maps web results and preserves source evidence', async () => {
  const originalFetch = globalThis.fetch
  let requestBody
  globalThis.fetch = async (_url, options) => {
    requestBody = JSON.parse(options.body)
    return new Response(JSON.stringify({
      results: [{
        title: 'Example AgriTech Company',
        url: 'https://example.com/solutions',
        content: 'Provides crop monitoring services for farms.',
        score: 0.87
      }]
    }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }

  try {
    const result = await searchB2BLeads(profile, 'test-key')
    assert.equal(requestBody.api_key, 'test-key')
    assert.equal(requestBody.max_results, 15)
    assert.match(requestBody.query, /Satellite-based farmer decision assistant/)
    assert.equal(result.isLiveTavily, true)
    assert.equal(result.leads.length, 1)
    assert.equal(result.leads[0].name, 'Example AgriTech Company')
    assert.equal(result.leads[0].contactUrl, 'https://example.com/solutions')
    assert.equal(result.leads[0].reason, 'Provides crop monitoring services for farms.')
    assert.equal(result.leads[0].fitScore, 87)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('Tavily search returns a setup notice when the API key is missing', async () => {
  const result = await searchB2BLeads(profile, '')
  assert.equal(result.isLiveTavily, false)
  assert.deepEqual(result.leads, [])
  assert.match(result.notice, /TAVILY_API_KEY/)
})
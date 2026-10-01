import test from 'node:test'
import assert from 'node:assert/strict'
import { scoreLeadsUntilTarget } from '../scoringService.js'

const candidates = Array.from({ length: 15 }, (_, index) => ({
  id: `lead-${index + 1}`,
  name: `Lead ${index + 1}`,
  type: 'B2B',
  fitScore: 99
}))

test('scoring stops after a batch reaches five leads scoring at least 60', async () => {
  let calls = 0
  const result = await scoreLeadsUntilTarget({}, candidates, {
    scoreBatch: async (_profile, batch) => {
      calls++
      return {
        scoredLeads: batch.map((lead) => ({ ...lead, fitScore: 60 })),
        isLiveGroq: true,
        modelUsed: 'test-model'
      }
    }
  })

  assert.equal(calls, 1)
  assert.equal(result.evaluatedCount, 5)
  assert.equal(result.scoredLeads.length, 5)
  assert.ok(result.scoredLeads.every((lead) => lead.fitScore >= 60))
})

test('scoring evaluates at most 15 leads and excludes all scores below 60', async () => {
  const batches = []
  const result = await scoreLeadsUntilTarget({}, candidates, {
    scoreBatch: async (_profile, batch) => {
      batches.push(batch)
      return {
        scoredLeads: batch.map((lead) => ({
          ...lead,
          fitScore: Number(lead.id.split('-')[1]) <= 4 ? 75 : 59
        })),
        isLiveGroq: true
      }
    }
  })

  assert.deepEqual(batches.map((batch) => batch.length), [5, 5, 5])
  assert.equal(result.evaluatedCount, 15)
  assert.equal(result.scoredLeads.length, 4)
  assert.ok(result.scoredLeads.every((lead) => lead.fitScore >= 60))
  assert.match(result.notice, /4 of 5 results scoring at least 60/)
})
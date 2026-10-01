import { Groq } from 'groq-sdk';

/**
 * Score leads using Groq LLM based on the extracted profile.
 * Returns the original leads enriched with `fitScore` (0-100) and `reason`.
 * If GROQ_API_KEY is missing or the API call fails, falls back to the
 * existing heuristic scores and marks the result as non‑live.
 *
 * @param {object} profile - Structured profile from Groq extraction.
 * @param {Array<object>} leads - Array of lead objects (B2B or B2C) to score.
 * @param {string} [apiKey] - Optional API key; defaults to env var.
 * @returns {Promise<{scoredLeads: Array<object>, isLiveGroq: boolean, modelUsed?: string, notice?: string}>}
 */
export async function scoreLeads(profile, leads, apiKey = process.env.GROQ_API_KEY) {
  if (!leads || leads.length === 0) {
    return {
      scoredLeads: [],
      isLiveGroq: false,
      notice: 'No discovered leads available for scoring.'
    };
  }

  if (!apiKey || apiKey.trim() === '') {
    throw new Error('GROQ_API_KEY is required for live lead scoring. Add it to your .env file.');
  }

  const groq = new Groq({ apiKey: apiKey.trim() });

  // Build a concise representation for each lead.
  const leadSummaries = leads
    .map((lead, i) => {
      const minimal = {
        id: lead.id,
        name: lead.name,
        type: lead.type,
        company: lead.company || lead.place_type || undefined,
        title: lead.title,
        location: lead.location,
        industry: lead.industry,
        evidence: (lead.raw_data?.content || lead.reason || '').slice(0, 500)
      };
      return `Lead ${i + 1}: ${JSON.stringify(minimal)}`;
    })
    .join('\n');

  const systemPrompt = `You are an AI analyst that evaluates how well a prospect (lead) matches a target business profile.\nGiven a profile JSON object and a list of leads, produce a JSON array where each element contains:\n  - id (matching the lead's id)\n  - fitScore (integer 0‑100, higher is better)\n  - reason (one short sentence explaining the score)\nScore each lead independently using the information provided. Use the profile fields such as audience_type, category, geography, keywords, etc. Keep the JSON strictly valid (no markdown).`;

  const userPrompt = `Profile: ${JSON.stringify(profile)}\nLeads:\n${leadSummaries}`;

  try {
    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 2048
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error('Empty response from Groq');

    const parsed = JSON.parse(raw);
    // Ensure parsed is an array of objects.
    if (!Array.isArray(parsed)) throw new Error('Expected an array of scoring objects');

    const scoredLeads = leads.map(lead => {
      const match = parsed.find(item => item.id === lead.id);
      if (match && typeof match.fitScore === 'number' && Number.isFinite(match.fitScore)) {
        return {
          ...lead,
          fitScore: Math.max(0, Math.min(100, Math.round(match.fitScore))),
          reason: match.reason || lead.reason || ''
        };
      }
      throw new Error(`Groq did not return a valid score for lead ${lead.id}`);
    });

    return {
      scoredLeads,
      isLiveGroq: true,
      modelUsed: 'openai/gpt-oss-20b'
    };
  } catch (error) {
    console.error('[ScoringService] Error during LLM scoring:', error.message);
    throw new Error(`Groq scoring failed: ${error.message}`);
  }
}

export async function scoreLeadsUntilTarget(profile, leads, options = {}) {
  const targetCount = options.targetCount ?? 5;
  const minScore = options.minScore ?? 60;
  const maxEvaluated = options.maxEvaluated ?? 15;
  const batchSize = options.batchSize ?? 5;
  const scoreBatch = options.scoreBatch ?? scoreLeads;
  const candidates = (leads || []).slice(0, maxEvaluated);
  const qualifiedLeads = [];
  let evaluatedCount = 0;
  let isLiveGroq = false;
  let modelUsed = null;
  let notice = null;

  for (let offset = 0; offset < candidates.length && qualifiedLeads.length < targetCount; offset += batchSize) {
    const batch = candidates.slice(offset, offset + batchSize);
    const batchProfile = {
      ...profile,
      audience_type: batch[0]?.type || profile.audience_type
    };

    try {
      const result = await scoreBatch(batchProfile, batch);
      evaluatedCount += batch.length;
      isLiveGroq = isLiveGroq || result.isLiveGroq;
      modelUsed = result.modelUsed || modelUsed;
      qualifiedLeads.push(...result.scoredLeads.filter((lead) => lead.fitScore >= minScore));
    } catch (error) {
      notice = `Scoring stopped after ${evaluatedCount} evaluated results: ${error.message}`;
      break;
    }
  }

  const selectedLeads = qualifiedLeads.slice(0, targetCount);
  if (!notice) {
    notice = selectedLeads.length >= targetCount
      ? `Found ${selectedLeads.length} results scoring at least ${minScore} after evaluating ${evaluatedCount} candidates.`
      : `Found ${selectedLeads.length} of ${targetCount} results scoring at least ${minScore} after evaluating ${evaluatedCount} of up to ${maxEvaluated} candidates.`
  }

  return {
    scoredLeads: selectedLeads,
    evaluatedCount,
    isLiveGroq,
    modelUsed,
    notice
  };
}

# Client Finder

Client Finder turns a plain-language product or service description into an editable target profile, searches for possible B2B and B2C prospects, and scores returned candidates against that profile.

> Search results are leads to review, not verified buyers or proof of purchase intent. Tavily searches public web pages; Geoapify returns mapped places. Always check the source before contacting a prospect.

## How It Works

1. **Describe the offering.** Enter a product, service, audience, and location in natural language.
2. **Extract a target profile.** Groq (`openai/gpt-oss-20b`) converts the description into an audience type, category, geography, company size, consumer segment, keywords, budget signal, and summary.
3. **Review and edit.** Confirm or change the extracted profile before discovery.
4. **Search for candidates.**
   - **B2B:** Tavily searches the web using the product, geography, audience, and keywords. Results include a page title, source domain, link, and evidence snippet. They can be articles, directories, vendor pages, or organizations; the search does not establish that a company wants to buy.
   - **B2C:** Geoapify searches mapped points of interest near a geocoded location. It returns places, not individual consumers. It cannot identify farmers as people, and farm/farmer profiles currently return a notice instead of unrelated businesses.
5. **Score and filter.** Groq scores candidates from 0 to 100 and gives a short rationale. Only candidates scoring **60 or higher** are displayed. B2B and B2C are evaluated independently in batches of five: each side stops after finding five qualifying results or evaluating up to 15 candidates. If fewer than 15 candidates are returned by a provider, only the available candidates can be evaluated.
6. **Review results.** Filter by B2B/B2C, sort by fit score or name, inspect details, and open the provider source or map link.

The discovery loading screen waits for the API request to finish; its animation does not determine when results are shown.

## Technology

- **Client:** React, TypeScript, Vite, Tailwind CSS, and Lucide icons.
- **Server:** Node.js, Express, and ES modules.
- **Profile extraction and scoring:** GroqCloud via `groq-sdk`, using `openai/gpt-oss-20b`.
- **B2B discovery:** Tavily Search API.
- **B2C discovery:** Geoapify Geocoding and Places APIs.

## Requirements

- Node.js 20.19+ or 22.12+ (a current Node.js LTS release is recommended).
- API keys for Groq, Tavily, and Geoapify. Groq is required for extraction and scoring. Tavily is required for B2B web search. Geoapify is required for B2C place discovery.

## Setup

From the repository root:

```powershell
npm install
npm --prefix client install
npm --prefix server install
Copy-Item .env.example .env
```

Add your API keys to `.env`:

```dotenv
GROQ_API_KEY=your_groq_api_key
TAVILY_API_KEY=your_tavily_api_key
GEOAPIFY_API_KEY=your_geoapify_api_key
PORT=5000
```

Keep `.env` private. It is ignored by Git; `.env.example` contains blank placeholders and is safe to commit.

Start the client and API together:

```powershell
npm run dev
```

Vite serves the client at `http://localhost:5173` and proxies `/api` calls to the Express server at `http://localhost:5000`. Keep the server running while using the client. If the UI reports an HTTP 502 or Vite reports `ECONNREFUSED`, check that the backend is running on port 5000.

Run either process separately when needed:

```powershell
npm run client
npm run server
```

Create a production client build:

```powershell
npm run build
```

Run the server regression tests:

```powershell
node --test server/tests/real-input-only.test.js server/tests/tavily-service.test.js server/tests/geoapify-service.test.js server/tests/scoring-target.test.js
```

## Environment Variables

| Variable | Required for | Description |
| --- | --- | --- |
| `GROQ_API_KEY` | Profile extraction and lead scoring | GroqCloud API key. |
| `TAVILY_API_KEY` | B2B discovery | Tavily API key for web search. |
| `GEOAPIFY_API_KEY` | B2C discovery | Geoapify API key for geocoding and Places search. |
| `PORT` | Server | Express listen port; defaults to `5000`. |

The backend loads `.env` from the repository root, with an optional fallback to `server/.env`.

## API

All request bodies and responses are JSON.

### `GET /api/health`

Returns server status and whether each API key is configured. It does not return key values.

### `POST /api/extract-profile`

Request:

```json
{
  "description": "A booking platform that helps Austin medical clinics schedule patients and reduce missed appointments."
}
```

Success includes `data` with the structured profile and `meta` with the Groq model and live status.

### `POST /api/discover`

Runs discovery based on `profile.audience_type`, which can be `B2B`, `B2C`, or `both`.

Request:

```json
{
  "profile": {
    "audience_type": "both",
    "category": "Medical appointment scheduling",
    "geography": "Austin, Texas",
    "target_company_size": "10-200 employees",
    "target_consumer_segment": "Local patients",
    "keywords": ["clinic booking", "patient scheduling"],
    "budget_scale_signal": "Mid-market",
    "summary": "Help clinics reduce missed appointments."
  }
}
```

The response includes qualified leads in `data` and metadata in `meta`, including per-audience evaluated counts and provider/scoring notices.

### `POST /api/discover-b2b`

Runs the Tavily B2B search and qualification flow for the provided `profile`.

### `POST /api/discover-b2c`

Runs the Geoapify B2C place search and qualification flow for the provided `profile`.

## Current Limits and Interpretation

- The five-result goal is a target, not a guarantee. If fewer than five candidates score at least 60 after up to 15 evaluations, fewer results are returned with a notice.
- A provider can return fewer than 15 candidates; Client Finder can only score what it receives.
- Tavily's results are public web-search matches, not a structured business registry or verified contact database. A high fit score ranks the available evidence against the profile; it does not confirm budget, authority, or purchase intent.
- Geoapify returns places in its map database, not individual consumers. Location resolution and supported place categories affect coverage.
- Agriculture/farmer B2C discovery needs a farm directory, agricultural registry, or another farmer-level data source; Geoapify is not such a source.
- API provider outages, rate limits, invalid keys, unsupported place categories, and empty geographic coverage are surfaced as notices rather than replaced with demo leads.
- This is a prototype. It does not currently provide user authentication, per-user API-key storage, persistent CRM records, or contact verification.

## Repository Layout

```text
client/                 React and TypeScript Vite application
client/src/components/  Profile, loading, results, and detail UI
server/index.js         Express API and discovery orchestration
server/groqService.js   Groq profile extraction
server/scoringService.js Groq scoring and qualification limits
server/tavilyService.js Tavily B2B web search
server/geoapifyService.js Geoapify B2C place search
server/tests/           Provider and scoring regression tests
.env.example            Blank environment variable template
```

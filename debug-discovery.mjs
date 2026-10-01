import dotenv from 'dotenv'
import { extractProfile } from './server/groqService.js'
import { searchB2BLeads } from './server/tavilyService.js'
import { searchB2CLeads } from './server/geoapifyService.js'

dotenv.config()

const profile = {
  audience_type: 'both',
  category: 'Satellite-based farmer decision-making assistant',
  geography: 'India',
  target_company_size: 'SMB to enterprise',
  target_consumer_segment: 'Farmers in India',
  keywords: ['agriculture', 'crop health', 'satellite imagery', 'precision farming'],
  budget_scale_signal: 'SMB enterprise',
  summary: 'Farmers in India'
}

try {
  const ex = await extractProfile('A satellite-based farmer decision-making app using Sentinel-2 and radar to predict crop health for Indian farmers across seasons.')
  console.log('EXTRACT_OK')
  console.log(JSON.stringify(ex).slice(0, 800))
} catch (e) {
  console.log('EXTRACT_ERR')
  console.log(e.message)
}

try {
  const b2b = await searchB2BLeads(profile)
  console.log('B2B_OK', b2b.leads.length)
  console.log(b2b.notice || '')
} catch (e) {
  console.log('B2B_ERR')
  console.log(e.message)
}

try {
  const b2c = await searchB2CLeads(profile)
  console.log('B2C_OK', b2c.leads.length)
  console.log(b2c.notice || '')
} catch (e) {
  console.log('B2C_ERR')
  console.log(e.message)
}

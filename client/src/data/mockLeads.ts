import type { Lead } from '../types'

export const MOCK_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Marcus Vance',
    type: 'B2B',
    company: 'Apex Cold-Chain Logistics Inc.',
    title: 'VP of Fleet Operations & Telematics',
    location: 'Chicago, IL, USA',
    fitScore: 96,
    reason: 'Actively expanding refrigerated interstate fleet; recent press release highlighted initiatives to reduce reefer spoilage and automate compliance.',
    contactUrl: 'https://linkedin.com/in/marcus-vance-sample',
    website: 'https://apexcoldchain.example.com',
    employeeCount: '250 - 500',
    industry: 'Freight & Supply Chain',
    tags: ['Cold Chain', 'Fleet IoT', 'Mid-Market']
  },
  {
    id: 'lead-2',
    name: 'Metro North Wellness Center',
    type: 'B2C',
    placeType: 'Medical & Diagnostic Clinic',
    company: 'Metro North Healthcare Group',
    location: 'Austin, TX, USA',
    address: '4201 W Braker Lane, Suite 300, Austin, TX 78759',
    fitScore: 92,
    reason: 'High foot-traffic outpatient center currently marketing comprehensive preventative health checkups and cardiology referrals to local residents.',
    contactUrl: 'https://maps.google.com/?q=Metro+North+Wellness+Austin',
    website: 'https://metronorthwellness.example.com',
    phone: '+1 (512) 555-0184',
    tags: ['Cardiology', 'Preventative Care', 'Outpatient']
  },
  {
    id: 'lead-3',
    name: 'Elena Rostova',
    type: 'B2B',
    company: 'TransGlobal Cargo Solutions',
    title: 'Director of Procurement & Technology',
    location: 'Rotterdam, Netherlands',
    fitScore: 89,
    reason: 'Oversees software evaluation for 400+ intermodal transport vehicles. Profile mentions legacy TMS migration and dispatch automation.',
    contactUrl: 'https://linkedin.com/in/elena-rostova-sample',
    website: 'https://transglobalcargo.example.com',
    employeeCount: '500 - 1,000',
    industry: 'Maritime & Road Logistics',
    tags: ['Intermodal', 'Procurement', 'Enterprise']
  },
  {
    id: 'lead-4',
    name: 'Horizon Occupational Health & Screenings',
    type: 'B2C',
    placeType: 'Corporate & Community Health Clinic',
    company: 'Horizon Health Network',
    location: 'Denver, CO, USA',
    address: '1800 15th Street, LoDo District, Denver, CO 80202',
    fitScore: 85,
    reason: 'Offers walk-in executive physicals, cardiac stress testing, and routine employer-sponsored screenings with immediate scheduling.',
    contactUrl: 'https://maps.google.com/?q=Horizon+Health+Denver',
    website: 'https://horizonhealth-lodo.example.com',
    phone: '+1 (303) 555-0199',
    tags: ['Executive Screening', 'Walk-in', 'Occupational']
  },
  {
    id: 'lead-5',
    name: 'Sarah Chen-Muller',
    type: 'B2B',
    company: 'Kinetic Freight Haulers',
    title: 'Chief Operating Officer',
    location: 'Dallas-Fort Worth, TX, USA',
    fitScore: 81,
    reason: 'High-growth regional carrier (180 power units) seeking fuel optimization and ELD-integrated predictive maintenance solutions.',
    contactUrl: 'https://linkedin.com/in/sarah-chen-muller-sample',
    website: 'https://kineticfreight.example.com',
    employeeCount: '100 - 250',
    industry: 'Truckload Transportation',
    tags: ['Regional Carrier', 'Operations', 'Growth Stage']
  }
]

export const EXAMPLE_PROMPTS = [
  {
    label: 'Logistics Fleet SaaS',
    query: 'A cloud-based telematics platform for mid-sized cold-chain logistics fleets to reduce temperature spoilage and automate food safety compliance.'
  },
  {
    label: 'Cardiac Screening Package',
    query: 'An advanced preventative cardiac screening package offered at an outpatient diagnostic center for executive wellness and high-risk patients.'
  },
  {
    label: 'Organic Cold-Brew Wholesale',
    query: 'Specialty organic nitro cold-brew kegs and bottled concentrate for independent coffee shops, boutique bakeries, and co-working spaces.'
  },
  {
    label: 'Cybersecurity SOC Compliance',
    query: 'An automated SOC 2 and ISO 27001 continuous audit platform tailored for Series A and Series B fintech and healthtech startups.'
  }
]

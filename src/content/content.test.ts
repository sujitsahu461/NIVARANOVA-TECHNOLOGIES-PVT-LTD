/**
 * Guards for the site's honesty rules. These fail the build if content
 * drifts into claims the evidence does not support.
 */
import { describe, expect, it } from 'vitest'
import { company } from '../config/company'
import { capabilities, civicSetuStatus, roadmap } from './civicsetu'
import { focusAreas } from './focus-areas'
import { insights } from './insights'
import { routeMeta } from './routes'
import { solutions } from './solutions'

const allCopy = JSON.stringify({ capabilities, civicSetuStatus, roadmap, focusAreas, solutions, routeMeta, company })

describe('CivicSetu capability statuses', () => {
  it('gives every capability a stated source of evidence', () => {
    for (const capability of capabilities) {
      expect(capability.evidence, capability.name).toMatch(/\[(REQ|WDR|TEST|DEC|PLAN)\]/)
    }
  })

  it('marks a capability as tested only when test evidence is cited', () => {
    for (const capability of capabilities.filter((item) => item.status === 'tested')) {
      expect(capability.evidence, capability.name).toContain('[TEST]')
    }
  })

  it('keeps AI features planned, in line with the V1 no-ML decision', () => {
    const ai = capabilities.filter((item) => /\bAI\b|machine learning/i.test(item.name + item.detail))
    expect(ai.length).toBeGreaterThan(0)
    for (const capability of ai) expect(capability.status, capability.name).toBe('planned')
  })

  it('states that CivicSetu is not deployed', () => {
    const deployment = civicSetuStatus.find((item) => item.label === 'Deployment')
    expect(deployment?.value).toMatch(/^Not deployed/)
  })
})

describe('copy', () => {
  it('does not describe CivicSetu as AI-powered', () => {
    expect(allCopy).not.toMatch(/AI-powered/i)
  })

  it.each([
    /testimonial/i,
    /trusted by/i,
    /\bawards?\b/i,
    /\bcertified\b/i,
    /\bISO \d/i,
    /\d+\s*%/,
    /\b\d{1,3}(,\d{3})+\+? (users|citizens|complaints)/i,
    /\bSLA\b|guaranteed/i,
  ])('contains no unsupported claim matching %s', (pattern) => {
    expect(allCopy).not.toMatch(pattern)
  })

  it('keeps unverified registration and contact details empty', () => {
    // Update this test deliberately when real, verified values are added.
    expect(company.registration).toEqual({ cin: null, gstin: null, registeredOffice: null, incorporatedOn: null })
    expect(company.contact).toEqual({ email: null, phone: null })
  })

  it('keeps meta descriptions within search-result length', () => {
    for (const meta of Object.values(routeMeta)) {
      expect(meta.description.length, meta.path).toBeGreaterThanOrEqual(40)
      expect(meta.description.length, meta.path).toBeLessThanOrEqual(160)
    }
  })

  it('dates every insight with a real ISO date', () => {
    for (const article of insights) expect(article.publishedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

import type { GetCompetitorJsonReturn } from 'server/src/router/shared'
import type { GetCurrentCompetitorReturn } from 'server/src/router/currentCompetitor'
import { config } from './config'

export async function getCompetitors(): GetCompetitorJsonReturn {
  return fetch(config.simpleBackendUrl + '/simple/competitors.json').then(res => res.json()) as any
}

export async function getCurrentCompetitor(): GetCurrentCompetitorReturn {
  return fetch(config.simpleBackendUrl + '/simple/currentCompetitor.json').then(res => res.json()) as any
}

export async function getRunCount(): Promise<number> {
  return fetch(config.simpleBackendUrl + '/simple/runs.json').then(res => res.json()) as any
}

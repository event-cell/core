import type { CompetitorList } from 'server/src/router/objects'
import type { GetCurrentCompetitorReturn } from 'server/src/router/currentCompetitor'
import { config } from './config'

export async function getCompetitors(): Promise<CompetitorList> {
  const response = await fetch(config.simpleBackendUrl + '/simple/competitors.json')
  if (!response.ok) {
    throw new Error(`Failed to fetch competitors: ${response.statusText}`)
  }
  const data = await response.json()
  return data as CompetitorList
}

export async function getCurrentCompetitor(): Promise<number> {
  const response = await fetch(config.simpleBackendUrl + '/simple/currentCompetitor.json')
  if (!response.ok) {
    throw new Error(`Failed to fetch current competitor: ${response.statusText}`)
  }
  const data = await response.json()
  return data as number
}

export async function getRunCount(): Promise<number> {
  const response = await fetch(config.simpleBackendUrl + '/simple/runs.json')
  if (!response.ok) {
    throw new Error(`Failed to fetch run count: ${response.statusText}`)
  }
  const data = await response.json()
  return data as number
}

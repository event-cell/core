/**
 * Interface for event metadata
 */
export interface EventMetadata {
  eventId: string
  eventName: string
  lastUpdated: string
}

/**
 * Interface for the metadata map response
 */
interface MetadataMapResponse {
  metadataMap: Record<string, EventMetadata>
}

/**
 * Fetches metadata for a specific event
 * @param dateStr Date string in YYYY-MM-DD format
 * @returns Promise that resolves to the event metadata or null if not found
 */
export const fetchEventMetadata = async (
  dateStr: string,
): Promise<EventMetadata | null> => {
  try {
    // First try to fetch from the date-specific path
    const response = await fetch(`/${dateStr}/metadata.json`)
    if (response.ok) {
      const data = (await response.json()) as EventMetadata
      return data
    }

    // If that fails, try to fetch from the live-timing directory
    const liveTimingResponse = await fetch('/live-timing/site-metadata.json')
    if (!liveTimingResponse.ok) {
      return null
    }

    // Get the metadata map from the live-timing directory
    const liveTimingData =
      (await liveTimingResponse.json()) as MetadataMapResponse
    if (liveTimingData.metadataMap && liveTimingData.metadataMap[dateStr]) {
      return liveTimingData.metadataMap[dateStr]
    }

    return null
  } catch (error) {
    console.error(`Failed to fetch metadata for ${dateStr}:`, error)
    return null
  }
}

/**
 * Fetches metadata for multiple events
 * @param dates Array of date strings in YYYY-MM-DD format
 * @returns Promise that resolves to an object with dates as keys and metadata as values
 */
export const fetchEventsMetadata = async (
  dates: string[],
): Promise<Record<string, EventMetadata | null>> => {
  const metadataPromises = dates.map((date) => fetchEventMetadata(date))
  const metadataResults = await Promise.all(metadataPromises)

  const metadataMap: Record<string, EventMetadata | null> = {}
  dates.forEach((date, index) => {
    metadataMap[date] = metadataResults[index]
  })

  return metadataMap
}

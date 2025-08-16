import { DisplayDistributionConfig } from '../logic/displays.js'

export interface DisplayDistributionConfigResponse {
  maxRowsPerDisplay: number
}

/**
 * Service for managing display distribution configuration
 * Note: This service is primarily for components that don't have direct tRPC access.
 * Components with tRPC access should use the tRPC client directly.
 */
export class DisplayConfigService {
  private static instance: DisplayConfigService
  private config: DisplayDistributionConfig | null = null
  private lastFetch: number = 0
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  private constructor() { }

  public static getInstance(): DisplayConfigService {
    if (!DisplayConfigService.instance) {
      DisplayConfigService.instance = new DisplayConfigService()
    }
    return DisplayConfigService.instance
  }

  /**
   * Get the display distribution configuration from the server
   * This method uses fetch as a fallback for components without tRPC access
   */
  public async getDisplayDistributionConfig(): Promise<DisplayDistributionConfig> {
    // Check if we have cached config and it's still valid
    if (this.config && (Date.now() - this.lastFetch) < this.CACHE_DURATION) {
      return this.config
    }

    try {
      // Determine the base URL based on environment
      const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
      const baseUrl = isDevelopment
        ? `http://${typeof window !== 'undefined' ? window.location.hostname : 'timingserver.local'}:8080/api/v1`
        : '/api/v1'

      const response = await fetch(`${baseUrl}/config.getDisplayDistribution`)

      if (!response.ok) {
        throw new Error(`Failed to fetch display config: ${response.statusText}`)
      }

      const responseData = await response.json() as any

      // Extract the actual config data from the nested response
      const configData = responseData.result?.data || responseData

      // Convert to our internal format
      this.config = {
        maxRowsPerDisplay: configData.maxRowsPerDisplay,
      }

      this.lastFetch = Date.now()
      return this.config
    } catch (error) {
      console.warn('Failed to fetch display distribution config, using defaults:', error)

      // Return default configuration if server is unavailable
      return {
        maxRowsPerDisplay: 20,
      }
    }
  }

  /**
   * Update the display distribution configuration on the server
   * This method uses fetch as a fallback for components without tRPC access
   */
  public async setDisplayDistributionConfig(config: Partial<DisplayDistributionConfig>): Promise<DisplayDistributionConfig> {
    try {
      const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
      const baseUrl = isDevelopment
        ? `http://${typeof window !== 'undefined' ? window.location.hostname : 'timingserver.local'}:8080/api/v1`
        : '/api/v1'

      const response = await fetch(`${baseUrl}/config.setDisplayDistribution`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      })

      if (!response.ok) {
        throw new Error(`Failed to update display config: ${response.statusText}`)
      }

      const responseData = await response.json() as any

      // Extract the actual config data from the nested response
      const configData = responseData.result?.data || responseData

      // Update cached config
      this.config = {
        maxRowsPerDisplay: configData.maxRowsPerDisplay,
      }

      this.lastFetch = Date.now()
      return this.config
    } catch (error) {
      console.error('Failed to update display distribution config:', error)
      throw error
    }
  }

  /**
   * Clear the cached configuration
   */
  public clearCache(): void {
    this.config = null
    this.lastFetch = 0
  }
}

// Export a singleton instance
export const displayConfigService = DisplayConfigService.getInstance() 
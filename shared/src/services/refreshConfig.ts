export interface RefreshIntervalsConfig {
    display1: number
    display2: number
    display3: number
    display4: number
    trackDisplay: number
    announcer: number
    fallbackInterval: number
}

export const DEFAULT_REFRESH_CONFIG: RefreshIntervalsConfig = {
    display1: 15,
    display2: 15,
    display3: 15,
    display4: 5,
    trackDisplay: 2,
    announcer: 2,
    fallbackInterval: 300, // 5 minutes
}

export class RefreshConfigService {
    private static instance: RefreshConfigService
    private config: RefreshIntervalsConfig | null = null
    private lastFetch = 0
    private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

    public static getInstance(): RefreshConfigService {
        if (!RefreshConfigService.instance) {
            RefreshConfigService.instance = new RefreshConfigService()
        }
        return RefreshConfigService.instance
    }

    /**
     * Get the refresh intervals configuration from the server
     * Uses cached version if available and not expired
     * 
     * Fallback order:
     * 1. API call (most up-to-date configuration)
     * 2. Local JSON file (for live-timing website at /live-timing/api/simple/refreshConfig.json)
     * 3. Default configuration
     */
    public async getRefreshIntervalsConfig(): Promise<RefreshIntervalsConfig> {
        const now = Date.now()

        // Return cached config if still valid
        if (this.config && (now - this.lastFetch) < this.CACHE_DURATION) {
            return this.config
        }

        try {
            // Tier 1: Try API call first (most up-to-date)
            try {
                const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
                const baseUrl = isDevelopment
                    ? `http://${typeof window !== 'undefined' ? window.location.hostname : 'timingserver.local'}:8080/api/v1`
                    : '/api/v1'

                const response = await fetch(`${baseUrl}/config.getRefreshIntervals`)

                if (response.ok) {
                    const responseData = await response.json() as any

                    // Extract the actual config data from the nested response
                    const configData = responseData.result?.data || responseData

                    this.config = {
                        display1: configData.display1 || DEFAULT_REFRESH_CONFIG.display1,
                        display2: configData.display2 || DEFAULT_REFRESH_CONFIG.display2,
                        display3: configData.display3 || DEFAULT_REFRESH_CONFIG.display3,
                        display4: configData.display4 || DEFAULT_REFRESH_CONFIG.display4,
                        trackDisplay: configData.trackDisplay || DEFAULT_REFRESH_CONFIG.trackDisplay,
                        announcer: configData.announcer || DEFAULT_REFRESH_CONFIG.announcer,
                        fallbackInterval: configData.fallbackInterval || DEFAULT_REFRESH_CONFIG.fallbackInterval,
                    }

                    this.lastFetch = now
                    return this.config
                }
            } catch (apiError) {
                // Silently continue to local JSON fallback
                console.debug('API call failed, falling back to local JSON:', apiError)
            }

            // Tier 2: Fallback to local JSON file (for live-timing website)
            try {
                const localResponse = await fetch('/live-timing/api/simple/refreshConfig.json')
                if (localResponse.ok) {
                    const localConfig = await localResponse.json() as RefreshIntervalsConfig

                    // Validate the config has all required fields
                    if (this.isValidRefreshConfig(localConfig)) {
                        this.config = localConfig
                        this.lastFetch = now
                        return this.config
                    }
                }
            } catch (localError) {
                // Silently continue to default fallback
                console.debug('Local refresh config not available, falling back to defaults:', localError)
            }

            // Tier 3: Default configuration
            console.warn('Both API and local JSON failed, using default configuration')
            return DEFAULT_REFRESH_CONFIG

        } catch (error) {
            console.warn('Failed to load refresh intervals config, using defaults:', error)
            return DEFAULT_REFRESH_CONFIG
        }
    }

    /**
     * Validate that a refresh config object has all required fields
     */
    private isValidRefreshConfig(config: any): config is RefreshIntervalsConfig {
        return (
            typeof config === 'object' &&
            typeof config.display1 === 'number' &&
            typeof config.display2 === 'number' &&
            typeof config.display3 === 'number' &&
            typeof config.display4 === 'number' &&
            typeof config.trackDisplay === 'number' &&
            typeof config.announcer === 'number' &&
            typeof config.fallbackInterval === 'number'
        )
    }

    /**
     * Get refresh interval for a specific route
     */
    public async getRefreshIntervalForRoute(route: string): Promise<number> {
        const config = await this.getRefreshIntervalsConfig()

        switch (route) {
            case '/display/1':
                return config.display1
            case '/display/2':
                return config.display2
            case '/display/3':
                return config.display3
            case '/display/4':
                return config.display4
            case '/trackdisplay':
                return config.trackDisplay
            case '/announcer':
                return config.announcer
            default:
                return config.display1 // Default fallback
        }
    }

    /**
     * Get fallback interval
     */
    public async getFallbackInterval(): Promise<number> {
        const config = await this.getRefreshIntervalsConfig()
        return config.fallbackInterval
    }



    /**
     * Update the refresh intervals configuration on the server
     */
    public async setRefreshIntervalsConfig(config: Partial<RefreshIntervalsConfig>): Promise<RefreshIntervalsConfig> {
        try {
            const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
            const baseUrl = isDevelopment
                ? `http://${typeof window !== 'undefined' ? window.location.hostname : 'timingserver.local'}:8080/api/v1`
                : '/api/v1'

            const response = await fetch(`${baseUrl}/config.setRefreshIntervals`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(config),
            })

            if (!response.ok) {
                throw new Error(`Failed to update refresh config: ${response.statusText}`)
            }

            const responseData = await response.json() as any

            // Extract the actual config data from the nested response
            const configData = responseData.result?.data || responseData

            // Update cached config
            this.config = {
                display1: configData.display1,
                display2: configData.display2,
                display3: configData.display3,
                display4: configData.display4,
                trackDisplay: configData.trackDisplay,
                announcer: configData.announcer,
                fallbackInterval: configData.fallbackInterval,
            }

            this.lastFetch = Date.now()
            return this.config
        } catch (error) {
            console.error('Failed to update refresh intervals config:', error)
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

// Export singleton instance
export const refreshConfigService = RefreshConfigService.getInstance()

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
     */
    public async getRefreshIntervalsConfig(): Promise<RefreshIntervalsConfig> {
        const now = Date.now()

        // Return cached config if still valid
        if (this.config && (now - this.lastFetch) < this.CACHE_DURATION) {
            return this.config
        }

        try {
            const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
            const baseUrl = isDevelopment
                ? `http://${typeof window !== 'undefined' ? window.location.hostname : 'timingserver.local'}:8080/api/v1`
                : '/api/v1'

            const response = await fetch(`${baseUrl}/config.getRefreshIntervals`)

            if (!response.ok) {
                throw new Error(`Failed to fetch refresh config: ${response.statusText}`)
            }

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
        } catch (error) {
            console.warn('Failed to load refresh intervals config, using defaults:', error)
            return DEFAULT_REFRESH_CONFIG
        }
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

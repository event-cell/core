/**
 * Provides the configuration for the application.
 */
export class Config {
  /**
   * Will be true if the node environment is set to development
   */
  protected development =
    !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

  /**
   * The URL of the server
   *
   * The current behavior is to use `http://timingserver.local:8080/api/v1/` in
   * development and `/api/v1/` in production.
   */
  public backendUrl = this.development
    ? `http://${typeof window !== 'undefined' ? window.location.hostname : 'timingserver.local'}:8080/api/v1`
    : '/api/v1'

  public simpleBackendUrl = this.development
    ? `http://${typeof window !== 'undefined' ? window.location.hostname : 'timingserver.local'}:8080/api`
    : '../api'
}

export const config = new Config()

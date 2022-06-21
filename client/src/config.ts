/**
 * A class that can be used to load the configuration manually in the future.
 * Currently, it just contains hard coded constants
 *
 * @todo Find a way of loading this from the server
 */
export class Config {
  /**
   * The URL of the server
   */
  public backendUrl: string = 'http://localhost:8080/api/v1/'
}

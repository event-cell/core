/**
 * Returns the deployment path prefix the app is served under, or '' when it is
 * served from the root of a host.
 *
 * The live-timing deploys place the client bundle under a dated or named path
 * (e.g. `/2025-08-28/display/`, `/live-timing/display/`), so the first path
 * segment containing a `-` is treated as the router prefix. This matches the
 * convention used by `getDisplayNumber()` in `shared/src/logic/displays.ts`.
 */
export function getRouterPrefix() {
  const firstPath = window.location.pathname.split('/')[1]
  if (firstPath.includes('-')) return firstPath
  return ''
}

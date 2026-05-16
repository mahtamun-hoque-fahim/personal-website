import { defineCloudflareConfig } from '@opennextjs/cloudflare'

// Default config — uses in-Worker memory for incremental cache.
// To enable persistent ISR caching across Worker instances, add an R2
// or KV binding to wrangler.jsonc and swap incrementalCache below:
//
//   import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache'
//   export default defineCloudflareConfig({ incrementalCache: r2IncrementalCache })
//
// See https://opennext.js.org/cloudflare/caching for details.
export default defineCloudflareConfig({})

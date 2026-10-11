// Matches next.config.ts experimental.serverActions.bodySizeLimit ('4mb').
// Kept under Vercel's ~4.5MB serverless function request-body ceiling,
// which serverActions.bodySizeLimit cannot raise past.
export const MAX_AVATAR_BYTES = 4 * 1024 * 1024

// Marquee strips (homepage skills, /projects technologies): one shared speed,
// in pixels per second, set from Admin > Settings.
export const MARQUEE_SPEED_MIN = 10
export const MARQUEE_SPEED_MAX = 200
export const MARQUEE_SPEED_DEFAULT = 60

// Matches next.config.ts experimental.serverActions.bodySizeLimit ('4mb').
// Kept under Vercel's ~4.5MB serverless function request-body ceiling,
// which serverActions.bodySizeLimit cannot raise past.
export const MAX_AVATAR_BYTES = 4 * 1024 * 1024

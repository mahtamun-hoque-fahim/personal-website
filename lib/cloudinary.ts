import { MAX_AVATAR_BYTES } from './constants'

/**
 * Minimal signed Cloudinary upload, implemented with plain fetch + Web
 * Crypto instead of the `cloudinary` Node SDK. This repo dual-deploys to
 * Vercel and Cloudflare Workers (via OpenNext) — Web Crypto's
 * crypto.subtle works identically in both runtimes, so this avoids any
 * Node-SDK/edge-compatibility risk.
 *
 * Requires CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.
 */

async function sha1Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest('SHA-1', bytes)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function uploadAvatarToCloudinary(file: File): Promise<string> {
  // .trim() guards against a common, invisible failure mode: pasting a
  // secret into Vercel's env var field with a trailing newline/space
  // silently corrupts the signature hash and produces a bare 401 with
  // no useful error message from Cloudinary.
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim()
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim()
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim()

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      'Cloudinary is not configured — set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.'
    )
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image.')
  }
  if (file.size > MAX_AVATAR_BYTES) {
    throw new Error('Image must be under 4MB.')
  }

  const timestamp = Math.floor(Date.now() / 1000)
  // Fixed public_id + folder: re-uploads overwrite the same asset instead
  // of accumulating orphaned images on every avatar change.
  const publicId = 'avatar'
  const folder = 'personal-website'

  // Cloudinary signs everything except file/api_key/cloud_name/resource_type:
  // sorted param=value pairs, joined with &, api_secret appended, SHA-1'd.
  const paramsToSign = `folder=${folder}&overwrite=true&public_id=${publicId}&timestamp=${timestamp}`
  const signature = await sha1Hex(`${paramsToSign}${apiSecret}`)

  const formData = new FormData()
  formData.set('file', file)
  formData.set('api_key', apiKey)
  formData.set('timestamp', String(timestamp))
  formData.set('signature', signature)
  formData.set('public_id', publicId)
  formData.set('folder', folder)
  formData.set('overwrite', 'true')

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const body = await res.text()
    let message = body
    try {
      const parsed = JSON.parse(body) as { error?: { message?: string } }
      if (parsed.error?.message) message = parsed.error.message
    } catch {
      // body wasn't JSON — fall through and use the raw text
    }
    throw new Error(`Cloudinary upload failed (${res.status}): ${message || '(empty response body)'}`)
  }

  const data = (await res.json()) as { secure_url?: string }
  if (!data.secure_url) {
    throw new Error('Cloudinary upload succeeded but returned no secure_url.')
  }

  // Cache-bust: same public_id every time means the URL never changes,
  // so <img src> would keep showing a stale cached copy after re-upload.
  return `${data.secure_url}?v=${timestamp}`
}

/**
 * Skill thumbnail upload. Same signed-upload approach as the avatar, but
 * public_id is per-skill (`skill-<id>`) instead of a single fixed slot —
 * multiple skills each keep their own thumbnail, and re-uploading a given
 * skill's image overwrites only that skill's asset rather than orphaning it.
 * PNG transparency is preserved: Cloudinary keeps the source format unless
 * told to convert, and nothing here asks it to.
 */
export async function uploadSkillImageToCloudinary(file: File, skillId: string): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim()
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim()
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim()

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      'Cloudinary is not configured — set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.'
    )
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image.')
  }
  if (file.size > MAX_AVATAR_BYTES) {
    throw new Error('Image must be under 4MB.')
  }

  const timestamp = Math.floor(Date.now() / 1000)
  const publicId = `skill-${skillId}`
  const folder = 'personal-website/skills'

  const paramsToSign = `folder=${folder}&overwrite=true&public_id=${publicId}&timestamp=${timestamp}`
  const signature = await sha1Hex(`${paramsToSign}${apiSecret}`)

  const formData = new FormData()
  formData.set('file', file)
  formData.set('api_key', apiKey)
  formData.set('timestamp', String(timestamp))
  formData.set('signature', signature)
  formData.set('public_id', publicId)
  formData.set('folder', folder)
  formData.set('overwrite', 'true')

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const body = await res.text()
    let message = body
    try {
      const parsed = JSON.parse(body) as { error?: { message?: string } }
      if (parsed.error?.message) message = parsed.error.message
    } catch {
      // body wasn't JSON — fall through and use the raw text
    }
    throw new Error(`Cloudinary upload failed (${res.status}): ${message || '(empty response body)'}`)
  }

  const data = (await res.json()) as { secure_url?: string }
  if (!data.secure_url) {
    throw new Error('Cloudinary upload succeeded but returned no secure_url.')
  }

  return `${data.secure_url}?v=${timestamp}`
}

/**
 * About-page images (Admin > About): two fixed slots, `extra` (beside the new
 * text block above the story) and `story` (beside the story). Same signed
 * upload as the avatar/skills; a fixed public_id per slot so re-uploading a
 * slot overwrites it instead of orphaning images. PNG transparency is kept.
 */
export type AboutImageSlot = 'extra' | 'story'

export async function uploadAboutImageToCloudinary(
  file: File,
  slot: AboutImageSlot
): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim()
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim()
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim()

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      'Cloudinary is not configured — set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.'
    )
  }
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image.')
  }
  if (file.size > MAX_AVATAR_BYTES) {
    throw new Error('Image must be under 4MB.')
  }

  const timestamp = Math.floor(Date.now() / 1000)
  const publicId = `about-${slot}`
  const folder = 'personal-website/about'

  const paramsToSign = `folder=${folder}&overwrite=true&public_id=${publicId}&timestamp=${timestamp}`
  const signature = await sha1Hex(`${paramsToSign}${apiSecret}`)

  const formData = new FormData()
  formData.set('file', file)
  formData.set('api_key', apiKey)
  formData.set('timestamp', String(timestamp))
  formData.set('signature', signature)
  formData.set('public_id', publicId)
  formData.set('folder', folder)
  formData.set('overwrite', 'true')

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const body = await res.text()
    let message = body
    try {
      const parsed = JSON.parse(body) as { error?: { message?: string } }
      if (parsed.error?.message) message = parsed.error.message
    } catch {
      // body wasn't JSON — fall through and use the raw text
    }
    throw new Error(`Cloudinary upload failed (${res.status}): ${message || '(empty response body)'}`)
  }

  const data = (await res.json()) as { secure_url?: string }
  if (!data.secure_url) {
    throw new Error('Cloudinary upload succeeded but returned no secure_url.')
  }

  // Same public_id every time: cache-bust so a re-upload shows immediately.
  return `${data.secure_url}?v=${timestamp}`
}

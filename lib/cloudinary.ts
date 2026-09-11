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

const MAX_AVATAR_BYTES = 5 * 1024 * 1024 // 5MB

export async function uploadAvatarToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      'Cloudinary is not configured — set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.'
    )
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image.')
  }
  if (file.size > MAX_AVATAR_BYTES) {
    throw new Error('Image must be under 5MB.')
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
    throw new Error(`Cloudinary upload failed (${res.status}): ${body}`)
  }

  const data = (await res.json()) as { secure_url?: string }
  if (!data.secure_url) {
    throw new Error('Cloudinary upload succeeded but returned no secure_url.')
  }

  // Cache-bust: same public_id every time means the URL never changes,
  // so <img src> would keep showing a stale cached copy after re-upload.
  return `${data.secure_url}?v=${timestamp}`
}

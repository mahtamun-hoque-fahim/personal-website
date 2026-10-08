/**
 * Homepage hero portrait: transparent cutout that "emerges" from the dark.
 *
 * - Sits behind the headline (-z-10) at the right edge of the hero container
 *   (the parent must be `relative`), top-aligned with the first line.
 * - A mint radial glow behind the head gives the near-black jacket an edge
 *   to read against; a bottom mask dissolves the torso into the page so it
 *   never fights the buttons and stats below.
 * - Plain <img>, pre-cropped and compressed to WebP with alpha (about 25 KB):
 *   the site does not use next/image (it deploys to Vercel and Cloudflare),
 *   and fetchPriority="high" keeps it from loading late.
 * - Hidden below `sm`: on phones the headline needs the full width.
 * - Enters with the same blur-load as the rest of the hero, so it is also
 *   held by the route "arrival gate" in app/template.tsx.
 */
export default function HeroPortrait() {
  return (
    <div
      className="blur-load pointer-events-none absolute right-0 top-0 -z-10 hidden sm:block"
      style={
        {
          '--reveal-delay': '220ms',
          '--reveal-duration': '1200ms',
          '--blur-from': '4px',
        } as React.CSSProperties
      }
    >
      <div
        aria-hidden="true"
        className="absolute -inset-[25%] bg-[radial-gradient(closest-side,rgba(61,244,154,0.16),transparent_72%)]"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/fahim-hero.webp"
        width={571}
        height={629}
        alt="Portrait of Mahtamun Hoque Fahim"
        fetchPriority="high"
        decoding="async"
        draggable={false}
        className="relative h-[clamp(300px,40vw,560px)] w-auto select-none [mask-image:linear-gradient(to_bottom,#000_45%,transparent_92%)]"
      />
    </div>
  )
}

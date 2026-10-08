/**
 * Homepage hero portrait: transparent cutout standing on the stats rule.
 *
 * - The parent must be `relative` and contain the headline + intro row. The
 *   figure is anchored to that parent's bottom edge, then pushed down 4rem
 *   (`bottom-[-4rem]`) to land exactly on the stats rule underneath. That
 *   4rem is the `mt-16` between the intro row and the rule in app/page.tsx;
 *   change one, change the other.
 * - Full figure at natural proportions, no zoom, no mask. The photo is cut
 *   off at the waist, and the cut sits on the rule, so it reads as standing
 *   on the line. The page's existing MintGlow is the only glow behind it.
 * - Behind the headline (-z-10), hidden below `sm`: on phones the headline
 *   needs the full width.
 * - Plain <img>, pre-cropped and compressed to WebP with alpha (about 32 KB):
 *   the site does not use next/image (it deploys to Vercel and Cloudflare),
 *   and fetchPriority="high" keeps it from loading late.
 * - Enters with the same blur-load as the rest of the hero, so it is also
 *   held by the route "arrival gate" in app/template.tsx.
 */
export default function HeroPortrait() {
  return (
    <div
      className="blur-load pointer-events-none absolute right-0 bottom-[-4rem] -z-10 hidden sm:block"
      style={
        {
          '--reveal-delay': '220ms',
          '--reveal-duration': '1200ms',
          '--blur-from': '4px',
        } as React.CSSProperties
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/fahim-hero.webp"
        width={571}
        height={907}
        alt="Portrait of Mahtamun Hoque Fahim"
        fetchPriority="high"
        decoding="async"
        draggable={false}
        className="block h-[clamp(320px,38vw,540px)] w-auto select-none"
      />
    </div>
  )
}

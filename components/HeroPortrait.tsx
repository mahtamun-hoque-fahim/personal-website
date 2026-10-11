/**
 * Homepage hero portrait: transparent cutout standing on the marquee strip.
 *
 * - The parent must be `relative` and contain the headline + intro row.
 * - Vertical: the top sits just above the wrapper's top edge (`top` =
 *   -0.04 x the h1 font size, so it follows the headline's
 *   `clamp(3.5rem, 10vw, 9rem)`), which puts the top of the head level with
 *   the top of the "Build" ascenders. The bottom is pushed down 4rem
 *   (`bottom-[-4rem]`) to land exactly on the top border of the marquee strip
 *   underneath. That 4rem is the `pb-16` on the hero container in app/page.tsx;
 *   the clamp must match the h1 there too. Height therefore comes from the
 *   layout, and `aspect-[571/907]` derives the width, so the figure keeps
 *   its proportions at every width.
 * - Horizontal: `right-[10.5%]` of the container puts the figure in the free
 *   column to the right of the headline, not hard against the edge.
 * - Full figure, natural proportions, no zoom, no mask, no extra glow (the
 *   page's MintGlow is the only light). The photo is cut at the waist; the
 *   cut sits on the strip's top border, so it reads as standing on the line.
 * - Behind the headline (-z-10), hidden below `sm`.
 * - Plain <img>, pre-cropped WebP with alpha (about 32 KB): the site does
 *   not use next/image (Vercel + Cloudflare), and fetchPriority="high"
 *   keeps it from loading late.
 * - Enters with blur-load, so the route "arrival gate" in app/template.tsx
 *   holds it too.
 * - `data-glow-anchor` marks this box for components/MintGlow.tsx: the
 *   roaming background glow starts centred behind it (and glides back to it
 *   when you navigate to the homepage).
 */
export default function HeroPortrait() {
  return (
    <div
      data-glow-anchor
      className="blur-load pointer-events-none absolute right-[10.5%] top-[calc(clamp(3.5rem,10vw,9rem)*-0.04)] bottom-[-4rem] -z-10 hidden aspect-[571/907] sm:block"
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
        className="block h-full w-full select-none object-contain object-bottom"
      />
    </div>
  )
}

import { cn } from '@/lib/utils'

type TechMarqueeProps = {
  items: string[]
  className?: string
}

/**
 * Looping ticker of names, same look as the homepage skills ticker.
 *
 * The list is rendered twice and the track slides by exactly half its width
 * (`animate-marquee`, 0% to -50%), so the loop is seamless. The second copy
 * is aria-hidden so screen readers hear each name once. The duration scales
 * with the item count so the scroll speed stays about the same whether there
 * are 12 items or 26. Pauses on hover; reduced motion is handled globally.
 */
export default function TechMarquee({ items, className }: TechMarqueeProps) {
  if (items.length === 0) return null

  const track = [...items, ...items]

  return (
    <div
      className={cn(
        'overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]',
        className
      )}
    >
      <div
        className="flex gap-12 animate-marquee whitespace-nowrap w-max hover:[animation-play-state:paused]"
        style={{ animationDuration: `${items.length * 2.5}s` }}
      >
        {track.map((name, i) => (
          <span
            key={i}
            aria-hidden={i >= items.length ? true : undefined}
            className="text-sm tracking-widest uppercase shrink-0"
            style={{
              fontFamily: 'var(--font-jakarta)',
              color: i % 3 === 0 ? '#3DF49A' : '#8A938E',
            }}
          >
            {name}
            <span className="ml-12 text-[#333333]" aria-hidden="true">
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

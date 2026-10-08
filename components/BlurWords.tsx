import type { CSSProperties, ElementType } from 'react'
import { cn } from '@/lib/utils'
import Reveal from '@/components/Reveal'

type BlurWordsProps = {
  text: string
  as?: ElementType
  className?: string
  style?: CSSProperties
  /**
   * 'scroll': plays once when the text enters the viewport.
   * 'load': plays immediately, in pure CSS, for above-the-fold text
   * (no wait for hydration, so it never holds back first paint).
   */
  mode?: 'scroll' | 'load'
  /** Extra wait before the first word, in ms. */
  delay?: number
  /** Gap between consecutive words, in ms (the "reveal speed" knob). */
  stagger?: number
  /** Time each word takes to resolve, in ms (the "segment speed" knob). */
  duration?: number
}

/**
 * Per-word blur-in. Words are inline-block spans separated by real
 * spaces, so wrapping and copy/paste behave like normal text and screen
 * readers read it as ordinary words. Keep it for short text such as
 * headings; paragraphs should use <Reveal> as one block instead.
 */
export default function BlurWords({
  text,
  as: Tag = 'span',
  className,
  style: extraStyle,
  mode = 'scroll',
  delay = 0,
  stagger = 45,
  duration = 550,
}: BlurWordsProps) {
  const words = text.split(/\s+/).filter(Boolean)

  const style = {
    ...extraStyle,
    '--delay': `${delay}ms`,
    '--stagger': `${stagger}ms`,
    '--word-duration': `${duration}ms`,
  } as CSSProperties

  const content = words.map((word, i) => (
    <span key={`${word}-${i}`}>
      {i > 0 ? ' ' : null}
      <span className="blur-word" style={{ '--i': i } as CSSProperties}>
        {word}
      </span>
    </span>
  ))

  if (mode === 'load') {
    return (
      <Tag className={cn('blur-words blur-words-load', className)} style={style}>
        {content}
      </Tag>
    )
  }

  return (
    <Reveal
      as={Tag}
      blurSelf={false}
      className={cn('blur-words', className)}
      style={style}
    >
      {content}
    </Reveal>
  )
}

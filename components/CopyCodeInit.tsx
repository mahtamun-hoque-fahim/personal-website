'use client'

import { useEffect } from 'react'

// Wires up copy buttons injected by renderMarkdown into .hl-pre blocks.
// Drop this component anywhere dangerouslySetInnerHTML renders markdown.
export default function CopyCodeInit() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest('.hl-copy-btn') as HTMLButtonElement | null
      if (!btn) return

      const pre = btn.closest('.hl-pre')
      const code = pre?.querySelector('.hl-code')
      if (!code) return

      navigator.clipboard.writeText(code.textContent ?? '').then(() => {
        btn.textContent = 'Copied!'
        btn.classList.add('hl-copy-btn--copied')
        setTimeout(() => {
          btn.textContent = 'Copy'
          btn.classList.remove('hl-copy-btn--copied')
        }, 2000)
      })
    }

    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  return null
}

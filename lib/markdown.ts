// Simple markdown-to-HTML renderer — no npm deps, works on Edge runtime
// Handles: headings, bold, italic, code, blockquote, lists, links, images, hr

export function renderMarkdown(md: string): string {
  let html = md

  // Escape HTML special chars first (prevent XSS in user content)
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Fenced code blocks ```lang\n...\n```
  html = html.replace(/```[\w]*\n([\s\S]*?)```/g, (_, code) => {
    return `<pre><code>${code.trim()}</code></pre>`
  })

  // Inline code `...`
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

  // Images ![alt](url)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')

  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

  // Headings
  html = html.replace(/^###### (.+)$/gm, '<h6>$1</h6>')
  html = html.replace(/^##### (.+)$/gm, '<h5>$1</h5>')
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>')
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')

  // Blockquote
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>')

  // HR
  html = html.replace(/^---$/gm, '<hr />')

  // Bold + italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // Unordered lists — group consecutive - lines
  html = html.replace(/(^- .+(\n|$))+/gm, (block) => {
    const items = block
      .trim()
      .split('\n')
      .map((line) => `<li>${line.replace(/^- /, '')}</li>`)
      .join('')
    return `<ul>${items}</ul>\n`
  })

  // Ordered lists — group consecutive 1. lines
  html = html.replace(/(^\d+\. .+(\n|$))+/gm, (block) => {
    const items = block
      .trim()
      .split('\n')
      .map((line) => `<li>${line.replace(/^\d+\. /, '')}</li>`)
      .join('')
    return `<ol>${items}</ol>\n`
  })

  // Paragraphs — wrap lines that aren't already wrapped in a block tag
  const blockTags = /^<(h[1-6]|ul|ol|li|pre|blockquote|hr|img)/
  html = html
    .split('\n\n')
    .map((block) => {
      const trimmed = block.trim()
      if (!trimmed) return ''
      if (blockTags.test(trimmed)) return trimmed
      return `<p>${trimmed.replace(/\n/g, ' ')}</p>`
    })
    .join('\n')

  return html
}

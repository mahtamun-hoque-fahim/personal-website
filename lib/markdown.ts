// Simple markdown-to-HTML renderer — no npm deps, works on Edge runtime
// Handles: headings, bold, italic, code, blockquote, lists, links, images, hr, tables

// ── Syntax highlighter ──────────────────────────────────────────────────────

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function highlightCode(code: string, lang: string): string {
  const escaped = escapeHtml(code)

  const JS_KEYWORDS = /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|this|typeof|instanceof|import|export|default|from|class|extends|async|await|try|catch|finally|throw|in|of|true|false|null|undefined|void|delete|yield|static|get|set|super|type|interface|enum|as|declare|namespace|module|require)\b/g
  const PY_KEYWORDS  = /\b(def|class|return|if|elif|else|for|while|in|not|and|or|import|from|as|with|try|except|finally|raise|pass|break|continue|lambda|yield|global|nonlocal|del|assert|True|False|None|print|len|range|self|super)\b/g
  const CSS_KEYWORDS = /\b(px|em|rem|vh|vw|%|auto|none|flex|grid|block|inline|absolute|relative|fixed|sticky|center|left|right|top|bottom|bold|normal|hidden|visible|solid|dashed|dotted|transparent|inherit|initial|unset)\b/g

  const STRING  = /(["'`])((?:\\.|(?!\1)[^\\])*)\1/g
  const COMMENT_LINE = /(\/\/[^\n]*|#[^\n]*)/g
  const COMMENT_BLOCK = /(\/\*[\s\S]*?\*\/)/g
  const NUMBER  = /\b(\d+\.?\d*)\b/g
  const FUNC    = /\b([a-zA-Z_$][\w$]*)\s*(?=\()/g
  const CSS_PROP = /^(\s*)([\w-]+)(\s*:)/gm
  const CSS_SEL  = /^([.#]?[\w-]+(?:\s*[,>+~]\s*[\w.#-]+)*)\s*\{/gm
  const HTML_TAG = /(&lt;\/?)([\w-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*))?)*\s*\/?)(&gt;)/g

  if (lang === 'html' || lang === 'xml' || lang === 'jsx' || lang === 'tsx') {
    return escaped
      .replace(HTML_TAG, (_, open, tag, attrs, close) =>
        `<span class="hl-tag">${open}<span class="hl-tag-name">${tag}</span>${attrs
          .replace(/([\w:-]+)(\s*=\s*)(["'][^"']*["'])/g,
            (_: string, attr: string, eq: string, val: string) =>
              `<span class="hl-attr">${attr}</span>${eq}<span class="hl-string">${val}</span>`)
        }${close}</span>`)
      .replace(COMMENT_BLOCK, '<span class="hl-comment">$1</span>')
  }

  if (lang === 'css' || lang === 'scss') {
    return escaped
      .replace(COMMENT_BLOCK, '<span class="hl-comment">$1</span>')
      .replace(CSS_SEL, (m, sel) => `<span class="hl-selector">${m}</span>`)
      .replace(CSS_PROP, (_, ws, prop, colon) => `${ws}<span class="hl-property">${prop}</span>${colon}`)
      .replace(STRING, '<span class="hl-string">$1$2$1</span>')
      .replace(NUMBER, '<span class="hl-number">$1</span>')
      .replace(CSS_KEYWORDS, '<span class="hl-keyword">$&</span>')
  }

  if (lang === 'python' || lang === 'py') {
    return escaped
      .replace(COMMENT_LINE, '<span class="hl-comment">$1</span>')
      .replace(STRING, '<span class="hl-string">$1$2$1</span>')
      .replace(PY_KEYWORDS, '<span class="hl-keyword">$&</span>')
      .replace(FUNC, '<span class="hl-function">$1</span>')
      .replace(NUMBER, '<span class="hl-number">$1</span>')
  }

  if (lang === 'bash' || lang === 'sh' || lang === 'shell' || lang === 'zsh') {
    return escaped
      .replace(COMMENT_LINE, '<span class="hl-comment">$1</span>')
      .replace(STRING, '<span class="hl-string">$1$2$1</span>')
      .replace(/\b(echo|cd|ls|mkdir|rm|mv|cp|git|npm|npx|pnpm|yarn|node|curl|wget|chmod|sudo|export|source|cat|grep|find|sed|awk|touch)\b/g,
        '<span class="hl-keyword">$&</span>')
      .replace(/(\$[\w{][^}\s]*)/g, '<span class="hl-variable">$1</span>')
  }

  // JS / TS / default
  return escaped
    .replace(COMMENT_BLOCK, '<span class="hl-comment">$1</span>')
    .replace(COMMENT_LINE, '<span class="hl-comment">$1</span>')
    .replace(STRING, '<span class="hl-string">$1$2$1</span>')
    .replace(JS_KEYWORDS, '<span class="hl-keyword">$&</span>')
    .replace(FUNC, '<span class="hl-function">$1</span>')
    .replace(NUMBER, '<span class="hl-number">$1</span>')
}

// ── Main renderer ────────────────────────────────────────────────────────────

export function renderMarkdown(md: string): string {
  // ── Step 1: stash fenced code blocks as placeholders ──────────────────────
  // This prevents ANY formatting from running inside code blocks.
  const codeBlocks: string[] = []

  let html = md.replace(/```([\w]*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    const language = lang.trim().toLowerCase() || 'text'
    const highlighted = language === 'text'
      ? escapeHtml(code.trim())
      : highlightCode(code.trim(), language)

    const label = language !== 'text'
      ? `<span class="hl-lang-label">${language}</span>`
      : ''

    const block = `<pre class="hl-pre" data-lang="${language}">${label}<button class="hl-copy-btn" aria-label="Copy code">Copy</button><code class="hl-code">${highlighted}</code></pre>`
    codeBlocks.push(block)
    return `\x00CODE${codeBlocks.length - 1}\x00`
  })

  // ── Step 2: stash inline code ─────────────────────────────────────────────
  const inlineCodes: string[] = []
  html = html.replace(/`([^`\n]+)`/g, (_, code) => {
    const block = `<code class="hl-inline">${escapeHtml(code)}</code>`
    inlineCodes.push(block)
    return `\x00INLINE${inlineCodes.length - 1}\x00`
  })

  // ── Step 3: escape remaining HTML ─────────────────────────────────────────
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // ── Step 4: formatting (runs on text only — code blocks are placeholders) ─

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

  // Tables — GFM pipe tables
  html = html.replace(/(^\|.+\|\s*\n)+/gm, (block) => {
    const rows = block.trim().split('\n')
    if (rows.length < 2) return block

    const isSeparator = (row: string) => /^\|\s*[-:]+[-| :]*\|\s*$/.test(row)
    if (!isSeparator(rows[1])) return block

    const parseRow = (row: string) =>
      row.replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim())

    const headers = parseRow(rows[0])
    const dataRows = rows.slice(2)

    const thead = `<thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>`
    const tbody = `<tbody>${dataRows
      .map((row) => `<tr>${parseRow(row).map((cell) => `<td>${cell}</td>`).join('')}</tr>`)
      .join('')}</tbody>`

    return `<table>${thead}${tbody}</table>\n`
  })

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
  const blockTags = /^(<(h[1-6]|ul|ol|li|pre|blockquote|hr|img|table)|\x00CODE)/
  html = html
    .split('\n\n')
    .map((block) => {
      const trimmed = block.trim()
      if (!trimmed) return ''
      if (blockTags.test(trimmed)) return trimmed
      return `<p>${trimmed.replace(/\n/g, ' ')}</p>`
    })
    .join('\n')

  // ── Step 5: restore code blocks ───────────────────────────────────────────
  html = html.replace(/\x00CODE(\d+)\x00/g, (_, i) => codeBlocks[+i])
  html = html.replace(/\x00INLINE(\d+)\x00/g, (_, i) => inlineCodes[+i])

  return html
}

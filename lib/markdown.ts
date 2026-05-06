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

  // ── Placeholder-based highlighter ─────────────────────────────────────────
  // Stash strings + comments FIRST so keyword/number/function regexes never
  // match text that lives inside a string literal or comment.
  const tokens: string[] = []
  const stash = (span: string): string => {
    tokens.push(span)
    return `\x01T${tokens.length - 1}\x01`
  }
  const restore = (s: string) =>
    s.replace(/\x01T(\d+)\x01/g, (_, i) => tokens[+i])

  const JS_KEYWORDS = /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|this|typeof|instanceof|import|export|default|from|class|extends|async|await|try|catch|finally|throw|in|of|true|false|null|undefined|void|delete|yield|static|get|set|super|type|interface|enum|as|declare|namespace|module|require)\b/g
  const PY_KEYWORDS = /\b(def|class|return|if|elif|else|for|while|in|not|and|or|import|from|as|with|try|except|finally|raise|pass|break|continue|lambda|yield|global|nonlocal|del|assert|True|False|None|print|len|range|self|super)\b/g
  const BASH_CMDS   = /\b(echo|cd|ls|mkdir|rm|mv|cp|git|npm|npx|pnpm|yarn|node|curl|wget|chmod|sudo|export|source|cat|grep|find|sed|awk|touch)\b/g

  const STRING_DQ  = /"(?:\\.|[^"\\])*"/g
  const STRING_SQ  = /'(?:\\.|[^'\\])*'/g
  const STRING_BT  = /`(?:\\.|[^`\\])*`/g
  const COMMENT_BL = /\/\*[\s\S]*?\*\//g
  const COMMENT_LN = /\/\/[^\n]*/g
  const HASH_CMT   = /#[^\n]*/g
  const NUMBER     = /\b\d+\.?\d*\b/g
  const FUNC       = /\b([a-zA-Z_$][\w$]*)\s*(?=\()/g
  const HTML_TAG   = /(&lt;\/?)([\w-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:&quot;[^&]*&quot;|'[^']*'|[^\s&>]*))?)*\s*\/?)(&gt;)/g

  // ── HTML / XML ─────────────────────────────────────────────────────────────
  if (lang === 'html' || lang === 'xml' || lang === 'jsx' || lang === 'tsx') {
    return escaped
      .replace(COMMENT_BL, (m) => stash(`<span class="hl-comment">${m}</span>`))
      .replace(HTML_TAG, (_, open, tag, attrs, close) =>
        `<span class="hl-tag">${open}<span class="hl-tag-name">${tag}</span>${attrs
          .replace(/([\w:-]+)(\s*=\s*)(&quot;[^&]*&quot;|'[^']*')/g,
            (_: string, attr: string, eq: string, val: string) =>
              `<span class="hl-attr">${attr}</span>${eq}<span class="hl-string">${val}</span>`)
        }${close}</span>`)
      .replace(/\x01T(\d+)\x01/g, (_, i) => tokens[+i])
  }

  // ── CSS / SCSS ─────────────────────────────────────────────────────────────
  if (lang === 'css' || lang === 'scss') {
    let s = escaped
    s = s.replace(COMMENT_BL, (m) => stash(`<span class="hl-comment">${m}</span>`))
    s = s.replace(STRING_DQ, (m) => stash(`<span class="hl-string">${m}</span>`))
    s = s.replace(STRING_SQ, (m) => stash(`<span class="hl-string">${m}</span>`))
    s = s.replace(/^([.#:]?[\w-]+(?:\s*[,>+~]\s*[\w.#:-]+)*)\s*\{/gm,
      (m) => stash(`<span class="hl-selector">${m}</span>`))
    s = s.replace(/^(\s*)([\w-]+)(\s*:)/gm,
      (_, ws, prop, colon) => `${ws}${stash(`<span class="hl-property">${prop}</span>`)}${colon}`)
    s = s.replace(NUMBER, (m) => stash(`<span class="hl-number">${m}</span>`))
    return restore(s)
  }

  // ── Python ─────────────────────────────────────────────────────────────────
  if (lang === 'python' || lang === 'py') {
    let s = escaped
    s = s.replace(HASH_CMT,  (m) => stash(`<span class="hl-comment">${m}</span>`))
    s = s.replace(STRING_DQ, (m) => stash(`<span class="hl-string">${m}</span>`))
    s = s.replace(STRING_SQ, (m) => stash(`<span class="hl-string">${m}</span>`))
    s = s.replace(PY_KEYWORDS, (m) => stash(`<span class="hl-keyword">${m}</span>`))
    s = s.replace(FUNC, (_, fn) => stash(`<span class="hl-function">${fn}</span>`) + '(')
    s = s.replace(NUMBER, (m) => stash(`<span class="hl-number">${m}</span>`))
    return restore(s)
  }

  // ── Bash / Shell ───────────────────────────────────────────────────────────
  if (lang === 'bash' || lang === 'sh' || lang === 'shell' || lang === 'zsh') {
    let s = escaped
    s = s.replace(HASH_CMT,  (m) => stash(`<span class="hl-comment">${m}</span>`))
    s = s.replace(STRING_DQ, (m) => stash(`<span class="hl-string">${m}</span>`))
    s = s.replace(STRING_SQ, (m) => stash(`<span class="hl-string">${m}</span>`))
    s = s.replace(BASH_CMDS, (m) => stash(`<span class="hl-keyword">${m}</span>`))
    s = s.replace(/\$[\w{][^}\s]*/g, (m) => stash(`<span class="hl-variable">${m}</span>`))
    return restore(s)
  }

  // ── JSON ───────────────────────────────────────────────────────────────────
  if (lang === 'json') {
    let s = escaped
    // Keys: "key":
    s = s.replace(/"([^"\\]|\\.)*"(?=\s*:)/g,
      (m) => stash(`<span class="hl-property">${m}</span>`))
    // String values
    s = s.replace(STRING_DQ, (m) => stash(`<span class="hl-string">${m}</span>`))
    s = s.replace(/\b(true|false|null)\b/g, (m) => stash(`<span class="hl-keyword">${m}</span>`))
    s = s.replace(NUMBER, (m) => stash(`<span class="hl-number">${m}</span>`))
    return restore(s)
  }

  // ── JS / TS (default) ─────────────────────────────────────────────────────
  let s = escaped
  s = s.replace(COMMENT_BL, (m) => stash(`<span class="hl-comment">${m}</span>`))
  s = s.replace(COMMENT_LN, (m) => stash(`<span class="hl-comment">${m}</span>`))
  s = s.replace(STRING_DQ,  (m) => stash(`<span class="hl-string">${m}</span>`))
  s = s.replace(STRING_SQ,  (m) => stash(`<span class="hl-string">${m}</span>`))
  s = s.replace(STRING_BT,  (m) => stash(`<span class="hl-string">${m}</span>`))
  // Now run keyword / func / number — strings are safely stashed
  s = s.replace(JS_KEYWORDS, (m) => stash(`<span class="hl-keyword">${m}</span>`))
  s = s.replace(FUNC, (_, fn) => stash(`<span class="hl-function">${fn}</span>`) + '(')
  s = s.replace(NUMBER, (m) => stash(`<span class="hl-number">${m}</span>`))
  return restore(s)
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

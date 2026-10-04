#!/usr/bin/env node
// copy-extract — pull the visible copy of one page and run the messaging
// playbook's mechanical checks, so the messaging-review skill reasons over
// facts instead of eyeballing HTML. Dependency-free stdlib Node (read-only tier).
//
// Usage: node skills/messaging-review/copy-extract.mjs --url https://example.com [--format json|text]
// Exit 0 with {"ok":true,...}; exit 1 with {"ok":false,"error":...} when the page can't be read.

const VERSION = 1
const args = Object.fromEntries(
  process.argv.slice(2).reduce((pairs, arg, i, all) => (arg.startsWith('--') ? [...pairs, [arg.slice(2), all[i + 1]?.startsWith('--') ? true : all[i + 1] ?? true]] : pairs), []),
)
const url = typeof args.url === 'string' ? (args.url.startsWith('http') ? args.url : `https://${args.url}`) : null
const format = args.format === 'text' ? 'text' : 'json'

// Words that belong to the system, not the reader. Matched whole-word, case-insensitive.
const JARGON = [
  'externalize', 'externalized', 'externalizes', 'scoped', 'finding', 'findings', 'acceptance job', 'escrow', 'escrowed', 'escrowing',
  'settled', 'settle', 'CI', 'workflow run', 'payload', 'leverage', 'seamless', 'seamlessly', 'robust', 'utilize', 'synergy',
  'end-to-end', 'cutting-edge', 'next-generation', 'empower', 'unlock', 'revolutionize', 'best-in-class', 'paradigm',
]
const GENERIC_LINKS = /^(learn more|read more|click here|more|submit|continue|get started|details|the details live in the docs)$/i

const decode = (s) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
const text = (html) => decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()
const all = (html, tag) => [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, 'gi'))].map((m) => text(m[1])).filter(Boolean)
const sentences = (block) => block.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean)
const words = (s) => s.split(/\s+/).filter(Boolean).length
// Animated labels often render twice ("Learn more Learn more"); keep one copy.
const once = (s) => {
  const half = s.split(' ')
  const n = half.length / 2
  return Number.isInteger(n) && half.slice(0, n).join(' ') === half.slice(n).join(' ') ? half.slice(0, n).join(' ') : s
}

function fail(error) {
  console.log(JSON.stringify({ ok: false, url, error, extractor_version: VERSION }))
  process.exit(1)
}

if (!url) fail('pass --url <page>')

let html
try {
  const res = await fetch(url, { headers: { 'user-agent': 'aeon-messaging-review/1 (+https://github.com/Svector-anu/svectors-lab)' }, redirect: 'follow', signal: AbortSignal.timeout(20000) })
  if (!res.ok) fail(`HTTP ${res.status}`)
  html = await res.text()
} catch (e) {
  fail(e instanceof Error ? e.message : String(e))
}

const page = html.replace(/<(script|style|noscript|svg|template)\b[\s\S]*?<\/\1>/gi, ' ')
// Navigation and footers repeat on every page; the message lives in between.
const body = page.replace(/<(nav|footer)\b[\s\S]*?<\/\1>/gi, ' ')

const title = text(page.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '')
const description = decode(page.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i)?.[1] ?? '')
const h1 = all(body, 'h1')
const h2 = all(body, 'h2')
const h3 = all(body, 'h3')
const paragraphs = all(body, 'p').filter((p) => words(p) >= 3)
const buttons = [...all(page, 'button'), ...all(page, 'a').filter((a) => words(a) <= 12)].map(once).filter((t, i, list) => list.indexOf(t) === i)
const lists = [...body.matchAll(/<(ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/gi)].map((m) => all(m[2], 'li')).filter((items) => items.length > 0)

const blocks = [...h1, ...h2, ...h3, ...paragraphs]
const corpus = blocks.join('\n')

// "A does. B does. C pays." — three or more short sentences in a row inside one block.
const fragmentChains = blocks.filter((b) => {
  let run = 0
  for (const s of sentences(b)) {
    run = words(s) <= 4 ? run + 1 : 0
    if (run >= 3) return true
  }
  return false
})

const jargon = JARGON.flatMap((term) => {
  const hits = corpus.match(new RegExp(`\\b${term.replace(/[-]/g, '[- ]')}\\b`, term === 'CI' ? 'g' : 'gi'))
  return hits ? [{ term, count: hits.length }] : []
})

const report = {
  ok: true,
  url,
  extractor_version: VERSION,
  fetched_at: new Date().toISOString(),
  title,
  description,
  hero: { headline: h1[0] ?? null, words: h1[0] ? words(h1[0]) : 0, subline: paragraphs[0] ?? null },
  headings: { h1, h2, h3 },
  paragraphs: paragraphs.slice(0, 40),
  buttons: buttons.slice(0, 40),
  checks: {
    sections: h2.length,
    fragment_chains: fragmentChains,
    jargon,
    generic_links: buttons.filter((b) => GENERIC_LINKS.test(b)),
    long_sequences: lists.filter((items) => items.length > 3).map((items) => items.slice(0, 8)),
    hero_too_long: h1[0] ? words(h1[0]) > 14 : false,
    no_hero: h1.length === 0,
  },
}

if (format === 'text') {
  console.log(`# ${report.url}\nHero: ${report.hero.headline}\nSubline: ${report.hero.subline}\nSections (h2): ${report.checks.sections}`)
  console.log(`Fragment chains: ${fragmentChains.length}\nJargon: ${jargon.map((j) => `${j.term}×${j.count}`).join(', ') || 'none'}`)
  console.log(`Generic links: ${report.checks.generic_links.join(', ') || 'none'}`)
} else {
  console.log(JSON.stringify(report, null, 2))
}

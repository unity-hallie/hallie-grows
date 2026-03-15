# hallie-grows

Personal site and portfolio for [Hallie Larsson](https://www.linkedin.com/in/hallie-larsson-7282077/). Built slowly, in the open.

**Live at:** moveslow.info *(pending deployment)*

---

## What this is

A SvelteKit site backed by a DigitalOcean managed Postgres database. Four sections:

- **feed** — posts and conversations, built around a two-voice dialogue reader
- **portfolio** — work: games, educational AI, tools
- **seeds** — interactive artifacts and experiments, including playable browser games
- **resume** — a designed version of my CV

The interesting design decisions are documented below and in comments throughout the source.

---

## The interesting bits

### Paper background

[`src/lib/components/PaperCanvas.svelte`](src/lib/components/PaperCanvas.svelte)

A WebGL fragment shader rendering paper grain and a faint laid finish (the horizontal lines left by the paper mold in handmade paper). The grain is intentionally light — you feel texture without thinking about it. The shader drifts imperceptibly over time so it never looks frozen.

The philosophy comes from [palimpsest](https://github.com/unity-hallie/palimpsest), a collection of terminal shaders built on the same principle: text is sacred, everything else is atmosphere.

### Two-voice dialogue reader

[`src/routes/read/[slug]/+page.svelte`](src/routes/read/[slug]/+page.svelte)

Posts on this site are dialogues between two voices: `hallie` (warm tones) and `claude` (cool tones). As you scroll, the page background lerps between the color temperature of adjacent sections — reading feels like moving through a conversation rather than consuming a document.

The color temperatures:
- **hallie:** `rgb(240, 235, 224)` → `rgb(42, 31, 15)` — warm paper, dark ink
- **claude:** `rgb(237, 240, 245)` → `rgb(24, 32, 44)` — cool paper, near-black

Sections blur and fade as they leave the viewport center, keeping focus on what you're reading now. Margin notes live in `localStorage` per post. On mobile, swipe right opens a drawer for notes.

### Wormwood

[`src/routes/seeds/wormwood/+page.svelte`](src/routes/seeds/wormwood/+page.svelte)

A playable solo RPG about gender, religion, and the apocalypse — written in 2019, never published. Built as a scrolling interactive transcript: the game text is the document, and the inputs (consent gate, gender selection, monster design, drawing canvas) appear inline where the blanks are.

The consent gate is real. Nothing below it renders until you click yes. This is a design decision from the game itself, not the implementation.

The game is a sketch — it ends mid-setup, as the original did. A note at the end says so in the game's own voice.

### Content model

All content lives in a DigitalOcean managed Postgres database. Three tables:

```sql
content  -- kind (post|explainer|work), slug, title, date, description, tags, series, part
sections -- post_slug, section_index, section_type (hallie|claude), body (HTML)
edges    -- source, relationship, target, confidence, via, properties (for future graph features)
```

No markdown files, no YAML frontmatter. Content is authored directly via psql. The DB client is [porsager/postgres](https://github.com/porsager/postgres).

### What's not finished

- MCP server still uses the old JSON graph — Postgres migration pending
- [The Greenfire Highway](https://github.com/unity-hallie/hallie-grows/issues) — another playable game, planned after launch
- No RSS feed yet (planned for `/feed.xml`)

---

## Stack

- **Framework:** SvelteKit with `adapter-node`
- **Database:** DigitalOcean Managed Postgres (sfo3)
- **DB client:** [porsager/postgres](https://github.com/porsager/postgres)
- **Rendering:** WebGL for paper background, standard DOM for everything else
- **Deployment:** DigitalOcean App Platform *(pending)*

---

## Running locally

```bash
npm install
```

Create `.env`:
```
DATABASE_URL=postgresql://...
```

```bash
npm run dev
```

---

## Related

- [palimpsest](https://github.com/unity-hallie/palimpsest) — terminal shaders; the aesthetic reference for this site
- [bro-engine](https://github.com/unity-hallie/bro-engine) — knowledge graph engine, eventually powering the site's graph features

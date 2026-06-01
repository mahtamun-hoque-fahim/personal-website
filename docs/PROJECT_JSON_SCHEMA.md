# Project JSON Schema — Bulk Import Reference

Paste-ready reference for the `Paste JSON` tab at `/admin/projects → + New project`.

Open this in a new tab while importing if you forget the field names.

---

## Endpoint behavior

- **Upsert by `name`** (case-insensitive). Existing rows update, new names create.
- **Atomic per row.** A bad row doesn't abort the batch — each row reports its own outcome.
- Accepts **single object**, **bare array**, or `{ "projects": [...] }`.

---

## Required fields (per row)

| Field | Type | Notes |
|---|---|---|
| `name` | string | Unique — also the upsert key. Don't change casing across imports. |
| `tagline` | string | One-liner shown in cards. Keep under ~90 chars. |
| `description` | string | 2–4 sentences. Shown in full on cards. |
| `repoUrl` | string | Full `https://...` URL. |

## Optional fields

| Field | Type | Default | Notes |
|---|---|---|---|
| `type` | string | `"Web"` | Single word: `Web`, `Mobile`, `Tool`, `Browser Extension`, `Education`, `Health`, `CLI`, `Library`. |
| `tags` | string[] *or* string | `[]` | Tech tags. Array OR comma-separated string both work. |
| `liveUrl` | string \| null | `null` | Hides the "Live ↗" link if absent. |
| `statusBadges` | string[] | `[]` | Any subset of `["live", "beta", "deprecated", "funding"]`. |
| `collaborators` | array | `[]` | See below. |

### `statusBadges` — what each one does

| Badge | Color | Use for |
|---|---|---|
| `live` | green | Production-ready, has a working `liveUrl`. |
| `beta` | blue | In-progress. **Triggers a confirmation modal when the user clicks "Live ↗"**. |
| `deprecated` | grey | No longer maintained. |
| `funding` | amber | Seeking funding / sponsors. |

Combine freely — `["beta", "funding"]` shows both pills.

### `collaborators` — two shapes accepted (mix freely)

```json
"collaborators": [
  "Tanvir Hossain",
  { "name": "Cox's Bazar Medical College", "url": "https://cbmc.edu.bd" }
]
```

- A plain string = name only, no link.
- An object: `name` is required, `url` is optional. `link` and `href` also accepted as keys for the URL.
- Tolerated top-level keys: `collaborators`, `collaborated_with`, `collaboratedWith`.

---

## Server-side sanitization

These run on the server before any DB write — safe to send sloppy JSON:

- `statusBadges` lowercased, deduped, unknown values dropped.
- `collaborators` entries with empty `name` dropped, empty `url` normalized to `null`.
- All string fields trimmed.

---

## Outcome panel

After clicking **Import**, the modal shows per-row results:

| Marker | Meaning |
|---|---|
| `✓ new` | Created a new project. |
| `↻ updated` | Matched an existing `name`, updated it. |
| `✗ error` | Row failed; reason is shown on the right (e.g. `name is required`). |

Successful imports auto-reload the page after ~700ms so the new rows appear.

---

## Full example (paste-ready)

```json
{
  "projects": [
    {
      "name": "Neura",
      "type": "Tool",
      "tags": ["HTML", "Canvas API", "Zero deps"],
      "tagline": "An infinite canvas for thinking out loud.",
      "description": "Collaborative whiteboard with a hand-drawn aesthetic — Excalidraw's paper feel meets Miro's multiplayer, plus presets for real engineering work. EEE/BEE circuit library, AI sketch-to-diagram, sequence/mind-map templates. Pure HTML + Canvas API, no build step.",
      "liveUrl": "https://neura-ashy.vercel.app",
      "repoUrl": "https://github.com/mahtamun-hoque-fahim/neura",
      "statusBadges": ["live"],
      "collaborators": []
    },
    {
      "name": "D-Shastho",
      "type": "Health",
      "tags": ["Next.js", "TypeScript", "Neon", "Bilingual"],
      "tagline": "A diabetes operating system for Bangladesh.",
      "description": "Bilingual health management platform for 84M at-risk diabetics. 8-panel dashboard, lab test booking, family sharing, Bengali food glycemic index guide, auto-generated PDF reports.",
      "liveUrl": null,
      "repoUrl": "https://github.com/Tanvir83775757676/D-SHASTHO",
      "statusBadges": ["beta", "funding"],
      "collaborators": [
        { "name": "Tanvir Hossain", "url": "https://github.com/Tanvir83775757676" },
        "Cox's Bazar Medical College"
      ]
    }
  ]
}
```

---

## Prompt for scanning more repos with Claude

When you want Claude (in a fresh window) to scan a list of GitHub repos and return JSON matching this schema, paste this:

> I have a list of GitHub repos under `mahtamun-hoque-fahim/`. For each, fetch the README via `web_fetch`, then return a single JSON code block matching this schema:
>
> **Required per project:** `name`, `tagline`, `description`, `repoUrl`.
>
> **Optional:** `type` (defaults to "Web"), `tags` (array of strings), `liveUrl` (string or null), `statusBadges` (any subset of `["live", "beta", "deprecated", "funding"]`), `collaborators` (array of strings or `{ name, url }` objects).
>
> Output shape: `{ "projects": [ ... ] }`. Nothing else, no prose around it. Keep the order of my input list.
>
> Add `"_inferred": true` on any row where the README was sparse and you guessed. Add `"_repo_status": "not_found"` if the repo URL 404s.

Don't paste the result blindly — skim `_inferred` rows first.

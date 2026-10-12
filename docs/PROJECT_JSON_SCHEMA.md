# Project JSON Schema — Bulk Import Reference

Paste-ready reference for the `Paste JSON` tab at `/admin/projects → + New project`.

Open this in a new tab while importing if you forget the field names. The same short list is also shown inside the dashboard (the help panel next to the JSON box); this file is the full version.

_Last checked against the code: 2026-10-11 (`app/admin/projects/ProjectsManager.tsx`, `app/admin/actions.ts`, `lib/db/schema.ts`)._

---

## Endpoint behavior

- **Upsert by `name`** (case-insensitive). Existing rows update, new names create.
- **Atomic per row.** A bad row doesn't abort the batch — each row reports its own outcome.
- Accepts a **single object**, a **bare array**, or `{ "projects": [...] }`.
- Anything else (a string, a number, `null`) is rejected before anything is sent.

---

## Required fields (per row)

| Field         | Type   | Notes                                                             |
| ------------- | ------ | ----------------------------------------------------------------- |
| `name`        | string | Unique — also the upsert key. Don't change casing across imports. |
| `tagline`     | string | One-liner shown on the card. Keep under ~90 chars.                |
| `description` | string | 2–4 sentences. Shown in full on the card.                         |
| `repoUrl`     | string | Full `https://...` URL. Used for the card's repo link.            |

A row missing any of these is skipped with an error (`name is required`, or `tagline, description, repoUrl are required`); the rest of the batch still imports.

## Optional fields

| Field           | Type                 | Default | Notes                                                                                |
| --------------- | -------------------- | ------- | ------------------------------------------------------------------------------------ |
| `tags`          | string[] *or* string | `[]`    | Technology tags. Array OR comma-separated string both work. See "Tags" below.         |
| `liveUrl`       | string \| null       | `null`  | The card hides its "Live ↗" link when this is empty.                                  |
| `collaborators` | array                | `[]`    | See below.                                                                           |

### Tags feed a second place

Besides the chips on each card, the **unique tags across all projects** become the scrolling technologies strip on `/projects` (most-used tag first, ties alphabetical). Keep spelling and casing consistent (`Next.js`, not `nextjs` on one project and `Next.js` on another), or the strip will list them as two technologies.

### `collaborators` — two shapes accepted (mix freely)

```json
"collaborators": [
  "Tanvir Hossain",
  { "name": "Cox's Bazar Medical College", "url": "https://cbmc.edu.bd" }
]
```

- A plain string = name only, no link.
- An object: `name` is required, `url` is optional. `link` and `href` are also accepted as keys for the URL.
- Tolerated top-level keys for the whole list: `collaborators`, `collaborated_with`, `collaboratedWith`.

---

## Not part of the import (on purpose)

| Field                       | What happens                                                                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `featured`, `featuredOrder` | **Not imported.** Featuring and ordering are done in the dashboard (the star and the arrows). Updating an existing project by name leaves them untouched. |
| `type`                      | **Removed** (database migration `0011`, Oct 2026). If an old JSON still contains it, it is silently ignored.                                              |
| `statusBadges`              | **Removed** along with the status pills and the "beta" confirmation popup. If an old JSON still contains it, it is silently ignored.                      |

So JSON written for the earlier version of this schema still imports fine; those keys are just dropped.

---

## What gets cleaned before saving

Safe to send sloppy JSON:

- All string fields are trimmed.
- `tags`: each tag trimmed, empty tags dropped (a comma-separated string is split first).
- `liveUrl`: an empty string becomes `null`.
- `collaborators`: entries with an empty `name` are dropped; an empty `url` becomes `null`.

Nothing else is validated: for example `repoUrl` is not checked to be a real URL, so a typo will import and produce a broken link.

---

## Outcome panel

After clicking **Import**, the modal shows per-row results:

| Marker      | Meaning                                                             |
| ----------- | ------------------------------------------------------------------- |
| `✓ new`     | Created a new project.                                              |
| `↻ updated` | Matched an existing `name`, updated it.                             |
| `✗ error`   | Row failed; reason is shown on the right (e.g. `name is required`). |

After an import in which at least one row succeeded, the page reloads after ~700ms so the new rows appear. The public pages (`/`, `/projects`) are revalidated at the same time.

---

## Full example (paste-ready)

```json
{
  "projects": [
    {
      "name": "Neura",
      "tags": ["HTML", "Canvas API", "Zero deps"],
      "tagline": "An infinite canvas for thinking out loud.",
      "description": "Collaborative whiteboard with a hand-drawn aesthetic — Excalidraw's paper feel meets Miro's multiplayer, plus presets for real engineering work. EEE/BEE circuit library, AI sketch-to-diagram, sequence/mind-map templates. Pure HTML + Canvas API, no build step.",
      "liveUrl": "https://neura-ashy.vercel.app",
      "repoUrl": "https://github.com/mahtamun-hoque-fahim/neura",
      "collaborators": []
    },
    {
      "name": "D-Shastho",
      "tags": ["Next.js", "TypeScript", "Neon", "Bilingual"],
      "tagline": "A diabetes operating system for Bangladesh.",
      "description": "Bilingual health management platform for 84M at-risk diabetics. 8-panel dashboard, lab test booking, family sharing, Bengali food glycemic index guide, auto-generated PDF reports.",
      "liveUrl": null,
      "repoUrl": "https://github.com/Tanvir83775757676/D-SHASTHO",
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
> **Optional:** `tags` (array of strings: the technologies used, with consistent spelling such as `Next.js`, `TypeScript`, `Tailwind CSS`), `liveUrl` (string or null), `collaborators` (array of strings or `{ name, url }` objects).
>
> Do not include `type`, `statusBadges`, `featured` or `featuredOrder`.
>
> Output shape: `{ "projects": [ ... ] }`. Nothing else, no prose around it. Keep the order of my input list.
>
> Add `"_inferred": true` on any row where the README was sparse and you guessed. Add `"_repo_status": "not_found"` if the repo URL 404s.

Don't paste the result blindly — skim `_inferred` rows first, and delete the `_inferred` / `_repo_status` keys before importing (they are ignored, but they are noise).

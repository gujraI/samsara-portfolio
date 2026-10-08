my personal website. feel free to fork.

## dev

requires **Node >= 22.12.0** and [bun](https://bun.sh).

```bash
bun install
bun run dev      # astro dev
bun run build    # pull the content submodule, then astro build
bun run preview  # preview the production build
```

## stack

- [Astro 6](https://astro.build) — static output, MDX
- [WebTUI](https://webtui.com) components with the Catppuccin theme
- Shiki code highlighting (`catppuccin-mocha`)
- `remark-reading-time` injects `minutesRead` into post frontmatter

## content

Content lives in a separate repo — an Obsidian vault — mounted as the
`src/content` git submodule (`git@github.com:laxpsy/samsara-content.git`).

- `blog/` and `notes/` are Astro content collections. Both require `title`,
  `description` and `pubDate`; notes also accept `source`, rendered as a
  References section.
- `now.mdx` is imported directly by `/now`.
- URLs come from the file path, so renaming a file changes its URL.

`bun run build` runs `git submodule update --init --remote` to pull the latest
content. Pushing to the content repo triggers a **Cloudflare Pages** deploy hook,
and the site is hosted on Cloudflare Pages.

## routes

| route           | description                          |
| --------------- | ------------------------------------ |
| `/`             | hero + blog/notes listing            |
| `/blog/[slug]`  | blog post (`blog` collection)        |
| `/notes/[slug]` | note (`notes` collection)            |
| `/now`          | "what i'm up to", from `now.mdx`     |
| `/portfolio`    | placeholder (coming soon)            |

## keybindings

### general

| key        | action                                |
| ---------- | ------------------------------------- |
| `p`        | go to `/portfolio`                    |
| `n`        | go to `/now`                          |
| `b`        | enter BLOG mode (on `/`)              |
| `o` then `*` | toggle NOTES mode (on `/`, within 1s) |
| `?`        | show keybindings                      |
| `q` / `Esc` | close keybindings                    |
| `Esc`      | go home (off `/`) / exit a mode       |

### blog & notes modes (on `/`)

| key     | action                        |
| ------- | ----------------------------- |
| `j`/`k` | select next / previous entry  |
| `h`/`l` | previous / next page          |
| `Enter` | open the selected entry       |
| `b`     | switch to BLOG mode           |
| `Esc`   | back to NORMAL                |

On touch devices, swipe left/right on the listing to paginate, and tap the `\/`
glyph in the hero to toggle NOTES mode.

### scrolling (every route except `/`)

| key                | action              |
| ------------------ | ------------------- |
| `j` / `k`          | scroll one line     |
| `Ctrl-d` / `Ctrl-u` | scroll half a page |

## todo

- [ ] portfolio page
- [ ] OG / Twitter meta tags

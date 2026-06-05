# Annota

Pick DOM elements on localhost pages, attach feedback notes, and copy as structured Markdown for AI coding agents.

## Overview

Annota is a desktop Chromium extension (Manifest V3) for capturing structured UI feedback during local web development. Click an element, type what to change, copy the Markdown report, paste it into your AI coding tool, then clear and repeat for the next pass.

No accounts, no backend, no screenshots. Annotations are disposable — they live in `chrome.storage.local` and are discarded when you're done.

## Features

- **Pick Mode** — Click any element on the page to target it. Hover highlights, click blocked from page.
- **Feedback Popover** — Type notes in a compact dark popover. `Cmd/Ctrl+Enter` to save.
- **Numbered Badges** — Annotated elements get numbered dots. Click one to view/replace/delete.
- **Copy as Markdown** — One-click export of all annotations as structured Markdown for AI agents.
- **Stale Detection** — Annotations on changed elements are auto-removed (3s retry, 70% text-similarity threshold).
- **SPA Compatible** — Re-validates on `pushState` / `replaceState` / `hashchange`.
- **localhost Only** — Scoped to `localhost`, `127.0.0.1`, and `*.local` URLs.

## Quick Start

1. Clone this repo.
2. Open `chrome://extensions`, enable Developer mode.
3. Click **Load unpacked** and select the `annota/` directory.
4. Navigate to a page on `http://localhost:*`.
5. Click the Annota toolbar icon to open the popup, then click **Start picking**.
6. Click any element on the page, type your feedback, and save.
7. Repeat. Click **Copy** in the popup to get the Markdown report.

## Permissions

| Permission | Reason |
|---|---|
| `storage` | Store annotations in `chrome.storage.local` |
| `activeTab` | Read the page URL for per-page keying and copy text |

Host permissions (`host_permissions`) grant content script injection on `localhost`, `127.0.0.1`, and `*.local` only. No remote servers, no analytics, no external requests.

## Development

```bash
# Load the annota/ folder as an unpacked extension
```


## Project Structure

```
annota/
  background/
    service-worker.js      # Extension lifecycle and icon badge
  content/
    badge-renderer.js      # Numbered dot positioning
    content.js             # Shadow DOM overlay, pick mode, UI scaffold
    message-router.js      # Content ↔ popup messaging
    popover-manager.js     # Open/close/save popover state machine
    popover-templates.js   # HTML template builders
    selector-generator.js  # CSS selector generation (5 priotity levels)
    spa-detector.js        # pushState/hashchange/replaceState listener
    stale-validator.js     # Annotation staleness detection
    target-normalizer.js   # Click target normalization
  icons/                   # Extension icons
  popup/
    popup.html             # Toolbar popup markup
    popup.css              # Popup styles
    popup.js               # Popup logic and copy
  shared/
    annotation-store.js    # Read-modify-write annotation storage
    annotations-storage.js # Storage persistence layer
    chrome-badge-adapter.js
    chrome-messaging-adapter.js
    chrome-storage-adapter.js
    observer.js            # MutationObserver for re-validation triggers
    tokens.css             # Design tokens (CSS custom properties)
    utils.js               # Shared utilities
  manifest.json            # Extension manifest (MV3)
```

## Configuration

No configuration files or environment variables. The extension works out of the box once loaded.

## Architecture

- All UI is rendered inside a **Shadow DOM overlay** (`#__annota-root__`) for total CSS isolation from the host page.
- Every annotation stores a **fingerprint** (`tagName`, `text`, `childCount`) for staleness detection.
- **Selectors** are generated with 5-priority strategy: `data-testid` → `aria-label` → unique `id` → semantic class → structural path.
- The **Page Key** format `annotations::${origin}${pathname}${hash}` includes the hash for SPA compatibility.
- Content scripts use isolated content script realms (`world: "ISOLATED"`, MV3 default). No `world: "MAIN"` injection needed.

## Roadmap

- [ ] Extension icons and toolbar badge visuals
- [ ] Configurable staleness threshold

## License

No license specified.

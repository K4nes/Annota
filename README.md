# Annota

Pick DOM elements on localhost pages, attach feedback notes, and copy as structured Markdown for AI coding agents.

## Overview

Annota is a desktop Chromium extension (Manifest V3) for collecting structured UI feedback during local web development. Click an element, type what to change, copy the report, paste it into your AI coding tool, then clear and repeat.

No accounts, no backend, no screenshots. Every annotation lives in `chrome.storage.local` and is discarded when done.

## Features

- **Pick Mode** — Crosshair cursor, hover highlight, page clicks intercepted
- **Feedback Popover** — Single-row textarea grows on Enter, `×` closes
- **Numbered Badges** — Dots anchored to annotated elements; click to view, replace, or delete
- **Per-item Copy** — Clipboard icon next to each annotation in the popup (transitions to checkmark)
- **Batch Copy** — Export all annotations as structured Markdown in one click
- **Stale Detection** — Annotations on mutated elements are auto-removed after a 3s retry window
- **SPA Compatible** — Re-validates on `pushState`, `replaceState`, and `hashchange`
- **localhost Only** — Scoped to `localhost`, `127.0.0.1`, and `*.local` URLs

## Quick Start

1. Open `chrome://extensions` → enable **Developer mode** → **Load unpacked** → select the `annota/` directory.
2. Go to any page on `http://localhost:*` or `http://127.0.0.1:*`.
3. Click the Annota toolbar icon → **Add feedback**.
4. The crosshair cursor shows pick mode is active. Click any element.
5. Type your note, press `×` to close when done. Repeat.
6. Click **Copy all** in the popup for the full Markdown report, or click the clipboard icon next to a single annotation.

## Usage

### Copy Output Format

Each annotation produces this Markdown block:

```markdown
# UI feedback
Page: /dashboard

1. Selector: [data-testid="save-btn"]
   Locator hint: data-testid="save-btn"
   Element: <button class="btn primary" data-testid="save-btn">
   Viewport: 1440x900
   Feedback: Button colour needs more contrast
```

Fields included: `Selector`, `Locator hint` (when present), `Element`, `Viewport`, `Feedback`.

### Per-item Copy

Click the clipboard icon next to any annotation in the popup list. It transitions to a green checkmark for 1.5s. Same full format is copied — header, selector, element, viewport, feedback.

## Architecture

### Layers

```
Page DOM                     ← Shadow DOM overlay (#__annota-root__)
  ↕
Content Script Bundle        ← content.bundle.js (pre-built)
  ↕ chrome.storage.local
Extension Storage            ← one annotation array per Page Key
```

### Data Model

| Concept | Description |
|---------|-------------|
| **Annotation** | `id`, `selector`, `locatorHint`, `tag`, `elementSnippet`, `text`, `feedback`, `viewport`, `fingerprint`, `createdAt`, `pageKey` |
| **Page Key** | `annotations::${origin}${pathname}${hash}` — includes hash for SPA routing |
| **Selector** | Priority: `data-testid` → `aria-label` → unique `id` → semantic class → `:nth-of-type` path |
| **Fingerprint** | `{ tagName, text, childCount }` captured at annotate time, used for staleness detection |
| **Locator Hint** | Human-readable anchor (`data-testid`, `aria-label`, etc.) included in Markdown export |

### Communication

```
Popup (popup.js)  ←→  Content Script (message-router.js)  ←→  Background (service-worker.js)
    │                       │                                        │
    │  chrome.tabs.         │  chrome.storage.              chrome.action.
    │  sendMessage()        │  onChanged sync               setBadgeText()
```

## Project Structure

```
annota/
  manifest.json              # MV3 extension manifest
  content.bundle.js          # Bundled content script
  content/                   # Content script source modules
  popup/                     # Toolbar popup (html, css, js)
  shared/                    # Shared modules (storage, tokens, utils)
  background/                # Service worker
```

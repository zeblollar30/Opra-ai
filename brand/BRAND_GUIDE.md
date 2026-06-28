# Opra Brand Identity Guide

> **"You Talk. We Act."**

---

## Overview

Opra is an AI operator that gets things done — it makes calls, books appointments, negotiates bills, fills in forms, and tracks refunds end-to-end. The brand identity balances capability with warmth, positioning Opra as an **accessible executive assistant for everyone**, not just the wealthy.

The name "Opra" is short for *operator* — punchy, confident, human — and rhymes with *opera*. The visual identity leans into that phonetic resonance: **Phantom of the Opera** meets modern AI agency. Elegant, mysterious, theatrical — but always approachable.

---

## 1. Logo

### The Concept: Classic Phantom Mask
The logo pairs a **standalone Phantom of the Opera half-mask icon** with a bold uppercase **"OPRA"** wordmark. The mask is a separate, immediately recognizable element — not hidden inside a letter, not formed by negative space. It is THE phantom mask: elegant, theatrical, unmistakable.

**Mask design:**
- Classic white half-mask silhouette — two brow peaks, gentle nose bridge dip, sweeping cheekbone curves
- One prominent dark eyehole on the right side (the phantom's visible eye)
- A second subtle eyehole on the left (the hidden side)
- **Red teardrop** accent descending from the right eye — theatrical, Phantom-esque, used sparingly
- Delicate mask ribbons trailing from the sides
- Black outline defines the mask's shape on light backgrounds; solid white defines it on dark backgrounds

**Wordmark:**
- Uppercase **"OPRA"** in bold geometric sans
- Clean, readable, no tricks or modifications to the letters
- "P", "R", "A" are standard bold letterforms — thick strokes, wide proportions
- Sits to the right of the mask icon

**Tagline:** "YOU TALK. WE ACT." in small caps below.

### Color Palette (Logo)
| Color | Hex | Usage |
|-------|-----|-------|
| Black | `#000000` | Wordmark, mask outline, eyeholes |
| White | `#FFFFFF` | Mask body (fill) |
| Red | `#CC0000` | Teardrop accent |

**No gradients, no other colors in the logo.** The red accent is used sparingly — a single teardrop as a theatrical flourish.

### Logo Files

| File | Usage |
|------|-------|
| `opra-logo.svg` | Black on transparent — for light backgrounds |
| `opra-logo-inverse.svg` | White on transparent — for dark backgrounds |
| `opra-icon.svg` | Standalone mask icon (black) — for favicon, app icon |
| `opra-icon-inverse.svg` | Standalone mask icon (white) — for dark backgrounds |

### Clear Space
Maintain clear space equal to the height of the letter "O" on all sides of the logo.

### Minimum Size
- Digital: 48px wide (icon only), 120px wide (full logo)
- Print: 0.5in wide (icon only), 1.2in wide (full logo)

### Logo Variations
- **Full logo** — icon + wordmark + tagline (primary use: hero, website header)
- **Icon mark** — icon alone (use: favicon, app icon, avatar, social profile)
- **Horizontal stacked** — icon centered above wordmark (use: square spaces, badges)

### Don'ts
- Don't recolor the logo — use only approved colors
- Don't rotate or skew the icon
- Don't place the logo on busy backgrounds without adequate contrast
- Don't add effects (shadows, glows) unless approved

---

## 2. Color Palette

### Primary: Teal-Navy
| Token | Hex | Usage |
|-------|-----|-------|
| Primary Dark | `#0A6E6E` | Headlines, buttons, primary actions, UI accents |
| Primary | `#0D8A8A` | Hover states, interactive elements |
| Primary Light | `#E8F5F5` | Backgrounds, card surfaces, subtle fills |

Primary teal communicates capability, reliability, and calm. It's a confident blue-green — technical enough for AI, warm enough for a human service.

> **Note:** The logo itself is black and white only — brand colors are used throughout the UI and marketing, but not in the logo mark itself.

### Secondary: Blue
| Token | Hex | Usage |
|-------|-----|-------|
| Secondary | `#4A90D9` | Links, secondary buttons, information highlights |
| Secondary Light | `#EFF5FC` | Information banners, secondary fills |

### Accent: Warm Orange / Coral
| Token | Hex | Usage |
|-------|-----|-------|
| Accent | `#F4A261` | CTAs, action dots, highlights, badges (bookings, tasks) |
| Accent Deep | `#E07A5F` | Accent hover states, emphasis markers |
| Accent Light | `#FEF3ED` | Notification banners, callout backgrounds |

The accent orange warms the palette — it's the "human touch." Used sparingly for actions.

### Neutral
| Token | Hex | Usage |
|-------|-----|-------|
| Text Dark | `#1A1817` | Body text, headings, logo wordmark |
| Text Medium | `#4A4643` | Secondary text, captions |
| Text Light | `#8A8276` | Tagline, tertiary text, placeholder |
| Border | `#E0DDD8` | Dividers, input borders |
| Background | `#FAF9F7` | Page backgrounds |
| White | `#FFFFFF` | Cards, modals, overlays |

The neutrals lean warm — a soft "paper" quality rather than harsh gray. Feels human.

### Accessibility
All primary text combinations pass WCAG AA contrast ratios. Accent orange is used for decorative/emphasis only, not for body text.

---

## 3. Typography

### Headings: Inter
**Weight:** Bold (700) for major headlines, SemiBold (600) for subheadings

```
Inter Bold       — H1, H2
Inter SemiBold   — H3, H4
Inter Medium     — H5, subheads
```

Inter is a clean, modern sans-serif with excellent readability at every size. Its geometric precision mirrors Opra's technical competence; its warm openness (tall x-height, generous letter spacing) keeps it approachable.

### Body: Inter
**Weight:** Regular (400) for body text, Medium (500) for emphasis

```
Inter Regular    — Body copy, descriptions
Inter Medium     — Labels, nav items, buttons
Inter Light      — Captions (use sparingly)
```

### Monospace (Code / Status): JetBrains Mono
**Weight:** Regular (400)

Used for status messages, system feedback, API output — anything that needs to sound precise and automated. *Optional — only needed if product shows technical output.*

### Fallback Stack
```
font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Type Scale
```
H1: 48px / 52px line-height (hero)
H2: 36px / 42px line-height
H3: 28px / 34px line-height
H4: 22px / 28px line-height
H5: 18px / 24px line-height
Body: 16px / 24px line-height
Small: 14px / 20px line-height
Caption: 12px / 16px line-height
```

---

## 4. Brand Tagline & Positioning

### Primary Tagline
**"You Talk. We Act."**

Short, confident, transactional in the best way. Sets clear expectations: you say what needs doing, Opra handles it. No fluff, no marketing speak.

### Elevator Pitch
> Opra is the AI operator that does things for you — calls businesses, books appointments, negotiates bills down, fills out forms, and tracks refunds. It's the executive assistant everyone deserves but no one could afford — until now.

### Brand Voice Principles
| Principle | Description |
|-----------|-------------|
| **Capable** | Direct, confident, no hedging. "We got it done." |
| **Warm** | Human-first, not robotic. Uses "you / we," not "the user." |
| **Punchy** | Short sentences. Active voice. "You talk. We act." |
| **Clear** | No jargon. Explains what it does in plain words. |
| **Accessible** | For everyone, not executives. Friendly, not formal. |

### Tone Spectrum
| Scenario | Tone |
|----------|------|
| Onboarding / welcome | Warm + enthusiastic |
| Task confirmation | Confident + precise |
| Error / failure | Empathetic + solution-oriented |
| Success notification | Celebratory + punchy |
| Marketing / landing page | Bold + benefit-forward |

---

## 5. Visual Guidelines

### Logo Usage
- Light backgrounds → use `opra-logo.svg` (black)
- Dark backgrounds → use `opra-logo-inverse.svg` (white)
- Do not place logo on busy patterns without adequate contrast
- The logo is monochrome — do not add color variants
- Minimum size: 24px (icon), 80px (full wordmark)

### Gradient Usage
Gradients are NOT used in the logo (which is strictly black and white).
They may be applied to UI and marketing elements:

Phantom teal gradient (`#0A6E6E` → `#0D8A8A`) may be applied to:
- Button backgrounds (primary CTA)
- Hero section backgrounds (subtle, low-opacity)
- Progress indicators

Spotlight gradient (`#F4A261` → `#E07A5F`) is used for:
- Stage spotlights, action dots, badges
- Notification markers
- Small decorative highlights only

Stage gradient (`#4A90D9` → `#0A6E6E`) is a secondary blend used for:
- Theatrical backgrounds
- Feature card accents

### Iconography
When creating system icons:
- Use rounded stroke style (2px stroke, rounded caps)
- Keep to primary teal or neutral tones
- Accent orange for "action" icons (send, confirm, call)

### Spacing & Layout
- Generous whitespace — Opra is calm, not cluttered
- Card-based UI with soft rounded corners (12px radius)
- Subtle shadows (`0 2px 8px rgba(26,24,23,0.06)`) for depth

---

## 6. Deliverables

| File | Description |
|------|-------------|
| `opra-logo.svg` | Phantom wordmark — mask-in-O + bold "pra" + tagline (black, for light backgrounds) |
| `opra-logo-inverse.svg` | Inverse version (white, for dark backgrounds) |
| `opra-icon.svg` | Standalone mask icon (black) — favicon / app icon |
| `opra-icon-inverse.svg` | Standalone mask icon (white) — for dark backgrounds |
| `BRAND_GUIDE.md` | This document — full identity specification |

---

*Designed for Opra — the AI operator for everyone.*/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'

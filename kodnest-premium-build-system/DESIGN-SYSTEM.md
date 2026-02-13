# KodNest Premium Build System

A design system for a serious B2C product. Calm, intentional, coherent, confident. One mind; no visual drift.

---

## Design philosophy

- **Calm, intentional, coherent, confident**
- Not flashy, not loud, not playful, not hackathon-style
- No gradients, no glassmorphism, no neon colors, no animation noise
- Everything should feel like one mind designed it

---

## Color system (maximum 4 colors)

| Role       | Token / usage        | Value     |
|-----------|----------------------|-----------|
| Background| `--kn-background`    | `#F7F6F3` |
| Primary text | `--kn-text`     | `#111111` |
| Accent    | `--kn-accent`        | `#8B0000` (deep red) |
| Success   | `--kn-success`       | `#4A5D4A` (muted green) |
| Warning   | `--kn-warning`       | `#8B6914` (muted amber) |

Derived: `--kn-color-text-muted`, `--kn-color-border`, `--kn-color-border-focus`. No additional palette colors.

---

## Typography

- **Headings:** Serif (`Source Serif 4`), large, confident, generous spacing. Use `.kn-heading`, `.kn-h1`, `.kn-h2`, `.kn-h3`.
- **Body:** Sans-serif (`Source Sans 3`), 16–18px, line-height 1.6–1.8. Use `.kn-body-text`.
- **Measure:** Max width for text blocks = **720px** (`--kn-measure`).
- No decorative fonts; no random sizes.

**Font loading (add to `<head>`):**

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600&family=Source+Serif+4:wght@400;600&display=swap" rel="stylesheet">
```

---

## Spacing system (strict scale)

Use only: **8px, 16px, 24px, 40px, 64px**

| Token           | Value  |
|-----------------|--------|
| `--kn-space-xs` | 8px    |
| `--kn-space-sm`| 16px   |
| `--kn-space-md`| 24px   |
| `--kn-space-lg`| 40px   |
| `--kn-space-xl`| 64px   |

Never use random spacing (e.g. 13px, 27px). Whitespace is part of the design.

---

## Global layout structure

Every page must follow this order:

1. **Top Bar**
2. **Context Header**
3. **Primary Workspace + Secondary Panel**
4. **Proof Footer**

### Top Bar

- **Left:** Project name (`.kn-topbar__project`)
- **Center:** Progress indicator — "Step X / Y" (`.kn-topbar__progress`)
- **Right:** Status badge (`.kn-badge--not-started` | `--in-progress` | `--shipped`)

### Context Header

- Large serif headline (`.kn-context-header__headline`)
- One-line subtext (`.kn-context-header__subtext`)
- Clear purpose; no hype language

### Primary Workspace (70% width)

- `.kn-workspace` — main product interaction
- Clean cards (`.kn-card`), predictable components, no crowding

### Secondary Panel (30% width)

- `.kn-panel`
- Step explanation (short) — `.kn-panel__explanation`
- Copyable prompt box — `.kn-prompt-box`
- Buttons: Copy, Build in Lovable, It Worked, Error, Add Screenshot — use `.kn-panel-actions` and `.kn-btn`
- Calm styling; no visual noise

### Proof Footer (persistent bottom)

- `.kn-proof-footer`
- Checklist: □ UI Built · □ Logic Working · □ Test Passed · □ Deployed
- Each item (`.kn-proof-footer__item`) has a checkbox (`.kn-proof-footer__checkbox`) and requires user proof input

---

## Component rules

- **Primary button:** Solid deep red (`.kn-btn--primary`). Same hover and border radius everywhere.
- **Secondary button:** Outlined (`.kn-btn--secondary`).
- **Inputs:** Clean borders, no heavy shadows, clear focus state (`.kn-input`, `.kn-textarea`).
- **Cards:** Subtle border, no drop shadows, balanced padding (`.kn-card`).
- **Border radius:** `--kn-radius` / `--kn-radius-button` = 6px globally.

---

## Interaction rules

- **Transitions:** 150–200ms, ease-in-out (`--kn-transition-duration`, `--kn-transition-ease`).
- No bounce, no parallax.

---

## Error and empty states

- **Errors:** Explain what went wrong and how to fix it. Never blame the user. Use `.kn-error`, `.kn-error__title`, `.kn-error__message`, `.kn-error__fix`.
- **Empty states:** Provide the next action; never feel dead. Use `.kn-empty`, `.kn-empty__message`, and a primary or secondary button.

---

## File structure

```
kodnest-premium-build-system/
├── index.css          # Entry point (imports all)
├── tokens.css         # Design tokens (colors, typography, spacing, layout, motion)
├── base.css           # Reset, typography, base element styles
├── layout.css         # Top bar, context header, workspace, panel, proof footer
├── components.css     # Buttons, badges, inputs, cards, prompt box, error/empty
└── DESIGN-SYSTEM.md   # This document
```

**Usage:** Link `index.css` after the font links. Apply layout and component classes to your HTML as described above. Do not introduce new colors, spacing values, or transition timings outside the tokens.

---

*KodNest Premium Build System — one mind, no drift.*

---
name: Fieldwork Pro Utility
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#44474c'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#75777c'
  outline-variant: '#c5c6cc'
  surface-tint: '#545f6f'
  primary: '#0a1623'
  on-primary: '#ffffff'
  primary-container: '#1f2a38'
  on-primary-container: '#8691a2'
  inverse-primary: '#bcc7da'
  secondary: '#b02f00'
  on-secondary: '#ffffff'
  secondary-container: '#ff5722'
  on-secondary-container: '#541100'
  tertiary: '#001a06'
  on-tertiary: '#ffffff'
  tertiary-container: '#003111'
  on-tertiary-container: '#00a74c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e3f6'
  primary-fixed-dim: '#bcc7da'
  on-primary-fixed: '#111c2a'
  on-primary-fixed-variant: '#3d4857'
  secondary-fixed: '#ffdbd1'
  secondary-fixed-dim: '#ffb5a0'
  on-secondary-fixed: '#3b0900'
  on-secondary-fixed-variant: '#862200'
  tertiary-fixed: '#66ff8e'
  tertiary-fixed-dim: '#3de273'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005322'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  border-slate: '#E2E8F0'
  surface-card: '#FFFFFF'
  text-muted: '#64748B'
  status-warning: '#F59E0B'
  status-success: '#16A34A'
  status-danger: '#DC2626'
typography:
  display-hero:
    fontFamily: Outfit
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Outfit
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Outfit
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Outfit
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
  numeric-currency-lg:
    fontFamily: Outfit
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  numeric-currency-md:
    fontFamily: Outfit
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  gutter-desktop: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system is tailored for trade professionals, contractors, and independent artisans operating in fast-paced on-site environments. The brand personality balances uncompromising professionalism with instant operational clarity. It strips away friction, visual noise, and aesthetic indulgence in favor of high-yield utility, speed, and immediate confidence.

The design movement bridges **Corporate Modern** with **High-Utility Tactile Minimalism**:
- **Field-Ready Legibility:** Interfaces prioritize instant glanceability under direct sunlight or harsh job-site lighting.
- **Action-Biased Hierarchy:** High-contrast focal points direct the user immediately toward quoting, sending, and confirmation workflows.
- **Professional Trust:** Deep structured anchors ground financial figures and legal estimates, offset by high-visibility interactive triggers and WhatsApp integration touchpoints.

## Colors

The palette establishes sharp functional roles to optimize mobile fieldwork efficiency:

- **Primary (`#1F2A38`):** Deep Navy anchors structured navigation, bottom navigation bars, primary headings, financial labels, and authoritative structural cards.
- **Secondary (`#FF5722`):** Vibrant Accent Orange functions as the operational accelerator—reserved for conversion-critical primary actions (e.g., "Create Quote", "Confirm Price", "Send Deposit Request") and active state indicators.
- **Tertiary (`#25D366`):** Official WhatsApp green, used exclusively for direct messaging actions, chat share confirmations, and customer communication pathways.
- **Neutral (`#F8FAFC`):** Crisp, cool off-white base surface preventing glare while delivering clean separation against pure white (`#FFFFFF`) elevated cards.
- **Named Slate Border (`#E2E8F0`):** Defines clean boundary lines across cards, input borders, and row separators without heavy visual weight.

## Typography

The typographic hierarchy employs **Outfit** for headlines, figures, and branding markers to yield clean geometric structure with modern punch, while **Plus Jakarta Sans** provides open counters and legible legibility for body descriptions, client details, and form fields.

- Tabular numeric formatting is mandatory for currency totals, job quantities, and unit calculations to ensure clean column alignment.
- Small uppercase utility tracking (`label-sm`) is applied for workflow tags such as `ESTIMATE`, `DRAFT`, `ACCEPTED`, and `INVOICED`.

## Layout & Spacing

This design system leverages a mobile-first fluid layout architecture centered around strict vertical rhythm and standard touch accessibility:

- **Mobile Viewport (< 640px):** Single-column stack with `margin` of `1rem` (16px) and `gutter` of `1rem`. Touch interaction areas must never drop below a minimum bound of 48px in height or width.
- **Tablet / Expanded Field Mode (640px - 1024px):** 6-column fluid grid, `1.25rem` margins, enabling side-by-side quote entry and live preview receipt panes.
- **Desktop Back-Office Mode (> 1024px):** 12-column fixed grid with a max-width container capped at `1200px` centered, utilizing `margin-desktop` of `2rem` and `gutter-desktop` of `1.5rem`.
- **Rhythm Rules:** Form inputs, quote line items, and summary totals maintain compact spacing (`space-sm` to `space-md`) within grouped sections, reserving `space-xl` for macroscopic page transitions.

## Elevation & Depth

Visual hierarchy avoids excessive drop-shadows that distract or wash out in high-ambient-light environments. Instead, depth is constructed using **low-contrast slate borders combined with ambient soft shadows**:

- **Ground (Base Surface):** Canvas rests on `#F8FAFC` without elevation.
- **Level 1 (Cards, Form Containers, Quote Sections):** Solid `#FFFFFF` background bound by a crisp `1px solid #E2E8F0` hairline border, accompanied by an ambient subtle shadow: `0 1px 3px 0 rgba(31, 42, 56, 0.04), 0 1px 2px -1px rgba(31, 42, 56, 0.04)`.
- **Level 2 (Popovers, Sticky Summary Bottom Sheets):** `#FFFFFF` surface, `1px solid #E2E8F0`, with `0 10px 15px -3px rgba(31, 42, 56, 0.08), 0 4px 6px -4px rgba(31, 42, 56, 0.03)`.
- **Level 3 (Modal Dialogs & Keypad Overlays):** `#FFFFFF` paired with high-focus backdrop tint `rgba(31, 42, 56, 0.45)` and deep elevation: `0 20px 25px -5px rgba(31, 42, 56, 0.15)`.
- **Interactive Focus & Taps:** Depressed states use physical micro-shifts (`scale(0.98)` transform) with active border darkening to `#CBD5E1`.

## Shapes

The interface embraces a balanced modern shape language:
- Standard elements (cards, text fields, lists, dialog windows) use **Level 2 Roundedness** (`0.5rem` / 8px).
- Larger containers and full-width bottom sheets utilize `rounded-lg` (`1rem` / 16px).
- Action buttons, badges, and WhatsApp communication chips use soft radii (`0.5rem`) to maintain precision and avoid the overly informal aesthetic of pill capsules, preserving a trade-tested, professional demeanor.

## Components

### Buttons
- **Primary Action (Secondary Orange):** Background `#FF5722`, text `#FFFFFF`, height 50px for effortless thumb tapping. Active state `#E64A19`.
- **WhatsApp Direct Action (Tertiary Green):** Background `#25D366`, text `#FFFFFF`, icon prefix with official WhatsApp vector, height 50px.
- **Secondary Utility (Navy Outline):** Background transparent, border `1.5px solid #1F2A38`, text `#1F2A38`.
- **Destructive/Cancel:** Background transparent, text `#DC2626`, hover background `rgba(220, 38, 38, 0.05)`.

### Input Fields & Calculation Controls
- Height 48px minimum. Background `#FFFFFF`, border `1px solid #E2E8F0`, text `#1F2A38`.
- Focus state: Border color `#FF5722` with a `0 0 0 3px rgba(255, 87, 34, 0.15)` focus ring.
- Numeric and currency inputs display a fixed prefix (`$`, `€`, `£`) in `#64748B` with heavy bold font styling (`numeric-currency-md`).

### Cards & Quote Line Items
- Pure `#FFFFFF` surface with `1px solid #E2E8F0` border and `0.5rem` border-radius.
- Line items use flexible tabular rows: description and quantity left-aligned, unit pricing and total right-aligned with instant subtotal updates.

### Chips & Status Badges
- Compact height (24px to 28px), padding `0.25rem 0.625rem`.
- `Draft`: Background `#F1F5F9`, text `#475569`.
- `Sent via WhatsApp`: Background `rgba(37, 211, 102, 0.12)`, text `#15803D`.
- `Approved`: Background `rgba(34, 197, 94, 0.12)`, text `#16A34A`.
- `Deposit Paid`: Background `rgba(255, 87, 34, 0.12)`, text `#EA580C`.

### Lists & Selection Rows
- Edge-to-edge content separated by `1px solid #F1F5F9` dividers.
- Checkboxes and radio toggles feature a 22px hit box with active fill `#FF5722` and white icon checkmark.

### Quote Summary Bar (Sticky Footer)
- Fixed mobile bottom dock anchored to viewport bottom.
- Background `#1F2A38`, text `#FFFFFF`, showing live quote total on the left in `numeric-currency-lg` alongside a prominent WhatsApp Send button (`#25D366`) on the right.
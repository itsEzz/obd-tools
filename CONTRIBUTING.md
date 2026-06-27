# Contributing to OBD Tools

Thank you for your interest in contributing! This document covers everything you need to know.

## Table of Contents

- [Contributing to OBD Tools](#contributing-to-obd-tools)
  - [Table of Contents](#table-of-contents)
  - [Code of Conduct](#code-of-conduct)
  - [How to Contribute](#how-to-contribute)
  - [Development Workflow](#development-workflow)
  - [Adding a New Language](#adding-a-new-language)
    - [Step-by-step](#step-by-step)
  - [Code Style \& Quality](#code-style--quality)
  - [Project Structure](#project-structure)

## Code of Conduct

Be respectful, constructive, and inclusive. Harassment or toxic behavior will not be tolerated.

## How to Contribute

- **Report a bug** — open a [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md)
- **Suggest a feature** — open a [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md)
- **Fix something / add something** — open a [Pull Request](.github/PULL_REQUEST_TEMPLATE.md)
- **Translate** — see [Adding a New Language](#adding-a-new-language)

## Development Workflow

1. Fork the repository and create a branch from `main`:
   ```bash
   git checkout -b my-feature-branch
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the dev server:
   ```bash
   pnpm dev
   ```
4. Make your changes — keep them focused on a single concern.
5. Run checks before committing:
   ```bash
   pnpm check       # Type-check (svelte-check)
   pnpm lint        # ESLint + Prettier
   pnpm format      # Auto-format with Prettier
   ```
6. Commit using clear, descriptive messages.
7. Push and open a pull request against `main`.

## Adding a New Language

This project uses [inlang](https://inlang.com) with Paraglide JS for internationalization.

### Step-by-step

1. **Add the locale** to `project.inlang/settings.json`:
   ```json
   {
     "baseLocale": "en",
     "locales": ["en", "de", "fr"]   // ← add your locale here
   }
   ```
2. **Create a message file** at `messages/{locale}.json` (copy `messages/en.json` as a starting point).
3. **Translate the values** — keep the keys unchanged; only translate the message strings.
4. **Generate message functions**:
   ```bash
   pnpm machine-translate
   ```
   This auto-generates the Paraglide message functions (manual translation is recommended for quality, but `machine-translate` can serve as a starting point).
5. **Rebuild** to verify everything compiles:
   ```bash
   pnpm build
   ```

## Code Style & Quality

- **Language:** TypeScript (strict mode)
- **Framework:** SvelteKit with Svelte 5 runes (`$state`, `$derived`, `$effect`)
- **Formatting:** Prettier (config in `.prettierrc`)
- **Linting:** ESLint (config in `eslint.config.js`)
- **CSS:** Tailwind CSS v4 — prefer utility classes; avoid custom CSS unless necessary
- **Forms:** Use `sveltekit-superforms` with Zod schemas for validation
- **Components:** Follow the shadcn-svelte patterns already in place

## Project Structure

```
src/
├── lib/
│   ├── components/       # Reusable Svelte components
│   │   ├── common/       # Shared UI (CopyButton, DialogDrawer, etc.)
│   │   ├── layout/       # Layout components (Navbar, Footer, ContentWindow)
│   │   ├── magic/        # Animated/magic UI components (Marquee)
│   │   └── ui/           # shadcn-svelte base UI components
│   ├── logic/            # Business logic (svm, coding-compare, pr-codes, etc.)
│   ├── paraglide/        # Auto-generated i18n (do not edit manually)
│   ├── schemas/          # Zod schemas (form validation, search params, API)
│   └── utils/            # Utility functions (copy, download, scroll, etc.)
├── routes/               # SvelteKit routes (pages + API endpoints)
│   ├── api/              # REST API endpoints
│   ├── svm/              # SVM XOR tool page
│   ├── cc/               # Coding Compare tool page
│   ├── htb/              # Hex to Binary tool page
│   ├── prl/              # PR Codes Lookup tool page
│   ├── bc/               # Backup Converter tool page
│   └── api-docs/         # Scalar API documentation
├── app.html
├── app.d.ts
└── hooks.ts / hooks.server.ts
messages/                 # i18n JSON files (en.json, de.json, …)
project.inlang/           # inlang project settings
```

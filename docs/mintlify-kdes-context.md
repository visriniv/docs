# Mintlify Context - Koala Data Explorer Studio (KDES)

This document packages the key facts needed to add a **Koala Data Explorer Studio (KDES)** section to the Mintlify docs set. Treat it as the authoritative context for the new **native desktop app** experience. Keep the existing **Koala Data Explorer Extension (KDEE)**/VS Code docs unchanged; create a sibling KDES section that mirrors the structure (overview -> setup -> usage -> advanced topics) while pointing back to KDEE where workflows overlap.

---

## Product Overview

- **What KDES is:** an Electron-based SQL workbench for Oracle Fusion OTBI/BI Publisher that ships as signed installers for Windows and macOS (with experimental Linux support). It pairs the same Supabase backend and Oracle SOAP client stack that powers the VS Code extension but wraps it in a full desktop shell.
- **Primary personas:** analysts and developers who need richer clipboard/file access than VS Code allows, enterprise users who cannot install VS Code, and anyone who prefers a native packaging/deployment story.
- **Why it matters:** KDES offers semicolon-scoped execution, tab-local connections, offline query history, CSV/XLSX export, hardened IPC, and one-click packaging. These are already live in production builds described in `README.md`.

Use the talking points above for the Mintlify "Overview" and "Why a native app?" callouts.

---

## Differentiators vs. KDEE (call this out early in Mintlify)

| Area | KDEE (VS Code) | KDES (Native) |
| --- | --- | --- |
| Distribution | VS Code Marketplace extension | Signed DMG/EXE (Electron Forge) with optional Linux artifacts |
| Authentication | VS Code account context, Secrets API | Supabase auth (URL + anon key), bundled WebView2 helper for Oracle SSO |
| Storage | VS Code `globalState` + `SecretStorage` | File system data lake (`tabs/`, `results/`, `session/`) plus Supabase |
| UI Surface | Embedded webview in VS Code | Full-screen React app with multi-window controls and custom chrome |
| Connection Portability | VS Code sync, manual JSON | Encrypted exports/imports + planned Supabase sync bridging KDEE and KDES |
| Update Story | Marketplace auto-updates | In-app banner + `autoUpdater` flow with BTSS-hosted feeds |

Make this table (or a simplified version) the anchor for the "Native Desktop" landing page so readers immediately see why a separate section exists.

---

## Installation & Setup Highlights

1. **Prerequisites**
   - Node 18+ and npm/yarn for contributors.
   - Supabase env vars: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env` (dev) or `.env.production` (CI).
   - Optional Apple/Windows code-signing certs (documented in `README.md` under "Code Signing").
2. **Local development**
   - `npm install` -> `npm run dev` (boots Vite renderer, Electron main/preload watchers).
3. **Packaging**
   - `npm run package` for local bundle smoke-tests; `npm run make` generates platform installers in `out/`.
4. **Distribution**
   - DMG published to `out/`, Windows Squirrel installer under `out/make/squirrel.windows/`, Linux `.AppImage`/`.deb` optional.

Mintlify Install page should mirror the VS Code doc format (Prerequisites, Dev Setup, Packaging, Distribution) but swap VS Code specifics for the bullet points above.

---

## Authentication & Connection Flow

- KDES defers user identity to Supabase; the renderer expects the Supabase URL + anon key at runtime, then issues Supabase sessions per user.
- Connection records live in Supabase tables with AES-256-GCM encrypted fields (username/password/tokens). KDES mirrors the KDEE schema but uses UUIDs and cloud persistence.
- Supported auth types: **Basic**, **SSO**, **OAuth PKCE** - see `docs/connection-sync-approaches.md` for parity details.
- Windows SSO uses the bundled `Koala.SSO.Helper.exe` (WebView2) managed by `src/main/services/sso-helper-manager.ts`, which spawns a native login window to retrieve JWTs securely.

For Mintlify, surface this as a dedicated "Authentication & Connections" page that links to the connection-sync spec for people interested in shared schemas.

---

## Feature Deep Dive (copy into Mintlify "Using KDES" section)

### SQL Editing

- Semicolon-scoped execution automatically detects the statement around the cursor, including empty-line edge cases.
- Selection-first execution: highlighted text overrides semicolon detection.
- Shortcuts: Ctrl/Cmd+Enter (run), Alt+F (format), Ctrl/Cmd+N (new tab), accessible menus for everything else.
- Monaco editor tabs feature per-tab connection selectors, saved queries integration, CSV/XLSX export, and clipboard-safe copy actions.

### Simple SQL Editor

- `/simple-sql` route exposes a minimalist editor (no tabs, no Monaco) for reliability and accessibility. It keeps connection selection, history logging, error messaging, and execution timing. Summaries live in `docs/SIMPLE_SQL_EDITOR.md`.

### Tab, State, and History Management

- Tabs persist to disk (`tabs/metadata/`), results live under `tabs/results/<tabId>/page-*.json`, and active layouts live in `tabs/session/session.json`. Automatic cleanup jobs prune stale files, and query history cleanup runs per `docs/automatic-query-history-cleanup.md`.

### File Storage & Security

- Storage paths:
  - macOS: `~/Library/Application Support/Koala Data Studio/`
  - Windows: `%APPDATA%/Koala Data Studio/`
  - Linux: `~/.config/Koala Data Studio/`
- Contents include metadata, paginated results (1000 rows/page), session snapshots, temp autosave SQL, and encrypted auth blobs (`auth/btss-sql-editor-auth-main.json`). Reference `docs/FILE_STORAGE_GUIDE.md` for system-specific navigation steps and cleanup guidance.

### Copy, Export, and CSV Viewer

- Result grids leverage Material React Table's copy helpers plus custom logic in `docs/query-results-table-copy-functionality.md`.
- Dedicated CSV parsing/preview components (powered by Papa Parse) let users upload, inspect, filter, and re-export CSV data directly inside the app (documented in `README.md`).

### In-App Updates

- `docs/IN_APP_UPDATE_PLAN.md` defines a ChatGPT-style banner, background download cadence, and restart CTA built on `autoUpdater` with BTSS-hosted feeds. Windows uses Squirrel manifests; macOS uses `latest-mac.yml`.

Tie each subsection above to Mintlify placeholders ("SQL Editor", "Simple Mode", "Data Retention", etc.).

---

## Architecture Snapshot

- **Tech stack:** Electron Forge + Vite (main, preload, renderer), React/TypeScript UI, Supabase backend, Oracle SOAP/OTBI clients, hardened IPC bridges with `contextIsolation`.
- **Project layout:** `src/main.ts` (Electron bootstrap), `src/preload.ts` (whitelisted APIs), `src/components/sql/*` (editor and results), `src/helpers/ipc/*` (secure channels), `forge.config.ts` (makers, signing hooks), and `docs/*` (feature specs).
- **Security posture:** `contextIsolation` on, preload exposes a minimal bridge, and native modules ship through `@electron-forge/plugin-auto-unpack-natives`. Credentials never touch plain localStorage—only encrypted Supabase fields or OS-protected auth files.

Use this content verbatim for the Mintlify "Architecture" section.

---

## Release, CI/CD, and Auto-Update Story

- Git strategy: quarterly branches (`2025_A`, etc.) feed into `master` each quarter; releases are tagged `vYYYY.Qx`.
- GitHub Actions workflow (`.github/workflows/release.yml`) builds signed installers on macOS + Windows whenever a tag is pushed. Pipelines expect Supabase secrets plus signing material (Apple API keys / Apple ID, Windows PFX or cert subject, optional raw signtool args).
- For Azure DevOps mirrors, the README prescribes running `yarn make` on macOS and Windows agents, publishing artifacts, then signing in secure steps.
- In-app update plan (above) depends on these signed outputs and publishes `RELEASES`, `.nupkg`, DMGs/ZIPs, and manifest files.

Mirror the KDEE Mintlify "Release Process" page but swap in the branch model, required secrets, and auto-update tie-ins listed here.

---

## Connection Sync Guidance (Roadmap Callout)

- `docs/connection-sync-approaches.md` compares four strategies for keeping KDEE and KDES in sync: encrypted file exchange, shared Supabase backend, dedicated API, and a Settings Sync hybrid.
- Phase 1 recommendation: password-protected `.kdex` export/import commands on both sides (low effort, air-gapped friendly).
- Later phases: shared Supabase package for seamless sync, with `.kdex` remaining as a fallback for offline users.

In Mintlify, add a "KDEE <-> KDES Connection Sync" article summarizing the phased approach and linking to the full spec for implementation details.

---

## Troubleshooting & Support Hooks

- `docs/TROUBLESHOOTING_GUIDE.md` - general diagnostics, log locations, safe-mode tips.
- `docs/query-history-cleanup*.md` - how automated cleanup works and how to reset history.
- `docs/INFINITE_SCROLL_STORAGE.md`, `docs/TAB_STATE_MANAGEMENT_STRATEGY.md`, `docs/TAB_SWITCHING_PERFORMANCE_RCA.md` - deep-dive background for engineers.
- `Common.md`, `SETUP_AUTHENTICATION.md`, `SECURITY_ASSESSMENT_REPORT.md`, and `SECURITY_FIX_TRACKER.md` - enterprise compliance attachments if Mintlify needs "Security & Compliance" blurbs.

Link these from a Mintlify "Additional Resources" page so writers and customers can navigate into the raw Markdown when they need more depth.

---

## Checklist for the Mintlify Update

1. Add a **KDES landing page** describing the native app at parity with the existing KDEE landing page, referencing the differentiator table above.
2. Create subsections for:
   - Installation & packaging
   - Authentication & connections
   - SQL editor usage (full + Simple mode)
   - Storage & privacy
   - Auto-update & releases
   - KDEE <-> KDES sync roadmap
3. Cross-link KDEE and KDES docs wherever workflows overlap so customers understand they can use both.
4. Keep KDEE content untouched until Product/Docs confirm the migration plan; this document is the only new source of truth to ingest right now.

Once these pages exist in Mintlify, back-reference them from any KDEE "What's New" notes to advertise the native desktop availability.

---

**Action requested:** "Add Koala Data Explorer Studio (native desktop) content to Mintlify using the context above; ensure the Mintlify sidebar mirrors the KDEE structure but splits VS Code vs Native tabs. Do **not** modify KDEE documentation - just add KDES next to it based on this attachment."

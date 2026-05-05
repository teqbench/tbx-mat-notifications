# Docs Deploy Workflow — `docs-deploy.yml`

**Full name:** TeqBench Package - Docs Deploy Workflow
**File:** `.github/workflows/docs-deploy.yml`

---

## Purpose

Builds the consumer-facing documentation [Storybook ↗](https://storybook.js.org) (`npm run build-storybook:docs`) and deploys it to [GitHub Pages ↗](https://pages.github.com). Each push to `main` produces a fresh published docs site so consumers always see the latest released API surface alongside the live component examples.

The local file is a thin caller; all build and deploy logic lives in the centralized reusable workflow at `teqbench/.github/.github/workflows/docs-deploy.yml`.

---

## Triggers

<dl>
    <dt><code>push</code></dt>
    <dd>On <code>main</code>.</dd>
</dl>

Runs on every push to `main` — release merges, badge commits, and non-release merges alike. The deploy is idempotent; if nothing in the docs Storybook output changed, [GitHub Pages ↗](https://pages.github.com) republishes the same artifact.

---

## Concurrency

```yaml
group: docs-deploy-${{ github.repository }}
cancel-in-progress: false
```

Separate group from CI, Release, and Sync so docs-deploy never blocks or is blocked by the other workflows. The reusable workflow itself uses a `pages-${{ github.repository }}` group internally to serialize against [GitHub Pages ↗](https://pages.github.com)'s single-deployment-at-a-time constraint.

---

## Permissions

Permissions are declared at the **job level** in the centralized reusable workflow. The thin caller declares no top-level permissions; downstream jobs request only what they need:

- `build` — `contents: read`, `packages: read` (for [GitHub Packages ↗](https://github.com/orgs/teqbench/packages) install)
- `deploy` — `pages: write`, `id-token: write` (required by `actions/deploy-pages`)

---

## Secrets Used

<dl>
    <dt><code>GITHUB_TOKEN</code></dt>
    <dd>Default token. Used as <code>NODE_AUTH_TOKEN</code> for installing <code>@teqbench/*</code> dependencies from <a href="https://github.com/orgs/teqbench/packages">GitHub Packages ↗</a>, and for publishing the Pages artifact.</dd>
</dl>

No app token needed — this workflow only reads dependencies and writes the [GitHub Pages ↗](https://pages.github.com) artifact for the current repo.

---

## Jobs

### Job 1: `build` (Build Docs Storybook)

Steps:

1. **Checkout code** — Standard checkout (no full history needed).
2. **Setup Node** — Configures Node from `.nvmrc` with `registry-url: "https://npm.pkg.github.com"` and `scope: "@teqbench"` for [GitHub Packages ↗](https://github.com/orgs/teqbench/packages) authentication.
3. **Install dependencies** — `npm ci` for deterministic builds. `NODE_AUTH_TOKEN` is set to `GITHUB_TOKEN` so private `@teqbench/*` packages resolve.
4. **Build Docs Storybook** — `npm run build-storybook:docs` produces `storybook-docs-static/`.
5. **Upload Pages artifact** — `actions/upload-pages-artifact@v3` packages `storybook-docs-static/` as the deployment payload.

> **Cross-repo `@teqbench` dependencies:** Same constraint as CI — each transitive `@teqbench` dependency must grant this repository read access in its package settings (**[GitHub Packages ↗](https://github.com/orgs/teqbench/packages) → Manage access**), or `npm ci` will fail with `403 Forbidden`.

### Job 2: `deploy` (Deploy to GitHub Pages)

Runs after `build` succeeds.

Step:

1. **Deploy** — `actions/deploy-pages@v4` publishes the artifact to the repository's `github-pages` environment. The deployed URL is exposed as a job output and visible on the workflow run page.

---

## Prerequisites

The consuming repo must have:

- **Settings → Pages → Source: GitHub Actions** — opts the repo into Actions-driven deployment instead of branch-based deployment.
- **`build-storybook:docs` script** — produces `storybook-docs-static/`. See `package.json`.
- **Docs Storybook configuration** — `STORYBOOK_MODE=docs` selects the consumer-facing docs builder profile (separate from the dev Storybook used during local development).

---

## Interaction with Other Workflows

<dl>
    <dt>Release PR merged (push to <code>main</code>)</dt>
    <dd>Triggers CI (badge update), Release (creates GitHub Release + publishes), Sync (merges main into dev), and Docs Deploy (publishes the docs Storybook for the new released API).</dd>
    <dt>Non-release push to <code>main</code></dt>
    <dd>Triggers Docs Deploy alongside CI and Sync. The deploy is idempotent — if nothing in the docs Storybook output changed, the same artifact is republished.</dd>
</dl>

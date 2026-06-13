# Portfolio CMS (Decap)

Every paragraph, list item, project, education entry, certification and nav label is now editable through a browser editor at **`/admin/`**, backed by JSON files committed to this repo.

## Where content lives

```
public/
├── content/                ← edited by the CMS, read by the Angular app at runtime
│   ├── settings.json       (owner, email, social, copyright, site title)
│   ├── navigation.json     (sidebar / rail nav items)
│   ├── home.json
│   ├── military.json
│   ├── work.json
│   ├── projects.json
│   ├── development.json
│   └── education.json
├── admin/
│   ├── index.html          (loads Decap CMS from CDN)
│   └── config.json         (collection + field schema for the editor)
└── uploads/                (auto-created on first image upload — committed to repo)
```

## How the site loads it

1. On app startup, `ContentService` (`src/app/services/content.service.ts`) is run via `provideAppInitializer` and fetches every `/content/*.json` in parallel into the in-memory registry at `src/app/data/_runtime.ts`.
2. Each `*.data.ts` file in `src/app/data/` exports a `Proxy` whose property reads first check that registry, falling back to the bundled defaults if a slot is empty (SSR, fetch error, or no CMS deployed).
3. Page components and templates **don't change** — they keep importing the same constants. The Proxy hands them the live content invisibly.

If `/content/*.json` 404s, the site keeps working with the hardcoded fallback values.

---

## Local editing (no GitHub, no OAuth)

`config.json` ships with `"local_backend": true`. Run the Angular dev server and the Decap local proxy side by side:

```bash
# terminal 1 — Angular
npx ng serve --host 0.0.0.0 --allowed-hosts

# terminal 2 — Decap local backend
npx decap-server
```

Then open `http://localhost:4200/admin/`. Edits write **directly** to the JSON files on disk; HMR picks them up and the page refreshes. Commit the changed JSON when you're happy.

---

## Production editing (GitHub-backed)

When you want to edit from anywhere without running the local proxy, point Decap at GitHub via an OAuth flow. The fastest zero-infra path:

### Option A — Netlify Identity (free)

1. Deploy the site to Netlify (one click via repo import — Netlify will serve `public/` automatically).
2. In the Netlify dashboard → **Identity** → **Enable Identity**.
3. Identity → **Registration** → set to *Invite only* (otherwise anyone can sign up).
4. Identity → **Services** → **Git Gateway** → **Enable**.
5. In `public/admin/index.html`, add the identity widget script just before the Decap script:
   ```html
   <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
   ```
6. In `public/admin/config.json`, change `"backend"` to:
   ```json
   "backend": { "name": "git-gateway", "branch": "master" }
   ```
7. Remove `"local_backend": true` (or keep it — it's ignored in prod when the backend is `git-gateway`).
8. Invite yourself (Identity → Invite users → your email).
9. Open `https://your-site.netlify.app/admin/` → Login → edit.

### Option B — GitHub OAuth app (no Netlify)

1. Create a GitHub OAuth App at <https://github.com/settings/applications/new>:
   - **Homepage URL**: `https://zouriel.dev`
   - **Authorization callback URL**: `https://your-oauth-proxy.example.com/callback`
2. Deploy a tiny OAuth proxy — easiest is **decap-oauth-proxy** on Cloudflare Workers or Vercel (5 min, free).
3. In `public/admin/config.json`, set `backend.base_url` to your proxy URL.
4. Visit `/admin/`, click Login → GitHub.

> Until prod auth is wired, `local_backend: true` keeps the local edit workflow working — Decap just won't be usable from the live URL.

---

## Image uploads

The **image** widget (currently wired on the `cover` field of each project) uploads files to `public/uploads/` and stores the resulting path in the JSON. When committed back to the repo, Angular serves them statically from `/uploads/…`.

To add an image field to anything else: add a field like
```json
{ "name": "photo", "label": "Photo", "widget": "image", "required": false }
```
inside any collection's `fields` array, then expose the path in your template.

---

## Adding a new field

1. Edit the relevant `public/content/<page>.json` to add the new key (with its initial value).
2. Add the matching field definition to `public/admin/config.json`.
3. Add the same key to the fallback const in `src/app/data/<page>.data.ts` so the type system is happy and the site still renders without the CMS.
4. Use it in the template — the Proxy already forwards reads.

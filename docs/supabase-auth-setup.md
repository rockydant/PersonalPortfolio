# Supabase authentication setup (admin sign-in)

This guide walks through configuring **Supabase Auth** so the admin sign-in page works: **email magic link**, **GitHub**, and **Google**. The app is Next.js (App Router); the OAuth and magic-link return path is **`/auth/callback`**.

---

## 1. What you are configuring

| Method | User experience | Supabase pieces |
|--------|-----------------|-----------------|
| Email (magic link) | User enters email → receives link → opens link → signed in | Email provider, redirect URLs, `NEXT_PUBLIC_SITE_URL` for link host |
| GitHub | User clicks GitHub → GitHub consent → redirect back to your app | GitHub OAuth App, Supabase GitHub provider |
| Google | User clicks Google → Google consent → redirect back | Google Cloud OAuth client, Supabase Google provider |

All three can stay enabled at once; users pick one per session.

---

## 2. Create or open a Supabase project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. Create a project (or open an existing one).
3. Wait until the project is **healthy** and Auth is available.

---

## 3. Application environment variables

Copy [.env.example](../.env.example) to `.env.local` at the repo root (see [README](../README.md) for OS-specific copy commands).

Set at least:

| Variable | Where to find it |
|----------|------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → **Project Settings** → **API** → **Project URL** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same page → **Project API keys** → **anon** `public` |

Optional but **strongly recommended** for magic links and for consistent OAuth redirects when the app is not opened in a normal browser tab:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Public site base URL **with no trailing slash**, e.g. `http://localhost:3000` locally or `https://your-domain.com` in production. Used when building the callback URL for email magic links and OAuth (`/auth/callback?next=...`). If unset in the browser, the app falls back to `window.location.origin`. |

Restart `npm run dev` after changing `.env.local`.

---

## 4. Supabase → Authentication → URL configuration

Open **Authentication** → **URL configuration** in the Supabase dashboard.

### Site URL

Set **Site URL** to the primary URL users consider “the app”:

- **Local:** `http://localhost:3000` (or whichever port you use).
- **Production:** `https://your-production-domain.com` (no trailing slash).

This is the default redirect target for some auth flows when no explicit redirect is provided.

### Redirect URLs

Supabase only allows redirects to URLs listed here. Add **every origin** you use, each with **`/auth/callback`**:

**Local development**

```text
http://localhost:3000/auth/callback
```

If you use another port, replace `3000` accordingly (e.g. `http://localhost:3001/auth/callback`).

**Production**

```text
https://your-production-domain.com/auth/callback
```

**Vercel preview (optional)**

If you test OAuth or magic links against preview deployments, add each preview origin explicitly, for example:

```text
https://your-project-git-branch-team.vercel.app/auth/callback
```

You can add multiple lines; each full callback URL must be allowed.

**Why `/auth/callback`?**

The app implements `GET /auth/callback` ([`src/app/auth/callback/route.ts`](../src/app/auth/callback/route.ts)). It exchanges the OAuth `code` (or verifies email OTP) and then redirects the user to the internal `next` path (default `/admin`).

---

## 5. Enable Email (magic link)

1. Open **Authentication** → **Providers**.
2. Find **Email**.
3. Enable it.
4. Configure options according to your needs:
   - **Magic link** / “passwordless” sign-in is what the **“Send magic link”** button uses (`signInWithOtp`).
   - If you also use **local dev password sign-in** (`DEV_ADMIN_EMAIL` / `DEV_ADMIN_PASSWORD`), the same Email provider must allow **password** for that user; see [Optional: dev password sign-in](#optional-dev-password-sign-in-local-only).

5. Save.

**Email templates (optional):** Under **Authentication** → **Email Templates**, you can customize the magic link email. Links should still point at your app’s origin and ultimately hit `/auth/callback` as configured in Supabase.

---

## 6. Enable GitHub

### 6.1 Create a GitHub OAuth App

1. GitHub → **Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App** (or use an existing app).
2. **Application name:** any name (e.g. “Portfolio admin”).
3. **Homepage URL:** your Site URL, e.g. `http://localhost:3000` or production `https://your-domain.com`.
4. **Authorization callback URL:** this must be Supabase’s callback, **not** your Next app directly:

   ```text
   https://<YOUR_SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback
   ```

   Replace `<YOUR_SUPABASE_PROJECT_REF>` with the subdomain from your Supabase project URL (the part before `.supabase.co`).

5. Create the app and note the **Client ID** and generate a **Client secret**.

### 6.2 Connect GitHub in Supabase

1. **Authentication** → **Providers** → **GitHub**.
2. Enable GitHub.
3. Paste **Client ID** and **Client secret** from GitHub.
4. Save.

### 6.3 Test

With `.env.local` set, run `npm run dev`, open `/admin/login`, click **GitHub**, complete GitHub authorization. You should land in `/admin` (or the `next` path you requested).

---

## 7. Enable Google

### 7.1 Create Google OAuth credentials

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Select or create a project.
3. **APIs & Services** → **Credentials** → **Create credentials** → **OAuth client ID**.
4. Application type: **Web application**.
5. **Authorized JavaScript origins:** add your app origins, e.g.:

   - `http://localhost:3000`
   - `https://your-production-domain.com`

6. **Authorized redirect URIs:** add Supabase’s callback (same pattern as GitHub):

   ```text
   https://<YOUR_SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback
   ```

7. Create and note **Client ID** and **Client secret**.

### 7.2 Connect Google in Supabase

1. **Authentication** → **Providers** → **Google**.
2. Enable Google.
3. Paste **Client ID** and **Client secret**.
4. Save.

### 7.3 Test

Open `/admin/login`, click **Google**, complete consent, confirm redirect back to your app.

---

## 8. Middleware and unauthenticated admin

When `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are **both** set, [`src/proxy.ts`](../src/proxy.ts) requires a valid session for `/admin/*` except `/admin/login`. If those variables are missing, the proxy does **not** enforce auth (useful only for UI previews without Supabase).

---

## 9. Production checklist

- [ ] `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` set on the host (e.g. Vercel).
- [ ] `NEXT_PUBLIC_SITE_URL` set to the **production** origin (no trailing slash).
- [ ] Supabase **Site URL** = production origin.
- [ ] Supabase **Redirect URLs** include `https://your-domain.com/auth/callback`.
- [ ] GitHub OAuth App **callback** remains `https://<project-ref>.supabase.co/auth/v1/callback` (unchanged when you deploy a new frontend URL).
- [ ] Google **Authorized redirect URIs** still point at Supabase’s `/auth/v1/callback`.
- [ ] **Do not** set `DEV_ADMIN_EMAIL` / `DEV_ADMIN_PASSWORD` in production (development-only shortcut).

Redeploy the Next app after changing `NEXT_PUBLIC_*` variables so builds and runtime see the correct values.

---

## 10. Optional: dev password sign-in (local only)

For faster local iteration you can set in **`.env.local` only**:

```env
DEV_ADMIN_EMAIL=you@example.com
DEV_ADMIN_PASSWORD=your-secure-local-password
```

Requirements:

1. `npm run dev` (`NODE_ENV` must be `development`). This path is **disabled** for `npm run start` and on Vercel.
2. A Supabase Auth user exists with that **email** and **password**.
3. **Authentication** → **Providers** → **Email** allows **password** sign-in for that account.

Then use **Sign in with dev credentials** on `/admin/login`. The handler is `POST /api/auth/dev-login` ([`src/app/api/auth/dev-login/route.ts`](../src/app/api/auth/dev-login/route.ts)); credentials are read **only on the server** from the environment.

---

## 11. Troubleshooting

| Symptom | Things to check |
|---------|-------------------|
| Redirected to `/auth/auth-code-error` | Redirect URL missing or wrong in Supabase; OAuth client callback must be Supabase `.../auth/v1/callback`, not your Next `/auth/callback`. |
| Magic link opens wrong host or broken link | Set `NEXT_PUBLIC_SITE_URL` to the URL users actually open (local vs production). |
| “Invalid redirect URL” from Supabase | Add the exact callback URL (origin + `/auth/callback`) to **Redirect URLs**. |
| GitHub/Google works locally but not in production | Add production `/auth/callback` to Supabase Redirect URLs; set `NEXT_PUBLIC_SITE_URL` on the host; confirm production URL in GitHub/Google allowed origins if required. |
| `/admin/login?error=config` | Missing `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the environment for that deployment. |

---

## 12. Related files in this repo

| File | Role |
|------|------|
| [`src/app/admin/login/page.tsx`](../src/app/admin/login/page.tsx) | Admin login page |
| [`src/components/admin-login-form.tsx`](../src/components/admin-login-form.tsx) | Magic link + OAuth + optional dev sign-in |
| [`src/app/auth/callback/route.ts`](../src/app/auth/callback/route.ts) | Exchanges code / verifies OTP, sets session cookies |
| [`src/proxy.ts`](../src/proxy.ts) | Protects `/admin` when Supabase env is configured |

For deployment and env tables, see [README.md](../README.md) → **Production setup**.

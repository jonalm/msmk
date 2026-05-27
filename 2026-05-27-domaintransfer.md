# Transfer a `.no` domain from one.com → Domeneshop, then point it at a GitHub Pages project

**Date:** 2026-05-27

**Goal:** Move a `.no` domain currently managed by **one.com** to **Domeneshop** (domene.shop / domeneshop.no), then map it so that:

```
mittdomene.no/   →   the GitHub Pages project "msmk"
                     (currently at https://jonalm.github.io/msmk/)
```

The domain is associated **only** with this project. No email on the domain. The current site can be discarded.

> Replace `mittdomene.no` with your real domain throughout.

---

## Overview / order of operations

1. **Transfer** the domain from one.com to Domeneshop (registrar change at Norid).
2. **Wait** for the domain to land on Domeneshop's nameservers.
3. **Set DNS** records at Domeneshop pointing at GitHub.
4. **Attach the custom domain** to the `msmk` repo on GitHub + enforce HTTPS.
5. **Fix the site's base path** from `/msmk/` to `/`.

> Do the DNS step (3) only *after* the transfer completes, so you're editing records on the registrar that actually controls the domain.

---

## Part 1 — At one.com (losing registrar)

For `.no` there is **no auth/EPP code** — Norid doesn't use them. The only thing that matters here:

- **Check the domain holder's contact email** in your one.com control panel. Norid sends the transfer confirmation to the registered holder address (not necessarily your one.com login). Make sure it's an inbox you can read. If it's outdated, fix it before starting — an unreachable holder email is the one thing that stalls a `.no` transfer.

That's it on the one.com side. You do **not** need to unlock anything or fetch a code (those are gTLD concepts, not `.no`).

---

## Part 2 — At Domeneshop (gaining registrar)

1. Go to Domeneshop (**domene.shop** or **domeneshop.no**) → **"Flytt domene"** / transfer a domain.
2. Enter your domain (`mittdomene.no`) and place the order.
3. Norid emails a confirmation request to the **domain holder's registered address**. **Approve it.**
4. The registrar change usually completes within a day or two.

**Notes**
- A `.no` registrar change is normally **free**; you just pay Domeneshop at the next renewal (it does *not* add a year like gTLD transfers do).
- Your **ownership is preserved** — the legal holder stays the same; only the managing registrar changes (one.com → Domeneshop).
- one.com doesn't have to actively "release" the domain.

---

## Part 3 — DNS at Domeneshop (point the apex at GitHub Pages)

Once the domain is on Domeneshop's nameservers, open Domeneshop's **DNS editor** for the domain and add the GitHub Pages apex records (host = `@` or blank):

```
A   @   185.199.108.153
A   @   185.199.109.153
A   @   185.199.110.153
A   @   185.199.111.153
```

Optional IPv6 (same host `@`):

```
AAAA   @   2606:50c0:8000::153
AAAA   @   2606:50c0:8001::153
AAAA   @   2606:50c0:8002::153
AAAA   @   2606:50c0:8003::153
```

Optional `www` subdomain (so `www.mittdomene.no` works too):

```
CNAME   www   jonalm.github.io.
```

> ⚠️ **Verify these IPs against GitHub's current docs** before relying on them:
> GitHub Docs → "Managing a custom domain for your GitHub Pages site."
> They've been stable for years, but it's a one-minute check.

DNS propagation is usually minutes.

---

## Part 4 — On GitHub (attach the custom domain)

The `msmk` site is a **project page** (`username.github.io/<repo>`). Attaching a custom domain to the repo serves its content at the **domain root** — the `/msmk/` subpath disappears:

```
https://jonalm.github.io/msmk/   →   https://mittdomene.no/
```

After the change, `jonalm.github.io/msmk` will auto-redirect to `mittdomene.no`.

**Steps**
1. Open the **`msmk` repo** → **Settings** → **Pages**.
2. Under **Custom domain**, enter `mittdomene.no` → **Save**.
   (This commits a `CNAME` file to the repo.)
3. Wait for the DNS check to go **green**.
4. Tick **Enforce HTTPS**. GitHub issues a free Let's Encrypt certificate automatically (works fine for `.no`). Cert provisioning can take up to ~1 hour — that's normal.

---

## Part 5 — Base path: nothing to do ✅

The base-path issue (assets hardcoded to `/msmk/...` breaking at the apex root) is the usual gotcha — but **it does not apply to this repo.**

Verified on 2026-05-27 against the local repo at `~/msmk` (remote `git@github.com:jonalm/msmk.git`):

- It's a **plain static site** — `index.html`, `om_oss.html`, `style.css`, `assets/`. No build tool.
- All internal links are **relative**: `href="style.css"`, `href="om_oss.html"`, `src="assets/..."`.
- **No** root-absolute (`="/..."`) or `/msmk/` paths anywhere; `style.css` has no `url()` references.

Relative links resolve correctly at any base, so the site works **unchanged** at both
`https://jonalm.github.io/msmk/` and `https://mittdomene.no/`. No edits required.

> Note: attaching the custom domain on GitHub will create a `CNAME` file in this repo
> (none exists yet) — let GitHub add it, then `git pull` so your local copy stays in sync.

---

## Quick checklist

- [ ] one.com: holder/contact email is current and reachable
- [ ] Domeneshop: order the `.no` transfer ("Flytt domene")
- [ ] Approve Norid confirmation email
- [ ] Transfer completes (domain on Domeneshop nameservers)
- [ ] Domeneshop DNS: add 4× `A @` records (+ optional AAAA / `www` CNAME)
- [ ] (Verify GitHub's IPs against current docs)
- [ ] `msmk` repo → Settings → Pages → Custom domain = `mittdomene.no`
- [ ] DNS check green → Enforce HTTPS
- [x] ~~Base path~~ — N/A, site uses relative links (verified 2026-05-27)
- [ ] `git pull` after GitHub adds the `CNAME` file
- [ ] Confirm `https://mittdomene.no/` loads with working assets

---

## Notes / gotchas

- **`.no` ≠ `.com`:** no auth/EPP code, no lock to disable. The confirmation is via Norid to the holder email.
- **No email / old site to preserve:** nothing to back up; the old site simply stops resolving once DNS moves, which is the desired outcome.
- **One custom domain = one repo at its root.** GitHub can't path-route `mittdomene.no/x → repoX` across repos. Since the domain is dedicated to the `msmk` project, the apex → `msmk` repo mapping is exactly right.
- **Don't start a transfer right before expiry.** If the registration is close to expiring, renew first.

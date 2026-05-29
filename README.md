# Poway Woman's Club — Website (Frontend)

The public website and member portal for the **Poway Woman's Club**, serving the
Poway community since 1960 — scholarships, arts, civic programs, and youth
leadership.

This repository is the **frontend**: a [Jekyll](https://jekyllrb.com/) site
deployed on GitHub Pages. It talks to a separate Flask API for login, events,
the club blog, groups, and member messaging.

- **Frontend (this repo):** [`Poway-Women-s-Club/pwc`](https://github.com/Poway-Women-s-Club/pwc)
- **Backend API:** [`Poway-Women-s-Club/pwc-flask`](https://github.com/Poway-Women-s-Club/pwc-flask)
- **Live site:** https://poway-women-s-club.github.io/pwc/

---

## What the site does

| Area | Description |
|------|-------------|
| Home | Rotating quote/fact/tip banner, featured "What we do" posts, announcements, newsletter, and contact info. |
| About / Newsletter / Contact | Static informational pages. |
| Blog | Club blog with comments; officers can pin posts so they appear as announcements on the home page. |
| Events | Calendar of meetings and events with RSVP (members) and public RSVP (visitors). |
| Member portal | Login/registration, profiles, groups, and member-to-member messaging. |
| Login | Username/password and Google OAuth sign-in. |

Most interactive features require the backend API to be running.

---

## Tech stack

- **Jekyll** with the `jekyll/minima` remote theme
- Plugins: `jekyll-remote-theme`, `jekyll-include-cache`, `jekyll-feed`, `jekyll-seo-tag`
- Custom styling in `assets/css/pwc.css` and `assets/css/style.scss`
- Vanilla JavaScript in `assets/js/` for all API-backed features
- GitHub Pages for hosting; GitHub Actions for deployment

---

## Project structure

```
pwc/
├── _config.yml          Site config + API URLs (see "Configuration" below)
├── _includes/           Header, footer, head partials
├── _layouts/            Page templates (default, home, page, post)
├── index.md             Home page
├── navigation/          About, Blog, Events, Groups, Login, Profile, etc.
├── assets/
│   ├── css/             Site styles
│   ├── js/              Frontend logic (login, blog, events, profile, groups…)
│   └── api/config.js    Decides which API URL to use (local vs. deployed)
├── scripts/             Helper scripts
├── Makefile             Local build/serve commands
└── .github/workflows/   GitHub Pages deployment
```

---

## Running locally

You need **Ruby** and **Bundler** installed.

```bash
# 1. Install dependencies
bundle install

# 2. Serve the site (defaults to http://localhost:4600)
make

# Stop the local server
make stop
```

`make` also rebuilds automatically when you edit files. To do a clean rebuild,
run `make refresh`.

When the site runs on `localhost`, it automatically points at a local backend
at `http://localhost:8327`. Start the [backend](https://github.com/Poway-Women-s-Club/pwc-flask)
separately if you want login, events, and other API features to work.

---

## Configuration

API URLs live in **`_config.yml`**:

| Setting | Purpose |
|---------|---------|
| `events_api_base_url` | The deployed (production) Flask API URL. |
| `events_api_local_url` | The local Flask API URL (default `http://localhost:8327`). |

The site picks the local URL when running on `localhost` and the base URL
otherwise. The same logic also lives in `assets/api/config.js`.

> **Note:** A common mistake is a typo in the production URL — double-check the
> domain. You can verify the API is reachable by opening
> `https://YOUR-API-HOST/api/health` in a browser; it should return
> `{"status":"ok"}`. After changing `_config.yml`, rebuild and hard-refresh.

---

## Deployment

Pushing to the `main` branch triggers the GitHub Actions workflow in
`.github/workflows/jekyll.yml`, which builds the Jekyll site and publishes it to
GitHub Pages. No manual steps are needed.

---

## Security note

Do **not** commit secrets (passwords, API keys) to this repository. A `.env`
file is listed in `.gitignore` for that reason — keep real credentials out of
version control. If credentials were ever committed, rotate them and remove the
file from git history.

---

## Credits

Built for the Poway Woman's Club by student developers as part of an
Open Coding Society project-based learning course.

## License

Licensed under the MIT License. See [`LICENSE`](LICENSE).

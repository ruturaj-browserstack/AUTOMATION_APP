# Product Automation

WebdriverIO + Mocha regression suite for the sibling `product/` app. Runs locally against real Chrome or remotely against BrowserStack **preprod**.

## Setup

```bash
npm install
cp .env.example .env   # fill in BrowserStack credentials if needed
```

## Running the product app

In two terminals (from the `product/` repo):

```bash
# backend
cd ../product/backend && source venv/bin/activate && uvicorn main:app --port 8000

# frontend
cd ../product/frontend && npm run dev
```

## Local run (headless Chrome)

```bash
npm run test              # every spec
npm run test:smoke        # login + todos
npm run test:regression   # full suite
```

WebdriverIO v9 uses Selenium Manager, so Chrome + driver are fetched automatically.

## BrowserStack preprod run

Credentials come from `.env`:

```
BROWSERSTACK_USERNAME=your-preprod-username
BROWSERSTACK_ACCESS_KEY=your-preprod-access-key
BROWSERSTACK_HUB_HOST=hub-preprod.bsstag.com
BROWSERSTACK_HUB_PORT=443
BROWSERSTACK_HUB_PATH=/wd/hub
BROWSERSTACK_LOCAL=false
```

`.env` values **override** shell exports (dotenv is loaded with `override: true`) — this prevents a global `BROWSERSTACK_ACCESS_KEY` in `~/.zshrc` from shadowing the preprod key.

Then:

```bash
npm run test:bs             # full suite on preprod hub
npm run test:bs:smoke
npm run test:bs:regression
```

`wdio.browserstack.conf.js` points at the preprod hub (`https://hub-preprod.bsstag.com/wd/hub`) and uses the `@wdio/browserstack-service` with `bstack:options` for project / build / session names, matching the standard BrowserStack sample config.

### Preprod endpoint patch (automatic)

`@wdio/browserstack-service` hardcodes production URLs for the funnel / observability collector / upload / session-status / accessibility APIs. On preprod those endpoints return 401 (the production API doesn't know preprod keys) and the service prints noisy errors even when sessions pass.

The approach documented on Confluence "SDK Staging Setup" / "Nodejs-WDIO Automate" is to patch `node_modules/@wdio/browserstack-service/build/*.js` to swap the prod URLs for their preprod equivalents.

This repo automates that via `scripts/patch-bs-preprod.mjs`, wired to `postinstall`. It's idempotent, runs after every `npm install`, and rewrites (inside the bundled `build/index.js`):

| Prod | Preprod |
|---|---|
| `api.browserstack.com` | `api-preprod.bsstag.com` |
| `api-cloud.browserstack.com` | `api-cloud-preprod.bsstag.com` |
| `collector-observability.browserstack.com` | `collector-observability-preprod.bsstag.com` |
| `upload-observability.browserstack.com` | `upload-observability-preprod.bsstag.com` |
| `app-accessibility.browserstack.com` | `accessibility-preprod.bsstag.com` |
| `tcg.browserstack.com` | `tcg-preprod.bsstag.com` |
| `eds.browserstack.com` | `eds-preprod.bsstag.com` |

It also extends the service's `getCloudProvider` hostname check so `bsstag.com` hosts are recognised as BrowserStack (not "unknown cloud provider").

Re-apply manually any time with:

```bash
npm run patch:preprod
```

### BrowserStack Local (preprod)

The frontend runs on `localhost:5173`, so a tunnel is needed for the remote browser to reach it. The production `BrowserStackLocal` binary bundled with `@wdio/browserstack-service` **cannot authenticate a preprod access key** — and neither the "SDK Staging Setup", "SDK Dev and Staging Setup", nor "SDK-CLI Setup and Development" Confluence pages document a preprod BS Local binary or endpoint override. So `BROWSERSTACK_LOCAL` defaults to `false` here.

Two ways to run the full suite against preprod without BS Local:

1. **Expose `localhost` via a public tunnel** (ngrok / cloudflared / Tailscale Funnel), e.g.
   ```bash
   ngrok http 5173
   # then, in .env:
   BASE_URL=https://<your-ngrok-subdomain>.ngrok.io
   ```
2. **Deploy the frontend** somewhere the preprod browser can reach and point `BASE_URL` at the deployed URL.

If/when a preprod `BrowserStackLocal` binary is available (ask the SDK team), set:

```
BROWSERSTACK_LOCAL=true
BROWSERSTACK_LOCAL_BINARY_PATH=/absolute/path/to/preprod/BrowserStackLocal
```

…and add `localIdentifier` to `bstack:options` in `wdio.browserstack.conf.js`.

## Layout

```
test/
├── helpers/api.js          # REST helpers for test setup (reset state)
├── pageobjects/            # Page object wrappers for login / todos / counter
└── specs/                  # Mocha specs, one per feature

wdio.conf.js                # local Chrome
wdio.browserstack.conf.js   # BrowserStack preprod hub
```

## Features covered

- **Login** – invalid credentials, happy path, logout
- **Todos** – empty state, add (single + multi), toggle / un-toggle, delete, persistence across reload
- **Counter** – initial value, increment, decrement below zero, combined ops, reset

# Product Automation

WebdriverIO + Mocha regression suite for the sibling `product/` app.

## Setup

```bash
npm install
```

WebdriverIO v9 uses Selenium Manager internally, so Chrome + the matching driver are fetched automatically. Make sure Chrome is installed on the host.

## Running the product app

In two terminals (from the `product/` repo):

```bash
# backend
cd ../product/backend && source venv/bin/activate && uvicorn main:app --port 8000

# frontend
cd ../product/frontend && npm run dev
```

## Running tests

```bash
npm run test              # every spec
npm run test:smoke        # login + todos
npm run test:regression   # full suite
```

Point at a different environment:

```bash
BASE_URL=http://staging.example.com API_URL=http://staging.example.com npm test
```

## Layout

```
test/
├── helpers/api.js          # REST helpers for test setup (reset state)
├── pageobjects/            # Page object wrappers for login / todos / counter
└── specs/                  # Mocha specs, one per feature
```

## Features covered

- **Login** – invalid credentials, happy path, logout
- **Todos** – empty state, add (single + multi), toggle / un-toggle, delete, persistence across reload
- **Counter** – initial value, increment, decrement below zero, combined ops, reset

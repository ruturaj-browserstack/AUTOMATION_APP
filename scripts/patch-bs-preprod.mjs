#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const thisFile = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(thisFile), '..');
const target = path.join(root, 'node_modules', '@wdio', 'browserstack-service', 'build', 'index.js');

if (!fs.existsSync(target)) {
  console.log('[patch-bs-preprod] @wdio/browserstack-service not installed — skipping.');
  process.exit(0);
}

const src = fs.readFileSync(target, 'utf8');

const urlReplacements = [
  ['https://api-cloud.browserstack.com', 'https://api-cloud-preprod.bsstag.com'],
  ['https://api.browserstack.com', 'https://api-preprod.bsstag.com'],
  ['https://collector-observability.browserstack.com', 'https://collector-observability-preprod.bsstag.com'],
  ['https://upload-observability.browserstack.com', 'https://upload-observability-preprod.bsstag.com'],
  ['https://app-accessibility.browserstack.com', 'https://accessibility-preprod.bsstag.com'],
  ['https://tcg.browserstack.com', 'https://tcg-preprod.bsstag.com'],
  ['https://eds.browserstack.com', 'https://eds-preprod.bsstag.com'],
];

const codeReplacements = [
  [
    'instance.options.hostname.includes("browserstack")',
    '(instance.options.hostname.includes("browserstack") || instance.options.hostname.includes("bsstag"))',
  ],
  [
    'browser.options.hostname.includes("browserstack")',
    '(browser.options.hostname.includes("browserstack") || browser.options.hostname.includes("bsstag"))',
  ],
  [
    'return str === "browserstack.com" || str.endsWith(".browserstack.com");',
    'return str === "browserstack.com" || str.endsWith(".browserstack.com") || str === "bsstag.com" || str.endsWith(".bsstag.com");',
  ],
];

let out = src;
const applied = [];

for (const [from, to] of [...urlReplacements, ...codeReplacements]) {
  if (out.includes(from)) {
    out = out.split(from).join(to);
    applied.push(from);
  }
}

if (out === src) {
  console.log('[patch-bs-preprod] already patched (or strings absent) — no changes.');
  process.exit(0);
}

fs.writeFileSync(target, out);
console.log(`[patch-bs-preprod] patched ${target}`);
console.log(`[patch-bs-preprod] ${applied.length} string(s) rewritten to preprod endpoints`);

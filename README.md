# QA Automation Assignment — Playwright (JavaScript)

UI automation for the demoqa Book Store and API automation for reqres.in, written in Playwright + JavaScript (ES modules).

## Setup

```bash
npm install
cp .env.example .env   # fill in DEMOQA_USERNAME / DEMOQA_PASSWORD of the manually registered user
```

`REQRES_API_KEY`: a personal key from https://app.reqres.in (free, 250 requests/day). Without it reqres allows only 40 requests/day per IP.

## Run

```bash
npm test                 # UI + API
npm run test:ui          # demoqa Book Store (chromium project)
npm run test:api         # reqres.in Users API (reqres project)
npm run test:headed      # watch the UI test in a browser
npm run test:smoke       # @smoke only
npm run report           # open the HTML report
```

## What is covered

**UI — `BS-BookSearch-P-Test`**: open Book Store Application → log in → validate username and Logout button → Go To Book Store → search "Learning JavaScript Design Patterns" → validate the result → write Title, Author and Publisher to `output/book-details.txt` → log out. Each key step attaches a screenshot to the report.

**API — `RQ-UserCrud-P-Test`**: create a user via `POST /api/register` (200, userId and token validated, userId stored) → `GET /api/users/{userId}` and validate the id, email, name and avatar of the created user → `PUT /api/users/{userId}` to update the name (200, name/job validated). Every response is attached to the report as JSON with tokens redacted.

> **Why register:** reqres.in is a mock and does not persist users created with `POST /api/users`. `POST /api/register` returns the id of a user that does exist, so the created user can really be fetched and validated.

Snapshots of the HTML report are in `report-screenshots/`.

## Layout

```
tests/core-modules/book-store/ui/   UI specs: describe / test / test.step only
tests/core-modules/users/api/       API specs
helpers/book-store/pages/           page objects: locators at the top, actions + expect* below
helpers/users/api/                  reqres Users API client + expect* checks
helpers/common/                     third-party request blocker, step screenshots, JSON attachments
fixtures/baseTest.js                extended test with testLog and ad blocking
test-data/                          expected book data, user payloads
utils/                              env, logging, file utilities
```

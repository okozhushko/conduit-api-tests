# conduit-api-tests

Playwright tests for the [Conduit](https://conduit.bondaracademy.com) demo app: API tests against `https://conduit-api.bondaracademy.com/api` with JSON-schema response validation, plus a UI smoke test.

## Prerequisites

- Node.js 22
- A Conduit account for the `prod` environment

## Setup

```bash
npm ci
npx playwright install chromium   # only needed for UI tests
```

Create `.env` in the project root:

```
PROD_USERNAME=<email>
PROD_PASSWORD=<password>
```

## Running

| Command | What runs |
| --- | --- |
| `npm test` | All projects: `api-smoke-tests`, `api-testing`, `ui-tests` |
| `npm run test:smoke` | `tests/api-tests/smokeAPITest.spec.ts` only (what CI runs) |
| `npm run report` | Opens the last HTML report |

`api-testing` depends on `api-smoke-tests`, so the smoke tests always run first.

## Configuration

- `TEST_ENV` — `prod` (default, uses `PROD_USERNAME`/`PROD_PASSWORD`) or `qa` (built-in test account). See `api-test.config.ts`.
- Response schemas live in `response-schemas/<resource>/<METHOD>_<resource>_schema.json`.

## CI

`.github/workflows/playwright.yml` runs the smoke project on push and pull requests to `main`/`master`. Add `PROD_USERNAME` and `PROD_PASSWORD` as repository secrets.

## Known limitations

- Tests run against a shared public instance; article counts and tags change over time.
- Negative and UI tests are excluded from CI.

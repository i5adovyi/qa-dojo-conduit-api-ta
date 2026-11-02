# Conduit API test automation

A TypeScript and Playwright API test suite for the Conduit blogging platform, developed as the final project for the **QA Dojo API Test Automation course**. It exercises registration, login, profile updates, article CRUD and filtering, comments and favourites through HTTP requests. The expected responses follow the course implementation.

## Try two read-only tests

Install the suite from the repository root with Node.js 22 (22.13 or later) or Node.js 24+ and npm.

```sh
npm ci
```

Run the two anonymous checks against the course demo from PowerShell or Command Prompt.

```powershell
cmd /d /c "set CONDUIT_BASE_URL=https://conduit-api.learnwebdriverio.com/api/&&npm run test:read"
```

On macOS or Linux use the equivalent shell command.

```sh
CONDUIT_BASE_URL=https://conduit-api.learnwebdriverio.com/api/ npm run test:read
```

One test checks the shape and size of a paginated article list. The other requests a unique missing slug and expects HTTP 404. Both use anonymous GET requests. The API suite runs without installing a browser. Open the local HTML results with `npm run report`.

## Run the full suite

Copy `.env.example` to `.env.local` and set `CONDUIT_BASE_URL` to a compatible test instance where you can create data. An exported environment variable takes precedence. The default is `http://localhost:3000/api/`, and the backend must be running separately.

```sh
npm test
```

The full run registers temporary identities and changes data. The worker keeps its account token in memory. Each article fixture tracks the slugs it creates, including changes after a rename, and deletes its articles during teardown. Profile updates use a separate account. Registered accounts remain on the target because the course API has no account-deletion endpoint.

| Command | Purpose |
| --- | --- |
| `npm run lint` | Check TypeScript and Playwright coding rules |
| `npm run type-check` | Compile-check the suite |
| `npm test -- --list` | List cases without contacting the API |
| `npm test -- --grep @smoke` | Exercise a short set of write and read scenarios |
| `npm test -- --grep LWIO-023` | Run the missing-body update regression |

## What to inspect

- **Updates and permissions.** Single-field update tests keep the other values fixed, then fetch the article again. The ownership test attempts an update with a second account and checks that the original content survives. [Update tests](tests/api/article/put-article.spec.ts)
- **Search and schema.** The suite checks every returned match and also sends queries that must return no matches. An Ajv schema checks the detail response, including timestamps and author fields. [Read and filter tests](tests/api/article/get-article.spec.ts)
- **Favourites and comments.** The tests observe the stored favourite flag and count through a fresh GET. The comment deletion case verifies that the target ID exists before deletion and disappears afterwards. [Favourites](tests/api/favourite/favourites.spec.ts) · [Comments](tests/api/comments/comments.spec.ts)
- **Test setup.** Playwright fixtures manage identities and per-test articles. Small controllers wrap the HTTP calls, while the specs define the expected behavior. [Fixtures](tests/fixtures/fixtures.ts) · [Controllers](tests/utils/controllers)

In a live demo run on 2 November 2026, 31 of 40 tests passed. Seven cases exposed differences in article validation and two exposed unexpected results when filtering by author. The [coverage checklist](documentation/checklist.md#observed-on-the-course-demo) includes the expected and observed behavior for all nine.

## GitHub Actions

Pushes to `main` and pull requests run lint, TypeScript and test discovery. For a full integration run, configure the repository Actions variable `CONDUIT_BASE_URL` for an authorized test environment, then select **Actions → Conduit API checks → Run workflow**. The integration log lists case titles and pass/fail results. To inspect HTTP failures in detail, run the case locally. [Workflow](.github/workflows/conduit-checks.yml)

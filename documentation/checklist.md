# API test coverage

Case IDs come from the original QA Dojo course project. The expected results below target the course's Conduit implementation. Executable cases are grouped by spec. Run a single ID with `npx playwright test --grep LWIO-023`.

| Spec                                                           | Cases             | What the tests check                                                                                                                                                                                 |
| -------------------------------------------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Create articles](../tests/api/article/post-article.spec.ts)   | LWIO-003–007      | Create and retrieve an article. Distinguish an empty field from an omitted field. The course cases expect empty title, description, body and tag list to be accepted on creation.                    |
| [Create articles](../tests/api/article/post-article.spec.ts)   | LWIO-008–011      | Omitting title, description or body should return 422 with an error. An invalid token should return 401.                                                                                             |
| [Update articles](../tests/api/article/put-article.spec.ts)    | LWIO-013–017      | Update all editable fields, then change one field at a time in a full PUT payload. Read the resulting slug to verify persistence and unchanged values.                                               |
| [Update articles](../tests/api/article/put-article.spec.ts)    | LWIO-018–024      | Unknown slug returns 404. A different authenticated user receives 403. Empty or missing required fields return 422. An invalid token receives 401. Re-read the original article after denied access. |
| [Delete articles](../tests/api/article/delete-article.spec.ts) | LWIO-025, 027     | One test combines owner deletion (204), a read of the deleted slug (404) and a second deletion (404). A separate case checks that an invalid token receives 401 and the article stays readable.      |
| [Read articles](../tests/api/article/get-article.spec.ts)      | LWIO-028–030, 050 | Check the list shape and count, retrieve the seeded article by slug, handle a missing slug, and validate the detail response against its JSON Schema.                                                |
| [Filter articles](../tests/api/article/get-article.spec.ts)    | LWIO-032–034      | Match by author, tag and both together. Check every returned article and use queries with a deliberately nonmatching filter to catch ignored parameters.                                             |
| [Favourites](../tests/api/favourite/favourites.spec.ts)        | LWIO-035–036      | Add and remove a favourite, then read back the viewer-specific flag and count.                                                                                                                       |
| [Comments](../tests/api/comments/comments.spec.ts)             | LWIO-037–038      | Add a comment and find it in the article's comment list. Delete an existing comment and verify that its ID disappears.                                                                               |

## Observed on the course demo

On 2 November 2026, a full run against `conduit-api.learnwebdriverio.com/api/` finished with **31 passed and 9 failed** in 36.8 seconds, using one worker and zero retries. All registration, login, profile, comment and favourite cases passed. The following differences from the expected behavior accounted for every failure.

| Case | Request | Expected | Observed |
| --- | --- | --- | --- |
| LWIO-008 | Create without `title` | 422 | 500 |
| LWIO-009, LWIO-010 | Create without `description` or `body` | 422 for each | 200 for each |
| LWIO-020, LWIO-021 | Update with an empty `title` or `body` | 422 for each | 200 for each |
| LWIO-022, LWIO-023 | Update without `title` or `body` | 422 for each, per course checklist | 200 for each |
| LWIO-032 | Filter by a generated, nonexistent author | Empty list | Returned articles |
| LWIO-034 | Combine author and tag with a nonmatching filter | Empty list | Returned a matching-tag article for a nonexistent author |

For LWIO-008 the original test encoded the server's 500 response. The current assertion checks the 422 specified in the course checklist. These cases remain active so a later run can detect a change in the server.

## Additional coverage and open cases

The [authentication](../tests/api/auth/auth.spec.ts) and [profile](../tests/api/auth/user.spec.ts) specs cover account creation, login and profile updates. The course checklist also proposes deleting another user's comment (LWIO-039) and deleting a nonexistent comment (LWIO-040). These scenarios have no dedicated automated cases.

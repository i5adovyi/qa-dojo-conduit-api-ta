TEST CASES for Article:

ARTICLE CREATION
POSITIVE CASES:

- LWIO-003: Create article with all required fields
- LWIO-004: Create article with empty description 
- LWIO-005: Create article with empty tagList 
- LWIO-006: Create article with empty title
- LWIO-007: Create article with empty body

NEGATIVE CASES:
- LWIO-008: Missing title returns 422
- LWIO-009: Missing description returns 422
- LWIO-010: Missing body returns 422
- LWIO-011: Unauthorized user returns 401

ARTICLE UPDATE:
POSITIVE CASES:

- LWIO-013: Update article with all required fields
- LWIO-014: Update article title only
- LWIO-015: Update article description only
- LWIO-016: Update article body only
- LWIO-017: Update article tagList

NEGATIVE CASES:

- LWIO-018: Update non existing article returns 404
- LWIO-019: Update other user's article returns 403
- LWIO-020: Update with empty title returns 422
- LWIO-021: Update with empty body returns 422
- LWIO-022: Update with missing title returns 422
- LWIO-023: Update with missing body returns 422
- LWIO-024: Unauthorized user returns 401

DELETE ARTICLE:

- LWIO-025: Delete own article returns 204
- LWIO-027: Delete non-existent article returns 404

READ ARTICLE:

- LWIO-028: Get list of all articles returns 200
- LWIO-029: Get existing article returns 200
- LWIO-030: Non-existent article returns 404

SEARCH ARTICLE:

- LWIO-032: Filter articles by author
- LWIO-033: Filter articles by tag

# Implementation Plan: Sari-Sari Store Inventory Tracker

## Overview
Build a single-user local inventory tracker with a FastAPI/SQLite backend and a Vite React TypeScript frontend. Define the API contract first, then implement the backend, then the frontend, and verify end-to-end.

## Architecture Decisions
- Use stdlib `sqlite3` instead of SQLAlchemy to keep dependency surface small.
- Use Pydantic for request/response validation and FastAPI's built-in CORS.
- Use `PATCH /products/{id}` for partial product updates.
- Use `POST /products/{product_id}/transactions` as a sub-resource to record stock movement.
- Use snake_case in JSON to avoid Pydantic alias complexity; the frontend mirrors the same keys.

## Task List

### Phase 1: Project setup
- [ ] Task 1: Initialize git repo, `.gitignore`, and `feature/inventory` branch.
- [ ] Task 2: Create `backend/requirements.txt` and `frontend/package.json` baselines.

### Phase 2: Backend
- [ ] Task 3: Create SQLite schema and Pydantic models.
- [ ] Task 4: Implement product CRUD and low-stock endpoints.
- [ ] Task 5: Implement transaction endpoint and quantity update logic.
- [ ] Task 6: Write `test_api.py` and run it.

### Phase 3: Frontend
- [ ] Task 7: Scaffold Vite React TypeScript app.
- [ ] Task 8: Build API client and shared types.
- [ ] Task 9: Build product list, forms, and transaction UI.
- [ ] Task 10: Build low-stock dashboard and main layout.

### Phase 4: Verify and ship
- [ ] Task 11: Run both servers and verify CRUD, transactions, and low-stock warnings.
- [ ] Task 12: Make final atomic commits.

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Python packages not available | Low | pip install from `requirements.txt` |
| Port 8000/5173 in use | Low | Allow user to override in README |
| CORS misconfiguration | Low | Test with real browser |

## Open Questions
- Any objection to snake_case JSON and default price 0?

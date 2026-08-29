# Spec: Sari-Sari Store Inventory Tracker

## Objective
Build a minimal, single-user, browser-based inventory tracker for a small sari-sari store. It replaces manual stock tracking and warns when items run low. The system has no authentication, multi-user support, or deployment requirements.

## Tech Stack
- Backend: Python 3.12, FastAPI, `sqlite3` (stdlib), `uvicorn`
- Frontend: React 18, TypeScript, Vite
- Data exchange: JSON over HTTP; FastAPI CORS enabled for the Vite dev server

## Commands
- Install: `cd backend && pip install -r requirements.txt` and `cd frontend && npm install`
- Backend dev: `cd backend && python -m uvicorn main:app --reload --port 8000`
- Frontend dev: `cd frontend && npm run dev`
- Backend tests: `cd backend && python -m pytest`
- Manual check: open `http://localhost:5173` and verify product CRUD, transactions, and low-stock warnings

## Project Structure
```
backend/
  main.py           # FastAPI app and route handlers
  db.py             # sqlite3 schema, connection, and helpers
  models.py         # Pydantic request/response models
  test_api.py       # FastAPI TestClient sanity checks
frontend/
  src/
    types.ts        # Shared TypeScript types
    api.ts          # HTTP client using fetch
    App.tsx         # Main layout and routing
    components/
      ProductList.tsx
      ProductForm.tsx
      ProductCard.tsx
      TransactionForm.tsx
      Dashboard.tsx
  index.html
  package.json
  tsconfig.json
  vite.config.ts
spec.md
tasks/plan.md
tasks/todo.md
README.md
```

## Code Style
- Backend: functional modules; stdlib `sqlite3` with parameterized queries; Pydantic models for validation; no ORM; snake_case throughout.
- Frontend: functional React components; `async/await` for API calls; fetch; a single `App.css`; no external UI library.

## Testing Strategy
- One backend test file (`test_api.py`) using FastAPI `TestClient` to verify product CRUD, low-stock filtering, and stock transactions.
- Manual browser check for the frontend.
- No frontend test runner.

## Boundaries
- **Always do:** validate request bodies with Pydantic, use parameterized SQL, handle 404/422 cleanly, keep forms accessible (labels, required fields).
- **Ask first:** adding any dependency beyond `fastapi`, `uvicorn`, and the Vite template; changing the data model after implementation starts.
- **Never do:** commit secrets, add authentication, or use a remote database.

## Success Criteria
1. `GET /products` returns a paginated list of products with current stock.
2. `POST /products` creates a product with name, category, unit, price, quantity, and reorder_level.
3. `GET /products/{id}` and `PATCH /products/{id}` read and partially update a product.
4. `DELETE /products/{id}` removes a product.
5. `POST /products/{product_id}/transactions` records a stock-in or stock-out and updates the product quantity.
6. A stock-out that would make quantity negative returns 422.
7. `GET /products?low_stock=true` returns only products at or below `reorder_level`.
8. The React frontend at `http://localhost:5173` can perform all of the above without page reloads.
9. `backend/test_api.py` passes before the final commit.

## Open Questions
- Port assumptions: backend 8000, frontend 5173. (assumed yes)
- Price is optional and defaults to 0. (assumed yes)
- API responses use snake_case to match the Python backend. (assumed yes)

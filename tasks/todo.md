# Tasks

## Task 1: Init repo and branch
**Description:** Create a git repo, `.gitignore`, and the `feature/inventory` branch.
**Acceptance criteria:**
- [ ] `git status` shows a clean `feature/inventory` branch with no uncommitted files.
- [ ] `.gitignore` covers Python and Node artifacts.
**Verification:** `git branch --show-current` returns `feature/inventory`.
**Dependencies:** None
**Files likely touched:** `.gitignore`
**Estimated scope:** S

## Task 2: Backend dependencies and skeleton
**Description:** Create `backend/requirements.txt`, `backend/main.py`, `backend/db.py`, `backend/models.py` with a working FastAPI skeleton and SQLite connection.
**Acceptance criteria:**
- [ ] `pip install -r backend/requirements.txt` succeeds.
- [ ] `python -m uvicorn main:app` starts without errors.
**Verification:** Run `python -m uvicorn main:app --port 8000` and open the OpenAPI docs.
**Dependencies:** Task 1
**Files likely touched:** `backend/main.py`, `backend/db.py`, `backend/models.py`, `backend/requirements.txt`
**Estimated scope:** S

## Task 3: Product endpoints
**Description:** Implement product list, create, read, patch, delete, and low-stock filter.
**Acceptance criteria:**
- [ ] All endpoints return valid JSON and proper HTTP status codes.
- [ ] `GET /products?low_stock=true` only returns products at or below `reorder_level`.
**Verification:** `backend/test_api.py` passes for product tests.
**Dependencies:** Task 2
**Files likely touched:** `backend/main.py`, `backend/db.py`, `backend/models.py`
**Estimated scope:** M

## Task 4: Transaction endpoints
**Description:** Implement `POST /products/{product_id}/transactions` to record stock-in/stock-out and update product quantity.
**Acceptance criteria:**
- [ ] A stock-in increases quantity; a stock-out decreases quantity.
- [ ] A stock-out that would make quantity negative is rejected with 422.
- [ ] Transaction history is persisted.
**Verification:** `backend/test_api.py` passes for transaction tests.
**Dependencies:** Task 3
**Files likely touched:** `backend/main.py`, `backend/db.py`, `backend/models.py`
**Estimated scope:** M

## Task 5: Backend tests
**Description:** Add `backend/test_api.py` using FastAPI `TestClient`.
**Acceptance criteria:**
- [ ] Tests cover product CRUD, low-stock filter, and transactions.
- [ ] `python -m pytest` passes.
**Verification:** `python -m pytest` in `backend/`.
**Dependencies:** Task 4
**Files likely touched:** `backend/test_api.py`
**Estimated scope:** S

## Task 6: Scaffold frontend
**Description:** Create Vite React TypeScript app and install dependencies.
**Acceptance criteria:**
- [ ] `npm install` in `frontend/` succeeds.
- [ ] `npm run dev` starts the dev server on port 5173.
**Verification:** `npm run dev` runs without errors.
**Dependencies:** Task 1
**Files likely touched:** `frontend/` (many generated/template files)
**Estimated scope:** S

## Task 7: API client and types
**Description:** Create `frontend/src/types.ts` and `frontend/src/api.ts` to call the backend.
**Acceptance criteria:**
- [ ] All API calls compile and handle errors.
- [ ] Types match the backend Pydantic models.
**Verification:** `npm run build` in `frontend/` succeeds.
**Dependencies:** Task 6
**Files likely touched:** `frontend/src/types.ts`, `frontend/src/api.ts`
**Estimated scope:** S

## Task 8: Product UI
**Description:** Build product list, add/edit form, and delete action.
**Acceptance criteria:**
- [ ] User can add, edit, and delete products.
- [ ] List updates after each operation.
**Verification:** Manual browser check.
**Dependencies:** Task 7
**Files likely touched:** `frontend/src/App.tsx`, `frontend/src/components/ProductList.tsx`, `frontend/src/components/ProductForm.tsx`, etc.
**Estimated scope:** M

## Task 9: Transaction UI and dashboard
**Description:** Build transaction form per product and a low-stock dashboard.
**Acceptance criteria:**
- [ ] User can record stock-in and stock-out.
- [ ] Dashboard shows products at or below reorder level.
**Verification:** Manual browser check.
**Dependencies:** Task 8
**Files likely touched:** `frontend/src/components/TransactionForm.tsx`, `frontend/src/components/Dashboard.tsx`, `frontend/src/App.tsx`
**Estimated scope:** M

## Task 10: End-to-end verification and final commits
**Description:** Run both servers, verify the full flow, and make final atomic commits.
**Acceptance criteria:**
- [ ] Product CRUD, transactions, and low-stock warnings all work in the browser.
- [ ] `backend/test_api.py` passes.
- [ ] Each logical slice is committed with a short message.
**Verification:** `python -m pytest` and `npm run build` pass; manual browser check.
**Dependencies:** Tasks 5 and 9
**Files likely touched:** `README.md`, `frontend/src/App.tsx`
**Estimated scope:** M

from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

import db
import models


@asynccontextmanager
async def lifespan(app: FastAPI):
    db.init_db()
    yield


app = FastAPI(lifespan=lifespan, debug=False)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/products", response_model=models.PaginatedProducts)
def list_products(
    low_stock: bool = Query(False),
    page: int = Query(1, ge=1),
    page_size: int = Query(100, ge=1, le=1000),
):
    with db.get_db() as conn:
        where_clause = "WHERE quantity <= reorder_level" if low_stock else ""
        total = conn.execute(f"SELECT COUNT(*) FROM products {where_clause}").fetchone()[0]
        offset = (page - 1) * page_size
        rows = conn.execute(
            f"SELECT * FROM products {where_clause} ORDER BY updated_at DESC LIMIT ? OFFSET ?",
            (page_size, offset),
        ).fetchall()
        data = [models.ProductOut(**dict(row)) for row in rows]
        total_pages = max((total + page_size - 1) // page_size, 1)
        return {
            "data": data,
            "page": page,
            "page_size": page_size,
            "total": total,
            "total_pages": total_pages,
        }


@app.post("/products", response_model=models.ProductOut, status_code=201)
def create_product(product: models.ProductCreate):
    now = db.now()
    with db.get_db() as conn:
        cursor = conn.execute(
            "INSERT INTO products (name, category, unit, price, quantity, reorder_level, created_at, updated_at) "
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (
                product.name,
                product.category,
                product.unit,
                product.price,
                product.quantity,
                product.reorder_level,
                now,
                now,
            ),
        )
        product_id = cursor.lastrowid
        conn.commit()
        row = conn.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
    return models.ProductOut(**dict(row))


@app.get("/products/{product_id}", response_model=models.ProductOut)
def get_product(product_id: int):
    with db.get_db() as conn:
        row = conn.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Product not found")
    return models.ProductOut(**dict(row))


@app.patch("/products/{product_id}", response_model=models.ProductOut)
def update_product(product_id: int, product: models.ProductUpdate):
    with db.get_db() as conn:
        row = conn.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Product not found")

        fields = []
        values = []
        if product.name is not None:
            fields.append("name = ?")
            values.append(product.name)
        if product.category is not None:
            fields.append("category = ?")
            values.append(product.category)
        if product.unit is not None:
            fields.append("unit = ?")
            values.append(product.unit)
        if product.price is not None:
            fields.append("price = ?")
            values.append(product.price)
        if product.quantity is not None:
            fields.append("quantity = ?")
            values.append(product.quantity)
        if product.reorder_level is not None:
            fields.append("reorder_level = ?")
            values.append(product.reorder_level)

        if fields:
            set_clause = ", ".join(fields)
            now = db.now()
            values.extend([now, product_id])
            conn.execute(f"UPDATE products SET {set_clause}, updated_at = ? WHERE id = ?", values)
            conn.commit()

        row = conn.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
    return models.ProductOut(**dict(row))


@app.delete("/products/{product_id}", status_code=204)
def delete_product(product_id: int):
    with db.get_db() as conn:
        cursor = conn.execute("DELETE FROM products WHERE id = ?", (product_id,))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Product not found")
        conn.commit()
    return None


@app.post("/products/{product_id}/transactions", response_model=models.TransactionOut, status_code=201)
def create_transaction(product_id: int, transaction: models.TransactionCreate):
    with db.get_db() as conn:
        product = conn.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        if transaction.type == "IN":
            new_qty = product["quantity"] + transaction.quantity
        else:
            new_qty = product["quantity"] - transaction.quantity

        if new_qty < 0:
            raise HTTPException(status_code=422, detail="Stock-out would make quantity negative")

        now = db.now()
        conn.execute(
            "UPDATE products SET quantity = ?, updated_at = ? WHERE id = ?",
            (new_qty, now, product_id),
        )
        cursor = conn.execute(
            "INSERT INTO stock_transactions (product_id, type, quantity, note, created_at) VALUES (?, ?, ?, ?, ?)",
            (product_id, transaction.type, transaction.quantity, transaction.note, now),
        )
        transaction_id = cursor.lastrowid
        conn.commit()
        row = conn.execute("SELECT * FROM stock_transactions WHERE id = ?", (transaction_id,)).fetchone()
    return models.TransactionOut(**dict(row))

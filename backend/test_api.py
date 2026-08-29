import pytest
from fastapi.testclient import TestClient

import db


def reset_db():
    with db.get_db() as conn:
        conn.execute("DELETE FROM stock_transactions")
        conn.execute("DELETE FROM products")
        conn.execute("DELETE FROM sqlite_sequence WHERE name IN ('products', 'stock_transactions')")
        conn.commit()


@pytest.fixture
def client():
    from main import app

    db.init_db()
    reset_db()
    with TestClient(app) as client:
        yield client
    reset_db()


def test_create_product(client):
    res = client.post(
        "/products",
        json={
            "name": "Coke",
            "category": "Drinks",
            "unit": "bottle",
            "price": 15.0,
            "quantity": 10,
            "reorder_level": 3,
        },
    )
    assert res.status_code == 201
    data = res.json()
    assert data["name"] == "Coke"
    assert data["quantity"] == 10
    assert "id" in data


def test_list_products(client):
    client.post("/products", json={"name": "Coke", "quantity": 10, "reorder_level": 3})
    client.post("/products", json={"name": "Chips", "quantity": 5, "reorder_level": 2})
    res = client.get("/products")
    assert res.status_code == 200
    data = res.json()
    assert len(data["data"]) == 2
    assert data["total"] == 2


def test_low_stock(client):
    client.post("/products", json={"name": "Coke", "quantity": 10, "reorder_level": 3})
    client.post("/products", json={"name": "Chips", "quantity": 2, "reorder_level": 3})
    res = client.get("/products", params={"low_stock": "true"})
    assert res.status_code == 200
    data = res.json()
    assert len(data["data"]) == 1
    assert data["data"][0]["name"] == "Chips"


def test_get_product(client):
    res = client.post("/products", json={"name": "Coke", "quantity": 10, "reorder_level": 3})
    product_id = res.json()["id"]
    res = client.get(f"/products/{product_id}")
    assert res.status_code == 200
    assert res.json()["name"] == "Coke"


def test_get_product_not_found(client):
    res = client.get("/products/9999")
    assert res.status_code == 404
    assert res.json()["detail"] == "Product not found"


def test_update_product(client):
    res = client.post("/products", json={"name": "Coke", "quantity": 10, "reorder_level": 3})
    product_id = res.json()["id"]
    res = client.patch(f"/products/{product_id}", json={"quantity": 20})
    assert res.status_code == 200
    assert res.json()["quantity"] == 20


def test_delete_product(client):
    res = client.post("/products", json={"name": "Coke", "quantity": 10, "reorder_level": 3})
    product_id = res.json()["id"]
    res = client.delete(f"/products/{product_id}")
    assert res.status_code == 204
    res = client.get(f"/products/{product_id}")
    assert res.status_code == 404


def test_transaction_in(client):
    res = client.post("/products", json={"name": "Coke", "quantity": 10, "reorder_level": 3})
    product_id = res.json()["id"]
    res = client.post(f"/products/{product_id}/transactions", json={"type": "IN", "quantity": 5})
    assert res.status_code == 201
    product = client.get(f"/products/{product_id}").json()
    assert product["quantity"] == 15


def test_transaction_out(client):
    res = client.post("/products", json={"name": "Coke", "quantity": 10, "reorder_level": 3})
    product_id = res.json()["id"]
    res = client.post(f"/products/{product_id}/transactions", json={"type": "OUT", "quantity": 5})
    assert res.status_code == 201
    product = client.get(f"/products/{product_id}").json()
    assert product["quantity"] == 5


def test_transaction_out_negative(client):
    res = client.post("/products", json={"name": "Coke", "quantity": 2, "reorder_level": 3})
    product_id = res.json()["id"]
    res = client.post(f"/products/{product_id}/transactions", json={"type": "OUT", "quantity": 5})
    assert res.status_code == 422

import { PaginatedProducts, Product, ProductInput, TransactionInput } from './types';

const API_URL = 'http://localhost:8000';

export async function getProducts(lowStock = false): Promise<PaginatedProducts> {
  const res = await fetch(`${API_URL}/products?low_stock=${lowStock}`);
  if (!res.ok) throw new Error('Failed to load products');
  return res.json();
}

export async function createProduct(product: ProductInput): Promise<Product> {
  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error('Failed to create product');
  return res.json();
}

export async function updateProduct(id: number, product: ProductInput): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error('Failed to update product');
  return res.json();
}

export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete product');
}

export async function createTransaction(id: number, transaction: TransactionInput): Promise<void> {
  const res = await fetch(`${API_URL}/products/${id}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction),
  });
  if (!res.ok) throw new Error('Failed to record transaction');
}

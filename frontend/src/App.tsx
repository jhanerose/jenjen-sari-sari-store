import { useEffect, useState } from 'react';
import './App.css';
import { createProduct, createTransaction, deleteProduct, getProducts, updateProduct } from './api';
import { Product, ProductInput, TransactionInput } from './types';
import { Dashboard } from './components/Dashboard';
import { ProductForm } from './components/ProductForm';
import { ProductList } from './components/ProductList';
import { TransactionForm } from './components/TransactionForm';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [lowStock, setLowStock] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [transactionProduct, setTransactionProduct] = useState<Product | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [all, low] = await Promise.all([getProducts(false), getProducts(true)]);
      setProducts(all.data);
      setLowStock(low.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (input: ProductInput) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, input);
      } else {
        await createProduct(input);
      }
      setShowForm(false);
      setEditingProduct(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleTransaction = async (transaction: TransactionInput) => {
    if (!transactionProduct) return;
    try {
      await createTransaction(transactionProduct.id, transaction);
      setTransactionProduct(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Sari-Sari Store Inventory</h1>
        <button onClick={() => { setEditingProduct(null); setShowForm(true); }}>Add product</button>
      </header>

      {error && <div className="error" role="alert">{error}</div>}

      <Dashboard products={products} lowStock={lowStock} />

      {showForm && (
        <ProductForm
          initial={editingProduct}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingProduct(null); }}
        />
      )}

      {transactionProduct && (
        <TransactionForm
          productName={transactionProduct.name}
          onSave={handleTransaction}
          onCancel={() => setTransactionProduct(null)}
        />
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ProductList
          products={products}
          onEdit={(p) => { setEditingProduct(p); setShowForm(true); }}
          onDelete={handleDelete}
          onTransaction={setTransactionProduct}
        />
      )}
    </div>
  );
}

export default App;

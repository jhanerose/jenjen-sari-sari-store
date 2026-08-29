import { Product } from '../types';

interface DashboardProps {
  products: Product[];
  lowStock: Product[];
}

export function Dashboard({ products, lowStock }: DashboardProps) {
  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  return (
    <section className="dashboard" aria-labelledby="dashboard-title">
      <h2 id="dashboard-title">Dashboard</h2>
      <div className="stats">
        <div className="stat">
          <span className="stat-value">{products.length}</span>
          <span className="stat-label">Products</span>
        </div>
        <div className="stat">
          <span className="stat-value">{lowStock.length}</span>
          <span className="stat-label">Low stock</span>
        </div>
        <div className="stat">
          <span className="stat-value">₱{totalValue.toFixed(2)}</span>
          <span className="stat-label">Inventory value</span>
        </div>
      </div>
      {lowStock.length > 0 && (
        <div className="low-stock">
          <h3>Low stock items</h3>
          <ul>
            {lowStock.map((p) => (
              <li key={p.id}>{p.name} — {p.quantity} {p.unit || 'pcs'} left</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

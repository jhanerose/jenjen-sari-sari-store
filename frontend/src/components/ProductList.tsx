import { Product } from '../types';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onTransaction: (product: Product) => void;
}

export function ProductList({ products, onEdit, onDelete, onTransaction }: ProductListProps) {
  if (products.length === 0) {
    return <p className="empty">No products yet. Add one to get started.</p>;
  }

  return (
    <table className="product-table" role="table" aria-label="Products">
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Unit</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Reorder level</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id} className={p.quantity <= p.reorder_level ? 'low' : undefined}>
            <td>{p.name}</td>
            <td>{p.category ?? '-'}</td>
            <td>{p.unit ?? '-'}</td>
            <td>₱{p.price.toFixed(2)}</td>
            <td>{p.quantity}</td>
            <td>{p.reorder_level}</td>
            <td>
              <button onClick={() => onEdit(p)}>Edit</button>
              <button onClick={() => onTransaction(p)}>Stock</button>
              <button className="danger" onClick={() => onDelete(p.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

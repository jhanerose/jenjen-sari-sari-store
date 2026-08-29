import { useState } from 'react';
import { Product, ProductInput } from '../types';

interface ProductFormProps {
  initial?: Product | null;
  onSave: (product: ProductInput) => void;
  onCancel: () => void;
}

const empty: ProductInput = {
  name: '',
  category: '',
  unit: 'pcs',
  price: 0,
  quantity: 0,
  reorder_level: 0,
};

function toInput(product?: Product | null): ProductInput {
  if (!product) return { ...empty };
  return {
    name: product.name,
    category: product.category,
    unit: product.unit,
    price: product.price,
    quantity: product.quantity,
    reorder_level: product.reorder_level,
  };
}

export function ProductForm({ initial, onSave, onCancel }: ProductFormProps) {
  const [form, setForm] = useState<ProductInput>(toInput(initial));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const update = (field: keyof ProductInput, value: string | number | null) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>{initial ? 'Edit product' : 'Add product'}</h2>
      <label>
        Name
        <input
          name="name"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          required
        />
      </label>
      <label>
        Category
        <input
          name="category"
          value={form.category ?? ''}
          onChange={(e) => update('category', e.target.value || null)}
        />
      </label>
      <label>
        Unit
        <input
          name="unit"
          value={form.unit ?? 'pcs'}
          onChange={(e) => update('unit', e.target.value || null)}
        />
      </label>
      <label>
        Price
        <input
          name="price"
          type="number"
          min={0}
          step="0.01"
          value={form.price}
          onChange={(e) => update('price', Number(e.target.value))}
          required
        />
      </label>
      <label>
        Quantity
        <input
          name="quantity"
          type="number"
          min={0}
          value={form.quantity}
          onChange={(e) => update('quantity', Number(e.target.value))}
          required
        />
      </label>
      <label>
        Reorder level
        <input
          name="reorder_level"
          type="number"
          min={0}
          value={form.reorder_level}
          onChange={(e) => update('reorder_level', Number(e.target.value))}
          required
        />
      </label>
      <div className="form-actions">
        <button type="submit">Save</button>
        <button type="button" className="secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

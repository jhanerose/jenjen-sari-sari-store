import { useState } from 'react';
import { TransactionInput } from '../types';

interface TransactionFormProps {
  productName: string;
  onSave: (transaction: TransactionInput) => void;
  onCancel: () => void;
}

export function TransactionForm({ productName, onSave, onCancel }: TransactionFormProps) {
  const [type, setType] = useState<'IN' | 'OUT'>('IN');
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ type, quantity, note: note || null });
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Stock transaction: {productName}</h2>
      <label>
        Type
        <select
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value as 'IN' | 'OUT')}
        >
          <option value="IN">Stock in</option>
          <option value="OUT">Stock out</option>
        </select>
      </label>
      <label>
        Quantity
        <input
          name="quantity"
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
        />
      </label>
      <label>
        Note
        <input
          name="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>
      <div className="form-actions">
        <button type="submit">Record</button>
        <button type="button" className="secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

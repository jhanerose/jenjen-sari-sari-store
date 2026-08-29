export interface Product {
  id: number;
  name: string;
  category: string | null;
  unit: string | null;
  price: number;
  quantity: number;
  reorder_level: number;
  created_at: string;
  updated_at: string;
}

export interface ProductInput {
  name: string;
  category?: string | null;
  unit?: string | null;
  price: number;
  quantity: number;
  reorder_level: number;
}

export interface TransactionInput {
  type: 'IN' | 'OUT';
  quantity: number;
  note?: string | null;
}

export interface PaginatedProducts {
  data: Product[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

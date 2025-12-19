import axios from 'axios';

// Configuración de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Crear instancia de axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el API Key automáticamente
api.interceptors.request.use((config) => {
  const DEFAULT_API_KEY = 'mk_e8724f3186c5e7ce40f479b0420c14cfaf273cbaacb5c325';
  
  if (typeof window !== 'undefined') {
    const apiKey = localStorage.getItem('api_key') || DEFAULT_API_KEY;
    config.headers['X-API-Key'] = apiKey;
    console.log('🔑 Enviando API Key:', apiKey.substring(0, 10) + '...');
  } else {
    // En SSR, usar la clave por defecto
    config.headers['X-API-Key'] = DEFAULT_API_KEY;
  }
  return config;
});

// Tipos para los datos
export interface Product {
  id: number;
  store_id: number;
  category_id: number | null;
  name: string;
  sku: string;
  description: string | null;
  cost_price: number;
  price: number;
  variants: Array<{
    name: string;
    values: string[];
  }> | null;
  images: string[] | null;
  current_stock: number;
  min_stock_alert: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface Category {
  id: number;
  store_id: number;
  name: string;
  description: string | null;
  slug: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  store_id: number;
  customer_id: number;
  order_number: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  subtotal: number;
  delivery_cost: number;
  total: number;
  delivery_address: string | null;
  delivery_notes: string | null;
  payment_method: string | null;
  payment_status: 'pending' | 'paid' | 'refunded';
  created_at: string;
  updated_at: string;
  customer?: Customer;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  variant_info: string | null;
  quantity: number;
  unit_price: number;
  subtotal: number;
  product?: {
    id: number;
    name: string;
    sku: string;
  };
}

export interface Customer {
  id: number;
  store_id: number;
  telegram_id: string;
  name: string;
  phone: string | null;
  address: string | null;
  email: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// API Methods
export const productsApi = {
  getAll: () => api.get<{ products: Product[] }>('/api/products'),
  getOne: (id: number) => api.get<Product>(`/api/products/${id}`),
  create: (data: Partial<Product>) => api.post<{ productId: number }>('/api/products', data),
  update: (id: number, data: Partial<Product>) => api.put<{ message: string }>(`/api/products/${id}`, data),
  delete: (id: number) => api.delete<{ message: string }>(`/api/products/${id}`),
};

export const categoriesApi = {
  getAll: () => api.get<{ categories: Category[] }>('/api/categories'),
  getOne: (id: number) => api.get<{ category: Category }>(`/api/categories/${id}`),
  create: (data: Partial<Category>) => api.post<{ category: Category; message: string }>('/api/categories', data),
  update: (id: number, data: Partial<Category>) => api.put<{ category: Category; message: string }>(`/api/categories/${id}`, data),
  delete: (id: number) => api.delete<{ message: string }>(`/api/categories/${id}`),
};

export const ordersApi = {
  getAll: () => api.get<{ orders: Order[] }>('/api/orders'),
  getOne: (id: number) => api.get<Order>(`/api/orders/${id}`),
  create: (data: { customer_id: number; items: Array<{ product_id: number; quantity: number; variant_info?: string }> }) => 
    api.post<{ orderId: number }>('/api/orders', data),
  updateStatus: (id: number, status: string) => api.patch<{ message: string }>(`/api/orders/${id}/status`, { status }),
};

export const customersApi = {
  getAll: () => api.get<{ customers: Customer[] }>('/api/customers'),
  create: (data: Partial<Customer>) => api.post<{ customerId: number }>('/api/customers', data),
};

// API Pública (sin autenticación)
export const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface PublicStore {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface PublicCatalog {
  store: PublicStore;
  categories: Category[];
  products: Product[];
}

export interface PublicProduct {
  store: {
    name: string;
    slug: string;
  };
  product: Product;
}

export interface PublicCategoryProducts {
  store: {
    name: string;
    slug: string;
  };
  category: {
    id: number;
    name: string;
    slug: string;
    description?: string;
  };
  products: Product[];
}

export const catalogApi = {
  getCatalog: (slug: string) => publicApi.get<PublicCatalog>(`/api/public/catalog/${slug}`),
  getProduct: (slug: string, productId: number) => publicApi.get<PublicProduct>(`/api/public/catalog/${slug}/product/${productId}`),
  getProductsByCategory: (slug: string, categorySlug: string) => publicApi.get<PublicCategoryProducts>(`/api/public/catalog/${slug}/category/${categorySlug}`),
};

// Public signup
export const publicAuthApi = {
  signup: (data: { email: string; password: string; store_name: string; slug?: string }) =>
    publicApi.post('/api/public/signup', data),
};

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
  created_at?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  sale_price?: number;
  category_id?: string;
  category_name?: string;
  images: string[];
  stock: number;
  is_featured: boolean;
  is_active: boolean;
  rating?: number;
  reviews_count?: number;
  created_at?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  button_text?: string;
  button_link?: string;
  image_url: string;
  badge_text?: string;
  discount_text?: string;
  is_active: boolean;
  sort_order?: number;
}

export interface Coupon {
  id: string;
  code: string;
  discount_percent: number;
  min_spend: number;
  is_active: boolean;
}

export interface Customer {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  created_at?: string;
  total_orders?: number;
  last_order_date?: string;
}

export interface Address {
  id: string;
  customer_id: string;
  full_address: string;
  city: string;
  state: string;
  pincode: string;
  created_at?: string;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id?: string;
  product_name: string;
  product_image?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at?: string;
}

export type OrderStatus = 'New' | 'Contacted' | 'Confirmed' | 'Processing' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id?: string;
  order_number: string;
  customer_id?: string;
  shipping_address_id?: string;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  shipping_address: string;
  city?: string;
  state?: string;
  pincode?: string;
  postal_code?: string;
  total: number;
  subtotal: number;
  total_amount?: number;
  discount_amount?: number;
  shipping_fee?: number;
  notes?: string;
  payment_method?: string;
  status: OrderStatus;
  created_at?: string;
  order_items?: OrderItem[];
  customer?: Customer;
}

import { createClient } from '@supabase/supabase-js';

// Retrieve values securely with type-casting to support all build engines
const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || '';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Create the Supabase client gracefully
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// The SQL command for creating the table in Supabase's SQL Editor
export const SUPABASE_ORDERS_SQL = `-- أمر SQL لإنشاء الجدول المطلوب في كنسول Supabase SQL Editor:

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_name TEXT NOT NULL,
    item_name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    store_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- لا تنسى إلغاء تفعيل RLS (Row Level Security) على جدول orders لتجربة الإرسال السريع:
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
`;

export interface SupabaseOrderInsert {
  customer_name: string;
  item_name: string;
  price: number;
  store_id: string; // The store key/name
}

/**
 * Inserts a single order entry into Supabase.
 * Returns an object indicating success or fail context.
 */
export async function insertOrderToSupabase(data: SupabaseOrderInsert) {
  if (!supabase) {
    const errorMsg = 'قاعدة بيانات Supabase غير مهيأة بعد. يرجى توفير VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY في ملف .env أولاً.';
    console.warn(errorMsg);
    return { success: false, error: errorMsg };
  }

  try {
    console.log('جاري إرسال الطلب إلى Supabase...', data);
    const { data: insertedData, error } = await supabase
      .from('orders')
      .insert([
        {
          customer_name: data.customer_name,
          item_name: data.item_name,
          price: data.price,
          store_id: data.store_id,
        },
      ])
      .select();

    if (error) {
      console.error('فشل الإرسال إلى Supabase:', error);
      return { success: false, error: error.message };
    }

    console.log('تم الإدراج بنجاح بجدول orders في Supabase:', insertedData);
    return { success: true, data: insertedData };
  } catch (err: any) {
    console.error('خطأ غير متوقع أثناء إرسال البيانات:', err);
    return { success: false, error: err.message || 'خطأ غير مسمى' };
  }
}

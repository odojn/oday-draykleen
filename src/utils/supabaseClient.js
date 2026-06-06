import { createClient } from '@supabase/supabase-js';

// استرجاع معلومات الاتصال بقاعدة البيانات من متغيرات بيئة التطبيق (Vite Env Variables)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// التحقق من أن المفاتيح مهيأة ومكتوبة بشكل صحيح
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// أمر SQL لإنشاء الجدول المطلوب في كنسول Supabase SQL Editor
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

// إنشاء وإخراج عميل اتصال Supabase
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * دالة لإضافة طلب يدوي (Insert) إلى جدول orders في Supabase
 * @param {Object} orderData 
 * @param {string} orderData.customer_name اسم الزبون
 * @param {string} orderData.item_name اسم القطعة أو الأصناف
 * @param {number} orderData.price السعر الكلي للطلب
 * @param {string} orderData.store_id اسم أو معرّف المحل
 */
export async function insertOrderToSupabase(orderData) {
  if (!supabase) {
    console.error('مفاتيح الاتصال بـ Supabase غير صحيحة أو غير مهيأة.');
    return { success: false, error: 'Supabase parameters are missing.' };
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          customer_name: orderData.customer_name,
          item_name: orderData.item_name,
          price: orderData.price,
          store_id: orderData.store_id,
        }
      ])
      .select();

    if (error) {
      console.error('خطأ عند إضافة البيانات إلى Supabase:', error);
      return { success: false, error: error.message };
    }

    console.log('تمت إضافة الطلب بنجاح في Supabase:', data);
    return { success: true, data };
  } catch (error) {
    console.error('عطل غير متوقع في عملية الإضافة:', error);
    return { success: false, error: error.message };
  }
}

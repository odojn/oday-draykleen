/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Category {
  id: string;
  name: string;
}

export interface OrderItem {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  quantity: number;
  pricePerPiece: number;
  totalPrice: number;
}

export type OrderStatus = 'قيد العمل' | 'جاهز' | 'تم التسليم';

export interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  totalPrice: number;
  date: string; // ISO String
  status: OrderStatus;
}

export interface HistoricalRecord {
  id: string;
  orderId: string;
  customerName: string;
  totalPrice: number;
  itemsCount: number;
  date: string; // YYYY-MM-DD
  year: number;
  month: number; // 1-12
  day: number; // 1-31
  categories: string[]; // List of category names included
}

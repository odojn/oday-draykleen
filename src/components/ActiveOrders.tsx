/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  PlusCircle, Search, Filter, Trash2, Edit3, 
  CheckCircle2, Clock, Check, ChevronDown, ListFilter,
  ShoppingCart, Tag, Hash, DollarSign, X, CheckSquare, 
  MessageSquare, User
} from 'lucide-react';
import { Order, OrderItem, Category, OrderStatus } from '../types';

interface ActiveOrdersProps {
  orders: Order[];
  categories: Category[];
  onAddOrder: (order: Order) => void;
  onEditOrder: (orderId: string, updatedOrder: Order) => void;
  onDeleteOrder: (orderId: string) => void;
}

export default function ActiveOrders({
  orders,
  categories,
  onAddOrder,
  onEditOrder,
  onDeleteOrder,
}: ActiveOrdersProps) {
  // View states: 'list' | 'add' | 'edit'
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('الكل');
  const [filterStatus, setFilterStatus] = useState<'الكل' | OrderStatus>('الكل');

  // Order Form state (for creating or editing)
  const [customerName, setCustomerName] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('قيد العمل');

  // Temporary single item form state
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id || '');
  const [customItemName, setCustomItemName] = useState('');
  const [quantityInput, setQuantityInput] = useState<string>(''); // string so it can start blank
  const [priceInput, setPriceInput] = useState<string>('');       // string so it can start blank

  const [formError, setFormError] = useState('');
  const [itemError, setItemError] = useState('');

  // Delete Confirmation state
  const [showConfirmDeleteId, setShowConfirmDeleteId] = useState<string | null>(null);

  // Quick helper to fetch category name
  const getCategoryName = (id: string) => {
    return categories.find((c) => c.id === id)?.name || 'غير مصنف';
  };

  // Add Item to current Order Draft
  const handleAddItemToDraft = (e: React.FormEvent) => {
    e.preventDefault();
    setItemError('');

    if (!selectedCategoryId) {
      setItemError('الرجاء اختيار نوع الصنف');
      return;
    }
    if (!customItemName.trim()) {
      setItemError('الرجاء إدخال تسمية القطعة (مثلاً: سجادة كبيرة، قميص...)');
      return;
    }

    const qty = parseInt(quantityInput);
    if (!quantityInput || isNaN(qty) || qty <= 0) {
      setItemError('الرجاء إدخال عدد قطع صحيح أكبر من الصفر');
      return;
    }

    const price = parseFloat(priceInput);
    if (!priceInput || isNaN(price) || price < 0) {
      setItemError('الرجاء إدخال سعر قطعة صحيح رقمي');
      return;
    }

    const newItem: OrderItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      categoryId: selectedCategoryId,
      categoryName: getCategoryName(selectedCategoryId),
      name: customItemName.trim(),
      quantity: qty,
      pricePerPiece: price,
      totalPrice: qty * price,
    };

    setOrderItems([...orderItems, newItem]);
    
    // Clear item inputs for next item adding, keeping category selected
    setCustomItemName('');
    setQuantityInput('');
    setPriceInput('');
    setItemError('');
  };

  // Remove item from draft
  const handleRemoveItemFromDraft = (itemId: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== itemId));
  };

  // Save New Order / Edited Order
  const handleSaveOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!customerName.trim()) {
      setFormError('الرجاء كتابة اسم الزبون للمواصلة');
      return;
    }

    if (orderItems.length === 0) {
      setFormError('الرجاء إضافة صنف واحد على الأقل للطلبية');
      return;
    }

    const grandTotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);

    if (view === 'add') {
      const newOrder: Order = {
        id: 'ORDER-' + Date.now(),
        customerName: customerName.trim(),
        items: orderItems,
        totalPrice: grandTotal,
        date: new Date().toISOString(),
        status: 'قيد العمل',
      };
      onAddOrder(newOrder);
    } else if (view === 'edit' && editingOrderId) {
      const originalOrder = orders.find(o => o.id === editingOrderId);
      const updatedOrder: Order = {
        id: editingOrderId,
        customerName: customerName.trim(),
        items: orderItems,
        totalPrice: grandTotal,
        date: originalOrder ? originalOrder.date : new Date().toISOString(),
        status: orderStatus,
      };
      onEditOrder(editingOrderId, updatedOrder);
    }

    // Reset and return
    resetForm();
  };

  const resetForm = () => {
    setCustomerName('');
    setOrderItems([]);
    setEditingOrderId(null);
    setCustomItemName('');
    setQuantityInput('');
    setPriceInput('');
    setSelectedCategoryId(categories[0]?.id || '');
    setFormError('');
    setItemError('');
    setView('list');
  };

  const startAddView = () => {
    resetForm();
    setView('add');
    if (categories.length > 0) {
      setSelectedCategoryId(categories[0].id);
    }
  };

  const startEditView = (order: Order) => {
    setCustomerName(order.customerName);
    setOrderItems([...order.items]);
    setOrderStatus(order.status);
    setEditingOrderId(order.id);
    setFormError('');
    setItemError('');
    if (categories.length > 0) {
      setSelectedCategoryId(categories[0].id);
    }
    setView('edit');
  };

  const toggleOrderStatus = (orderId: string, currentStatus: OrderStatus) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    let nextStatus: OrderStatus = 'قيد العمل';
    if (currentStatus === 'قيد العمل') nextStatus = 'جاهز';
    else if (currentStatus === 'جاهز') nextStatus = 'تم التسليم';
    else if (currentStatus === 'تم التسليم') nextStatus = 'قيد العمل';

    onEditOrder(orderId, { ...order, status: nextStatus });
  };

  const setOrderStatusDirect = (orderId: string, targetStatus: OrderStatus) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    onEditOrder(orderId, { ...order, status: targetStatus });
  };

  // Filter calculations
  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = filterStatus === 'الكل' || o.status === filterStatus;
    
    const matchesCategory = filterCategory === 'الكل' || 
                            o.items.some((item) => item.categoryId === filterCategory);

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6" id="active-orders-view">
      
      {/* ADD OR EDIT MODE VIEW */}
      {(view === 'add' || view === 'edit') && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl transition-all duration-300" id="order-form-container">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-sky-500 animate-pulse" />
              <span>{view === 'add' ? 'تسجيل طلبية جديدة للزبون' : 'تعديل تفاصيل الطلبية'}</span>
            </h3>
            <button
              onClick={resetForm}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: Added items list & primary confirm */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100/80">
                  <span className="text-xs font-bold text-sky-600 block mb-2">البيانات الأساسية للزبون</span>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">اسم الزبون بالكامل: *</label>
                      <div className="relative">
                        <User className="absolute right-3 top-3.5 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="اكتب اسم الزبون هنا..."
                          className="w-full pr-10 pl-4 py-3 rounded-xl bg-slate-50 text-slate-800 border border-slate-200 focus:bg-white focus:border-sky-500 outline-none text-sm font-bold"
                          id="customer-name-field"
                        />
                      </div>
                    </div>

                    {view === 'edit' && (
                      <div>
                        <label className="text-xs font-bold text-slate-600 block mb-1">حالة الطلبية حالياً:</label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['قيد العمل', 'جاهز', 'تم التسليم'] as OrderStatus[]).map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => setOrderStatus(st)}
                              className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                                orderStatus === st
                                  ? 'bg-sky-600 text-white border-sky-600'
                                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
                  <div className="bg-slate-50 p-3 text-slate-700 font-bold text-xs flex justify-between items-center border-b border-slate-100">
                    <span>قائمة الطلبات الفرعية للزبون</span>
                    <span className="text-[10px] text-slate-400">الزبون يمكنه اختيار أكثر من صنف</span>
                  </div>

                  <div className="p-4 max-h-[250px] overflow-y-auto space-y-2">
                    {orderItems.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 space-y-2">
                        <ShoppingCart className="w-8 h-8 mx-auto text-slate-300" />
                        <p className="text-xs font-semibold">لا يوجد أي أصناف مضافة بالتعبئة أدناه بعد.</p>
                      </div>
                    ) : (
                      orderItems.map((item, index) => (
                        <div key={item.id} className="flex justify-between items-center bg-slate-50/70 p-3 rounded-xl border border-slate-100 text-sm">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="bg-sky-150 text-sky-800 px-2 py-0.5 rounded text-[10px] font-bold">
                                {item.categoryName}
                              </span>
                              <strong className="text-slate-800">{item.name}</strong>
                            </div>
                            <div className="text-xs text-slate-500">
                              العدد: <span className="font-bold text-slate-700 text-xs">{item.quantity}</span> × {item.pricePerPiece} شيكل للقطعة
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-800 text-sm">
                              {item.totalPrice.toLocaleString('en-US')} شيكل
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveItemFromDraft(item.id)}
                              className="p-1 hover:bg-rose-50 text-rose-500 hover:text-rose-600 rounded transition-all cursor-pointer"
                              title="حذف هذا الصنف المعين للأعلى"
                            >
                              <X className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Summary Footer bar for draft items */}
                  {orderItems.length > 0 && (
                    <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                      <span className="text-xs text-slate-400 font-bold">الاجمالي الكلي للزبون:</span>
                      <strong className="text-xl font-black text-sky-400">
                        {orderItems.reduce((sum, item) => sum + item.totalPrice, 0).toLocaleString('en-US')} شيكل
                      </strong>
                    </div>
                  )}
                </div>
              </div>

              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-500 text-xs font-bold rounded-xl flex items-center gap-2">
                  <X className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Master Save Order Button */}
              <button
                type="button"
                id="btn-confirm-save-order"
                onClick={handleSaveOrder}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-emerald-600/10 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckSquare className="w-5 h-5 text-white" />
                <span>{view === 'add' ? 'تأكيد وإضافة الطلب رسمياً' : 'تأكيد التعديلات الحالية'}</span>
              </button>

            </div>

            {/* RIGHT COLUMN: Fast add items tool */}
            <div className="lg:col-span-5 bg-slate-50/80 p-5 rounded-2xl border border-slate-100 space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                  <PlusCircle className="w-5 h-5 text-sky-500" />
                  <span>تعبئة صنف جديد للزبون</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  أضف صنف واحد أو أكثر، مثل كوي قميص ثم غسيل سجاد في نفس الطلبية.
                </p>
              </div>

              <form onSubmit={handleAddItemToDraft} className="space-y-4">
                {/* Select category service from step 3 list */}
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">نوع الصنف والخدمة: *</label>
                  <div className="relative">
                    <select
                      value={selectedCategoryId}
                      onChange={(e) => setSelectedCategoryId(e.target.value)}
                      className="w-full p-3 rounded-xl bg-white text-slate-800 border border-slate-200 outline-none text-xs font-semibold appearance-none pr-3 pl-8 text-right cursor-pointer"
                      id="draft-item-category"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Specific descriptive title */}
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">تسمية وتفاصيل القطعة: *</label>
                  <div className="relative">
                    <Tag className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={customItemName}
                      onChange={(e) => setCustomItemName(e.target.value)}
                      placeholder="مثال: سجاد حجم كبير، بدلة عريس، جاكيت جلد..."
                      className="w-full pr-9 pl-4 py-2.5 rounded-xl bg-white text-slate-800 border border-slate-200 focus:border-sky-500 outline-none text-xs font-bold"
                      id="draft-item-detail-name"
                    />
                  </div>
                </div>

                {/* Qty & Price pieces inputs, ensuring they are empty by default as requested */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">عدد القطع: *</label>
                    <div className="relative">
                      <Hash className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={quantityInput}
                        onChange={(e) => setQuantityInput(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="أدخل العدد رقمي"
                        className="w-full pr-9 pl-4 py-2.5 rounded-xl bg-white text-slate-850 border border-slate-200 focus:border-sky-500 outline-none text-xs font-bold"
                        id="draft-item-quantity"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">سعر القطعة الواحدة: *</label>
                    <div className="relative">
                      <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">شيكل</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={priceInput}
                        onChange={(e) => setPriceInput(e.target.value.replace(/[^0-9.]/g, ''))}
                        placeholder="أدحل السعر رقمي"
                        className="w-full pr-9 pl-4 py-2.5 rounded-xl bg-white text-slate-850 border border-slate-200 focus:border-sky-500 outline-none text-xs font-bold"
                        id="draft-item-price-piece"
                      />
                    </div>
                  </div>
                </div>

                {/* Sub total indicator */}
                {quantityInput && priceInput && !isNaN(parseInt(quantityInput)) && !isNaN(parseFloat(priceInput)) && (
                  <div className="bg-sky-50/60 p-2.5 rounded-xl border border-sky-100 text-center text-xs font-bold text-sky-700">
                    الإجمالي لهذا الصنف: {(parseInt(quantityInput) * parseFloat(priceInput)).toLocaleString('en-US')} شيكل
                  </div>
                )}

                {itemError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-100 text-rose-500 text-[11px] font-semibold rounded-xl flex items-center gap-1.5">
                    <X className="w-3.5 h-3.5 shrink-0" />
                    <span>{itemError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  id="btn-add-item-to-list"
                  className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <PlusCircle className="w-4 h-4 text-white" />
                  <span>إضافة وتنزيل الصنف للطلبية</span>
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* MASTER LISTING & FILTERS VIEW */}
      {view === 'list' && (
        <div className="space-y-6">
          
          {/* Header Action Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
            
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-black text-slate-800">إدارة الطلبيات النشطة:</span>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-extrabold shadow-inner">
                {orders.length} إجمالي
              </span>
              <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-extrabold">
                {orders.filter(o => o.status === 'قيد العمل').length} قيد العمل
              </span>
              <span className="px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-full text-xs font-extrabold">
                {orders.filter(o => o.status === 'جاهز').length} جاهزة
              </span>
            </div>

            <button
              id="btn-trigger-add-order"
              onClick={startAddView}
              className="py-3 px-6 bg-sky-600 hover:bg-sky-500 text-white font-black text-sm rounded-2xl shadow-lg shadow-sky-600/10 active:scale-95 transition-all cursor-pointer flex items-center gap-2 self-start md:self-auto"
            >
              <PlusCircle className="w-5 h-5 text-white" />
              <span>إضافة طلبية للزبون</span>
            </button>
          </div>

          {/* Quick Realtime Search & Categoric Filters bar */}
          <div className="bg-slate-100 p-4 rounded-3xl border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            {/* Input search query text */}
            <div className="md:col-span-4 relative">
              <Search className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث باسم الزبون أو الصنف..."
                className="w-full pr-9 pl-4 py-2 bg-white text-slate-800 placeholder-slate-400 text-xs font-medium rounded-xl border border-slate-250 outline-none focus:border-sky-500"
                id="order-search-input"
              />
            </div>

            {/* Filter by added Categories */}
            <div className="md:col-span-4 flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-500 shrink-0">الصنف:</span>
              <div className="relative flex-grow">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full p-2 bg-white text-slate-800 border border-slate-200 outline-none text-xs font-semibold appearance-none pr-3 pl-8 text-right cursor-pointer rounded-xl"
                >
                  <option value="الكل">الكل للأصناف</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Filter by Order status state */}
            <div className="md:col-span-4 flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-500 shrink-0">الحالة:</span>
              <div className="relative flex-grow">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="w-full p-2 bg-white text-slate-800 border border-slate-200 outline-none text-xs font-semibold appearance-none pr-3 pl-8 text-right cursor-pointer rounded-xl"
                >
                  <option value="الكل">كل حالات الطلبيات</option>
                  <option value="قيد العمل">قيد العمل</option>
                  <option value="جاهز">جاهزة للتسليم</option>
                  <option value="تم التسليم">تم تسليمها بنجاح</option>
                </select>
                <ChevronDown className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* Orders Listing Grid cards */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-250 text-slate-400 space-y-3">
              <ShoppingCart className="w-16 h-16 mx-auto text-slate-200" />
              <h3 className="text-lg font-bold text-slate-700">لا توجد طلبيات مطابقة للبحث</h3>
              <p className="text-xs max-w-sm mx-auto leading-relaxed">
                لم نجد أي طلب مسجل حالياً يطابق المسمى أو الصنف المختار. اضغط على أزرار الإضافة في الأعلى لبدء إدراج زبون جديد.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOrders.map((order) => {
                
                // Color badges depending on states
                const statusConfig = {
                  'قيد العمل': {
                    badge: 'bg-amber-50 text-amber-700 border-amber-200',
                    dot: 'bg-amber-500',
                    desc: 'قيد الإنجاز في المغسلة',
                    btnText: 'تحويل لـ جاهز'
                  },
                  'جاهز': {
                    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                    dot: 'bg-indigo-500',
                    desc: 'جاهزة وينتظر استلام الزبون',
                    btnText: 'تحويل لـ تم التسليم'
                  },
                  'تم التسليم': {
                    badge: 'bg-emerald-50 text-emerald-700 border-emerald-250',
                    dot: 'bg-emerald-500',
                    desc: 'تم التسوية والقبض والإنهاء',
                    btnText: 'إعادة تفعيل الطلب'
                  }
                }[order.status] || { badge: 'bg-slate-100', dot: 'bg-slate-500', desc: '', btnText: '' };

                const dateObj = new Date(order.date);
                const showDate = dateObj.toLocaleDateString('ar-EG', {
                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                });

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-sky-150 hover:shadow-xl hover:shadow-sky-500/5 transition-all duration-200 flex flex-col justify-between space-y-4"
                    id={`order-card-${order.id}`}
                  >
                    
                    {/* Upper Line Header */}
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <h4 className="font-extrabold text-base text-slate-850 flex items-center gap-1">
                          <User className="w-4.5 h-4.5 text-slate-400" />
                          <span>{order.customerName}</span>
                        </h4>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          <span>{showDate}</span>
                        </div>
                      </div>

                      {/* State Badge */}
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border flex items-center gap-1.5 ${statusConfig.badge}`}>
                        <span className={`w-2 h-2 rounded-full ${statusConfig.dot} animate-pulse`}></span>
                        <span>{order.status}</span>
                      </span>
                    </div>

                    {/* Middle Line Items overview details */}
                    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-500 mb-1">تفاصيل القطع المطلوبة:</div>
                      <div className="space-y-1">
                        {order.items.map((item, idX) => (
                          <div key={item.id || idX} className="flex justify-between text-xs text-slate-700">
                            <span className="font-medium">• {item.name} ({item.quantity} قطع)</span>
                            <span className="font-mono text-slate-500">{item.totalPrice} شيكل</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center border-t border-slate-200/60 pt-2 mt-2">
                        <span className="text-[11px] font-bold text-slate-500">الحساب الإجمالي:</span>
                        <strong className="text-sm font-black text-slate-800">
                          {order.totalPrice.toLocaleString('en-US')} شيكل
                        </strong>
                      </div>
                    </div>

                    {/* Delete Confirmation mini overlay popup drawer on trigger */}
                    {showConfirmDeleteId === order.id && (
                      <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl space-y-3">
                        <p className="font-bold">❌ هل أنت متأكد من رغبتك في حذف طلب {order.customerName} نهائياً؟ لا يمكن استرجاع الطلب بعد حذفه.</p>
                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteOrder(order.id);
                              setShowConfirmDeleteId(null);
                            }}
                            className="py-1 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded font-bold cursor-pointer"
                          >
                            نعم، حذف
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowConfirmDeleteId(null)}
                            className="py-1 px-3 bg-slate-200 hover:bg-slate-300 rounded text-slate-700 cursor-pointer"
                          >
                            تراجع
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Actions and progress bars footer controls */}
                    {showConfirmDeleteId !== order.id && (
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                        {/* Instant State transition switcher */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleOrderStatus(order.id, order.status)}
                            className="text-xs font-bold py-1.5 px-3 bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100 rounded-lg transition-all cursor-pointer"
                            title="التنقل السريع في الحالات"
                          >
                            {statusConfig.btnText}
                          </button>
                        </div>

                        {/* Edit & Delete Master Buttons */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => startEditView(order)}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
                            title="تعديل تفاصيل وأسماء الطلبية"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setShowConfirmDeleteId(order.id)}
                            className="p-2 hover:bg-rose-50 rounded-lg text-rose-500 hover:text-rose-600 transition-all cursor-pointer"
                            title="حذف الطلبية"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

    </div>
  );
}

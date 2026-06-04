/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CheckSquare, Square, Trash2, Bell, ShieldAlert,
  Info, Sparkles, CheckCircle, PackageOpen, HelpCircle
} from 'lucide-react';
import { Order } from '../types';

interface ReadyOrdersViewProps {
  orders: Order[];
  onDeleteOrder: (orderId: string) => void;
  onClearBulkOrders: (orderIds: string[]) => void;
}

export default function ReadyOrdersView({
  orders,
  onDeleteOrder,
  onClearBulkOrders,
}: ReadyOrdersViewProps) {
  
  // Filter only ready orders
  const readyOrders = orders.filter((o) => o.status === 'جاهز');

  // Multi selection stats
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showConfirmSingleId, setShowConfirmSingleId] = useState<string | null>(null);
  const [showConfirmBulk, setShowConfirmBulk] = useState(false);

  // Toggle selection for single item
  const handleToggleSelect = (orderId: string) => {
    if (selectedIds.includes(orderId)) {
      setSelectedIds(selectedIds.filter((id) => id !== orderId));
    } else {
      setSelectedIds([...selectedIds, orderId]);
    }
  };

  // Select all or deselect all
  const handleToggleSelectAll = () => {
    if (selectedIds.length === readyOrders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(readyOrders.map((o) => o.id));
    }
  };

  const handleApplyBulkDelete = () => {
    if (selectedIds.length === 0) return;
    onClearBulkOrders(selectedIds);
    setSelectedIds([]);
    setShowConfirmBulk(false);
  };

  return (
    <div className="space-y-6" id="ready-orders-view">
      
      {/* Informative Security/Safety Alert banner explaining that deletion is safe for finances */}
      <div className="bg-blue-50 border border-blue-100 p-5 rounded-3xl flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-black text-slate-800">ملاحظة أمان وتصفية ذكية للأعمال</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            عند حذف الطلبيات الجاهزة من هذا القسم لتصفية ملفاتك وتسهيل العمل للشهر القادم، <strong className="text-emerald-700 font-extrabold">فإن الحسابات الإجمالية للطلبات وأرباح الزبائن والأرصدة الشهرية تظل محفوظة ومؤرشفة في قاعدة بيانات التحليلات للأبد!</strong> لن تفقدهم أبداً في الإحصاء الشامل بل ستنظف المحل فقط من العمليات القديمة لرفع الفعالية.
          </p>
        </div>
      </div>

      {/* Main Ready orders control bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-black text-slate-800 flex items-center gap-1.5">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <span>عرض الطلبيات الجاهزة للتسليم ({readyOrders.length})</span>
          </h3>
          <p className="text-xs text-slate-400">فقط الطلبيات التي تمتلك الحالة "جاهزة للتسليم" تظهر هنا لتسريع دورة القبض والتنظيف.</p>
        </div>

        {readyOrders.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleToggleSelectAll}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-250 transition-all cursor-pointer"
            >
              {selectedIds.length === readyOrders.length ? 'إلغاء تحديد الكل' : 'تحديد الكل'}
            </button>
            
            <button
              onClick={() => {
                if (selectedIds.length > 0) {
                  setShowConfirmBulk(true);
                }
              }}
              disabled={selectedIds.length === 0}
              className={`py-2.5 px-4 rounded-xl font-bold text-xs text-white transition-all flex items-center gap-1.5 ${
                selectedIds.length > 0
                  ? 'bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-200 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'
              }`}
            >
              <Trash2 className="w-4 h-4 text-white" />
              <span>حذف الجاهزة المحددة ({selectedIds.length})</span>
            </button>
          </div>
        )}
      </div>

      {/* Bulk Delete Confirm Alert Overlay */}
      {showConfirmBulk && (
        <div className="bg-slate-900 text-white p-6 rounded-3xl border-2 border-rose-500 shadow-2xl space-y-4 animate-pulse-slow">
          <div className="flex items-center gap-3 text-rose-400">
            <ShieldAlert className="w-8 h-8" />
            <h4 className="text-lg font-black">تحذير الحذف المجمع المتزامن!</h4>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            أنت بصدد حذف <strong className="text-rose-400 font-black">{selectedIds.length}</strong> طلبيات جاهزة وممتازة كلياً دفعة واحدة. 
            المبيعات المالية والأرباح المحققة منها ستظل مسجلة في الإحصائيات الشهرية للأبد، لكن سيتم مسح تفاصيل هذه الطلبات من قوائم الفحص الفعلي.
          </p>
          <div className="flex gap-4 justify-end pt-2">
            <button
              onClick={handleApplyBulkDelete}
              className="py-2 px-5 bg-rose-600 hover:bg-rose-500 rounded-xl text-xs font-bold text-white transition-all cursor-pointer"
            >
              صادق، نفذ خيار الحذف الآن
            </button>
            <button
              onClick={() => setShowConfirmBulk(false)}
              className="py-2 px-5 bg-slate-750 text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-700 transition-all cursor-pointer"
            >
              تراجع وإلغاء
            </button>
          </div>
        </div>
      )}

      {/* Selected Items Grid List */}
      {readyOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 text-slate-400 space-y-4">
          <PackageOpen className="w-16 h-16 mx-auto text-slate-200" />
          <h3 className="text-lg font-bold text-slate-700">لا توجد طلبيات جاهزة حالياً</h3>
          <p className="text-xs max-w-sm mx-auto leading-relaxed">
            عند قيامك بتحويل أحد طلبات كوي أو غسيل الملابس أو السجاد قيد العمل إلى حالة "جاهز للتسليم" من لوحة التحكم، سوف تظهر مدرجة بصناديقها وتفاصيلها الفردية فوراً في هذه الصفحة.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {readyOrders.map((o) => {
            const isSelected = selectedIds.includes(o.id);
            const showDate = new Date(o.date).toLocaleDateString('ar-EG', {
              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
            });

            return (
              <div
                key={o.id}
                className={`bg-white rounded-3xl p-5 border transition-all duration-200 flex flex-col justify-between space-y-4 ${
                  isSelected ? 'border-sky-500 bg-sky-50/10' : 'border-slate-200 hover:border-slate-350'
                }`}
              >
                
                {/* Header info */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-start gap-2.5">
                    
                    {/* Multiselect Checkbox box */}
                    <button
                      onClick={() => handleToggleSelect(o.id)}
                      className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 transition-all cursor-pointer mt-0.5"
                      title="تحديد الطلبية"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-sky-600" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300" />
                      )}
                    </button>

                    <div>
                      <h4 className="font-extrabold text-slate-850 text-base">{o.customerName}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">تاريخ التسجيل: {showDate}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-250 rounded text-[10px] font-black">
                    جــاهـز
                  </span>
                </div>

                {/* Items and sum */}
                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-1 text-xs">
                  <div className="font-bold text-slate-500 mb-1">بيانات الخدمة المنجزة بالكامل:</div>
                  {o.items.map((it) => (
                    <div key={it.id} className="flex justify-between py-0.5 text-slate-700">
                      <span>• {it.name} ({it.quantity} قطع) - {it.categoryName}</span>
                      <span className="font-mono text-slate-500 font-semibold">{it.totalPrice} شيكل</span>
                    </div>
                  ))}

                  <div className="flex justify-between items-center border-t border-slate-200 pt-2 mt-2 font-bold select-none text-slate-800">
                    <span>الحساب المطلوب كلياً:</span>
                    <strong className="text-emerald-700 text-sm font-black">{o.totalPrice.toLocaleString('en-US')} شيكل</strong>
                  </div>
                </div>

                {/* Confirmation mini view for single delete */}
                {showConfirmSingleId === o.id ? (
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-2xl space-y-3">
                    <p className="text-xs font-bold leading-normal">
                      ❌ هل أنت متأكد من رغبتك في حذف طلبية الزبون {o.customerName}؟ سيظل إجماليها المالي محفوظاً في الإحصائيات المؤرشفة والتحليلات.
                    </p>
                    <div className="flex gap-2 justify-end text-right">
                      <button
                        onClick={() => {
                          onDeleteOrder(o.id);
                          setShowConfirmSingleId(null);
                        }}
                        className="py-1 px-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded text-xs cursor-pointer"
                      >
                        تأكيد حذف الطلبية
                      </button>
                      <button
                        onClick={() => setShowConfirmSingleId(null)}
                        className="py-1 px-3 bg-slate-200 text-slate-700 rounded text-xs cursor-pointer"
                      >
                        إلغاء التراجع
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold italic flex items-center gap-0.5">
                      <Sparkles className="w-3 h-3 text-emerald-500" />
                      <span>جاهز للتسليم الآن</span>
                    </span>

                    <button
                      onClick={() => setShowConfirmSingleId(o.id)}
                      className="py-1 px-3 hover:bg-rose-50 text-rose-500 hover:text-rose-600 text-[11px] font-bold rounded-lg border border-transparent hover:border-rose-200 transition-all cursor-pointer flex items-center gap-1"
                      title="حذف هذا الطلب الفردي الجاهز"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف الطلب المعين</span>
                    </button>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

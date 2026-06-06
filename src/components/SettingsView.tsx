/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Settings, Trash2, Edit3, PlusCircle, AlertTriangle, 
  FileText, ArrowDownToLine, RefreshCw, Sparkles, Check, X,
  Database, ExternalLink, Copy, Terminal, Server
} from 'lucide-react';
import { Category, Order, HistoricalRecord } from '../types';
import { downloadMonthlyReport } from '../utils/invoiceGenerator';
import { isSupabaseConfigured, SUPABASE_ORDERS_SQL } from '../utils/supabaseClient';

interface SettingsViewProps {
  shopName: string;
  categories: Category[];
  orders: Order[];
  history: HistoricalRecord[];
  onAddCategory: (name: string) => void;
  onEditCategory: (id: string, newName: string) => void;
  onDeleteCategory: (id: string) => void;
  onClearAllData: () => void;
  onUpdateShopName: (name: string) => void;
}

export default function SettingsView({
  shopName,
  categories,
  orders,
  history,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onClearAllData,
  onUpdateShopName,
}: SettingsViewProps) {
  
  // Category CRUD states inside settings
  const [newCatName, setNewCatName] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');
  const [catError, setCatError] = useState('');

  // Shop rename state
  const [storeNameInput, setStoreNameInput] = useState(shopName);
  const [showRenameSuccess, setShowRenameSuccess] = useState(false);

  // Supabase state
  const [copiedSQL, setCopiedSQL] = useState(false);

  // HTML Export Selection states
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());

  // Reset confirmation state
  const [showFactoryResetConfirm, setShowFactoryResetConfirm] = useState(false);

  // Month Names in Arabic for the selector
  const monthNames = [
    { value: 1, label: 'يناير / كانون الثاني' },
    { value: 2, label: 'فبراير / شباط' },
    { value: 3, label: 'مارس / آذار' },
    { value: 4, label: 'أبريل / نيسان' },
    { value: 5, label: 'مايو / أيار' },
    { value: 6, label: 'يونيو / حزيران' },
    { value: 7, label: 'يوليو / تموز' },
    { value: 8, label: 'أغسطس / آب' },
    { value: 9, label: 'سبتمبر / أيلول' },
    { value: 10, label: 'أكتوبر / تشرين الأول' },
    { value: 11, label: 'نوفمبر / تشرين الثاني' },
    { value: 12, label: 'ديسمبر / كانون الأول' },
  ];

  const handleAddNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setCatError('');
    if (!newCatName.trim()) {
      setCatError('الرجاء كتابة اسم الصنف أولاً');
      return;
    }
    if (categories.some(c => c.name.toLowerCase() === newCatName.trim().toLowerCase())) {
      setCatError('هذا الصنف مضاف بالفعل مسبقاً!');
      return;
    }
    onAddCategory(newCatName.trim());
    setNewCatName('');
  };

  const handleSaveEditCategory = (id: string) => {
    setCatError('');
    if (!editingCatName.trim()) {
      setCatError('الرجاء كتابة اسم الصنف');
      return;
    }
    if (categories.some(c => c.id !== id && c.name.toLowerCase() === editingCatName.trim().toLowerCase())) {
      setCatError('هذا الصنف مضاف مسبقاً باسم آخر!');
      return;
    }
    onEditCategory(id, editingCatName.trim());
    setEditingCatId(null);
    setEditingCatName('');
  };

  const handleSaveShopNameUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeNameInput.trim()) return;
    onUpdateShopName(storeNameInput.trim());
    setShowRenameSuccess(true);
    setTimeout(() => {
      setShowRenameSuccess(false);
    }, 3000);
  };

  const handleExportHTML = () => {
    downloadMonthlyReport(shopName, orders, history, selectedMonth, selectedYear);
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SUPABASE_ORDERS_SQL);
    setCopiedSQL(true);
    setTimeout(() => {
      setCopiedSQL(false);
    }, 3000);
  };

  return (
    <div className="space-y-8" id="settings-view-wrapper">
      
      {/* 1. SHOP NAME UPDATE SECTION */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h4 className="font-extrabold text-base text-slate-800 flex items-center gap-1.5 border-b border-slate-150 pb-3">
          <Settings className="w-5 h-5 text-blue-600" />
          <span>تحديث اسم النشاط التجاري للدراي كلين</span>
        </h4>

        <form onSubmit={handleSaveShopNameUpdate} className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-grow space-y-2 w-full">
            <label className="text-xs font-bold text-slate-500 block">الاسم الحالي المسجل في لوحة التحكم:</label>
            <input
              type="text"
              value={storeNameInput}
              onChange={(e) => setStoreNameInput(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 text-slate-850 font-bold border border-slate-200 outline-none focus:border-blue-500 focus:bg-white text-sm"
              id="settings-shop-rename-input"
            />
          </div>
          <button
            type="submit"
            id="btn-settings-update-shopname"
            className="w-full sm:w-auto py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all shrink-0 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4 text-white" />
            <span>تحديث المسمى</span>
          </button>
        </form>

        {showRenameSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-1.5 animate-bounce">
            <Check className="w-4 h-4 shrink-0" />
            <span>تم تعديل وحفظ اسم الدراي كلين بنجاح!</span>
          </div>
        )}
      </div>

      {/* SUPABASE INTEGRATION SECTION */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-150 pb-4">
          <div className="space-y-1">
            <h4 className="font-extrabold text-base text-slate-800 flex items-center gap-1.5 animate-pulse-slow">
              <Database className="w-5 h-5 text-emerald-600" />
              <span>ربط ومزامنة قاعدة بيانات Supabase</span>
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              تتيح لك هذه الميزة تسجيل وحفظ طلبات الزبائن مباشرة بجدول خارجي آمن في السحابة فور الضغط على تأكيد وحفظ الطلبية تلقائياً.
            </p>
          </div>
          <div>
            {isSupabaseConfigured ? (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-750 text-xs font-black px-3.5 py-1.5 rounded-full border border-emerald-250">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>متصل وقابل للمزامنة</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-750 text-xs font-black px-3.5 py-1.5 rounded-full border border-amber-250">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>غير متصل (بانتظار التهيئة)</span>
              </span>
            )}
          </div>
        </div>

        {/* Configuration Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          {/* Instructions Column */}
          <div className="space-y-4">
            <h5 className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-blue-500" />
              <span>خطوات التشغيل السريع:</span>
            </h5>
            <ol className="text-xs text-slate-600 space-y-2.5 list-decimal list-inside pr-1 leading-relaxed">
              <li>قم بإنشاء مشروع جديد على منصة <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-bold inline-flex items-center gap-0.5">Supabase <ExternalLink className="w-3 h-3 text-blue-500" /></a>.</li>
              <li>انقر على زر <strong>نسخ كود إنشاء الجدول</strong> على اليسار، ثم افتح <strong>SQL Editor</strong> في لوحة Supabase والصق الأمر لتأسيس جدول <code className="bg-slate-100 px-1 py-0.5 rounded text-rose-600 font-bold font-mono">orders</code> بالمدخلات المطلوبة.</li>
              <li>ضع الإعدادات الخاصة بمشروعك (Project URL) ومفتاح المرور العام (Anon API Key) داخل ملف البيئة <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono">.env</code> للتطبيق بالصيغ الموضحة كالتالي:
                <pre className="mt-2 bg-slate-900 text-slate-150 p-2.5 rounded-xl font-mono text-[10px] text-left leading-normal overflow-auto select-all" dir="ltr">
                  VITE_SUPABASE_URL=your_project_url{"\n"}
                  VITE_SUPABASE_ANON_KEY=your_anon_key
                </pre>
              </li>
              <li>فور كتابة وحفظ المتغيرات، سيتم تفعيل الاتصال تلقائياً وستظهر شارة <strong className="text-emerald-700">"متصل"</strong> بالأعلى. الحفظ والاتصال محلياً مبرمج ليعمل بموثوقية حتى لو لم يتم الربط.</li>
            </ol>
          </div>

          {/* SQL Editor Code Copy Column */}
          <div className="space-y-3 bg-slate-50 p-4.5 rounded-2xl border border-slate-150">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-emerald-650" />
                <span>أمر إنشاء جدول orders في Supabase:</span>
              </span>
              <button
                type="button"
                onClick={handleCopySQL}
                className="py-1.5 px-3 bg-blue-600 hover:bg-blue-550 text-white font-bold text-[11px] rounded-lg transition-all flex items-center gap-1 cursor-pointer active:scale-95"
              >
                {copiedSQL ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>تم النسخ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-white" />
                    <span>نسخ أمر SQL</span>
                  </>
                )}
              </button>
            </div>
            
            <pre className="bg-slate-900 text-slate-200 text-[10px] p-3 rounded-xl font-mono text-left block leading-relaxed overflow-x-auto h-[150px] border border-slate-800" dir="ltr">
              {SUPABASE_ORDERS_SQL}
            </pre>
            <p className="text-[10px] text-slate-400 leading-normal text-right">
              💡 يتضمن هذا الجدول حقل <code className="font-mono text-slate-500">customer_name</code> واسم الأصناف المشتراة <code className="font-mono text-slate-500">item_name</code> وسعر الطلب <code className="font-mono text-slate-500">price</code> ومعرّف المحل <code className="font-mono text-slate-500">store_id</code> بشكل مؤتمت بالكامل.
            </p>
          </div>
        </div>
      </div>

      {/* 2. EXPORT MONTHLY REPORT HTML AS REQUIRED */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div>
          <h4 className="font-extrabold text-base text-slate-800 flex items-center gap-1.5 border-b border-slate-150 pb-3">
            <FileText className="w-5 h-5 text-emerald-600" />
            <span>نظام توليد وتصدير تقرير الفاتورة الشهري HTML</span>
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            اختر الشهر والسنة لتقوم بتوليد وتصدير ملف تقرير تفاعلي أنيق وفخم يمكنك طباعته أو حفظه كـ PDF يتضمن أرقام مبيعات المحل.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end bg-slate-50 p-4 rounded-2xl border border-slate-150">
          
          {/* Select Month */}
          <div className="sm:col-span-5 space-y-2">
            <label className="text-xs font-bold text-slate-650 block">اختر الشهر المستهدف:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="w-full p-2.5 bg-white text-slate-800 border border-slate-200 outline-none text-xs font-bold rounded-xl cursor-not-allowed pr-3 pl-8 text-right cursor-pointer"
            >
              {monthNames.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Select Year */}
          <div className="sm:col-span-4 space-y-2">
            <label className="text-xs font-bold text-slate-650 block">السنة:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full p-2.5 bg-white text-slate-800 border border-slate-200 outline-none text-xs font-bold rounded-xl pr-3 pl-8 text-right cursor-pointer"
            >
              {[2024, 2025, 2026, 2027, 2028].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Export CTA Action */}
          <div className="sm:col-span-3">
            <button
              onClick={handleExportHTML}
              id="btn-settings-export-html"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/10 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowDownToLine className="w-4 h-4 text-white" />
              <span>استخراج الفاتورة HTML</span>
            </button>
          </div>

        </div>
      </div>

      {/* 3. CATEGORIES CRITICAL LIVE CRUDS */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div>
          <h4 className="font-extrabold text-base text-slate-800 flex items-center gap-1.5 border-b border-slate-150 pb-3">
            <PlusCircle className="w-5 h-5 text-blue-600" />
            <span>إدارة وتعديل أصناف غسيل ودراي كلين المحل كليَّاً</span>
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            إضافة أو حذف أو تعديل الأصناف والخدمات في أي وقت. سوف تظهر تغييراتك فوراً في الحقول وتصاميم الطلبيات.
          </p>
        </div>

        {/* Categories form */}
        <form onSubmit={handleAddNewCategory} className="flex gap-2 items-center">
          <input
            type="text"
            value={newCatName}
            onChange={(e) => {
              setNewCatName(e.target.value);
              setCatError('');
            }}
            placeholder="مثال: غسيل برادي، دراي كلين فساتين..."
            className="flex-grow p-3 rounded-xl bg-slate-50 text-slate-850 border border-slate-200 text-right outline-none focus:border-blue-500 focus:bg-white text-xs font-semibold"
            id="settings-add-cat-name"
          />
          <button
            type="submit"
            id="btn-settings-add-cat"
            className="py-3 px-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إضافة صنف</span>
          </button>
        </form>

        {catError && (
          <div className="p-2.5 bg-rose-50 border border-rose-100 text-rose-500 text-[11px] font-bold rounded-lg flex items-center gap-1.5">
            <X className="w-3.5 h-3.5 shrink-0" />
            <span>{catError}</span>
          </div>
        )}

        {/* Existing categories layout */}
        <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100">
          <div className="bg-slate-50 p-3 text-xs font-extrabold text-slate-650">الأصناف المسجلة الحالية ونوافذ تعديلها:</div>
          
          <div className="p-1 max-h-[300px] overflow-y-auto">
            {categories.map((c) => {
              const isEditing = editingCatId === c.id;
              return (
                <div key={c.id} className="flex justify-between items-center py-2 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-all">
                  {isEditing ? (
                    <div className="flex gap-2 items-center w-full">
                      <input
                        type="text"
                        value={editingCatName}
                        onChange={(e) => setEditingCatName(e.target.value)}
                        className="flex-grow p-1.5 rounded bg-white text-slate-800 border border-slate-350 outline-none text-right text-xs"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEditCategory(c.id)}
                        className="p-1.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCatId(null);
                          setEditingCatName('');
                        }}
                        className="p-1.5 bg-slate-400 text-white rounded cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span>✨ {c.name}</span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCatId(c.id);
                            setEditingCatName(c.name);
                          }}
                          className="p-1.5 hover:bg-slate-150 rounded text-amber-500 hover:text-amber-600 transition-all cursor-pointer"
                          title="تعديل هذا الصنف"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteCategory(c.id)}
                          className="p-1.5 hover:bg-rose-50 rounded text-rose-500 hover:text-rose-600 transition-all cursor-pointer"
                          title="حذف هذا الصنف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. CLEAR SYSTEM DATA SECURE RESET WITH DENSE ARABIC WARNING */}
      <div className="bg-rose-50 rounded-3xl p-6 border border-rose-150 space-y-4">
        <div>
          <h4 className="font-extrabold text-base text-rose-800 flex items-center gap-1.5 border-b border-rose-200 pb-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 animate-bounce" />
            <span>تصفير النظام وإفراغ الذاكرة كلياً</span>
          </h4>
          <p className="text-xs text-rose-700">
            تحذير أمان: هذا التبويب يسمح لك ببدأ المصادقة وحذف كافة محتويات وقاعدة بيانات ODE دراي كلين (بما في ذلك أسماء الزبائن، والطلبيات القديمة، وأرشيف المبيعات التراكمي)، وإرجاع التطبيق لوضع التهيئة الأولى.
          </p>
        </div>

        {showFactoryResetConfirm ? (
          <div className="p-4 bg-orange-100 border border-orange-200 rounded-2xl space-y-4 shadow-sm animate-pulse-slow">
            <p className="text-xs font-bold text-orange-900 leading-relaxed">
              ⚠️ هل أنت متأكد بنسبة 100٪ من رغبتك في تصفير كل شيء؟ هذا الخيار يمسح كل سجلات الأرباح، والزبائن، والأصناف، والطلبيات الحالية ولا يمكن استردادها لاحقاً مطلقاً!
            </p>
            <div className="flex gap-2 justify-end text-right">
              <button
                type="button"
                onClick={() => {
                  onClearAllData();
                  setShowFactoryResetConfirm(false);
                }}
                className="py-2 px-5 bg-orange-650 hover:bg-orange-600 text-white rounded-xl text-xs font-black cursor-pointer shadow-md"
              >
                نعم، احذف كل البيانات الآن ونظّف الذاكرة
              </button>
              <button
                type="button"
                onClick={() => setShowFactoryResetConfirm(false)}
                className="py-2 px-4 bg-slate-700 hover:bg-slate-600 text-slate-100 text-xs font-semibold rounded-xl cursor-pointer"
              >
                تراجع، اترك ملفاتي بسلام
              </button>
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={() => setShowFactoryResetConfirm(true)}
              id="btn-settings-factory-reset-trigger"
              className="py-3 px-6 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-rose-200 hover:shadow-rose-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-white animate-spin-slow" />
              <span>فرمتة وحذف جميع بيانات النظام كلياً</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Store, ListCheck, ShoppingBag, TrendingUp, Users, Info, Settings,
  Menu, X, Sparkles, LogOut, CheckCircle2, ChevronLeft, ChevronRight,
  ShieldCheck, AlertCircle
} from 'lucide-react';

// Import Types
import { Category, Order, HistoricalRecord, OrderStatus } from './types';

// Import Screen Components
import WelcomeScreen from './components/WelcomeScreen';
import InfoScreen from './components/InfoScreen';
import CategoriesStep from './components/CategoriesStep';
import ShopSetupStep from './components/ShopSetupStep';
import ActiveOrders from './components/ActiveOrders';
import AnalyticsView from './components/AnalyticsView';
import CustomerAnalyticsView from './components/CustomerAnalyticsView';
import ReadyOrdersView from './components/ReadyOrdersView';
import AboutUsView from './components/AboutUsView';
import SettingsView from './components/SettingsView';

export default function App() {
  // --- Persistent Storage Setup ---
  const [onboardingStep, setOnboardingStep] = useState<number>(() => {
    const saved = localStorage.getItem('ode_onboarding_step');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [shopName, setShopName] = useState<string>(() => {
    return localStorage.getItem('ode_shop_name') || '';
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('ode_categories');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('ode_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState<HistoricalRecord[]>(() => {
    const saved = localStorage.getItem('ode_historical_log');
    return saved ? JSON.parse(saved) : [];
  });

  // Active Tab/View in Dashboard
  const [activeTab, setActiveTab] = useState<string>(() => {
    return localStorage.getItem('ode_active_tab') || 'home';
  });

  // Mobile navigation tray toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Synchronizers to write values to LocalStorage
  useEffect(() => {
    localStorage.setItem('ode_onboarding_step', onboardingStep.toString());
  }, [onboardingStep]);

  useEffect(() => {
    localStorage.setItem('ode_shop_name', shopName);
  }, [shopName]);

  useEffect(() => {
    localStorage.setItem('ode_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('ode_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('ode_historical_log', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('ode_active_tab', activeTab);
  }, [activeTab]);

  // --- Core State Mutators ---

  // Category mutations
  const handleAddCategory = (name: string) => {
    const newCat: Category = {
      id: 'CAT-' + Date.now().toString(),
      name,
    };
    setCategories((prev) => [...prev, newCat]);
  };

  const handleEditCategory = (id: string, newName: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: newName } : c))
    );
    // Also update matching category names in all active orders & items
    setOrders((prevOrders) =>
      prevOrders.map((o) => ({
        ...o,
        items: o.items.map((item) =>
          item.categoryId === id ? { ...item, categoryName: newName } : item
        ),
      }))
    );
  };

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // Order additions & revisions
  const handleAddOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);

    // Create & append corresponding historical analytics record
    const d = new Date(newOrder.date);
    const newHistRecord: HistoricalRecord = {
      id: 'HIST-' + newOrder.id,
      orderId: newOrder.id,
      customerName: newOrder.customerName,
      totalPrice: newOrder.totalPrice,
      itemsCount: newOrder.items.reduce((sum, item) => sum + item.quantity, 0),
      date: d.toISOString().split('T')[0],
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
      categories: newOrder.items.map((it) => it.categoryName),
    };

    setHistory((prev) => [newHistRecord, ...prev]);
  };

  const handleEditOrder = (orderId: string, updatedOrder: Order) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? updatedOrder : o))
    );

    // Update corresponding history record
    const d = new Date(updatedOrder.date);
    const updatedHist: HistoricalRecord = {
      id: 'HIST-' + updatedOrder.id,
      orderId: updatedOrder.id,
      customerName: updatedOrder.customerName,
      totalPrice: updatedOrder.totalPrice,
      itemsCount: updatedOrder.items.reduce((sum, item) => sum + item.quantity, 0),
      date: d.toISOString().split('T')[0],
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
      categories: updatedOrder.items.map((it) => it.categoryName),
    };

    setHistory((prev) =>
      prev.map((h) => (h.orderId === orderId ? updatedHist : h))
    );
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    // NOTE: We DO NOT delete historical log here to preserve statistics forever as requested!
  };

  // Clear bulk designated orders
  const handleClearBulkOrders = (orderIds: string[]) => {
    setOrders((prev) => prev.filter((o) => !orderIds.includes(o.id)));
    // Historical stats are left fully intact in the database forever!
  };

  // Wipe entire memory back to pristine state
  const handleClearAllData = () => {
    localStorage.clear();
    setShopName('');
    setCategories([]);
    setOrders([]);
    setHistory([]);
    setActiveTab('home');
    setOnboardingStep(1);
  };

  const handleUpdateShopName = (name: string) => {
    setShopName(name);
  };

  // --- Step Navigation Helpers ---
  const handleWelcomeNext = () => setOnboardingStep(2);
  const handleInfoNext = () => setOnboardingStep(3);
  const handleCategoriesNext = () => setOnboardingStep(4);
  const handleShopSetupBack = () => setOnboardingStep(3);
  const handleShopSetupFinished = () => setOnboardingStep(5); // Enter dashboard

  // Render correct onboarding screen based on current step status
  if (onboardingStep === 1) {
    return <WelcomeScreen onNext={handleWelcomeNext} />;
  }
  if (onboardingStep === 2) {
    return <InfoScreen onNext={handleInfoNext} />;
  }
  if (onboardingStep === 3) {
    return (
      <CategoriesStep
        categories={categories}
        onAddCategory={handleAddCategory}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
        onNext={handleCategoriesNext}
      />
    );
  }
  if (onboardingStep === 4) {
    return (
      <ShopSetupStep
        initialShopName={shopName}
        onSaveShopName={handleUpdateShopName}
        onBack={handleShopSetupBack}
        onNext={handleShopSetupFinished}
      />
    );
  }

  // --- STEP 5: MAIN DASHBOARD AREA ---
  const sidebarItems = [
    { id: 'home', label: 'الرئيسية والإحصاء', icon: Store },
    { id: 'orders', label: 'إضافة وإدارة الطلبات', icon: ListCheck },
    { id: 'ready', label: 'الطلبات الجاهزة', icon: CheckCircle2 },
    { id: 'profits', label: 'تحليل الأرباح والخزانة', icon: TrendingUp },
    { id: 'customers', label: 'تحليل واكتشاف الزبائن', icon: Users },
    { id: 'about', label: 'معلومات المطور عنا', icon: Info },
    { id: 'settings', label: 'لوحة التحكم والضبط', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative" id="dashboard-app-frame">
      
      {/* MOBILE DESKTOP FLOATING HEADER BAR */}
      <header className="md:hidden bg-blue-900 text-white p-4 flex justify-between items-center z-35 border-b border-blue-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-600 rounded-lg">
            <Store className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-sm tracking-wide">
            {shopName || 'نظام ODE دراي كلين'}
          </span>
        </div>
        
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-blue-800 rounded-lg text-white cursor-pointer active:scale-95"
          title="افتتاح القائمة"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* LATERAL DRAWER/SIDEBAR PANEL */}
      <aside 
        className={`fixed md:sticky top-0 right-0 h-screen w-64 bg-white border-l border-slate-200 text-slate-800 flex flex-col justify-between p-6 transition-transform duration-300 z-40 md:transform-none ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
        id="app-sidebar-navigator"
      >
        <div className="space-y-8">
          
          {/* Sidebar Header Brand block with Sparkle indicators */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md">
                <Store className="w-6 h-6" />
              </div>
              <div className="text-right">
                <h2 className="text-base font-black text-blue-950 truncate max-w-36">
                  {shopName}
                </h2>
                <span className="text-[10px] text-blue-600 font-bold block uppercase tracking-wider">
                  نظام ODE الذكي
                </span>
              </div>
            </div>
            
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 hover:bg-slate-100 rounded text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links and Menu items */}
          <nav className="space-y-1.5">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-3 text-right cursor-pointer ${
                    isActive 
                      ? 'bg-blue-600 text-white font-extrabold shadow-lg shadow-blue-200' 
                      : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
                  }`}
                  id={`tab-btn-${item.id}`}
                >
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

        </div>

        {/* Footer Signature on the bottom side of pane */}
        <div className="pt-4 border-t border-slate-105 space-y-3">
          <div className="text-[10px] text-slate-500 font-semibold leading-relaxed">
            <p>الهوية: نظام ODE دراي كلين</p>
            <p>الإصدار: v1.0.0 (مستقر)</p>
          </div>

          <button
            onClick={() => {
              if (confirm('هل ترغب في العودة لشاشة الترحيب السابقة لغرض التكوين؟')) {
                setOnboardingStep(1);
              }
            }}
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500 hover:text-blue-600 transition-all cursor-pointer flex items-center justify-center gap-1 border border-slate-200"
          >
            <LogOut className="w-3 h-3" />
            <span>تهيئة النظام من جديد</span>
          </button>
        </div>

      </aside>

      {/* DASHBOARD CORE CONTENT VIEW AREA */}
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto" id="app-dashboard-main-content">
        
        {/* TOP STATUS GLIMPSE BANNER HEADER */}
        <header className="hidden md:flex justify-between items-center py-5 px-8 bg-white border-b border-slate-150 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs bg-sky-50 text-sky-700 border border-sky-200 py-1 px-3 rounded-full font-bold">
              لوحة التحكم والمبيعات النشطة
            </span>
            <span className="text-slate-400 font-semibold text-xs">•</span>
            <span className="text-xs text-slate-500 font-medium font-mono">
              التوقيت اليومي: {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>

          {/* Connected badge */}
          <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 text-[10px] font-extrabold animate-pulse">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span>قاعدة البيانات نشطة ومؤرشفة</span>
          </div>
        </header>

        {/* INNER RENDER WRAPPER */}
        <div className="p-6 md:p-8 space-y-6 flex-grow">
          
          {/* TAB 1: الصفحة الرئيسية (Dashboard Home Simple Analytics) */}
          {activeTab === 'home' && (
            <div className="space-y-6" id="dashboard-home-tab">
              {/* Simple metrics summary row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Metric 1 */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500">إجمالي الأرباح المكتسبة للأبد</span>
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="space-y-1">
                    <strong className="text-3xl font-black text-slate-850">
                      {history.reduce((sum, h) => sum + h.totalPrice, 0).toLocaleString('en-US')} شيكل
                    </strong>
                    <span className="text-[10px] text-slate-400 block font-semibold">محفوظة ومأرشفة ضمن الإحصائيات لجميع الأوقات</span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500">طلبيات تحت الإنجاز حالياً</span>
                    <ShoppingBag className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="space-y-1">
                    <strong className="text-3xl font-black text-amber-600">
                      {orders.filter((o) => o.status === 'قيد العمل').length} طلبية
                    </strong>
                    <span className="text-[10px] text-slate-400 block">طلبيات نشطة وغسيل قيد العمل حالياً بالمغسلة</span>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500">الطلبيات الجاهزة للتسليم</span>
                    <CheckCircle2 className="w-5 h-5 text-sky-500" />
                  </div>
                  <div className="space-y-1">
                    <strong className="text-3xl font-black text-sky-600">
                      {orders.filter((o) => o.status === 'جاهز').length} طلبية
                    </strong>
                    <span className="text-[10px] text-slate-400 block">جاهزة للتوصيل والقبض المالي الفوري</span>
                  </div>
                </div>

              </div>

              {/* Quick Actions and guides */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-linear-to-br from-white to-slate-50 p-6 rounded-3xl border border-slate-200">
                
                <div className="lg:col-span-8 space-y-4 text-right">
                  <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full inline-block">دليل البداية السريعة</span>
                  <h3 className="text-lg font-black text-slate-800">أهلاً بك في وحدة التحكم والمراقبة الخاصة بـ {shopName}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                    هنا يمكنك متابعة طلبيات الكوي والغسيل لزبائن المحل. عند قدوم زبون، اضغط على <strong>"إضافة وإدارة الطلبات"</strong> في القائمة وأدخل اسمه وحدد أصناف ملابسه أو سجاده، وسيعمل النظام تلقائياً على مراقبة الحالة وحساب الإيرادات.
                  </p>
                  
                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="py-2.5 px-6 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      تسجيل طلب جديد للزبون
                    </button>
                    <button
                      onClick={() => setActiveTab('profits')}
                      className="py-2.5 px-6 bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      مراجعة تحليل الخزينة والأرباح
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-slate-900 text-white p-5 rounded-2xl flex flex-col justify-between border border-slate-850">
                  <div className="space-y-1">
                    <span className="text-[10px] text-sky-400 font-bold tracking-widest block uppercase">الفاتورة هذا الشهر</span>
                    <h4 className="text-sm font-extrabold">التقرير المالي السريع</h4>
                  </div>
                  
                  <div className="py-4 border-y border-slate-800 my-4 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">إجمالي طلبات الشهر:</span>
                      <strong className="text-white">
                        {history.filter(h => h.year === new Date().getFullYear() && h.month === (new Date().getMonth() + 1)).length} طلبيات
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">مجموع إيرادات الشهر:</span>
                      <strong className="text-emerald-400 font-bold">
                        {history.filter(h => h.year === new Date().getFullYear() && h.month === (new Date().getMonth() + 1)).reduce((sum, r) => sum + r.totalPrice, 0)} شيكل
                      </strong>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className="text-[11px] font-bold text-sky-300 hover:text-white transition-colors cursor-pointer"
                  >
                    استخراج فاتورة التقرير الشهري HTML &larr;
                  </button>
                </div>

              </div>
              
              {/* Active list overview in Dashboard */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h4 className="font-extrabold text-base text-slate-850">آخر 5 طلبيات مسجلة قيد العمل</h4>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-sky-600 hover:text-sky-500 font-bold"
                  >
                    عرض كل الطلبات بقوائمها &larr;
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    لم يتم تسجيل أي طلبات قيد العمل حالياً.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {orders.slice(0, 5).map((o) => (
                      <div key={o.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs hover:bg-slate-100/50 transition-all">
                        <div className="flex items-center gap-3">
                          <span className={`w-2.5 h-2.5 rounded-full ${o.status === 'قيد العمل' ? 'bg-amber-400' : 'bg-indigo-500'}`}></span>
                          <div>
                            <strong className="text-slate-800 text-sm">{o.customerName}</strong>
                            <p className="text-[10px] text-slate-400 mt-0.5">عدد القطع: {o.items.length} أصناف فرعية</p>
                          </div>
                        </div>

                        <div className="text-left">
                          <span className="font-extrabold text-slate-800 text-sm block">{o.totalPrice} شيكل</span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase">{o.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: قائمة وتحديث الطلبات (Active Orders) */}
          {activeTab === 'orders' && (
            <ActiveOrders
              orders={orders}
              categories={categories}
              onAddOrder={handleAddOrder}
              onEditOrder={handleEditOrder}
              onDeleteOrder={handleDeleteOrder}
            />
          )}

          {/* TAB 3: الطلبيات والبيانات الجاهزة (Ready Orders) */}
          {activeTab === 'ready' && (
            <ReadyOrdersView
              orders={orders}
              onDeleteOrder={handleDeleteOrder}
              onClearBulkOrders={handleClearBulkOrders}
            />
          )}

          {/* TAB 4: تحليل الأرباح المفصل (Profit Analytics) */}
          {activeTab === 'profits' && (
            <AnalyticsView
              orders={orders}
              history={history}
            />
          )}

          {/* TAB 5: تحليل الزبائن (Customer Analytics) */}
          {activeTab === 'customers' && (
            <CustomerAnalyticsView
              history={history}
            />
          )}

          {/* TAB 6: معلومات عنا والمطور (About Developer) */}
          {activeTab === 'about' && (
            <AboutUsView />
          )}

          {/* TAB 7: الإعدادات والضبط (Settings and Config) */}
          {activeTab === 'settings' && (
            <SettingsView
              shopName={shopName}
              categories={categories}
              orders={orders}
              history={history}
              onAddCategory={handleAddCategory}
              onEditCategory={handleEditCategory}
              onDeleteCategory={handleDeleteCategory}
              onClearAllData={handleClearAllData}
              onUpdateShopName={handleUpdateShopName}
            />
          )}

        </div>

      </main>
    </div>
  );
}

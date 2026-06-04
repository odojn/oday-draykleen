/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { 
  TrendingUp, Calendar, CalendarCheck, BarChart3, 
  DollarSign, Sparkles, ShoppingBag, Landmark, Award, Activity
} from 'lucide-react';
import { HistoricalRecord, Order } from '../types';

interface AnalyticsViewProps {
  orders: Order[];
  history: HistoricalRecord[];
}

export default function AnalyticsView({ orders, history }: AnalyticsViewProps) {
  
  // Calculate analytics
  const metrics = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Day, week, month values
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-12
    
    // Start of week calculation (last 7 days helper)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    const sevenDaysTime = sevenDaysAgo.getTime();

    // 1. Today's Profits & Count from history
    const todayRecords = history.filter(h => h.date === todayStr);
    const todayProfits = todayRecords.reduce((sum, r) => sum + r.totalPrice, 0);
    const todayCount = todayRecords.length;

    // 2. Weekly Profits (last 7 days) from history
    const weeklyRecords = history.filter(h => {
      const recTime = new Date(h.date).getTime();
      return recTime >= sevenDaysTime;
    });
    const weeklyProfits = weeklyRecords.reduce((sum, r) => sum + r.totalPrice, 0);
    const weeklyCount = weeklyRecords.length;

    // 3. Monthly Profits (current month) from history
    const monthlyRecords = history.filter(h => h.year === currentYear && h.month === currentMonth);
    const monthlyProfits = monthlyRecords.reduce((sum, r) => sum + r.totalPrice, 0);
    const monthlyCount = monthlyRecords.length;

    // 4. Overall cumulative statistics
    const totalEarningsAllTime = history.reduce((sum, r) => sum + r.totalPrice, 0);
    const totalOrdersCountAllTime = history.length;

    // 5. Extended periods
    // Last 6 months profits
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    const sixMonthsTime = sixMonthsAgo.getTime();
    const sixMonthsProfits = history
      .filter(h => new Date(h.date).getTime() >= sixMonthsTime)
      .reduce((sum, r) => sum + r.totalPrice, 0);

    // Last year (12 months) profits
    const oneYearAgo = new Date();
    oneYearAgo.setMonth(now.getMonth() - 12);
    const oneYearTime = oneYearAgo.getTime();
    const oneYearProfits = history
      .filter(h => new Date(h.date).getTime() >= oneYearTime)
      .reduce((sum, r) => sum + r.totalPrice, 0);

    // Last year and a half (18 months) profits
    const eighteenMonthsAgo = new Date();
    eighteenMonthsAgo.setMonth(now.getMonth() - 18);
    const eighteenMonthsTime = eighteenMonthsAgo.getTime();
    const eighteenMonthsProfits = history
      .filter(h => new Date(h.date).getTime() >= eighteenMonthsTime)
      .reduce((sum, r) => sum + r.totalPrice, 0);

    // Compilation of monthly profit list for display
    const monthlyStats: { [key: string]: { earnings: number; count: number } } = {};
    history.forEach(h => {
      const key = `${h.year}-${h.month.toString().padStart(2, '0')}`;
      if (!monthlyStats[key]) {
        monthlyStats[key] = { earnings: 0, count: 0 };
      }
      monthlyStats[key].earnings += h.totalPrice;
      monthlyStats[key].count += 1;
    });

    // Convert to sorted array
    const sortedMonthlyStats = Object.entries(monthlyStats)
      .map(([monthKey, value]) => {
        const [yr, mn] = monthKey.split('-');
        return {
          monthLabel: `${mn} / ${yr}`,
          earnings: value.earnings,
          count: value.count,
          monthKey,
        };
      })
      .sort((a, b) => b.monthKey.localeCompare(a.monthKey))
      .slice(0, 12); // Last 12 months

    return {
      todayProfits,
      todayCount,
      weeklyProfits,
      weeklyCount,
      monthlyProfits,
      monthlyCount,
      totalEarningsAllTime,
      totalOrdersCountAllTime,
      sixMonthsProfits,
      oneYearProfits,
      eighteenMonthsProfits,
      sortedMonthlyStats,
    };
  }, [history]);

  // Months label list helper for translation
  const getArabicMonthName = (monthKey: string) => {
    const [yr, mnString] = monthKey.split('-');
    const mn = parseInt(mnString);
    const monthNames = [
      'كانون الثاني / يناير', 'شباط / فبراير', 'آذار / مارس', 'نيسان / أبريل',
      'أيار / مايو', 'حزيران / يونيو', 'تموز / يوليو', 'آب / أغسطس',
      'أيلول / سبتمبر', 'تشرين الأول / أكتوبر', 'تشرين الثاني / نوفمبر', 'كانون الأول / ديسمبر'
    ];
    return `${monthNames[mn - 1] || mnString} ${yr}`;
  };

  return (
    <div className="space-y-8" id="analytics-view-container">
      
      {/* Upper Welcomer */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 p-6 rounded-3xl text-white border border-blue-800 shadow-md relative overflow-hidden flex items-center justify-between">
        <div className="absolute right-0 top-0 bottom-0 left-1/3 bg-radial-at-tr from-blue-500/20 to-transparent pointer-events-none"></div>
        <div className="space-y-2 relative z-10">
          <span className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30 font-bold inline-block">
            نظام التحليلات الذكي ODE
          </span>
          <h3 className="text-xl md:text-2xl font-black">تحليل وإحصاءات الأرباح المتكاملة</h3>
          <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
            يتم هنا احتساب إيراداتك التي قمت بمصادقتها وتسليمها. حتى لو قمت بتنظيف أو تصفير ملفات الزبائن الجاهزة لرفع الكفاءة، فإن أرقامك المحققة تبقى محفوظة هنا للأبد ومرتبة بالشهور والسنوات.
          </p>
        </div>
        <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-400/20 hidden sm:block relative z-10 text-blue-400">
          <TrendingUp className="w-12 h-12" />
        </div>
      </div>

      {/* CORE TIMELINE REVENUE GRID - BENTO CARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Today card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex items-center gap-4 hover:scale-101 transition-all">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 block">أرباح اليوم المحققة</span>
            <strong className="text-2xl font-black text-slate-800">{metrics.todayProfits.toLocaleString('en-US')} شيكل</strong>
            <span className="text-[10px] text-slate-400 block">{metrics.todayCount} طلبيات منجزة اليوم</span>
          </div>
        </div>

        {/* This Week card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex items-center gap-4 hover:scale-101 transition-all">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 block">مبيعات آخر 7 أيام (الأسبوعي)</span>
            <strong className="text-2xl font-black text-slate-800">{metrics.weeklyProfits.toLocaleString('en-US')} شيكل</strong>
            <span className="text-[10px] text-slate-400 block">{metrics.weeklyCount} طلبيات هذا الأسبوع</span>
          </div>
        </div>

        {/* This month card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex items-center gap-4 hover:scale-101 transition-all">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <Activity className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 block">أرباح الشهر الحالي</span>
            <strong className="text-2xl font-black text-slate-800">{metrics.monthlyProfits.toLocaleString('en-US')} شيكل</strong>
            <span className="text-[10px] text-slate-400 block">{metrics.monthlyCount} طلبيات هذا الشهر</span>
          </div>
        </div>

        {/* Total lifetime card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-5 text-white shadow-xs flex items-center gap-4 hover:scale-101 transition-all">
          <div className="p-3 bg-white/10 rounded-2xl border border-white/20">
            <Landmark className="w-6 h-6 text-white" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold text-blue-100 block">إجمالي أرباح المحل الكلية</span>
            <strong className="text-2xl font-black text-white">{metrics.totalEarningsAllTime.toLocaleString('en-US')} شيكل</strong>
            <span className="text-[10px] text-blue-200 block">{metrics.totalOrdersCountAllTime} طلبيات مؤرشفة منذ التأسيس</span>
          </div>
        </div>

      </div>

      {/* EXTENDED EXTENDED CUMULATIVE STATS (6 months, 1 year, 1.5 year) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div>
          <h4 className="font-extrabold text-base text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span>التحليلات والمبيعات عبر الفترات الزمنية الممتدة</span>
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            إحصاء تراكمي دقيق للأرباح الصافية المحققة في مغسلة دراي كلين خلال الفترات الزمنية الماضية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Last 6 months */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-150 relative overflow-hidden group hover:border-blue-500/30 transition-all">
            <div className="absolute left-4 top-4 bg-blue-500/5 p-2 rounded-lg text-blue-600">
              <span className="text-xs font-bold font-mono">6M</span>
            </div>
            <span className="text-xs font-bold text-slate-500 block mb-1">إجمالي آخر 6 أشهر:</span>
            <strong className="text-2xl font-black text-slate-800">
              {metrics.sixMonthsProfits.toLocaleString('en-US')} <span className="text-sm font-semibold text-slate-500">شيكل</span>
            </strong>
            <p className="text-[10px] text-slate-400 mt-2">إيرادات نصف سنوية تراكمية للمحل</p>
          </div>

          {/* Last 1 Year */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-150 relative overflow-hidden group hover:border-blue-500/30 transition-all">
            <div className="absolute left-4 top-4 bg-emerald-500/5 p-2 rounded-lg text-emerald-600">
              <span className="text-xs font-bold font-mono">1Y</span>
            </div>
            <span className="text-xs font-bold text-slate-500 block mb-1">إجمالي الـ 1 سنة الماضية:</span>
            <strong className="text-2xl font-black text-slate-800">
              {metrics.oneYearProfits.toLocaleString('en-US')} <span className="text-sm font-semibold text-slate-500">شيكل</span>
            </strong>
            <p className="text-[10px] text-slate-400 mt-2">مبيعات العام الكامل مع تعبئة البيانات</p>
          </div>

          {/* Last 1.5 Years */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 p-5 rounded-2xl border border-slate-150 relative overflow-hidden group hover:border-blue-500/30 transition-all">
            <div className="absolute left-4 top-4 bg-indigo-500/5 p-2 rounded-lg text-indigo-600">
              <span className="text-xs font-bold font-mono">1.5Y</span>
            </div>
            <span className="text-xs font-bold text-slate-500 block mb-1">إجمالي آخر سنة ونصف (18 شهر):</span>
            <strong className="text-2xl font-black text-blue-900 font-extrabold">
              {metrics.eighteenMonthsProfits.toLocaleString('en-US')} <span className="text-sm font-semibold text-slate-500">شيكل</span>
            </strong>
            <p className="text-[10px] text-slate-400 mt-2">المدى التراكمي الشامل للإيرادات</p>
          </div>

        </div>
      </div>

      {/* MONTH-BY-MONTH DETAILED LIST & PROGRESS GAUGES */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div>
          <h4 className="font-extrabold text-base text-slate-800 flex items-center gap-1.5">
            <Activity className="w-5 h-5 text-sky-500" />
            <span>بيان وتوزيع الأرباح حسب الأشهر السابقة</span>
          </h4>
          <p className="text-xs text-slate-500">
            جدول مفصل يوضح الأداء المالي للمحل بالشهور مع نسبة مساهمة كل شهر في الأرباح الكلية لتمكينك من اتخاذ القرارات الملائمة للمحل.
          </p>
        </div>

        {metrics.sortedMonthlyStats.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            لا توجد بيانات مؤرشفة بالشهور بعد، تظهر البيانات هنا بمجرد إضافة طلبات وإدخال مبيعات حقيقية.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-500 font-bold">
                  <th className="py-3 px-4">الفترة الزمنية (الشهر)</th>
                  <th className="py-3 px-4">عدد الطلبيات المنجزة</th>
                  <th className="py-3 px-4">أرباح ومقبوضات الشهر</th>
                  <th className="py-3 px-4">التحليل البصري التراكمي للشهر</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {metrics.sortedMonthlyStats.map((st) => {
                  
                  // Calculate percentage relative to the max month's earnings
                  const maxMonthEarnings = Math.max(...metrics.sortedMonthlyStats.map(m => m.earnings)) || 1;
                  const ratio = Math.round((st.earnings / maxMonthEarnings) * 100);

                  return (
                    <tr key={st.monthKey} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-700">
                        {getArabicMonthName(st.monthKey)}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-600">
                        {st.count} طلبية منجزة
                      </td>
                      <td className="py-3.5 px-4 font-black text-emerald-700 text-base">
                        {st.earnings.toLocaleString('en-US')} شيكل
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-500 min-w-8">{ratio}%</span>
                          <div className="w-full max-w-sm bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-sky-600 h-full rounded-full"
                              style={{ width: `${ratio}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
}

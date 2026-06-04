/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { Users, Award, DollarSign, Calendar, Flame, Sparkles, TrendingUp, HelpCircle } from 'lucide-react';
import { HistoricalRecord } from '../types';

interface CustomerAnalyticsViewProps {
  history: HistoricalRecord[];
}

export default function CustomerAnalyticsView({ history }: CustomerAnalyticsViewProps) {
  
  // Group and sort customers by either profit or frequency
  const analytics = useMemo(() => {
    const customerMap: {
      [name: string]: {
        name: string;
        totalSpent: number;
        visitsCount: number;
        lastVisit: string;
      };
    } = {};

    history.forEach((h) => {
      const name = h.customerName.trim();
      if (!name) return;

      if (!customerMap[name]) {
        customerMap[name] = {
          name,
          totalSpent: 0,
          visitsCount: 0,
          lastVisit: h.date,
        };
      }

      customerMap[name].totalSpent += h.totalPrice;
      customerMap[name].visitsCount += 1;
      
      // Track latest visit date
      if (new Date(h.date) > new Date(customerMap[name].lastVisit)) {
        customerMap[name].lastVisit = h.date;
      }
    });

    const customersList = Object.values(customerMap);

    // 1. Sort by total profitability (Spent money)
    const mostProfitable = [...customersList]
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);

    // 2. Sort by frequency (visitsCount)
    const mostFrequent = [...customersList]
      .sort((a, b) => b.visitsCount - a.visitsCount)
      .slice(0, 10);

    return {
      mostProfitable,
      mostFrequent,
      uniqueCustomersCount: customersList.length,
    };
  }, [history]);

  return (
    <div className="space-y-8" id="customer-analytics-view">
      
      {/* Intro Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>تحليل تفاعلي وتصنيف الزبائن والعملاء</span>
          </h3>
          <p className="text-xs text-slate-500">
            اكتشف مَن هم أفضل زبائنك جذباً للأرباح وأكثرهم تردداً وتردداً مستمراً لخدمتك لتخصيص عروض وخصومات لهم.
          </p>
        </div>

        <div className="bg-blue-50 px-4 py-2.5 rounded-2xl border border-blue-100 flex items-center gap-3">
          <div className="p-2 bg-blue-600 text-white rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-bold leading-none">إجمالي الزبائن الفريدين</span>
            <strong className="text-lg font-black text-slate-850 leading-none">{analytics.uniqueCustomersCount} زبون</strong>
          </div>
        </div>
      </div>

      {/* Grid of Profitable vs Frequent Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* RIGHT COLUMN: MOST PROFITABLE (أكثر الزبائن ربحاً للمحل) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-250 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-base text-slate-800 flex items-center gap-1.5">
                <Award className="w-5 h-5 text-amber-500" />
                <span>أكثر الزبائن ربحاً ومبيعات للمحل</span>
              </h4>
              <p className="text-[11px] text-slate-400">مرتبة تنازلياً حسب مجموع المدفوعات الكلية المحققة للدراري كلين</p>
            </div>
            <Sparkles className="w-4.5 h-4.5 text-yellow-400 animate-pulse" />
          </div>

          {analytics.mostProfitable.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              لا توجد أرشيفات لتوليد قائمة زبائن مفضلين، يُرجى تفعيل وتسليم بعض الطلبيات أولاً.
            </div>
          ) : (
            <div className="space-y-3">
              {analytics.mostProfitable.map((cust, index) => {
                
                // Award Badge Design
                const medals = [
                  { bg: 'bg-amber-100 text-amber-800 border-amber-200', text: '🏆 الأول' },
                  { bg: 'bg-slate-100 text-slate-800 border-slate-200', text: '🥈 الثاني' },
                  { bg: 'bg-amber-50 text-amber-700 border-amber-100', text: '🥉 الثالث' }
                ];

                const activeMedal = medals[index];

                return (
                  <div
                    key={cust.name}
                    className="flex justify-between items-center bg-slate-50/60 p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all text-sm"
                  >
                    <div className="flex items-center gap-3">
                      {activeMedal ? (
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${activeMedal.bg}`}>
                          {activeMedal.text}
                        </span>
                      ) : (
                        <span className="w-6 h-6 bg-slate-250 text-slate-600 rounded-full font-bold text-xs flex items-center justify-center">
                          #{index + 1}
                        </span>
                      )}
                      
                      <div className="space-y-0.5">
                        <strong className="text-slate-800 font-extrabold">{cust.name}</strong>
                        <div className="text-[10px] text-slate-400 font-bold">
                          مرات الطلب: {cust.visitsCount} زيارة | آخر فحص: {cust.lastVisit}
                        </div>
                      </div>
                    </div>

                    <div className="text-left">
                      <span className="font-mono font-black text-emerald-700 text-base">
                        {cust.totalSpent.toLocaleString('en-US')} شيكل
                      </span>
                      <span className="text-[10px] text-slate-400 block">إجمالي المقبوضات</span>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* LEFT COLUMN: MOST FREQUENT (الأكثر تردداً وشيوعاً) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-255 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-base text-slate-800 flex items-center gap-1.5">
                <Flame className="w-5 h-5 text-blue-600" />
                <span>الزبائن الأكثر شيوعاً وتكراراً للمحل</span>
              </h4>
              <p className="text-[11px] text-slate-400">مرتبة تنازلياً حسب إجمالي عدد مرات زيارة المحل وتسجيل طلبات جديدة</p>
            </div>
            <TrendingUp className="w-4.5 h-4.5 text-blue-500" />
          </div>

          {analytics.mostFrequent.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              لا توجد أرشيفات كافية، سيتم تتبع العملاء بمجرد تنشيط النظام.
            </div>
          ) : (
            <div className="space-y-3">
              {analytics.mostFrequent.map((cust, index) => {
                return (
                  <div
                    key={cust.name}
                    className="flex justify-between items-center bg-slate-50/60 p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-blue-50 text-blue-700 border border-blue-100 rounded-full font-black text-xs flex items-center justify-center">
                        {cust.visitsCount}
                      </span>
                      <div className="space-y-0.5">
                        <strong className="text-slate-850 font-extrabold">{cust.name}</strong>
                        <div className="text-[10px] text-slate-400">
                          بمتوسط حساب: {Math.round(cust.totalSpent / cust.visitsCount)} شيكل لكل طلبية
                        </div>
                      </div>
                    </div>

                    <div className="text-left space-y-0.5">
                      <span className="font-bold text-slate-700 text-sm">
                        أثمر عن: {cust.totalSpent.toLocaleString('en-US')} شيكل
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 block">شامل الإيراد للزبون</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

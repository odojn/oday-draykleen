/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, BarChart3, TrendingUp, Sparkles, FolderLock } from 'lucide-react';

interface InfoScreenProps {
  onNext: () => void;
}

export default function InfoScreen({ onNext }: InfoScreenProps) {
  // 4 gorgeous explanations as specified by the user
  const features = [
    {
      id: 1,
      title: 'أفضل نظام لإدارة الطلبات',
      desc: 'أفضل نظام لإدارة الطلبيات لتسهيل وتنظيم وتتبع خدمات الغسيل والكوي في محلات دراي كلين.',
      icon: ShieldCheck,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
    {
      id: 2,
      title: 'مراقبة الطلبيات الشهرية',
      desc: 'اعرف بدقة كم عدد الطلبيات والقطع الشهرية والأسبوعية التي تنجزها في المحل للتقييم المستمر.',
      icon: BarChart3,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      id: 3,
      title: 'إحصاء إجمالي الأرباح',
      desc: 'اعرف إجمالي أرباحك الصافية والمحققة بشكل يومي، أسبوعي وسنوي مقسمة بدقة متناهية.',
      icon: TrendingUp,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    },
    {
      id: 4,
      title: 'أمان البيانات وعدم ضياع الطلبات',
      desc: 'استقرار تام وعدم ضياع معلومات أي طلبية أو عميل بفضل نظام الأرشفة المؤمم والمستمر للأبد.',
      icon: FolderLock,
      color: 'bg-rose-50 text-rose-600 border-rose-100',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-800 text-right select-none" id="info-screen">
      
      {/* Sparkly graphics */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-sky-100 rounded-full filter blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-blue-100 rounded-full filter blur-2xl pointer-events-none"></div>

      <div className="max-w-xl w-full flex flex-col space-y-8 relative z-10">
        
        {/* Title */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 inline-block">
            دليل الفوائد والميزات
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-blue-950">
            لماذا تختار نظام <span className="text-blue-600">ODE</span>؟
          </h2>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            لقد تم تصميم هذا التطبيق خصيصاً لتيسير عملك وتفادي التشتت والأخطاء اليدوية.
          </p>
        </div>

        {/* 4 Cards Grid / List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div 
                key={feat.id} 
                className="p-5 rounded-2xl bg-white border border-gray-150 hover:border-blue-200 hover:shadow-md transition-all duration-200 flex flex-col h-full space-y-3 justify-between shadow-xs"
                id={`feature-card-${feat.id}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl border ${feat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900">
                    {feat.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="pt-4 flex flex-col items-center">
          <button
            id="btn-info-next"
            onClick={onNext}
            className="w-full max-w-xs py-4 px-8 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-lg rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>التالي والمتابعة</span>
            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
          </button>
        </div>

      </div>
    </div>
  );
}

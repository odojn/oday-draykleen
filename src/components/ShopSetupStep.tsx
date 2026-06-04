/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Store, ArrowRight, Check, AlertTriangle } from 'lucide-react';

interface ShopSetupStepProps {
  initialShopName: string;
  onSaveShopName: (name: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function ShopSetupStep({
  initialShopName,
  onSaveShopName,
  onBack,
  onNext,
}: ShopSetupStepProps) {
  const [shopNameInput, setShopNameInput] = useState(initialShopName || '');
  const [errorWord, setErrorWord] = useState('');

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopNameInput.trim()) {
      setErrorWord('يرجى تسجيل اسم المحل أو الدراي كلين للمواصلة');
      return;
    }
    onSaveShopName(shopNameInput.trim());
    onNext();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between items-center p-6 text-slate-850" id="shop-setup-view">
      <div className="max-w-md w-full flex-grow flex flex-col justify-center space-y-6">
        
        {/* Step Banner */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-750 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 inline-block">
            الخطوة الرابعة / اسم النشاط التجاري
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-blue-950">
            سجل اسم الدراي كلين الخاص بك
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            سوف نقوم باستخدام هذا الاسم في أعلى لوحة التحكم وفواتير وتصدير تقارير الأرباح الشهرية.
          </p>
        </div>

        {/* Input box */}
        <form onSubmit={handleNext} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-blue-50 border border-blue-100 text-blue-600 rounded-full">
              <Store className="w-10 h-10" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block text-right">
              اسم الدراي كلين / المحل:
            </label>
            <input
              type="text"
              value={shopNameInput}
              onChange={(e) => {
                setShopNameInput(e.target.value);
                setErrorWord('');
              }}
              placeholder="مثال: دراي كلين الأمانة، دراي كلين الياسمين..."
              className="w-full p-4 rounded-xl bg-slate-50 text-slate-800 placeholder-slate-400 border border-slate-200 focus:border-blue-500 text-right outline-none text-base font-bold"
              autoFocus
              id="shop-name-input"
            />
          </div>

          {errorWord && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorWord}</span>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onBack}
              className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-650 font-medium rounded-xl text-sm transition-all cursor-pointer"
            >
              السابق
            </button>
            <button
              type="submit"
              id="btn-shop-setup-submit"
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all text-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <span>حفظ والدخول للوحة التحكم</span>
              <Check className="w-4 h-4 text-white" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

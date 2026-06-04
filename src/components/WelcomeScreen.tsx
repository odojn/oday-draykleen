/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Shirt, Waves } from 'lucide-react';

interface WelcomeScreenProps {
  onNext: () => void;
}

export default function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-800 text-center select-none" id="welcome-screen">
      
      {/* Background ambient glowing shapes */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-100 rounded-full filter blur-3xl opacity-60 pointer-events-none transition-all duration-1000"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-sky-100 rounded-full filter blur-3xl opacity-60 pointer-events-none transition-all duration-1000"></div>

      <div className="max-w-md w-full flex flex-col items-center space-y-10 relative z-10">
        
        {/* Animated Icon Container */}
        <div className="relative flex items-center justify-center p-8 bg-blue-50/80 rounded-full border border-blue-200/50 shadow-xl shadow-blue-100/40 pulse-glow">
          <div className="absolute inset-0 bg-blue-200/20 rounded-full filter blur-md"></div>
          <div className="relative flex items-center gap-1">
            <Shirt className="w-16 h-16 text-blue-600" />
            <Waves className="w-8 h-8 text-blue-400 absolute bottom-1 -right-1 animate-bounce" />
          </div>
        </div>

        {/* Dynamic Title and typography */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-blue-950 leading-normal">
            نظام <span className="text-blue-600 font-extrabold">ODE</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-extrabold text-blue-900 tracking-wide">
            دراي كلين الذكي
          </h2>
          <div className="w-16 h-1.5 bg-blue-600 mx-auto rounded-full mt-4"></div>
        </div>

        <p className="text-slate-600 text-[15px] font-medium leading-relaxed max-w-sm">
          أهلاً ومرحباً بك في النظام الرقمي المتطور لإدارة الطلبات، رصد الأرباح المكتسبة وأرشفة الزبائن بكل سهولة واحترافية.
        </p>

        {/* CTA Next Button */}
        <button
          id="btn-welcome-next"
          onClick={onNext}
          className="w-full max-w-xs py-4 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition-all duration-150 cursor-pointer flex items-center justify-center gap-3 group"
        >
          <span>ابدأ الرحلة</span>
          <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse group-hover:rotate-12 transition-transform" />
        </button>

        {/* Humble Signature */}
        <div className="text-xs text-slate-400 tracking-wider font-semibold">
          تم الإعداد والتطوير بكل حب لشغلك المتميز
        </div>

      </div>
    </div>
  );
}

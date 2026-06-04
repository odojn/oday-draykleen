/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Mail, ShieldCheck, Heart, Sparkles, Code, Cpu, Smartphone } from 'lucide-react';

export default function AboutUsView() {
  return (
    <div className="max-w-2xl mx-auto space-y-8" id="about-us-view">
      
      {/* Developer Card visualizer */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 border border-blue-900/50 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl flex flex-col items-center text-center space-y-6">
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="p-4 bg-white/5 border border-white/10 rounded-full">
          <Code className="w-12 h-12 text-blue-400" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-blue-300 uppercase tracking-widest bg-blue-950/80 px-4 py-1.5 rounded-full border border-blue-800/80 inline-block font-sans">
            مطور التطبيق والبرمجيات
          </span>
          <h2 className="text-3xl font-black text-white">عدي قطقط</h2>
          <p className="text-sm text-slate-300 font-medium max-w-md mx-auto">
            مطور برمجيات ذو رؤية تكنولوجية متقدمة، متخصص في بناء الأنظمة الإدارية عالية الأداء وحلول الأتمتة للمصالح التجارية والشركات الصغيرة والمغاسل.
          </p>
        </div>

        {/* Contact info Block */}
        <div className="w-full max-w-sm bg-blue-950/60 backdrop-blur-md p-4 rounded-2xl border border-blue-800/80 hover:border-blue-700/80 transition-all">
          <span className="text-[10px] text-slate-400 block font-bold mb-1">البريد الإلكتروني الرسمي للتواصل والملاحظات:</span>
          <a 
            href="mailto:oday5qutqut@gamil.com"
            className="flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 font-mono font-bold text-sm tracking-wide transition-colors"
          >
            <Mail className="w-4 h-4 shrink-0" />
            <span>oday5qutqut@gamil.com</span>
          </a>
        </div>

      </div>

      {/* App details of the system */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div>
          <h4 className="font-extrabold text-base text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-3">
            <Cpu className="w-5 h-5 text-sky-500" />
            <span>معلومات عن نظام ODE دراي كلين</span>
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium text-slate-600 leading-relaxed">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <strong className="text-slate-800 font-bold block text-sm">💡 الفكرة والشرارة الأولى:</strong>
            صدى هذا التطبيق يأتي استجابةً للحاجة الحيوية لتسهيل عمليات التوثيق لخدمات غسيل وكوي الملابس والسجاد والبطانيات. التطبيق يلغي القلم والكلبسات الورقية المعرضة للتلف أو الضياع.
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <strong className="text-slate-800 font-bold block text-sm">🔒 الحفظ الآمن للأبد:</strong>
            يمتاز نظام البيانات بنظام أرشفة صامت يسجل إجمالي المقبوضات حسب الزبائن والأشهر والخدمات، ويبقى ثابتاً حتى في حال رغبة المشغل بتطهير قائمة الطلبات الجاهزة النشطة لراحة الرؤية.
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <strong className="text-slate-800 font-bold block text-sm">⚡ سرعة قصوى وأداء عالٍ:</strong>
            تم إعداده باستعمال تقنيات Vite، React 19، TypeScript، واللغة العربية الصرفة لضمان تجاوبة مع الكيبورد والموبايل اللوحي بمرونة متميزة تلبي متطلبات ضغط العمل اليومي.
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <strong className="text-slate-800 font-bold block text-sm">📑 تصدير الفواتير HTML:</strong>
            يمكنك بنقرة واحدة توليد مستند فاتورة متجاوب، منظم، وقابل للطباعة أو الحفظ بصيغة PDF يتضمن إحصاءات شاملة وتقارير دقيقة لأداء مغسلتك بالكامل.
          </div>
        </div>

        <div className="pt-4 flex items-center justify-center gap-2 text-slate-400 text-xs border-t border-slate-100 italic">
          <span>تمت صناعة هذا البرنامج بحب وإتقان لدراي كلين ODE الخاص بك</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
        </div>
      </div>

    </div>
  );
}

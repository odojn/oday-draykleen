/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlusCircle, Trash2, Edit3, Check, ArrowRight, ListPlus, Sparkles, AlertCircle } from 'lucide-react';
import { Category } from '../types';

interface CategoriesStepProps {
  categories: Category[];
  onAddCategory: (name: string) => void;
  onEditCategory: (id: string, newName: string) => void;
  onDeleteCategory: (id: string) => void;
  onNext: () => void;
}

export default function CategoriesStep({
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onNext,
}: CategoriesStepProps) {
  // Navigation inside this step:
  // 'list' : main view with the Add button and listed categories
  // 'add'  : subpage to input a category name
  // 'edit' : subpage to edit a category name
  const [subView, setSubView] = useState<'list' | 'add' | 'edit'>('list');
  const [valueInput, setValueInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorWord, setErrorWord] = useState('');

  const handleOpenAdd = () => {
    setValueInput('');
    setErrorWord('');
    setSubView('add');
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingId(cat.id);
    setValueInput(cat.name);
    setErrorWord('');
    setSubView('edit');
  };

  const saveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valueInput.trim()) {
      setErrorWord('الرجاء كتابة اسم الصنف أولاً');
      return;
    }
    // Check duplication
    if (categories.some((c) => c.name.trim() === valueInput.trim())) {
      setErrorWord('هذا الصنف مضاف بالفعل مسبقاً!');
      return;
    }
    onAddCategory(valueInput.trim());
    setValueInput('');
    setSubView('list');
  };

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    if (!valueInput.trim()) {
      setErrorWord('الرجاء كتابة اسم الصنف أولاً');
      return;
    }
    // Check duplication with others
    if (categories.some((c) => c.id !== editingId && c.name.trim() === valueInput.trim())) {
      setErrorWord('هذا الصنف مضاف بالفعل مسبقاً باسم آخر!');
      return;
    }
    onEditCategory(editingId, valueInput.trim());
    setEditingId(null);
    setValueInput('');
    setSubView('list');
  };

  // Pre-seed mock helper to jumpstart the user with common defaults if they wish
  const seedDefaults = () => {
    const defaults = ['غسيل ملابس', 'كوي ملابس', 'غسيل سجاد', 'دراي كلين بطانيات', 'تنظيف فساتين بدلات'];
    defaults.forEach(def => {
      if (!categories.some(c => c.name === def)) {
        onAddCategory(def);
      }
    });
  };

  // Render Subpages
  if (subView === 'add') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-800" id="category-add-view">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-xl relative">
          <div className="absolute top-6 left-6 text-blue-600">
            <PlusCircle className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-bold text-blue-950 mb-2 flex items-center gap-2">
            <span>إضافة صنف عمل جديد</span>
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            اكتب الخدمة التي يقدمها المحل، لتظهر لاحقاً عند إنشاء الطلبات وتصنيفها.
          </p>

          <form onSubmit={saveAdd} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">
                اسم الصنف المستهدف:
              </label>
              <input
                type="text"
                value={valueInput}
                onChange={(e) => {
                  setValueInput(e.target.value);
                  setErrorWord('');
                }}
                placeholder="مثال: غسيل ملابس، غسيل سجاد..."
                className="w-full p-4 rounded-xl bg-slate-50 text-slate-800 placeholder-slate-400 border border-slate-200 focus:border-blue-500 text-right outline-none text-base font-semibold"
                autoFocus
                id="category-input-name"
              />
              <p className="text-[11px] text-slate-400">
                مثل: كوي ملابس، غسيل سجاد صغير، دراي كلين جواكيت
              </p>
            </div>

            {errorWord && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorWord}</span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                id="btn-category-save"
                className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all text-sm cursor-pointer"
              >
                حفظ وإضافة الصنف
              </button>
              <button
                type="button"
                onClick={() => setSubView('list')}
                className="py-3.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium rounded-xl text-sm transition-all cursor-pointer"
              >
                إلغاء الرجوع
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (subView === 'edit') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-800" id="category-edit-view">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
          <h3 className="text-xl font-bold text-blue-950 mb-2">تعديل اسم الصنف</h3>
          <p className="text-xs text-slate-500 mb-6">
            قم بتحديث مسمى هذا الصنف وسوف يظهر معدلاً في كامل النظام وتصنيفات الطلبات.
          </p>

          <form onSubmit={saveEdit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">
                تعديل المسمى الجديد:
              </label>
              <input
                type="text"
                value={valueInput}
                onChange={(e) => {
                  setValueInput(e.target.value);
                  setErrorWord('');
                }}
                className="w-full p-4 rounded-xl bg-slate-50 text-slate-800 border border-slate-200 focus:border-blue-500 text-right outline-none text-base font-semibold"
                autoFocus
                id="category-edit-input"
              />
            </div>

            {errorWord && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorWord}</span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                id="btn-category-update"
                className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all text-sm cursor-pointer"
              >
                حفظ التعديل الآن
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setSubView('list');
                }}
                className="py-3.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium rounded-xl text-sm transition-all cursor-pointer"
              >
                إلغاء الرجوع
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // MAIN CATEGORIES SELECTION VIEW
  return (
    <div className="min-h-screen bg-slate-50 text-slate-850 p-6 flex flex-col justify-between items-center" id="categories-step-view">
      <div className="max-w-xl w-full flex-grow flex flex-col justify-center space-y-6">
        
        {/* Banner header info */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-750 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 inline-block">
            الخطوة الثالثة / الضبط الأساسي
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-blue-950">أصناف غسيل ودراي كلين المحل</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            يرجى إضافة أنواع الخدمات التي تقدمها (مثلاً: غسيل ملابس، غسيل سجَّاد، غسيل بطانيات، كوي فقط، إلخ).
          </p>
        </div>

        {/* Center UI with add button as requested */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
          <div className="flex flex-col items-center justify-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <ListPlus className="w-12 h-12 text-slate-400 mb-3" />
            <p className="text-xs text-slate-500 mb-4 text-center px-4">
              يمكنك المضي قدماً في تخصيص التطبيق بالكامل ليناسب أعمال دراي كلين الخاصة بك.
            </p>
            
            <button
              id="btn-add-category-trigger"
              onClick={handleOpenAdd}
              className="py-3.5 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-blue-100 hover:shadow-blue-200/50 active:scale-95 transition-all duration-150 cursor-pointer flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5 text-white" />
              <span>إضافة أصناف عملك</span>
            </button>
          </div>

          {/* Quick seed if list is empty */}
          {categories.length === 0 && (
            <div className="text-center">
              <button
                type="button"
                onClick={seedDefaults}
                className="text-xs text-blue-600 hover:text-blue-700 underline font-semibold cursor-pointer"
              >
                اضغط هنا لتعبئة أصناف أساسية جاهزة تلقائياً (غسيل ملابس، غسيل سجاد...)
              </button>
            </div>
          )}

          {/* Added categorised listings */}
          {categories.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-sm font-bold text-slate-700">
                  الأصناف الحالية المضافة ({categories.length}):
                </span>
                <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
              </div>
              
              <div className="grid grid-cols-1 divide-y divide-slate-100 max-h-[220px] overflow-y-auto pr-1">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex justify-between items-center py-2.5 group hover:bg-slate-50/70 px-2 rounded-lg transition-all"
                  >
                    <span className="font-semibold text-slate-800 text-sm">
                      ✨ {cat.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-amber-600 hover:text-amber-700 transition-all cursor-pointer"
                        title="تعديل"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteCategory(cat.id)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-rose-600 hover:text-rose-750 transition-all cursor-pointer"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA Master Button to move to Step 4 */}
        <div className="flex justify-end pt-4 w-full">
          <button
            id="btn-categories-next"
            onClick={onNext}
            disabled={categories.length === 0}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-lg text-white flex items-center justify-center gap-2 shadow-lg transition-all duration-150 ${
              categories.length > 0
                ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer active:scale-95 shadow-blue-100'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
            }`}
          >
            <span>التالي والمواصلة</span>
            <Check className="w-5 h-5 text-white" />
          </button>
        </div>

      </div>
    </div>
  );
}

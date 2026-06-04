/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Order, HistoricalRecord } from '../types';

export function generateMonthlyReportHTML(
  shopName: string,
  orders: Order[],
  history: HistoricalRecord[],
  selectedMonth: number,
  selectedYear: number
): string {
  // Filter history records for the selected month/year
  const monthlyHistory = history.filter(
    (h) => h.year === selectedYear && h.month === selectedMonth
  );

  const activeMonthlyOrders = orders.filter((o) => {
    const d = new Date(o.date);
    return d.getFullYear() === selectedYear && (d.getMonth() + 1) === selectedMonth;
  });

  const totalEarnings = monthlyHistory.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalCompletedOrders = monthlyHistory.length;
  
  const activeCount = activeMonthlyOrders.filter((o) => o.status === 'قيد العمل').length;
  const readyCount = activeMonthlyOrders.filter((o) => o.status === 'جاهز').length;
  const deliveredCount = activeMonthlyOrders.filter((o) => o.status === 'تم التسليم').length;

  const monthNames = [
    'يناير / كانون الثاني',
    'فبراير / شباط',
    'مارس / آذار',
    'أبريل / نيسان',
    'مايو / أيار',
    'يونيو / حزيران',
    'يوليو / تموز',
    'أغسطس / آب',
    'سبتمبر / أيلول',
    'أكتوبر / تشرين الأول',
    'نوفمبر / تشرين الثاني',
    'ديسمبر / كانون الأول',
  ];

  const monthLabel = monthNames[selectedMonth - 1] || `${selectedMonth}`;

  // Categorize sales by category
  const categorySummary: { [key: string]: number } = {};
  monthlyHistory.forEach((h) => {
    h.categories.forEach((cat) => {
      categorySummary[cat] = (categorySummary[cat] || 0) + 1;
    });
  });

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تقرير دراي كلين - ${shopName}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
        
        body {
            font-family: 'Cairo', sans-serif;
            background-color: #f8fafc;
            color: #1e293b;
            margin: 0;
            padding: 30px;
            direction: rtl;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
            padding: 40px;
            border-top: 8px solid #1e3a8a;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }

        .title-area h1 {
            color: #1e3a8a;
            margin: 0 0 5px 0;
            font-size: 28px;
            font-weight: 800;
        }

        .title-area p {
            color: #64748b;
            margin: 0;
            font-size: 14px;
        }

        .meta-info {
            text-align: left;
            font-size: 14px;
            color: #475569;
        }

        .meta-info div {
            margin-bottom: 5px;
        }

        .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 40px;
        }

        .summary-card {
            background-color: #f0f7ff;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            border: 1px solid #bae0fd;
        }

        .summary-card.success {
            background-color: #f0fdf4;
            border-color: #bbf7d0;
        }

        .summary-card h3 {
            margin: 0 0 10px 0;
            color: #475569;
            font-size: 15px;
        }

        .summary-card .value {
            font-size: 26px;
            font-weight: 800;
            color: #1e3a8a;
        }

        .summary-card.success .value {
            color: #15803d;
        }

        h2 {
            color: #1e3a8a;
            font-size: 20px;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 8px;
            margin-top: 40px;
            margin-bottom: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }

        th {
            background-color: #e2e8f0;
            color: #1e293b;
            text-align: right;
            padding: 12px;
            font-weight: 700;
            border-bottom: 2px solid #cbd5e1;
        }

        td {
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
            color: #334155;
            font-size: 14px;
        }

        tr:hover {
            background-color: #f8fafc;
        }

        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 600;
        }

        .badge-success { background-color: #dcfce7; color: #15803d; }
        .badge-warning { background-color: #fef9c3; color: #a16207; }
        .badge-info { background-color: #e0f2fe; color: #0369a1; }

        .footer {
            text-align: center;
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #94a3b8;
        }

        .btn-print {
            background-color: #1e3a8a;
            color: #ffffff;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-family: inherit;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 20px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .btn-print:hover {
            background-color: #1d4ed8;
        }

        @media print {
            body {
                background: white;
                padding: 0;
            }
            .container {
                box-shadow: none;
                padding: 0;
                border-top: none;
            }
            .btn-print {
                display: none;
            }
        }
    </style>
</head>
<body>

    <button class="btn-print" onclick="window.print()">🖨️ طباعة التقرير / حفظ كـ PDF</button>

    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="title-area">
                <h1>نظام ODE لخدمات الدراي كلين</h1>
                <p>تقرير الأداء والتحليلات لـ: ${shopName}</p>
            </div>
            <div class="meta-info">
                <div><strong>التاريخ:</strong> ${new Date().toLocaleDateString('ar-EG')}</div>
                <div><strong>الفترة المحددة:</strong> ${monthLabel} ${selectedYear}</div>
                <div><strong>الحالة:</strong> تقرير نهائي</div>
            </div>
        </div>

        <!-- summary counters -->
        <div class="summary-grid">
            <div class="summary-card success">
                <h3>إجمالي الأرباح المكتسبة</h3>
                <div class="value">${totalEarnings.toLocaleString('en-US')} شيكل</div>
            </div>
            <div class="summary-card">
                <h3>الطلبيات المنجزة والمحفوظة</h3>
                <div class="value">${totalCompletedOrders} طلبية</div>
            </div>
            <div class="summary-card">
                <h3>الطلبيات النشطة حالياً</h3>
                <div class="value">${activeMonthlyOrders.length} طلبية</div>
            </div>
        </div>

        <!-- categories analytics -->
        <h2>تحليل الطلبيات حسب نوع الخدمة</h2>
        <table>
            <thead>
                <tr>
                    <th>نوع الخدمة / الصنف</th>
                    <th>عدد مرات طلب الخدمة هذا الشهر</th>
                    <th>النسبة من إجمالي الطلبيات</th>
                </tr>
            </thead>
            <tbody>
                ${
                  Object.keys(categorySummary).length === 0
                    ? `<tr><td colspan="3" style="text-align: center; color: #94a3b8;">لا توجد بيانات أصناف مسجلة لهذا الشهر تفصيلياً</td></tr>`
                    : Object.entries(categorySummary)
                        .map(([cat, count]) => {
                          const percent = totalCompletedOrders > 0 
                            ? Math.round((count / totalCompletedOrders) * 100) 
                            : 0;
                          return `
                        <tr>
                            <td><strong>${cat}</strong></td>
                            <td>${count} مرات</td>
                            <td>
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <span>${percent}%</span>
                                    <div style="flex-grow: 1; background: #e2e8f0; height: 8px; border-radius: 4px; overflow: hidden; max-width: 150px;">
                                        <div style="background: #1e3a8a; width: ${percent}%; height: 100%;"></div>
                                    </div>
                                </div>
                            </td>
                        </tr>`;
                        })
                        .join('')
                }
            </tbody>
        </table>

        <!-- Active and historic orders list this month -->
        <h2>تفصيل سجل الطلبيات النشطة خلال الشهر</h2>
        <table>
            <thead>
                <tr>
                    <th>اسم الزبون</th>
                    <th>التاريخ</th>
                    <th>القطع المشمولة</th>
                    <th>حالة الطلب حالياً</th>
                    <th>إجمالي الحساب</th>
                </tr>
            </thead>
            <tbody>
                ${
                  activeMonthlyOrders.length === 0
                    ? `<tr><td colspan="5" style="text-align: center; color: #94a3b8;">لا توجد طلبيات نشطة حالياً في النظام لهذا الشهر</td></tr>`
                    : activeMonthlyOrders
                        .map((o) => {
                          const statusBadgeStr =
                            o.status === 'قيد العمل'
                              ? '<span class="badge badge-warning">قيد العمل</span>'
                              : o.status === 'جاهز'
                                ? '<span class="badge badge-info">جاهز للتسليم</span>'
                                : '<span class="badge badge-success">تم التسليم</span>';
                          
                          const itemsSummary = o.items
                            .map((it) => `${it.name} (${it.quantity})`)
                            .join('، ');

                          return `
                        <tr>
                            <td><strong>${o.customerName}</strong></td>
                            <td>${new Date(o.date).toLocaleDateString('ar-EG')}</td>
                            <td>${itemsSummary || 'بلا تفاصيل'}</td>
                            <td>${statusBadgeStr}</td>
                            <td><strong>${o.totalPrice.toLocaleString('en-US')} شيكل</strong></td>
                        </tr>`;
                        })
                        .join('')
                }
            </tbody>
        </table>

        <!-- Historic Revenue Log -->
        <h2>سجل الإيرادات المؤرشف المحفوظ للأبد</h2>
        <table>
            <thead>
                <tr>
                    <th>الزبون الرئيسي</th>
                    <th>تاريخ التسجيل بالكامل</th>
                    <th>عدد القطع</th>
                    <th>الخدمات المقدمة</th>
                    <th>المبلغ المحفوظ</th>
                </tr>
            </thead>
            <tbody>
                ${
                  monthlyHistory.length === 0
                    ? `<tr><td colspan="5" style="text-align: center; color: #94a3b8;">لم يتم أرشفة أو تسليم أي طلبيات بعد لهذا الشهر</td></tr>`
                    : monthlyHistory
                        .map((h) => `
                        <tr>
                            <td><strong>${h.customerName}</strong></td>
                            <td>${h.day}/${h.month}/${h.year}</td>
                            <td>${h.itemsCount} قطة</td>
                            <td>${h.categories.join('، ') || 'خدمة دراي كلين'}</td>
                            <td style="color: #15803d; font-weight: 700;">${h.totalPrice.toLocaleString('en-US')} شيكل</td>
                        </tr>`)
                        .join('')
                }
            </tbody>
        </table>

        <!-- Footer -->
        <div class="footer">
            <p>نظام ODE دراي كلين - تم الاستخراج والتحرير بواسطة نظام الإدارة الذكية</p>
            <p>المطور: عدي قطقط &copy; 2026 | البريد الإلكتروني: oday5qutqut@gamil.com</p>
        </div>
    </div>

</body>
</html>`;
}

export function downloadMonthlyReport(
  shopName: string,
  orders: Order[],
  history: HistoricalRecord[],
  selectedMonth: number,
  selectedYear: number
) {
  const htmlContent = generateMonthlyReportHTML(shopName, orders, history, selectedMonth, selectedYear);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `تقرير_دراي_كلين_${selectedYear}_${selectedMonth}.html`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

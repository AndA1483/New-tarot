import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// ================================================================
// RENDER ENGINE
// ================================================================
const renderHtmlToPdfPage = async (pdf, htmlContent, isFirstPage = false) => {
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: -9999px;
    left: -9999px;
    width: 794px;
    min-height: 1123px;
    background: #1e293b;
    font-family: 'Sarabun', 'Noto Sans Thai', 'Segoe UI', sans-serif;
  `;
  container.innerHTML = htmlContent;
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#1e293b',
      logging: false,
      windowWidth: 794,
    });
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdfWidth  = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const ratio = pdfWidth / canvas.width;
    const scaledH = canvas.height * ratio;
    if (!isFirstPage) pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, scaledH <= pdfHeight ? scaledH : pdfHeight);
  } finally {
    document.body.removeChild(container);
  }
};

// ================================================================
// COLOR PALETTE — ตรงกับ dark theme ของโปรเจค (slate-800/900)
// ================================================================
const C = {
  // Backgrounds
  pageBg:     '#1e293b',   // slate-800
  cardBg:     '#334155',   // slate-700
  sectionBg:  '#0f172a',   // slate-900
  inputBg:    '#475569',   // slate-600

  // Accent colors (จากปุ่มในโปรเจค)
  orange:     '#f59e0b',   // yellow-500 (ปุ่มดูดวงรายวัน)
  orangeEnd:  '#f97316',   // orange-500
  purple:     '#a855f7',   // purple-500 (ปุ่มดูดวงรายเดือน)
  purpleEnd:  '#3b82f6',   // blue-500
  green:      '#22c55e',   // green-500 (ปุ่มความหมายไพ่)
  blue:       '#3b82f6',   // blue-500 (ปุ่มเริ่มดูดวง)
  blueEnd:    '#1d4ed8',   // blue-700

  // Text
  textWhite:  '#f8fafc',   // slate-50
  textSub:    '#94a3b8',   // slate-400
  textMuted:  '#64748b',   // slate-500
  textYellow: '#facc15',   // yellow-400

  // Border
  border:     '#334155',   // slate-700
};

// badge เลขตำแหน่ง — วนสีตาม accent
const BADGE_COLORS = [
  C.orange, C.purple, C.blue, C.green,
  C.orangeEnd, C.purpleEnd, C.orange, C.purple, C.blue, C.green,
];

const badge = (num) => {
  const bg = BADGE_COLORS[(num - 1) % BADGE_COLORS.length];
  return `<span style="
    display:inline-flex;align-items:center;justify-content:center;
    width:30px;height:30px;border-radius:50%;
    background:${bg};color:#fff;
    font-size:13px;font-weight:800;flex-shrink:0;
  ">${num}</span>`;
};

// row สรุปไพ่ — สลับ slate-700 / slate-800
const rowBg = (idx) => idx % 2 === 0 ? '#334155' : '#1e293b';

// ================================================================
// TEMPLATE: หน้าปก Monthly
// ================================================================
const buildMonthlyCoverHtml = (selectedCards, positionLabels, currentDate) => {
  const rows = selectedCards.map((card, idx) => {
    const pos = positionLabels[idx];
    const rev = card.isReversed
      ? `<span style="background:#7f1d1d;color:#fca5a5;font-size:10px;
                      padding:2px 7px;border-radius:10px;margin-left:6px;">กลับหัว</span>`
      : '';
    return `
      <div style="
        display:flex;align-items:center;gap:12px;
        padding:11px 16px;
        background:${rowBg(idx)};
        border-radius:8px;margin-bottom:5px;
        border:1px solid ${C.border};
      ">
        ${badge(idx + 1)}
        <span style="font-size:14px;color:${C.textWhite};flex:1;font-weight:500;">${pos.label}</span>
        <span style="font-size:14px;color:${C.textYellow};font-weight:700;white-space:nowrap;">
          ${card.nameTh}${rev}
        </span>
      </div>
    `;
  }).join('');

  return `
    <div style="
      background:${C.pageBg};width:794px;min-height:1123px;
      padding:0;font-family:'Sarabun','Noto Sans Thai','Segoe UI',sans-serif;
    ">
      <!-- HEADER — gradient ม่วง→น้ำเงิน เหมือนปุ่มดูดวงรายเดือน -->
      <div style="
        background:linear-gradient(135deg,${C.purple},${C.purpleEnd});
        padding:30px 40px 24px;text-align:center;
      ">
        <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.65);
                    letter-spacing:4px;text-transform:uppercase;margin-bottom:6px;">
          MONTHLY READING
        </div>
        <div style="font-size:36px;font-weight:800;color:${C.textWhite};">
          🌙 ผลดูดวงรายเดือน
        </div>
        <div style="font-size:12px;color:rgba(255,255,255,0.6);margin-top:6px;">${currentDate}</div>
      </div>

      <!-- CONTENT -->
      <div style="padding:24px 40px 40px;">
        <div style="font-size:16px;font-weight:700;color:${C.textYellow};margin-bottom:14px;">
          📋 สรุปไพ่ทั้ง 10 ใบ
        </div>
        ${rows}
      </div>

      <!-- FOOTER -->
      <div style="position:absolute;bottom:0;left:0;right:0;
                  padding:10px 40px;border-top:1px solid ${C.border};
                  display:flex;justify-content:space-between;">
        <span style="font-size:11px;color:${C.textMuted};">🔮 New Tarot</span>
        <span style="font-size:11px;color:${C.textMuted};">${currentDate}</span>
      </div>
    </div>
  `;
};

// ================================================================
// TEMPLATE: หน้าไพ่แต่ละใบ Monthly
// ================================================================
const buildMonthlyCardHtml = (card, pos, meaning, index, total) => {
  const isReversed = card.isReversed;
  const statusText = isReversed ? 'กลับหัว' : 'ตั้งตรง';
  const statusColor = isReversed ? '#fca5a5' : '#86efac';

  // header gradient วนตาม accent
  const gradients = [
    `linear-gradient(135deg,${C.orange},${C.orangeEnd})`,
    `linear-gradient(135deg,${C.purple},${C.purpleEnd})`,
    `linear-gradient(135deg,${C.blue},${C.blueEnd})`,
    `linear-gradient(135deg,${C.green},${C.blue})`,
    `linear-gradient(135deg,${C.orange},${C.purple})`,
    `linear-gradient(135deg,${C.purpleEnd},${C.green})`,
  ];
  const headerGrad = gradients[index % gradients.length];
  const accentColor = BADGE_COLORS[index % BADGE_COLORS.length];

  const imgHtml = card.image
    ? `<img src="${card.image}" crossorigin="anonymous" style="
         width:160px;height:240px;object-fit:cover;border-radius:12px;display:block;
         border:2px solid ${accentColor};
         ${isReversed ? 'transform:rotate(180deg);' : ''}
       "/>`
    : `<div style="width:160px;height:240px;background:${C.cardBg};border-radius:12px;
                   border:2px solid ${C.border};
                   display:flex;align-items:center;justify-content:center;font-size:48px;">🎴</div>`;

  return `
    <div style="
      background:${C.pageBg};width:794px;min-height:1123px;
      padding:0;font-family:'Sarabun','Noto Sans Thai','Segoe UI',sans-serif;
      position:relative;
    ">
      <!-- HEADER BAR -->
      <div style="background:${headerGrad};padding:16px 24px;
                  display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-size:12px;color:rgba(255,255,255,0.7);font-weight:600;
                      letter-spacing:1px;text-transform:uppercase;">
            ตำแหน่งที่ ${pos.position} จาก 10
          </div>
          <div style="font-size:22px;font-weight:800;color:${C.textWhite};margin-top:3px;">
            ${pos.icon} ${pos.label}
          </div>
          <div style="font-size:12px;color:rgba(255,255,255,0.65);margin-top:2px;">
            ${pos.description}
          </div>
        </div>
        <!-- Page badge -->
        <div style="background:rgba(0,0,0,0.25);border-radius:10px;
                    padding:8px 14px;text-align:center;min-width:52px;">
          <div style="font-size:22px;font-weight:800;color:${C.textWhite};">${index + 1}</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.6);">/ ${total}</div>
        </div>
      </div>

      <!-- CARD SECTION -->
      <div style="padding:24px 32px;display:flex;gap:28px;align-items:flex-start;">
        <!-- รูปไพ่ -->
        <div style="flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:10px;">
          ${imgHtml}
          <span style="
            background:${isReversed ? '#7f1d1d' : '#14532d'};
            color:${statusColor};
            font-size:12px;padding:3px 12px;border-radius:20px;font-weight:600;
          ">${statusText}</span>
          <div style="font-size:11px;color:${C.textMuted};text-align:center;">
            ไพ่ที่ ${card.id} / 78
          </div>
        </div>

        <!-- ชื่อ + ความหมาย -->
        <div style="flex:1;min-width:0;">
          <div style="font-size:26px;font-weight:800;color:${C.textYellow};line-height:1.2;">
            ${card.nameTh || card.name}
          </div>
          <div style="font-size:13px;color:${C.textSub};margin-top:4px;font-style:italic;">
            ${card.name}
          </div>

          <!-- divider -->
          <div style="height:1px;background:${C.border};margin:16px 0;"></div>

          <div style="font-size:13px;font-weight:700;color:${accentColor};
                      letter-spacing:1px;text-transform:uppercase;margin-bottom:10px;">
            ✨ คำทำนาย
          </div>

          <!-- กล่องความหมาย -->
          <div style="
            background:${C.cardBg};border-radius:12px;
            padding:18px 20px;
            border-left:4px solid ${accentColor};
          ">
            <p style="font-size:14px;color:${C.textWhite};line-height:2;margin:0;word-break:break-word;">
              ${meaning || '-'}
            </p>
          </div>
        </div>
      </div>

      <!-- FOOTER -->
      <div style="position:absolute;bottom:0;left:0;right:0;
                  padding:10px 32px;border-top:1px solid ${C.border};
                  display:flex;justify-content:space-between;">
        <span style="font-size:11px;color:${C.textMuted};">🔮 New Tarot</span>
        <span style="font-size:11px;color:${C.textMuted};">
          ${new Date().toLocaleDateString('th-TH',{year:'numeric',month:'long',day:'numeric'})}
        </span>
      </div>
    </div>
  `;
};

// ================================================================
// TEMPLATE: Daily Reading
// ================================================================
const buildDailyCoverHtml = (card, category, meaning) => {
  const currentDate = new Date().toLocaleDateString('th-TH', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const isReversed = card.isReversed;
  const statusText = isReversed ? 'กลับหัว' : 'ตั้งตรง';
  const statusColor = isReversed ? '#fca5a5' : '#86efac';

  const categoryBadge = category
    ? `<div style="margin-top:10px;">
        <span style="
          display:inline-block;
          background:rgba(255,255,255,0.15);color:${C.textWhite};
          padding:4px 16px;border-radius:20px;
          font-size:13px;font-weight:600;
          border:1px solid rgba(255,255,255,0.3);
        ">${category.icon || ''} ${category.name}</span>
       </div>`
    : '';

  const imgHtml = card.image
    ? `<img src="${card.image}" crossorigin="anonymous" style="
         width:160px;height:240px;object-fit:cover;border-radius:12px;display:block;
         border:2px solid ${C.orange};
         ${isReversed ? 'transform:rotate(180deg);' : ''}
       "/>`
    : `<div style="width:160px;height:240px;background:${C.cardBg};border-radius:12px;
                   border:2px solid ${C.border};
                   display:flex;align-items:center;justify-content:center;font-size:48px;">🎴</div>`;

  return `
    <div style="
      background:${C.pageBg};width:794px;min-height:1123px;
      padding:0;font-family:'Sarabun','Noto Sans Thai','Segoe UI',sans-serif;
      position:relative;
    ">
      <!-- HEADER — gradient ส้ม→เหลือง เหมือนปุ่มดูดวงรายวัน -->
      <div style="
        background:linear-gradient(135deg,${C.orange},${C.orangeEnd});
        padding:30px 40px 24px;text-align:center;
      ">
        <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.7);
                    letter-spacing:4px;text-transform:uppercase;margin-bottom:6px;">
          DAILY READING
        </div>
        <div style="font-size:36px;font-weight:800;color:${C.textWhite};">
          🌅 ผลดูดวงรายวัน
        </div>
        <div style="font-size:12px;color:rgba(255,255,255,0.65);margin-top:6px;">${currentDate}</div>
        ${categoryBadge}
      </div>

      <!-- CARD SECTION -->
      <div style="padding:24px 32px;display:flex;gap:28px;align-items:flex-start;">
        <!-- รูปไพ่ -->
        <div style="flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:10px;">
          ${imgHtml}
          <span style="
            background:${isReversed ? '#7f1d1d' : '#14532d'};
            color:${statusColor};
            font-size:12px;padding:3px 12px;border-radius:20px;font-weight:600;
          ">${statusText}</span>
          <div style="font-size:11px;color:${C.textMuted};text-align:center;">
            ไพ่ที่ ${card.id} / 78
          </div>
        </div>

        <!-- ชื่อ + ความหมาย -->
        <div style="flex:1;min-width:0;">
          <div style="font-size:26px;font-weight:800;color:${C.textYellow};line-height:1.2;">
            ${card.nameTh || card.name}
          </div>
          <div style="font-size:13px;color:${C.textSub};margin-top:4px;font-style:italic;">
            ${card.name}
          </div>

          <!-- divider -->
          <div style="height:1px;background:${C.border};margin:16px 0;"></div>

          <div style="font-size:13px;font-weight:700;color:${C.orange};
                      letter-spacing:1px;text-transform:uppercase;margin-bottom:10px;">
            ✨ คำทำนาย
          </div>

          <!-- กล่องความหมาย -->
          <div style="
            background:${C.cardBg};border-radius:12px;
            padding:18px 20px;
            border-left:4px solid ${C.orange};
          ">
            <p style="font-size:14px;color:${C.textWhite};line-height:2;margin:0;word-break:break-word;">
              ${meaning || '-'}
            </p>
          </div>
        </div>
      </div>

      <!-- FOOTER -->
      <div style="position:absolute;bottom:0;left:0;right:0;
                  padding:10px 32px;border-top:1px solid ${C.border};
                  display:flex;justify-content:space-between;">
        <span style="font-size:11px;color:${C.textMuted};">🔮 New Tarot</span>
        <span style="font-size:11px;color:${C.textMuted};">${currentDate}</span>
      </div>
    </div>
  `;
};

// ================================================================
// PUBLIC API
// ================================================================
export const exportDailyReadingToPDF = async (card, category, meaning) => {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  await renderHtmlToPdfPage(pdf, buildDailyCoverHtml(card, category, meaning), true);
  pdf.save(`tarot-daily-${new Date().toISOString().slice(0, 10)}.pdf`);
};

export const exportMonthlyReadingToPDF = async (selectedCards, getPositionMeaning, positionLabels) => {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const currentDate = new Date().toLocaleDateString('th-TH', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  await renderHtmlToPdfPage(pdf, buildMonthlyCoverHtml(selectedCards, positionLabels, currentDate), true);
  for (let i = 0; i < selectedCards.length; i++) {
    const card    = selectedCards[i];
    const pos     = positionLabels[i];
    const meaning = getPositionMeaning(card.id, i);
    await renderHtmlToPdfPage(pdf, buildMonthlyCardHtml(card, pos, meaning, i, selectedCards.length), false);
  }
  pdf.save(`tarot-monthly-${new Date().toISOString().slice(0, 10)}.pdf`);
};

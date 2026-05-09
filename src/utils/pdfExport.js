import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// ---- สร้าง HTML element ชั่วคราว render แล้วแปลงเป็น canvas ----
const renderHtmlToPdfPage = async (pdf, htmlContent, isFirstPage = false) => {
  // สร้าง container ชั่วคราวนอกหน้าจอ
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: -9999px;
    left: -9999px;
    width: 794px;
    background: #0f172a;
    font-family: 'Sarabun', 'Noto Sans Thai', sans-serif;
  `;
  container.innerHTML = htmlContent;
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#0f172a',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.92);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // คำนวณความสูงตามสัดส่วน
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = pdfWidth / imgWidth;
    const scaledHeight = imgHeight * ratio;

    if (!isFirstPage) pdf.addPage();

    // ถ้าสูงเกิน 1 หน้า ให้ scale ให้พอดี
    if (scaledHeight <= pdfHeight) {
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, scaledHeight);
    } else {
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    }
  } finally {
    document.body.removeChild(container);
  }
};

// ---- Template: หน้าปก Daily ----
const buildDailyCoverHtml = (card, category, meaning, currentDate) => {
  const reversedBadge = card.isReversed
    ? `<span style="background:#7f1d1d;color:#fca5a5;padding:3px 10px;border-radius:20px;font-size:13px;">กลับหัว</span>`
    : '';

  const categoryHtml = category
    ? `<div style="margin-top:6px;">
        <span style="background:#1e3a5f;color:#93c5fd;padding:4px 14px;border-radius:20px;font-size:13px;">
          ${category.icon || ''} ${category.name}
        </span>
       </div>`
    : '';

  const imgHtml = card.image
    ? `<img src="${card.image}" crossorigin="anonymous"
         style="width:110px;height:165px;object-fit:cover;border-radius:10px;
                border:2px solid ${card.isReversed ? '#ef4444' : '#facc15'};
                ${card.isReversed ? 'transform:rotate(180deg);' : ''}
                box-shadow:0 0 20px rgba(250,204,21,0.3);" />`
    : `<div style="width:110px;height:165px;background:linear-gradient(135deg,#4c1d95,#1e3a8a);
                   border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:40px;">🎴</div>`;

  return `
    <div style="background:#0f172a;min-height:1122px;padding:0;color:white;">
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#312e81,#1e1b4b);padding:32px 40px 24px;">
        <div style="font-size:26px;font-weight:bold;color:#facc15;text-align:center;">🔮 ผลดูดวงรายวัน</div>
        <div style="font-size:14px;color:#94a3b8;text-align:center;margin-top:6px;">${currentDate}</div>
        ${categoryHtml}
      </div>

      <!-- Card section -->
      <div style="padding:32px 40px;display:flex;flex-direction:column;align-items:center;gap:16px;">
        ${imgHtml}
        <div style="text-align:center;margin-top:8px;">
          <div style="font-size:24px;font-weight:bold;color:#facc15;">${card.nameTh || card.name}</div>
          <div style="font-size:14px;color:#94a3b8;margin-top:4px;">${card.name}</div>
          <div style="margin-top:8px;">${reversedBadge}</div>
        </div>
      </div>

      <!-- Divider -->
      <div style="margin:0 40px;height:1px;background:linear-gradient(to right,transparent,#6366f1,transparent);"></div>

      <!-- Meaning -->
      <div style="padding:24px 40px;">
        <div style="font-size:15px;font-weight:bold;color:#a78bfa;margin-bottom:10px;">✨ ความหมาย / คำทำนาย</div>
        <div style="background:#1e293b;border-radius:12px;padding:20px;border:1px solid #334155;">
          <p style="font-size:14px;color:#e2e8f0;line-height:1.9;margin:0;">${meaning || '-'}</p>
        </div>
      </div>

      <!-- Footer -->
      <div style="position:absolute;bottom:0;left:0;right:0;background:#020617;padding:10px;text-align:center;">
        <span style="font-size:11px;color:#475569;">ไพ่ที่ ${card.id} จาก 78 ใบ  •  สร้างโดย Tarot Reading App</span>
      </div>
    </div>
  `;
};

// ---- Template: หน้าปก Monthly ----
const buildMonthlyCoverHtml = (selectedCards, positionLabels, currentDate) => {
  const rows = selectedCards.map((card, idx) => {
    const pos = positionLabels[idx];
    return `
      <div style="display:flex;align-items:center;gap:12px;padding:10px 14px;
                  background:${idx % 2 === 0 ? '#1e293b' : '#0f172a'};border-radius:8px;margin-bottom:4px;">
        <span style="color:#facc15;font-weight:bold;font-size:14px;min-width:24px;">${idx + 1}.</span>
        <span style="font-size:13px;color:#e2e8f0;flex:1;">${pos.label}</span>
        <span style="font-size:13px;color:#94a3b8;">
          ${card.nameTh}${card.isReversed ? ' <span style="color:#fca5a5;font-size:11px;">(กลับหัว)</span>' : ''}
        </span>
      </div>
    `;
  }).join('');

  return `
    <div style="background:#0f172a;min-height:1122px;padding:0;color:white;position:relative;">
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#312e81,#1e1b4b);padding:40px 40px 28px;">
        <div style="font-size:28px;font-weight:bold;color:#facc15;text-align:center;">🌙 ผลดูดวงรายเดือน</div>
        <div style="font-size:15px;color:#c7d2fe;text-align:center;margin-top:8px;">10-Card Spread</div>
        <div style="font-size:13px;color:#94a3b8;text-align:center;margin-top:6px;">${currentDate}</div>
      </div>

      <!-- Summary -->
      <div style="padding:28px 40px;">
        <div style="font-size:15px;font-weight:bold;color:#a78bfa;margin-bottom:14px;">📋 สรุปไพ่ทั้ง 10 ใบ</div>
        ${rows}
      </div>

      <!-- Footer -->
      <div style="position:absolute;bottom:0;left:0;right:0;background:#020617;padding:10px;text-align:center;">
        <span style="font-size:11px;color:#475569;">สร้างโดย Tarot Reading App</span>
      </div>
    </div>
  `;
};

// ---- Template: หน้าไพ่แต่ละใบ Monthly ----
const buildMonthlyCardHtml = (card, pos, meaning, index, total) => {
  const reversedBadge = card.isReversed
    ? `<span style="background:#7f1d1d;color:#fca5a5;padding:3px 10px;border-radius:20px;font-size:12px;">กลับหัว</span>`
    : '';

  const imgHtml = card.image
    ? `<img src="${card.image}" crossorigin="anonymous"
         style="width:90px;height:135px;object-fit:cover;border-radius:8px;
                border:2px solid ${card.isReversed ? '#ef4444' : '#facc15'};
                ${card.isReversed ? 'transform:rotate(180deg);' : ''}
                box-shadow:0 0 16px rgba(250,204,21,0.25);" />`
    : `<div style="width:90px;height:135px;background:linear-gradient(135deg,#4c1d95,#1e3a8a);
                   border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:36px;">🎴</div>`;

  return `
    <div style="background:#0f172a;min-height:1122px;padding:0;color:white;position:relative;">
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#312e81,#1e1b4b);padding:20px 40px 16px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div>
            <div style="font-size:12px;color:#93c5fd;font-weight:600;">ตำแหน่งที่ ${pos.position} จาก 10</div>
            <div style="font-size:20px;font-weight:bold;color:#facc15;margin-top:4px;">${pos.icon} ${pos.label}</div>
            <div style="font-size:12px;color:#94a3b8;margin-top:3px;">${pos.description}</div>
          </div>
          <div style="font-size:13px;color:#64748b;white-space:nowrap;padding-top:4px;">${index + 1} / ${total}</div>
        </div>
      </div>

      <!-- Card info -->
      <div style="padding:24px 40px;display:flex;gap:24px;align-items:flex-start;">
        <div style="flex-shrink:0;">${imgHtml}</div>
        <div style="flex:1;">
          <div style="font-size:22px;font-weight:bold;color:#facc15;">${card.nameTh || card.name}</div>
          <div style="font-size:13px;color:#94a3b8;margin-top:4px;">${card.name}</div>
          <div style="margin-top:8px;">${reversedBadge}</div>
          <div style="margin-top:12px;font-size:11px;color:#475569;">ไพ่ที่ ${card.id} จาก 78 ใบ</div>
        </div>
      </div>

      <!-- Divider -->
      <div style="margin:0 40px;height:1px;background:linear-gradient(to right,transparent,#6366f1,transparent);"></div>

      <!-- Meaning -->
      <div style="padding:20px 40px;">
        <div style="font-size:14px;font-weight:bold;color:#a78bfa;margin-bottom:10px;">✨ ความหมาย / คำทำนาย</div>
        <div style="background:#1e293b;border-radius:12px;padding:18px;border:1px solid #334155;">
          <p style="font-size:13.5px;color:#e2e8f0;line-height:2;margin:0;">${meaning || '-'}</p>
        </div>
      </div>

      <!-- Footer -->
      <div style="position:absolute;bottom:0;left:0;right:0;background:#020617;padding:10px;text-align:center;">
        <span style="font-size:11px;color:#475569;">สร้างโดย Tarot Reading App</span>
      </div>
    </div>
  `;
};

// ================================================================
// PUBLIC API
// ================================================================

/**
 * Export Daily Reading to PDF
 */
export const exportDailyReadingToPDF = async (card, category, meaning) => {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const currentDate = new Date().toLocaleDateString('th-TH', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const html = buildDailyCoverHtml(card, category, meaning, currentDate);
  await renderHtmlToPdfPage(pdf, html, true);

  const safeDate = new Date().toISOString().slice(0, 10);
  pdf.save(`tarot-daily-${safeDate}.pdf`);
};

/**
 * Export Monthly Reading (10 cards) to PDF
 */
export const exportMonthlyReadingToPDF = async (selectedCards, getPositionMeaning, positionLabels) => {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const currentDate = new Date().toLocaleDateString('th-TH', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  // หน้าปก
  const coverHtml = buildMonthlyCoverHtml(selectedCards, positionLabels, currentDate);
  await renderHtmlToPdfPage(pdf, coverHtml, true);

  // หน้าละ 1 ใบ
  for (let i = 0; i < selectedCards.length; i++) {
    const card = selectedCards[i];
    const pos = positionLabels[i];
    const meaning = getPositionMeaning(card.id, i);
    const html = buildMonthlyCardHtml(card, pos, meaning, i, selectedCards.length);
    await renderHtmlToPdfPage(pdf, html, false);
  }

  const safeDate = new Date().toISOString().slice(0, 10);
  pdf.save(`tarot-monthly-${safeDate}.pdf`);
};

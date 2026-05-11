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
    background: #faf7f2;
    font-family: 'Sarabun', 'Noto Sans Thai', 'Segoe UI', sans-serif;
  `;
  container.innerHTML = htmlContent;
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#faf7f2',
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
// SHARED STYLES
// ================================================================
const BASE_STYLE = `
  box-sizing: border-box;
  margin: 0;
  padding: 0;
`;

// palette
const C = {
  bg:        '#faf7f2',   // ครีมอุ่น
  bgCard:    '#ffffff',   // ขาว
  bgSection: '#f3eff8',   // ม่วงอ่อนมาก
  border:    '#e2d9f3',   // ม่วงอ่อน
  accent:    '#7c3aed',   // ม่วงเข้ม
  accentSoft:'#a78bfa',   // ม่วงกลาง
  gold:      '#b45309',   // ทองเข้ม (อ่านง่ายบนพื้นอ่อน)
  goldBg:    '#fef3c7',   // เหลืองอ่อน
  text:      '#1e1b2e',   // ดำม่วง
  textSub:   '#6b7280',   // เทา
  textLight: '#9ca3af',   // เทาอ่อน
  red:       '#dc2626',
  redBg:     '#fee2e2',
  headerBg:  '#ede9fe',   // ม่วงอ่อนมาก header
  divider:   '#ddd6fe',   // ม่วงอ่อน divider
};

const wrapPage = (inner) => `
  <div style="${BASE_STYLE}
    background:${C.bg};
    width:794px;
    min-height:1123px;
    position:relative;
    padding-bottom:48px;
  ">
    ${inner}
    <!-- footer -->
    <div style="position:absolute;bottom:0;left:0;right:0;
                padding:10px 40px;
                border-top:1px solid ${C.border};
                display:flex;justify-content:space-between;align-items:center;">
      <span style="font-size:11px;color:${C.textLight};">🔮 Tarot Reading App</span>
      <span style="font-size:11px;color:${C.textLight};">${new Date().toLocaleDateString('th-TH',{year:'numeric',month:'long',day:'numeric'})}</span>
    </div>
  </div>
`;

// ================================================================
// DAILY — หน้าเดียว
// ================================================================
const buildDailyCoverHtml = (card, category, meaning) => {
  const isReversed = card.isReversed;

  const categoryBadge = category
    ? `<span style="display:inline-block;background:${C.bgSection};color:${C.accent};
                    border:1px solid ${C.border};padding:4px 16px;border-radius:20px;
                    font-size:14px;font-weight:600;">${category.icon || ''} ${category.name}</span>`
    : '';

  const reversedBadge = isReversed
    ? `<span style="display:inline-block;background:${C.redBg};color:${C.red};
                    border:1px solid #fca5a5;padding:4px 14px;border-radius:20px;
                    font-size:13px;font-weight:600;">↩ กลับหัว</span>`
    : `<span style="display:inline-block;background:${C.goldBg};color:${C.gold};
                    border:1px solid #fcd34d;padding:4px 14px;border-radius:20px;
                    font-size:13px;font-weight:600;">↑ ตั้งตรง</span>`;

  const imgHtml = card.image
    ? `<img src="${card.image}" crossorigin="anonymous"
           style="width:180px;height:270px;object-fit:cover;border-radius:14px;
                  border:3px solid ${isReversed ? C.red : C.accentSoft};
                  ${isReversed ? 'transform:rotate(180deg);' : ''}
                  box-shadow:0 8px 32px rgba(124,58,237,0.18);" />`
    : `<div style="width:180px;height:270px;background:${C.bgSection};border-radius:14px;
                   border:3px solid ${C.border};display:flex;align-items:center;
                   justify-content:center;font-size:56px;">🎴</div>`;

  return wrapPage(`
    <!-- HEADER -->
    <div style="background:${C.headerBg};padding:32px 48px 24px;
                border-bottom:2px solid ${C.divider};text-align:center;">
      <div style="font-size:13px;color:${C.accentSoft};letter-spacing:3px;
                  text-transform:uppercase;font-weight:600;margin-bottom:8px;">Daily Reading</div>
      <div style="font-size:30px;font-weight:800;color:${C.accent};">🌅 ผลดูดวงรายวัน</div>
      ${categoryBadge ? `<div style="margin-top:12px;">${categoryBadge}</div>` : ''}
    </div>

    <!-- CARD SECTION -->
    <div style="padding:36px 48px;display:flex;gap:40px;align-items:flex-start;">

      <!-- รูปไพ่ -->
      <div style="flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:14px;">
        ${imgHtml}
        ${reversedBadge}
        <div style="font-size:11px;color:${C.textLight};text-align:center;">
          ไพ่ที่ ${card.id} จาก 78 ใบ
        </div>
      </div>

      <!-- ชื่อไพ่ + ความหมาย -->
      <div style="flex:1;min-width:0;">
        <div style="font-size:28px;font-weight:800;color:${C.text};line-height:1.2;">
          ${card.nameTh || card.name}
        </div>
        <div style="font-size:15px;color:${C.textSub};margin-top:6px;font-style:italic;">
          ${card.name}
        </div>

        <!-- divider -->
        <div style="height:2px;background:linear-gradient(to right,${C.divider},transparent);
                    margin:20px 0;border-radius:2px;"></div>

        <!-- label -->
        <div style="font-size:13px;font-weight:700;color:${C.accentSoft};
                    letter-spacing:1px;text-transform:uppercase;margin-bottom:10px;">
          ✨ คำทำนาย
        </div>

        <!-- meaning box -->
        <div style="background:${C.bgSection};border-radius:14px;padding:22px 24px;
                    border-left:4px solid ${C.accentSoft};">
          <p style="font-size:16px;color:${C.text};line-height:2.0;margin:0;
                    word-break:break-word;">${meaning || '-'}</p>
        </div>
      </div>
    </div>
  `);
};

// ================================================================
// MONTHLY — หน้าปก
// ================================================================
const buildMonthlyCoverHtml = (selectedCards, positionLabels) => {
  const rows = selectedCards.map((card, idx) => {
    const pos = positionLabels[idx];
    const rev = card.isReversed
      ? `<span style="background:${C.redBg};color:${C.red};font-size:10px;
                      padding:2px 8px;border-radius:10px;margin-left:6px;">กลับหัว</span>`
      : '';
    return `
      <div style="display:flex;align-items:center;gap:0;padding:11px 16px;
                  background:${idx % 2 === 0 ? C.bgCard : C.bgSection};
                  border-radius:10px;margin-bottom:5px;border:1px solid ${C.border};">
        <div style="width:28px;height:28px;background:${C.accent};border-radius:50%;
                    display:flex;align-items:center;justify-content:center;
                    font-size:13px;font-weight:800;color:white;flex-shrink:0;">
          ${idx + 1}
        </div>
        <div style="margin-left:14px;flex:1;min-width:0;">
          <div style="font-size:13px;color:${C.textSub};">${pos.icon} ${pos.label}</div>
        </div>
        <div style="font-size:14px;font-weight:700;color:${C.text};white-space:nowrap;">
          ${card.nameTh}${rev}
        </div>
      </div>
    `;
  }).join('');

  return wrapPage(`
    <!-- HEADER -->
    <div style="background:${C.headerBg};padding:40px 48px 28px;
                border-bottom:2px solid ${C.divider};text-align:center;">
      <div style="font-size:13px;color:${C.accentSoft};letter-spacing:3px;
                  text-transform:uppercase;font-weight:600;margin-bottom:8px;">Monthly Reading</div>
      <div style="font-size:32px;font-weight:800;color:${C.accent};">🌙 ผลดูดวงรายเดือน</div>
      <div style="font-size:15px;color:${C.textSub};margin-top:8px;">10-Card Spread</div>
    </div>

    <!-- SUMMARY -->
    <div style="padding:32px 48px;">
      <div style="font-size:15px;font-weight:700;color:${C.accent};
                  margin-bottom:16px;letter-spacing:0.5px;">📋 สรุปไพ่ทั้ง 10 ใบ</div>
      ${rows}
    </div>
  `);
};

// ================================================================
// MONTHLY — หน้าไพ่แต่ละใบ
// ================================================================
const buildMonthlyCardHtml = (card, pos, meaning, index, total) => {
  const isReversed = card.isReversed;

  const reversedBadge = isReversed
    ? `<span style="display:inline-block;background:${C.redBg};color:${C.red};
                    border:1px solid #fca5a5;padding:4px 14px;border-radius:20px;
                    font-size:13px;font-weight:600;">↩ กลับหัว</span>`
    : `<span style="display:inline-block;background:${C.goldBg};color:${C.gold};
                    border:1px solid #fcd34d;padding:4px 14px;border-radius:20px;
                    font-size:13px;font-weight:600;">↑ ตั้งตรง</span>`;

  const imgHtml = card.image
    ? `<img src="${card.image}" crossorigin="anonymous"
           style="width:160px;height:240px;object-fit:cover;border-radius:14px;
                  border:3px solid ${isReversed ? C.red : C.accentSoft};
                  ${isReversed ? 'transform:rotate(180deg);' : ''}
                  box-shadow:0 8px 28px rgba(124,58,237,0.15);" />`
    : `<div style="width:160px;height:240px;background:${C.bgSection};border-radius:14px;
                   border:3px solid ${C.border};display:flex;align-items:center;
                   justify-content:center;font-size:48px;">🎴</div>`;

  return wrapPage(`
    <!-- HEADER -->
    <div style="background:${C.headerBg};padding:22px 48px 18px;
                border-bottom:2px solid ${C.divider};">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div style="font-size:12px;color:${C.accentSoft};font-weight:700;
                      letter-spacing:1px;text-transform:uppercase;">
            ตำแหน่งที่ ${pos.position} จาก 10
          </div>
          <div style="font-size:22px;font-weight:800;color:${C.accent};margin-top:4px;">
            ${pos.icon} ${pos.label}
          </div>
          <div style="font-size:13px;color:${C.textSub};margin-top:3px;">${pos.description}</div>
        </div>
        <div style="background:${C.bgSection};border:1px solid ${C.border};
                    border-radius:10px;padding:8px 16px;text-align:center;">
          <div style="font-size:20px;font-weight:800;color:${C.accent};">${index + 1}</div>
          <div style="font-size:11px;color:${C.textLight};">/ ${total}</div>
        </div>
      </div>
    </div>

    <!-- CARD SECTION -->
    <div style="padding:30px 48px;display:flex;gap:36px;align-items:flex-start;">

      <!-- รูปไพ่ -->
      <div style="flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:12px;">
        ${imgHtml}
        ${reversedBadge}
        <div style="font-size:11px;color:${C.textLight};">ไพ่ที่ ${card.id} / 78</div>
      </div>

      <!-- ชื่อ + ความหมาย -->
      <div style="flex:1;min-width:0;">
        <div style="font-size:26px;font-weight:800;color:${C.text};line-height:1.2;">
          ${card.nameTh || card.name}
        </div>
        <div style="font-size:14px;color:${C.textSub};margin-top:5px;font-style:italic;">
          ${card.name}
        </div>

        <div style="height:2px;background:linear-gradient(to right,${C.divider},transparent);
                    margin:18px 0;border-radius:2px;"></div>

        <div style="font-size:13px;font-weight:700;color:${C.accentSoft};
                    letter-spacing:1px;text-transform:uppercase;margin-bottom:10px;">
          ✨ คำทำนาย
        </div>

        <div style="background:${C.bgSection};border-radius:14px;padding:20px 22px;
                    border-left:4px solid ${C.accentSoft};">
          <p style="font-size:15px;color:${C.text};line-height:2.0;margin:0;
                    word-break:break-word;">${meaning || '-'}</p>
        </div>
      </div>
    </div>
  `);
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

  await renderHtmlToPdfPage(pdf, buildMonthlyCoverHtml(selectedCards, positionLabels), true);

  for (let i = 0; i < selectedCards.length; i++) {
    const card = selectedCards[i];
    const pos  = positionLabels[i];
    const meaning = getPositionMeaning(card.id, i);
    await renderHtmlToPdfPage(pdf, buildMonthlyCardHtml(card, pos, meaning, i, selectedCards.length), false);
  }

  pdf.save(`tarot-monthly-${new Date().toISOString().slice(0, 10)}.pdf`);
};

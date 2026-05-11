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
    background: #e8e8e8;
    font-family: 'Sarabun', 'Noto Sans Thai', 'Segoe UI', sans-serif;
  `;
  container.innerHTML = htmlContent;
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#e8e8e8',
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
// COLOR PALETTE — จากรูปที่ 3
// ================================================================
const P = ['#845EC2', '#2C73D2', '#0081CF', '#0089BA', '#008E9B', '#008F7A'];

// สีหลักสำหรับ header (ใช้ gradient จาก P[0] → P[5])
const HEADER_BG = `linear-gradient(135deg, ${P[0]}, ${P[2]}, ${P[5]})`;

const C = {
  pageBg:   '#e8e8e8',
  white:    '#ffffff',
  textDark: '#1a1a1a',
  textGray: '#555555',
  textLight:'#888888',
  cardBg:   '#9e9e9e',
};

// badge เลขตำแหน่ง — วนสีจาก palette
const badge = (num) => {
  const bg = P[(num - 1) % P.length];
  return `<span style="
    display:inline-flex;align-items:center;justify-content:center;
    width:30px;height:30px;border-radius:50%;
    background:${bg};color:#fff;
    font-size:13px;font-weight:800;flex-shrink:0;
  ">${num}</span>`;
};

// row สรุปไพ่ — สีพื้นหลังใช้ P วนตามลำดับ (opacity 80%)
const rowBg = (idx) => {
  const hex = P[idx % P.length];
  return hex;
};

// ================================================================
// TEMPLATE: หน้าปก Monthly
// ================================================================
const buildMonthlyCoverHtml = (selectedCards, positionLabels, currentDate) => {
  const rows = selectedCards.map((card, idx) => {
    const pos = positionLabels[idx];
    const bg  = rowBg(idx);
    const rev = card.isReversed
      ? `<span style="font-size:11px;color:rgba(255,255,255,0.75);margin-left:6px;">(กลับหัว)</span>`
      : '';
    return `
      <div style="
        display:flex;align-items:center;gap:12px;
        padding:11px 16px;
        background:${bg};
        border-radius:8px;margin-bottom:5px;
      ">
        ${badge(idx + 1)}
        <span style="font-size:14px;color:#fff;flex:1;font-weight:500;">${pos.label}</span>
        <span style="font-size:14px;color:#fff;font-weight:700;white-space:nowrap;">
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
      <!-- HEADER -->
      <div style="background:${HEADER_BG};padding:30px 40px 24px;text-align:center;">
        <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.7);
                    letter-spacing:4px;text-transform:uppercase;margin-bottom:6px;">
          MONTHLY READING
        </div>
        <div style="font-size:36px;font-weight:800;color:#fff;">ผลดูดวงรายเดือน</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.65);margin-top:6px;">${currentDate}</div>
      </div>

      <!-- CONTENT -->
      <div style="padding:24px 40px 40px;">
        <div style="font-size:16px;font-weight:700;color:${C.textDark};margin-bottom:14px;">
          สรุปไพ่ทั้ง 10 ใบ
        </div>
        ${rows}
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
  // สีหัวหน้าไพ่ใช้ P วนตามลำดับ
  const headerBg = `linear-gradient(135deg, ${P[index % P.length]}, ${P[(index + 2) % P.length]})`;

  const imgHtml = card.image
    ? `<img src="${card.image}" crossorigin="anonymous" style="
         width:180px;height:270px;object-fit:cover;border-radius:12px;display:block;
         ${isReversed ? 'transform:rotate(180deg);' : ''}
       "/>`
    : `<div style="width:180px;height:270px;background:${C.cardBg};border-radius:12px;
                   display:flex;align-items:center;justify-content:center;font-size:48px;">🎴</div>`;

  // badge หน้า (ขาวบน gradient)
  const pageBadgeBg = P[index % P.length];

  return `
    <div style="
      background:${C.pageBg};width:794px;min-height:1123px;
      padding:0;font-family:'Sarabun','Noto Sans Thai','Segoe UI',sans-serif;
    ">
      <!-- HEADER BAR -->
      <div style="
        background:${headerBg};
        padding:16px 24px;
        display:flex;align-items:center;justify-content:space-between;
      ">
        <div>
          <div style="font-size:13px;color:rgba(255,255,255,0.75);font-weight:500;">
            ตำแหน่งที่ ${pos.position} จาก 10
          </div>
          <div style="font-size:22px;font-weight:800;color:#fff;margin-top:2px;">
            ${pos.label}
          </div>
        </div>
        <!-- Page badge -->
        <div style="
          background:${C.pageBg};border-radius:8px;
          padding:8px 14px;text-align:center;min-width:52px;
        ">
          <div style="font-size:22px;font-weight:800;color:${pageBadgeBg};">${index + 1}</div>
          <div style="font-size:11px;color:${C.textGray};">/10</div>
        </div>
      </div>

      <!-- CARD SECTION -->
      <div style="padding:28px 32px;display:flex;gap:28px;align-items:flex-start;">
        <!-- รูปไพ่ -->
        <div style="flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:10px;">
          ${imgHtml}
          <div style="font-size:13px;color:${C.textGray};text-align:center;">${statusText}</div>
          <div style="font-size:12px;color:${C.textLight};text-align:center;">ไพ่ใบที่ ${card.id}/78</div>
        </div>

        <!-- ชื่อ + ความหมาย -->
        <div style="flex:1;min-width:0;">
          <div style="font-size:28px;font-weight:800;color:${C.textDark};line-height:1.2;">
            ${card.nameTh || card.name}
          </div>
          <div style="font-size:14px;color:${C.textGray};margin-top:4px;font-style:italic;">
            ${card.name}
          </div>

          <div style="font-size:14px;font-weight:700;color:${C.textDark};margin:18px 0 8px;">
            คำทำนาย
          </div>

          <div style="
            background:${C.white};border-radius:12px;
            padding:20px 22px;
            box-shadow:2px 2px 8px rgba(0,0,0,0.08);
          ">
            <p style="font-size:14px;color:${C.textDark};line-height:1.9;margin:0;word-break:break-word;">
              ${meaning || '-'}
            </p>
          </div>
        </div>
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

  const categoryBadge = category
    ? `<div style="margin-top:8px;">
        <span style="
          display:inline-block;
          background:rgba(255,255,255,0.2);color:#fff;
          padding:4px 16px;border-radius:20px;
          font-size:13px;font-weight:600;
          border:1px solid rgba(255,255,255,0.35);
        ">${category.icon || ''} ${category.name}</span>
       </div>`
    : '';

  const imgHtml = card.image
    ? `<img src="${card.image}" crossorigin="anonymous" style="
         width:180px;height:270px;object-fit:cover;border-radius:12px;display:block;
         ${isReversed ? 'transform:rotate(180deg);' : ''}
       "/>`
    : `<div style="width:180px;height:270px;background:${C.cardBg};border-radius:12px;
                   display:flex;align-items:center;justify-content:center;font-size:48px;">🎴</div>`;

  return `
    <div style="
      background:${C.pageBg};width:794px;min-height:1123px;
      padding:0;font-family:'Sarabun','Noto Sans Thai','Segoe UI',sans-serif;
    ">
      <!-- HEADER -->
      <div style="background:${HEADER_BG};padding:30px 40px 24px;text-align:center;">
        <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.7);
                    letter-spacing:4px;text-transform:uppercase;margin-bottom:6px;">
          DAILY READING
        </div>
        <div style="font-size:36px;font-weight:800;color:#fff;">ผลดูดวงรายวัน</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.65);margin-top:6px;">${currentDate}</div>
        ${categoryBadge}
      </div>

      <!-- CARD SECTION -->
      <div style="padding:28px 32px;display:flex;gap:28px;align-items:flex-start;">
        <!-- รูปไพ่ -->
        <div style="flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:10px;">
          ${imgHtml}
          <div style="font-size:13px;color:${C.textGray};text-align:center;">${statusText}</div>
          <div style="font-size:12px;color:${C.textLight};text-align:center;">ไพ่ใบที่ ${card.id}/78</div>
        </div>

        <!-- ชื่อ + ความหมาย -->
        <div style="flex:1;min-width:0;">
          <div style="font-size:28px;font-weight:800;color:${C.textDark};line-height:1.2;">
            ${card.nameTh || card.name}
          </div>
          <div style="font-size:14px;color:${C.textGray};margin-top:4px;font-style:italic;">
            ${card.name}
          </div>

          <div style="font-size:14px;font-weight:700;color:${C.textDark};margin:18px 0 8px;">
            คำทำนาย
          </div>

          <div style="
            background:${C.white};border-radius:12px;
            padding:20px 22px;
            box-shadow:2px 2px 8px rgba(0,0,0,0.08);
          ">
            <p style="font-size:14px;color:${C.textDark};line-height:1.9;margin:0;word-break:break-word;">
              ${meaning || '-'}
            </p>
          </div>
        </div>
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

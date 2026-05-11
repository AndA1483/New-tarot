import { useState, useCallback } from 'react';
import { tarotCards } from '../data/tarotCards';
import { getPositionMeaning } from '../data/positionMeanings';
import Header from './Header';
import { exportMonthlyReadingToPDF } from '../utils/pdfExport';

// ตำแหน่ง 10 ช่องสำหรับดูดวงรายเดือน
const POSITION_LABELS = [
  { position: 1,  label: 'ตัวคุณเป็นเช่นไรในช่วงนี้',              icon: '🪞', description: 'สภาพจิตใจและพลังงานของคุณในขณะนี้' },
  { position: 2,  label: 'สิ่งที่ส่งผลต่อคุณในช่วงนี้',            icon: '🌊', description: 'ปัจจัยภายนอกหรือภายในที่กระทบชีวิตคุณ' },
  { position: 3,  label: 'อนาคตจะเป็นเช่นไร (เจ้านาย/ผู้ใหญ่)',   icon: '👑', description: 'ทิศทางที่กำลังจะเกิดขึ้น — มุมมองจากผู้มีอำนาจเหนือกว่า' },
  { position: 4,  label: 'ความเป็นอยู่ในช่วงที่ผ่านมา',            icon: '🏠', description: 'สภาพแวดล้อมและชีวิตความเป็นอยู่ที่ผ่านมา' },
  { position: 5,  label: 'สิ่งที่ผ่านมาในอดีต (ลูกน้อง/บริวาร)',  icon: '🌿', description: 'รากฐานและเหตุการณ์ในอดีตที่หล่อหลอมปัจจุบัน' },
  { position: 6,  label: 'สิ่งที่จะเกิดขึ้นในอนาคต',               icon: '🔭', description: 'เหตุการณ์หรือโอกาสที่กำลังจะมาถึง' },
  { position: 7,  label: 'แนวทางในการแก้ไขปัญหา',                  icon: '🗝️', description: 'วิธีรับมือและแนวทางที่ควรเดินหน้า' },
  { position: 8,  label: 'คนที่อยู่รอบตัว — เพื่อน & ครอบครัว',   icon: '🤝', description: 'อิทธิพลของคนใกล้ชิดที่มีต่อคุณ' },
  { position: 9,  label: 'ความคิดภายในใจ & สิ่งที่คาดหวัง',        icon: '💭', description: 'ความปรารถนาลึกๆ และความคาดหวังของคุณ' },
  { position: 10, label: 'บทสรุป',                                   icon: '✨', description: 'ผลลัพธ์สุดท้ายและบทเรียนของช่วงเวลานี้' },
];

const MAX_CARDS = 10;

// สับไพ่ด้วย Fisher-Yates — ไพ่ทุกใบเริ่มต้นเป็นด้านหลัง (faceDown: true)
const shuffleDeck = (deck) => {
  const arr = deck.map((card) => ({
    ...card,
    isReversed: Math.random() < 0.5,
    faceDown: true,
  }));
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// หน้าหลังไพ่
const CardBackFace = () => (
  <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950 flex items-center justify-center">
    <div className="w-10 h-14 border-2 border-purple-400/60 rounded flex items-center justify-center">
      <span className="text-purple-300 text-lg">✦</span>
    </div>
  </div>
);

const MonthlyReading = ({ onBack, onNavigate, currentPage }) => {
  const [phase, setPhase] = useState('select'); // 'select' | 'loading' | 'pray' | 'result'
  const [deck, setDeck] = useState(() => shuffleDeck(tarotCards));
  const [selectedCards, setSelectedCards] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [activeResultIndex, setActiveResultIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  // สับไพ่ใหม่
  const handleShuffle = useCallback(() => {
    setIsShuffling(true);
    setTimeout(() => {
      setDeck(shuffleDeck(tarotCards));
      setSelectedCards([]);
      setIsShuffling(false);
    }, 800);
  }, []);

  // เลือกไพ่
  const handleSelectCard = (card) => {
    if (selectedCards.length >= MAX_CARDS) return;
    if (selectedCards.find((c) => c.id === card.id)) return;
    setSelectedCards((prev) => [...prev, card]);
  };

  // ยกเลิกไพ่
  const handleDeselectCard = (cardId) => {
    setSelectedCards((prev) => prev.filter((c) => c.id !== cardId));
  };

  // ไปหน้าผล
  const handleShowResult = () => {
    setPhase('loading');
    setTimeout(() => {
      setPhase('pray');
    }, 3000);
  };

  const handlePrayDone = () => {
    setPhase('result');
    setActiveResultIndex(0);
  };

  // รีเซ็ตเลือกใหม่
  const handleReset = () => {
    setPhase('select');
    setSelectedCards([]);
    setDeck(shuffleDeck(tarotCards));
    setActiveResultIndex(0);
  };

  // Export PDF
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportMonthlyReadingToPDF(selectedCards, getPositionMeaning, POSITION_LABELS);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('ไม่สามารถสร้าง PDF ได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsExporting(false);
    }
  };

  // ---- หน้า Loading ----
  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-6">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
          </div>
          <p className="text-white text-xl">กำลังเตรียมไพ่...</p>
        </div>
      </div>
    );
  }

  // ---- หน้า จงตั้งจิตอธิษฐาน ----
  if (phase === 'pray') {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-6">
            <span className="text-7xl sm:text-8xl">🙏</span>
          </div>
          <h2 className="text-white text-3xl sm:text-4xl font-bold mb-4">จงตั้งจิตอธิษฐาน</h2>
          <p className="text-slate-300 text-base sm:text-lg mb-8">ขอให้สิ่งที่ปรารถนาจงเป็นจริง</p>
          <button
            onClick={handlePrayDone}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 active:from-purple-800 active:to-blue-800 text-white font-bold py-4 px-10 rounded-xl shadow-xl text-lg transition-all duration-200"
          >
            เปิดดูคำทำนาย
          </button>
        </div>
      </div>
    );
  }

  // ---- หน้าแสดงผลคำทำนาย ----
  if (phase === 'result') {
    const activeCard = selectedCards[activeResultIndex];
    const activePosition = POSITION_LABELS[activeResultIndex];

    return (
      <div className="min-h-screen bg-slate-800">
        <Header
          title={<div className="text-center">🌙 ผลดูดวงรายเดือน</div>}
          onBack={handleReset}
          onNavigate={onNavigate}
          currentPage={currentPage}
        />

        <div className="container mx-auto px-4 py-5 max-w-4xl">

          {/* ภาพรวมไพ่ทั้ง 10 ใบ */}
          <div className="bg-slate-700 border border-slate-600 rounded-xl p-3 sm:p-4 mb-5">
            <h3 className="text-white font-semibold text-center mb-3 text-sm sm:text-base">ไพ่ที่เลือก 10 ใบ</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {selectedCards.map((card, idx) => (
                <button
                  key={card.id}
                  onClick={() => setActiveResultIndex(idx)}
                  className={`flex flex-col items-center transition-all duration-200 ${
                    idx === activeResultIndex ? 'scale-110' : 'opacity-70'
                  }`}
                >
                  <div className={`w-10 h-14 sm:w-12 sm:h-16 rounded-lg overflow-hidden border-2 ${
                    idx === activeResultIndex
                      ? 'border-yellow-400 shadow-lg shadow-yellow-400/30'
                      : 'border-slate-500'
                  }`}>
                    <img
                      src={card.image}
                      alt={card.nameTh}
                      className={`w-full h-full object-cover ${card.isReversed ? 'rotate-180' : ''}`}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  <span className={`text-xs mt-1 font-bold ${
                    idx === activeResultIndex ? 'text-yellow-400' : 'text-slate-400'
                  }`}>{idx + 1}</span>
                </button>
              ))}
            </div>
          </div>

          {/* รายละเอียดไพ่ที่เลือก */}
          <div className="bg-slate-700 border border-slate-600 rounded-xl p-4 sm:p-6 mb-5">
            <div className="flex items-start gap-2 mb-4">
              <span className="text-xl sm:text-2xl flex-shrink-0">{activePosition.icon}</span>
              <div>
                <div className="text-yellow-400 text-xs sm:text-sm font-medium">ตำแหน่งที่ {activePosition.position}</div>
                <div className="text-white text-lg sm:text-xl font-bold leading-tight">{activePosition.label}</div>
                <div className="text-slate-400 text-xs sm:text-sm">{activePosition.description}</div>
              </div>
            </div>

            {/* รูปไพ่ + ข้อมูล — stack บน mobile, row บน md+ */}
            <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
              <div className="flex-shrink-0">
                <div className={`w-28 h-40 sm:w-32 sm:h-48 rounded-xl overflow-hidden border-2 border-yellow-400 shadow-xl shadow-yellow-400/20 ${activeCard.isReversed ? 'rotate-180' : ''}`}>
                  <img
                    src={activeCard.image}
                    alt={activeCard.nameTh}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.parentElement.innerHTML =
                        '<div class="w-full h-full bg-gradient-to-br from-purple-800 to-indigo-900 flex items-center justify-center"><span class="text-4xl">🎴</span></div>';
                    }}
                  />
                </div>
                {activeCard.isReversed && (
                  <div className="text-center mt-2">
                    <span className="bg-red-900 text-red-300 text-xs px-2 py-1 rounded-full">กลับหัว</span>
                  </div>
                )}
              </div>

              <div className="flex-1 w-full">
                <h2 className="text-white text-xl sm:text-2xl font-bold">{activeCard.nameTh}</h2>
                <p className="text-slate-400 text-sm mb-3">{activeCard.name}</p>
                <div className="bg-slate-800 rounded-lg p-4">
                  <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                    {getPositionMeaning(activeCard.id, activeResultIndex)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ปุ่มนำทาง */}
          <div className="flex justify-between items-center mb-5">
            <button
              onClick={() => setActiveResultIndex((i) => Math.max(0, i - 1))}
              disabled={activeResultIndex === 0}
              className="bg-slate-600 active:bg-slate-800 hover:bg-slate-500 disabled:opacity-40 text-white px-4 sm:px-5 py-3 rounded-lg transition-colors text-sm sm:text-base min-w-[80px]"
            >
              ← ก่อนหน้า
            </button>
            <span className="text-slate-300 text-sm">
              {activeResultIndex + 1} / {selectedCards.length}
            </span>
            <button
              onClick={() => setActiveResultIndex((i) => Math.min(selectedCards.length - 1, i + 1))}
              disabled={activeResultIndex === selectedCards.length - 1}
              className="bg-slate-600 active:bg-slate-800 hover:bg-slate-500 disabled:opacity-40 text-white px-4 sm:px-5 py-3 rounded-lg transition-colors text-sm sm:text-base min-w-[80px]"
            >
              ถัดไป →
            </button>
          </div>

          {/* สรุปทั้งหมด */}
          <div className="bg-slate-700 border border-slate-600 rounded-xl p-4 sm:p-6 mb-5">
            <h3 className="text-white font-bold text-base sm:text-lg mb-4 text-center">📋 สรุปคำทำนายทั้งหมด</h3>
            <div className="space-y-2">
              {selectedCards.map((card, idx) => {
                const pos = POSITION_LABELS[idx];
                return (
                  <button
                    key={card.id}
                    onClick={() => setActiveResultIndex(idx)}
                    className={`w-full text-left flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      idx === activeResultIndex
                        ? 'bg-blue-900 border border-blue-500'
                        : 'bg-slate-800 active:bg-slate-600 hover:bg-slate-600'
                    }`}
                  >
                    <span className="text-base flex-shrink-0">{pos.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-yellow-400 text-xs font-medium">{pos.position}.</span>
                        <span className="text-white text-xs sm:text-sm font-semibold truncate">{pos.label}</span>
                        {card.isReversed && (
                          <span className="bg-red-900 text-red-300 text-xs px-1.5 py-0.5 rounded flex-shrink-0">กลับหัว</span>
                        )}
                      </div>
                      <div className="text-slate-300 text-xs mt-0.5 truncate">🃏 {card.nameTh}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ปุ่มรีเซ็ต + Export */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pb-6">
            <button
              onClick={handleReset}
              className="w-full sm:w-auto bg-blue-600 active:bg-blue-800 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-200 text-base"
            >
              🔄 เลือกไพ่ใหม่
            </button>
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="w-full sm:w-auto bg-purple-600 active:bg-purple-800 hover:bg-purple-700 disabled:opacity-60 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-200 flex items-center gap-2 justify-center text-base"
            >
              {isExporting ? (
                <><span className="animate-spin">⏳</span> กำลังสร้าง PDF...</>
              ) : (
                <>📄 Export PDF</>
              )}
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ---- หน้าเลือกไพ่ ----
  return (
    <div className="min-h-screen bg-slate-800">
      <Header
        title={<div className="text-center">🌙 ดูดวงรายเดือน</div>}
        onBack={onBack}
        onNavigate={onNavigate}
        currentPage={currentPage}
      />

      <div className="container mx-auto px-4 py-6 max-w-6xl">

        {/* แถบสถานะ */}
        <div className="bg-slate-700 border border-slate-600 rounded-xl p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* ตัวเลข */}
              <div className="text-center">
                <div className="text-3xl font-bold text-white">
                  {selectedCards.length}
                  <span className="text-slate-400 text-xl">/{MAX_CARDS}</span>
                </div>
                <div className="text-slate-400 text-xs">เลือกแล้ว</div>
              </div>
              {/* Progress bar */}
              <div className="w-40 sm:w-56">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>เลือกแล้ว {selectedCards.length}/{MAX_CARDS}</span>
                  {selectedCards.length === MAX_CARDS && (
                    <span className="text-green-400">✓ ครบแล้ว!</span>
                  )}
                </div>
                <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                    style={{ width: `${(selectedCards.length / MAX_CARDS) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* ปุ่มสับไพ่ */}
            <button
              onClick={handleShuffle}
              disabled={isShuffling}
              className="flex items-center gap-2 bg-purple-700 hover:bg-purple-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 hover:scale-105"
            >
              <span className={isShuffling ? 'animate-spin inline-block' : ''}>🔀</span>
              {isShuffling ? 'กำลังสับไพ่...' : 'สับไพ่ใหม่'}
            </button>
          </div>

          {/* ไพ่ที่เลือกแล้ว */}
          {selectedCards.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-600">
              <p className="text-slate-400 text-xs mb-2">ไพ่ที่เลือก (คลิกเพื่อยกเลิก):</p>
              <div className="flex flex-wrap gap-2">
                {selectedCards.map((card, idx) => (
                  <button
                    key={card.id}
                    onClick={() => handleDeselectCard(card.id)}
                    className="flex items-center gap-1.5 bg-blue-900 hover:bg-red-900 border border-blue-600 hover:border-red-500 text-white text-xs px-2 py-1 rounded-full transition-colors group"
                    title="คลิกเพื่อยกเลิก"
                  >
                    <span className="text-yellow-400 font-bold">{idx + 1}</span>
                    <span className="text-slate-400 group-hover:text-red-300">✕</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ปุ่มดูผล (บน) */}
        {selectedCards.length === MAX_CARDS && (
          <div className="text-center mb-6">
            <button
              onClick={handleShowResult}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold py-4 px-12 rounded-xl shadow-xl text-lg transition-all duration-200 hover:scale-105 animate-pulse"
            >
              ✨ ดูคำทำนาย
            </button>
          </div>
        )}

        {/* กริดไพ่ทั้งหมด — แสดงด้านหลังไพ่ */}
        <div className="bg-slate-700 border border-slate-600 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-1 text-center">
            ไพ่ทั้งหมด {deck.length} ใบ
          </h3>
          <p className="text-slate-400 text-xs text-center mb-4">คลิกเพื่อเลือกไพ่ — เลือกได้ {MAX_CARDS} ใบ</p>
          <div
            className={`grid gap-2 transition-opacity duration-300 ${isShuffling ? 'opacity-20' : 'opacity-100'}`}
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(56px, 1fr))' }}
          >
            {deck.map((card, idx) => {
              const selectedIndex = selectedCards.findIndex((c) => c.id === card.id);
              const isSelected = selectedIndex !== -1;
              const isFull = selectedCards.length >= MAX_CARDS && !isSelected;

              return (
                <button
                  key={`${card.id}-${idx}`}
                  onClick={() => isSelected ? handleDeselectCard(card.id) : handleSelectCard(card)}
                  disabled={isFull}
                  className={`relative flex flex-col items-center rounded-lg p-1 transition-all duration-150 ${
                    isSelected
                      ? 'ring-2 ring-yellow-400 bg-yellow-900/30 scale-95'
                      : isFull
                      ? 'opacity-25 cursor-not-allowed'
                      : 'hover:bg-slate-600 hover:scale-105 cursor-pointer'
                  }`}
                  title={isSelected ? `ใบที่ ${selectedIndex + 1} — คลิกเพื่อยกเลิก` : 'คลิกเพื่อเลือก'}
                >
                  {/* ไพ่ด้านหลัง */}
                  <div className="w-12 h-18 rounded-md overflow-hidden border border-slate-500 relative"
                    style={{ height: '68px' }}>
                    <CardBackFace />
                    {/* overlay หมายเลขเมื่อเลือกแล้ว */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-yellow-400/30 flex items-center justify-center">
                        <span className="bg-yellow-400 text-slate-900 font-bold text-sm w-7 h-7 rounded-full flex items-center justify-center shadow-lg">
                          {selectedIndex + 1}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* หมายเลขใบ */}
                  <span
                    className={`text-center leading-tight mt-1 ${
                      isSelected ? 'text-yellow-400 font-semibold' : 'text-slate-500'
                    }`}
                    style={{ fontSize: '9px' }}
                  >
                    {isSelected ? `ใบที่ ${selectedIndex + 1}` : '?'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ปุ่มดูผล (ล่าง) */}
        {selectedCards.length === MAX_CARDS && (
          <div className="text-center mt-6">
            <button
              onClick={handleShowResult}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold py-4 px-12 rounded-xl shadow-xl text-lg transition-all duration-200 hover:scale-105"
            >
              ✨ ดูคำทำนาย
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyReading;

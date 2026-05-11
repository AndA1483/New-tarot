import React, { useState } from "react";
import { getRandomCard } from "../data/tarotCards";
import TarotCard from "./TarotCard";
import FlippableCard from "./FlippableCard";
import CategorySelector from "./CategorySelector";
import Header from "./Header";
import { exportDailyReadingToPDF } from "../utils/pdfExport";

const DailyReading = ({ onBack, onNavigate, currentPage }) => {
  const [drawnCard, setDrawnCard] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategorySelector, setShowCategorySelector] = useState(true);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  const [showCardSelection, setShowCardSelection] = useState(false);
  const [availableCards, setAvailableCards] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  const startCardSelection = () => {
    // Generate 5 random cards for selection
    const cards = [];
    for (let i = 0; i < 5; i++) {
      cards.push(getRandomCard());
    }
    setAvailableCards(cards);
    setShowCardSelection(true);
  };

  const selectCard = (selectedCard) => {
    setIsDrawing(true);
    setTimeout(() => {
      setDrawnCard(selectedCard);
      setIsDrawing(false);
      setShowCardSelection(false);
    }, 1000);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowCategorySelector(false);
  };

  const resetReading = () => {
    setDrawnCard(null);
    setSelectedCategory(null);
    setShowCategorySelector(true);
    setIsCardFlipped(false);
    setShowCardSelection(false);
    setAvailableCards([]);
  };

  const handleCardFlip = () => {
    setIsCardFlipped(!isCardFlipped);
  };

  const handleExportPDF = async () => {
    if (!drawnCard || !isCardFlipped) return;
    setIsExporting(true);
    try {
      // ดึงความหมายจาก TarotCard component โดยใช้ category
      const { getCardMeaning } = await import('../data/tarotCards');
      const meaning = getCardMeaning(drawnCard, selectedCategory?.id || 'general');
      await exportDailyReadingToPDF(drawnCard, selectedCategory, meaning);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('ไม่สามารถสร้าง PDF ได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsExporting(false);
    }
  };

  // Show category selector first
  if (showCategorySelector) {
    return (
      <CategorySelector 
        onSelectCategory={handleCategorySelect}
        onBack={onBack}
        onNavigate={onNavigate}
        currentPage={currentPage}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-800">
      <Header
        title={
          <div className="text-center leading-tight">
            <div>🌅 ดูดวงรายวัน</div>
            {selectedCategory && (
              <div className="mt-1">
                <span className="bg-blue-600 px-2 py-0.5 rounded-full text-white text-xs sm:text-sm">
                  {selectedCategory.icon} {selectedCategory.name}
                </span>
              </div>
            )}
          </div>
        }
        onBack={onBack}
        onNavigate={onNavigate}
        currentPage={currentPage}
      />

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">

            {/* ── ยังไม่ได้เลือกไพ่ ── */}
            {!drawnCard && !isDrawing && !showCardSelection && (
              <div className="space-y-5">
                <div className="bg-slate-700 border border-slate-600 rounded-xl p-6 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3">
                    เตรียมพร้อมสำหรับวันใหม่
                  </h2>
                  <p className="text-slate-300 text-sm sm:text-base mb-5">
                    กดปุ่มด้านล่างเพื่อสุ่มไพ่ 1 ใบ และดูดวงสำหรับวันนี้
                  </p>
                  <div className="w-28 h-40 sm:w-32 sm:h-48 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg flex items-center justify-center mb-5">
                    <span className="text-4xl">🎴</span>
                  </div>
                </div>
                <button
                  onClick={startCardSelection}
                  className="w-full sm:w-auto bg-blue-600 active:bg-blue-800 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-200 text-base"
                >
                  🎯 เลือกไพ่ดูดวง
                </button>
              </div>
            )}

            {/* ── เลือกไพ่ ── */}
            {showCardSelection && !isDrawing && (
              <div className="space-y-5">
                <div className="bg-slate-700 border border-slate-600 rounded-xl p-5 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                    เลือกไพ่ของคุณ
                  </h2>
                  <p className="text-slate-300 text-sm sm:text-base mb-5">
                    แตะที่ไพ่ใบที่คุณรู้สึกดึงดูด
                  </p>
                  {/* 3 cols on mobile, 5 on sm+ */}
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4 max-w-sm sm:max-w-2xl mx-auto">
                    {availableCards.map((card, index) => (
                      <div
                        key={index}
                        className="cursor-pointer active:scale-95 hover:scale-105 transition-all duration-200"
                      >
                        <FlippableCard
                          card={card}
                          isFlipped={false}
                          onFlip={() => selectCard(card)}
                          size="medium"
                          showFlipButton={false}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── กำลังสุ่ม ── */}
            {isDrawing && (
              <div className="bg-slate-700 border border-slate-600 rounded-xl p-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">
                  กำลังสุ่มไพ่...
                </h2>
                <div className="w-28 h-40 sm:w-32 sm:h-48 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg flex items-center justify-center animate-pulse">
                  <span className="text-4xl animate-spin">🎴</span>
                </div>
              </div>
            )}

            {/* ── แสดงผลไพ่ ── */}
            {drawnCard && (
              <div className="space-y-5">
                <div className="bg-slate-700 border border-slate-600 rounded-xl p-5 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-semibold text-white mb-5">
                    ไพ่ของคุณวันนี้
                  </h2>

                  <div className="mb-6">
                    <FlippableCard
                      card={drawnCard}
                      isFlipped={isCardFlipped}
                      onFlip={handleCardFlip}
                      size="large"
                    />
                  </div>

                  {isCardFlipped && (
                    <div className="mt-6 animate-fade-in">
                      <TarotCard card={drawnCard} category={selectedCategory?.id} />
                    </div>
                  )}
                </div>

                {/* ปุ่ม — full-width บน mobile */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={resetReading}
                    className="w-full sm:w-auto bg-green-600 active:bg-green-800 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-200 text-base"
                  >
                    🔄 สุ่มไพ่ใหม่
                  </button>

                  {isCardFlipped && (
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
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyReading;
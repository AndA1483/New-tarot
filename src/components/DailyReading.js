import React, { useState } from "react";
import { getRandomCard } from "../data/tarotCards";
import TarotCard from "./TarotCard";
import FlippableCard from "./FlippableCard";
import CategorySelector from "./CategorySelector";
import Header from "./Header";

const DailyReading = ({ onBack, onNavigate, currentPage }) => {
  const [drawnCard, setDrawnCard] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategorySelector, setShowCategorySelector] = useState(true);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  const [showCardSelection, setShowCardSelection] = useState(false);
  const [availableCards, setAvailableCards] = useState([]);

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
          <div className="text-center">
            <div>🌅 ดูดวงรายวัน</div>
            {selectedCategory && (
              <div className="mt-1">
                <span className="bg-blue-600 px-3 py-1 rounded-full text-white text-sm">
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

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">

          <div className="text-center">
            {!drawnCard && !isDrawing && (
              <div className="space-y-6">
                <div className="bg-slate-700 border border-slate-600 rounded-xl p-8">
                  <h2 className="text-2xl font-semibold text-white mb-4">
                    เตรียมพร้อมสำหรับวันใหม่
                  </h2>
                  <p className="text-slate-300 mb-6">
                    กดปุ่มด้านล่างเพื่อสุ่มไพ่ 1 ใบ และดูดวงสำหรับวันนี้
                  </p>
                  <div className="w-32 h-48 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg flex items-center justify-center mb-6">
                    <span className="text-4xl">🎴</span>
                  </div>
                </div>
                
                <button
                  onClick={startCardSelection}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  🎯 เลือกไพ่ดูดวง
                </button>
              </div>
            )}

            {showCardSelection && !isDrawing && (
              <div className="space-y-6">
                <div className="bg-slate-700 border border-slate-600 rounded-xl p-8">
                  <h2 className="text-2xl font-semibold text-white mb-4">
                    เลือกไพ่ของคุณ
                  </h2>
                  <p className="text-slate-300 mb-6">
                    คลิกที่ไพ่ใบใดใบหนึ่งที่คุณรู้สึกดึงดูด
                  </p>
                  <div className="grid grid-cols-5 gap-4 max-w-2xl mx-auto">
                    {availableCards.map((card, index) => (
                      <div key={index} className="cursor-pointer transform hover:scale-105 transition-all duration-200">
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

            {isDrawing && (
              <div className="space-y-6">
                <div className="bg-slate-700 border border-slate-600 rounded-xl p-8">
                  <h2 className="text-2xl font-semibold text-white mb-4">
                    กำลังสุ่มไพ่...
                  </h2>
                  <div className="w-32 h-48 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg flex items-center justify-center animate-pulse">
                    <span className="text-4xl animate-spin">🎴</span>
                  </div>
                </div>
              </div>
            )}

            {drawnCard && (
              <div className="space-y-6">
                <div className="bg-slate-700 border border-slate-600 rounded-xl p-8">
                  <h2 className="text-2xl font-semibold text-white mb-6">
                    ไพ่ของคุณวันนี้
                  </h2>
                  
                  {/* Flippable Card */}
                  <div className="mb-8">
                    <FlippableCard 
                      card={drawnCard}
                      isFlipped={isCardFlipped}
                      onFlip={handleCardFlip}
                      size="large"
                    />
                  </div>

                  {/* Show card details when flipped */}
                  {isCardFlipped && (
                    <div className="mt-8 animate-fade-in">
                      <TarotCard card={drawnCard} category={selectedCategory?.id} />
                    </div>
                  )}
                </div>
                
                <button
                  onClick={resetReading}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  🔄 สุ่มไพ่ใหม่
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyReading;
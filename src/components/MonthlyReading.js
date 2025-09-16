import React, { useState } from 'react';
import { getRandomCards } from '../data/tarotCards';
import TarotCard from './TarotCard';
import FlippableCard from './FlippableCard';
import CategorySelector from './CategorySelector';

const MonthlyReading = ({ onBack }) => {
  const [drawnCards, setDrawnCards] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategorySelector, setShowCategorySelector] = useState(true);
  const [flippedCards, setFlippedCards] = useState({});

  const drawCards = () => {
    setIsDrawing(true);
    setTimeout(() => {
      const cards = getRandomCards(10);
      setDrawnCards(cards);
      setCurrentCardIndex(0);
      setIsDrawing(false);
    }, 1500);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowCategorySelector(false);
  };

  const resetReading = () => {
    setDrawnCards([]);
    setCurrentCardIndex(0);
    setSelectedCategory(null);
    setShowCategorySelector(true);
    setFlippedCards({});
  };

  const handleCardFlip = (cardIndex) => {
    setFlippedCards(prev => ({
      ...prev,
      [cardIndex]: !prev[cardIndex]
    }));
  };

  const nextCard = () => {
    if (currentCardIndex < drawnCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  // Show category selector first
  if (showCategorySelector) {
    return (
      <CategorySelector 
        onSelectCategory={handleCategorySelect}
        onBack={onBack}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-800">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="text-slate-300 hover:text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium"
            >
              ← กลับ
            </button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">🌙 ดูดวงรายเดือน</h1>
              {selectedCategory && (
                <div className="mt-1">
                  <span className="bg-blue-600 px-3 py-1 rounded-full text-white text-sm">
                    {selectedCategory.icon} {selectedCategory.name}
                  </span>
                </div>
              )}
            </div>
            <div></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">

          <div className="text-center">
            {drawnCards.length === 0 && !isDrawing && (
              <div className="space-y-6">
                <div className="bg-slate-700 border border-slate-600 rounded-xl p-8">
                  <h2 className="text-2xl font-semibold text-white mb-4">
                    ดูดวงสำหรับเดือนนี้
                  </h2>
                  <p className="text-slate-300 mb-6">
                    กดปุ่มด้านล่างเพื่อสุ่มไพ่ 10 ใบ และดูดวงรายเดือน
                  </p>
                  <div className="grid grid-cols-5 gap-2 max-w-md mx-auto mb-6">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="w-16 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-lg flex items-center justify-center">
                        <span className="text-lg">🎴</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={drawCards}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  🎯 สุ่มไพ่ดูดวง
                </button>
              </div>
            )}

            {isDrawing && (
              <div className="space-y-6">
                <div className="bg-slate-700 border border-slate-600 rounded-xl p-8">
                  <h2 className="text-2xl font-semibold text-white mb-4">
                    กำลังสุ่มไพ่ 10 ใบ...
                  </h2>
                  <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="w-16 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-lg flex items-center justify-center animate-pulse">
                        <span className="text-lg animate-spin">🎴</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {drawnCards.length > 0 && (
              <div className="space-y-6">
                <div className="bg-slate-700 border border-slate-600 rounded-xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-white">
                      ไพ่ที่ {currentCardIndex + 1} จาก 10 ใบ
                    </h2>
                    <div className="text-slate-300">
                      {currentCardIndex + 1}/10
                    </div>
                  </div>
                  
                  {/* Flippable Card */}
                  <div className="mb-8">
                    <FlippableCard 
                      card={drawnCards[currentCardIndex]}
                      isFlipped={flippedCards[currentCardIndex] || false}
                      onFlip={() => handleCardFlip(currentCardIndex)}
                      size="large"
                    />
                  </div>

                  {/* Show card details when flipped */}
                  {flippedCards[currentCardIndex] && (
                    <div className="mt-8 animate-fade-in">
                      <TarotCard card={drawnCards[currentCardIndex]} category={selectedCategory?.id} />
                    </div>
                  )}
                  
                  <div className="flex justify-center space-x-4 mt-6">
                    <button
                      onClick={prevCard}
                      disabled={currentCardIndex === 0}
                      className="bg-slate-600 hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      ← ไพ่ก่อนหน้า
                    </button>
                    <button
                      onClick={nextCard}
                      disabled={currentCardIndex === drawnCards.length - 1}
                      className="bg-slate-600 hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      ไพ่ถัดไป →
                    </button>
                  </div>
                  
                  <div className="flex justify-center mt-4">
                    <div className="flex space-x-1">
                      {drawnCards.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentCardIndex(index)}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            index === currentCardIndex 
                              ? 'bg-blue-500' 
                              : 'bg-slate-500 hover:bg-slate-400'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Overview Section */}
                <div className="bg-slate-700 border border-slate-600 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 text-center">
                    ภาพรวมไพ่ทั้งหมด
                  </h3>
                  <div className="grid grid-cols-5 gap-3 max-w-2xl mx-auto">
                    {drawnCards.map((card, index) => (
                      <div key={index} className="relative">
                        <FlippableCard 
                          card={card}
                          isFlipped={flippedCards[index] || false}
                          onFlip={() => handleCardFlip(index)}
                          size="small"
                        />
                        <div className="text-center mt-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            index === currentCardIndex 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-slate-600 text-slate-300'
                          }`}>
                            {index + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-slate-400 text-sm text-center mt-4">
                    คลิกที่ไพ่เพื่อเปิดดู หรือใช้ปุ่มด้านบนเพื่อดูทีละใบ
                  </p>
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

export default MonthlyReading;
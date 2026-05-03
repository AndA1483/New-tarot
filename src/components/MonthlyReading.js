import React, { useState } from 'react';
import { getRandomCards } from '../data/tarotCards';
import TarotCard from './TarotCard';
import FlippableCard from './FlippableCard';

const MonthlyReading = ({ onBack }) => {
  const [drawnCards, setDrawnCards] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flippedCards, setFlippedCards] = useState({});

  // Spread meanings for the 10-card monthly reading
  const spreadMeanings = [
    "ตัวคุณเป็นเช่นไรในช่วงนี้",
    "สิ่งที่ส่งผลต่อคุณในช่วงนี้",
    "อนาคตจะเป็นเช่นไร (เจ้านาย/ผู้ใหญ่)",
    "ความเป็นอยู่ในช่วงที่ผ่านมา",
    "สิ่งที่ผ่านมาในอดีต (ลูกน้อง/บริวาร)",
    "สิ่งที่จะเกิดขึ้นในอนาคต",
    "แนวทางในการแก้ไขปัญหา",
    "คนที่อยู่รอบตัว - เพื่อน ครอบครัว",
    "ความคิดภายในใจ สิ่งที่คาดหวัง",
    "บทสรุป"
  ];

  const drawCards = () => {
    setIsDrawing(true);
    setTimeout(() => {
      const cards = getRandomCards(10);
      setDrawnCards(cards);
      setCurrentCardIndex(0);
      setIsDrawing(false);
    }, 1500);
  };

  const resetReading = () => {
    setDrawnCards([]);
    setCurrentCardIndex(0);
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
              <p className="text-slate-400 text-sm mt-1">การแจกแจง 10 ใบไพ่</p>
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

                  {/* Spread Meaning */}
                  <div className="bg-blue-600 border border-blue-500 rounded-lg p-4 mb-6">
                    <p className="text-white text-lg font-semibold">
                      📍 {spreadMeanings[currentCardIndex]}
                    </p>
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
                      <TarotCard card={drawnCards[currentCardIndex]} category="general" />
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
                  <div className="space-y-3 max-w-2xl mx-auto">
                    {drawnCards.map((card, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-slate-600 rounded-lg hover:bg-slate-500 transition-colors cursor-pointer" onClick={() => setCurrentCardIndex(index)}>
                        <div className="flex-shrink-0 w-10 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-grow">
                          <p className="text-white font-semibold">{spreadMeanings[index]}</p>
                          <p className="text-slate-300 text-sm">{card.nameTh}</p>
                        </div>
                        <div className="flex-shrink-0">
                          {flippedCards[index] ? (
                            <span className="text-lg">✓</span>
                          ) : (
                            <span className="text-slate-400">🔽</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-slate-400 text-sm text-center mt-4">
                    คลิกที่รายการเพื่อดูไพ่แต่ละใบ
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
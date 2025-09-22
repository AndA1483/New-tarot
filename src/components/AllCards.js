import React, { useState } from "react";
import { getAllCards } from "../data/tarotCards";
import TarotCard from "./TarotCard";
import Header from "./Header";

const AllCards = ({ onBack, onNavigate, currentPage }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const allCards = getAllCards();

  return (
    <div
      className="min-h-screen bg-slate-800 bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          "linear-gradient(rgba(30, 41, 59, 0.8), rgba(30, 41, 59, 0.8)), url('/bg1.jpg')",
      }}
    >
      <Header 
        title="📚 ความหมายไพ่ทั้งหมด" 
        onBack={onBack} 
        onNavigate={onNavigate}
        currentPage={currentPage}
      />

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {!selectedCard ? (
            <div className="space-y-8">
              <div className="text-center">
                <p className="text-slate-300 text-lg mb-8">
                  เลือกไพ่ที่คุณต้องการดูความหมาย (ทั้งหมด 78 ใบ)
                </p>
              </div>

              {/* Major Arcana */}
              <div className="bg-slate-700 border border-slate-600 rounded-xl p-6">
                <h2 className="text-2xl font-semibold text-white mb-6 text-center">
                  🌟 ไพ่ใหญ่ (22 ใบ)
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {allCards.slice(0, 22).map((card) => (
                    <button
                      key={card.id}
                      onClick={() => setSelectedCard(card)}
                      className="bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white p-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 text-center"
                    >
                      <div className="text-2xl mb-2">🎴</div>
                      <div className="text-sm font-medium">{card.nameTh}</div>
                      <div className="text-xs opacity-75">{card.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* ไพ่เล็ก */}
              <div className="bg-slate-700 border border-slate-600 rounded-xl p-6">
                <h2 className="text-2xl font-semibold text-white mb-6 text-center">
                  ⚡ ไพ่เล็ก (56 ใบ)
                </h2>

                {/* ไม้เท้า */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-4">
                    🔥 ไม้เท้า
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {allCards.slice(22, 36).map((card) => (
                      <button
                        key={card.id}
                        onClick={() => setSelectedCard(card)}
                        className="bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white p-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 text-center"
                      >
                        <div className="text-lg mb-1">🔥</div>
                        <div className="text-xs font-medium">{card.nameTh}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ถ้วย */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-blue-400 mb-4">
                    💧 ถ้วย
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {allCards.slice(36, 50).map((card) => (
                      <button
                        key={card.id}
                        onClick={() => setSelectedCard(card)}
                        className="bg-gradient-to-br from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 text-white p-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 text-center"
                      >
                        <div className="text-lg mb-1">💧</div>
                        <div className="text-xs font-medium">{card.nameTh}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ดาบ */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-300 mb-4">
                    ⚔️ ดาบ
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {allCards.slice(50, 64).map((card) => (
                      <button
                        key={card.id}
                        onClick={() => setSelectedCard(card)}
                        className="bg-gradient-to-br from-gray-500 to-slate-600 hover:from-gray-400 hover:to-slate-500 text-white p-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 text-center"
                      >
                        <div className="text-lg mb-1">⚔️</div>
                        <div className="text-xs font-medium">{card.nameTh}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* เหรียญ */}
                <div>
                  <h3 className="text-lg font-semibold text-green-400 mb-4">
                    🪙 เหรียญ
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {allCards.slice(64, 78).map((card) => (
                      <button
                        key={card.id}
                        onClick={() => setSelectedCard(card)}
                        className="bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white p-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 text-center"
                      >
                        <div className="text-lg mb-1">🪙</div>
                        <div className="text-xs font-medium">{card.nameTh}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="bg-slate-700 border border-slate-600 rounded-xl p-8">
                <button
                  onClick={() => setSelectedCard(null)}
                  className="mb-6 bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  ← กลับไปดูไพ่ทั้งหมด
                </button>
                <TarotCard card={selectedCard} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllCards;

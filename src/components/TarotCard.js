import React, { useState } from "react";

const TarotCard = ({ card, category = 'general' }) => {
  const [imageError, setImageError] = useState(false);

  const getCardIcon = (cardName) => {
    if (cardName.includes("Wands") || cardName.includes("ไม้เท้า")) return "🔥";
    if (cardName.includes("Cups") || cardName.includes("ถ้วย")) return "💧";
    if (cardName.includes("Swords") || cardName.includes("ดาบ")) return "⚔️";
    if (cardName.includes("Pentacles") || cardName.includes("เหรียญ"))
      return "🪙";
    return "✨"; // สำหรับไพ่ใหญ่
  };

  const getCardColor = (cardName, isReversed) => {
    let baseColor;
    if (cardName.includes("Wands") || cardName.includes("ไม้เท้า"))
      baseColor = "from-orange-500 to-red-700";
    else if (cardName.includes("Cups") || cardName.includes("ถ้วย"))
      baseColor = "from-blue-500 to-cyan-700";
    else if (cardName.includes("Swords") || cardName.includes("ดาบ"))
      baseColor = "from-gray-500 to-slate-700";
    else if (cardName.includes("Pentacles") || cardName.includes("เหรียญ"))
      baseColor = "from-green-500 to-emerald-700";
    else baseColor = "from-purple-600 to-pink-700"; // สำหรับไพ่ใหญ่

    // Add darker tone for reversed cards
    if (isReversed) {
      return baseColor + " opacity-90";
    }
    return baseColor;
  };

  const getCardMeaning = () => {
    // Import the function here to avoid circular dependency
    const { getCardMeaning: getCardMeaningFunc } = require('../data/tarotCards');
    const meaning = getCardMeaningFunc(card, category);
    
    if (card.isReversed) {
      return `(กลับหัว) ความหมายตรงข้าม หรือพลังงานที่ถูกบล็อก: ${meaning}`;
    }
    
    return meaning;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="max-w-md mx-auto">
      <div
        className={`bg-gradient-to-br ${getCardColor(
          card.name,
          card.isReversed
        )} rounded-xl shadow-2xl p-8 text-white transform hover:scale-105 transition-all duration-300 ${
          card.isReversed ? "ring-2 ring-red-400" : ""
        }`}
      >
        <div className="text-center">
          {/* Reversed indicator */}
          {card.isReversed && (
            <div className="mb-4">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                🔄 กลับหัว
              </span>
            </div>
          )}

          {/* Card Title Section */}
          <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 mb-6">
            <h3 className="text-3xl font-bold mb-2 text-white drop-shadow-lg">
              {card.nameTh}
              {card.isReversed && (
                <span className="text-red-300 ml-2">(กลับหัว)</span>
              )}
            </h3>

            <p className="text-xl font-semibold text-white/90 drop-shadow-md">
              {card.name}
            </p>
          </div>

          {/* Card Image */}
          <div className="mb-6">
            {card.image && !imageError ? (
              <img
                src={card.image}
                alt={card.nameTh}
                onError={handleImageError}
                className={`w-40 h-70 mx-auto rounded-lg shadow-lg object-cover border-2 border-white/30 transition-transform duration-300 ${
                  card.isReversed ? "transform rotate-180" : ""
                }`}
              />
            ) : (
              <div
                className={`w-40 h-60 mx-auto bg-slate-700/50 border border-slate-600 rounded-lg shadow-lg flex items-center justify-center transition-transform duration-300 ${
                  card.isReversed ? "transform rotate-180" : ""
                }`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-2">{getCardIcon(card.name)}</div>
                  <div className="text-sm opacity-75">{card.nameTh}</div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-6">
            <h4 className="text-lg font-semibold mb-3">🔮 ความหมาย</h4>
            <p className="text-base leading-relaxed">
              {getCardMeaning()}
            </p>
          </div>

          <div className="mt-6 text-sm opacity-75">
            ไพ่ที่ {card.id} จาก 78 ใบ{" "}
            {card.isReversed ? "• กลับหัว" : "• ตั้งตรง"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TarotCard;

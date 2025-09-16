import React, { useState } from "react";

const FlippableCard = ({
  card,
  onFlip,
  isFlipped = false,
  showFlipButton = true,
  size = "medium",
}) => {
  const [imageError, setImageError] = useState(false);

  const getCardIcon = (cardName) => {
    if (cardName.includes("Wands") || cardName.includes("ไม้เท้า")) return "🔥";
    if (cardName.includes("Cups") || cardName.includes("ถ้วย")) return "💧";
    if (cardName.includes("Swords") || cardName.includes("ดาบ")) return "⚔️";
    if (cardName.includes("Pentacles") || cardName.includes("เหรียญ"))
      return "🪙";
    return "✨"; // สำหรับไพ่ใหญ่
  };

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return {
          container: "w-20 h-32",
          image: "w-full h-full",
          text: "text-xs",
          icon: "text-lg",
        };
      case "large":
        return {
          container: "w-48 h-72",
          image: "w-full h-full",
          text: "text-sm",
          icon: "text-4xl",
        };
      default: // medium
        return {
          container: "w-32 h-48",
          image: "w-full h-full",
          text: "text-xs",
          icon: "text-2xl",
        };
    }
  };

  const sizeClasses = getSizeClasses();

  const handleImageError = () => {
    setImageError(true);
  };

  const handleCardClick = () => {
    if (onFlip) {
      onFlip();
    }
  };

  return (
    <div className="relative group">
      <div
        className={`${
          sizeClasses.container
        } mx-auto cursor-pointer transform transition-all duration-500 preserve-3d ${
          isFlipped ? "rotate-y-180" : ""
        } ${showFlipButton ? "hover:scale-105" : ""}`}
        onClick={handleCardClick}
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
      >
        {/* Card Back */}
        <div
          className={`absolute inset-0 ${sizeClasses.container} rounded-lg shadow-lg backface-hidden`}
          style={{
            backfaceVisibility: "hidden",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <div className="w-full h-full relative overflow-hidden rounded-lg border-2 border-slate-600">
            <img
              src="/bg.png"
              alt="Card Back"
              className="w-full h-full object-cover"
              onError={() => {
                // Fallback if bg.png doesn't load
                const fallback = document.createElement("div");
                fallback.className =
                  "w-full h-full bg-gradient-to-br from-purple-800 to-blue-900 flex items-center justify-center";
                fallback.innerHTML =
                  '<div class="text-white text-center"><div class="text-4xl mb-2">🔮</div><div class="text-sm">ทาโรต์</div></div>';
              }}
            />
            {/* Overlay pattern for better visibility */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-blue-900/30"></div>

            {/* Card back design */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-3xl mb-2">🔮</div>
                <div className="text-xs font-semibold">ทาโรต์</div>
              </div>
            </div>
          </div>
        </div>

        {/* Card Front */}
        <div
          className={`absolute inset-0 ${sizeClasses.container} rounded-lg shadow-lg backface-hidden`}
          style={{
            backfaceVisibility: "hidden",
            transform: isFlipped ? "rotateY(0deg)" : "rotateY(180deg)",
          }}
        >
          {card && (
            <div className="w-full h-full relative">
              {/* Card Image or Icon */}
              {card.image && !imageError ? (
                <img
                  src={card.image}
                  alt={card.nameTh}
                  onError={handleImageError}
                  className={`${
                    sizeClasses.image
                  } rounded-lg object-cover border-2 border-slate-600 ${
                    card.isReversed ? "transform rotate-180" : ""
                  }`}
                />
              ) : (
                <div
                  className={`${
                    sizeClasses.container
                  } bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-600 rounded-lg flex items-center justify-center ${
                    card.isReversed ? "transform rotate-180" : ""
                  }`}
                >
                  <div className="text-center text-white">
                    <div className={`${sizeClasses.icon} mb-1`}>
                      {getCardIcon(card.name)}
                    </div>
                    <div className={`${sizeClasses.text} opacity-75 px-1`}>
                      {card.nameTh}
                    </div>
                  </div>
                </div>
              )}

              {/* Reversed indicator */}
              {card.isReversed && (
                <div className="absolute top-1 right-1">
                  <span className="bg-red-500 text-white px-1 py-0.5 rounded text-xs font-semibold">
                    🔄
                  </span>
                </div>
              )}

              {/* Card name overlay for small cards */}
              {size === "small" && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 rounded-b-lg">
                  <div className="truncate">{card.nameTh}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Flip instruction */}
      {showFlipButton && !isFlipped && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-slate-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            คลิกเพื่อเปิดไพ่
          </div>
        </div>
      )}

      {/* Flip back instruction */}
      {showFlipButton && isFlipped && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-slate-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            คลิกเพื่อพลิกกลับ
          </div>
        </div>
      )}
    </div>
  );
};

export default FlippableCard;

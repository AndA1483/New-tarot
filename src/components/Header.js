import React from 'react';

const Header = ({ 
  title, 
  onBack, 
  showBackButton = true, 
  backButtonText = "← กลับ",
  rightButton = null,
  isHomePage = false,
  onNavigate = null
}) => {
  if (isHomePage) {
    return (
      <header className="bg-slate-900 border-b border-slate-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🔮</span>
              <span className="text-xl font-bold text-white">ทาโรต์</span>
            </div>

            {/* Navigation Menu */}
            <nav className="flex space-x-1">
              <button
                onClick={() => onNavigate("home")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium"
              >
                หน้าแรก
              </button>
              <button
                onClick={() => onNavigate("daily")}
                className="text-slate-300 hover:text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium"
              >
                ดูดวงรายวัน
              </button>
              <button
                onClick={() => onNavigate("monthly")}
                className="text-slate-300 hover:text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium"
              >
                ดูดวงรายเดือน
              </button>
              <button
                onClick={() => onNavigate("all-cards")}
                className="text-slate-300 hover:text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium"
              >
                ไพ่ทั้งหมด
              </button>
              <button
                onClick={() => onNavigate("blog")}
                className="text-slate-300 hover:text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium"
              >
                บล็อก
              </button>
            </nav>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-slate-900 border-b border-slate-700">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {showBackButton ? (
            <button
              onClick={onBack}
              className="text-slate-300 hover:text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium"
            >
              {backButtonText}
            </button>
          ) : (
            <div></div>
          )}
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {rightButton || <div></div>}
        </div>
      </div>
    </header>
  );
};

export default Header;
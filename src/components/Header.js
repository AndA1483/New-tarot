import React from "react";

const Header = ({
  title,
  onBack,
  showBackButton = true,
  backButtonText = "← กลับ",
  rightButton = null,
  onNavigate = null,
  currentPage = null,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-700">
      <div className="container mx-auto px-6 py-4">
        {/* Top row with logo and navigation */}
        <div className="flex items-center justify-between mb-2">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src="/logo-01.png" alt="ทาโรต์ โลโก้" className="w-10 h-10" />
            <span className="text-xl font-bold text-white">New Tarot</span>
          </div>

          {/* Navigation Menu */}
          {onNavigate && (
            <nav className="flex space-x-1">
              <button
                onClick={() => onNavigate("home")}
                className={`px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium ${
                  currentPage === "home"
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                หน้าแรก
              </button>
              <button
                onClick={() => onNavigate("daily")}
                className={`px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium ${
                  currentPage === "daily"
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                ดูดวงรายวัน
              </button>
              <button
                onClick={() => onNavigate("monthly")}
                className={`px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium ${
                  currentPage === "monthly"
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                ดูดวงรายเดือน
              </button>
              <button
                onClick={() => onNavigate("all-cards")}
                className={`px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium ${
                  currentPage === "all-cards"
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                ไพ่ทั้งหมด
              </button>
              <button
                onClick={() => onNavigate("blog")}
                className={`px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium ${
                  currentPage === "blog"
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                บล็อก
              </button>
            </nav>
          )}
        </div>

        {/* Bottom row with back button, title, and right button */}
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

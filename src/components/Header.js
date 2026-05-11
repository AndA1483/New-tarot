import React, { useState } from "react";

const NAV_ITEMS = [
  { key: "home",      label: "หน้าแรก",       icon: "🏠" },
  { key: "daily",     label: "ดูดวงรายวัน",   icon: "🌅" },
  { key: "monthly",   label: "ดูดวงรายเดือน", icon: "🌙" },
  { key: "all-cards", label: "ไพ่ทั้งหมด",    icon: "📚" },
  { key: "blog",      label: "บล็อก",          icon: "✍️" },
];

const Header = ({
  title,
  onBack,
  showBackButton = true,
  backButtonText = "← กลับ",
  rightButton = null,
  onNavigate = null,
  currentPage = null,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6">

        {/* ── แถวบน: logo + hamburger (mobile) / nav (desktop) ── */}
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <img src="/logo-01.png" alt="โลโก้" className="w-8 h-8 sm:w-10 sm:h-10" />
            <span className="text-base sm:text-xl font-bold text-white">New Tarot</span>
          </div>

          {/* Desktop nav */}
          {onNavigate && (
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.key}
                  onClick={() => onNavigate(item.key)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                    currentPage === item.key
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:text-white hover:bg-slate-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          )}

          {/* Hamburger (mobile) */}
          {onNavigate && (
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              aria-label="เมนู"
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Mobile dropdown menu */}
        {onNavigate && menuOpen && (
          <div className="md:hidden border-t border-slate-700 py-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => { onNavigate(item.key); setMenuOpen(false); }}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  currentPage === item.key
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* ── แถวล่าง: back + title + right ── */}
        <div className="flex items-center justify-between py-2 sm:py-3">
          {showBackButton ? (
            <button
              onClick={onBack}
              className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors min-w-[64px]"
            >
              {backButtonText}
            </button>
          ) : (
            <div className="min-w-[64px]" />
          )}

          <h1 className="text-lg sm:text-2xl font-bold text-white text-center flex-1 px-2 truncate">
            {title}
          </h1>

          <div className="min-w-[64px] flex justify-end">
            {rightButton || null}
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;

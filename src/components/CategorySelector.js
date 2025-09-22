import React from 'react';
import { readingCategories } from '../data/tarotCards';
import Header from './Header';

const CategorySelector = ({ onSelectCategory, onBack, onNavigate, currentPage }) => {
  return (
    <div className="min-h-screen bg-slate-800">
      <Header 
        title="🔮 เลือกหัวข้อการทำนาย" 
        onBack={onBack} 
        onNavigate={onNavigate}
        currentPage={currentPage}
      />

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="bg-slate-700 border border-slate-600 rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                คุณต้องการทำนายเรื่องอะไร?
              </h2>
              <p className="text-slate-300 text-lg">
                เลือกหัวข้อที่คุณสนใจเพื่อรับคำทำนายที่ตรงใจ
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {readingCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onSelectCategory(category)}
                  className={`bg-gradient-to-br ${category.color} hover:scale-105 transform transition-all duration-300 rounded-xl shadow-lg p-8 text-white group`}
                >
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    {category.name}
                  </h3>
                  <div className="w-full h-1 bg-white/30 rounded-full mt-4">
                    <div className="h-full bg-white rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-12 bg-slate-700 border border-slate-600 rounded-xl p-6">
              <p className="text-slate-300 text-sm">
                ✨ แต่ละหัวข้อจะให้คำทำนายที่เฉพาะเจาะจงและตรงประเด็น ✨
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySelector;
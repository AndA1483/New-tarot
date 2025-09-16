import React, { useState } from 'react';
import HomePage from './components/HomePage';
import DailyReading from './components/DailyReading';
import MonthlyReading from './components/MonthlyReading';
import AllCards from './components/AllCards';
import BlogPost from './components/BlogPost';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleBack = () => {
    setCurrentPage('home');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'daily':
        return <DailyReading onBack={handleBack} />;
      case 'monthly':
        return <MonthlyReading onBack={handleBack} />;
      case 'all-cards':
        return <AllCards onBack={handleBack} />;
      case 'blog':
        return <BlogPost onBack={handleBack} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentPage()}
    </div>
  );
}

export default App;
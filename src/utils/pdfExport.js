import jsPDF from 'jspdf';

// Function to export single card reading to PDF
export const exportCardToPDF = async (card, category = 'general', isReversed = false) => {
  const { getCardMeaning } = require('../data/tarotCards');
  
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Set Thai font (using default font for now)
  pdf.setFont('helvetica');
  
  // Title
  pdf.setFontSize(20);
  pdf.setTextColor(75, 0, 130); // Purple color
  pdf.text('🔮 ผลการทำนายไพ่ทาโรต์', pageWidth / 2, 30, { align: 'center' });
  
  // Date
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  const currentDate = new Date().toLocaleDateString('th-TH');
  pdf.text(`วันที่: ${currentDate}`, pageWidth / 2, 45, { align: 'center' });
  
  // Category
  if (category !== 'general') {
    const categoryNames = {
      love: '❤️ ความรัก',
      career: '💼 การงาน', 
      money: '💰 การเงิน',
      health: '🧠 สุขภาพ',
      luck: '🎯 โชคลาภ / การตัดสินใจ'
    };
    
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`หัวข้อการทำนาย: ${categoryNames[category] || category}`, 20, 65);
  }
  
  // Card name
  pdf.setFontSize(18);
  pdf.setTextColor(139, 69, 19); // Brown color
  const cardTitle = `${card.nameTh}${isReversed ? ' (กลับหัว)' : ''}`;
  pdf.text(cardTitle, pageWidth / 2, 85, { align: 'center' });
  
  pdf.setFontSize(14);
  pdf.setTextColor(100, 100, 100);
  pdf.text(card.name, pageWidth / 2, 100, { align: 'center' });
  
  // Card meaning
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  pdf.text('🔮 ความหมาย:', 20, 125);
  
  // Get meaning based on category
  let meaning = getCardMeaning(card, category);
  if (isReversed) {
    meaning = `(กลับหัว) ความหมายตรงข้าม หรือพลังงานที่ถูกบล็อก: ${meaning}`;
  }
  
  // Split long text into multiple lines
  pdf.setFontSize(12);
  const splitText = pdf.splitTextToSize(meaning, pageWidth - 40);
  pdf.text(splitText, 20, 145);
  
  // Card info
  pdf.setFontSize(10);
  pdf.setTextColor(150, 150, 150);
  pdf.text(`ไพ่ที่ ${card.id} จาก 78 ใบ`, 20, pageHeight - 20);
  
  // Footer
  pdf.text('สร้างโดย: ระบบทำนายไพ่ทาโรต์ออนไลน์', pageWidth / 2, pageHeight - 10, { align: 'center' });
  
  // Save PDF
  const fileName = `tarot-reading-${card.nameTh}-${currentDate}.pdf`;
  pdf.save(fileName);
};

// Function to export multiple cards reading to PDF
export const exportMultipleCardsToPDF = async (cards, category = 'general') => {
  const { getCardMeaning } = require('../data/tarotCards');
  
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Set Thai font
  pdf.setFont('helvetica');
  
  // Title page
  pdf.setFontSize(24);
  pdf.setTextColor(75, 0, 130);
  pdf.text('🔮 ผลการทำนายไพ่ทาโรต์', pageWidth / 2, 50, { align: 'center' });
  pdf.text('รายเดือน', pageWidth / 2, 75, { align: 'center' });
  
  // Date
  pdf.setFontSize(14);
  pdf.setTextColor(100, 100, 100);
  const currentDate = new Date().toLocaleDateString('th-TH');
  pdf.text(`วันที่: ${currentDate}`, pageWidth / 2, 100, { align: 'center' });
  
  // Category
  if (category !== 'general') {
    const categoryNames = {
      love: '❤️ ความรัก',
      career: '💼 การงาน', 
      money: '💰 การเงิน',
      health: '🧠 สุขภาพ',
      luck: '🎯 โชคลาภ / การตัดสินใจ'
    };
    
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`หัวข้อการทำนาย: ${categoryNames[category] || category}`, pageWidth / 2, 125, { align: 'center' });
  }
  
  // Summary
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`จำนวนไพ่ทั้งหมด: ${cards.length} ใบ`, pageWidth / 2, 150, { align: 'center' });
  
  // Add each card on separate page
  cards.forEach((card, index) => {
    pdf.addPage();
    
    // Page header
    pdf.setFontSize(16);
    pdf.setTextColor(75, 0, 130);
    pdf.text(`ไพ่ที่ ${index + 1} จาก ${cards.length} ใบ`, pageWidth / 2, 30, { align: 'center' });
    
    // Card name
    pdf.setFontSize(18);
    pdf.setTextColor(139, 69, 19);
    const cardTitle = `${card.nameTh}${card.isReversed ? ' (กลับหัว)' : ''}`;
    pdf.text(cardTitle, pageWidth / 2, 55, { align: 'center' });
    
    pdf.setFontSize(14);
    pdf.setTextColor(100, 100, 100);
    pdf.text(card.name, pageWidth / 2, 70, { align: 'center' });
    
    // Card meaning
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text('🔮 ความหมาย:', 20, 95);
    
    // Get meaning
    let meaning = getCardMeaning(card, category);
    if (card.isReversed) {
      meaning = `(กลับหัว) ความหมายตรงข้าม หรือพลังงานที่ถูกบล็อก: ${meaning}`;
    }
    
    // Split text
    pdf.setFontSize(12);
    const splitText = pdf.splitTextToSize(meaning, pageWidth - 40);
    pdf.text(splitText, 20, 115);
    
    // Card info
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`ไพ่ที่ ${card.id} จาก 78 ใบ • ${card.isReversed ? 'กลับหัว' : 'ตั้งตรง'}`, 20, pageHeight - 20);
  });
  
  // Save PDF
  const fileName = `tarot-monthly-reading-${currentDate}.pdf`;
  pdf.save(fileName);
};

// Function to export all cards meanings to PDF
export const exportAllCardsToPDF = async () => {
  const { getAllCards } = require('../data/tarotCards');
  const allCards = getAllCards();
  
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Title page
  pdf.setFont('helvetica');
  pdf.setFontSize(24);
  pdf.setTextColor(75, 0, 130);
  pdf.text('📚 ความหมายไพ่ทาโรต์', pageWidth / 2, 50, { align: 'center' });
  pdf.text('ทั้งหมด 78 ใบ', pageWidth / 2, 75, { align: 'center' });
  
  // Date
  pdf.setFontSize(14);
  pdf.setTextColor(100, 100, 100);
  const currentDate = new Date().toLocaleDateString('th-TH');
  pdf.text(`วันที่: ${currentDate}`, pageWidth / 2, 100, { align: 'center' });
  
  // Table of contents
  pdf.addPage();
  pdf.setFontSize(18);
  pdf.setTextColor(0, 0, 0);
  pdf.text('📋 สารบัญ', 20, 30);
  
  pdf.setFontSize(12);
  let yPos = 50;
  
  // ส่วนไพ่ใหญ่
  pdf.setFontSize(14);
  pdf.setTextColor(139, 69, 19);
  pdf.text('🌟 ไพ่ใหญ่ (22 ใบ)', 20, yPos);
  yPos += 15;
  
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  allCards.slice(0, 22).forEach((card, index) => {
    if (yPos > pageHeight - 30) {
      pdf.addPage();
      yPos = 30;
    }
    pdf.text(`${index + 1}. ${card.nameTh} (${card.name})`, 30, yPos);
    yPos += 8;
  });
  
  // ส่วนไพ่เล็ก
  yPos += 10;
  if (yPos > pageHeight - 50) {
    pdf.addPage();
    yPos = 30;
  }
  
  pdf.setFontSize(14);
  pdf.setTextColor(139, 69, 19);
  pdf.text('⚡ ไพ่เล็ก (56 ใบ)', 20, yPos);
  yPos += 15;
  
  // Add each card
  allCards.forEach((card, index) => {
    pdf.addPage();
    
    // Card header
    pdf.setFontSize(16);
    pdf.setTextColor(75, 0, 130);
    pdf.text(`${index + 1}. ${card.nameTh}`, pageWidth / 2, 30, { align: 'center' });
    
    pdf.setFontSize(14);
    pdf.setTextColor(100, 100, 100);
    pdf.text(card.name, pageWidth / 2, 45, { align: 'center' });
    
    // Card meaning
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text('🔮 ความหมาย:', 20, 70);
    
    pdf.setFontSize(12);
    const splitText = pdf.splitTextToSize(card.meaning, pageWidth - 40);
    pdf.text(splitText, 20, 90);
    
    // Card info
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`ไพ่ที่ ${card.id} จาก 78 ใบ`, 20, pageHeight - 20);
  });
  
  // Save PDF
  const fileName = `tarot-all-cards-meanings-${currentDate}.pdf`;
  pdf.save(fileName);
};
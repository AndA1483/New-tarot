import React, { useState, useEffect } from "react";
import Header from './Header';

const HomePage = ({ onNavigate }) => {
  // Gallery slider state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Gallery images from public/s folder
  const galleryImages = [
    {
      id: 1,
      src: "/s/S1.jpg",
      alt: "ไพ่ทาโรต์ชุดที่ 1",
      title: "ไพ่ทาโรต์คลาสสิก",
      description: "ไพ่ทาโรต์แบบดั้งเดิมที่เต็มไปด้วยสัญลักษณ์ลึกลับ",
    },
    {
      id: 2,
      src: "/s/s2.jpg",
      alt: "ไพ่ทาโรต์ชุดที่ 2",
      title: "ไพ่ทาโรต์สมัยใหม่",
      description: "ไพ่ทาโรต์ดีไซน์ใหม่ที่ผสมผสานความเก่าและใหม่",
    },
    {
      id: 3,
      src: "/s/s5.png",
      alt: "ไพ่ทาโรต์ชุดที่ 3",
      title: "ไพ่ทาโรต์พิเศษ",
      description: "ไพ่ทาโรต์ที่มีความหมายลึกซึ้งและพิเศษ",
    },
    {
      id: 4,
      src: "/s/oz0yncsuxlev.webp",
      alt: "ไพ่ทาโรต์ชุดที่ 4",
      title: "ไพ่ทาโรต์ลึกลับ",
      description: "ไพ่ทาโรต์ที่เต็มไปด้วยความลึกลับและพลังงาน",
    },
  ];

  // Blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "ความหมายของไพ่ The Fool ในชีวิตประจำวัน",
      excerpt:
        "ไพ่ The Fool เป็นไพ่แรกใน Major Arcana ที่สื่อถึงการเริ่มต้นใหม่ การผจญภัย และความกล้าหาญในการก้าวไปข้างหน้า...",
      date: "15 มีนาคม 2024",
      category: "ความหมายไพ่",
      image: "/s/s6.png",
    },
    {
      id: 2,
      title: "วิธีการเตรียมตัวก่อนดูดวงไพ่ทาโรต์",
      excerpt:
        "การเตรียมจิตใจและสภาพแวดล้อมก่อนการดูดวงเป็นสิ่งสำคัญที่จะช่วยให้ได้ผลลัพธ์ที่แม่นยำมากขึ้น...",
      date: "12 มีนาคม 2024",
      category: "คำแนะนำ",
      image: "/s/s7.png",
    },
    {
      id: 3,
      title: "ไพ่ทาโรต์กับการตัดสินใจในชีวิต",
      excerpt:
        "เรียนรู้วิธีใช้ไพ่ทาโรต์เป็นเครื่องมือช่วยในการตัดสินใจสำคัญ ไม่ใช่การทำนายอนาคต แต่เป็นการสะท้อนจิตใจ...",
      date: "10 มีนาคม 2024",
      category: "ปรัชญา",
      image: "/s/s2.jpg",
    },
  ];

  // Auto-slide gallery
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [galleryImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );
  };

  return (
    <div className="min-h-screen bg-slate-800">
      <Header isHomePage={true} onNavigate={onNavigate} />

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                ยินดีต้อนรับสู่ <span className="text-blue-500">แพลตฟอร์ม</span>
                <br />
                <span className="text-blue-500">ทาโรต์</span>
              </h1>
              <p className="text-xl text-slate-400 leading-relaxed">
                ค้นพบความลับของจักรวาลและรับคำแนะนำสำหรับชีวิตของคุณ
                ผ่านไพ่ทาโรต์โบราณที่จะช่วยนำทางในทุกด้านของชีวิต
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onNavigate("daily")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                เริ่มดูดวง
              </button>
              <button
                onClick={() => onNavigate("all-cards")}
                className="border-2 border-slate-600 hover:border-slate-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:bg-slate-700"
              >
                เรียนรู้เพิ่มเติม
              </button>
            </div>
          </div>

          {/* Right Content - Feature Box */}
          <div className="lg:flex justify-center">
            <div className="bg-slate-700 border-2 border-blue-500 rounded-2xl p-8 max-w-md w-full">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white text-center mb-6">
                  เลือกวิธีการดูดวง
                </h3>

                <div className="space-y-4">
                  <button
                    onClick={() => onNavigate("daily")}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg"
                  >
                    <span className="text-xl">🌅</span>
                    <span>ดูดวงรายวัน</span>
                  </button>

                  <button
                    onClick={() => onNavigate("monthly")}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg"
                  >
                    <span className="text-xl">🌙</span>
                    <span>ดูดวงรายเดือน</span>
                  </button>

                  <button
                    onClick={() => onNavigate("all-cards")}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg"
                  >
                    <span className="text-xl">📚</span>
                    <span>ความหมายไพ่ทั้งหมด</span>
                  </button>
                </div>

                <div className="text-center pt-4">
                  <p className="text-slate-400 text-sm">
                    ✨ เริ่มต้นการเดินทางของคุณวันนี้ ✨
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Gallery Section */}
      <section className="bg-slate-900 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">tarotCards</h2>
            <p className="text-slate-400 text-lg">
              ชมภาพบรรยากาศการดูดวงและไพ่ทาโรต์
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Gallery Slider */}
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {galleryImages.map((image) => (
                  <div key={image.id} className="w-full flex-shrink-0 relative">
                    <div className="aspect-video bg-slate-700 overflow-hidden">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Image overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {image.title}
                      </h3>
                      <p className="text-slate-200">{image.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSlide
                      ? "bg-blue-500"
                      : "bg-slate-600 hover:bg-slate-500"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Card Meanings Section */}
      <section className="bg-slate-700 py-16">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content - Image */}
            <div className="order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/s/oz0yncsuxlev.webp"
                  alt="ความหมายไพ่ทาโรต์"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            </div>

            {/* Right Content - Text */}
            <div className="order-1 lg:order-2 space-y-6">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-white">
                  ความหมายไพ่ทาโรต์
                </h2>
                <p className="text-xl text-slate-300 leading-relaxed">
                  เรียนรู้ความหมายลึกซึ้งของไพ่ทาโรต์แต่ละใบ
                  ที่จะช่วยให้คุณเข้าใจข้อความจากจักรวาล
                </p>
                <p className="text-slate-400 leading-relaxed">
                  ไพ่ทาโรต์แต่ละใบมีความหมายและสัญลักษณ์ที่แตกต่างกัน
                  การเข้าใจความหมายเหล่านี้จะช่วยให้การดูดวงของคุณแม่นยำและมีประสิทธิภาพมากขึ้น
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 rounded-full p-2 mt-1">
                    <span className="text-white text-sm">🃏</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">
                      ไพ่ใหญ่ (Major Arcana)
                    </h4>
                    <p className="text-slate-400 text-sm">
                      22 ใบที่บอกเล่าเรื่องราวชีวิตและการเดินทางของจิตวิญญาณ
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-purple-600 rounded-full p-2 mt-1">
                    <span className="text-white text-sm">🎴</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">
                      ไพ่เล็ก (Minor Arcana)
                    </h4>
                    <p className="text-slate-400 text-sm">
                      56 ใบที่เกี่ยวข้องกับชีวิตประจำวันและเหตุการณ์รอบตัว
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate("all-cards")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center space-x-2"
              >
                <span>ดูความหมายไพ่ทั้งหมด</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="bg-slate-800 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              บทความและความรู้ทาโรต์
            </h2>
            <p className="text-slate-400 text-lg">
              เรียนรู้เพิ่มเติมเกี่ยวกับไพ่ทาโรต์และการดูดวง
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="bg-slate-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                {/* Blog Image */}
                <div className="aspect-video bg-slate-600 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6">
                  {/* Category Badge */}
                  <div className="mb-3">
                    <span className="inline-block bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                      {post.category}
                    </span>
                  </div>

                  {/* Blog Title */}
                  <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Blog Excerpt */}
                  <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Blog Meta */}
                  <div className="flex items-center justify-between text-slate-400 text-sm">
                    <span>{post.date}</span>
                    <button className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200">
                      อ่านต่อ →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* View All Blog Button */}
          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate("blog")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              ดูบทความทั้งหมด
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-8">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <span className="text-2xl">🔮</span>
              <span className="text-xl font-bold text-white">ทาโรต์</span>
            </div>
            <p className="text-slate-400 mb-4">
              ค้นพบความลับของจักรวาลผ่านไพ่ทาโรต์โบราณ
            </p>
            <p className="text-slate-500 text-sm">
              © 2024 แพลตฟอร์มทาโรต์. สงวนลิขสิทธิ์.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

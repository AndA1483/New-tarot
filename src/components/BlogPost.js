import React, { useState } from "react";
import Header from './Header';

const BlogPost = ({ onBack, onNavigate, currentPage }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "ความหมายของไพ่ The Fool ในชีวิตประจำวัน",
      excerpt:
        "ไพ่ The Fool เป็นไพ่แรกใน Major Arcana ที่สื่อถึงการเริ่มต้นใหม่ การผจญภัย และความกล้าหาญในการก้าวไปข้างหน้า...",
      content: `ไพ่ The Fool หรือ "คนโง่" เป็นไพ่ที่มีความหมายลึกซึ้งมากกว่าที่ชื่อบ่งบอก ในความเป็นจริงแล้ว ไพ่ใบนี้แทนการเริ่มต้นใหม่ที่เต็มไปด้วยความหวังและความเป็นไปได้ไม่จำกัด

**ความหมายหลัก:**
- การเริ่มต้นใหม่และการผจญภัย
- ความไร้เดียงสาและความบริสุทธิ์ใจ
- การเสี่ยงและความกล้าหาญ
- ศักยภาพที่ยังไม่ได้พัฒนา

**ในด้านความรัก:**
หากคุณโสด ไพ่ The Fool บ่งบอกถึงความรักใหม่ที่กำลังจะเข้ามา หรือการเปิดใจให้กับความรักอีกครั้ง สำหรับคนที่มีคู่แล้ว อาจหมายถึงการเริ่มต้นบทใหม่ในความสัมพันธ์

**ในด้านการงาน:**
การเปลี่ยนงาน การเริ่มธุรกิจใหม่ หรือการเรียนรู้ทักษะใหม่ ๆ ไพ่ใบนี้สนับสนุนให้คุณกล้าเสี่ยงและลองสิ่งใหม่ ๆ

**คำแนะนำ:**
อย่ากลัวที่จะเริ่มต้นใหม่ แม้ว่าจะไม่รู้ว่าจะไปจบที่ไหน บางครั้งการไม่รู้นั่นแหละคือสิ่งที่ทำให้ชีวิตน่าตื่นเต้น`,
      date: "15 มีนาคม 2024",
      category: "ความหมายไพ่",
      image: "/s/s6.png",
      author: "อาจารย์สมชาย",
      readTime: "5 นาที",
    },
    {
      id: 2,
      title: "วิธีการเตรียมตัวก่อนดูดวงไพ่ทาโรต์",
      excerpt:
        "การเตรียมจิตใจและสภาพแวดล้อมก่อนการดูดวงเป็นสิ่งสำคัญที่จะช่วยให้ได้ผลลัพธ์ที่แม่นยำมากขึ้น...",
      content: `การดูดวงไพ่ทาโรต์ไม่ใช่เพียงแค่การสุ่มไพ่ แต่เป็นกระบวนการที่ต้องการการเตรียมตัวอย่างถูกต้อง

**การเตรียมจิตใจ:**
1. **ทำจิตใจให้สงบ** - นั่งสมาธิสั้น ๆ 5-10 นาที
2. **ตั้งเจตนา** - คิดให้ชัดเจนว่าต้องการคำแนะนำเรื่องอะไร
3. **เปิดใจ** - พร้อมรับฟังคำตอบที่อาจไม่ตรงกับความคาดหวัง

**การเตรียมสภาพแวดล้อม:**
- เลือกสถานที่เงียบสงบ
- จุดเทียนหรือธูปเพื่อสร้างบรรยากาศ
- วางไพ่บนผ้าสะอาด
- ปิดโทรศัพท์หรือสิ่งรบกวน

**การเตรียมไพ่:**
1. **ทำความสะอาดไพ่** - เช็ดไพ่ด้วยผ้านุ่ม
2. **สับไพ่** - สับไพ่อย่างน้อย 7 ครั้ง
3. **ตั้งคำถาม** - ถามคำถามที่ชัดเจนและเฉพาะเจาะจง

**ข้อควรระวัง:**
- อย่าดูดวงเมื่อจิตใจไม่สงบ
- อย่าถามคำถามเดิมซ้ำ ๆ ในวันเดียวกัน
- อย่าพึ่งพาการดูดวงมากเกินไป

การเตรียมตัวที่ดีจะช่วยให้คุณได้รับคำแนะนำที่มีประโยชน์และตรงใจมากขึ้น`,
      date: "12 มีนาคม 2024",
      category: "คำแนะนำ",
      image: "/s/s9.png",
      author: "อาจารย์วิมล",
      readTime: "7 นาที",
    },
    {
      id: 3,
      title: "ไพ่ทาโรต์กับการตัดสินใจในชีวิต",
      excerpt:
        "เรียนรู้วิธีใช้ไพ่ทาโรต์เป็นเครื่องมือช่วยในการตัดสินใจสำคัญ ไม่ใช่การทำนายอนาคต แต่เป็นการสะท้อนจิตใจ...",
      content: `ไพ่ทาโรต์ไม่ใช่เครื่องมือทำนายอนาคตที่แน่นอน แต่เป็นกระจกที่สะท้อนจิตใจและช่วยในการตัดสินใจ

**หลักการใช้ไพ่ทาโรต์ในการตัดสินใจ:**

**1. การสำรวจตัวเอง**
- ไพ่ช่วยให้เราเห็นมุมมองที่อาจมองข้าม
- เปิดเผยความรู้สึกที่ซ่อนอยู่ในจิตใต้สำนึก
- ช่วยให้เข้าใจแรงจูงใจที่แท้จริง

**2. การวิเคราะห์สถานการณ์**
- มองเห็นปัจจัยต่าง ๆ ที่เกี่ยวข้อง
- เข้าใจผลกระทบที่อาจเกิดขึ้น
- ประเมินความเสี่ยงและโอกาส

**3. การหาทางเลือก**
- ค้นหาทางเลือกที่อาจไม่เคยคิดถึง
- ประเมินข้อดีข้อเสียของแต่ละทางเลือก
- หาแนวทางที่เหมาะสมที่สุด

**ตัวอย่างการใช้งาน:**
- **การเปลี่ยนงาน:** ใช้ไพ่วิเคราะห์ความพร้อม โอกาส และความท้าทาย
- **ความสัมพันธ์:** เข้าใจความรู้สึกของตัวเองและคู่ครอง
- **การลงทุน:** ประเมินความเสี่ยงและโอกาสได้กำไร

**ข้อจำกัด:**
- ไพ่ไม่สามารถตัดสินใจแทนเราได้
- ต้องใช้วิจารณญาณประกอบ
- ไม่ควรพึ่งพาเพียงอย่างเดียว

จำไว้ว่า ไพ่ทาโรต์เป็นเพียงเครื่องมือช่วย การตัดสินใจที่ดีต้องอาศัยข้อมูล ประสบการณ์ และสติปัญญาของเราเอง`,
      date: "10 มีนาคม 2024",
      category: "ปรัชญา",
      image: "/s/s10.png",
      author: "อาจารย์ประยุทธ",
      readTime: "8 นาที",
    },
    {
      id: 4,
      title: "ประวัติศาสตร์ของไพ่ทาโรต์",
      excerpt:
        "ย้อนรอยประวัติศาสตร์ของไพ่ทาโรต์ตั้งแต่ยุคกลางจนถึงปัจจุบัน และการพัฒนาของสัญลักษณ์ต่าง ๆ...",
      content: `ไพ่ทาโรต์มีประวัติศาสตร์ที่ยาวนานและน่าสนใจ ซึ่งสะท้อนถึงวัฒนธรรมและความเชื่อของมนุษย์ในแต่ละยุคสมัย

**จุดเริ่มต้น (ศตวรรษที่ 15)**
- เกิดขึ้นครั้งแรกในอิตาลีเหนือ
- เรียกว่า "Trionfi" หรือ "Tarocchi"
- ใช้เป็นเกมไพ่สำหรับชนชั้นสูง

**การพัฒนา (ศตวรรษที่ 16-17)**
- แพร่กระจายไปยังฝรั่งเศสและประเทศอื่น ๆ
- เริ่มมีการใช้เพื่อการดูดวง
- พัฒนาสัญลักษณ์และความหมายที่ซับซ้อนขึ้น

**ยุคฟื้นฟู (ศตวรรษที่ 18-19)**
- Antoine Court de Gébelin เชื่อมโยงกับอียิปต์โบราณ
- Éliphas Lévi เชื่อมโยงกับคาบาลาห์
- เริ่มมีการศึกษาอย่างจริงจัง

**ยุคสมัยใหม่ (ศตวรรษที่ 20-ปัจจุบัน)**
- Arthur Edward Waite และ Pamela Colman Smith สร้าง Rider-Waite deck
- การพัฒนาไพ่ชุดใหม่ ๆ มากมาย
- การใช้งานในด้านจิตวิทยาและการพัฒนาตนเอง

**ไพ่ทาโรต์ในประเทศไทย:**
- เข้ามาพร้อมกับวัฒนธรรมตะวันตก
- ผสมผสานกับความเชื่อท้องถิ่น
- ได้รับความนิยมในหมู่คนรุ่นใหม่

**ความหมายในปัจจุบัน:**
ไพ่ทาโรต์ไม่ใช่เพียงเครื่องมือดูดวง แต่เป็นเครื่องมือสำหรับ:
- การทำความเข้าใจตนเอง
- การพัฒนาจิตใจและจิตวิญญาณ
- การสื่อสารกับจิตใต้สำนึก
- การค้นหาแรงบันดาลใจ

ประวัติศาสตร์ของไพ่ทาโรต์แสดงให้เห็นว่า มนุษย์มีความต้องการที่จะเข้าใจตนเองและจักรวาลรอบตัวมาตั้งแต่โบราณกาล`,
      date: "8 มีนาคม 2024",
      category: "ประวัติศาสตร์",
      image: "/s/s5.png",
      author: "ดร.สุชาติ",
      readTime: "10 นาที",
    },
    {
      id: 5,
      title: "การดูแลและเก็บรักษาไพ่ทาโรต์",
      excerpt:
        "เทคนิคการดูแลไพ่ทาโรต์ให้คงความสวยงามและพลังงานที่ดี รวมถึงวิธีการทำความสะอาดและการเก็บรักษา...",
      content: `การดูแลไพ่ทาโรต์อย่างถูกต้องจะช่วยให้ไพ่คงความสวยงามและพลังงานที่ดีไว้ได้นานขึ้น

**การทำความสะอาดไพ่:**

**1. การทำความสะอาดทางกายภาพ**
- ใช้ผ้านุ่มเช็ดเบา ๆ
- หลีกเลี่ยงน้ำและสารเคมี
- เก็บฝุ่นออกเป็นประจำ

**2. การทำความสะอาดพลังงาน**
- วางไพ่ใต้แสงจันทร์เต็มดวง
- ใช้ควันธูปหรือเซจ
- วางใกล้คริสตัลควอตซ์

**การเก็บรักษา:**

**1. สถานที่เก็บ**
- เลือกที่แห้งและไม่ชื้น
- หลีกเลี่ยงแสงแดดโดยตรง
- เก็บในกล่องหรือถุงผ้า

**2. การจัดเรียง**
- เรียงไพ่ให้เป็นระเบียบ
- ใส่กระดาษกันความชื้น
- ตรวจสอบสภาพเป็นประจำ

**การใช้งาน:**

**ข้อควรทำ:**
- ล้างมือก่อนจับไพ่
- สับไพ่อย่างระมัดระวัง
- ใช้ผ้ารองเวลาวางไพ่

**ข้อห้าม:**
- อย่าให้คนอื่นจับไพ่โดยไม่จำเป็น
- อย่าทิ้งไพ่ไว้ในที่ชื้น
- อย่าใช้แรงมากเกินไปตอนสับไพ่

**การซ่อมแซม:**
- ใช้เทปใสติดรอยฉีกเล็ก ๆ
- เปลี่ยนไพ่ที่เสียหายมาก
- ปรึกษาผู้เชี่ยวชาญสำหรับไพ่โบราณ

**สัญญาณที่ควรเปลี่ยนไพ่:**
- ไพ่ซีดจางหรือเปื่อย
- มีรอยฉีกหรือรอยพับมาก
- รู้สึกว่าพลังงานไม่ดี

การดูแลไพ่ทาโรต์ด้วยความรักและเคารพจะทำให้ไพ่ให้คำแนะนำที่ดีกับเราได้ยาวนานขึ้น`,
      date: "5 มีนาคม 2024",
      category: "คำแนะนำ",
      image: "/s/s8.png",
      author: "อาจารย์มาลี",
      readTime: "6 นาที",
    },
  ];

  const categories = [
    { id: "all", name: "ทั้งหมด", count: blogPosts.length },
    {
      id: "ความหมายไพ่",
      name: "ความหมายไพ่",
      count: blogPosts.filter((p) => p.category === "ความหมายไพ่").length,
    },
    {
      id: "คำแนะนำ",
      name: "คำแนะนำ",
      count: blogPosts.filter((p) => p.category === "คำแนะนำ").length,
    },
    {
      id: "ปรัชญา",
      name: "ปรัชญา",
      count: blogPosts.filter((p) => p.category === "ปรัชญา").length,
    },
    {
      id: "ประวัติศาสตร์",
      name: "ประวัติศาสตร์",
      count: blogPosts.filter((p) => p.category === "ประวัติศาสตร์").length,
    },
  ];

  const filteredPosts =
    selectedCategory === "all"
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  const formatContent = (content) => {
    return content.split("\n").map((paragraph, index) => {
      if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
        return (
          <h3
            key={index}
            className="text-xl font-semibold text-white mt-6 mb-3"
          >
            {paragraph.replace(/\*\*/g, "")}
          </h3>
        );
      } else if (paragraph.startsWith("- ")) {
        return (
          <li key={index} className="text-slate-300 ml-4 mb-2">
            {paragraph.substring(2)}
          </li>
        );
      } else if (paragraph.trim() === "") {
        return <br key={index} />;
      } else {
        return (
          <p key={index} className="text-slate-300 mb-4 leading-relaxed">
            {paragraph}
          </p>
        );
      }
    });
  };

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-slate-800">
        <Header 
          title="📝 บล็อก" 
          onBack={() => setSelectedPost(null)}
          backButtonText="← กลับไปดูบทความทั้งหมด"
          onNavigate={onNavigate}
          currentPage={currentPage}
          rightButton={
            <button
              onClick={onBack}
              className="text-slate-300 hover:text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium"
            >
              กลับหน้าแรก
            </button>
          }
        />

        {/* Article Content */}
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <article className="bg-slate-700 border border-slate-600 rounded-xl overflow-hidden">
              {/* Article Header */}
              <div className="p-8">
                <div className="mb-6">
                  <span className="inline-block bg-blue-600 text-white text-sm px-3 py-1 rounded-full font-medium mb-4">
                    {selectedPost.category}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                    {selectedPost.title}
                  </h1>
                  <div className="flex items-center text-slate-400 text-sm space-x-4">
                    <span>โดย {selectedPost.author}</span>
                    <span>•</span>
                    <span>{selectedPost.date}</span>
                    <span>•</span>
                    <span>อ่าน {selectedPost.readTime}</span>
                  </div>
                </div>

                {/* Article Image */}
                <div className="aspect-video bg-slate-600 rounded-lg overflow-hidden mb-8">
                  <img
                    src={selectedPost.image}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Article Content */}
                <div className="prose prose-invert max-w-none">
                  {formatContent(selectedPost.content)}
                </div>

                {/* Article Footer */}
                <div className="mt-12 pt-8 border-t border-slate-600">
                  <div className="flex items-center justify-between">
                    <div className="text-slate-400 text-sm">แชร์บทความนี้:</div>
                    <div className="flex space-x-4">
                      <button className="text-slate-400 hover:text-blue-400 transition-colors">
                        Facebook
                      </button>
                      <button className="text-slate-400 hover:text-blue-400 transition-colors">
                        Twitter
                      </button>
                      <button className="text-slate-400 hover:text-blue-400 transition-colors">
                        Line
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-800">
      <Header 
        title="📝 บล็อก" 
        onBack={onBack} 
        onNavigate={onNavigate}
        currentPage={currentPage}
      />

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              บทความและข่าวสารเกี่ยวกับไพ่ทาโรต์
            </h2>
            <p className="text-slate-300 text-lg">
              ความรู้ คำแนะนำ และข้อมูลน่าสนใจเกี่ยวกับโลกของไพ่ทาโรต์
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    selectedCategory === category.id
                      ? "bg-blue-600 text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-slate-700 border border-slate-600 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedPost(post)}
              >
                {/* Blog Image */}
                <div className="aspect-video bg-slate-600 overflow-hidden group-hover:bg-slate-500 transition-colors">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                  <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors">
                    {post.title}
                  </h3>

                  {/* Blog Excerpt */}
                  <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Blog Meta */}
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <div className="space-y-1">
                      <div>โดย {post.author}</div>
                      <div>{post.date}</div>
                    </div>
                    <div className="text-right">
                      <div>อ่าน {post.readTime}</div>
                      <div className="text-blue-400 group-hover:text-blue-300 font-medium transition-colors">
                        อ่านต่อ →
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              โหลดบทความเพิ่มเติม
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;

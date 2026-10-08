// =========================================================
// NotesHub - main.js
// จัดการข้อมูลโน้ต/ข้อสอบเก่า, การกรองหมวดหมู่, การค้นหา
// และการเปิด/ปิดเมนูและหน้าต่าง login/register
// =========================================================

// ข้อมูลตัวอย่างโน้ตและข้อสอบเก่า (จำลองฐานข้อมูล)
const notesData = [
  { id: 1, title: "สรุปคณิตศาสตร์ ม.4", subject: "คณิตศาสตร์เพิ่มเติม", category: "math", grade: "m4", type: "note", author: "สมชาย ใจดี", pages: 24, image: "photo-1453733190371-0a9bedd82893",
    description: "สรุปเนื้อหาคณิตศาสตร์เพิ่มเติม ม.4 เทอม 1 ครบทุกบท มีสูตรสำคัญและตัวอย่างโจทย์พร้อมวิธีทำ",
    topics: ["เซต", "ตรรกศาสตร์", "จำนวนจริง", "ทฤษฎีจำนวนเบื้องต้น"] },
  { id: 2, title: "ข้อสอบเก่า ฟิสิกส์ ม.5", subject: "ฟิสิกส์", category: "science", grade: "m5", type: "exam", author: "วิชัย ตั้งใจ", pages: 32, image: "photo-1633493702341-4d04841df53b",
    description: "รวมข้อสอบกลางภาคและปลายภาค ฟิสิกส์ ม.5 ย้อนหลัง 3 ปี พร้อมเฉลยละเอียด",
    topics: ["การเคลื่อนที่แบบฮาร์มอนิก", "คลื่น", "เสียง", "ไฟฟ้าสถิต"] },
  { id: 3, title: "สรุปชีววิทยา ม.ปลาย", subject: "ชีววิทยา", category: "science", grade: "senior", type: "note", author: "สมหญิง รักเรียน", pages: 40, image: "photo-1526930382372-67bf22c0fce2",
    description: "สรุปชีววิทยา ม.ปลาย ฉบับย่อสำหรับทบทวนก่อนสอบ มีแผนภาพประกอบเข้าใจง่าย",
    topics: ["เซลล์", "พันธุศาสตร์", "วิวัฒนาการ", "ระบบในร่างกายมนุษย์"] },
  { id: 4, title: "แกรมมาร์ภาษาอังกฤษ ม.3", subject: "ภาษาอังกฤษ", category: "english", grade: "m3", type: "note", author: "น้ำผึ้ง สดใส", pages: 18, image: "photo-1543165796-5426273eaab3",
    description: "สรุปแกรมมาร์ภาษาอังกฤษ ม.3 ที่ออกสอบบ่อย พร้อมแบบฝึกหัดท้ายบท",
    topics: ["Tenses", "Passive Voice", "Conditional Sentences", "Relative Clauses"] },
  { id: 5, title: "ข้อสอบเก่า เคมี ม.6", subject: "เคมี", category: "science", grade: "m6", type: "exam", author: "วิชัย ตั้งใจ", pages: 36, image: "photo-1532094349884-543bc11b234d",
    description: "ข้อสอบเก่าเคมี ม.6 แนวข้อสอบเข้ามหาวิทยาลัย พร้อมเฉลยและเทคนิคทำโจทย์",
    topics: ["ปริมาณสารสัมพันธ์", "กรด-เบส", "เคมีอินทรีย์", "ไฟฟ้าเคมี"] },
  { id: 6, title: "สรุปหลักภาษาไทย ม.2", subject: "ภาษาไทย", category: "thai", grade: "m2", type: "note", author: "สมหญิง รักเรียน", pages: 16, image: "photo-1579017308347-e53e0d2fc5e9",
    description: "สรุปหลักภาษาไทย ม.2 อ่านง่าย มีตารางสรุปและตัวอย่างประโยค",
    topics: ["ชนิดของคำ", "ประโยค", "คำยืมภาษาต่างประเทศ", "การเขียนเรียงความ"] },
  { id: 7, title: "สรุปประวัติศาสตร์ไทย ม.1", subject: "ประวัติศาสตร์ไทย", category: "social", grade: "m1", type: "note", author: "สมชาย ใจดี", pages: 20, image: "photo-1679430255152-d1b0fec90432",
    description: "สรุปประวัติศาสตร์ไทย ม.1 เรียงตามยุคสมัย พร้อมไทม์ไลน์เหตุการณ์สำคัญ",
    topics: ["สมัยก่อนประวัติศาสตร์", "สมัยสุโขทัย", "หลักฐานทางประวัติศาสตร์", "ศักราช"] },
  { id: 8, title: "ข้อสอบเก่า เรขาคณิต ม.ต้น", subject: "เรขาคณิต", category: "math", grade: "junior", type: "exam", author: "น้ำผึ้ง สดใส", pages: 22, image: "photo-1764948620396-45f5b5fdd73e",
    description: "รวมข้อสอบเก่าเรขาคณิต ม.ต้น เน้นโจทย์พิสูจน์และการคำนวณพื้นที่",
    topics: ["ความเท่ากันทุกประการ", "ทฤษฎีบทพีทาโกรัส", "เส้นขนาน", "พื้นที่ผิวและปริมาตร"] },
  { id: 9, title: "สรุปวรรณคดีไทย ม.4", subject: "วรรณคดีไทย", category: "thai", grade: "m4", type: "note", author: "สมหญิง รักเรียน", pages: 28, image: "photo-1702753390015-d4abffb87306",
    description: "สรุปวรรณคดีไทย ม.4 ทุกเรื่องในหนังสือเรียน พร้อมคุณค่าและข้อคิด",
    topics: ["นิราศนรินทร์", "หัวใจชายหนุ่ม", "มัทนะพาธา", "ไตรภูมิพระร่วง"] },
  { id: 10, title: "ข้อสอบเก่า หน้าที่พลเมือง ม.5", subject: "หน้าที่พลเมือง", category: "social", grade: "m5", type: "exam", author: "วิชัย ตั้งใจ", pages: 18, image: "photo-1589391886645-d51941baf7fb",
    description: "ข้อสอบเก่าหน้าที่พลเมือง ม.5 พร้อมเฉลย ครอบคลุมรัฐธรรมนูญและกฎหมายใกล้ตัว",
    topics: ["รัฐธรรมนูญ", "สิทธิและหน้าที่", "กฎหมายแพ่ง", "กฎหมายอาญา"] },
  { id: 11, title: "สรุปการอ่านจับใจความภาษาอังกฤษ ม.6", subject: "ภาษาอังกฤษ", category: "english", grade: "m6", type: "note", author: "น้ำผึ้ง สดใส", pages: 26, image: "photo-1514369118554-e20d93546b30",
    description: "สรุปเทคนิคการอ่านจับใจความภาษาอังกฤษ ม.6 สำหรับเตรียมสอบ พร้อมบทความฝึกอ่าน",
    topics: ["Main Idea", "Skimming & Scanning", "Inference", "Vocabulary in Context"] },
  { id: 12, title: "สรุปเซตและตรรกศาสตร์ ม.4", subject: "คณิตศาสตร์เพิ่มเติม", category: "math", grade: "m4", type: "note", author: "สมชาย ใจดี", pages: 20, image: "photo-1635372722656-389f87a941b7",
    description: "สรุปเซตและตรรกศาสตร์ ม.4 แบบละเอียด มีแผนภาพเวนน์และตารางค่าความจริง",
    topics: ["เซตและสับเซต", "แผนภาพเวนน์-ออยเลอร์", "ตัวเชื่อมทางตรรกศาสตร์", "ตัวบ่งปริมาณ"] },
];

// ป้ายกำกับหมวดวิชา/ระดับชั้น ใช้แสดงเป็น tag บนการ์ด
const categoryLabels = {
  math: "คณิตศาสตร์",
  science: "วิทยาศาสตร์",
  english: "ภาษาอังกฤษ",
  thai: "ภาษาไทย",
  social: "สังคมศึกษา",
};

const gradeLabels = {
  m1: "ม.1",
  m2: "ม.2",
  m3: "ม.3",
  m4: "ม.4",
  m5: "ม.5",
  m6: "ม.6",
  junior: "ม.ต้น",
  senior: "ม.ปลาย",
};

// รูปปกโน้ตจาก Unsplash (ใช้ฟรีตาม Unsplash License: https://unsplash.com/license)
// ใส่แค่รหัสรูปไว้ในช่อง image ของโน้ต แล้วฟังก์ชันนี้จะสร้างลิงก์รูปให้
function noteImageUrl(note, width = 600, height = 330) {
  return note.image
    ? `https://images.unsplash.com/${note.image}?w=${width}&h=${height}&fit=crop&auto=format&q=70`
    : "";
}

// สีของปกโน้ตแต่ละใบ ใช้วนซ้ำตามลำดับ เพื่อให้ดูเหมือนชั้นหนังสือ
const coverColors = ["#3F49A5", "#AB3730", "#EDBD60"];

// สถานะการกรองปัจจุบัน
const activeFilter = { subject: "all", grade: "all", keyword: "" };

const cardGrid = document.querySelector("#cardGrid");
const resultTitle = document.querySelector("#resultTitle");
const resultCount = document.querySelector("#resultCount");

// สร้าง card หนึ่งใบจากข้อมูลโน้ต
function createNoteCard(note, colorIndex) {
  const card = document.createElement("article");
  card.className = "note-card";

  const cover = document.createElement("div");
  cover.className = "note-card-cover";
  cover.style.backgroundColor = coverColors[colorIndex % coverColors.length];

  // มีรูป = แสดงรูป + ป้ายชื่อวิชา, ไม่มีรูป = แสดงตัวอักษรตัวแรกแบบเดิม
  if (note.image) {
    cover.classList.add("has-image");
    cover.innerHTML = `
      <img src="${noteImageUrl(note)}" alt="" loading="lazy" onerror="this.remove()" />
      <span class="cover-subject">${note.subject}</span>`;
  } else {
    cover.textContent = note.subject.charAt(0);
  }

  const body = document.createElement("div");
  body.className = "note-card-body";
  body.innerHTML = `
    <h3>${note.title}</h3>
    <p class="author">โพสต์โดย: ${note.author}</p>
    <div class="note-tags">
      <span>${categoryLabels[note.category] || note.category}</span>
      <span>${gradeLabels[note.grade] || note.grade}</span>
      <span>${note.type === "exam" ? "ข้อสอบเก่า" : "สรุปเนื้อหา"}</span>
    </div>
    <a class="btn btn-primary" href="note.html?id=${note.id}">ดูรายละเอียด</a>
  `;

  // ปุ่มหัวใจ (รายการโปรด) มุมขวาบนของปก - ใช้ฟังก์ชันจาก js/favorites.js
  if (typeof createFavoriteButton === "function") {
    cover.append(createFavoriteButton({ kind: "note", id: String(note.id), title: note.title, subtitle: note.subject }));
  }

  card.append(cover, body);
  return card;
}

// วาด card ทั้งหมดตามรายการที่กรองแล้วลงใน grid
function renderNotes(list) {
  if (!cardGrid) return;

  cardGrid.innerHTML = "";

  if (list.length === 0) {
    cardGrid.innerHTML = '<p class="empty-message">ไม่พบโน้ตที่ตรงกับเงื่อนไขที่เลือก</p>';
  } else {
    list.forEach((note, index) => cardGrid.append(createNoteCard(note, index)));
  }

  if (resultCount) {
    resultCount.textContent = `พบ ${list.length} รายการ`;
  }
}

// กรองข้อมูลตามหมวดวิชา ระดับชั้น และคำค้นหาที่เลือกไว้ในปัจจุบัน
function applyFilters() {
  const filtered = notesData.filter((note) => {
    const matchSubject = activeFilter.subject === "all" || note.category === activeFilter.subject;
    const matchGrade = activeFilter.grade === "all" || note.grade === activeFilter.grade;
    const matchKeyword =
      activeFilter.keyword === "" ||
      note.title.toLowerCase().includes(activeFilter.keyword) ||
      note.subject.toLowerCase().includes(activeFilter.keyword);

    return matchSubject && matchGrade && matchKeyword;
  });

  renderNotes(filtered);
}

// ---------- การกดเลือกหมวดหมู่ใน sidebar ----------
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const group = button.dataset.filter;

    // ลบ active ออกจากปุ่มอื่นในกลุ่มเดียวกัน แล้วตั้ง active ให้ปุ่มที่กด
    document
      .querySelectorAll(`.filter-btn[data-filter="${group}"]`)
      .forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    activeFilter[group] = button.dataset.value;
    applyFilters();
  });
});

// ---------- ช่องค้นหา ----------
const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchBtn");

function runSearch() {
  if (!searchInput) return;
  activeFilter.keyword = searchInput.value.trim().toLowerCase();
  applyFilters();
}

searchBtn?.addEventListener("click", runSearch);
searchInput?.addEventListener("keyup", (event) => {
  if (event.key === "Enter") runSearch();
});

// วาดข้อมูลครั้งแรกเมื่อโหลดหน้า
if (cardGrid) applyFilters();

// ---------- เมนูมือถือ (sidebar toggle) ----------
const menuToggle = document.querySelector("#menuToggle");
const sidebar = document.querySelector("#sidebar");

menuToggle?.addEventListener("click", () => {
  sidebar?.classList.toggle("open");
});

// ---------- Modal: login / register ----------
const modalOverlay = document.querySelector("#modalOverlay");
const loginModal = document.querySelector("#loginModal");
const registerModal = document.querySelector("#registerModal");

function openModal(modal) {
  if (!modalOverlay || !modal) return;
  modalOverlay.hidden = false;
  loginModal?.setAttribute("hidden", "");
  registerModal?.setAttribute("hidden", "");
  modal.removeAttribute("hidden");
}

function closeModal() {
  if (modalOverlay) modalOverlay.hidden = true;
}

document.querySelector("#loginBtn")?.addEventListener("click", () => openModal(loginModal));
document.querySelector("#registerBtn")?.addEventListener("click", () => openModal(registerModal));
document.querySelectorAll(".modal-close").forEach((btn) => btn.addEventListener("click", closeModal));

// ปิด modal เมื่อคลิกพื้นหลังสีดำนอกกล่อง
modalOverlay?.addEventListener("click", (event) => {
  if (event.target === modalOverlay) closeModal();
});

// สลับไปมาระหว่างฟอร์ม login และ register
document.querySelector("#showRegister")?.addEventListener("click", () => openModal(registerModal));
document.querySelector("#showLogin")?.addEventListener("click", () => openModal(loginModal));

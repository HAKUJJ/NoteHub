// =========================================================
// NotesHub - main.js
// จัดการข้อมูลโน้ต/ข้อสอบเก่า, การกรองหมวดหมู่, การค้นหา
// และการเปิด/ปิดเมนูและหน้าต่าง login/register
// =========================================================

// ข้อมูลตัวอย่างโน้ตและข้อสอบเก่า (จำลองฐานข้อมูล)
const notesData = [
  { id: 1, title: "สรุปแคลคูลัส 1", subject: "แคลคูลัส 1", faculty: "engineering", year: "1", type: "note", author: "สมชาย ใจดี" },
  { id: 2, title: "ข้อสอบเก่า ฟิสิกส์ทั่วไป", subject: "ฟิสิกส์ทั่วไป", faculty: "engineering", year: "1", type: "exam", author: "วิชัย ตั้งใจ" },
  { id: 3, title: "สรุปโครงสร้างข้อมูล", subject: "โครงสร้างข้อมูล", faculty: "engineering", year: "2", type: "note", author: "สมหญิง รักเรียน" },
  { id: 4, title: "ข้อสอบเก่า ระบบฐานข้อมูล", subject: "ระบบฐานข้อมูล", faculty: "engineering", year: "3", type: "exam", author: "สมชาย ใจดี" },
  { id: 5, title: "สรุปหลักเศรษฐศาสตร์จุลภาค", subject: "เศรษฐศาสตร์จุลภาค", faculty: "business", year: "1", type: "note", author: "น้ำผึ้ง สดใส" },
  { id: 6, title: "ข้อสอบเก่า การตลาดเบื้องต้น", subject: "การตลาดเบื้องต้น", faculty: "business", year: "2", type: "exam", author: "วิชัย ตั้งใจ" },
  { id: 7, title: "สรุปการบัญชีการเงิน", subject: "การบัญชีการเงิน", faculty: "business", year: "2", type: "note", author: "สมหญิง รักเรียน" },
  { id: 8, title: "สรุปกายวิภาคศาสตร์", subject: "กายวิภาคศาสตร์", faculty: "medicine", year: "1", type: "note", author: "น้ำผึ้ง สดใส" },
  { id: 9, title: "ข้อสอบเก่า สรีรวิทยา", subject: "สรีรวิทยา", faculty: "medicine", year: "2", type: "exam", author: "วิชัย ตั้งใจ" },
  { id: 10, title: "สรุปกฎหมายแพ่งและพาณิชย์", subject: "กฎหมายแพ่งและพาณิชย์", faculty: "law", year: "1", type: "note", author: "สมชาย ใจดี" },
  { id: 11, title: "ข้อสอบเก่า กฎหมายอาญา", subject: "กฎหมายอาญา", faculty: "law", year: "2", type: "exam", author: "สมหญิง รักเรียน" },
  { id: 12, title: "สรุปภาษาอังกฤษเพื่อการสื่อสาร", subject: "ภาษาอังกฤษเพื่อการสื่อสาร", faculty: "arts", year: "1", type: "note", author: "น้ำผึ้ง สดใส" },
];

// สีของปกโน้ตแต่ละใบ ใช้วนซ้ำตามลำดับ เพื่อให้ดูเหมือนชั้นหนังสือ
const coverColors = ["#3F49A5", "#AB3730", "#EDBD60"];

// สถานะการกรองปัจจุบัน
const activeFilter = { faculty: "all", year: "all", keyword: "" };

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
  cover.textContent = note.subject.charAt(0);

  const body = document.createElement("div");
  body.className = "note-card-body";
  body.innerHTML = `
    <h3>${note.title}</h3>
    <p class="author">โพสต์โดย: ${note.author}</p>
    <div class="note-tags">
      <span>${note.subject}</span>
      <span>ชั้นปี ${note.year}</span>
      <span>${note.type === "exam" ? "ข้อสอบเก่า" : "สรุปเนื้อหา"}</span>
    </div>
    <button class="btn btn-primary">ดูรายละเอียด</button>
  `;

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

// กรองข้อมูลตามคณะ ชั้นปี และคำค้นหาที่เลือกไว้ในปัจจุบัน
function applyFilters() {
  const filtered = notesData.filter((note) => {
    const matchFaculty = activeFilter.faculty === "all" || note.faculty === activeFilter.faculty;
    const matchYear = activeFilter.year === "all" || note.year === activeFilter.year;
    const matchKeyword =
      activeFilter.keyword === "" ||
      note.title.toLowerCase().includes(activeFilter.keyword) ||
      note.subject.toLowerCase().includes(activeFilter.keyword);

    return matchFaculty && matchYear && matchKeyword;
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

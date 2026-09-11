const notesData = [
  { id: 1, title: "สรุปคณิตศาสตร์ ม.4", subject: "คณิตศาสตร์เพิ่มเติม", category: "math", grade: "m4", type: "note", author: "สมชาย ใจดี" },
  { id: 2, title: "ข้อสอบเก่า ฟิสิกส์ ม.5", subject: "ฟิสิกส์", category: "science", grade: "m5", type: "exam", author: "วิชัย ตั้งใจ" },
  { id: 3, title: "สรุปชีววิทยา ม.ปลาย", subject: "ชีววิทยา", category: "science", grade: "senior", type: "note", author: "สมหญิง รักเรียน" },
  { id: 4, title: "แกรมมาร์ภาษาอังกฤษ ม.3", subject: "ภาษาอังกฤษ", category: "english", grade: "m3", type: "note", author: "น้ำผึ้ง สดใส" },
  { id: 5, title: "ข้อสอบเก่า เคมี ม.6", subject: "เคมี", category: "science", grade: "m6", type: "exam", author: "วิชัย ตั้งใจ" },
  { id: 6, title: "สรุปหลักภาษาไทย ม.2", subject: "ภาษาไทย", category: "thai", grade: "m2", type: "note", author: "สมหญิง รักเรียน" },
  { id: 7, title: "สรุปประวัติศาสตร์ไทย ม.1", subject: "ประวัติศาสตร์ไทย", category: "social", grade: "m1", type: "note", author: "สมชาย ใจดี" },
  { id: 8, title: "ข้อสอบเก่า เรขาคณิต ม.ต้น", subject: "เรขาคณิต", category: "math", grade: "junior", type: "exam", author: "น้ำผึ้ง สดใส" },
  { id: 9, title: "สรุปวรรณคดีไทย ม.4", subject: "วรรณคดีไทย", category: "thai", grade: "m4", type: "note", author: "สมหญิง รักเรียน" },
  { id: 10, title: "ข้อสอบเก่า หน้าที่พลเมือง ม.5", subject: "หน้าที่พลเมือง", category: "social", grade: "m5", type: "exam", author: "วิชัย ตั้งใจ" },
  { id: 11, title: "สรุปการอ่านจับใจความภาษาอังกฤษ ม.6", subject: "ภาษาอังกฤษ", category: "english", grade: "m6", type: "note", author: "น้ำผึ้ง สดใส" },
  { id: 12, title: "สรุปเซตและตรรกศาสตร์ ม.4", subject: "คณิตศาสตร์เพิ่มเติม", category: "math", grade: "m4", type: "note", author: "สมชาย ใจดี" }
];

const categoryLabels = {
  math: "คณิตศาสตร์",
  science: "วิทยาศาสตร์",
  english: "ภาษาอังกฤษ",
  thai: "ภาษาไทย",
  social: "สังคมศึกษา"
};

const gradeLabels = {
  m1: "ม.1",
  m2: "ม.2",
  m3: "ม.3",
  m4: "ม.4",
  m5: "ม.5",
  m6: "ม.6",
  junior: "ม.ต้น",
  senior: "ม.ปลาย"
};

const coverColors = ["#3F49A5", "#AB3730", "#EDBD60"];
const activeFilter = { subject: "all", grade: "all", keyword: "" };

const cardGrid = document.querySelector("#cardGrid");
const resultCount = document.querySelector("#resultCount");

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
      <span>${categoryLabels[note.category] || note.category}</span>
      <span>${gradeLabels[note.grade] || note.grade}</span>
      <span>${note.type === "exam" ? "ข้อสอบเก่า" : "สรุปเนื้อหา"}</span>
    </div>
    <button class="btn btn-primary">ดูรายละเอียด</button>
  `;

  card.append(cover, body);
  return card;
}

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

const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const group = button.dataset.filter;

    document
      .querySelectorAll(`.filter-btn[data-filter="${group}"]`)
      .forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    activeFilter[group] = button.dataset.value;
    applyFilters();
  });
});

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

if (cardGrid) applyFilters();

const menuToggle = document.querySelector("#menuToggle");
const sidebar = document.querySelector("#sidebar");

menuToggle?.addEventListener("click", () => {
  sidebar?.classList.toggle("open");
});

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

modalOverlay?.addEventListener("click", (event) => {
  if (event.target === modalOverlay) closeModal();
});

document.querySelector("#showRegister")?.addEventListener("click", () => openModal(registerModal));
document.querySelector("#showLogin")?.addEventListener("click", () => openModal(loginModal));

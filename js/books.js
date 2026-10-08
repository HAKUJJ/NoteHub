// =========================================================
// NotesHub - books.js
// หน้าคลังหนังสือเรียน (books.html): เลือกวิชา หรือพิมพ์ค้นหา
// แล้วดึงรายการหนังสือจาก Open Library API
// รองรับลิงก์แบบ books.html?subject=physics
// =========================================================

const subjectTabs = document.querySelector("#subjectTabs");
const bookGrid = document.querySelector("#bookGrid");
const bookTitle = document.querySelector("#bookTitle");
const bookCount = document.querySelector("#bookCount");
const bookSearchForm = document.querySelector("#bookSearchForm");
const bookSearch = document.querySelector("#bookSearch");

const startSubject = new URLSearchParams(window.location.search).get("subject");
let current = { subject: bookSubjects[startSubject] ? startSubject : "math", query: "" };

// สร้างปุ่มแท็บวิชาจาก bookSubjects
Object.entries(bookSubjects).forEach(([key, info]) => {
  const tab = document.createElement("button");
  tab.type = "button";
  tab.className = "subject-tab";
  tab.dataset.subject = key;
  tab.textContent = info.label;
  tab.addEventListener("click", () => {
    current = { subject: key, query: "" };
    bookSearch.value = "";
    loadBooks();
  });
  subjectTabs.append(tab);
});

function highlightTab() {
  document.querySelectorAll(".subject-tab").forEach((tab) => {
    tab.classList.toggle("active", !current.query && tab.dataset.subject === current.subject);
  });
}

async function loadBooks() {
  highlightTab();
  const label = current.query ? `ผลการค้นหา "${current.query}"` : `หนังสือ${bookSubjects[current.subject].label}`;
  bookTitle.textContent = label;
  bookCount.textContent = "";
  showLoading(bookGrid);

  try {
    const { total, books } = current.query
      ? await searchBooks({ query: current.query, limit: 24 })
      : await searchBooks({ subject: bookSubjects[current.subject].subject, limit: 24 });

    bookGrid.innerHTML = "";
    bookCount.textContent = `พบ ${total.toLocaleString("th-TH")} เล่ม (แสดง ${books.length} เล่มแรก)`;

    if (books.length === 0) {
      bookGrid.innerHTML = '<p class="empty-message">ไม่พบหนังสือที่ค้นหา ลองใช้คำภาษาอังกฤษดูนะ</p>';
      return;
    }
    books.forEach((book) => bookGrid.append(createBookCard(book)));
  } catch {
    showError(bookGrid, loadBooks);
  }
}

bookSearchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = bookSearch.value.trim();
  if (!query) return;
  current = { ...current, query };
  loadBooks();
});

loadBooks();

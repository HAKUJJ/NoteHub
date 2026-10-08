// =========================================================
// NotesHub - openlibrary.js
// ดึงข้อมูลหนังสือเรียนจาก Open Library API (ฟรี ไม่ต้องใช้ API key)
// เอกสาร API: https://openlibrary.org/dev/docs/api/search
// =========================================================

const OPEN_LIBRARY = "https://openlibrary.org";

// จับคู่หมวดวิชาของเว็บ กับ subject ของ Open Library
const bookSubjects = {
  math: { label: "คณิตศาสตร์", subject: "mathematics_textbooks" },
  physics: { label: "ฟิสิกส์", subject: "physics_textbooks" },
  chemistry: { label: "เคมี", subject: "chemistry_textbooks" },
  biology: { label: "ชีววิทยา", subject: "biology_textbooks" },
  english: { label: "ภาษาอังกฤษ", subject: "english_language_textbooks_for_foreign_speakers" },
  thai: { label: "ภาษาไทย", subject: "thai_language_grammar" },
  social: { label: "สังคมศึกษา / ประวัติศาสตร์ไทย", subject: "history_of_thailand" },
};

// เลือก subject ให้ตรงกับโน้ต (วิทยาศาสตร์แยกตามวิชา)
function subjectKeyForNote(note) {
  if (note.category !== "science") return note.category;
  if (note.subject.includes("ฟิสิกส์")) return "physics";
  if (note.subject.includes("เคมี")) return "chemistry";
  return "biology";
}

// ลิงก์รูปปกหนังสือ (size: S / M / L)
function coverUrl(coverId, size = "M") {
  return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg` : "";
}

// key จาก API หน้าตาแบบ "/works/OL1826387W" -> เอาแค่ "OL1826387W"
function workIdFromKey(key) {
  return key.replace("/works/", "");
}

// ข้อความจาก API อาจมีอักขระ HTML ปนมา แปลงให้แสดงเป็นข้อความธรรมดา
function escapeText(text) {
  const div = document.createElement("div");
  div.textContent = text ?? "";
  return div.innerHTML;
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

// ค้นหาหนังสือ: ใช้ subject หรือคำค้นหาก็ได้
async function searchBooks({ subject = "", query = "", limit = 12 }) {
  const params = new URLSearchParams({
    fields: "key,title,author_name,cover_i,first_publish_year",
    limit: String(limit),
  });
  if (subject) params.set("subject", subject);
  if (query) params.set("q", query);

  const data = await fetchJson(`${OPEN_LIBRARY}/search.json?${params}`);
  return { total: data.numFound, books: data.docs };
}

// รายละเอียดหนังสือ 1 เล่ม + ชื่อผู้เขียน
async function getBook(workId) {
  const work = await fetchJson(`${OPEN_LIBRARY}/works/${workId}.json`);

  const authorKeys = (work.authors || []).map((a) => a.author?.key).filter(Boolean).slice(0, 3);
  const authors = await Promise.all(
    authorKeys.map((key) => fetchJson(`${OPEN_LIBRARY}${key}.json`).then((a) => a.name).catch(() => null))
  );

  // description อาจเป็นข้อความธรรมดา หรือ object { value: "..." } หรือไม่มีเลย
  const description = typeof work.description === "object" ? work.description.value : work.description;

  return {
    id: workId,
    title: work.title,
    authors: authors.filter(Boolean),
    description: description || "",
    subjects: (work.subjects || []).slice(0, 12),
    cover: work.covers?.find((c) => c > 0),
    firstPublished: work.first_publish_date || "",
    url: `${OPEN_LIBRARY}/works/${workId}`,
  };
}

// การ์ดหนังสือ 1 ใบ (ใช้ทั้งหน้าคลังหนังสือ หน้ารายละเอียดโน้ต และหน้ารายการโปรด)
function createBookCard(book) {
  const id = workIdFromKey(book.key);
  const author = book.author_name?.slice(0, 2).join(", ") || "ไม่ระบุผู้เขียน";
  const title = escapeText(book.title);

  const card = document.createElement("a");
  card.className = "book-card";
  card.href = `book.html?id=${id}`;
  card.innerHTML = `
    <div class="book-cover">
      ${book.cover_i
        ? `<img src="${coverUrl(book.cover_i)}" alt="ปกหนังสือ ${title}" loading="lazy" />`
        : `<span class="book-cover-empty">ไม่มีภาพปก</span>`}
    </div>
    <div class="book-body">
      <h3>${title}</h3>
      <p>${escapeText(author)}</p>
      ${book.first_publish_year ? `<p class="book-year">พิมพ์ครั้งแรก ${book.first_publish_year}</p>` : ""}
    </div>
  `;

  card.querySelector(".book-cover").append(
    createFavoriteButton({ kind: "book", id, title: book.title, subtitle: author, cover: book.cover_i || null })
  );
  return card;
}

// ข้อความระหว่างโหลด / เมื่อโหลดไม่สำเร็จ
function showLoading(container, text = "กำลังโหลดข้อมูล...") {
  container.innerHTML = `<p class="api-status"><span class="spinner"></span>${text}</p>`;
}

function showError(container, onRetry) {
  container.innerHTML = `
    <div class="api-status api-error">
      <p>โหลดข้อมูลจาก Open Library ไม่สำเร็จ ลองตรวจสอบอินเทอร์เน็ตแล้วกดลองใหม่</p>
      <button type="button" class="btn btn-secondary">ลองใหม่</button>
    </div>`;
  container.querySelector("button").addEventListener("click", onRetry);
}

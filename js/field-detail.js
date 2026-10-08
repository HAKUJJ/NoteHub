// =========================================================
// NotesHub - field-detail.js
// หน้ารายละเอียดสาขาวิชา: field.html?id=cs
// แสดงวิชาที่ได้เรียน อาชีพ โน้ตที่ควรอ่านเตรียมตัว และหนังสือจาก Open Library
// ต้องโหลดหลัง fields-data.js, main.js และ openlibrary.js
// =========================================================

const fieldDetail = document.querySelector("#fieldDetail");
const fieldNotes = document.querySelector("#fieldNotes");
const fieldBooks = document.querySelector("#fieldBooks");

const fieldId = new URLSearchParams(window.location.search).get("id");
const field = fields.find((item) => item.id === fieldId);

function renderField() {
  if (!field) {
    fieldDetail.innerHTML = `
      <div class="api-status api-error">
        <p>ไม่พบสาขาวิชาที่ต้องการ</p>
        <a href="matcher.html" class="btn btn-primary">กลับไปหน้า Matcher</a>
      </div>`;
    document.querySelectorAll(".field-extra").forEach((el) => (el.hidden = true));
    return;
  }

  document.title = `${field.name} - NotesHub`;

  fieldDetail.innerHTML = `
    <section class="field-hero">
      <p class="detail-label">สาขาวิชาที่แนะนำ</p>
      <h1>${field.name}</h1>
      <p>${field.description}</p>
      <div class="note-tags">${field.subjects.map((s) => `<span>${s}</span>`).join("")}</div>
    </section>

    <section>
      <h2 class="section-title">วิชาที่ได้เรียน</h2>
      <ol class="course-list">
        ${field.courses.map((c) => `<li><strong>${c.name}</strong><span>${c.detail}</span></li>`).join("")}
      </ol>
    </section>

    <section>
      <h2 class="section-title">อาชีพในอนาคต</h2>
      <div class="career-list">${field.careers.map((c) => `<span>${c}</span>`).join("")}</div>
    </section>
  `;
}

// โน้ตใน NotesHub ที่ควรอ่านเตรียมตัว (ตามหมวดวิชาใน field.prepare)
function renderFieldNotes() {
  if (!field) return;

  const labels = field.prepare.map((cat) => categoryLabels[cat]).join(", ");
  document.querySelector("#prepareSubjects").textContent = `หมวด: ${labels}`;

  const notes = notesData.filter((note) => field.prepare.includes(note.category));
  fieldNotes.innerHTML = "";
  if (notes.length === 0) {
    fieldNotes.innerHTML = '<p class="empty-message">ยังไม่มีโน้ตในหมวดนี้</p>';
    return;
  }
  notes.forEach((note) => fieldNotes.append(createNoteCard(note, note.id - 1)));
}

// หนังสือแนะนำจาก Open Library
async function loadFieldBooks() {
  if (!field) return;
  showLoading(fieldBooks, "กำลังโหลดหนังสือแนะนำ...");

  try {
    const { books } = await searchBooks({ subject: field.bookSubject, limit: 6 });
    fieldBooks.innerHTML = "";
    if (books.length === 0) {
      fieldBooks.innerHTML = '<p class="empty-message">ยังไม่มีหนังสือแนะนำสำหรับสาขานี้</p>';
      return;
    }
    books.forEach((book) => fieldBooks.append(createBookCard(book)));
  } catch {
    showError(fieldBooks, loadFieldBooks);
  }
}

renderField();
renderFieldNotes();
loadFieldBooks();

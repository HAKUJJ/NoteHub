// =========================================================
// NotesHub - note-detail.js
// หน้ารายละเอียดโน้ต: note.html?id=1
// ใช้ข้อมูล notesData จาก main.js และดึงหนังสือแนะนำจาก Open Library
// =========================================================

const noteDetail = document.querySelector("#noteDetail");
const relatedSection = document.querySelector("#relatedSection");
const relatedBooks = document.querySelector("#relatedBooks");

const noteId = Number(new URLSearchParams(window.location.search).get("id"));
const note = notesData.find((item) => item.id === noteId);

function renderNoteDetail() {
  if (!note) {
    noteDetail.innerHTML = `
      <div class="api-status api-error">
        <p>ไม่พบโน้ตที่ต้องการ อาจถูกลบไปแล้วหรือลิงก์ไม่ถูกต้อง</p>
        <a href="index.html" class="btn btn-primary">กลับไปหน้าแรก</a>
      </div>`;
    return;
  }

  document.title = `${note.title} - NotesHub`;
  const color = coverColors[(note.id - 1) % coverColors.length];
  const typeLabel = note.type === "exam" ? "ข้อสอบเก่า" : "สรุปเนื้อหา";

  noteDetail.className = "detail-card";
  noteDetail.innerHTML = `
    <div class="detail-cover" style="background-color: ${color}">${note.image
      ? `<img src="${noteImageUrl(note, 600, 800)}" alt="ภาพประกอบวิชา${note.subject}" onerror="this.remove()" />`
      : note.subject.charAt(0)}</div>
    <div class="detail-info">
      <p class="detail-label">${typeLabel}</p>
      <h1>${note.title}</h1>
      <p class="author">โพสต์โดย: ${note.author}</p>
      <div class="note-tags">
        <span>${categoryLabels[note.category] || note.category}</span>
        <span>${gradeLabels[note.grade] || note.grade}</span>
        <span>${typeLabel}</span>
      </div>

      <dl class="detail-meta">
        <div><dt>รายวิชา</dt><dd>${note.subject}</dd></div>
        <div><dt>จำนวนหน้า</dt><dd>${note.pages || "-"} หน้า</dd></div>
      </dl>

      <h2>รายละเอียด</h2>
      <p>${note.description || "ยังไม่มีรายละเอียด"}</p>

      ${note.topics?.length ? `
        <h2>หัวข้อในเล่ม</h2>
        <ul class="topic-list">${note.topics.map((t) => `<li>${t}</li>`).join("")}</ul>` : ""}

      <div class="detail-actions" id="noteActions">
        <button type="button" class="btn btn-secondary" disabled title="ตัวอย่างสาธิต ยังไม่มีไฟล์จริง">ดาวน์โหลดไฟล์ (เร็ว ๆ นี้)</button>
      </div>
    </div>
  `;

  // ปุ่มรายการโปรดแบบมีข้อความ
  const favItem = { kind: "note", id: String(note.id), title: note.title, subtitle: note.subject };
  const favButton = document.createElement("button");
  favButton.type = "button";
  favButton.className = "btn btn-primary";
  const paint = (active) => {
    favButton.textContent = active ? "♥ อยู่ในรายการโปรดแล้ว" : "♡ เพิ่มในรายการโปรด";
  };
  paint(isFavorite("note", favItem.id));
  favButton.addEventListener("click", () => paint(toggleFavorite(favItem)));
  document.querySelector("#noteActions").prepend(favButton);
}

// หนังสือเรียนแนะนำจาก Open Library ตามวิชาของโน้ต
async function loadRelatedBooks() {
  if (!note) return;
  const subject = bookSubjects[subjectKeyForNote(note)];
  if (!subject) return;

  relatedSection.hidden = false;
  showLoading(relatedBooks, `กำลังโหลดหนังสือ${subject.label}...`);

  try {
    const { books } = await searchBooks({ subject: subject.subject, limit: 6 });
    relatedBooks.innerHTML = "";
    if (books.length === 0) {
      relatedBooks.innerHTML = '<p class="empty-message">ยังไม่มีหนังสือแนะนำสำหรับวิชานี้</p>';
      return;
    }
    books.forEach((book) => relatedBooks.append(createBookCard(book)));
  } catch {
    showError(relatedBooks, loadRelatedBooks);
  }
}

renderNoteDetail();
loadRelatedBooks();

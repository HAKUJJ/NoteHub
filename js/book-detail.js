// =========================================================
// NotesHub - book-detail.js
// หน้ารายละเอียดหนังสือ: book.html?id=OL811195W
// ดึงข้อมูลจาก Open Library Works API
// =========================================================

const bookDetail = document.querySelector("#bookDetail");
const bookId = new URLSearchParams(window.location.search).get("id");

async function loadBookDetail() {
  if (!bookId || !/^OL\d+W$/.test(bookId)) {
    bookDetail.innerHTML = `
      <div class="api-status api-error">
        <p>ลิงก์หนังสือไม่ถูกต้อง</p>
        <a href="books.html" class="btn btn-primary">กลับไปคลังหนังสือ</a>
      </div>`;
    return;
  }

  bookDetail.className = "";
  showLoading(bookDetail, "กำลังโหลดรายละเอียดหนังสือ...");

  try {
    const book = await getBook(bookId);
    document.title = `${book.title} - NotesHub`;

    bookDetail.className = "detail-card";
    bookDetail.innerHTML = `
      <div class="detail-book-cover">
        ${book.cover
          ? `<img src="${coverUrl(book.cover, "L")}" alt="ปกหนังสือ ${escapeText(book.title)}" />`
          : `<span class="book-cover-empty">ไม่มีภาพปก</span>`}
      </div>
      <div class="detail-info">
        <p class="detail-label">หนังสือเรียนจาก Open Library</p>
        <h1>${escapeText(book.title)}</h1>
        <p class="author">ผู้เขียน: ${escapeText(book.authors.join(", ")) || "ไม่ระบุ"}</p>

        <dl class="detail-meta">
          <div><dt>พิมพ์ครั้งแรก</dt><dd>${book.firstPublished || "ไม่ระบุ"}</dd></div>
          <div><dt>รหัสหนังสือ</dt><dd>${book.id}</dd></div>
        </dl>

        <h2>รายละเอียด</h2>
        <p class="book-description">${book.description
          ? escapeText(book.description)
          : "Open Library ยังไม่มีคำอธิบายของหนังสือเล่มนี้"}</p>

        ${book.subjects.length ? `
          <h2>หัวข้อ / หมวดหมู่</h2>
          <div class="note-tags">${book.subjects.map((s) => `<span>${escapeText(s)}</span>`).join("")}</div>` : ""}

        <div class="detail-actions" id="bookActions">
          <a class="btn btn-secondary" href="${book.url}" target="_blank" rel="noopener">อ่าน / ดูเพิ่มเติมบน Open Library ↗</a>
        </div>
      </div>
    `;

    const favItem = { kind: "book", id: book.id, title: book.title, subtitle: book.authors[0] || "", cover: book.cover || null };
    const favButton = document.createElement("button");
    favButton.type = "button";
    favButton.className = "btn btn-primary";
    const paint = (active) => {
      favButton.textContent = active ? "♥ อยู่ในรายการโปรดแล้ว" : "♡ เพิ่มในรายการโปรด";
    };
    paint(isFavorite("book", book.id));
    favButton.addEventListener("click", () => paint(toggleFavorite(favItem)));
    document.querySelector("#bookActions").prepend(favButton);
  } catch {
    showError(bookDetail, loadBookDetail);
  }
}

loadBookDetail();

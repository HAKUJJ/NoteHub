// =========================================================
// NotesHub - favorites-page.js
// หน้ารายการโปรด (favorites.html): แสดงโน้ตและหนังสือที่กดหัวใจไว้
// =========================================================

const favNotes = document.querySelector("#favNotes");
const favBooks = document.querySelector("#favBooks");

function renderFavoritesPage() {
  const favorites = getFavorites();

  // ---------- โน้ต ----------
  const noteIds = favorites.filter((f) => f.kind === "note").map((f) => Number(f.id));
  const notes = notesData.filter((n) => noteIds.includes(n.id));

  favNotes.innerHTML = "";
  document.querySelector("#favNoteCount").textContent = `${notes.length} รายการ`;
  if (notes.length === 0) {
    favNotes.innerHTML = '<p class="empty-message">ยังไม่มีโน้ตในรายการโปรด กดปุ่ม ♡ บนการ์ดโน้ตที่หน้าแรกได้เลย</p>';
  } else {
    notes.forEach((note) => favNotes.append(createNoteCard(note, note.id - 1)));
  }

  // ---------- หนังสือ (ใช้ข้อมูลที่บันทึกไว้ ไม่ต้องเรียก API ซ้ำ) ----------
  const books = favorites.filter((f) => f.kind === "book");

  favBooks.innerHTML = "";
  document.querySelector("#favBookCount").textContent = `${books.length} รายการ`;
  if (books.length === 0) {
    favBooks.innerHTML = '<p class="empty-message">ยังไม่มีหนังสือในรายการโปรด ไปเลือกได้ที่ <a href="books.html">คลังหนังสือ</a></p>';
  } else {
    books.forEach((fav) =>
      favBooks.append(
        createBookCard({
          key: `/works/${fav.id}`,
          title: fav.title,
          author_name: fav.subtitle ? [fav.subtitle] : [],
          cover_i: fav.cover,
        })
      )
    );
  }
}

// กดหัวใจเอาออกแล้ว ให้การ์ดหายไปจากหน้านี้ทันที
document.addEventListener("click", (event) => {
  if (event.target.closest(".fav-btn")) setTimeout(renderFavoritesPage, 0);
});

renderFavoritesPage();

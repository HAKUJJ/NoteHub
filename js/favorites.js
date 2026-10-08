// =========================================================
// NotesHub - favorites.js
// จัดการ "รายการโปรด" เก็บไว้ใน localStorage ของเบราว์เซอร์
// ใช้ได้ทั้งโน้ตของเว็บ (kind: "note") และหนังสือจาก Open Library (kind: "book")
// ต้องโหลดไฟล์นี้ก่อน main.js
// =========================================================

const FAVORITES_KEY = "noteshub-favorites";

// อ่านรายการโปรดทั้งหมด (ถ้าอ่านไม่ได้ ให้ถือว่าว่าง)
function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch {
    return [];
  }
}

function saveFavorites(list) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
  } catch {
    // เบราว์เซอร์บางตัว (เช่นโหมดไม่ระบุตัวตน) อาจบันทึกไม่ได้ ไม่ต้องทำอะไร
  }
}

function isFavorite(kind, id) {
  return getFavorites().some((item) => item.kind === kind && item.id === id);
}

// เพิ่ม/ลบรายการโปรด แล้วคืนค่าสถานะใหม่ (true = อยู่ในรายการโปรด)
// item = { kind, id, title, subtitle, cover }
function toggleFavorite(item) {
  const list = getFavorites();
  const index = list.findIndex((fav) => fav.kind === item.kind && fav.id === item.id);

  if (index >= 0) {
    list.splice(index, 1);
  } else {
    list.push({ ...item, savedAt: Date.now() });
  }

  saveFavorites(list);
  updateFavoriteCount();
  return index < 0;
}

// อัปเดตปุ่มหัวใจให้ตรงกับสถานะ
function paintFavoriteButton(button, active) {
  button.classList.toggle("active", active);
  button.textContent = active ? "♥" : "♡";
  button.setAttribute("aria-pressed", String(active));
  button.setAttribute("aria-label", active ? "ลบออกจากรายการโปรด" : "เพิ่มในรายการโปรด");
  button.title = active ? "ลบออกจากรายการโปรด" : "เพิ่มในรายการโปรด";
}

// สร้างปุ่มหัวใจกลม ๆ ใช้วางบนการ์ด
function createFavoriteButton(item) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "fav-btn";
  paintFavoriteButton(button, isFavorite(item.kind, item.id));

  button.addEventListener("click", (event) => {
    event.preventDefault(); // กันไม่ให้ไปกดลิงก์ของการ์ด
    event.stopPropagation();
    paintFavoriteButton(button, toggleFavorite(item));
  });

  return button;
}

// ตัวเลขจำนวนรายการโปรดในเมนู (ถ้ามี <span id="favCount">)
function updateFavoriteCount() {
  const badge = document.querySelector("#favCount");
  if (!badge) return;
  const count = getFavorites().length;
  badge.textContent = count;
  badge.hidden = count === 0;
}

updateFavoriteCount();

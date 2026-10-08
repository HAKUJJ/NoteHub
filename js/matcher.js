// =========================================================
// NotesHub - matcher.js
// คำนวณสาขาวิชาที่เหมาะสมจากทักษะ ความสนใจ และงานอดิเรกที่เลือก
// =========================================================

// ข้อมูลสาขาวิชา (fields) ย้ายไปอยู่ที่ js/fields-data.js แล้ว

const matcherForm = document.querySelector("#matcherForm");
const matcherError = document.querySelector("#matcher-error");
const matcherResult = document.querySelector("#matcherResult");
const resultGrid = document.querySelector("#resultGrid");

// คืนค่า array ของ value ที่ถูกเลือกในฟอร์ม (ทุกหมวดรวมกัน)
function getSelectedTags() {
  return [...matcherForm.querySelectorAll("input[type='checkbox']:checked")].map((input) => input.value);
}

// คำนวณคะแนนความเข้ากันของแต่ละสาขา จากจำนวนแท็กที่ตรงกับที่ผู้ใช้เลือก
function calculateMatches(selectedTags) {
  return fields
    .map((field) => {
      const matched = field.tags.filter((tag) => selectedTags.includes(tag));
      const percent = Math.round((matched.length / field.tags.length) * 100);
      return { ...field, percent };
    })
    .filter((field) => field.percent > 0)
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 3);
}

// สร้างการ์ดแสดงผลลัพธ์หนึ่งสาขา
function createResultCard(field) {
  const card = document.createElement("article");
  card.className = "note-card";
  card.innerHTML = `
    <div class="note-card-cover">${field.percent}%</div>
    <div class="note-card-body">
      <h3>${field.name}</h3>
      <div class="note-tags">
        ${field.subjects.map((subject) => `<span>${subject}</span>`).join("")}
      </div>
      <a class="btn btn-primary" href="field.html?id=${field.id}">ดูวิชาที่เกี่ยวข้อง</a>
    </div>
  `;
  return card;
}

matcherForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const selectedTags = getSelectedTags();

  if (selectedTags.length === 0) {
    matcherError.textContent = "กรุณาเลือกอย่างน้อย 1 ตัวเลือกในแต่ละหมวด ก่อนกด Match";
    return;
  }

  matcherError.textContent = "";

  const matches = calculateMatches(selectedTags);

  resultGrid.innerHTML = "";
  if (matches.length === 0) {
    resultGrid.innerHTML = '<p class="empty-message">ยังไม่พบสาขาที่ตรงกับตัวเลือกของคุณ ลองเลือกเพิ่มเติมดูนะ</p>';
  } else {
    matches.forEach((field) => resultGrid.append(createResultCard(field)));
  }

  matcherResult.hidden = false;
  matcherResult.scrollIntoView({ behavior: "smooth" });
});

// ปุ่มเริ่มใหม่: ล้างฟอร์มและซ่อนผลลัพธ์
document.querySelector("#restartMatcher")?.addEventListener("click", () => {
  matcherForm.reset();
  matcherResult.hidden = true;
  matcherForm.scrollIntoView({ behavior: "smooth" });
});

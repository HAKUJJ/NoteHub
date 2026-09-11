const fields = [
  {
    name: "วิทยาการคอมพิวเตอร์",
    tags: ["programming", "technology", "problem_solving", "gaming"],
    subjects: ["Computer Science", "Software Engineering", "Information Technology"]
  },
  {
    name: "วิทยาศาสตร์ข้อมูล",
    tags: ["data_analysis", "math", "technology", "problem_solving"],
    subjects: ["Data Science", "Data Analytics", "Business Intelligence"]
  },
  {
    name: "บริหารธุรกิจ",
    tags: ["communication", "business", "blogging"],
    subjects: ["Business Administration", "Marketing", "Entrepreneurship"]
  },
  {
    name: "ศิลปะและการออกแบบ",
    tags: ["design", "art", "drawing", "photography"],
    subjects: ["Visual Arts", "Graphic Design", "Digital Media"]
  },
  {
    name: "วิทยาศาสตร์สุขภาพ",
    tags: ["health", "problem_solving", "sports"],
    subjects: ["Nursing", "Public Health", "Sports Science"]
  },
  {
    name: "นิติศาสตร์",
    tags: ["communication", "law", "reading"],
    subjects: ["Law", "Political Science", "Public Administration"]
  }
];

const matcherForm = document.querySelector("#matcherForm");
const matcherError = document.querySelector("#matcher-error");
const matcherResult = document.querySelector("#matcherResult");
const resultGrid = document.querySelector("#resultGrid");

function getSelectedTags() {
  return [...matcherForm.querySelectorAll("input[type='checkbox']:checked")].map((input) => input.value);
}

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
      <button type="button" class="btn btn-primary">ดูวิชาที่เกี่ยวข้อง</button>
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

document.querySelector("#restartMatcher")?.addEventListener("click", () => {
  matcherForm.reset();
  matcherResult.hidden = true;
  matcherForm.scrollIntoView({ behavior: "smooth" });
});

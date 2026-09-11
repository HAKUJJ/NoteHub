// =========================================================
// NotesHub - post.js
// ตรวจสอบและจำลองการส่งฟอร์มสร้างโพสต์ (ยังไม่เชื่อมต่อฐานข้อมูลจริง)
// =========================================================

const postForm = document.querySelector("#postForm");
const postStatus = document.querySelector("#postStatus");

// ตรวจสอบ field หนึ่งช่อง แล้วแสดง/ซ่อนข้อความ error ที่คู่กันไว้
function showPostFieldError(field) {
  const errorElement = document.querySelector(`#${field.id}-error`);
  if (!errorElement) return;

  errorElement.textContent = field.validity.valid ? "" : field.dataset.errorMessage || "กรุณากรอกข้อมูลให้ถูกต้อง";
  field.toggleAttribute("aria-invalid", !field.validity.valid);
}

if (postForm) {
  const requiredFields = [...postForm.querySelectorAll("[required]")];

  requiredFields.forEach((field) => {
    field.addEventListener("blur", () => showPostFieldError(field));
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") showPostFieldError(field);
    });
    field.addEventListener("change", () => {
      if (field.getAttribute("aria-invalid") === "true") showPostFieldError(field);
    });
  });

  postForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const isValid = requiredFields.every((field) => field.validity.valid);

    if (!isValid) {
      requiredFields.forEach(showPostFieldError);
      postStatus.textContent = "กรุณาแก้ไขข้อมูลในช่องที่มีข้อผิดพลาด";
      postForm.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    postStatus.textContent = "เผยแพร่โพสต์สำเร็จ (ตัวอย่างสาธิต ยังไม่เชื่อมต่อฐานข้อมูลจริง)";
    postForm.reset();
    requiredFields.forEach((field) => field.removeAttribute("aria-invalid"));
  });
}

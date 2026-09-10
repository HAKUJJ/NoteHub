// ค้นหา form หลักจาก id ที่กำหนดไว้ใน index.html
const form = document.querySelector("#registration-form");

// ค้นหาพื้นที่สำหรับแสดงข้อความสถานะ เช่น ตรวจไม่ผ่านหรือสมัครสำเร็จ
const statusMessage = document.querySelector("#form-status");

// เก็บ input, select และ textarea ทุกช่องไว้ใน Array เดียว
// เพื่อให้สามารถวนตรวจสอบทุก field ได้ด้วยเมธอด forEach() และ every()
const fields = [...form.querySelectorAll("input, select, textarea")];

// ข้อความแจ้งเตือนของแต่ละ field โดยใช้ค่า name ของ field เป็น key
// ถ้า field ใดไม่มีข้อความเฉพาะ จะใช้ข้อความเริ่มต้นในฟังก์ชัน showError()
const messages = {
  username: "Username must be 5-12 characters.",
  password: "Password must be at least 8 characters.",
  firstName: "Please enter your first name.",
  lastName: "Please enter your last name.",
  email: "Please enter a valid email address.",
  address: "Please enter your address.",
  country: "Please choose your country.",
  zip: "ZIP code must contain exactly 5 digits.",
};

// คืนค่า element ที่ใช้แสดง error ของ field นั้น ๆ
// ตัวอย่างเช่น input ที่มี id="email" จะจับคู่กับ p ที่มี id="email-error"
function getErrorElement(field) {
  return document.querySelector(`#${field.id}-error`);
}

// แสดงหรือล้างข้อความผิดพลาดของ field ปกติ
function showError(field) {
  const errorElement = getErrorElement(field);

  // หากไม่มี element สำหรับแสดง error ให้จบฟังก์ชันทันที
  if (!errorElement) return;

  // เลือกข้อความตามชื่อ field หรือใช้ข้อความทั่วไปหากไม่มีข้อความเฉพาะ
  const message = messages[field.name] || "Please complete this field.";

  // validity.valid จะเป็น true เมื่อค่าผ่านกฎ HTML เช่น required, minlength
  // และ pattern ดังนั้นจะแสดงข้อความเฉพาะตอนที่ค่าผิดเท่านั้น
  errorElement.textContent = field.validity.valid ? "" : message;

  // เพิ่ม aria-invalid="true" เพื่อให้ screen reader ทราบว่า field นี้มีปัญหา
  // และใช้ค่าเดียวกันควบคุม class สำหรับตกแต่ง field ที่ผิดด้วย CSS
  field.toggleAttribute("aria-invalid", !field.validity.valid);
  field.closest(".field")?.classList.toggle("has-error", !field.validity.valid);
}

// ตรวจสอบ field หนึ่งช่องและคืนค่า true เมื่อข้อมูลถูกต้อง
function validateField(field) {
  // checkbox กลุ่มภาษาเป็นกรณีพิเศษ เพราะต้องเลือกอย่างน้อยหนึ่งตัว
  if (field.name === "language") {
    const languageInputs = form.querySelectorAll('input[name="language"]');
    const hasLanguage = [...languageInputs].some((input) => input.checked);

    // แสดง error หากผู้ใช้ยังไม่เลือกภาษาเลย
    document.querySelector("#language-error").textContent = hasLanguage
      ? ""
      : "Choose at least one language.";
    return hasLanguage;
  }

  // radio button กลุ่มเพศเป็นกรณีพิเศษ เพราะต้องเลือกหนึ่งตัวเลือก
  if (field.name === "gender") {
    const genderInputs = form.querySelectorAll('input[name="gender"]');
    const hasGender = [...genderInputs].some((input) => input.checked);

    // แสดง error หากผู้ใช้ยังไม่เลือกตัวเลือกใดเลย
    document.querySelector("#gender-error").textContent = hasGender
      ? ""
      : "Please choose an option.";
    return hasGender;
  }

  // field ประเภทอื่นใช้กฎ validation ที่กำหนดไว้ใน HTML
  showError(field);
  return field.validity.valid;
}

// ตรวจสอบ field เมื่อผู้ใช้ออกจากช่องนั้น (blur)
// และตรวจซ้ำขณะพิมพ์ เฉพาะ field ที่เคยแสดงว่าไม่ถูกต้องแล้ว
fields.forEach((field) => {
  field.addEventListener("blur", () => validateField(field));
  field.addEventListener("input", () => {
    if (field.getAttribute("aria-invalid") === "true") validateField(field);
  });
});

// จัดการตอนผู้ใช้กดปุ่ม Create account
form.addEventListener("submit", (event) => {
  // ป้องกัน browser ส่ง form ไปยัง server และทำให้หน้าเว็บ reload
  event.preventDefault();

  // every() จะคืนค่า true ก็ต่อเมื่อทุก field ผ่านการตรวจสอบ
  const isValid = fields.every(validateField);

  if (!isValid) {
    // แจ้งให้ผู้ใช้แก้ไขข้อมูล และเลื่อนไปยัง field ที่ผิดช่องแรก
    statusMessage.textContent =
      "Please fix the highlighted fields and try again.";
    form.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  // กรณีข้อมูลถูกต้อง: แสดงข้อความสำเร็จ
  statusMessage.textContent =
    "Registration complete! This demo does not send data to a server.";

  // ล้างค่าทั้งหมดใน form หลังการลงทะเบียนสำเร็จ
  form.reset();

  // ล้างสถานะ error ที่อาจค้างอยู่จากการตรวจสอบก่อนหน้า
  fields.forEach((field) => {
    field.removeAttribute("aria-invalid");
    field.closest(".field")?.classList.remove("has-error");
  });
});

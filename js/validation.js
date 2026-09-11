function showFieldError(field) {
  const errorElement = document.querySelector(`#${field.id}-error`);
  if (!errorElement) return;

  errorElement.textContent = field.validity.valid ? "" : field.dataset.errorMessage || "กรุณากรอกข้อมูลให้ถูกต้อง";
  field.toggleAttribute("aria-invalid", !field.validity.valid);
}

function setupFormValidation(formId, statusId) {
  const form = document.querySelector(`#${formId}`);
  if (!form) return;

  const statusMessage = document.querySelector(`#${statusId}`);
  const fields = [...form.querySelectorAll("input")];

  fields.forEach((field) => {
    field.addEventListener("blur", () => showFieldError(field));
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") showFieldError(field);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const password = form.querySelector('input[name="password"]');
    const confirmPassword = form.querySelector('input[name="confirmPassword"]');
    if (password && confirmPassword) {
      const matched = password.value === confirmPassword.value;
      confirmPassword.setCustomValidity(matched ? "" : "รหัสผ่านไม่ตรงกัน");
      showFieldError(confirmPassword);
    }

    const isValid = fields.every((field) => field.validity.valid);

    if (!isValid) {
      if (statusMessage) statusMessage.textContent = "กรุณาแก้ไขข้อมูลในช่องที่มีข้อผิดพลาด";
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    if (statusMessage) {
      statusMessage.textContent =
        formId === "loginForm"
          ? "เข้าสู่ระบบสำเร็จ (ตัวอย่างสาธิต ยังไม่เชื่อมต่อฐานข้อมูลจริง)"
          : "สมัครสมาชิกสำเร็จ (ตัวอย่างสาธิต ยังไม่เชื่อมต่อฐานข้อมูลจริง)";
    }

    form.reset();
    fields.forEach((field) => field.removeAttribute("aria-invalid"));
  });
}

setupFormValidation("loginForm", "loginStatus");
setupFormValidation("registerForm", "registerStatus");

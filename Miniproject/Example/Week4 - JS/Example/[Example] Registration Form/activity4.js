document.addEventListener("DOMContentLoaded", () => {
  // รอให้ HTML โหลดเสร็จก่อน จึงค้นหาแบบฟอร์มและช่องกรอกข้อมูลได้อย่างปลอดภัย
  const form = document.querySelector("#studentRegForm");
  const sid = document.querySelector("#studentId");
  const name = document.querySelector("#fullName");
  const email = document.querySelector("#email");
  const gpa = document.querySelector("#gpa");
  const pass = document.querySelector("#password");

  // ฟังก์ชันช่วยจัดการคลาสสถานะและข้อความเตือน
  // ถ้าข้อมูลถูกต้องจะแสดงกรอบสีเขียว ถ้าไม่ถูกต้องจะแสดงกรอบสีแดงพร้อมข้อความเตือน
  function setFieldState(inputEl, errorEl, isValid) {
    if (isValid) {
      inputEl.classList.remove("invalid");
      inputEl.classList.add("valid");
      errorEl.style.display = "none";
    } else {
      inputEl.classList.remove("valid");
      inputEl.classList.add("invalid");
      errorEl.style.display = "block";
    }
  }

  // ฟังก์ชันตรวจสอบแต่ละฟิลด์
  const validateSid = () => {
    // รหัสนักศึกษาต้องเป็นตัวเลขเท่านั้นและมีจำนวน 10 หลักพอดี
    const valid = /^[0-9]{10}$/.test(sid.value.trim());
    setFieldState(sid, document.querySelector("#studentIdErr"), valid);
    return valid;
  };

  const validateName = () => {
    // ตัดช่องว่างหัวท้ายก่อนตรวจ เพื่อไม่ให้กรอกเป็นช่องว่างอย่างเดียว
    const valid = name.value.trim().length > 0;
    setFieldState(name, document.querySelector("#fullNameErr"), valid);
    return valid;
  };

  const validateEmail = () => {
    // อีเมลต้องลงท้ายด้วยโดเมนมหาวิทยาลัย และต้องมีข้อมูลก่อน @bu.ac.th
    const val = email.value.trim().toLowerCase();
    const valid = val.endsWith("@bu.ac.th") && val.length > 10;
    setFieldState(email, document.querySelector("#emailErr"), valid);
    return valid;
  };

  const validateGpa = () => {
    // แปลงค่าที่กรอกเป็นตัวเลข แล้วตรวจว่าคะแนนอยู่ในช่วง 0.00 ถึง 4.00
    const num = parseFloat(gpa.value);
    const valid = !isNaN(num) && num >= 0.0 && num <= 4.0;
    setFieldState(gpa, document.querySelector("#gpaErr"), valid);
    return valid;
  };

  const validatePass = () => {
    // รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร
    const valid = pass.value.length >= 8;
    setFieldState(pass, document.querySelector("#passwordErr"), valid);
    return valid;
  };

  // ผูกเหตุการณ์ตอน Blur (ตรวจเมื่อย้ายเคอร์เซอร์ออก)
  // ช่วยให้ผู้ใช้เห็นผลตรวจสอบทันทีหลังกรอกข้อมูลแต่ละช่องเสร็จ
  sid.addEventListener("blur", validateSid);
  name.addEventListener("blur", validateName);
  email.addEventListener("blur", validateEmail);
  gpa.addEventListener("blur", validateGpa);
  pass.addEventListener("blur", validatePass);

  // ผูกเหตุการณ์ตอน Input (ลบกรอบแดงทันทีเมื่อพิมพ์แก้ไขถูกต้อง)
  // จะตรวจซ้ำเฉพาะช่องที่เคยผิด เพื่อลดการรบกวนขณะผู้ใช้กำลังพิมพ์
  sid.addEventListener("input", () => {
    if (sid.classList.contains("invalid")) validateSid();
  });
  name.addEventListener("input", () => {
    if (name.classList.contains("invalid")) validateName();
  });
  email.addEventListener("input", () => {
    if (email.classList.contains("invalid")) validateEmail();
  });
  gpa.addEventListener("input", () => {
    if (gpa.classList.contains("invalid")) validateGpa();
  });
  pass.addEventListener("input", () => {
    if (pass.classList.contains("invalid")) validatePass();
  });

  // ตรวจสอบรวมตอนกด Submit ฟอร์ม
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้าเว็บ

    // เรียกตรวจสอบทุกช่อง หากมีช่องใดไม่ผ่าน จะไม่ดำเนินการส่งข้อมูล
    const isFormValid =
      validateSid() &&
      validateName() &&
      validateEmail() &&
      validateGpa() &&
      validatePass();

    if (isFormValid) {
      // รวมข้อมูลที่ผ่านการตรวจสอบเป็น Object เพื่อเตรียมส่งไปยัง Backend
      const payload = {
        studentId: sid.value.trim(),
        fullName: name.value.trim(),
        email: email.value.trim().toLowerCase(),
        gpa: parseFloat(gpa.value),
        submittedAt: new Date().toISOString(),
      };

      alert(" ผ่านการตรวจสอบข้อมูล! พร้อมส่งต่อไปยัง Node.js Backend");
      console.log("JSON Payload สำหรับส่งออกไปยัง Express API:", payload);

      // ล้างข้อมูลในฟอร์มหลังลงทะเบียนสำเร็จ และลบสถานะกรอบสีเขียว
      form.reset();
      document
        .querySelectorAll("input")
        .forEach((i) => i.classList.remove("valid"));
    } else {
      // แจ้งให้ผู้ใช้แก้ไขช่องที่มีกรอบสีแดงก่อนส่งข้อมูลอีกครั้ง
      alert(" กรุณาแก้ไขข้อมูลในช่องสีแดงให้ถูกต้องครบถ้วน");
    }
  });
});

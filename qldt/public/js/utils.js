/**
 * UTILS.JS - Các hàm tiện ích
 */

// Format số tiền thành định dạng tiền tệ Việt Nam
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);
}

// Format ngày tháng theo định dạng Việt Nam (DD/MM/YYYY)
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

// Tạo thông báo toast
function showToast(message, type = "info", duration = 3000) {
  // Kiểm tra xem container đã tồn tại chưa
  let toastContainer = document.querySelector(".toast-container");

  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  // Tạo toast
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <i class="toast-icon fa ${getIconForToastType(type)}"></i>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close">&times;</button>
  `;

  // Thêm toast vào container
  toastContainer.appendChild(toast);

  // Hiệu ứng hiển thị
  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  // Xử lý nút đóng
  const closeBtn = toast.querySelector(".toast-close");
  closeBtn.addEventListener("click", () => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 300);
  });

  // Tự động đóng sau thời gian
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, duration);
}

// Lấy icon cho toast dựa vào loại
function getIconForToastType(type) {
  switch (type) {
    case "success":
      return "fa-check-circle";
    case "error":
      return "fa-exclamation-circle";
    case "warning":
      return "fa-exclamation-triangle";
    case "info":
    default:
      return "fa-info-circle";
  }
}

// Xác thực form
function validateForm(formId, rules) {
  const form = document.getElementById(formId);
  if (!form) return false;

  let isValid = true;

  // Xóa tất cả thông báo lỗi cũ
  const errorMessages = form.querySelectorAll(".error-message");
  errorMessages.forEach((el) => el.remove());

  // Xóa class error từ tất cả các trường
  const formInputs = form.querySelectorAll("input, select, textarea");
  formInputs.forEach((input) => {
    input.classList.remove("error");
  });

  // Kiểm tra từng trường theo rules
  for (const fieldName in rules) {
    const field = form.querySelector(`[name="${fieldName}"]`);
    if (!field) continue;

    const fieldRules = rules[fieldName];

    // Kiểm tra required
    if (fieldRules.required && !field.value.trim()) {
      showFieldError(field, fieldRules.required);
      isValid = false;
      continue;
    }

    // Kiểm tra min length
    if (
      fieldRules.minLength &&
      field.value.length < fieldRules.minLength.value
    ) {
      showFieldError(field, fieldRules.minLength.message);
      isValid = false;
      continue;
    }

    // Kiểm tra max length
    if (
      fieldRules.maxLength &&
      field.value.length > fieldRules.maxLength.value
    ) {
      showFieldError(field, fieldRules.maxLength.message);
      isValid = false;
      continue;
    }

    // Kiểm tra pattern
    if (fieldRules.pattern && !fieldRules.pattern.value.test(field.value)) {
      showFieldError(field, fieldRules.pattern.message);
      isValid = false;
      continue;
    }

    // Kiểm tra custom validator
    if (fieldRules.validator && !fieldRules.validator.validate(field.value)) {
      showFieldError(field, fieldRules.validator.message);
      isValid = false;
      continue;
    }
  }

  return isValid;
}

// Hiển thị lỗi cho trường
function showFieldError(field, message) {
  field.classList.add("error");

  const errorElement = document.createElement("div");
  errorElement.className = "error-message";
  errorElement.textContent = message;

  const parent = field.parentElement;
  parent.appendChild(errorElement);
}

// Hàm debounce để giới hạn số lần gọi hàm
function debounce(func, wait) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

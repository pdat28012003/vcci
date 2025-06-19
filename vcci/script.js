// Initialize all scripts after components are loaded
function initializeScripts() {
  console.log("🎯 Initializing scripts...");

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Initialize other functions
  initializeAnimations();
  initializeGalleryFilter();
  initializeHeaderEffects();
  initializeMobileMenu();

  console.log("✅ All scripts initialized");
}

// Animation on scroll
function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, observerOptions);

  document.querySelectorAll(".animate-on-scroll").forEach((el) => {
    observer.observe(el);
  });
}

// Gallery filter functionality
function initializeGalleryFilter() {
  const filterButtons = document.querySelectorAll(".filter-button");
  const galleryItems = document.querySelectorAll(".gallery-item");

  if (filterButtons.length === 0 || galleryItems.length === 0) {
    return; // Exit if elements not found
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      // Add active class to clicked button
      button.classList.add("active");

      const filterValue = button.getAttribute("data-filter");

      galleryItems.forEach((item) => {
        if (
          filterValue === "all" ||
          item.getAttribute("data-category") === filterValue
        ) {
          item.style.display = "block";
          setTimeout(() => {
            item.style.opacity = "1";
            item.style.transform = "scale(1)";
          }, 100);
        } else {
          item.style.opacity = "0";
          item.style.transform = "scale(0.8)";
          setTimeout(() => {
            item.style.display = "none";
          }, 300);
        }
      });
    });
  });

  // Initialize gallery items
  galleryItems.forEach((item) => {
    item.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  });
}

// Mobile menu functionality
function initializeMobileMenu() {
  // Mobile menu toggle function
  window.toggleMobileMenu = function () {
    const navMenu = document.querySelector(".nav-menu");
    if (navMenu) {
      navMenu.classList.toggle("active");
    }
  };
}

// Header scroll effects
function initializeHeaderEffects() {
  window.addEventListener("scroll", () => {
    const header = document.querySelector(".header");
    if (header) {
      if (window.scrollY > 100) {
        header.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
        header.style.backdropFilter = "blur(10px)";
      } else {
        header.style.backgroundColor = "#fff";
        header.style.backdropFilter = "none";
      }
    }
  });
}

// Loading animation
document.addEventListener("DOMContentLoaded", () => {
  // Add fade-in effect to body
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease";

  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);
});

// Contact form validation (if form is added later)
function validateContactForm(formData) {
  const errors = [];

  if (!formData.name || formData.name.trim().length < 2) {
    errors.push("Tên phải có ít nhất 2 ký tự");
  }

  if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.push("Email không hợp lệ");
  }

  if (
    !formData.phone ||
    !/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))
  ) {
    errors.push("Số điện thoại không hợp lệ");
  }

  return errors;
}

// Utility functions
const utils = {
  // Format phone number
  formatPhone: (phone) => {
    return phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
  },

  // Format date
  formatDate: (date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  },

  // Debounce function
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
};

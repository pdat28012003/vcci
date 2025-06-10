/**
 * MAIN.JS - Xử lý chính cho trang web
 */

// Xử lý khi trang đã tải xong
document.addEventListener("DOMContentLoaded", function () {
  initSidebar();
  initSubmenuHandlers();
  setActiveMenu();
});

// Khởi tạo sidebar
function initSidebar() {
  // Xử lý toggle sidebar trên mobile
  const toggleSidebarBtn = document.querySelector(".toggle-sidebar");
  const sidebar = document.querySelector(".sidebar");
  const sidebarOverlay = document.querySelector(".sidebar-overlay");
  const mainContent = document.querySelector(".main-content");

  if (toggleSidebarBtn) {
    toggleSidebarBtn.addEventListener("click", function () {
      sidebar.classList.toggle("active");
      sidebarOverlay.classList.toggle("active");
      mainContent.classList.toggle("sidebar-active");
    });
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", function () {
      sidebar.classList.remove("active");
      sidebarOverlay.classList.remove("active");
      mainContent.classList.remove("sidebar-active");
    });
  }
}

// Khởi tạo xử lý submenu
function initSubmenuHandlers() {
  // Xử lý submenu trong sidebar
  const hasSubmenuItems = document.querySelectorAll(".has-submenu > a");
  
  hasSubmenuItems.forEach(function (item) {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const parent = this.parentElement;
      
      // Đóng tất cả các submenu khác
      const activeItems = document.querySelectorAll(".has-submenu.active");
      activeItems.forEach(function (activeItem) {
        if (activeItem !== parent) {
          activeItem.classList.remove("active");
        }
      });
      
      // Toggle active class cho submenu hiện tại
      parent.classList.toggle("active");
    });
  });
}

// Xử lý active menu dựa trên URL hiện tại
function setActiveMenu() {
  const currentPath = window.location.pathname;
  const menuItems = document.querySelectorAll(".sidebar-menu a");
  
  menuItems.forEach(function (item) {
    const href = item.getAttribute("href");
    if (href && (href === currentPath || currentPath.includes(href))) {
      item.classList.add("active");
      
      // Nếu item nằm trong submenu, mở submenu đó
      const parentSubmenu = item.closest(".submenu");
      if (parentSubmenu) {
        const parentItem = parentSubmenu.parentElement;
        parentItem.classList.add("active");
      }
    }
  });
}

// Hàm hiển thị nội dung khi click vào menu - được gọi từ React
window.showContent = function(contentId) {
  // Ẩn tất cả các phần nội dung
  const contentSections = document.querySelectorAll(".content-section");
  contentSections.forEach(function (section) {
    section.classList.remove("active");
  });
  
  // Hiển thị phần nội dung được chọn
  const selectedContent = document.getElementById(contentId);
  if (selectedContent) {
    selectedContent.classList.add("active");
    
    // Đóng sidebar trên mobile khi chọn menu
    if (window.innerWidth <= 768) {
      const sidebar = document.querySelector(".sidebar");
      const sidebarOverlay = document.querySelector(".sidebar-overlay");
      const mainContent = document.querySelector(".main-content");
      
      sidebar.classList.remove("active");
      sidebarOverlay.classList.remove("active");
      mainContent.classList.remove("sidebar-active");
    }
    
    // Cuộn lên đầu trang
    window.scrollTo(0, 0);
  }
}
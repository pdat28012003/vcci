# Cộng Đồng CEO VCCI - Website

Website chính thức của Cộng Đồng CEO VCCI với kiến trúc component modular.

## 📁 Cấu trúc thư mục

```
c:/Users/dat/vcci/
├── index.html              # File HTML chính
├── styles.css              # File CSS chính
├── script.js               # File JavaScript chính
├── component-loader.js     # Component loader system
├── components/             # Thư mục chứa các component
│   ├── header.html         # Component header
│   ├── hero.html           # Component hero section
│   ├── registration.html   # Component đăng ký
│   ├── gallery.html        # Component gallery
│   └── footer.html         # Component footer
├── vcci.md                 # File gốc (backup)
└── README.md               # File hướng dẫn này
```

## 🚀 Tính năng

### ✨ **Component System**
- **Modular Architecture**: Mỗi phần của website được tách thành component riêng biệt
- **Dynamic Loading**: Components được load tự động khi trang web khởi chạy
- **Easy Maintenance**: Dễ dàng chỉnh sửa từng phần mà không ảnh hưởng đến phần khác

### 🎨 **Giao diện**
- **Responsive Design**: Tương thích với mọi thiết bị
- **Modern UI/UX**: Thiết kế hiện đại với animations mượt mà
- **Loading Screen**: Màn hình loading chuyên nghiệp
- **Mobile Menu**: Menu responsive cho mobile

### ⚡ **Chức năng**
- **Smooth Scrolling**: Cuộn mượt mà giữa các section
- **Gallery Filter**: Lọc hình ảnh theo danh mục
- **Animation on Scroll**: Hiệu ứng xuất hiện khi cuộn
- **Contact Integration**: Liên kết trực tiếp với điện thoại và email

## 🛠️ Cách sử dụng

### **1. Chạy trực tiếp**
```bash
# Mở file index.html trong trình duyệt
double-click index.html
```

### **2. Sử dụng Live Server (Khuyến nghị)**
```bash
# Trong VS Code, cài đặt Live Server extension
# Right-click vào index.html → "Open with Live Server"
```

### **3. Upload lên hosting**
```bash
# Upload tất cả files lên web hosting
# Đảm bảo cấu trúc thư mục được giữ nguyên
```

## 🔧 Tùy chỉnh

### **Thêm component mới**
1. Tạo file HTML mới trong thư mục `components/`
2. Đăng ký component trong `component-loader.js`:
```javascript
componentLoader.register('tên-component', './components/tên-file.html');
```
3. Thêm container trong `index.html`:
```html
<div id="tên-container"></div>
```
4. Load component:
```javascript
await componentLoader.loadComponent('tên-component', '#tên-container');
```

### **Chỉnh sửa styles**
- Chỉnh sửa file `styles.css` để thay đổi giao diện
- Styles được tổ chức theo từng section rõ ràng

### **Thêm JavaScript**
- Thêm function mới vào `script.js`
- Gọi function trong `initializeScripts()` để đảm bảo chạy sau khi components đã load

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 768px) { ... }

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) { ... }

/* Desktop */
@media (min-width: 1025px) { ... }
```

## 🎯 SEO & Performance

- **Meta tags** được tối ưu cho SEO
- **Open Graph** tags cho social media
- **Font optimization** với Google Fonts
- **Image optimization** với lazy loading
- **Component caching** với browser cache

## 🔗 Liên kết quan trọng

- **Đăng ký**: https://docs.google.com/forms/d/e/1FAIpQLScJG-xVT2_MOnH7u7iyWyiLIa_Vy8gn8RH-sdPv2Yb3xgxmDQ/viewform
- **Điện thoại**: 0983 967 567
- **Email**: tramnguyenvcci@gmail.com

## 🐛 Troubleshooting

### **Components không load**
- Kiểm tra console browser (F12) để xem lỗi
- Đảm bảo cấu trúc thư mục đúng
- Kiểm tra đường dẫn trong `component-loader.js`

### **Styles không hiển thị**
- Kiểm tra file `styles.css` có tồn tại
- Xóa cache browser (Ctrl+F5)
- Kiểm tra đường dẫn CSS trong `index.html`

### **JavaScript không hoạt động**
- Mở console browser để xem lỗi
- Đảm bảo `script.js` được load sau `component-loader.js`
- Kiểm tra function `initializeScripts()` được gọi

## 📞 Hỗ trợ

Nếu cần hỗ trợ, liên hệ:
- **Ms. Trâm**: 0983 967 567
- **Email**: tramnguyenvcci@gmail.com
- **Thời gian**: 8:00 - 17:00 (T2-T6)

---

**© 2024 Cộng Đồng CEO VCCI. Tất cả quyền được bảo lưu.**
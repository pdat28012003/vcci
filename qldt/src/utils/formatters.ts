/**
 * Định dạng số tiền theo định dạng tiền tệ Việt Nam
 * @param amount Số tiền cần định dạng
 * @returns Chuỗi đã được định dạng (ví dụ: 1.000.000 VNĐ)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Định dạng ngày tháng theo định dạng Việt Nam
 * @param dateString Chuỗi ngày tháng (ISO format hoặc Date object)
 * @returns Chuỗi ngày tháng đã được định dạng (ví dụ: 15/05/2024)
 */
export const formatDate = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Định dạng ngày giờ theo định dạng Việt Nam
 * @param dateString Chuỗi ngày tháng (ISO format hoặc Date object)
 * @returns Chuỗi ngày giờ đã được định dạng (ví dụ: 15/05/2024 10:30)
 */
export const formatDateTime = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Chuyển đổi số thành chuỗi có dấu phân cách hàng nghìn
 * @param number Số cần định dạng
 * @returns Chuỗi đã được định dạng (ví dụ: 1.000.000)
 */
export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('vi-VN').format(number);
};

/**
 * Rút gọn văn bản nếu quá dài
 * @param text Văn bản cần rút gọn
 * @param maxLength Độ dài tối đa
 * @returns Văn bản đã được rút gọn
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
import { ContactInfo, FamilyInfo, Document } from "./studentProfileService";

// Định nghĩa các interface cho dữ liệu cập nhật
export interface AddressInfo {
  permanentAddress: {
    province: string;
    district: string;
    ward: string;
    street: string;
  };
  temporaryAddress: {
    province: string;
    district: string;
    ward: string;
    street: string;
  };
  currentResidence: string;
  dormitoryRoom: string;
}

export interface AccountInfo {
  username: string;
  currentPassword: string;
  newPassword: string;
  securityQuestion: string;
  securityAnswer: string;
}

// Mock data cho các tỉnh/thành phố, quận/huyện, phường/xã
export const provinces = [
  { id: "01", name: "Hà Nội" },
  { id: "02", name: "TP. Hồ Chí Minh" },
  { id: "03", name: "Đà Nẵng" },
  { id: "04", name: "Hải Phòng" },
  { id: "05", name: "Cần Thơ" },
  { id: "06", name: "An Giang" },
  { id: "07", name: "Bà Rịa - Vũng Tàu" },
  { id: "08", name: "Bắc Giang" },
  { id: "09", name: "Bắc Kạn" },
  { id: "10", name: "Bạc Liêu" },
  { id: "11", name: "Bắc Ninh" },
  { id: "12", name: "Bến Tre" },
  { id: "13", name: "Bình Định" },
  { id: "14", name: "Bình Dương" },
  { id: "15", name: "Bình Phước" },
  { id: "16", name: "Bình Thuận" },
  { id: "17", name: "Cà Mau" },
  { id: "18", name: "Cao Bằng" },
  { id: "19", name: "Đắk Lắk" },
  { id: "20", name: "Đắk Nông" },
  { id: "21", name: "Điện Biên" },
  { id: "22", name: "Đồng Nai" },
  { id: "23", name: "Đồng Tháp" },
  { id: "24", name: "Gia Lai" },
  { id: "25", name: "Hà Giang" },
  { id: "26", name: "Hà Nam" },
  { id: "27", name: "Hà Tĩnh" },
  { id: "28", name: "Hải Dương" },
  { id: "29", name: "Hậu Giang" },
  { id: "30", name: "Hòa Bình" },
  { id: "31", name: "Hưng Yên" },
  { id: "32", name: "Khánh Hòa" },
  { id: "33", name: "Kiên Giang" },
  { id: "34", name: "Kon Tum" },
  { id: "35", name: "Lai Châu" },
  { id: "36", name: "Lâm Đồng" },
  { id: "37", name: "Lạng Sơn" },
  { id: "38", name: "Lào Cai" },
  { id: "39", name: "Long An" },
  { id: "40", name: "Nam Định" },
  { id: "41", name: "Nghệ An" },
  { id: "42", name: "Ninh Bình" },
  { id: "43", name: "Ninh Thuận" },
  { id: "44", name: "Phú Thọ" },
  { id: "45", name: "Phú Yên" },
  { id: "46", name: "Quảng Bình" },
  { id: "47", name: "Quảng Nam" },
  { id: "48", name: "Quảng Ngãi" },
  { id: "49", name: "Quảng Ninh" },
  { id: "50", name: "Quảng Trị" },
  { id: "51", name: "Sóc Trăng" },
  { id: "52", name: "Sơn La" },
  { id: "53", name: "Tây Ninh" },
  { id: "54", name: "Thái Bình" },
  { id: "55", name: "Thái Nguyên" },
  { id: "56", name: "Thanh Hóa" },
  { id: "57", name: "Thừa Thiên Huế" },
  { id: "58", name: "Tiền Giang" },
  { id: "59", name: "Trà Vinh" },
  { id: "60", name: "Tuyên Quang" },
  { id: "61", name: "Vĩnh Long" },
  { id: "62", name: "Vĩnh Phúc" },
  { id: "63", name: "Yên Bái" },
];

// Service API cho cập nhật thông tin sinh viên
const updateInfoService = {
  // Lấy danh sách quận/huyện theo tỉnh/thành phố
  getDistrictsByProvince: async (provinceId: string): Promise<any[]> => {
    // Trong môi trường thực tế, đây sẽ là một API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock data
        const districts = [
          { id: "001", name: "Quận/Huyện 1", provinceId },
          { id: "002", name: "Quận/Huyện 2", provinceId },
          { id: "003", name: "Quận/Huyện 3", provinceId },
          { id: "004", name: "Quận/Huyện 4", provinceId },
          { id: "005", name: "Quận/Huyện 5", provinceId },
        ];
        resolve(districts);
      }, 300);
    });
  },

  // Lấy danh sách phường/xã theo quận/huyện
  getWardsByDistrict: async (districtId: string): Promise<any[]> => {
    // Trong môi trường thực tế, đây sẽ là một API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock data
        const wards = [
          { id: "00101", name: "Phường/Xã 1", districtId },
          { id: "00102", name: "Phường/Xã 2", districtId },
          { id: "00103", name: "Phường/Xã 3", districtId },
          { id: "00104", name: "Phường/Xã 4", districtId },
          { id: "00105", name: "Phường/Xã 5", districtId },
        ];
        resolve(wards);
      }, 300);
    });
  },

  // Cập nhật thông tin liên hệ
  updateContactInfo: async (contactInfo: ContactInfo): Promise<ContactInfo> => {
    // Trong môi trường thực tế, đây sẽ là một API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(contactInfo);
      }, 1000);
    });
  },

  // Cập nhật thông tin địa chỉ
  updateAddressInfo: async (addressInfo: AddressInfo): Promise<AddressInfo> => {
    // Trong môi trường thực tế, đây sẽ là một API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(addressInfo);
      }, 1000);
    });
  },

  // Cập nhật thông tin gia đình
  updateFamilyInfo: async (familyInfo: FamilyInfo): Promise<FamilyInfo> => {
    // Trong môi trường thực tế, đây sẽ là một API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(familyInfo);
      }, 1000);
    });
  },

  // Tải lên tài liệu mới
  uploadNewDocument: async (
    documentType: string,
    documentName: string,
    file: File,
    note?: string
  ): Promise<Document> => {
    // Trong môi trường thực tế, đây sẽ là một API call để upload file
    return new Promise((resolve) => {
      setTimeout(() => {
        const newDocument: Document = {
          id: `doc${Date.now()}`,
          name: documentName,
          status: "processing",
          fileUrl: URL.createObjectURL(file),
          icon:
            documentType === "identity"
              ? "fa-id-card"
              : documentType === "education"
              ? "fa-graduation-cap"
              : "fa-file-text",
        };
        resolve(newDocument);
      }, 1000);
    });
  },

  // Cập nhật thông tin tài khoản
  updateAccountInfo: async (accountInfo: AccountInfo): Promise<boolean> => {
    // Trong môi trường thực tế, đây sẽ là một API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Kiểm tra mật khẩu hiện tại (giả lập)
        if (accountInfo.currentPassword === "password") {
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  },
};

export default updateInfoService;

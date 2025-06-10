import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import useUpdateInfo from "../hooks/useUpdateInfo";
import useStudentProfile from "../hooks/useStudentProfile";
import { useForm, useToast } from "../hooks/useUtils";
import {
  ContactInfo,
  FamilyInfo,
  FamilyMember,
} from "../services/studentProfileService";
import {
  AddressInfo,
  AccountInfo,
  provinces,
} from "../services/updateInfoService";

// Styled Components
const UpdateContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: 30px;
  overflow: hidden;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;

  i {
    margin-right: 10px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const UpdateIntro = styled.div`
  margin-bottom: 30px;

  p {
    margin-bottom: 15px;
    line-height: 1.5;
  }
`;

const NoteBox = styled.div`
  background-color: rgba(255, 193, 7, 0.1);
  border-left: 4px solid #ffc107;
  padding: 15px;
  border-radius: 4px;

  p {
    margin: 0;

    strong {
      color: ${({ theme }) => theme.colors.text};
    }
  }
`;

const Required = styled.span`
  color: ${({ theme }) => theme.colors.danger};
  margin-left: 3px;
`;

const FormTabs = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  background-color: white;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &::-webkit-scrollbar {
    height: 0;
    display: none;
  }

  scrollbar-width: none;
`;

const TabButton = styled.button<{ isActive: boolean }>`
  padding: 15px 20px;
  background-color: transparent;
  border: none;
  border-bottom: 3px solid
    ${({ isActive, theme }) =>
      isActive ? theme.colors.primary : "transparent"};
  color: ${({ isActive, theme }) =>
    isActive ? theme.colors.primary : theme.colors.text};
  font-weight: ${({ isActive }) => (isActive ? "500" : "400")};
  cursor: pointer;
  white-space: nowrap;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
  }

  i {
    margin-right: 8px;
  }
`;

const TabContent = styled.div<{ isActive: boolean }>`
  display: ${({ isActive }) => (isActive ? "block" : "none")};
  padding: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FormRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: 10px;
  }
`;

const FormColumn = styled.div`
  flex: 1;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 16px;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:read-only {
    background-color: ${({ theme }) => theme.colors.light};
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 16px;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 16px;
  transition: border-color ${({ theme }) => theme.transitions.fast};
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SmallText = styled.small`
  display: block;
  margin-top: 5px;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 12px;
`;

const AddressInputs = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  padding: 15px;
  margin-top: 10px;
`;

const FamilyMemberForm = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;

  h4 {
    margin: 0 0 15px 0;
    font-size: 16px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const AddSiblingButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background-color: ${({ theme }) => theme.colors.light};
  color: ${({ theme }) => theme.colors.text};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
  }

  i {
    font-size: 14px;
  }
`;

const DocumentUploadSection = styled.div`
  margin-bottom: 30px;

  h4 {
    margin: 0 0 15px 0;
    font-size: 16px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};
  }

  p {
    margin-bottom: 15px;
    line-height: 1.5;
  }
`;

const DocumentListSection = styled.div`
  h4 {
    margin: 0 0 15px 0;
    font-size: 16px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const DocumentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const DocumentItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: ${({ theme }) => theme.colors.light};
  border-radius: 8px;
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const DocumentIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(74, 144, 226, 0.1);
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  margin-right: 15px;

  i {
    font-size: 20px;
  }
`;

const DocumentInfo = styled.div`
  flex: 1;
`;

const DocumentName = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
`;

const DocumentMeta = styled.div`
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};

  span {
    display: flex;
    align-items: center;

    i {
      margin-right: 5px;
    }
  }
`;

const DocumentStatus = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: ${({ status, theme }) => {
    switch (status) {
      case "completed":
        return "#4CAF50";
      case "processing":
        return "#FF9800";
      case "not-submitted":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  }};
`;

const DocumentActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: white;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
`;

const CancelButton = styled.button`
  padding: 12px 24px;
  background-color: white;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.light};
  }

  i {
    font-size: 16px;
  }
`;

const SaveButton = styled.button`
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }

  i {
    font-size: 16px;
  }
`;

const UploadButton = styled.button`
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }

  i {
    font-size: 16px;
  }
`;

const LoadingOverlay = styled.div<{ isVisible: boolean }>`
  display: ${({ isVisible }) => (isVisible ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  align-items: center;
  justify-content: center;

  div {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 10px;

    i {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
`;

const UpdateStudentInfo: React.FC = () => {
  const {
    profile,
    loading: profileLoading,
    refreshProfile,
  } = useStudentProfile();
  const {
    loading,
    activeTab,
    showUpdateTab,
    updateContactInfo,
    updateAddressInfo,
    updateFamilyInfo,
    uploadNewDocument,
    updateAccountInfo,
    cancelUpdate,
  } = useUpdateInfo();
  const { showToast } = useToast();

  // State cho danh sách quận/huyện và phường/xã
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [tempDistricts, setTempDistricts] = useState<any[]>([]);
  const [tempWards, setTempWards] = useState<any[]>([]);

  // State cho form thông tin liên hệ
  const contactForm = useForm<ContactInfo>({
    phone: "",
    personalEmail: "",
    schoolEmail: "",
    facebook: "",
    permanentAddress: "",
    temporaryAddress: "",
    currentResidence: "",
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
      address: "",
    },
  });

  // State cho form địa chỉ
  const addressForm = useForm<AddressInfo>({
    permanentAddress: {
      province: "",
      district: "",
      ward: "",
      street: "",
    },
    temporaryAddress: {
      province: "",
      district: "",
      ward: "",
      street: "",
    },
    currentResidence: "",
    dormitoryRoom: "",
  });

  // State cho form thông tin gia đình
  const [familyInfo, setFamilyInfo] = useState<FamilyInfo>({
    father: {
      name: "",
      birthYear: "",
      occupation: "",
      workplace: "",
      phone: "",
    },
    mother: {
      name: "",
      birthYear: "",
      occupation: "",
      workplace: "",
      phone: "",
    },
    siblings: [],
  });

  // State cho form tài liệu
  const [documentInfo, setDocumentInfo] = useState({
    type: "",
    name: "",
    note: "",
  });
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  // State cho form tài khoản
  const accountForm = useForm<AccountInfo>({
    username: "",
    currentPassword: "",
    newPassword: "",
    securityQuestion: "",
    securityAnswer: "",
  });

  // Ref cho input file
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cập nhật dữ liệu form khi profile thay đổi
  useEffect(() => {
    if (profile) {
      // Cập nhật form thông tin liên hệ
      contactForm.setValues({
        phone: profile.contactInfo.phone,
        personalEmail: profile.contactInfo.personalEmail,
        schoolEmail: profile.contactInfo.schoolEmail,
        facebook: profile.contactInfo.facebook || "",
        permanentAddress: profile.contactInfo.permanentAddress,
        temporaryAddress: profile.contactInfo.temporaryAddress,
        currentResidence: profile.contactInfo.currentResidence,
        emergencyContact: profile.contactInfo.emergencyContact,
      });

      // Cập nhật form thông tin gia đình
      setFamilyInfo(profile.familyInfo);

      // Cập nhật form tài khoản
      accountForm.setValues({
        username: profile.studentId,
        currentPassword: "",
        newPassword: "",
        securityQuestion: "pet",
        securityAnswer: "",
      });

      // Phân tích địa chỉ để cập nhật form địa chỉ
      // Đây là một ví dụ đơn giản, trong thực tế cần phân tích chuỗi địa chỉ
      const permanentProvince = "22"; // Đồng Nai
      const temporaryProvince = "22"; // Đồng Nai

      addressForm.setValues({
        permanentAddress: {
          province: permanentProvince,
          district: "001", // Biên Hòa
          ward: "00101", // Phường B
          street: "123 Đường A",
        },
        temporaryAddress: {
          province: temporaryProvince,
          district: "001", // Biên Hòa
          ward: "00104", // Phường D
          street: "456 Đường C",
        },
        currentResidence: profile.contactInfo.currentResidence.includes(
          "Ký túc xá"
        )
          ? "ktx"
          : "other",
        dormitoryRoom: profile.contactInfo.currentResidence.includes("Phòng")
          ? profile.contactInfo.currentResidence.split("Phòng ")[1]
          : "",
      });

      // Lấy danh sách quận/huyện cho địa chỉ thường trú
      fetchDistricts(permanentProvince);

      // Lấy danh sách quận/huyện cho địa chỉ tạm trú
      fetchTempDistricts(temporaryProvince);
    }
  }, [profile]);

  // Lấy danh sách quận/huyện khi thay đổi tỉnh/thành phố (địa chỉ thường trú)
  const fetchDistricts = async (provinceId: string) => {
    try {
      const response = await fetch(`/api/districts?provinceId=${provinceId}`);
      const data = await response.json();
      setDistricts(data);

      // Nếu đã có quận/huyện được chọn, lấy danh sách phường/xã
      if (addressForm.values.permanentAddress.district) {
        fetchWards(addressForm.values.permanentAddress.district);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách quận/huyện:", error);
      // Sử dụng mock data từ service
      import("../services/updateInfoService").then((module) => {
        const service = module.default;
        service.getDistrictsByProvince(provinceId).then((data) => {
          setDistricts(data);
        });
      });
    }
  };

  // Lấy danh sách phường/xã khi thay đổi quận/huyện (địa chỉ thường trú)
  const fetchWards = async (districtId: string) => {
    try {
      const response = await fetch(`/api/wards?districtId=${districtId}`);
      const data = await response.json();
      setWards(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phường/xã:", error);
      // Sử dụng mock data từ service
      import("../services/updateInfoService").then((module) => {
        const service = module.default;
        service.getWardsByDistrict(districtId).then((data) => {
          setWards(data);
        });
      });
    }
  };

  // Lấy danh sách quận/huyện khi thay đổi tỉnh/thành phố (địa chỉ tạm trú)
  const fetchTempDistricts = async (provinceId: string) => {
    try {
      const response = await fetch(`/api/districts?provinceId=${provinceId}`);
      const data = await response.json();
      setTempDistricts(data);

      // Nếu đã có quận/huyện được chọn, lấy danh sách phường/xã
      if (addressForm.values.temporaryAddress.district) {
        fetchTempWards(addressForm.values.temporaryAddress.district);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách quận/huyện:", error);
      // Sử dụng mock data từ service
      import("../services/updateInfoService").then((module) => {
        const service = module.default;
        service.getDistrictsByProvince(provinceId).then((data) => {
          setTempDistricts(data);
        });
      });
    }
  };

  // Lấy danh sách phường/xã khi thay đổi quận/huyện (địa chỉ tạm trú)
  const fetchTempWards = async (districtId: string) => {
    try {
      const response = await fetch(`/api/wards?districtId=${districtId}`);
      const data = await response.json();
      setTempWards(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phường/xã:", error);
      // Sử dụng mock data từ service
      import("../services/updateInfoService").then((module) => {
        const service = module.default;
        service.getWardsByDistrict(districtId).then((data) => {
          setTempWards(data);
        });
      });
    }
  };

  // Xử lý khi thay đổi tỉnh/thành phố (địa chỉ thường trú)
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = e.target.value;
    addressForm.setValues({
      ...addressForm.values,
      permanentAddress: {
        ...addressForm.values.permanentAddress,
        province: provinceId,
        district: "",
        ward: "",
      },
    });

    fetchDistricts(provinceId);
    setWards([]);
  };

  // Xử lý khi thay đổi quận/huyện (địa chỉ thường trú)
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value;
    addressForm.setValues({
      ...addressForm.values,
      permanentAddress: {
        ...addressForm.values.permanentAddress,
        district: districtId,
        ward: "",
      },
    });

    fetchWards(districtId);
  };

  // Xử lý khi thay đổi tỉnh/thành phố (địa chỉ tạm trú)
  const handleTempProvinceChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const provinceId = e.target.value;
    addressForm.setValues({
      ...addressForm.values,
      temporaryAddress: {
        ...addressForm.values.temporaryAddress,
        province: provinceId,
        district: "",
        ward: "",
      },
    });

    fetchTempDistricts(provinceId);
    setTempWards([]);
  };

  // Xử lý khi thay đổi quận/huyện (địa chỉ tạm trú)
  const handleTempDistrictChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const districtId = e.target.value;
    addressForm.setValues({
      ...addressForm.values,
      temporaryAddress: {
        ...addressForm.values.temporaryAddress,
        district: districtId,
        ward: "",
      },
    });

    fetchTempWards(districtId);
  };

  // Xử lý khi thêm anh/chị/em
  const handleAddSibling = () => {
    setFamilyInfo((prev) => ({
      ...prev,
      siblings: [
        ...prev.siblings,
        {
          name: "",
          birthYear: "",
          relationship: "",
          occupation: "",
          workplace: "",
          studyPlace: "",
          phone: "",
        },
      ],
    }));
  };

  // Xử lý khi cập nhật thông tin anh/chị/em
  const handleSiblingChange = (
    index: number,
    field: keyof FamilyMember,
    value: string
  ) => {
    setFamilyInfo((prev) => {
      const updatedSiblings = [...prev.siblings];
      updatedSiblings[index] = {
        ...updatedSiblings[index],
        [field]: value,
      };
      return {
        ...prev,
        siblings: updatedSiblings,
      };
    });
  };

  // Xử lý khi cập nhật thông tin bố
  const handleFatherChange = (field: keyof FamilyMember, value: string) => {
    setFamilyInfo((prev) => ({
      ...prev,
      father: {
        ...prev.father,
        [field]: value,
      },
    }));
  };

  // Xử lý khi cập nhật thông tin mẹ
  const handleMotherChange = (field: keyof FamilyMember, value: string) => {
    setFamilyInfo((prev) => ({
      ...prev,
      mother: {
        ...prev.mother,
        [field]: value,
      },
    }));
  };

  // Xử lý khi chọn file tài liệu
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDocumentFile(e.target.files[0]);
    }
  };

  // Xử lý khi lưu thông tin liên hệ
  const handleSaveContactInfo = async () => {
    // Kiểm tra các trường bắt buộc
    if (
      !contactForm.values.phone ||
      !contactForm.values.personalEmail ||
      !contactForm.values.emergencyContact.name ||
      !contactForm.values.emergencyContact.phone
    ) {
      showToast("Vui lòng điền đầy đủ các thông tin bắt buộc!", "error");
      return;
    }

    // Kiểm tra định dạng số điện thoại
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(contactForm.values.phone)) {
      showToast("Số điện thoại không hợp lệ!", "error");
      return;
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactForm.values.personalEmail)) {
      showToast("Email cá nhân không hợp lệ!", "error");
      return;
    }

    const success = await updateContactInfo(contactForm.values);
    if (success) {
      showToast("Cập nhật thông tin liên hệ thành công!", "success");
      refreshProfile();
    }
  };

  // Xử lý khi lưu thông tin địa chỉ
  const handleSaveAddressInfo = async () => {
    // Kiểm tra các trường bắt buộc
    if (
      !addressForm.values.permanentAddress.province ||
      !addressForm.values.permanentAddress.district ||
      !addressForm.values.permanentAddress.ward ||
      !addressForm.values.permanentAddress.street ||
      !addressForm.values.currentResidence
    ) {
      showToast("Vui lòng điền đầy đủ các thông tin bắt buộc!", "error");
      return;
    }

    // Nếu chọn ở ký túc xá, kiểm tra phòng
    if (
      addressForm.values.currentResidence === "ktx" &&
      !addressForm.values.dormitoryRoom
    ) {
      showToast("Vui lòng nhập số phòng ký túc xá!", "error");
      return;
    }

    const success = await updateAddressInfo(addressForm.values);
    if (success) {
      showToast("Cập nhật thông tin địa chỉ thành công!", "success");
      refreshProfile();
    }
  };

  // Xử lý khi lưu thông tin gia đình
  const handleSaveFamilyInfo = async () => {
    // Kiểm tra thông tin bố
    if (!familyInfo.father.name || !familyInfo.father.birthYear) {
      showToast("Vui lòng điền đầy đủ thông tin về bố!", "error");
      return;
    }

    // Kiểm tra thông tin mẹ
    if (!familyInfo.mother.name || !familyInfo.mother.birthYear) {
      showToast("Vui lòng điền đầy đủ thông tin về mẹ!", "error");
      return;
    }

    // Kiểm tra năm sinh
    const currentYear = new Date().getFullYear();
    const birthYearRegex = /^\d{4}$/;

    if (
      !birthYearRegex.test(familyInfo.father.birthYear) ||
      parseInt(familyInfo.father.birthYear) > currentYear - 18 ||
      parseInt(familyInfo.father.birthYear) < currentYear - 100
    ) {
      showToast("Năm sinh của bố không hợp lệ!", "error");
      return;
    }

    if (
      !birthYearRegex.test(familyInfo.mother.birthYear) ||
      parseInt(familyInfo.mother.birthYear) > currentYear - 18 ||
      parseInt(familyInfo.mother.birthYear) < currentYear - 100
    ) {
      showToast("Năm sinh của mẹ không hợp lệ!", "error");
      return;
    }

    // Kiểm tra thông tin anh/chị/em
    for (let i = 0; i < familyInfo.siblings.length; i++) {
      const sibling = familyInfo.siblings[i];
      if (!sibling.name || !sibling.relationship) {
        showToast(
          `Vui lòng điền đầy đủ thông tin về anh/chị/em thứ ${i + 1}!`,
          "error"
        );
        return;
      }

      if (sibling.birthYear) {
        if (
          !birthYearRegex.test(sibling.birthYear) ||
          parseInt(sibling.birthYear) > currentYear ||
          parseInt(sibling.birthYear) < currentYear - 100
        ) {
          showToast(
            `Năm sinh của anh/chị/em thứ ${i + 1} không hợp lệ!`,
            "error"
          );
          return;
        }
      }
    }

    const success = await updateFamilyInfo(familyInfo);
    if (success) {
      showToast("Cập nhật thông tin gia đình thành công!", "success");
      refreshProfile();
    }
  };

  // Xử lý khi tải lên tài liệu
  const handleUploadDocument = async () => {
    // Kiểm tra các trường bắt buộc
    if (!documentInfo.type || !documentInfo.name || !documentFile) {
      showToast("Vui lòng điền đầy đủ các thông tin bắt buộc!", "error");
      return;
    }

    // Kiểm tra loại file
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(documentFile.type)) {
      showToast("Chỉ chấp nhận file PDF, JPEG hoặc PNG!", "error");
      return;
    }

    // Kiểm tra kích thước file (tối đa 5MB)
    if (documentFile.size > 5 * 1024 * 1024) {
      showToast("Kích thước file không được vượt quá 5MB!", "error");
      return;
    }

    const newDocument = await uploadNewDocument(
      documentInfo.type,
      documentInfo.name,
      documentFile,
      documentInfo.note
    );

    if (newDocument) {
      showToast("Tải lên tài liệu thành công!", "success");

      // Reset form
      setDocumentInfo({
        type: "",
        name: "",
        note: "",
      });
      setDocumentFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      refreshProfile();
    }
  };

  // Xử lý khi lưu thông tin tài khoản
  const handleSaveAccountInfo = async () => {
    // Kiểm tra các trường bắt buộc
    if (
      !accountForm.values.currentPassword ||
      !accountForm.values.newPassword
    ) {
      showToast("Vui lòng điền đầy đủ các thông tin bắt buộc!", "error");
      return;
    }

    // Kiểm tra mật khẩu mới và xác nhận mật khẩu
    const confirmPassword = (
      document.getElementById("confirm-password") as HTMLInputElement
    ).value;
    if (accountForm.values.newPassword !== confirmPassword) {
      showToast("Mật khẩu mới và xác nhận mật khẩu không khớp!", "error");
      return;
    }

    // Kiểm tra độ mạnh của mật khẩu
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(accountForm.values.newPassword)) {
      showToast(
        "Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt!",
        "error"
      );
      return;
    }

    // Kiểm tra câu hỏi bảo mật
    if (
      accountForm.values.securityQuestion &&
      !accountForm.values.securityAnswer
    ) {
      showToast("Vui lòng nhập câu trả lời cho câu hỏi bảo mật!", "error");
      return;
    }

    const success = await updateAccountInfo(accountForm.values);
    if (success) {
      showToast("Cập nhật thông tin tài khoản thành công!", "success");

      // Reset form mật khẩu
      accountForm.setValues({
        ...accountForm.values,
        currentPassword: "",
        newPassword: "",
      });
      (document.getElementById("confirm-password") as HTMLInputElement).value =
        "";
    } else {
      showToast("Mật khẩu hiện tại không đúng!", "error");
    }
  };

  // Xử lý khi hủy cập nhật
  const handleCancelUpdate = () => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn hủy các thay đổi?");
    if (confirmed) {
      cancelUpdate();
      showToast("Đã hủy các thay đổi!", "info");
      // Chuyển về trang hồ sơ sinh viên
      window.location.href = "/student-profile";
    }
  };

  return (
    <>
      <PageTitle>
        <i className="fa-solid fa-user-pen"></i> Cập nhật thông tin
      </PageTitle>

      <UpdateIntro>
        <p>
          Trang này cho phép bạn cập nhật thông tin cá nhân. Vui lòng điền đầy
          đủ và chính xác các thông tin được yêu cầu. Các trường đánh dấu
          <Required>*</Required> là bắt buộc.
        </p>
        <NoteBox>
          <p>
            <strong>Lưu ý:</strong> Một số thông tin cơ bản không thể thay đổi
            (họ tên, ngày sinh, mã sinh viên, v.v.). Nếu cần thay đổi những
            thông tin này, vui lòng liên hệ Phòng Đào tạo.
          </p>
        </NoteBox>
      </UpdateIntro>

      {profileLoading ? (
        <LoadingContainer>
          <i className="fa-solid fa-spinner"></i> Đang tải thông tin...
        </LoadingContainer>
      ) : (
        <UpdateContainer>
          <FormTabs>
            <TabButton
              isActive={activeTab === "contact-tab"}
              onClick={() => showUpdateTab("contact-tab")}
            >
              <i className="fa-solid fa-address-card"></i> Thông tin liên hệ
            </TabButton>
            <TabButton
              isActive={activeTab === "address-tab"}
              onClick={() => showUpdateTab("address-tab")}
            >
              <i className="fa-solid fa-location-dot"></i> Địa chỉ
            </TabButton>
            <TabButton
              isActive={activeTab === "family-tab"}
              onClick={() => showUpdateTab("family-tab")}
            >
              <i className="fa-solid fa-people-roof"></i> Thông tin gia đình
            </TabButton>
            <TabButton
              isActive={activeTab === "document-tab"}
              onClick={() => showUpdateTab("document-tab")}
            >
              <i className="fa-solid fa-file-lines"></i> Hồ sơ, giấy tờ
            </TabButton>
            <TabButton
              isActive={activeTab === "account-tab"}
              onClick={() => showUpdateTab("account-tab")}
            >
              <i className="fa-solid fa-user-gear"></i> Tài khoản
            </TabButton>
          </FormTabs>

          <div id="update-tab-content">
            {/* Tab thông tin liên hệ */}
            <TabContent isActive={activeTab === "contact-tab"}>
              <SectionTitle>
                <i className="fa-solid fa-address-card"></i> Cập nhật thông tin
                liên hệ
              </SectionTitle>

              <FormGroup>
                <Label htmlFor="phone">
                  Điện thoại: <Required>*</Required>
                </Label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={contactForm.values.phone}
                  onChange={contactForm.handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="personal-email">
                  Email cá nhân: <Required>*</Required>
                </Label>
                <Input
                  type="email"
                  id="personal-email"
                  name="personalEmail"
                  value={contactForm.values.personalEmail}
                  onChange={contactForm.handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="school-email">Email trường cấp:</Label>
                <Input
                  type="email"
                  id="school-email"
                  name="schoolEmail"
                  value={contactForm.values.schoolEmail}
                  readOnly
                />
                <SmallText>Email trường cấp không thể thay đổi.</SmallText>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="facebook">Facebook:</Label>
                <Input
                  type="text"
                  id="facebook"
                  name="facebook"
                  value={contactForm.values.facebook}
                  onChange={contactForm.handleChange}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="emergency-contact">
                  Người liên hệ khẩn cấp: <Required>*</Required>
                </Label>
                <Input
                  type="text"
                  id="emergency-contact"
                  name="emergencyContact.name"
                  value={contactForm.values.emergencyContact.name}
                  onChange={contactForm.handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="emergency-relationship">
                  Quan hệ: <Required>*</Required>
                </Label>
                <Input
                  type="text"
                  id="emergency-relationship"
                  name="emergencyContact.relationship"
                  value={contactForm.values.emergencyContact.relationship}
                  onChange={contactForm.handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="emergency-phone">
                  Số điện thoại liên hệ khẩn cấp: <Required>*</Required>
                </Label>
                <Input
                  type="tel"
                  id="emergency-phone"
                  name="emergencyContact.phone"
                  value={contactForm.values.emergencyContact.phone}
                  onChange={contactForm.handleChange}
                  required
                />
              </FormGroup>

              <FormActions>
                <CancelButton onClick={handleCancelUpdate}>
                  <i className="fa-solid fa-xmark"></i> Hủy
                </CancelButton>
                <SaveButton onClick={handleSaveContactInfo} disabled={loading}>
                  {loading ? (
                    <>
                      <i className="fa-solid fa-spinner"></i> Đang xử lý...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-floppy-disk"></i> Lưu thay đổi
                    </>
                  )}
                </SaveButton>
              </FormActions>
            </TabContent>

            {/* Tab địa chỉ */}
            <TabContent isActive={activeTab === "address-tab"}>
              <SectionTitle>
                <i className="fa-solid fa-location-dot"></i> Cập nhật địa chỉ
              </SectionTitle>

              <FormGroup>
                <Label>
                  Địa chỉ thường trú: <Required>*</Required>
                </Label>
                <AddressInputs>
                  <FormRow>
                    <FormColumn>
                      <Label htmlFor="permanent-province">
                        Tỉnh/Thành phố:
                      </Label>
                      <Select
                        id="permanent-province"
                        name="permanentAddress.province"
                        value={addressForm.values.permanentAddress.province}
                        onChange={addressForm.handleChange}
                        required
                      >
                        <option value="dong-nai">Đồng Nai</option>
                        <option value="ho-chi-minh">TP. Hồ Chí Minh</option>
                        <option value="binh-duong">Bình Dương</option>
                        <option value="ba-ria-vung-tau">
                          Bà Rịa - Vũng Tàu
                        </option>
                      </Select>
                    </FormColumn>
                    <FormColumn>
                      <Label htmlFor="permanent-district">Quận/Huyện:</Label>
                      <Select
                        id="permanent-district"
                        name="permanentAddress.district"
                        value={addressForm.values.permanentAddress.district}
                        onChange={addressForm.handleChange}
                        required
                      >
                        <option value="bien-hoa">TP. Biên Hòa</option>
                        <option value="long-khanh">TP. Long Khánh</option>
                        <option value="nhon-trach">Nhơn Trạch</option>
                        <option value="trang-bom">Trảng Bom</option>
                      </Select>
                    </FormColumn>
                  </FormRow>
                  <FormRow>
                    <FormColumn>
                      <Label htmlFor="permanent-ward">Phường/Xã:</Label>
                      <Select
                        id="permanent-ward"
                        name="permanentAddress.ward"
                        value={addressForm.values.permanentAddress.ward}
                        onChange={addressForm.handleChange}
                        required
                      >
                        <option value="phuong-b">Phường B</option>
                        <option value="phuong-c">Phường C</option>
                        <option value="phuong-d">Phường D</option>
                      </Select>
                    </FormColumn>
                    <FormColumn>
                      <Label htmlFor="permanent-street">Số nhà, đường:</Label>
                      <Input
                        type="text"
                        id="permanent-street"
                        name="permanentAddress.street"
                        value={addressForm.values.permanentAddress.street}
                        onChange={addressForm.handleChange}
                        required
                      />
                    </FormColumn>
                  </FormRow>
                </AddressInputs>
              </FormGroup>

              <FormGroup>
                <Label>Địa chỉ tạm trú:</Label>
                <AddressInputs>
                  <FormRow>
                    <FormColumn>
                      <Label htmlFor="temporary-province">
                        Tỉnh/Thành phố:
                      </Label>
                      <Select
                        id="temporary-province"
                        name="temporaryAddress.province"
                        value={addressForm.values.temporaryAddress.province}
                        onChange={addressForm.handleChange}
                      >
                        <option value="dong-nai">Đồng Nai</option>
                        <option value="ho-chi-minh">TP. Hồ Chí Minh</option>
                        <option value="binh-duong">Bình Dương</option>
                        <option value="ba-ria-vung-tau">
                          Bà Rịa - Vũng Tàu
                        </option>
                      </Select>
                    </FormColumn>
                    <FormColumn>
                      <Label htmlFor="temporary-district">Quận/Huyện:</Label>
                      <Select
                        id="temporary-district"
                        name="temporaryAddress.district"
                        value={addressForm.values.temporaryAddress.district}
                        onChange={addressForm.handleChange}
                      >
                        <option value="bien-hoa">TP. Biên Hòa</option>
                        <option value="long-khanh">TP. Long Khánh</option>
                        <option value="nhon-trach">Nhơn Trạch</option>
                        <option value="trang-bom">Trảng Bom</option>
                      </Select>
                    </FormColumn>
                  </FormRow>
                  <FormRow>
                    <FormColumn>
                      <Label htmlFor="temporary-ward">Phường/Xã:</Label>
                      <Select
                        id="temporary-ward"
                        name="temporaryAddress.ward"
                        value={addressForm.values.temporaryAddress.ward}
                        onChange={addressForm.handleChange}
                      >
                        <option value="phuong-d">Phường D</option>
                        <option value="phuong-e">Phường E</option>
                        <option value="phuong-f">Phường F</option>
                      </Select>
                    </FormColumn>
                    <FormColumn>
                      <Label htmlFor="temporary-street">Số nhà, đường:</Label>
                      <Input
                        type="text"
                        id="temporary-street"
                        name="temporaryAddress.street"
                        value={addressForm.values.temporaryAddress.street}
                        onChange={addressForm.handleChange}
                      />
                    </FormColumn>
                  </FormRow>
                </AddressInputs>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="current-residence">
                  Nơi ở hiện tại: <Required>*</Required>
                </Label>
                <Select
                  id="current-residence"
                  name="currentResidence"
                  value={addressForm.values.currentResidence}
                  onChange={addressForm.handleChange}
                  required
                >
                  <option value="ktx">Ký túc xá trường</option>
                  <option value="thue-tro">Nhà trọ</option>
                  <option value="nha-rieng">Nhà riêng</option>
                  <option value="o-voi-nguoi-than">Ở với người thân</option>
                </Select>
              </FormGroup>

              {addressForm.values.currentResidence === "ktx" && (
                <FormGroup>
                  <Label htmlFor="ktx-room">Phòng ký túc xá:</Label>
                  <Input
                    type="text"
                    id="ktx-room"
                    name="dormitoryRoom"
                    value={addressForm.values.dormitoryRoom}
                    onChange={addressForm.handleChange}
                  />
                </FormGroup>
              )}

              <FormActions>
                <CancelButton onClick={handleCancelUpdate}>
                  <i className="fa-solid fa-xmark"></i> Hủy
                </CancelButton>
                <SaveButton onClick={handleSaveAddressInfo} disabled={loading}>
                  {loading ? (
                    <>
                      <i className="fa-solid fa-spinner"></i> Đang xử lý...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-floppy-disk"></i> Lưu thay đổi
                    </>
                  )}
                </SaveButton>
              </FormActions>
            </TabContent>

            {/* Tab thông tin gia đình */}
            <TabContent isActive={activeTab === "family-tab"}>
              <SectionTitle>
                <i className="fa-solid fa-people-roof"></i> Cập nhật thông tin
                gia đình
              </SectionTitle>

              <FamilyMemberForm>
                <h4>Thông tin bố</h4>
                <FormRow>
                  <FormColumn>
                    <Label htmlFor="father-name">Họ và tên:</Label>
                    <Input
                      type="text"
                      id="father-name"
                      value={familyInfo.father.name}
                      onChange={(e) =>
                        handleFatherChange("name", e.target.value)
                      }
                    />
                  </FormColumn>
                  <FormColumn>
                    <Label htmlFor="father-year">Năm sinh:</Label>
                    <Input
                      type="number"
                      id="father-year"
                      value={familyInfo.father.birthYear}
                      onChange={(e) =>
                        handleFatherChange("birthYear", e.target.value)
                      }
                    />
                  </FormColumn>
                </FormRow>
                <FormRow>
                  <FormColumn>
                    <Label htmlFor="father-job">Nghề nghiệp:</Label>
                    <Input
                      type="text"
                      id="father-job"
                      value={familyInfo.father.occupation}
                      onChange={(e) =>
                        handleFatherChange("occupation", e.target.value)
                      }
                    />
                  </FormColumn>
                  <FormColumn>
                    <Label htmlFor="father-workplace">Nơi làm việc:</Label>
                    <Input
                      type="text"
                      id="father-workplace"
                      value={familyInfo.father.workplace}
                      onChange={(e) =>
                        handleFatherChange("workplace", e.target.value)
                      }
                    />
                  </FormColumn>
                </FormRow>
                <FormRow>
                  <FormColumn>
                    <Label htmlFor="father-phone">Điện thoại:</Label>
                    <Input
                      type="tel"
                      id="father-phone"
                      value={familyInfo.father.phone}
                      onChange={(e) =>
                        handleFatherChange("phone", e.target.value)
                      }
                    />
                  </FormColumn>
                </FormRow>
              </FamilyMemberForm>

              <FamilyMemberForm>
                <h4>Thông tin mẹ</h4>
                <FormRow>
                  <FormColumn>
                    <Label htmlFor="mother-name">Họ và tên:</Label>
                    <Input
                      type="text"
                      id="mother-name"
                      value={familyInfo.mother.name}
                      onChange={(e) =>
                        handleMotherChange("name", e.target.value)
                      }
                    />
                  </FormColumn>
                  <FormColumn>
                    <Label htmlFor="mother-year">Năm sinh:</Label>
                    <Input
                      type="number"
                      id="mother-year"
                      value={familyInfo.mother.birthYear}
                      onChange={(e) =>
                        handleMotherChange("birthYear", e.target.value)
                      }
                    />
                  </FormColumn>
                </FormRow>
                <FormRow>
                  <FormColumn>
                    <Label htmlFor="mother-job">Nghề nghiệp:</Label>
                    <Input
                      type="text"
                      id="mother-job"
                      value={familyInfo.mother.occupation}
                      onChange={(e) =>
                        handleMotherChange("occupation", e.target.value)
                      }
                    />
                  </FormColumn>
                  <FormColumn>
                    <Label htmlFor="mother-workplace">Nơi làm việc:</Label>
                    <Input
                      type="text"
                      id="mother-workplace"
                      value={familyInfo.mother.workplace}
                      onChange={(e) =>
                        handleMotherChange("workplace", e.target.value)
                      }
                    />
                  </FormColumn>
                </FormRow>
                <FormRow>
                  <FormColumn>
                    <Label htmlFor="mother-phone">Điện thoại:</Label>
                    <Input
                      type="tel"
                      id="mother-phone"
                      value={familyInfo.mother.phone}
                      onChange={(e) =>
                        handleMotherChange("phone", e.target.value)
                      }
                    />
                  </FormColumn>
                </FormRow>
              </FamilyMemberForm>

              {familyInfo.siblings.map((sibling, index) => (
                <FamilyMemberForm key={index}>
                  <h4>Thông tin anh/chị/em {index + 1}</h4>
                  <FormRow>
                    <FormColumn>
                      <Label htmlFor={`sibling-name-${index}`}>
                        Họ và tên:
                      </Label>
                      <Input
                        type="text"
                        id={`sibling-name-${index}`}
                        value={sibling.name}
                        onChange={(e) =>
                          handleSiblingChange(index, "name", e.target.value)
                        }
                      />
                    </FormColumn>
                    <FormColumn>
                      <Label htmlFor={`sibling-year-${index}`}>Năm sinh:</Label>
                      <Input
                        type="number"
                        id={`sibling-year-${index}`}
                        value={sibling.birthYear}
                        onChange={(e) =>
                          handleSiblingChange(
                            index,
                            "birthYear",
                            e.target.value
                          )
                        }
                      />
                    </FormColumn>
                  </FormRow>
                  <FormRow>
                    <FormColumn>
                      <Label htmlFor={`sibling-relation-${index}`}>
                        Quan hệ:
                      </Label>
                      <Select
                        id={`sibling-relation-${index}`}
                        value={sibling.relationship || ""}
                        onChange={(e) =>
                          handleSiblingChange(
                            index,
                            "relationship",
                            e.target.value
                          )
                        }
                      >
                        <option value="anh-trai">Anh trai</option>
                        <option value="chi-gai">Chị gái</option>
                        <option value="em-trai">Em trai</option>
                        <option value="em-gai">Em gái</option>
                      </Select>
                    </FormColumn>
                    <FormColumn>
                      <Label htmlFor={`sibling-job-${index}`}>
                        Nghề nghiệp:
                      </Label>
                      <Input
                        type="text"
                        id={`sibling-job-${index}`}
                        value={sibling.occupation}
                        onChange={(e) =>
                          handleSiblingChange(
                            index,
                            "occupation",
                            e.target.value
                          )
                        }
                      />
                    </FormColumn>
                  </FormRow>
                  <FormRow>
                    <FormColumn>
                      <Label htmlFor={`sibling-school-${index}`}>
                        Nơi học tập/làm việc:
                      </Label>
                      <Input
                        type="text"
                        id={`sibling-school-${index}`}
                        value={sibling.studyPlace || sibling.workplace}
                        onChange={(e) => {
                          if (
                            sibling.occupation === "Học sinh" ||
                            sibling.occupation === "Sinh viên"
                          ) {
                            handleSiblingChange(
                              index,
                              "studyPlace",
                              e.target.value
                            );
                          } else {
                            handleSiblingChange(
                              index,
                              "workplace",
                              e.target.value
                            );
                          }
                        }}
                      />
                    </FormColumn>
                  </FormRow>
                </FamilyMemberForm>
              ))}

              <FormGroup>
                <AddSiblingButton onClick={handleAddSibling}>
                  <i className="fa-solid fa-plus"></i> Thêm anh/chị/em
                </AddSiblingButton>
              </FormGroup>

              <FormActions>
                <CancelButton onClick={handleCancelUpdate}>
                  <i className="fa-solid fa-xmark"></i> Hủy
                </CancelButton>
                <SaveButton onClick={handleSaveFamilyInfo} disabled={loading}>
                  {loading ? (
                    <>
                      <i className="fa-solid fa-spinner"></i> Đang xử lý...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-floppy-disk"></i> Lưu thay đổi
                    </>
                  )}
                </SaveButton>
              </FormActions>
            </TabContent>

            {/* Tab hồ sơ, giấy tờ */}
            <TabContent isActive={activeTab === "document-tab"}>
              <SectionTitle>
                <i className="fa-solid fa-file-lines"></i> Cập nhật hồ sơ, giấy
                tờ
              </SectionTitle>

              <DocumentUploadSection>
                <h4>Tải lên giấy tờ mới</h4>
                <p>
                  Bạn có thể tải lên các giấy tờ mới hoặc cập nhật các giấy tờ
                  đã có.
                </p>

                <FormGroup>
                  <Label htmlFor="document-type">
                    Loại giấy tờ: <Required>*</Required>
                  </Label>
                  <Select
                    id="document-type"
                    value={documentInfo.type}
                    onChange={(e) =>
                      setDocumentInfo({ ...documentInfo, type: e.target.value })
                    }
                    required
                  >
                    <option value="">-- Chọn loại giấy tờ --</option>
                    <option value="cmnd">CMND/CCCD (bản sao)</option>
                    <option value="ho-khau">Sổ hộ khẩu (bản sao)</option>
                    <option value="mien-giam">Đơn xin miễn giảm học phí</option>
                    <option value="chung-chi">Chứng chỉ</option>
                    <option value="khac">Giấy tờ khác</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="document-name">
                    Tên giấy tờ: <Required>*</Required>
                  </Label>
                  <Input
                    type="text"
                    id="document-name"
                    placeholder="Nhập tên giấy tờ..."
                    value={documentInfo.name}
                    onChange={(e) =>
                      setDocumentInfo({ ...documentInfo, name: e.target.value })
                    }
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="document-file">
                    Tệp đính kèm: <Required>*</Required>
                  </Label>
                  <Input
                    type="file"
                    id="document-file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    required
                  />
                  <SmallText>
                    Định dạng hỗ trợ: PDF, JPG, PNG (tối đa 5MB)
                  </SmallText>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="document-note">Ghi chú:</Label>
                  <Textarea
                    id="document-note"
                    rows={3}
                    placeholder="Nhập ghi chú (nếu có)..."
                    value={documentInfo.note}
                    onChange={(e) =>
                      setDocumentInfo({ ...documentInfo, note: e.target.value })
                    }
                  />
                </FormGroup>

                <FormActions>
                  <UploadButton
                    onClick={handleUploadDocument}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <i className="fa-solid fa-spinner"></i> Đang xử lý...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-upload"></i> Tải lên
                      </>
                    )}
                  </UploadButton>
                </FormActions>
              </DocumentUploadSection>

              <DocumentListSection>
                <h4>Danh sách giấy tờ đã tải lên</h4>

                <DocumentList>
                  {profile?.documents.map((doc) => (
                    <DocumentItem key={doc.id}>
                      <DocumentIcon>
                        <i className={`fa-solid ${doc.icon}`}></i>
                      </DocumentIcon>
                      <DocumentInfo>
                        <DocumentName>{doc.name}</DocumentName>
                        <DocumentMeta>
                          <span>
                            <i className="fa-solid fa-calendar-days"></i>{" "}
                            15/08/2020
                          </span>
                          <DocumentStatus status={doc.status}>
                            <i
                              className={`fa-solid ${
                                doc.status === "completed"
                                  ? "fa-circle-check"
                                  : doc.status === "processing"
                                  ? "fa-clock"
                                  : "fa-circle-xmark"
                              }`}
                            ></i>
                            {doc.status === "completed"
                              ? "Đã xác nhận"
                              : doc.status === "processing"
                              ? "Đang xử lý"
                              : "Chưa nộp"}
                          </DocumentStatus>
                        </DocumentMeta>
                      </DocumentInfo>
                      <DocumentActions>
                        {doc.fileUrl && (
                          <>
                            <ActionButton title="Xem">
                              <i className="fa-solid fa-eye"></i>
                            </ActionButton>
                            <ActionButton title="Tải xuống">
                              <i className="fa-solid fa-download"></i>
                            </ActionButton>
                          </>
                        )}
                        <ActionButton title="Xóa">
                          <i className="fa-solid fa-trash"></i>
                        </ActionButton>
                      </DocumentActions>
                    </DocumentItem>
                  ))}
                </DocumentList>
              </DocumentListSection>
            </TabContent>

            {/* Tab tài khoản */}
            <TabContent isActive={activeTab === "account-tab"}>
              <SectionTitle>
                <i className="fa-solid fa-user-gear"></i> Cập nhật thông tin tài
                khoản
              </SectionTitle>

              <FormGroup>
                <Label htmlFor="username">Tên đăng nhập:</Label>
                <Input
                  type="text"
                  id="username"
                  value={accountForm.values.username}
                  readOnly
                />
                <SmallText>Tên đăng nhập không thể thay đổi.</SmallText>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="current-password">
                  Mật khẩu hiện tại: <Required>*</Required>
                </Label>
                <Input
                  type="password"
                  id="current-password"
                  name="currentPassword"
                  placeholder="Nhập mật khẩu hiện tại..."
                  value={accountForm.values.currentPassword}
                  onChange={accountForm.handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="new-password">
                  Mật khẩu mới: <Required>*</Required>
                </Label>
                <Input
                  type="password"
                  id="new-password"
                  name="newPassword"
                  placeholder="Nhập mật khẩu mới..."
                  value={accountForm.values.newPassword}
                  onChange={accountForm.handleChange}
                  required
                />
                <SmallText>
                  Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường
                  và số.
                </SmallText>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="confirm-password">
                  Xác nhận mật khẩu mới: <Required>*</Required>
                </Label>
                <Input
                  type="password"
                  id="confirm-password"
                  placeholder="Nhập lại mật khẩu mới..."
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="security-question">Câu hỏi bảo mật:</Label>
                <Select
                  id="security-question"
                  name="securityQuestion"
                  value={accountForm.values.securityQuestion}
                  onChange={accountForm.handleChange}
                >
                  <option value="pet">
                    Tên thú cưng đầu tiên của bạn là gì?
                  </option>
                  <option value="school">
                    Tên trường tiểu học đầu tiên của bạn là gì?
                  </option>
                  <option value="city">Thành phố bạn sinh ra là gì?</option>
                  <option value="mother">
                    Tên thời con gái của mẹ bạn là gì?
                  </option>
                  <option value="food">Món ăn yêu thích của bạn là gì?</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="security-answer">Câu trả lời:</Label>
                <Input
                  type="text"
                  id="security-answer"
                  name="securityAnswer"
                  placeholder="Nhập câu trả lời..."
                  value={accountForm.values.securityAnswer}
                  onChange={accountForm.handleChange}
                />
              </FormGroup>

              <FormActions>
                <CancelButton onClick={handleCancelUpdate}>
                  <i className="fa-solid fa-xmark"></i> Hủy
                </CancelButton>
                <SaveButton onClick={handleSaveAccountInfo} disabled={loading}>
                  {loading ? (
                    <>
                      <i className="fa-solid fa-spinner"></i> Đang xử lý...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-floppy-disk"></i> Lưu thay đổi
                    </>
                  )}
                </SaveButton>
              </FormActions>
            </TabContent>
          </div>
        </UpdateContainer>
      )}

      <LoadingOverlay isVisible={loading || profileLoading}>
        <div>
          <i className="fa-solid fa-spinner"></i> Đang xử lý...
        </div>
      </LoadingOverlay>

      {/* Input file ẩn cho việc upload tài liệu */}
      <HiddenFileInput
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.jpg,.jpeg,.png"
      />
    </>
  );
};

// Thêm component LoadingContainer
const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.textLight};

  i {
    margin-right: 10px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;

  i {
    margin-right: 10px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

export default UpdateStudentInfo;

import { useState, useCallback } from "react";
import updateInfoService, {
  AddressInfo,
  AccountInfo,
} from "../services/updateInfoService";
import {
  ContactInfo,
  FamilyInfo,
  Document,
} from "../services/studentProfileService";
import { useToast } from "./useUtils";

export const useUpdateInfo = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("contact-tab");
  const { showToast } = useToast();

  // Chuyển đổi tab
  const showUpdateTab = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  // Cập nhật thông tin liên hệ
  const updateContactInfo = useCallback(
    async (contactInfo: ContactInfo) => {
      try {
        setLoading(true);
        const updatedInfo = await updateInfoService.updateContactInfo(
          contactInfo
        );
        showToast("Cập nhật thông tin liên hệ thành công", "success");
        return true;
      } catch (err) {
        showToast("Cập nhật thông tin liên hệ thất bại", "error");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  // Cập nhật thông tin địa chỉ
  const updateAddressInfo = useCallback(
    async (addressInfo: AddressInfo) => {
      try {
        setLoading(true);
        const updatedInfo = await updateInfoService.updateAddressInfo(
          addressInfo
        );
        showToast("Cập nhật thông tin địa chỉ thành công", "success");
        return true;
      } catch (err) {
        showToast("Cập nhật thông tin địa chỉ thất bại", "error");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  // Cập nhật thông tin gia đình
  const updateFamilyInfo = useCallback(
    async (familyInfo: FamilyInfo) => {
      try {
        setLoading(true);
        const updatedInfo = await updateInfoService.updateFamilyInfo(
          familyInfo
        );
        showToast("Cập nhật thông tin gia đình thành công", "success");
        return true;
      } catch (err) {
        showToast("Cập nhật thông tin gia đình thất bại", "error");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  // Tải lên tài liệu mới
  const uploadNewDocument = useCallback(
    async (
      documentType: string,
      documentName: string,
      file: File,
      note?: string
    ) => {
      try {
        setLoading(true);
        const newDocument = await updateInfoService.uploadNewDocument(
          documentType,
          documentName,
          file,
          note
        );
        showToast("Tải lên tài liệu thành công", "success");
        return newDocument;
      } catch (err) {
        showToast("Tải lên tài liệu thất bại", "error");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  // Cập nhật thông tin tài khoản
  const updateAccountInfo = useCallback(
    async (accountInfo: AccountInfo) => {
      try {
        setLoading(true);
        const success = await updateInfoService.updateAccountInfo(accountInfo);
        if (success) {
          showToast("Cập nhật thông tin tài khoản thành công", "success");
        } else {
          showToast("Cập nhật thông tin tài khoản thất bại", "error");
        }
        return success;
      } catch (err) {
        showToast("Cập nhật thông tin tài khoản thất bại", "error");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  // Hủy cập nhật
  const cancelUpdate = useCallback(() => {
    return true;
  }, []);

  return {
    loading,
    activeTab,
    showUpdateTab,
    updateContactInfo,
    updateAddressInfo,
    updateFamilyInfo,
    uploadNewDocument,
    updateAccountInfo,
    cancelUpdate,
  };
};

export default useUpdateInfo;

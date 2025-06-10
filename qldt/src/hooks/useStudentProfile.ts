import { useState, useEffect, useCallback } from 'react';
import studentProfileService, { 
  StudentProfile, 
  PersonalInfo, 
  ContactInfo, 
  Document 
} from '../services/studentProfileService';
import { useToast } from './useUtils';

export const useStudentProfile = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('personal-info');
  const { showToast } = useToast();

  // Lấy thông tin hồ sơ sinh viên
  const fetchStudentProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await studentProfileService.getStudentProfile();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải thông tin sinh viên');
      showToast('Không thể tải thông tin sinh viên. Vui lòng thử lại sau.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Cập nhật thông tin cá nhân
  const updatePersonalInfo = useCallback(async (personalInfo: PersonalInfo) => {
    try {
      setLoading(true);
      const updatedInfo = await studentProfileService.updatePersonalInfo(personalInfo);
      
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          personalInfo: updatedInfo
        };
      });
      
      showToast('Cập nhật thông tin cá nhân thành công', 'success');
      return true;
    } catch (err) {
      showToast('Cập nhật thông tin cá nhân thất bại', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Cập nhật thông tin liên hệ
  const updateContactInfo = useCallback(async (contactInfo: ContactInfo) => {
    try {
      setLoading(true);
      const updatedInfo = await studentProfileService.updateContactInfo(contactInfo);
      
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          contactInfo: updatedInfo
        };
      });
      
      showToast('Cập nhật thông tin liên hệ thành công', 'success');
      return true;
    } catch (err) {
      showToast('Cập nhật thông tin liên hệ thất bại', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Cập nhật avatar
  const updateAvatar = useCallback(async (file: File) => {
    try {
      setLoading(true);
      const { avatarUrl } = await studentProfileService.updateAvatar(file);
      
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          avatar: avatarUrl
        };
      });
      
      showToast('Cập nhật ảnh đại diện thành công', 'success');
      return true;
    } catch (err) {
      showToast('Cập nhật ảnh đại diện thất bại', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Upload tài liệu
  const uploadDocument = useCallback(async (documentId: string, file: File) => {
    try {
      setLoading(true);
      const updatedDocument = await studentProfileService.uploadDocument(documentId, file);
      
      setProfile(prev => {
        if (!prev) return null;
        
        const updatedDocuments = prev.documents.map(doc => 
          doc.id === documentId ? updatedDocument : doc
        );
        
        return {
          ...prev,
          documents: updatedDocuments
        };
      });
      
      showToast('Tải lên tài liệu thành công', 'success');
      return true;
    } catch (err) {
      showToast('Tải lên tài liệu thất bại', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Chuyển đổi tab
  const changeTab = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  // Tải dữ liệu khi component được mount
  useEffect(() => {
    fetchStudentProfile();
  }, [fetchStudentProfile]);

  return {
    profile,
    loading,
    error,
    activeTab,
    changeTab,
    updatePersonalInfo,
    updateContactInfo,
    updateAvatar,
    uploadDocument,
    refreshProfile: fetchStudentProfile
  };
};

export default useStudentProfile;
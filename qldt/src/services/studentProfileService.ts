// Định nghĩa các interface cho dữ liệu sinh viên
export interface PersonalInfo {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  idNumber: string;
  idIssueDate: string;
  idIssuePlace: string;
  ethnicity: string;
  religion: string;
  nationality: string;
  priorityObject: string;
  area: string;
  isYouthUnionMember: boolean;
  isPartyMember: boolean;
  youthUnionJoinDate?: string;
  youthUnionJoinPlace?: string;
}

export interface AcademicInfo {
  faculty: string;
  major: string;
  specialization: string;
  className: string;
  course: string;
  educationLevel: string;
  educationType: string;
  academicAdvisor: string;
  highSchool: string;
  highSchoolGraduationYear: string;
  nationalExamScore: number;
  admissionCombination: string;
  admissionMethod: string;
  gpa: number;
  academicStanding: string;
  registeredCredits: number;
  completedCredits: number;
  remainingCredits: number;
  conductScore: number;
  conductRating: string;
}

export interface ContactInfo {
  phone: string;
  personalEmail: string;
  schoolEmail: string;
  facebook: string;
  permanentAddress: string;
  temporaryAddress: string;
  currentResidence: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    address: string;
  };
}

export interface FamilyMember {
  name: string;
  birthYear: string;
  occupation: string;
  workplace: string;
  phone: string;
  relationship?: string;
  studyPlace?: string;
}

export interface FamilyInfo {
  father: FamilyMember;
  mother: FamilyMember;
  siblings: FamilyMember[];
}

export interface Document {
  id: string;
  name: string;
  status: "completed" | "processing" | "not-submitted";
  fileUrl?: string;
  icon: string;
}

export interface TuitionItem {
  id: string;
  semester: string;
  academicYear: string;
  description: string;
  amount: number;
  paid: number;
  dueDate: string;
}

export interface StudentProfile {
  id: string;
  studentId: string;
  avatar: string;
  className: string;
  status: string;
  personalInfo: PersonalInfo;
  academicInfo: AcademicInfo;
  contactInfo: ContactInfo;
  familyInfo: FamilyInfo;
  documents: Document[];
  tuition: TuitionItem[];
}

// Mock data cho việc phát triển
const mockStudentProfile: StudentProfile = {
  id: "1",
  studentId: "SV12345",
  avatar: "/images/chup-chan-dung-5.jpg",
  className: "CNTT2020",
  status: "Đang học",
  personalInfo: {
    fullName: "Nguyễn Văn A",
    dateOfBirth: "2002-05-15",
    gender: "Nam",
    idNumber: "0123456789",
    idIssueDate: "2019-06-10",
    idIssuePlace: "Công an tỉnh Đồng Nai",
    ethnicity: "Kinh",
    religion: "Không",
    nationality: "Việt Nam",
    priorityObject: "Không",
    area: "2NT",
    isYouthUnionMember: true,
    isPartyMember: false,
    youthUnionJoinDate: "2017-03-26",
    youthUnionJoinPlace: "Trường THPT Nguyễn Hữu Cảnh",
  },

  academicInfo: {
    faculty: "Công nghệ thông tin",
    major: "Công nghệ thông tin",
    specialization: "Công nghệ phần mềm",
    className: "CNTT2020",
    course: "2020-2024",
    educationLevel: "Đại học",
    educationType: "Chính quy",
    academicAdvisor: "TS. Nguyễn Văn X",
    highSchool: "THPT Nguyễn Hữu Cảnh",
    highSchoolGraduationYear: "2020",
    nationalExamScore: 24.5,
    admissionCombination: "A00 (Toán, Lý, Hóa)",
    admissionMethod: "Xét điểm thi THPT QG",
    gpa: 3.65,
    academicStanding: "Giỏi",
    registeredCredits: 120,
    completedCredits: 110,
    remainingCredits: 30,
    conductScore: 85,
    conductRating: "Tốt",
  },

  contactInfo: {
    phone: "0987654321",
    personalEmail: "nguyenvana@gmail.com",
    schoolEmail: "sv12345@dntu.edu.vn",
    facebook: "facebook.com/nguyenvana",
    permanentAddress: "123 Đường A, Phường B, TP. Biên Hòa, Đồng Nai",
    temporaryAddress: "456 Đường C, Phường D, TP. Biên Hòa, Đồng Nai",
    currentResidence: "Ký túc xá trường, Phòng B205",
    emergencyContact: {
      name: "Nguyễn Văn B",
      relationship: "Bố",
      phone: "0912345678",
      address: "123 Đường A, Phường B, TP. Biên Hòa, Đồng Nai",
    },
  },

  familyInfo: {
    father: {
      name: "Nguyễn Văn B",
      birthYear: "1975",
      occupation: "Kỹ sư xây dựng",
      workplace: "Công ty Xây dựng ABC",
      phone: "0912345678",
    },
    mother: {
      name: "Trần Thị C",
      birthYear: "1978",
      occupation: "Giáo viên",
      workplace: "Trường THCS XYZ",
      phone: "0923456789",
    },
    siblings: [
      {
        name: "Nguyễn Thị D",
        birthYear: "2005",
        relationship: "Em gái",
        occupation: "Học sinh",
        workplace: "",
        studyPlace: "Trường THPT Nguyễn Hữu Cảnh",
        phone: "",
      },
    ],
  },
  
  documents: [
    {
      id: "doc1",
      name: "Căn cước công dân",
      status: "completed",
      fileUrl: "/documents/cccd.pdf",
      icon: "fa-id-card",
    },
    {
      id: "doc2",
      name: "Bằng tốt nghiệp THPT",
      status: "completed",
      fileUrl: "/documents/bang-tot-nghiep.pdf",
      icon: "fa-graduation-cap",
    },
    {
      id: "doc3",
      name: "Học bạ THPT",
      status: "completed",
      fileUrl: "/documents/hoc-ba.pdf",
      icon: "fa-file-text",
    },
    {
      id: "doc4",
      name: "Giấy khai sinh",
      status: "processing",
      fileUrl: "/documents/khai-sinh.pdf",
      icon: "fa-certificate",
    },
    {
      id: "doc5",
      name: "Giấy khám sức khỏe",
      status: "not-submitted",
      icon: "fa-medkit",
    },
  ],
  tuition: [
    {
      id: "tuition1",
      semester: "Học kỳ 1",
      academicYear: "2020-2021",
      description: "Học phí học kỳ 1",
      amount: 8500000,
      paid: 8500000,
      dueDate: "2020-09-15",
    },
    {
      id: "tuition2",
      semester: "Học kỳ 2",
      academicYear: "2020-2021",
      description: "Học phí học kỳ 2",
      amount: 8500000,
      paid: 8500000,
      dueDate: "2021-01-15",
    },
    {
      id: "tuition3",
      semester: "Học kỳ 1",
      academicYear: "2021-2022",
      description: "Học phí học kỳ 1",
      amount: 9000000,
      paid: 9000000,
      dueDate: "2021-09-15",
    },
    {
      id: "tuition4",
      semester: "Học kỳ 2",
      academicYear: "2021-2022",
      description: "Học phí học kỳ 2",
      amount: 9000000,
      paid: 9000000,
      dueDate: "2022-01-15",
    },
    {
      id: "tuition5",
      semester: "Học kỳ 1",
      academicYear: "2022-2023",
      description: "Học phí học kỳ 1",
      amount: 9500000,
      paid: 9500000,
      dueDate: "2022-09-15",
    },
    {
      id: "tuition6",
      semester: "Học kỳ 2",
      academicYear: "2022-2023",
      description: "Học phí học kỳ 2",
      amount: 9500000,
      paid: 9500000,
      dueDate: "2023-01-15",
    },
    {
      id: "tuition7",
      semester: "Học kỳ 1",
      academicYear: "2023-2024",
      description: "Học phí học kỳ 1",
      amount: 10000000,
      paid: 10000000,
      dueDate: "2023-09-15",
    },
    {
      id: "tuition8",
      semester: "Học kỳ 2",
      academicYear: "2023-2024",
      description: "Học phí học kỳ 2",
      amount: 10000000,
      paid: 5000000,
      dueDate: "2024-01-15",
    },
  ],
};

// Service API cho hồ sơ sinh viên
const studentProfileService = {
  // Lấy thông tin hồ sơ sinh viên
  getStudentProfile: async (): Promise<StudentProfile> => {
    // Trong môi trường thực tế, đây sẽ là một API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockStudentProfile);
      }, 1000);
    });
  },

  // Cập nhật thông tin cá nhân
  updatePersonalInfo: async (
    personalInfo: PersonalInfo
  ): Promise<PersonalInfo> => {
    // Trong môi trường thực tế, đây sẽ là một API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(personalInfo);
      }, 1000);
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

  // Cập nhật avatar
  updateAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    // Trong môi trường thực tế, đây sẽ là một API call để upload file
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ avatarUrl: URL.createObjectURL(file) });
      }, 1000);
    });
  },

  // Upload tài liệu
  uploadDocument: async (documentId: string, file: File): Promise<Document> => {
    // Trong môi trường thực tế, đây sẽ là một API call để upload file
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedDocument: Document = {
          id: documentId,
          name:
            mockStudentProfile.documents.find((doc) => doc.id === documentId)
              ?.name || "",
          status: "processing",
          fileUrl: URL.createObjectURL(file),
          icon:
            mockStudentProfile.documents.find((doc) => doc.id === documentId)
              ?.icon || "fa-file",
        };
        resolve(updatedDocument);
      }, 1000);
    });
  },
};

export default studentProfileService;

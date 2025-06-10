import React, { useState, useRef, useCallback, useEffect } from "react";
import styled from "styled-components";
import { useForm } from "../hooks/useUtils";
import { useToast } from "../hooks/useUtils";
import useDeviceReportService, {
  DeviceReport,
  ReportHistoryItem,
} from "../services/deviceReportService";

// Styled Components
const ServiceIntro = styled.div`
  margin-bottom: 30px;
  line-height: 1.8;
  background-color: ${({ theme }) => theme.colors.primaryLight};
  padding: 20px;
  border-radius: ${({ theme }) => theme.borderRadius};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    overflow-x: auto;
    white-space: nowrap;
  }
`;

const Tab = styled.div<{ active: boolean }>`
  padding: 12px 20px;
  cursor: pointer;
  border-bottom: 3px solid
    ${({ active, theme }) => (active ? theme.colors.primary : "transparent")};
  color: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.text};
  font-weight: 500;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover:not(:active) {
    border-color: ${({ theme }) => theme.colors.border};
  }
`;

const TabContent = styled.div<{ active: boolean }>`
  display: ${({ active }) => (active ? "block" : "none")};
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: 25px;
  margin-bottom: 30px;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  h2 {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const FormRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: 0;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  flex: 1;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const Required = styled.span`
  color: ${({ theme }) => theme.colors.danger};
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1rem;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1rem;
  transition: all ${({ theme }) => theme.transitions.fast};
  background-color: white;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.2);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1rem;
  transition: all ${({ theme }) => theme.transitions.fast};
  resize: vertical;
  min-height: 120px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.2);
  }
`;

const Small = styled.small`
  display: block;
  margin-top: 5px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const PriorityOptions = styled.div`
  display: flex;
  gap: 15px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const PriorityOption = styled.div`
  flex: 1;
  position: relative;
`;

const PriorityInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
`;

const PriorityLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 15px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};

  i {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  ${PriorityInput}:checked + & {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.primaryLight};
  }
`;

const FileInputWrapper = styled.div`
  position: relative;
  overflow: hidden;
  display: inline-block;
  width: 100%;
`;

const FileInputTrigger = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 15px;
  background-color: ${({ theme }) => theme.colors.light};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FileInput = styled.input`
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
`;

const CancelButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  background-color: #e0e0e0;
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    background-color: #d5d5d5;
  }
`;

const SubmitButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
  }
`;

const ReportTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primaryDark};
  font-weight: 500;
`;

const TableCell = styled.td`
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const TableRow = styled.tr`
  &:hover {
    background-color: ${({ theme }) => theme.colors.light};
  }
`;

const StatusBadge = styled.span<{ status: "processing" | "completed" }>`
  background-color: ${({ status, theme }) =>
    status === "processing" ? "#fff8e1" : "#e8f5e9"};
  color: ${({ status, theme }) =>
    status === "processing" ? "#ff8f00" : "#2e7d32"};
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.1rem;
  cursor: pointer;
  padding: 5px;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 20px;
`;

const PageLink = styled.a<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius};
  color: ${({ active, theme }) =>
    active ? theme.colors.white : theme.colors.text};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.normal};
  cursor: pointer;

  &:hover {
    background-color: ${({ active, theme }) =>
      active ? theme.colors.primary : theme.colors.primaryLight};
    color: ${({ active, theme }) =>
      active ? theme.colors.white : theme.colors.primary};
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.875rem;
  margin-top: 5px;
`;

// Interface cho form báo hỏng - sử dụng từ service
type DeviceReportFormValues = Omit<
  DeviceReport,
  "id" | "date" | "status" | "images"
> & {
  images?: FileList | null;
};

const DeviceReportForm: React.FC = () => {
  // State cho tab đang active
  const [activeTab, setActiveTab] = useState<"new-report" | "history">(
    "new-report"
  );

  // State cho file upload
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputTriggerRef = useRef<HTMLDivElement>(null);

  // State cho loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State cho lịch sử báo cáo
  const [reportHistory, setReportHistory] = useState<ReportHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // State cho chi tiết báo cáo
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [reportDetail, setReportDetail] = useState<DeviceReport | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Sử dụng custom hook useForm
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    reset,
    validate,
    setErrors,
  } = useForm<DeviceReportFormValues>({
    location: "",
    room: "",
    deviceType: "",
    description: "",
    priority: "normal",
    contact: "",
  });

  // Sử dụng custom hook useToast
  const { showToast } = useToast();

  // Sử dụng service báo hỏng thiết bị
  const { submitReport, getReportHistory, getReportDetail } =
    useDeviceReportService();

  // Hàm xử lý chuyển tab
  const handleTabChange = (tab: "new-report" | "history") => {
    setActiveTab(tab);

    // Nếu chuyển sang tab lịch sử, tải dữ liệu lịch sử
    if (tab === "history") {
      fetchReportHistory(1);
    }
  };

  // Hàm tải dữ liệu lịch sử báo cáo
  const fetchReportHistory = useCallback(
    async (page: number) => {
      setIsLoadingHistory(true);
      try {
        const response = await getReportHistory(page, 10);
        setReportHistory(response.data);
        setCurrentPage(response.page);
        setTotalPages(response.totalPages);
      } catch (error) {
        showToast(
          "Không thể tải lịch sử báo cáo. Vui lòng thử lại sau.",
          "error"
        );
      } finally {
        setIsLoadingHistory(false);
      }
    },
    [getReportHistory, showToast]
  );

  // Tải lịch sử báo cáo khi component được mount
  useEffect(() => {
    if (activeTab === "history") {
      fetchReportHistory(1);
    }
  }, [fetchReportHistory, activeTab]);

  // Hàm xử lý khi chọn file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Kiểm tra số lượng file
      if (e.target.files.length > 3) {
        showToast("Chỉ được phép tải lên tối đa 3 ảnh", "error");
        e.target.value = "";
        if (fileInputTriggerRef.current) {
          fileInputTriggerRef.current.innerHTML =
            '<i class="fa fa-cloud-upload-alt"></i> Chọn hoặc kéo thả tệp vào đây';
        }
        return;
      }

      // Kiểm tra kích thước và định dạng file
      let isValid = true;
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];

        // Kiểm tra định dạng
        if (!file.type.startsWith("image/")) {
          showToast("Chỉ chấp nhận file ảnh (JPG, PNG)", "error");
          isValid = false;
          break;
        }

        // Kiểm tra kích thước (5MB = 5 * 1024 * 1024 bytes)
        if (file.size > 5 * 1024 * 1024) {
          showToast("Kích thước file không được vượt quá 5MB", "error");
          isValid = false;
          break;
        }
      }

      if (!isValid) {
        e.target.value = "";
        if (fileInputTriggerRef.current) {
          fileInputTriggerRef.current.innerHTML =
            '<i class="fa fa-cloud-upload-alt"></i> Chọn hoặc kéo thả tệp vào đây';
        }
        return;
      }

      setSelectedFiles(e.target.files);

      // Cập nhật UI
      if (fileInputTriggerRef.current) {
        fileInputTriggerRef.current.innerHTML = `<i class="fa fa-file-image"></i> ${e.target.files.length} tệp đã chọn`;
      }
    } else {
      setSelectedFiles(null);
      if (fileInputTriggerRef.current) {
        fileInputTriggerRef.current.innerHTML =
          '<i class="fa fa-cloud-upload-alt"></i> Chọn hoặc kéo thả tệp vào đây';
      }
    }
  };

  // Hàm xử lý khi thay đổi priority
  const handlePriorityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as "normal" | "urgent" | "very-urgent";
    handleChange({
      target: {
        name: "priority",
        value,
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  // Hàm validate form
  const validateForm = () => {
    const validationSchema = {
      location: (value: string) =>
        !value ? "Vui lòng chọn vị trí thiết bị" : null,
      room: (value: string) =>
        !value ? "Vui lòng nhập phòng/khu vực cụ thể" : null,
      deviceType: (value: string) =>
        !value ? "Vui lòng chọn loại thiết bị" : null,
      description: (value: string) => (!value ? "Vui lòng mô tả sự cố" : null),
      priority: () => null, // Không bắt buộc vì có giá trị mặc định
      contact: () => null, // Không bắt buộc
    };

    return validate(validationSchema);
  };

  // Hàm xử lý khi submit form
  const handleSubmit = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Chuẩn bị dữ liệu để gửi
      const reportData: DeviceReport = {
        location: values.location,
        room: values.room,
        deviceType: values.deviceType,
        description: values.description,
        priority: values.priority,
        contact: values.contact,
        // Chuyển đổi FileList sang File[] nếu có
        images: selectedFiles ? Array.from(selectedFiles) : undefined,
      };

      // Gọi API để gửi báo cáo
      await submitReport(reportData);

      // Hiển thị thông báo thành công
      showToast(
        "Báo cáo hỏng thiết bị đã được gửi thành công! Bộ phận kỹ thuật sẽ xử lý trong thời gian sớm nhất.",
        "success"
      );

      // Reset form
      reset();
      setSelectedFiles(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      if (fileInputTriggerRef.current) {
        fileInputTriggerRef.current.innerHTML =
          '<i class="fa fa-cloud-upload-alt"></i> Chọn hoặc kéo thả tệp vào đây';
      }
    } catch (error) {
      showToast(
        "Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại sau.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hàm xử lý khi hủy form
  const handleCancel = () => {
    // Hiển thị xác nhận trước khi hủy
    if (
      values.location ||
      values.room ||
      values.deviceType ||
      values.description ||
      values.contact ||
      selectedFiles
    ) {
      if (
        window.confirm(
          "Bạn có chắc chắn muốn hủy? Tất cả thông tin đã nhập sẽ bị mất."
        )
      ) {
        reset();
        setSelectedFiles(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        if (fileInputTriggerRef.current) {
          fileInputTriggerRef.current.innerHTML =
            '<i class="fa fa-cloud-upload-alt"></i> Chọn hoặc kéo thả tệp vào đây';
        }
      }
    }
  };

  // Hàm xử lý khi xem chi tiết báo cáo
  const handleViewReport = async (id: number) => {
    setSelectedReportId(id);
    setIsLoadingDetail(true);

    try {
      const detail = await getReportDetail(id);
      setReportDetail(detail);

      // Hiển thị modal hoặc thông tin chi tiết (có thể thêm state để hiển thị modal)
      showToast(`Đã tải thông tin chi tiết cho báo cáo #${id}`, "info");

      // Trong thực tế, bạn có thể hiển thị một modal với thông tin chi tiết
      console.log("Chi tiết báo cáo:", detail);
    } catch (error) {
      showToast(`Không thể tải thông tin chi tiết cho báo cáo #${id}`, "error");
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // Hàm xử lý khi chuyển trang
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchReportHistory(page);
    }
  };

  return (
    <>
      <h1 className="page-title">
        <i className="fa fa-tools" style={{ color: "#ff7043" }}></i> Báo hỏng
        thiết bị
      </h1>

      <ServiceIntro>
        <p>
          Dịch vụ báo hỏng thiết bị giúp sinh viên thông báo nhanh chóng các sự
          cố về cơ sở vật chất, trang thiết bị trong khuôn viên trường. Thông
          tin báo hỏng sẽ được chuyển đến bộ phận kỹ thuật để xử lý kịp thời.
        </p>
      </ServiceIntro>

      <Tabs>
        <Tab
          active={activeTab === "new-report"}
          onClick={() => handleTabChange("new-report")}
        >
          Báo hỏng mới
        </Tab>
        <Tab
          active={activeTab === "history"}
          onClick={() => handleTabChange("history")}
        >
          Lịch sử báo hỏng
        </Tab>
      </Tabs>

      <TabContent active={activeTab === "new-report"}>
        <Card>
          <h2>Thông tin báo hỏng</h2>

          <FormRow>
            <FormGroup>
              <Label htmlFor="location">
                Vị trí thiết bị: <Required>*</Required>
              </Label>
              <Select
                id="location"
                name="location"
                value={values.location}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">-- Chọn vị trí --</option>
                <option value="phong-hoc">Phòng học</option>
                <option value="phong-lab">Phòng thực hành/Lab</option>
                <option value="thu-vien">Thư viện</option>
                <option value="ktx">Ký túc xá</option>
                <option value="cantin">Căn tin</option>
                <option value="hanh-lang">Hành lang/Khu vực chung</option>
                <option value="khac">Khác</option>
              </Select>
              {touched.location && errors.location && (
                <ErrorMessage>{errors.location}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="room">
                Phòng/Khu vực cụ thể: <Required>*</Required>
              </Label>
              <Input
                type="text"
                id="room"
                name="room"
                placeholder="Ví dụ: A305, Lab CNTT1, Thư viện tầng 2..."
                value={values.room}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.room && errors.room && (
                <ErrorMessage>{errors.room}</ErrorMessage>
              )}
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label htmlFor="deviceType">
              Loại thiết bị: <Required>*</Required>
            </Label>
            <Select
              id="deviceType"
              name="deviceType"
              value={values.deviceType}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="">-- Chọn loại thiết bị --</option>
              <option value="may-tinh">Máy tính</option>
              <option value="may-chieu">Máy chiếu</option>
              <option value="dieu-hoa">Điều hòa</option>
              <option value="quat">Quạt</option>
              <option value="den">Đèn/Hệ thống chiếu sáng</option>
              <option value="ban-ghe">Bàn ghế</option>
              <option value="cua">Cửa/Khóa cửa</option>
              <option value="nuoc">Hệ thống nước</option>
              <option value="mang">Mạng/Wifi</option>
              <option value="khac">Thiết bị khác</option>
            </Select>
            {touched.deviceType && errors.deviceType && (
              <ErrorMessage>{errors.deviceType}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="description">
              Mô tả sự cố: <Required>*</Required>
            </Label>
            <Textarea
              id="description"
              name="description"
              rows={5}
              placeholder="Mô tả chi tiết về tình trạng hỏng hóc của thiết bị..."
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.description && errors.description && (
              <ErrorMessage>{errors.description}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Mức độ ưu tiên:</Label>
            <PriorityOptions>
              <PriorityOption>
                <PriorityInput
                  type="radio"
                  name="priority"
                  id="priority-normal"
                  value="normal"
                  checked={values.priority === "normal"}
                  onChange={handlePriorityChange}
                />
                <PriorityLabel htmlFor="priority-normal">
                  <i
                    className="fa fa-check-circle"
                    style={{ color: "#4caf50" }}
                  ></i>
                  <span>Bình thường</span>
                </PriorityLabel>
              </PriorityOption>

              <PriorityOption>
                <PriorityInput
                  type="radio"
                  name="priority"
                  id="priority-urgent"
                  value="urgent"
                  checked={values.priority === "urgent"}
                  onChange={handlePriorityChange}
                />
                <PriorityLabel htmlFor="priority-urgent">
                  <i
                    className="fa fa-exclamation-circle"
                    style={{ color: "#ff9800" }}
                  ></i>
                  <span>Khẩn cấp</span>
                </PriorityLabel>
              </PriorityOption>

              <PriorityOption>
                <PriorityInput
                  type="radio"
                  name="priority"
                  id="priority-very-urgent"
                  value="very-urgent"
                  checked={values.priority === "very-urgent"}
                  onChange={handlePriorityChange}
                />
                <PriorityLabel htmlFor="priority-very-urgent">
                  <i
                    className="fa fa-exclamation-triangle"
                    style={{ color: "#f44336" }}
                  ></i>
                  <span>Rất khẩn cấp</span>
                </PriorityLabel>
              </PriorityOption>
            </PriorityOptions>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="report-images">Hình ảnh đính kèm:</Label>
            <FileInputWrapper>
              <FileInputTrigger ref={fileInputTriggerRef}>
                <i className="fa fa-cloud-upload-alt"></i>
                <span>Chọn hoặc kéo thả tệp vào đây</span>
              </FileInputTrigger>
              <FileInput
                type="file"
                id="report-images"
                ref={fileInputRef}
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
            </FileInputWrapper>
            <Small>
              Có thể tải lên tối đa 3 ảnh (định dạng JPG, PNG, tối đa 5MB/ảnh)
            </Small>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="contact">Thông tin liên hệ:</Label>
            <Input
              type="text"
              id="contact"
              name="contact"
              placeholder="Số điện thoại hoặc email để liên hệ khi cần"
              value={values.contact}
              onChange={handleChange}
            />
          </FormGroup>

          <FormActions>
            <CancelButton type="button" onClick={handleCancel}>
              Hủy
            </CancelButton>
            <SubmitButton
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <i className="fa fa-spinner fa-spin"></i> Đang gửi...
                </>
              ) : (
                <>
                  <i className="fa fa-paper-plane"></i> Gửi báo cáo
                </>
              )}
            </SubmitButton>
          </FormActions>
        </Card>
      </TabContent>

      <TabContent active={activeTab === "history"}>
        <Card>
          <h2>Lịch sử báo hỏng</h2>

          {isLoadingHistory ? (
            <div style={{ textAlign: "center", padding: "30px" }}>
              <i
                className="fa fa-spinner fa-spin"
                style={{ fontSize: "2rem", color: "#1976d2" }}
              ></i>
              <p style={{ marginTop: "10px" }}>Đang tải dữ liệu...</p>
            </div>
          ) : (
            <>
              <div style={{ overflowX: "auto" }}>
                <ReportTable>
                  <thead>
                    <tr>
                      <TableHeader>STT</TableHeader>
                      <TableHeader>Ngày báo cáo</TableHeader>
                      <TableHeader>Vị trí</TableHeader>
                      <TableHeader>Loại thiết bị</TableHeader>
                      <TableHeader>Trạng thái</TableHeader>
                      <TableHeader>Thao tác</TableHeader>
                    </tr>
                  </thead>
                  <tbody>
                    {reportHistory.length > 0 ? (
                      reportHistory.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>{report.id}</TableCell>
                          <TableCell>{report.date}</TableCell>
                          <TableCell>{report.location}</TableCell>
                          <TableCell>{report.deviceType}</TableCell>
                          <TableCell>
                            <StatusBadge status={report.status}>
                              {report.status === "processing"
                                ? "Đang xử lý"
                                : "Đã xử lý"}
                            </StatusBadge>
                          </TableCell>
                          <TableCell>
                            <ActionButton
                              title="Xem chi tiết"
                              onClick={() => handleViewReport(report.id)}
                              disabled={
                                isLoadingDetail &&
                                selectedReportId === report.id
                              }
                            >
                              {isLoadingDetail &&
                              selectedReportId === report.id ? (
                                <i className="fa fa-spinner fa-spin"></i>
                              ) : (
                                <i className="fa fa-eye"></i>
                              )}
                            </ActionButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} style={{ textAlign: "center" }}>
                          Không có dữ liệu báo cáo
                        </TableCell>
                      </TableRow>
                    )}
                  </tbody>
                </ReportTable>
              </div>

              {reportHistory.length > 0 && (
                <Pagination>
                  <PageLink
                    onClick={() => handlePageChange(1)}
                    title="Trang đầu"
                    style={{
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                      opacity: currentPage === 1 ? 0.5 : 1,
                    }}
                  >
                    <i className="fa fa-angle-double-left"></i>
                  </PageLink>
                  <PageLink
                    onClick={() => handlePageChange(currentPage - 1)}
                    title="Trang trước"
                    style={{
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                      opacity: currentPage === 1 ? 0.5 : 1,
                    }}
                  >
                    <i className="fa fa-angle-left"></i>
                  </PageLink>

                  {/* Hiển thị các số trang */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page >= Math.max(1, currentPage - 1) &&
                        page <= Math.min(totalPages, currentPage + 1)
                    )
                    .map((page) => (
                      <PageLink
                        key={page}
                        onClick={() => handlePageChange(page)}
                        active={page === currentPage}
                      >
                        {page}
                      </PageLink>
                    ))}

                  <PageLink
                    onClick={() => handlePageChange(currentPage + 1)}
                    title="Trang sau"
                    style={{
                      cursor:
                        currentPage === totalPages ? "not-allowed" : "pointer",
                      opacity: currentPage === totalPages ? 0.5 : 1,
                    }}
                  >
                    <i className="fa fa-angle-right"></i>
                  </PageLink>
                  <PageLink
                    onClick={() => handlePageChange(totalPages)}
                    title="Trang cuối"
                    style={{
                      cursor:
                        currentPage === totalPages ? "not-allowed" : "pointer",
                      opacity: currentPage === totalPages ? 0.5 : 1,
                    }}
                  >
                    <i className="fa fa-angle-double-right"></i>
                  </PageLink>
                </Pagination>
              )}
            </>
          )}
        </Card>
      </TabContent>
    </>
  );
};

export default DeviceReportForm;

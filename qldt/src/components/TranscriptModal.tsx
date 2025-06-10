import React, { useState, useEffect } from "react";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  color: #1e3056;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #f44336;
  }
`;

const ModalBody = styled.div`
  padding: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  min-height: 100px;
  resize: vertical;
`;

const FeeDisplay = styled.div`
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const FeeTitle = styled.div`
  font-weight: 500;
  margin-bottom: 10px;
  color: #333;
`;

const FeeAmount = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #1e3056;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
`;

const CancelButton = styled(Button)`
  background-color: #f5f5f5;
  color: #333;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const SubmitButton = styled(Button)`
  background-color: #1e3056;
  color: white;
  
  &:hover {
    background-color: #2a4070;
  }
`;

interface TranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TranscriptModal: React.FC<TranscriptModalProps> = ({ isOpen, onClose }) => {
  const [transcriptType, setTranscriptType] = useState("vietnamese");
  const [copies, setCopies] = useState(1);
  const [purpose, setPurpose] = useState("");
  const [otherPurpose, setOtherPurpose] = useState("");
  const [fee, setFee] = useState(30000);
  const [showOtherPurpose, setShowOtherPurpose] = useState(false);

  // Cập nhật lệ phí khi thay đổi loại bảng điểm hoặc số lượng
  useEffect(() => {
    let baseFee = 0;
    if (transcriptType === "vietnamese") {
      baseFee = 30000;
    } else if (transcriptType === "english") {
      baseFee = 50000;
    } else if (transcriptType === "both") {
      baseFee = 70000;
    }
    setFee(baseFee * copies);
  }, [transcriptType, copies]);

  // Xử lý khi thay đổi mục đích
  useEffect(() => {
    setShowOtherPurpose(purpose === "other");
  }, [purpose]);

  // Xử lý khi gửi yêu cầu
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra thông tin
    if (!transcriptType) {
      alert("Vui lòng chọn loại bảng điểm!");
      return;
    }
    
    if (!purpose) {
      alert("Vui lòng chọn mục đích sử dụng!");
      return;
    }
    
    if (purpose === "other" && !otherPurpose) {
      alert("Vui lòng nhập mục đích sử dụng khác!");
      return;
    }
    
    // Trong thực tế, đây sẽ là API call để gửi yêu cầu
    alert(`Đã gửi yêu cầu cấp bảng điểm thành công! Lệ phí: ${fee.toLocaleString()} VNĐ`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Yêu cầu cấp bảng điểm</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="transcript-type">Loại bảng điểm:</Label>
              <Select
                id="transcript-type"
                value={transcriptType}
                onChange={(e) => setTranscriptType(e.target.value)}
              >
                <option value="vietnamese">Bảng điểm tiếng Việt</option>
                <option value="english">Bảng điểm tiếng Anh</option>
                <option value="both">Cả hai loại</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="transcript-copies">Số lượng bản:</Label>
              <Input
                id="transcript-copies"
                type="number"
                min="1"
                max="10"
                value={copies}
                onChange={(e) => setCopies(parseInt(e.target.value) || 1)}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="transcript-purpose">Mục đích sử dụng:</Label>
              <Select
                id="transcript-purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              >
                <option value="">-- Chọn mục đích --</option>
                <option value="job">Xin việc</option>
                <option value="study">Học tiếp</option>
                <option value="scholarship">Xin học bổng</option>
                <option value="visa">Xin visa</option>
                <option value="other">Khác</option>
              </Select>
            </FormGroup>

            {showOtherPurpose && (
              <FormGroup id="other-purpose-group">
                <Label htmlFor="other-purpose">Mục đích khác:</Label>
                <TextArea
                  id="other-purpose"
                  value={otherPurpose}
                  onChange={(e) => setOtherPurpose(e.target.value)}
                  placeholder="Vui lòng nhập mục đích sử dụng bảng điểm..."
                />
              </FormGroup>
            )}

            <FeeDisplay>
              <FeeTitle>Lệ phí:</FeeTitle>
              <FeeAmount id="transcript-fee">{fee.toLocaleString()} VNĐ</FeeAmount>
            </FeeDisplay>

            <ButtonGroup>
              <CancelButton type="button" onClick={onClose}>
                Hủy
              </CancelButton>
              <SubmitButton type="submit">
                Gửi yêu cầu
              </SubmitButton>
            </ButtonGroup>
          </form>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default TranscriptModal;
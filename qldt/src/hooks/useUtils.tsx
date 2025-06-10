import React, { useState, useCallback } from "react";

// Custom hook để format số tiền thành định dạng tiền tệ Việt Nam
export const useFormatCurrency = () => {
  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  }, []);

  return formatCurrency;
};

// Custom hook để format ngày tháng theo định dạng Việt Nam (DD/MM/YYYY)
export const useFormatDate = () => {
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }, []);

  return formatDate;
};

// Custom hook để hiển thị thông báo toast
export const useToast = () => {
  const [toasts, setToasts] = useState<
    Array<{ id: number; message: string; type: string }>
  >([]);

  const showToast = useCallback(
    (message: string, type = "info", duration = 3000) => {
      const id = Date.now();

      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, duration);

      return id;
    },
    []
  );

  const hideToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const ToastContainer = () => (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <div className="toast-content">{toast.message}</div>
          <button className="toast-close" onClick={() => hideToast(toast.id)}>
            ×
          </button>
        </div>
      ))}
    </div>
  );

  return { showToast, hideToast, ToastContainer };
};

// Custom hook để xử lý form
export const useForm = <T extends Record<string, any>>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  const validate = (
    validationSchema: Record<keyof T, (value: any) => string | null>
  ) => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validationSchema).forEach((key) => {
      const error = validationSchema[key as keyof T](values[key as keyof T]);
      if (error) {
        newErrors[key as keyof T] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    reset,
    validate,
    setValues,
    setErrors,
    setTouched,
  };
};

export default {
  useFormatCurrency,
  useFormatDate,
  useToast,
  useForm,
};

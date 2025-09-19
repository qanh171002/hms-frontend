import { useState, useEffect } from "react";
import Modal from "./Modal";
import Button from "./Button";

function ConfirmModal({
  isOpen,
  title = "Confirm",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variation = "danger",
  onClose,
  onConfirm,
  requiresInput = false,
  inputLabel = "Reason",
  inputPlaceholder = "Type here...",
  validateInput = (val) => val.trim().length > 0,
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setValue("");
      setError("");
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (requiresInput) {
      const isValid = validateInput(String(value || ""));
      if (!isValid) {
        setError("Please enter a valid reason");
        return;
      }
      onConfirm?.(String(value || "").trim());
      return;
    }
    onConfirm?.();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="mb-4 text-2xl font-semibold text-gray-800">{title}</div>
      {message && (
        <p className="mb-5 text-lg leading-6 text-gray-600">{message}</p>
      )}

      {requiresInput && (
        <div className="mb-5">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {inputLabel}
          </label>
          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError("");
            }}
            placeholder={inputPlaceholder}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
          {error && <div className="mt-1 text-xs text-red-600">{error}</div>}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button onClick={onClose} variation="tertiary" size="medium">
          {cancelLabel}
        </Button>
        <Button onClick={handleConfirm} variation={variation} size="medium">
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

export default ConfirmModal;

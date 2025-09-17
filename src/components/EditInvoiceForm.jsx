import { useState, useEffect } from "react";
import Button from "./Button";
import SpinnerMini from "./SpinnerMini";

function EditInvoiceForm({ onSubmit, isSubmitting, onClose, invoice }) {
  const [formData, setFormData] = useState({
    bookingId: "",
    amount: "",
    paidAmount: "",
    status: "Pending",
    issuedDate: "",
    dueDate: "",
    paymentMethod: "",
    notes: "",
  });

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

  const disabledInputClass =
    "w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm shadow-sm text-gray-500 cursor-not-allowed";

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  const formatDateForAPI = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString + "T00:00:00.000Z");
      return date.toISOString();
    } catch {
      return "";
    }
  };

  useEffect(() => {
    if (invoice) {
      setFormData({
        bookingId: invoice.bookingId || "",
        amount: invoice.amount || "",
        paidAmount: invoice.paidAmount || "",
        status: invoice.status || "Pending",
        issuedDate: formatDateForInput(invoice.issuedDate),
        dueDate: formatDateForInput(invoice.dueDate),
        paymentMethod: invoice.paymentMethod || "",
        notes: invoice.notes || "",
      });
    }
  }, [invoice]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiInvoice = {
      // bookingId: Number(formData.bookingId),
      // amount: Number(formData.amount),
      paidAmount: Number(formData.paidAmount) || 0,
      status: formData.status,
      issuedDate: formatDateForAPI(formData.issuedDate),
      dueDate: formatDateForAPI(formData.dueDate),
      paymentMethod: formData.paymentMethod.trim(),
      notes: formData.notes.trim(),
    };

    if (onSubmit) {
      onSubmit(apiInvoice);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="mb-6 text-xl font-semibold text-gray-800">Edit Invoice</h2>
      <div className="grid grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Booking ID
            </label>
            <input
              type="number"
              name="bookingId"
              value={formData.bookingId}
              className={disabledInputClass}
              required
              disabled
              readOnly
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              className={disabledInputClass}
              required
              disabled
              readOnly
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Paid Amount
            </label>
            <input
              type="number"
              name="paidAmount"
              value={formData.paidAmount}
              onChange={handleChange}
              placeholder="Paid amount"
              className={inputClass}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputClass}
              required
              disabled={isSubmitting}
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Issued Date
            </label>
            <input
              type="date"
              name="issuedDate"
              value={formData.issuedDate}
              className={disabledInputClass}
              required
              disabled
              readOnly
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={inputClass}
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className={inputClass}
              disabled={isSubmitting}
            >
              <option value="">Choose payment method</option>
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Digital Wallet">Digital Wallet</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Additional notes"
              className={inputClass}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3 border-t pt-6">
        <Button variation="secondary" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <SpinnerMini /> : "Update Invoice"}
        </Button>
      </div>
    </form>
  );
}

export default EditInvoiceForm;

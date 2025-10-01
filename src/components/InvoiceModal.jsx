import { useState, useEffect, useCallback } from "react";
import {
  getInvoiceById,
  updateInvoice,
  downloadInvoicePDF,
} from "../apis/invoicesApi";
import toast from "react-hot-toast";
import Spinner from "./Spinner";
import Modal from "./Modal";
import Button from "./Button";
import SpinnerMini from "./SpinnerMini";
import { HiDownload } from "react-icons/hi";

const statusStyles = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-green-100 text-green-700",
};

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

const paymentMethods = ["Cash", "Credit Card", "Bank Transfer", "PayPal"];

function InvoiceModal({ isOpen, onClose, invoiceId }) {
  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [formData, setFormData] = useState({
    paidAmount: "",
    dueDate: "",
    paymentMethod: "",
    status: "",
  });

  const fetchInvoice = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getInvoiceById(invoiceId);
      setInvoice(data);
      setFormData({
        paidAmount: data.paidAmount || "",
        dueDate: data.dueDate ? data.dueDate.split("T")[0] : "",
        paymentMethod: data.paymentMethod || "",
        status: (data.status || "").toUpperCase(),
      });
    } catch (error) {
      console.error("Error fetching invoice:", error);
      toast.error("Failed to fetch invoice details");
    } finally {
      setIsLoading(false);
    }
  }, [invoiceId]);

  useEffect(() => {
    if (isOpen && invoiceId) {
      fetchInvoice();
    }
  }, [isOpen, invoiceId, fetchInvoice]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsUpdating(true);
      const updateData = {
        paidAmount: formData.paidAmount
          ? parseFloat(formData.paidAmount)
          : null,
        dueDate: formData.dueDate ? `${formData.dueDate}T00:00:00.000Z` : null,
        paymentMethod: formData.paymentMethod || null,
        status: formData.status || null,
      };

      const cleanData = Object.fromEntries(
        Object.entries(updateData).filter(
          ([, value]) => value !== null && value !== "",
        ),
      );

      await updateInvoice(invoiceId, cleanData);
      toast.success("Invoice updated successfully");
      setIsEditing(false);
      fetchInvoice(); // Refresh data
    } catch (error) {
      console.error("Error updating invoice:", error);
      toast.error("Failed to update invoice");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      paidAmount: invoice.paidAmount || "",
      dueDate: invoice.dueDate ? invoice.dueDate.split("T")[0] : "",
      paymentMethod: invoice.paymentMethod || "",
      status: (invoice.status || "").toUpperCase(),
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDownloadInvoice = async () => {
    if (!invoiceId) return;

    try {
      setIsDownloading(true);
      await downloadInvoicePDF(invoiceId);
      toast.success("Invoice PDF downloaded successfully!");
    } catch (error) {
      console.error("Error downloading invoice PDF:", error);
      toast.error("Failed to download invoice PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-2xl">
        <h2 className="mb-6 text-xl font-semibold text-gray-800">
          Invoice #{invoiceId}
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        ) : invoice ? (
          <div className="space-y-4">
            {/* Invoice Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Invoice ID
                </label>
                <div className="text-lg font-semibold">#{invoice.id}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Booking ID
                </label>
                <div className="text-lg font-semibold">
                  #{invoice.bookingId}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Total Amount
                </label>
                <div className="text-lg font-semibold text-green-600">
                  {formatCurrency(invoice.amount)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Issued Date
                </label>
                <div className="text-lg font-semibold">
                  {formatDate(invoice.issuedDate)}
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="border-t pt-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-700">
                  Payment Information
                </h3>
                {!isEditing && (
                  <Button size="small" onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Paid Amount */}
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Paid Amount
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="paidAmount"
                      value={formData.paidAmount}
                      onChange={handleInputChange}
                      className={inputClass}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  ) : (
                    <div className="text-lg font-semibold">
                      {invoice.paidAmount
                        ? formatCurrency(invoice.paidAmount)
                        : "Not paid"}
                    </div>
                  )}
                </div>

                {/* Due Date */}
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Due Date
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      className={inputClass}
                    />
                  ) : (
                    <div className="text-lg font-semibold">
                      {formatDate(invoice.dueDate)}
                    </div>
                  )}
                </div>

                {/* Payment Method */}
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Payment Method
                  </label>
                  {isEditing ? (
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      className={inputClass}
                    >
                      <option value="">Select payment method</option>
                      {paymentMethods.map((method) => (
                        <option key={method} value={method}>
                          {method}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-lg font-semibold">
                      {invoice.paymentMethod || "Not specified"}
                    </div>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Status
                  </label>
                  {isEditing ? (
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className={inputClass}
                    >
                      <option value="">Select status</option>
                      <option value="PENDING">Pending</option>
                      <option value="PAID">Paid</option>
                    </select>
                  ) : (
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        statusStyles[invoice.status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {invoice.status || "Unknown"}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleCancel}
                      variation="secondary"
                      disabled={isUpdating}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isUpdating}>
                      {isUpdating ? <SpinnerMini /> : "Save"}
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleDownloadInvoice}
                    variation="secondary"
                    disabled={isDownloading}
                    className="flex items-center gap-2"
                  >
                    {isDownloading ? (
                      <SpinnerMini />
                    ) : (
                      <>
                        <HiDownload className="h-4 w-4" />
                        Download PDF
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-red-600">
            Failed to load invoice details
          </div>
        )}
      </div>
    </Modal>
  );
}

export default InvoiceModal;

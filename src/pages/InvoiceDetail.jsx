import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import {
  HiOutlineCalendar,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCreditCard,
  HiOutlineCurrencyDollar,
} from "react-icons/hi2";
import { useNavigate, useParams } from "react-router-dom";
import { downloadInvoicePDF, getInvoiceById } from "../apis/invoicesApi";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import SpinnerMini from "../components/SpinnerMini";
function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const statusStyles = {
    PENDING: "bg-yellow-100 text-yellow-700",
    PAID: "bg-green-100 text-green-700",
  };

  const formatDate = (dateString) => {
    if (!dateString) return "_";
    try {
      const d = new Date(dateString);
      return d.toLocaleString("vi-VN");
    } catch {
      return "Invalid Date";
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      await downloadInvoicePDF(id);
      toast.success("Invoice PDF downloaded successfully!");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await getInvoiceById(id);
        setInvoice(data);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex h-40 items-center justify-center text-gray-600">
        Invoice not found
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-gray-800">
            Invoice #{invoice.id}
          </h1>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
              statusStyles[invoice.status] || "bg-gray-100 text-gray-700"
            }`}
          >
            {invoice.status}
          </span>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-lg font-semibold text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft />
          Back
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow">
        <div className="flex flex-col justify-between gap-3 bg-blue-500 p-6 text-blue-50 md:flex-row md:items-center">
          <div className="text-lg font-semibold">
            Booking #{invoice.bookingId}
          </div>
        </div>

        <div className="space-y-6 px-14 py-12 text-gray-800">
          <div className="flex items-center gap-3">
            <HiOutlineCurrencyDollar className="text-2xl text-blue-500" />
            <span className="text-lg font-medium">Amount</span>
            <span className="text-lg text-gray-700">{invoice.amount}</span>
          </div>

          <div className="flex items-center gap-3">
            <HiOutlineCurrencyDollar className="text-2xl text-blue-500" />
            <span className="text-lg font-medium">Paid amount</span>
            <span className="text-lg text-gray-700">{invoice.paidAmount}</span>
          </div>

          <div className="flex items-center gap-3">
            <HiOutlineCalendar className="text-2xl text-blue-500" />
            <span className="text-lg font-medium">Issued date</span>
            <span className="text-lg text-gray-700">
              {formatDate(invoice.issuedDate)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <HiOutlineCalendar className="text-2xl text-blue-500" />
            <span className="text-lg font-medium">Due date</span>
            <span className="text-lg text-gray-700">
              {formatDate(invoice.dueDate)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <HiOutlineCreditCard className="text-2xl text-blue-500" />
            <span className="text-lg font-medium">Payment method</span>
            <span className="text-lg text-gray-700">
              {invoice.paymentMethod || "_"}
            </span>
          </div>

          {invoice.notes && invoice.notes.trim() !== "" && (
            <div className="flex items-center gap-3">
              <HiOutlineChatBubbleLeftRight className="text-2xl text-blue-500" />
              <span className="text-lg font-medium">Notes</span>
              <span className="text-lg text-gray-700">{invoice.notes}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap justify-end gap-4">
        <Button
          size="medium"
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="flex items-center gap-2"
        >
          {isDownloading ? <SpinnerMini /> : "Download PDF"}
        </Button>

        <Button
          variation="secondary"
          size="medium"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          Back
        </Button>
      </div>
    </div>
  );
}

export default InvoiceDetail;

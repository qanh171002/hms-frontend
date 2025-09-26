import { HiTrash, HiPencil } from "react-icons/hi";
import { useState, useEffect, useCallback } from "react";
import Button from "../components/Button";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import {
  getInvoices,
  deleteInvoice,
  updateInvoice,
  filterInvoices,
} from "../apis/invoicesApi";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import EditInvoiceForm from "../components/EditInvoiceForm";
import {
  FaFilter,
  FaSearch,
  FaDollarSign,
  FaCalendarAlt,
  FaCreditCard,
  FaBed,
} from "react-icons/fa";
import { FaX } from "react-icons/fa6";

const statusStyles = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-green-100 text-green-700",
};

const statusOptions = ["Pending", "Paid"];
const paymentMethods = ["Cash", "Credit Card", "Bank Transfer", "PayPal"];

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filters, setFilters] = useState({
    minAmount: "",
    maxAmount: "",
    status: "",
    issuedDateFrom: "",
    issuedDateTo: "",
    dueDateFrom: "",
    dueDateTo: "",
    paymentMethod: "",
    bookingId: "",
  });
  const [filterTimeout, setFilterTimeout] = useState(null);

  useEffect(() => {
    const fetchInitialInvoices = async () => {
      try {
        setIsLoading(true);
        const data = await getInvoices(currentPage - 1, pageSize);
        const sorted = [...(data.content || [])].sort(
          (a, b) => (a.id || 0) - (b.id || 0),
        );
        setInvoices(sorted);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Error fetching invoices:", err);
        toast.error("Failed to load invoices");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialInvoices();
  }, [currentPage, pageSize]);

  const applyFilters = useCallback(async () => {
    try {
      setIsFiltering(true);
      const hasActiveFilters = Object.values(filters).some(
        (value) => value !== "",
      );

      let data;
      if (hasActiveFilters) {
        data = await filterInvoices(filters, currentPage - 1, pageSize);
      } else {
        data = await getInvoices(currentPage - 1, pageSize);
      }
      const sorted = [...(data.content || [])].sort(
        (a, b) => (a.id || 0) - (b.id || 0),
      );

      setInvoices(sorted);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error filtering invoices:", err);
      toast.error("Failed to filter invoices");
    } finally {
      setIsFiltering(false);
    }
  }, [filters, currentPage, pageSize]);

  useEffect(() => {
    if (filterTimeout) {
      clearTimeout(filterTimeout);
    }

    const newTimeout = setTimeout(() => {
      applyFilters();
    }, 500);

    setFilterTimeout(newTimeout);

    return () => {
      if (newTimeout) {
        clearTimeout(newTimeout);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, applyFilters]);

  const handleEditInvoice = async (updatedInvoice) => {
    try {
      setIsSubmitting(true);
      const editedInvoice = await updateInvoice(
        editingInvoice.id,
        updatedInvoice,
      );
      setInvoices((prevInvoices) =>
        prevInvoices
          .map((invoice) =>
            invoice.id === editingInvoice.id ? editedInvoice : invoice,
          )
          .sort((a, b) => (a.id || 0) - (b.id || 0)),
      );
      setIsEditModalOpen(false);
      setEditingInvoice(null);
      toast.success("Invoice updated successfully!");
    } catch (err) {
      console.error("Error in handleEditInvoice:", err);

      let errorMessage = "Failed to update invoice!";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEditModal = (invoice) => {
    setEditingInvoice(invoice);
    setIsEditModalOpen(true);
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const handleDeleteInvoice = async (id) => {
    setConfirmDeleteId(id);
  };
  const confirmDeleteInvoice = async () => {
    try {
      const id = confirmDeleteId;
      if (!id) return;
      await deleteInvoice(id);
      setInvoices((prevInvoices) =>
        prevInvoices.filter((invoice) => invoice.id !== id),
      );
      toast.success("Invoice deleted successfully!");
    } catch (err) {
      console.error("Error deleting invoice:", err);

      let errorMessage = "Failed to delete invoice!";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      minAmount: "",
      maxAmount: "",
      status: "",
      issuedDateFrom: "",
      issuedDateTo: "",
      dueDateFrom: "",
      dueDateTo: "",
      paymentMethod: "",
      bookingId: "",
    });
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  const getActiveFilterCount = () => {
    return Object.values(filters).filter((value) => value !== "").length;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "_";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    } catch {
      return "Invalid Date";
    }
  };

  const pageInvoices = invoices;

  return (
    <>
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-2 mb-6 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800">Invoices</h2>
          <p className="text-base text-gray-500">
            Manage hotel invoices and payments.
          </p>
        </div>
        <div className="col-span-2 flex items-center justify-end gap-3">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variation={showFilters ? "primary" : "tertiary"}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 transition-all duration-300 ${
              showFilters ? "shadow-lg" : ""
            }`}
          >
            <FaFilter className="h-4 w-4" />
            <span>Filters</span>
            {getActiveFilterCount() > 0 && (
              <span className="rounded-full bg-blue-600 px-2 py-1 text-xs text-white">
                {getActiveFilterCount()}
              </span>
            )}
          </Button>
          {/* <Button onClick={() => setIsModalOpen(true)}>Add Invoice</Button> */}
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="col-span-4 rounded-2xl bg-white p-6">
        {showFilters && (
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaSearch className="h-5 w-5 text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-800">
                  Advanced Filters
                </h3>
                {isFiltering && (
                  <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                )}
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-slate-500 transition-colors hover:text-red-500"
                >
                  <FaX className="h-4 w-4" />
                  <span className="text-sm">Clear All</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {/* Min Amount Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaDollarSign className="text-slate-400" />
                  Min Amount
                </label>
                <input
                  type="number"
                  placeholder="Enter min amount"
                  value={filters.minAmount}
                  onChange={(e) =>
                    handleFilterChange("minAmount", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Max Amount Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaDollarSign className="text-slate-400" />
                  Max Amount
                </label>
                <input
                  type="number"
                  placeholder="Enter max amount"
                  value={filters.maxAmount}
                  onChange={(e) =>
                    handleFilterChange("maxAmount", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaDollarSign className="text-slate-400" />
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All statuses</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Booking ID Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaBed className="text-slate-400" />
                  Booking ID
                </label>
                <input
                  type="number"
                  placeholder="Enter booking ID"
                  value={filters.bookingId}
                  onChange={(e) =>
                    handleFilterChange("bookingId", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Issued Date From */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaCalendarAlt className="text-slate-400" />
                  Issued From
                </label>
                <input
                  type="date"
                  value={filters.issuedDateFrom}
                  onChange={(e) =>
                    handleFilterChange("issuedDateFrom", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Issued Date To */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaCalendarAlt className="text-slate-400" />
                  Issued To
                </label>
                <input
                  type="date"
                  value={filters.issuedDateTo}
                  onChange={(e) =>
                    handleFilterChange("issuedDateTo", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Due Date From */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaCalendarAlt className="text-slate-400" />
                  Due From
                </label>
                <input
                  type="date"
                  value={filters.dueDateFrom}
                  onChange={(e) =>
                    handleFilterChange("dueDateFrom", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Due Date To */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaCalendarAlt className="text-slate-400" />
                  Due To
                </label>
                <input
                  type="date"
                  value={filters.dueDateTo}
                  onChange={(e) =>
                    handleFilterChange("dueDateTo", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Payment Method Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaCreditCard className="text-slate-400" />
                  Payment Method
                </label>
                <select
                  value={filters.paymentMethod}
                  onChange={(e) =>
                    handleFilterChange("paymentMethod", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All methods</option>
                  {paymentMethods.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Invoices Table */}
        <div className="rounded-lg bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Invoice ID
                  </th>
                  <th className="hidden px-3 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase sm:table-cell">
                    Booking ID
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="hidden px-3 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase md:table-cell">
                    Paid Amount
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="hidden px-3 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase lg:table-cell">
                    Issued Date
                  </th>
                  <th className="hidden px-3 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase lg:table-cell">
                    Due Date
                  </th>
                  <th className="hidden px-3 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase xl:table-cell">
                    Payment Method
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {isLoading ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-4">
                      <div className="flex h-40 items-center justify-center">
                        <Spinner />
                      </div>
                    </td>
                  </tr>
                ) : invoices.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-4">
                      <div className="flex flex-col items-center justify-center py-16">
                        <div className="text-lg font-semibold text-gray-400">
                          {hasActiveFilters
                            ? "No invoices match your current filter criteria."
                            : "There are no invoices available at the moment."}
                        </div>
                        {hasActiveFilters && (
                          <button
                            onClick={clearFilters}
                            className="mt-4 font-medium text-blue-500 hover:text-blue-600"
                          >
                            Clear all filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  pageInvoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="px-3 py-4 text-base font-medium whitespace-nowrap text-gray-900">
                        <div className="font-semibold">#{invoice.id}</div>
                      </td>
                      <td className="hidden px-3 py-4 text-base font-semibold whitespace-nowrap text-gray-800 sm:table-cell">
                        {invoice.bookingId}
                      </td>
                      <td className="px-3 py-4 text-base whitespace-nowrap text-gray-800">
                        ${invoice.amount}
                      </td>
                      <td className="hidden px-3 py-4 text-base whitespace-nowrap text-gray-800 md:table-cell">
                        ${invoice.paidAmount}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs leading-5 font-semibold ${
                            statusStyles[invoice.status] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="hidden px-3 py-4 text-base whitespace-nowrap text-gray-800 lg:table-cell">
                        {formatDateTime(invoice.issuedDate)}
                      </td>
                      <td className="hidden px-3 py-4 text-base whitespace-nowrap text-gray-800 lg:table-cell">
                        {formatDateTime(invoice.dueDate)}
                      </td>
                      <td className="hidden px-3 py-4 text-base whitespace-nowrap text-gray-800 xl:table-cell">
                        {invoice.paymentMethod || "_"}
                      </td>
                      <td className="px-3 py-4 text-right text-sm font-medium whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="rounded-full p-2 text-green-600 hover:bg-green-50 hover:text-green-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditModal(invoice);
                            }}
                            title="Edit invoice"
                          >
                            <HiPencil />
                          </button>
                          <button
                            className="rounded-full p-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteInvoice(invoice.id);
                            }}
                            title="Delete invoice"
                          >
                            <HiTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between p-4">
            <p className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                &lt; Previous
              </button>
              <button
                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next &gt;
              </button>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-600">Rows per page:</label>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-700"
              >
                <option value={10}>10</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddInvoiceForm
          onSubmit={handleAddInvoice}
          onClose={() => setIsModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal> */}

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <EditInvoiceForm
          onSubmit={handleEditInvoice}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingInvoice(null);
          }}
          isSubmitting={isSubmitting}
          invoice={editingInvoice}
        />
      </Modal>

      <ConfirmModal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={confirmDeleteInvoice}
        title="Delete invoice"
        message="Are you sure you want to delete this invoice? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variation="danger"
      />
    </>
  );
}

export default Invoices;

import { HiTrash, HiPencil } from "react-icons/hi";
import { useState, useEffect } from "react";
import Button from "../components/Button";
import Modal from "../components/Modal";
import {
  getInvoices,
  deleteInvoice,
  // createInvoice,
  updateInvoice,
} from "../apis/invoicesApi";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
// import AddInvoiceForm from "../components/AddInvoiceForm";
import EditInvoiceForm from "../components/EditInvoiceForm";

const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-700",
  Paid: "bg-green-100 text-green-700",
};

const FilterButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`rounded-md px-4 py-2 text-sm font-medium ${
      active
        ? "bg-blue-500 text-white"
        : "bg-white text-gray-700 hover:bg-gray-50"
    }`}
  >
    {children}
  </button>
);

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setIsLoading(true);
        const data = await getInvoices();
        setInvoices(data.content || []);
      } catch (err) {
        console.error("Error fetching invoices:", err);
        toast.error("Failed to fetch invoices!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // const handleAddInvoice = async (newInvoice) => {
  //   try {
  //     setIsSubmitting(true);
  //     const createdInvoice = await createInvoice(newInvoice);
  //     setInvoices((prevInvoices) => [...prevInvoices, createdInvoice]);
  //     setIsModalOpen(false);
  //     toast.success("Invoice added successfully!");
  //   } catch (err) {
  //     console.error("Error in handleAddInvoice:", err);
  //     toast.error(err.message || "Failed to add invoice!");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleEditInvoice = async (updatedInvoice) => {
    try {
      setIsSubmitting(true);
      const editedInvoice = await updateInvoice(
        editingInvoice.id,
        updatedInvoice,
      );
      setInvoices((prevInvoices) =>
        prevInvoices.map((invoice) =>
          invoice.id === editingInvoice.id ? editedInvoice : invoice,
        ),
      );
      setIsEditModalOpen(false);
      setEditingInvoice(null);
      toast.success("Invoice updated successfully!");
    } catch (err) {
      console.error("Error in handleEditInvoice:", err);
      toast.error(err.message || "Failed to update invoice!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEditModal = (invoice) => {
    setEditingInvoice(invoice);
    setIsEditModalOpen(true);
  };

  const handleDeleteInvoice = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await deleteInvoice(id);
        setInvoices((prevInvoices) =>
          prevInvoices.filter((invoice) => invoice.id !== id),
        );
        toast.success("Invoice deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete invoice!");
        console.log(err);
      }
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const filteredInvoices = invoices.filter((invoice) => {
    if (activeFilter === "All") return true;
    return invoice.status === activeFilter;
  });

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    } catch {
      return "Invalid Date";
    }
  };

  const PER_PAGE = 10;
  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / PER_PAGE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const start = (safePage - 1) * PER_PAGE;
  const end = start + PER_PAGE;
  const pageInvoices = filteredInvoices.slice(start, end);

  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <>
      <div className="mb-8 flex flex-col items-center justify-between sm:flex-row">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Invoices</h2>
          <p className="text-base text-gray-500">
            Manage hotel invoices and payments.
          </p>
        </div>
        <div className="mt-4 flex items-center gap-2 sm:mt-0">
          <div className="flex items-center gap-2 rounded-md bg-gray-100 p-1">
            <FilterButton
              active={activeFilter === "All"}
              onClick={() => handleFilterChange("All")}
            >
              All
            </FilterButton>
            <FilterButton
              active={activeFilter === "Pending"}
              onClick={() => handleFilterChange("Pending")}
            >
              Pending
            </FilterButton>
            <FilterButton
              active={activeFilter === "Paid"}
              onClick={() => handleFilterChange("Paid")}
            >
              Paid
            </FilterButton>
          </div>
          {/* <Button onClick={() => setIsModalOpen(true)}>Add Invoice</Button> */}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-lg bg-white shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Invoice ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Booking ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Paid Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Issued Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Due Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Payment Method
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"></th>
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
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-4">
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="text-lg font-semibold text-gray-400">
                        No invoices found with the selected filters.
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                pageInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 text-base font-medium whitespace-nowrap text-gray-900">
                      <div className="font-semibold">#{invoice.id}</div>
                    </td>
                    <td className="px-6 py-4 text-base font-semibold whitespace-nowrap text-gray-800">
                      {invoice.bookingId}
                    </td>
                    <td className="px-6 py-4 text-base whitespace-nowrap text-gray-800">
                      {invoice.amount}
                    </td>
                    <td className="px-6 py-4 text-base whitespace-nowrap text-gray-800">
                      {invoice.paidAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-base leading-5 font-semibold ${
                          statusStyles[invoice.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-base whitespace-nowrap text-gray-800">
                      {formatDateTime(invoice.issuedDate)}
                    </td>
                    <td className="px-6 py-4 text-base whitespace-nowrap text-gray-800">
                      {formatDateTime(invoice.dueDate)}
                    </td>
                    <td className="px-6 py-4 text-base whitespace-nowrap text-gray-800">
                      {invoice.paymentMethod || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
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

        {/* Pagination */}
        <div className="flex items-center justify-between p-4">
          <p className="text-sm text-gray-500">
            Showing {filteredInvoices.length === 0 ? 0 : start + 1} to{" "}
            {Math.min(end, filteredInvoices.length)} of{" "}
            {filteredInvoices.length} results
          </p>
          <div className="flex items-center gap-2">
            <button
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              onClick={goPrev}
              disabled={safePage === 1}
            >
              &lt; Previous
            </button>
            <button
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              onClick={goNext}
              disabled={safePage === totalPages}
            >
              Next &gt;
            </button>
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
    </>
  );
}

export default Invoices;

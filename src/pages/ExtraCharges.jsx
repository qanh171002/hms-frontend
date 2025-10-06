import { HiTrash, HiPencil } from "react-icons/hi";
import { useState, useEffect } from "react";
import Button from "../components/Button";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import {
  deleteExtraCharge,
  createExtraCharge,
  updateExtraCharge,
  getExtraCharges,
} from "../apis/extraChargesApi";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import AddExtraChargeForm from "../components/AddExtraChargeForm";
import EditExtraChargeForm from "../components/EditExtraChargeForm";
import { usePaginationState } from "../hooks/usePaginationState";

const typeStyles = {
  FOOD: "bg-orange-100 text-orange-700",
  DRINK: "bg-blue-100 text-blue-700",
  SERVICE: "bg-green-100 text-green-700",
};

const FilterButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-shrink-0 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
      active ? "bg-blue-500 text-white" : "text-gray-600 hover:text-gray-800"
    }`}
  >
    {children}
  </button>
);

function ExtraCharges() {
  const { currentPage, setCurrentPage, resetToFirstPage } = usePaginationState(
    "page",
    1,
  );
  const [extraCharges, setExtraCharges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingExtraCharge, setEditingExtraCharge] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const refreshData = async () => {
    try {
      const data = await getExtraCharges(currentPage - 1, pageSize);
      setExtraCharges(data.content || []);
      setTotalPages(data.totalPages);
    } catch (err) {
      toast.error("Failed to fetch extra charges!");
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchExtraCharges = async () => {
      try {
        setIsLoading(true);
        const data = await getExtraCharges(currentPage - 1, pageSize);
        setExtraCharges(data.content || []);
        setTotalPages(data.totalPages);
      } catch (err) {
        toast.error("Failed to fetch extra charges!");
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExtraCharges();
  }, [currentPage, pageSize]);

  const handleAddExtraCharge = async (newExtraCharge) => {
    try {
      setIsSubmitting(true);
      await createExtraCharge(newExtraCharge);
      setIsModalOpen(false);
      toast.success("Extra charge added successfully!");
      // Refresh data
      await refreshData();
    } catch (err) {
      console.error("Error in handleAddExtraCharge:", err);

      let errorMessage = "Failed to add extra charge!";

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

  const handleEditExtraCharge = async (updatedExtraCharge) => {
    try {
      setIsSubmitting(true);
      await updateExtraCharge(editingExtraCharge.id, updatedExtraCharge);
      setIsEditModalOpen(false);
      setEditingExtraCharge(null);
      toast.success("Extra charge updated successfully!");
      // Refresh data
      await refreshData();
    } catch (err) {
      console.error("Error in handleEditExtraCharge:", err);

      let errorMessage = "Failed to update extra charge!";

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

  const handleOpenEditModal = (extraCharge) => {
    setEditingExtraCharge(extraCharge);
    setIsEditModalOpen(true);
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteExtraCharge = async (id) => {
    setConfirmDeleteId(id);
  };
  const confirmDeleteExtraCharge = async () => {
    try {
      const id = confirmDeleteId;
      if (!id) return;
      setIsDeleting(true);
      await deleteExtraCharge(id);
      toast.success("Extra charge deleted successfully!");
      // Refresh data
      await refreshData();
    } catch (err) {
      console.error("Error deleting extra charge:", err);

      let errorMessage = "Failed to delete extra charge!";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setConfirmDeleteId(null);
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const filteredExtraCharges = extraCharges.filter((extraCharge) => {
    if (activeFilter === "All") return true;
    return extraCharge.type === activeFilter;
  });

  const PER_PAGE = 10;
  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="col-span-1 mb-6 flex flex-col justify-center md:col-span-2">
          <h2 className="text-2xl font-bold text-gray-800">Extra Charges</h2>
          <p className="text-base text-gray-500">
            Manage hotel extra charges and services.
          </p>
        </div>
        <div className="col-span-1 flex flex-col gap-2 md:col-span-2 md:flex-row md:items-center md:justify-end">
          <div className="flex items-center gap-2">
            <div className="no-scrollbar flex items-center gap-2 overflow-x-auto rounded-lg bg-gray-100 p-1">
              <FilterButton
                active={activeFilter === "All"}
                onClick={() => handleFilterChange("All")}
              >
                All
              </FilterButton>
              <FilterButton
                active={activeFilter === "FOOD"}
                onClick={() => handleFilterChange("FOOD")}
              >
                Food
              </FilterButton>
              <FilterButton
                active={activeFilter === "DRINK"}
                onClick={() => handleFilterChange("DRINK")}
              >
                Drink
              </FilterButton>
              <FilterButton
                active={activeFilter === "SERVICE"}
                onClick={() => handleFilterChange("SERVICE")}
              >
                Service
              </FilterButton>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="whitespace-nowrap"
            >
              Add Extra Charge
            </Button>
          </div>
        </div>
      </div>

      {/* Extra Charges Table */}
      <div className="col-span-1 rounded-2xl bg-white p-6 md:col-span-4">
        <div className="rounded-lg bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Description
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-3 py-4">
                      <div className="flex h-40 items-center justify-center">
                        <Spinner />
                      </div>
                    </td>
                  </tr>
                ) : filteredExtraCharges.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-3 py-4">
                      <div className="flex flex-col items-center justify-center py-16">
                        <div className="text-lg font-semibold text-gray-400">
                          No extra charges found with the selected filters.
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredExtraCharges.map((extraCharge) => (
                    <tr key={extraCharge.id}>
                      <td className="px-3 py-4 text-base font-medium whitespace-nowrap text-gray-900">
                        <div className="font-semibold">#{extraCharge.id}</div>
                      </td>
                      <td className="px-3 py-4 text-base font-medium whitespace-nowrap text-gray-900">
                        <div className="font-semibold">{extraCharge.name}</div>
                      </td>
                      <td className="px-3 py-4 text-base whitespace-nowrap text-gray-800">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            typeStyles[extraCharge.type] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {extraCharge.type}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-base whitespace-nowrap text-gray-800">
                        {extraCharge.price}
                      </td>
                      <td className="px-3 py-4 text-base text-gray-800">
                        {extraCharge.description || "-"}
                      </td>
                      <td className="px-3 py-4 text-right text-sm font-medium whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="rounded-full p-2 text-green-600 hover:bg-green-50 hover:text-green-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditModal(extraCharge);
                            }}
                            title="Edit extra charge"
                          >
                            <HiPencil />
                          </button>
                          <button
                            className="rounded-full p-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteExtraCharge(extraCharge.id);
                            }}
                            title="Delete extra charge"
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
            <p className="hidden text-sm text-gray-500 md:block">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                onClick={goPrev}
                disabled={currentPage === 1}
              >
                &lt; Previous
              </button>
              <button
                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                onClick={goNext}
                disabled={currentPage === totalPages}
              >
                Next &gt;
              </button>
            </div>
            <div className="hidden items-center gap-4 md:flex">
              <label className="text-sm text-gray-600">Rows per page:</label>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  resetToFirstPage();
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddExtraChargeForm
          onSubmit={handleAddExtraCharge}
          onClose={() => setIsModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <EditExtraChargeForm
          onSubmit={handleEditExtraCharge}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingExtraCharge(null);
          }}
          isSubmitting={isSubmitting}
          extraCharge={editingExtraCharge}
        />
      </Modal>

      <ConfirmModal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={confirmDeleteExtraCharge}
        title="Delete extra charge"
        message="Are you sure you want to delete this extra charge? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variation="danger"
        isConfirming={isDeleting}
        isCancelling={isDeleting}
      />
    </>
  );
}

export default ExtraCharges;

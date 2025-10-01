import { useState, useEffect } from "react";
import {
  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from "../apis/promotionApi";
import { HiPencil, HiTrash } from "react-icons/hi";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import AddPromotionForm from "../components/AddPromotionForm";
import EditPromotionForm from "../components/EditPromotionForm";
import Spinner from "../components/Spinner";
import Button from "../components/Button";
import toast from "react-hot-toast";

function Promotions() {
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setIsLoading(true);
        const data = await getPromotions(currentPage - 1, pageSize);
        setPromotions(data.content || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Error fetching promotions:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromotions();
  }, [currentPage, pageSize]);

  const PER_PAGE = 10;
  const pagePromotions = promotions;

  const handleAddPromotion = async (newPromo) => {
    try {
      setIsSubmitting(true);
      const created = await createPromotion(newPromo);
      setPromotions((prev) => [...prev, created]);
      setIsModalOpen(false);
      toast.success("Promotion created successfully!");
    } catch (err) {
      console.error("Error creating promotion:", err);
      toast.error("Failed to create promotion!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPromotion = async (updatedPromo) => {
    try {
      setIsSubmitting(true);
      const updated = await updatePromotion(updatedPromo.id, updatedPromo);
      setPromotions((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p)),
      );
      setIsEditModalOpen(false);
      setEditingPromotion(null);
      toast.success("Promotion updated successfully!");
    } catch (err) {
      console.error("Error updating promotion:", err);
      toast.error("Failed to update promotion!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePromotion = async (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDeletePromotion = async () => {
    try {
      const id = confirmDeleteId;
      if (!id) return;
      setIsDeleting(true);
      await deletePromotion(id);
      setPromotions((prev) => prev.filter((p) => p.id !== id));
      toast.success("Promotion deleted successfully!");
    } catch (err) {
      console.error("Error deleting promotion:", err);
      toast.error("Failed to delete promotion!");
    } finally {
      setIsDeleting(false);
      setConfirmDeleteId(null);
    }
  };

  const handleOpenEditModal = (promo) => {
    setEditingPromotion(promo);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-2 mb-6 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800">Promotions</h2>
          <p className="text-base text-gray-500">
            Manage hotel promotions and discounts.
          </p>
        </div>
        <div className="col-span-2 flex items-center justify-end gap-2">
          <Button onClick={() => setIsModalOpen(true)}>Add Promotion</Button>
        </div>
      </div>

      <div className="col-span-4 rounded-2xl bg-white p-6 shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Discount (%)
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Start Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  End Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4">
                    <div className="flex h-40 items-center justify-center">
                      <Spinner />
                    </div>
                  </td>
                </tr>
              ) : promotions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4">
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="text-lg font-semibold text-gray-400">
                        There are no promotions available at the moment.
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                pagePromotions.map((promo) => (
                  <tr key={promo.id}>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      #{promo.id}
                    </td>
                    <td className="px-6 py-4 text-gray-800">{promo.name}</td>
                    <td className="px-6 py-4 text-gray-800">
                      {promo.discountPercent}%
                    </td>
                    <td className="px-6 py-4 text-gray-800">
                      {promo.startDate}
                    </td>
                    <td className="px-6 py-4 text-gray-800">{promo.endDate}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="rounded-full p-2 text-green-600 hover:bg-green-50 hover:text-green-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditModal(promo);
                          }}
                          title="Edit promotion"
                        >
                          <HiPencil />
                        </button>
                        <button
                          className="rounded-full p-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePromotion(promo.id);
                          }}
                          title="Delete promotion"
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
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-md border px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              &lt; Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-md border px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
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
              className="rounded-md border px-2 py-1 text-sm text-gray-700"
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Modal: Add Promotion */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddPromotionForm
          onSubmit={handleAddPromotion}
          onClose={() => setIsModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Modal: Edit Promotion */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <EditPromotionForm
          onSubmit={handleEditPromotion}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingPromotion(null);
          }}
          isSubmitting={isSubmitting}
          promotion={editingPromotion}
        />
      </Modal>

      <ConfirmModal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={confirmDeletePromotion}
        title="Delete promotion"
        message="Are you sure you want to delete this promotion? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variation="danger"
        isConfirming={isDeleting}
        isCancelling={isDeleting}
      />
    </>
  );
}

export default Promotions;

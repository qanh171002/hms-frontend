import { useState, useEffect } from "react";
import {
  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from "../apis/promotionApi";
import { HiPencil, HiTrash } from "react-icons/hi";
import Modal from "../components/Modal";
import AddPromotionForm from "../components/AddPromotionForm";
import EditPromotionForm from "../components/EditPromotionForm";
import Spinner from "../components/Spinner";
import Button from "../components/Button";

function Promotions() {
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setIsLoading(true);
        const data = await getPromotions();
        setPromotions(data.content || []);
      } catch (err) {
        console.error("Error fetching promotions:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  const PER_PAGE = 10;
  const totalPages = Math.max(1, Math.ceil(promotions.length / PER_PAGE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const start = (safePage - 1) * PER_PAGE;
  const end = start + PER_PAGE;
  const pagePromotions = promotions.slice(start, end);

  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  const handleAddPromotion = async (newPromo) => {
    try {
      setIsSubmitting(true);
      const created = await createPromotion(newPromo);
      setPromotions((prev) => [...prev, created]);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error creating promotion:", err);
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
    } catch (err) {
      console.error("Error updating promotion:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePromotion = async (id) => {
    if (window.confirm("Are you sure you want to delete this promotion?")) {
      try {
        await deletePromotion(id);
        setPromotions((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        console.error("Error deleting promotion:", err);
      }
    }
  };

  const handleOpenEditModal = (promo) => {
    setEditingPromotion(promo);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div className="mb-8 flex flex-col items-center justify-between sm:flex-row">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Promotions</h2>
          <p className="text-base text-gray-500">
            Manage hotel promotions and discounts.
          </p>
        </div>
        <div className="mt-4 flex items-center gap-2 sm:mt-0">
          <Button onClick={() => setIsModalOpen(true)}>Add Promotion</Button>
        </div>
      </div>

      <div className="rounded-lg bg-white shadow-md">
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
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No promotions found.
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
            Showing {promotions.length === 0 ? 0 : start + 1} to{" "}
            {Math.min(end, promotions.length)} of {promotions.length} results
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
    </>
  );
}

export default Promotions;

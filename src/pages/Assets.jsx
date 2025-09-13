import { HiDotsVertical, HiTrash, HiPencil } from "react-icons/hi";
import { useState, useEffect } from "react";
import Button from "../components/Button";
import Modal from "../components/Modal";
import {
  getAssets,
  deleteAsset,
  createAsset,
  updateAsset,
} from "../apis/assetsApi";
import { FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import AddAssetForm from "../components/AddAssetForm";
import EditAssetForm from "../components/EditAssetForm";

const conditionStyles = {
  Good: "bg-green-100 text-green-700",
  Fair: "bg-yellow-100 text-yellow-700",
  Poor: "bg-red-100 text-red-700",
  Excellent: "bg-blue-100 text-blue-700",
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

function Assets() {
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setIsLoading(true);
        const data = await getAssets();
        setAssets(data.content || []);
      } catch (err) {
        console.error("Error fetching assets:", err);
        toast.error("Failed to fetch assets!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, []);

  const handleAddAsset = async (newAsset) => {
    try {
      setIsSubmitting(true);
      const createdAsset = await createAsset(newAsset);
      setAssets((prevAssets) => [...prevAssets, createdAsset]);
      setIsModalOpen(false);
      toast.success("Asset added successfully!");
    } catch (err) {
      console.error("Error in handleAddAsset:", err);
      toast.error(err.message || "Failed to add asset!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditAsset = async (updatedAsset) => {
    try {
      setIsSubmitting(true);
      const editedAsset = await updateAsset(editingAsset.id, updatedAsset);
      setAssets((prevAssets) =>
        prevAssets.map((asset) =>
          asset.id === editingAsset.id ? editedAsset : asset,
        ),
      );
      setIsEditModalOpen(false);
      setEditingAsset(null);
      toast.success("Asset updated successfully!");
    } catch (err) {
      console.error("Error in handleEditAsset:", err);
      toast.error(err.message || "Failed to update asset!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEditModal = (asset) => {
    setEditingAsset(asset);
    setIsEditModalOpen(true);
  };

  const handleDeleteAsset = async (id) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      try {
        await deleteAsset(id);
        setAssets((prevAssets) =>
          prevAssets.filter((asset) => asset.id !== id),
        );
        toast.success("Asset deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete asset!");
        console.log(err);
      }
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const filteredAssets = assets.filter((asset) => {
    if (activeFilter === "All") return true;
    return asset.condition === activeFilter;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    } catch {
      return "Invalid Date";
    }
  };

  const PER_PAGE = 10;
  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / PER_PAGE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const start = (safePage - 1) * PER_PAGE;
  const end = start + PER_PAGE;
  const pageAssets = filteredAssets.slice(start, end);

  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <>
      <div className="mb-8 flex flex-col items-center justify-between sm:flex-row">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Hotel Assets</h2>
          <p className="text-base text-gray-500">
            Manage and track hotel assets and inventory.
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
              active={activeFilter === "Excellent"}
              onClick={() => handleFilterChange("Excellent")}
            >
              Excellent
            </FilterButton>
            <FilterButton
              active={activeFilter === "Good"}
              onClick={() => handleFilterChange("Good")}
            >
              Good
            </FilterButton>
            <FilterButton
              active={activeFilter === "Fair"}
              onClick={() => handleFilterChange("Fair")}
            >
              Fair
            </FilterButton>
            <FilterButton
              active={activeFilter === "Poor"}
              onClick={() => handleFilterChange("Poor")}
            >
              Poor
            </FilterButton>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>Add Asset</Button>
        </div>
      </div>

      {/* Assets Table */}
      <div className="rounded-lg bg-white shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Asset ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Room Number
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Condition
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Original Cost
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Purchase Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Note
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
              ) : filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-4">
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="text-lg font-semibold text-gray-400">
                        No assets found with the selected filters.
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                pageAssets.map((asset) => (
                  <tr key={asset.id}>
                    <td className="px-6 py-4 text-base font-medium whitespace-nowrap text-gray-900">
                      <div className="font-semibold">#{asset.id}</div>
                    </td>
                    <td className="px-6 py-4 text-base font-medium whitespace-nowrap text-gray-900">
                      <div className="font-semibold">{asset.name}</div>
                    </td>
                    <td className="px-6 py-4 text-base whitespace-nowrap text-gray-800">
                      {asset.category}
                    </td>
                    <td className="px-6 py-4 text-base font-semibold whitespace-nowrap text-gray-800">
                      {asset.roomNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-base leading-5 font-semibold ${
                          conditionStyles[asset.condition] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {asset.condition}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-base whitespace-nowrap text-gray-800">
                      {asset.originalCost}
                    </td>
                    <td className="px-6 py-4 text-base whitespace-nowrap text-gray-800">
                      {formatDate(asset.purchaseDate)}
                    </td>
                    <td className="px-6 py-4 text-base text-gray-800">
                      <div className="max-w-xs truncate" title={asset.note}>
                        {asset.note || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="rounded-full p-2 text-green-600 hover:bg-green-50 hover:text-green-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditModal(asset);
                          }}
                          title="Edit asset"
                        >
                          <HiPencil />
                        </button>
                        <button
                          className="rounded-full p-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAsset(asset.id);
                          }}
                          title="Delete asset"
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
            Showing {filteredAssets.length === 0 ? 0 : start + 1} to{" "}
            {Math.min(end, filteredAssets.length)} of {filteredAssets.length}{" "}
            results
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddAssetForm
          onSubmit={handleAddAsset}
          onClose={() => setIsModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <EditAssetForm
          onSubmit={handleEditAsset}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingAsset(null);
          }}
          isSubmitting={isSubmitting}
          asset={editingAsset}
        />
      </Modal>
    </>
  );
}

export default Assets;

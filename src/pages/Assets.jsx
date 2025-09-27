import { HiDotsVertical, HiTrash, HiPencil } from "react-icons/hi";
import {
  FaFilter,
  FaSearch,
  FaTag,
  FaDollarSign,
  FaCalendarAlt,
  FaBed,
} from "react-icons/fa";
import { useState, useEffect, useCallback } from "react";
import Button from "../components/Button";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import {
  getAssets,
  deleteAsset,
  createAsset,
  updateAsset,
  searchAssets,
} from "../apis/assetsApi";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import AddAssetForm from "../components/AddAssetForm";
import EditAssetForm from "../components/EditAssetForm";
import { FaX } from "react-icons/fa6";

const conditionStyles = {
  GOOD: "bg-green-100 text-green-700",
  FAIR: "bg-yellow-100 text-yellow-700",
  POOR: "bg-red-100 text-red-700",
  EXCELLENT: "bg-blue-100 text-blue-700",
};

const conditionOptions = ["EXCELLENT", "GOOD", "FAIR", "POOR"];

function Assets() {
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    category: "",
    condition: "",
    minCost: "",
    maxCost: "",
    purchaseDateFrom: "",
    purchaseDateTo: "",
    roomNumber: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filterTimeout, setFilterTimeout] = useState(null);

  const getActiveFilterCount = () => {
    return Object.values(filters).filter((value) => value !== "").length;
  };

  const applyFilters = useCallback(async () => {
    try {
      setIsFiltering(true);

      // Check if any filter has a meaningful value
      const hasActiveFilters = Object.entries(filters).some(([, value]) => {
        if (value === null || value === undefined) return false;
        if (typeof value === "string") return value.trim() !== "";
        return value !== "";
      });

      console.log("Current filters:", filters);
      console.log("Has active filters:", hasActiveFilters);

      let data;
      if (hasActiveFilters) {
        console.log("Using searchAssets API");
        data = await searchAssets(filters, currentPage - 1, pageSize);
      } else {
        console.log("Using getAssets API");
        data = await getAssets(currentPage - 1, pageSize);
      }

      console.log("API response:", data);

      const sorted = [...(data.content || [])].sort(
        (a, b) => (a.id || 0) - (b.id || 0),
      );

      setAssets(sorted);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error filtering assets:", err);
      toast.error("Failed to filter assets");
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

  // Initial fetch when component mounts
  useEffect(() => {
    const fetchInitialAssets = async () => {
      try {
        setIsLoading(true);
        const data = await getAssets(currentPage - 1, pageSize);
        const sorted = [...(data.content || [])].sort(
          (a, b) => (a.id || 0) - (b.id || 0),
        );
        setAssets(sorted);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Error fetching assets:", err);
        toast.error("Failed to fetch assets!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialAssets();
  }, [currentPage, pageSize]);

  const handleAddAsset = async (newAsset) => {
    try {
      setIsSubmitting(true);
      const createdAsset = await createAsset(newAsset);
      setAssets((prevAssets) =>
        [...prevAssets, createdAsset].sort((a, b) => (a.id || 0) - (b.id || 0)),
      );
      setIsModalOpen(false);
      toast.success("Asset added successfully!");
    } catch (err) {
      console.error("Error in handleAddAsset:", err);

      let errorMessage = "Failed to add asset!";

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

  const handleEditAsset = async (updatedAsset) => {
    try {
      setIsSubmitting(true);
      const editedAsset = await updateAsset(editingAsset.id, updatedAsset);
      setAssets((prevAssets) =>
        prevAssets
          .map((asset) => (asset.id === editingAsset.id ? editedAsset : asset))
          .sort((a, b) => (a.id || 0) - (b.id || 0)),
      );
      setIsEditModalOpen(false);
      setEditingAsset(null);
      toast.success("Asset updated successfully!");
    } catch (err) {
      console.error("Error in handleEditAsset:", err);

      let errorMessage = "Failed to update asset!";

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

  const handleOpenEditModal = (asset) => {
    setEditingAsset(asset);
    setIsEditModalOpen(true);
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteAsset = async (id) => {
    setConfirmDeleteId(id);
  };
  const confirmDeleteAsset = async () => {
    try {
      const id = confirmDeleteId;
      if (!id) return;
      setIsDeleting(true);
      await deleteAsset(id);
      setAssets((prevAssets) => prevAssets.filter((asset) => asset.id !== id));
      toast.success("Asset deleted successfully!");
    } catch (err) {
      console.error("Error deleting asset:", err);

      let errorMessage = "Failed to delete asset!";

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

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      category: "",
      condition: "",
      minCost: "",
      maxCost: "",
      purchaseDateFrom: "",
      purchaseDateTo: "",
      roomNumber: "",
    });
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  const formatDate = (dateString) => {
    if (!dateString) return "_";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    } catch {
      return "Invalid Date";
    }
  };

  const PER_PAGE = 10;

  return (
    <>
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-2 mb-6 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800">Hotel Assets</h2>
          <p className="text-base text-gray-500">
            Manage and track hotel assets and inventory.
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
          <Button onClick={() => setIsModalOpen(true)} variation="primary">
            Add Asset
          </Button>
        </div>
      </div>

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
              {/* Asset Name Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaTag className="text-slate-400" />
                  Asset Name
                </label>
                <input
                  type="text"
                  placeholder="Enter asset name"
                  value={filters.name}
                  onChange={(e) => handleFilterChange("name", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaTag className="text-slate-400" />
                  Category
                </label>
                <input
                  type="text"
                  placeholder="Enter category"
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Condition Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaTag className="text-slate-400" />
                  Condition
                </label>
                <select
                  value={filters.condition}
                  onChange={(e) =>
                    handleFilterChange("condition", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">All conditions</option>
                  {conditionOptions.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
              </div>

              {/* Room Number Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaBed className="text-slate-400" />
                  Room Number
                </label>
                <input
                  type="number"
                  placeholder="Enter room number"
                  value={filters.roomNumber}
                  onChange={(e) =>
                    handleFilterChange("roomNumber", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Min Cost Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaDollarSign className="text-slate-400" />
                  Min Cost
                </label>
                <input
                  type="number"
                  placeholder="Min cost"
                  value={filters.minCost}
                  onChange={(e) =>
                    handleFilterChange("minCost", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Max Cost Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaDollarSign className="text-slate-400" />
                  Max Cost
                </label>
                <input
                  type="number"
                  placeholder="Max cost"
                  value={filters.maxCost}
                  onChange={(e) =>
                    handleFilterChange("maxCost", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Purchase Date From */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaCalendarAlt className="text-slate-400" />
                  Purchase Date From
                </label>
                <input
                  type="date"
                  value={filters.purchaseDateFrom}
                  onChange={(e) =>
                    handleFilterChange("purchaseDateFrom", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Purchase Date To */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaCalendarAlt className="text-slate-400" />
                  Purchase Date To
                </label>
                <input
                  type="date"
                  value={filters.purchaseDateTo}
                  onChange={(e) =>
                    handleFilterChange("purchaseDateTo", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Asset ID
                </th>
                <th className="px-3 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Name
                </th>
                <th className="hidden px-3 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase sm:table-cell">
                  Category
                </th>
                <th className="hidden px-3 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase md:table-cell">
                  Room Number
                </th>
                <th className="px-3 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Condition
                </th>
                <th className="hidden px-3 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase lg:table-cell">
                  Original Cost
                </th>
                <th className="hidden px-3 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase xl:table-cell">
                  Purchase Date
                </th>
                <th className="hidden px-3 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase xl:table-cell">
                  Note
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
              ) : assets.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-4">
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="text-lg font-semibold text-gray-400">
                        {hasActiveFilters
                          ? "No assets match your current filter criteria."
                          : "There are no assets available at the moment."}
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
                assets.map((asset) => (
                  <tr key={asset.id}>
                    <td className="px-3 py-4 text-base font-medium whitespace-nowrap text-gray-900">
                      <div className="font-semibold">#{asset.id}</div>
                    </td>
                    <td className="px-3 py-4 text-base font-medium whitespace-nowrap text-gray-900">
                      <div className="font-semibold">{asset.name}</div>
                    </td>
                    <td className="hidden px-3 py-4 text-base whitespace-nowrap text-gray-800 sm:table-cell">
                      {asset.category}
                    </td>
                    <td className="hidden px-3 py-4 text-base font-semibold whitespace-nowrap text-gray-800 md:table-cell">
                      {asset.roomNumber}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs leading-5 font-semibold ${
                          conditionStyles[asset.condition] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {asset.condition}
                      </span>
                    </td>
                    <td className="hidden px-3 py-4 text-base whitespace-nowrap text-gray-800 lg:table-cell">
                      ${asset.originalCost}
                    </td>
                    <td className="hidden px-3 py-4 text-base whitespace-nowrap text-gray-800 xl:table-cell">
                      {formatDate(asset.purchaseDate)}
                    </td>
                    <td className="hidden px-3 py-4 text-base text-gray-800 xl:table-cell">
                      <div className="max-w-xs truncate" title={asset.note}>
                        {asset.note || "_"}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-right text-sm font-medium whitespace-nowrap">
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
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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

      <ConfirmModal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={confirmDeleteAsset}
        title="Delete asset"
        message="Are you sure you want to delete this asset? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variation="danger"
        isConfirming={isDeleting}
        isCancelling={isDeleting}
      />
    </>
  );
}

export default Assets;

import { useState } from "react";
import Button from "./Button";
import SpinnerMini from "./SpinnerMini";

function AddAssetForm({ onSubmit, isSubmitting, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    condition: "Good",
    originalCost: "",
    purchaseDate: "",
    note: "",
    roomNumber: "",
  });

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiAsset = {
      name: formData.name.trim(),
      category: formData.category.trim(),
      condition: formData.condition,
      originalCost: Number(formData.originalCost),
      purchaseDate: formData.purchaseDate,
      note: formData.note.trim(),
      roomNumber: Number(formData.roomNumber),
    };

    if (onSubmit) {
      onSubmit(apiAsset);
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
      <h2 className="mb-6 text-xl font-semibold text-gray-800">
        Add New Asset
      </h2>
      <div className="grid grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Asset Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Asset name"
              className={inputClass}
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={inputClass}
              required
              disabled={isSubmitting}
            >
              <option value="">Choose category</option>
              <option value="Furniture">Furniture</option>
              <option value="Electronics">Electronics</option>
              <option value="Appliances">Appliances</option>
              <option value="Bedding">Bedding</option>
              <option value="Bathroom">Bathroom</option>
              <option value="Kitchen">Kitchen</option>
              <option value="Decoration">Decoration</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Condition
            </label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className={inputClass}
              required
              disabled={isSubmitting}
            >
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Room Number
            </label>
            <input
              type="number"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              placeholder="Room number"
              className={inputClass}
              min="1"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Original Cost
            </label>
            <input
              type="number"
              name="originalCost"
              value={formData.originalCost}
              onChange={handleChange}
              placeholder="Original cost"
              className={inputClass}
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Purchase Date
            </label>
            <input
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleChange}
              className={inputClass}
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Note
            </label>
            <textarea
              name="note"
              value={formData.note}
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
          {isSubmitting ? <SpinnerMini /> : "Add Asset"}
        </Button>
      </div>
    </form>
  );
}

export default AddAssetForm;

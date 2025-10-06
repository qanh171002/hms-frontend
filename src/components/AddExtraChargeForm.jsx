import { useState } from "react";
import Button from "./Button";
import SpinnerMini from "./SpinnerMini";

function AddExtraChargeForm({ onSubmit, isSubmitting, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "FOOD",
    price: "",
    description: "",
  });

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none";

  const typeOptions = ["FOOD", "DRINK", "SERVICE"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiExtraCharge = {
      name: formData.name.trim(),
      type: formData.type,
      price: parseFloat(formData.price),
      description: formData.description.trim(),
    };

    if (onSubmit) {
      onSubmit(apiExtraCharge);
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
        Add New Extra Charge
      </h2>
      <div className="grid grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Service name"
              className={inputClass}
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={inputClass}
              required
              disabled={isSubmitting}
            >
              {typeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className={inputClass}
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Service description (optional)"
              rows={3}
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
          {isSubmitting ? <SpinnerMini /> : "Add Extra Charge"}
        </Button>
      </div>
    </form>
  );
}

export default AddExtraChargeForm;

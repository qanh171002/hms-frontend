function Button({ variation = "primary", children, onClick, className }) {
  const baseStyles =
    "rounded-md px-4 py-2 text-sm font-medium transition duration-200 ease-in-out focus:outline-none";

  const variationStyles = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    tertiary: "bg-white text-gray-700 hover:bg-gray-50",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  const currentVariation = variationStyles[variation];

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${currentVariation} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;

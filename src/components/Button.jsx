function Button({
  variation = "primary",
  size = "medium",
  children,
  onClick,
  className,
  ...props
}) {
  const baseStyles =
    "rounded-md transition duration-200 ease-in-out focus:outline-none";

  const sizeStyles = {
    small: "text-sm px-2 py-1 font-semibold uppercase text-center",
    medium: "text-base px-4 py-3 font-medium",
    large: "text-lg px-6 py-3 font-medium",
  };

  const variationStyles = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    tertiary:
      "bg-white text-slate-700 hover:bg-slate-50 border border-slate-300",
    danger: "bg-red-700 text-white hover:bg-red-800",
  };

  const currentVariation = variationStyles[variation];
  const currentSize = sizeStyles[size];

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${currentVariation} ${currentSize} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;

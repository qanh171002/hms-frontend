function Modal({ isOpen, onClose, children, size = "md", className = "" }) {
  if (!isOpen) return null;

  const sizeClass =
    size === "sm"
      ? "max-w-sm"
      : size === "md"
        ? "max-w-md"
        : size === "lg"
          ? "max-w-lg"
          : size === "xl"
            ? "max-w-2xl"
            : size === "2xl"
              ? "max-w-4xl"
              : size === "full"
                ? "max-w-[95vw]"
                : typeof size === "string"
                  ? size
                  : "max-w-md";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Modal content */}
      <div
        className={`relative z-50 mx-auto w-full rounded-lg bg-white px-8 pt-6 pb-8 shadow-xl ${sizeClass} ${className}`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;

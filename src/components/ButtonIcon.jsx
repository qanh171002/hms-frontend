function ButtonIcon({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-3 py-2 text-sm font-medium text-gray-600 transition duration-200 ease-in-out hover:bg-gray-100"
    >
      {children}
    </button>
  );
}

export default ButtonIcon;

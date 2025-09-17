function Stat({
  title,
  value,
  percentage,
  icon,
  color = "bg-blue-100",
  isGradient = false,
}) {
  return (
    <div
      className={`shadow-even col-span-1 flex flex-col gap-6 rounded-lg ${
        isGradient ? "bg-gradient-to-r from-blue-500 to-blue-400" : "bg-white"
      } p-6 text-center`}
    >
      <div className="flex justify-between">
        <div className="flex flex-col gap-2 text-left">
          <p
            className={`text-sm font-medium ${isGradient ? "text-gray-100" : "text-gray-500"}`}
          >
            {title}
          </p>
          <p
            className={`text-3xl font-semibold ${isGradient ? "text-white" : " "}`}
          >
            {value}
          </p>
        </div>
        <div
          className={`${color} flex h-12 w-12 items-center justify-center rounded-full`}
        >
          {icon}
        </div>
      </div>
      {isGradient ? (
        <div
          className={`rounded-lg bg-white px-2 py-3 text-left text-sm font-medium ${
            percentage >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {percentage >= 0 ? "+" : "-"} {Math.abs(percentage)}% from last week
        </div>
      ) : (
        <div
          className={`px-2 py-3 text-left text-sm font-medium ${
            percentage >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {percentage >= 0 ? "+" : "-"} {Math.abs(percentage)}% from last week
        </div>
      )}
    </div>
  );
}

export default Stat;

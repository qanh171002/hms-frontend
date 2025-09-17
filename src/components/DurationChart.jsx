import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function DurationChart() {
  const data = [
    {
      duration: "1-3 night",
      value: 10,
      color: "#a0c9f8",
    },
    {
      duration: "4-7 nights",
      value: 20,
      color: "#75b3ff",
    },
    {
      duration: "8-15 nights",
      value: 15,
      color: "#4e8cf1",
    },
    {
      duration: "15-21 nights",
      value: 25,
      color: "#2e68e7",
    },
    {
      duration: "21+ nights",
      value: 10,
      color: "#1d4ed8",
    },
  ];

  return (
    <div className="shadow-even col-span-2 rounded-lg bg-white p-6">
      <h1 className="mb-4 text-xl font-semibold">Stay Duration Overview</h1>

      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            nameKey="duration"
            dataKey="value"
            innerRadius={80}
            outerRadius={110}
            cx="40%"
            cy="50%"
            paddingAngle={3}
          >
            {data.map((entry) => (
              <Cell
                fill={entry.color}
                stroke={entry.color}
                key={entry.duration}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            verticalAlign="middle"
            align="right"
            width="30%"
            layout="vertical"
            iconSize={15}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DurationChart;

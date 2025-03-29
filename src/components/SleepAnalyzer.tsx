import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Hardcoded sleep data (Simulating daily sleep hours)
const hardcodedSleepData = [
  { day: "Monday", hours: 7.5 },
  { day: "Tuesday", hours: 6.8 },
  { day: "Wednesday", hours: 8 },
  { day: "Thursday", hours: 7 },
  { day: "Friday", hours: 6.5 },
  { day: "Saturday", hours: 9 },
  { day: "Sunday", hours: 8.2 }
];

export default function SleepAnalyzer() {
  const [sleepData, setSleepData] = useState<{ day: string; hours: number }[]>([]);

  useEffect(() => {
    // Load from localStorage or use hardcoded values
    const storedData = localStorage.getItem("sleepData");
    if (storedData) {
      setSleepData(JSON.parse(storedData));
    } else {
      setSleepData(hardcodedSleepData);
      localStorage.setItem("sleepData", JSON.stringify(hardcodedSleepData));
    }
  }, []);

  // Calculate total & average sleep
  const totalSleep = sleepData.reduce((sum, item) => sum + item.hours, 0);
  const avgSleep = (totalSleep / sleepData.length).toFixed(1);

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Sleep Cycle Analyzer</h2>
      <p className="text-gray-600">Total Sleep: {totalSleep} hrs | Avg: {avgSleep} hrs/night</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={sleepData}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="hours" fill="#4F46E5" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

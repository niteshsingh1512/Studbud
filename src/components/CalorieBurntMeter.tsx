import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Flame } from "lucide-react";

const hardcodedHistory = [
  { time: "08:00 AM", calories: 319 },
  { time: "10:00 AM", calories: 621 },
  { time: "12:00 PM", calories: 970 },
  { time: "02:00 PM", calories: 1234 },
  { time: "04:00 PM", calories: 1543},
  { time: "06:00 PM", calories: 1743},
  { time: "08:00 PM", calories: 1913},
];

const generateRandomCalories = () => Math.floor(Math.random() * (50 - 20 + 1)) + 20;


const CalorieBurnMeter = () => {
  const [caloriesBurnt, setCaloriesBurnt] = useState(generateRandomCalories());
  const [calorieHistory, setCalorieHistory] = useState(() => {
    return JSON.parse(localStorage.getItem("calorieHistory") || "[]") || hardcodedHistory;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const newCalories = generateRandomCalories();
      setCaloriesBurnt(newCalories);

      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      setCalorieHistory((prev) => {
        const updatedHistory = [...prev.slice(-9), { time: timeString, calories: newCalories }];
        localStorage.setItem("calorieHistory", JSON.stringify(updatedHistory));
        return updatedHistory;
      });
    }, 10 * 60 * 1000); // Every 10 minutes

    return () => clearInterval(interval);
  }, []);
  const getCalories = 2134;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Calorie Burn Meter</h2>
        <Flame className="text-red-500" />
      </div>
      
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-gray-700">Calories Burnt:</span>
        <span className="text-2xl font-bold text-red-500">{getCalories} kcal</span>
      </div>
      
      <div className="w-full h-4 bg-gray-200 rounded-full mb-4 overflow-hidden">
        <div className="h-full bg-red-500 rounded-full" style={{ width: `${(caloriesBurnt / 500) * 100}%` }}></div>
      </div>

      {calorieHistory.length > 1 && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-medium text-gray-700 mb-2">Calorie Burn History</h3>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={calorieHistory}>
              <XAxis dataKey="time" stroke="#888" />
              <YAxis domain={[0, 600]} />
              <Tooltip />
              <Line type="monotone" dataKey="calories" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default CalorieBurnMeter;

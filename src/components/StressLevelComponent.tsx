import React, { useState, useEffect } from "react";
import { AlertCircle, Smile, Frown, Meh } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const generateRandomBPM = () => Math.floor(Math.random() * (85 - 58 + 1)) + 58;

const StressLevelComponent: React.FC = () => {
  const [bpm, setBpm] = useState(generateRandomBPM());
  const [bpmHistory, setBpmHistory] = useState<{ time: string; bpm: number }[]>(() => {
    const savedHistory = localStorage.getItem("bpmHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const newBpm = generateRandomBPM();
  //     setBpm(newBpm);

  //     const now = new Date();
  //     const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  //     setBpmHistory((prev) => {
  //       const updatedHistory = [...prev.slice(-9), { time: timeString, bpm: newBpm }];
  //       localStorage.setItem("bpmHistory", JSON.stringify(updatedHistory));
  //       return updatedHistory;
  //     });
  //   }, 10 * 60 * 1000);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Heart Rate</h2>
        {bpm >= 62 ? <Smile className="text-green-500" /> : bpm >= 60 ? <Meh className="text-amber-500" /> : <Frown className="text-red-500" />}
      </div>

      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-gray-700">Current BPM:</span>
        <span className={`text-2xl font-bold ${bpm >= 62 ? "text-green-500" : bpm >= 60 ? "text-amber-500" : "text-red-500"}`}>{bpm} BPM</span>
      </div>

      {bpmHistory.length > 1 && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-medium text-gray-700 mb-2">Heart BPM History</h3>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={bpmHistory}>
              <XAxis dataKey="time" stroke="#888" />
              <YAxis domain={[55, 90]} />
              <Tooltip />
              <Line type="monotone" dataKey="bpm" stroke="#4ade80" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default StressLevelComponent;
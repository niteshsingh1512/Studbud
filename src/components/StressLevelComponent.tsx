import React, { useState, useEffect } from "react";
import { AlertCircle, Smile, Frown, Meh, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import GoogleFit from "./GoogleFitApi";

const generateRandomBPM = () => Math.floor(Math.random() * (85 - 58 + 1)) + 58;

const StressLevelComponent: React.FC = () => {
  const [bpm, setBpm] = useState(generateRandomBPM());
  const [bpmHistory, setBpmHistory] = useState<{ time: string; bpm: number }[]>([]);


  <GoogleFit/>
  // Function to update BPM every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const newBpm = generateRandomBPM();
      setBpm(newBpm);

      // Log history with timestamp
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      setBpmHistory((prev) => [
        ...prev.slice(-9), // Keep only the last 10 records
        { time: timeString, bpm: newBpm }
      ]);
    }, 10 * 60 *1000); // 10 minutes in milliseconds

    return () => clearInterval(interval);
  }, []);

  // Determine category and colors
  const getBpmCategory = (bpm: number) => {
    if (bpm >= 62 && bpm <= 85) return "Good";
    if (bpm >= 60 && bpm < 62) return "Moderate";
    return "High";
  };

  const getBpmIcon = (bpm: number) => {
    if (bpm >= 62 && bpm <= 85) return <Smile className="text-green-500" />;
    if (bpm >= 60 && bpm < 62) return <Meh className="text-amber-500" />;
    return <Frown className="text-red-500" />;
  };

  const getBpmColor = (bpm: number) => {
    if (bpm >= 62 && bpm <= 85) return "text-green-500";
    if (bpm >= 60 && bpm < 62) return "text-amber-500";
    return "text-red-500";
  };

  const getProgressColor = (bpm: number) => {
    if (bpm >= 62 && bpm <= 85) return "bg-green-500";
    if (bpm >= 60 && bpm < 62) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Heart Rate</h2>
          <p className="text-gray-500 text-sm">Monitoring BPM</p>
        </div>
        {getBpmIcon(bpm)}
      </div>

      {/* Current BPM */}
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-gray-700">Current BPM:</span>
        <div className="flex items-center gap-2">
          <span className={`text-2xl font-bold ${getBpmColor(bpm)}`}>{bpm} BPM</span>
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${getBpmColor(bpm)} bg-opacity-10`}>
            {getBpmCategory(bpm)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      {/* Progress Bar */}
      <div className="w-full h-4 bg-gray-200 rounded-full mb-4 overflow-hidden">
        <div
          className={`h-full rounded-full ${getProgressColor(bpm)}`}
          style={{ width: `${((bpm - 58) / (90 - 58)) * 100}%`, transition: "width 0.3s ease" }}
        ></div>
      </div>


      {/* Message */}
      <div className={`p-3 rounded-lg mb-4 ${getBpmColor(bpm)} bg-opacity-10`}>
        <p className={`font-medium ${getBpmColor(bpm)} flex items-center gap-2`}>
          <AlertCircle size={16} />
          {bpm >= 62 && bpm <= 80
            ? "Your heart rate is in a healthy range!"
            : bpm >= 60 && bpm < 62
            ? "Moderate BPM - Monitor your activity."
            : "Unusual BPM - Consider checking with a doctor."}
        </p>
      </div>

      {/* Graph */}
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

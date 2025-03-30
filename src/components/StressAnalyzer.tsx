import React, { useEffect, useState } from "react";

const StressAnalyzer: React.FC = () => {
  const [stressScore, setStressScore] = useState<number | null>(null);

  // Sample Health Data
  const heartRateHistory = [103, 88, 92]; // BPM readings
  const avgHeartRate =
    heartRateHistory.reduce((sum, hr) => sum + hr, 0) / heartRateHistory.length;
  const sleepHours = 5; // Hours slept
  const caloriesBurnt = 2134;
  const caloriesIntake = 2675;
  const calorieBalance = caloriesIntake - caloriesBurnt; // Excess intake

  useEffect(() => {
    const calculateStressScore = () => {
      // Normalize heart rate (Higher BPM = More stress)
      const heartRateScore = Math.min(100, (avgHeartRate - 60) * 1.5);

      // Normalize sleep (Less sleep = More stress)
      const sleepScore = Math.max(0, (7 - sleepHours) * 15);

      // Normalize calorie balance (Higher surplus = More stress)
      const calorieScore = Math.min(100, calorieBalance / 12);

      // Weighted average stress score
      const score = Math.min(
        100,
        Math.max(0, heartRateScore * 0.5 + sleepScore * 0.3 + calorieScore * 0.2)
      );

      setTimeout(() => setStressScore(Math.round(score)), 800); // Simulating loading delay
    };

    calculateStressScore();
  }, []);

  // Determine stress color
  const getStressColor = () => {
    if (stressScore === null) return "text-gray-500";
    if (stressScore < 40) return "text-green-500"; // Low stress
    if (stressScore < 70) return "text-yellow-500"; // Moderate stress
    return "text-red-500"; // High stress
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-2xl border border-gray-200">
      <h2 className="text-2xl font-semibold text-center mb-4">Stress Analyzer</h2>

      <div className="text-center mb-6">
        <p className={`text-4xl font-bold ${getStressColor()}`}>
          {stressScore === null ? "Calculating..." : `${stressScore} / 100`}
        </p>
        <p className="text-gray-500 text-sm">
          {stressScore !== null
            ? stressScore < 40
              ? "✅ Low Stress - Keep it up!"
              : stressScore < 70
              ? "⚠️ Moderate Stress - Take it easy!"
              : "🚨 High Stress - Consider relaxing!"
            : "Analyzing your data..."}
        </p>
      </div>

      <div className="space-y-3 text-gray-700">
        <p>📊 <strong>Heart Rate:</strong> {avgHeartRate.toFixed(1)} BPM</p>
        <p>🛌 <strong>Sleep:</strong> {sleepHours} hrs</p>
        <p>🔥 <strong>Calories Burnt:</strong> {caloriesBurnt}</p>
        <p>🍔 <strong>Calories Intake:</strong> {caloriesIntake}</p>
      </div>
    </div>
  );
};

export default StressAnalyzer;

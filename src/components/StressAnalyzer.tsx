import React, { useEffect, useState } from "react";

const StressAnalyzer: React.FC = () => {
  const [stressScore, setStressScore] = useState<number | null>(null);

  // Sample Health Data
  const heartRateHistory = [103, 88, 92]; // BPM readings
  const avgHeartRate = heartRateHistory.reduce((sum, hr) => sum + hr, 0) / heartRateHistory.length;
  const sleepHours = 5; // Hours slept
  const caloriesBurnt = 2000;
  const caloriesIntake = 2800;
  const calorieBalance = caloriesIntake - caloriesBurnt; // Excess intake

  useEffect(() => {
    const calculateStressScore = () => {
      // Normalize heart rate (Higher BPM = More stress)
      const heartRateScore = Math.min(100, (avgHeartRate - 60) * 1.2); // Normalized

      // Normalize sleep (Less sleep = More stress)
      const sleepScore = Math.max(0, (7 - sleepHours) * 12); // Less sleep increases stress

      // Normalize calorie balance (Higher surplus = More stress)
      const calorieScore = Math.min(100, calorieBalance / 10); // Higher excess = More stress

      // Weighted average
      const score = Math.min(100, Math.max(0, (heartRateScore * 0.5 + sleepScore * 0.3 + calorieScore * 0.2)));
      
      setStressScore(Math.round(score));
    };

    calculateStressScore();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md text-center">
      <h2 className="text-xl font-bold">Stress Score</h2>

      {stressScore === null ? (
        <p className="text-gray-500">Calculating... / 100</p>
      ) : (
        <p className="text-2xl font-semibold">{stressScore} / 100</p>
      )}

      <div className="mt-4 text-gray-600">
        <p>📊 Heart Rate: {avgHeartRate.toFixed(1)} BPM</p>
        <p>🛌 Sleep: {sleepHours} hrs</p>
        <p>🔥 Calories Burnt: {caloriesBurnt}</p>
        <p>🍔 Calories Intake: {caloriesIntake}</p>
      </div>
    </div>
  );
};

export default StressAnalyzer;

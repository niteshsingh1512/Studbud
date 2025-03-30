import { Heart, Activity, TrendingDown, Battery } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function StressScoreComponent() {
  // Hardcoded random data
  const currentStressScore = 62;
  const hrvScore = 78;
  const lastMeasuredDate = new Date(Date.now() - 3600000 * 3).toISOString(); // 3 hours ago

  // Determine stress level based on score
  const getStressLevel = (score: number) => {
    if (score < 30) return "Low";
    if (score < 50) return "Moderate";
    if (score < 75) return "High";
    return "Very High";
  };

  const stressLevel = getStressLevel(currentStressScore);

  // Generate color based on stress score
  const getStressColor = () => {
    if (currentStressScore < 30) return "from-green-500 to-teal-600";
    if (currentStressScore < 50) return "from-blue-500 to-indigo-600";
    if (currentStressScore < 75) return "from-yellow-500 to-orange-600";
    return "from-orange-500 to-red-600";
  };

  // HRV interpretation
  const getHrvLevel = (score: number) => {
    if (score > 70) return "Excellent";
    if (score > 50) return "Good";
    return "Needs Improvement";
  };

  return (
    <div
      className={`bg-gradient-to-br ${getStressColor()} text-white p-6 rounded-xl shadow-lg`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="text-white" size={24} />
          <h3 className="text-xl font-semibold">Wellness Metrics</h3>
        </div>
        <Battery className="text-white opacity-75" size={20} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white/10 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown size={16} className="text-white" />
            <div className="text-sm font-medium">Stress Score</div>
          </div>
          <div className="text-4xl font-bold">{currentStressScore}</div>
          <div className="mt-2 text-sm opacity-80">{stressLevel}</div>
        </div>

        <div className="bg-white/10 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Heart size={16} className="text-white" />
            <div className="text-sm font-medium">HRV Score</div>
          </div>
          <div className="text-4xl font-bold">{hrvScore}</div>
          <div className="mt-2 text-sm opacity-80">{getHrvLevel(hrvScore)}</div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/20">
        <div className="text-sm opacity-80">
          Last measured {formatDistanceToNow(new Date(lastMeasuredDate))} ago
        </div>
      </div>
    </div>
  );
}

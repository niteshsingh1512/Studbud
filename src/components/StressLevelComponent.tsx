import React, { useState, useEffect } from 'react';
import { AlertCircle, Smile, Frown, Meh, Clock } from 'lucide-react';

type StressLevelProps = {
  stressLevel: number;
  onUpdate: (level: number) => void;
};

const StressLevelComponent: React.FC<StressLevelProps> = ({ stressLevel, onUpdate }) => {
  const [stressHistory, setStressHistory] = useState<{time: string, level: number}[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [suggestion, setSuggestion] = useState('');

  // Get stress category based on level
  const getStressCategory = (level: number) => {
    if (level < 30) return 'Low';
    if (level < 70) return 'Moderate';
    return 'High';
  };

  // Get icon based on stress level
  const getStressIcon = (level: number) => {
    if (level < 30) return <Smile className="text-green-500" />;
    if (level < 70) return <Meh className="text-amber-500" />;
    return <Frown className="text-red-500" />;
  };

  // Get detailed message based on stress level
  const getStressMessage = (level: number) => {
    if (level < 30) return 'Low stress - Good job maintaining balance';
    if (level < 70) return 'Moderate stress - Take some breaks';
    return 'High stress - Consider relaxation techniques';
  };

  // Get color based on stress level
  const getStressColor = (level: number) => {
    if (level < 30) return 'text-green-500';
    if (level < 70) return 'text-amber-500';
    return 'text-red-500';
  };

  // Get background color for progress bar
  const getProgressColor = (level: number) => {
    if (level < 30) return 'bg-green-500';
    if (level < 70) return 'bg-amber-500';
    return 'bg-red-500';
  };

  // Get stress relief suggestions based on level
  const getStressSuggestion = (level: number) => {
    if (level < 30) return 'Continue your current routine - it\'s working well!';
    if (level < 70) return 'Try a 5-minute breathing exercise or short walk.';
    return 'Consider meditation, deep breathing, or talking to someone.';
  };

  // Handle slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLevel = parseInt(e.target.value, 10);
    onUpdate(newLevel);
    
    // Log to history when stress level changes
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setStressHistory(prev => [
      { time: timeString, level: newLevel },
      ...prev.slice(0, 9) // Keep only the 10 most recent entries
    ]);
  };

  // Update suggestion when stress level changes
  useEffect(() => {
    setSuggestion(getStressSuggestion(stressLevel));
  }, [stressLevel]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Stress Level</h2>
          <p className="text-gray-500 text-sm">AI-predicted based on your patterns</p>
        </div>
        {getStressIcon(stressLevel)}
      </div>
      
      {/* Current Level */}
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-gray-700">Current Level:</span>
        <div className="flex items-center gap-2">
          <span className={`text-2xl font-bold ${getStressColor(stressLevel)}`}>
            {stressLevel}%
          </span>
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${getStressColor(stressLevel)} bg-opacity-10`}>
            {getStressCategory(stressLevel)}
          </span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-3 bg-gray-200 rounded-full mb-4 overflow-hidden">
        <div 
          className={`h-full rounded-full ${getProgressColor(stressLevel)}`} 
          style={{ width: `${stressLevel}%`, transition: 'width 0.3s ease' }}
        ></div>
      </div>
      
      {/* Slider */}
      <div className="mb-1">
        <input
          type="range"
          min="0"
          max="100"
          value={stressLevel}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      <div className="flex justify-between text-sm text-gray-500 mb-4">
        <span>Low</span>
        <span>Moderate</span>
        <span>High</span>
      </div>
      
      {/* Message */}
      <div className={`p-3 rounded-lg mb-4 ${getStressColor(stressLevel)} bg-opacity-10`}>
        <p className={`font-medium ${getStressColor(stressLevel)} flex items-center gap-2`}>
          <AlertCircle size={16} />
          {getStressMessage(stressLevel)}
        </p>
      </div>
      
      {/* Suggestion */}
      <div className="bg-blue-50 p-3 rounded-lg mb-4">
        <h3 className="font-medium text-blue-700 mb-1">Suggestion</h3>
        <p className="text-blue-600 text-sm">{suggestion}</p>
      </div>
      
      {/* History Toggle */}
      <button 
        onClick={() => setShowHistory(!showHistory)}
        className="flex items-center gap-2 text-gray-600 text-sm font-medium mb-2"
      >
        <Clock size={16} />
        {showHistory ? "Hide History" : "Show History"}
      </button>
      
      {/* History Section */}
      {showHistory && stressHistory.length > 0 && (
        <div className="border-t border-gray-200 pt-3 mt-2">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Changes</h3>
          <div className="max-h-32 overflow-y-auto">
            {stressHistory.map((entry, index) => (
              <div key={index} className="flex justify-between text-sm py-1 border-b border-gray-100">
                <span className="text-gray-600">{entry.time}</span>
                <span className={getStressColor(entry.level)}>{entry.level}% ({getStressCategory(entry.level)})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StressLevelComponent;
import React, { useState, useEffect } from 'react';
import { Smile, Meh, Frown, ThumbsUp, ThumbsDown, Calendar, Clock, PenLine, Check, ChevronDown } from 'lucide-react';

type MoodTrackerProps = {
  onMoodLog: (mood: string, note?: string) => void;
};

type MoodHistoryEntry = {
  mood: string;
  timestamp: string;
  date: string;
  note?: string;
};

const MoodTrackerComponent: React.FC<MoodTrackerProps> = ({ onMoodLog }) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodNote, setMoodNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [moodHistory, setMoodHistory] = useState<MoodHistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const moods = [
    { value: 'great', label: 'Great', icon: <Smile className="h-6 w-6" />, color: 'bg-green-100 hover:bg-green-200 border-green-200', textColor: 'text-green-600' },
    { value: 'good', label: 'Good', icon: <ThumbsUp className="h-6 w-6" />, color: 'bg-blue-100 hover:bg-blue-200 border-blue-200', textColor: 'text-blue-600' },
    { value: 'okay', label: 'Okay', icon: <Meh className="h-6 w-6" />, color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-200', textColor: 'text-yellow-600' },
    { value: 'low', label: 'Low', icon: <Frown className="h-6 w-6" />, color: 'bg-orange-100 hover:bg-orange-200 border-orange-200', textColor: 'text-orange-600' },
    { value: 'bad', label: 'Bad', icon: <ThumbsDown className="h-6 w-6" />, color: 'bg-red-100 hover:bg-red-200 border-red-200', textColor: 'text-red-600' },
  ];

  const handleMoodSelection = (mood: string) => {
    setSelectedMood(mood);
  };

  const handleMoodLog = () => {
    if (selectedMood) {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateString = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
      
      const newEntry: MoodHistoryEntry = {
        mood: selectedMood,
        timestamp: timeString,
        date: dateString,
        note: moodNote || undefined
      };
      
      setMoodHistory(prev => [newEntry, ...prev.slice(0, 6)]);
      onMoodLog(selectedMood, moodNote);
      
      // Reset state
      setSelectedMood(null);
      setMoodNote('');
      setShowNoteInput(false);
    }
  };

  const getMoodData = (moodValue: string) => {
    return moods.find(mood => mood.value === moodValue) || moods[2]; // Default to "okay"
  };

  const getMoodIcon = (moodValue: string) => {
    return getMoodData(moodValue).icon;
  };

  const getMoodColor = (moodValue: string) => {
    return getMoodData(moodValue).color;
  };

  const getMoodTextColor = (moodValue: string) => {
    return getMoodData(moodValue).textColor;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Mood Tracker</h2>
          <p className="text-gray-500 text-sm">How are you feeling today?</p>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          {new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })}
        </div>
      </div>
      
      {/* Mood Selection */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => handleMoodSelection(mood.value)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border ${mood.color} transition-colors 
              ${selectedMood === mood.value ? 'ring-2 ring-offset-2 ring-blue-500' : 'ring-0'}`}
          >
            <div className={`${selectedMood === mood.value ? mood.textColor : 'text-gray-700'}`}>
              {mood.icon}
            </div>
            <span className={`mt-1 text-sm font-medium ${selectedMood === mood.value ? mood.textColor : 'text-gray-700'}`}>
              {mood.label}
            </span>
          </button>
        ))}
      </div>
      
      {/* Note Toggle */}
      {selectedMood && (
        <button 
          onClick={() => setShowNoteInput(!showNoteInput)}
          className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg mb-3 transition-colors"
        >
          <PenLine className="h-4 w-4" />
          {showNoteInput ? "Hide Note" : "Add a Note"}
          <ChevronDown className={`h-4 w-4 transform transition-transform ${showNoteInput ? 'rotate-180' : ''}`} />
        </button>
      )}
      
      {/* Note Input */}
      {selectedMood && showNoteInput && (
        <div className="mb-4">
          <textarea
            value={moodNote}
            onChange={(e) => setMoodNote(e.target.value)}
            placeholder="How are you feeling? What's on your mind?"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          ></textarea>
        </div>
      )}
      
      {/* Log Button */}
      <button 
        onClick={handleMoodLog}
        disabled={!selectedMood}
        className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors 
          ${selectedMood 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
      >
        <Check className="h-5 w-5" />
        Log Mood
      </button>
      
      {/* History Toggle */}
      {moodHistory.length > 0 && (
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center justify-center gap-2 w-full mt-4 py-2 text-gray-600 text-sm font-medium"
        >
          <Clock className="h-4 w-4" />
          {showHistory ? "Hide History" : "Show History"} ({moodHistory.length})
          <ChevronDown className={`h-4 w-4 transform transition-transform ${showHistory ? 'rotate-180' : ''}`} />
        </button>
      )}
      
      {/* Mood History */}
      {showHistory && moodHistory.length > 0 && (
        <div className="mt-3 border-t border-gray-200 pt-3">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Entries</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {moodHistory.map((entry, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded-full ${getMoodColor(entry.mood)}`}>
                      {getMoodIcon(entry.mood)}
                    </div>
                    <span className={`font-medium ${getMoodTextColor(entry.mood)}`}>
                      {getMoodData(entry.mood).label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{entry.date}</span>
                    <span>{entry.timestamp}</span>
                  </div>
                </div>
                {entry.note && (
                  <p className="text-sm text-gray-600 mt-1 pl-8">{entry.note}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodTrackerComponent;
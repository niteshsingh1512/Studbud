import React, { useMemo, useState } from 'react';
import { BarChart, Calendar, PieChart, TrendingUp, Filter, ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';

type MoodEntry = {
  mood: string;
  timestamp: string;
  note?: string;
};

type WeeklyMoodProps = {
  moodHistory: MoodEntry[];
};

const WeeklyMoodComponent: React.FC<WeeklyMoodProps> = ({ moodHistory }) => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'weekly' | 'distribution'>('weekly');
  const [filterMood, setFilterMood] = useState<string | null>(null);
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Get date range for the selected week
  const weekDateRange = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    // Adjust for weekOffset (0 = current week, -1 = last week, etc.)
    startOfWeek.setDate(now.getDate() - now.getDay() - (7 * weekOffset));
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return {
      start: startOfWeek.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      end: endOfWeek.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      year: startOfWeek.getFullYear()
    };
  }, [weekOffset]);
  
  // Calculate weekly moods with selected week offset
  const weeklyMoods = useMemo(() => {
    const now = new Date();
    const startOfSelectedWeek = new Date(now);
    startOfSelectedWeek.setDate(now.getDate() - now.getDay() - (7 * weekOffset));
    
    const endOfSelectedWeek = new Date(startOfSelectedWeek);
    endOfSelectedWeek.setDate(startOfSelectedWeek.getDate() + 7);
    
    const weekMoods = moodHistory.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate >= startOfSelectedWeek && entryDate < endOfSelectedWeek;
    });

    return days.map(day => {
      const dayIndex = days.indexOf(day);
      const currentDayDate = new Date(startOfSelectedWeek);
      currentDayDate.setDate(startOfSelectedWeek.getDate() + dayIndex);
      
      const dayMoods = weekMoods.filter(entry => {
        return days[new Date(entry.timestamp).getDay()] === day;
      });

      const moodCounts: Record<string, number> = {};
      dayMoods.forEach(entry => {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
      });

      const dominantMood = Object.keys(moodCounts).length > 0
        ? Object.keys(moodCounts).reduce((a, b) => (moodCounts[a] > moodCounts[b] ? a : b), 'none')
        : 'none';
        
      const formattedDate = currentDayDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
      
      return { 
        day, 
        dayIndex,
        date: formattedDate,
        mood: dominantMood, 
        entries: dayMoods.length,
        allMoods: dayMoods
      };
    });
  }, [moodHistory, weekOffset]);

  const getMoodEmoji = (mood: string) => {
    const moodMap: Record<string, string> = {
      great: '😀', good: '😌', okay: '😐', low: '😔', bad: '😞', none: '⚪'
    };
    return moodMap[mood] || '⚪';
  };

  const getMoodColor = (mood: string) => {
    const colorMap: Record<string, string> = {
      great: 'bg-green-100 border-green-300',
      good: 'bg-blue-100 border-blue-300',
      okay: 'bg-yellow-100 border-yellow-300',
      low: 'bg-orange-100 border-orange-300',
      bad: 'bg-red-100 border-red-300',
      none: 'bg-gray-100 border-gray-300'
    };
    return colorMap[mood] || 'bg-gray-100 border-gray-300';
  };
  
  const getMoodTextColor = (mood: string) => {
    const colorMap: Record<string, string> = {
      great: 'text-green-600',
      good: 'text-blue-600',
      okay: 'text-yellow-600',
      low: 'text-orange-600',
      bad: 'text-red-600',
      none: 'text-gray-600'
    };
    return colorMap[mood] || 'text-gray-600';
  };
  
  const getMoodBgColor = (mood: string) => {
    const colorMap: Record<string, string> = {
      great: 'bg-green-500',
      good: 'bg-blue-500',
      okay: 'bg-yellow-500',
      low: 'bg-orange-500',
      bad: 'bg-red-500',
      none: 'bg-gray-300'
    };
    return colorMap[mood] || 'bg-gray-300';
  };

  // Calculate mood statistics
  const moodStats = useMemo(() => {
    const filteredHistory = filterMood 
      ? moodHistory.filter(entry => entry.mood === filterMood)
      : moodHistory;
      
    const stats = filteredHistory.reduce((counts, entry) => {
      counts[entry.mood] = (counts[entry.mood] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
    
    const total = Object.values(stats).reduce((sum, count) => sum + count, 0);
    
    // Get percentages
    const percentages = Object.entries(stats).map(([mood, count]) => ({
      mood,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    })).sort((a, b) => b.count - a.count);
    
    return {
      counts: stats,
      total,
      percentages
    };
  }, [moodHistory, filterMood]);
  
  // Calculate trends
  const trendData = useMemo(() => {
    const allMoods = ['great', 'good', 'okay', 'low', 'bad'];
    const moodValues = { great: 4, good: 3, okay: 2, low: 1, bad: 0 };
    
    // Group entries by day
    const entriesByDay = weeklyMoods.map(day => {
      if (day.entries === 0) return { day: day.day, averageMood: null };
      
      // Calculate average mood value
      const totalValue = day.allMoods.reduce((sum, entry) => {
        return sum + (moodValues[entry.mood as keyof typeof moodValues] || 0);
      }, 0);
      
      return {
        day: day.day,
        dayShort: day.day.substring(0, 3),
        date: day.date,
        averageMood: totalValue / day.entries
      };
    });
    
    return entriesByDay;
  }, [weeklyMoods]);
  
  // Check if we're current viewing the current week
  const isCurrentWeek = weekOffset === 0;
  
  // Toggle day expansion
  const toggleDayExpansion = (day: string) => {
    if (expandedDay === day) {
      setExpandedDay(null);
    } else {
      setExpandedDay(day);
    }
  };
  
  return (
    <div className="space-y-6 max-w-4xl">
      {/* View Selector Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1">
        <div className="grid grid-cols-2 gap-1">
          <button 
            onClick={() => setActiveView('weekly')}
            className={`py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
              activeView === 'weekly' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
            }`}
          >
            <Calendar size={18} />
            <span className="font-medium">Weekly Overview</span>
          </button>
          <button 
            onClick={() => setActiveView('distribution')}
            className={`py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
              activeView === 'distribution' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
            }`}
          >
            <BarChart size={18} />
            <span className="font-medium">Mood Distribution</span>
          </button>
        </div>
      </div>
      
      {activeView === 'weekly' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="text-indigo-600" size={20} />
              <h2 className="text-xl font-bold text-gray-900">Weekly Mood Overview</h2>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setWeekOffset(weekOffset + 1)}
                className="p-1 rounded-full hover:bg-gray-100"
                aria-label="Previous week"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              
              <span className="text-sm font-medium px-2">
                {weekDateRange.start} - {weekDateRange.end}, {weekDateRange.year}
              </span>
              
              <button 
                onClick={() => setWeekOffset(weekOffset - 1)}
                disabled={isCurrentWeek}
                className={`p-1 rounded-full ${isCurrentWeek ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                aria-label="Next week"
              >
                <ArrowRight size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-6">
            {weeklyMoods.map(({ day, date, mood, entries, allMoods }) => (
              <div 
                key={day} 
                className={`p-3 rounded-lg border ${getMoodColor(mood)} flex flex-col items-center cursor-pointer transition-all ${
                  expandedDay === day ? 'ring-2 ring-indigo-300' : 'hover:shadow-md'
                }`}
                onClick={() => toggleDayExpansion(day)}
              >
                <p className="text-xs font-medium text-gray-500 mb-1">{day.substring(0, 3)}</p>
                <p className="text-xs text-gray-400 mb-1">{date}</p>
                <span className="text-2xl mb-1">{getMoodEmoji(mood)}</span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  {entries > 0 ? (
                    <>
                      {entries} log{entries !== 1 ? 's' : ''}
                      <ChevronDown size={12} className={`transition-transform ${expandedDay === day ? 'rotate-180' : ''}`} />
                    </>
                  ) : 'No data'}
                </span>
              </div>
            ))}
          </div>
          
          {/* Expanded day details */}
          {expandedDay && (
            <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-900">
                  {expandedDay}'s Entries ({weeklyMoods.find(m => m.day === expandedDay)?.date})
                </h3>
                <button 
                  onClick={() => setExpandedDay(null)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Close
                </button>
              </div>
              
              {weeklyMoods.find(m => m.day === expandedDay)?.entries === 0 ? (
                <p className="text-gray-500 text-sm italic">No mood entries for this day.</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {weeklyMoods.find(m => m.day === expandedDay)?.allMoods.map((entry, idx) => (
                    <div key={idx} className={`p-3 rounded-lg ${getMoodColor(entry.mood)}`}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span>{getMoodEmoji(entry.mood)}</span>
                          <span className={`font-medium capitalize ${getMoodTextColor(entry.mood)}`}>{entry.mood}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {entry.note && (
                        <p className="text-sm text-gray-600 mt-2">{entry.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Mood trend chart */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-indigo-600" size={20} />
              <h3 className="font-bold text-gray-900">Mood Trend</h3>
            </div>
            
            <div className="h-40">
              <div className="flex items-end h-32 w-full">
                {trendData.map((day, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    {day.averageMood !== null ? (
                      <>
                        <div 
                          className="w-full max-w-12 rounded-t-lg bg-indigo-500" 
                          style={{ 
                            height: `${Math.max((day.averageMood / 4) * 100, 10)}%`,
                            opacity: 0.7 + ((day.averageMood / 4) * 0.3)
                          }}
                        ></div>
                        <div className="w-full h-1 bg-indigo-200"></div>
                      </>
                    ) : (
                      <div className="w-full max-w-12 rounded-t-lg bg-gray-200" style={{ height: '10%' }}></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex w-full mt-1">
                {trendData.map((day, idx) => (
                  <div key={idx} className="flex-1 text-center">
                    <span className="text-xs font-medium text-gray-500">{day.dayShort}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center mt-2 text-xs text-gray-500">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 opacity-70"></div>
                  <span>Lower Mood</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  <span>Higher Mood</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeView === 'distribution' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart className="text-indigo-600" size={20} />
              <h2 className="text-xl font-bold text-gray-900">Mood Distribution</h2>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setFilterMood(null)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg flex items-center gap-1 ${
                  filterMood ? 'bg-gray-100 hover:bg-gray-200' : 'bg-indigo-100 text-indigo-700'
                }`}
              >
                <Filter size={14} />
                {filterMood ? `Filtering: ${filterMood}` : 'All Moods'}
              </button>
            </div>
          </div>
          
          {/* Circular representation of distribution */}
          <div className="flex flex-col md:flex-row gap-6 items-center justify-center mb-6">
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">{moodStats.total}</span>
                <span className="text-sm text-gray-500 ml-1">entries</span>
              </div>
              
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {moodStats.percentages.map((item, index) => {
                  const strokeWidth = 12;
                  const radius = 50 - strokeWidth / 2;
                  const circumference = 2 * Math.PI * radius;
                  
                  // Calculate offset for each segment
                  let startOffset = 0;
                  for (let i = 0; i < index; i++) {
                    startOffset += (moodStats.percentages[i].percentage / 100) * circumference;
                  }
                  
                  return (
                    <circle
                      key={item.mood}
                      cx="50"
                      cy="50"
                      r={radius}
                      strokeWidth={strokeWidth}
                      stroke={getMoodBgColor(item.mood)}
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference - ((item.percentage / 100) * circumference)}
                      strokeLinecap="round"
                      style={{
                        strokeDashoffset: `${circumference - ((item.percentage / 100) * circumference)}`,
                        transform: `rotate(${startOffset / circumference * 360}deg)`,
                        transformOrigin: 'center',
                        opacity: 0.85
                      }}
                    />
                  );
                })}
              </svg>
            </div>
            
            <div className="space-y-1 w-full max-w-md">
              {moodStats.percentages.map(({ mood, count, percentage }) => (
                <button 
                  key={mood}
                  className={`w-full flex items-center space-x-2 p-2 rounded-lg transition-colors hover:bg-gray-50 ${
                    filterMood === mood ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => setFilterMood(filterMood === mood ? null : mood)}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-xl">{getMoodEmoji(mood)}</span>
                    <span className="capitalize font-medium">{mood}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm">{count} entries</span>
                    <span className={`px-2 py-0.5 rounded-full text-white text-xs font-medium ${getMoodBgColor(mood)}`}>
                      {percentage}%
                    </span>
                  </div>
                </button>
              ))}
              
              {moodStats.percentages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No mood data available
                </div>
              )}
            </div>
          </div>
          
          {/* Bar chart representation */}
          <div className="mt-8">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <PieChart size={18} className="text-indigo-600" />
              Mood Bar Visualization
            </h3>
            
            <div className="space-y-3">
              {['great', 'good', 'okay', 'low', 'bad'].map((mood) => {
                const count = moodStats.counts[mood] || 0;
                const percentage = moodStats.total > 0 ? (count / moodStats.total) * 100 : 0;
                
                return (
                  <div key={mood} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span>{getMoodEmoji(mood)}</span>
                        <span className="capitalize font-medium">{mood}</span>
                      </div>
                      <span className="text-gray-500">{count} entries ({Math.round(percentage)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${getMoodBgColor(mood)}`} 
                        style={{ width: `${percentage}%`, transition: 'width 0.5s ease' }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyMoodComponent;
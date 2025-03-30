import React, { useState } from 'react';
import Calendar from './Calendar';

const App = () => {
  // Example streak data (true = student completed their work on that day)
  const [streakData, setStreakData] = useState<{ [key: string]: boolean }>({
    '2025-03-01': true,
    '2025-03-02': true,
    '2025-03-03': true,
    '2025-03-05': true,
    '2025-03-06': true,
    '2025-03-07': true,
    '2025-03-10': true,
    '2025-03-11': true,
    '2025-03-14': true,
    '2025-03-18': true,
    '2025-03-19': true,
    '2025-03-20': true,
    '2025-03-21': true,
    '2025-03-25': true,
    '2025-03-26': true,
    '2025-03-27': true,
    '2025-03-28': true,
    '2025-03-29': true,
    '2025-03-30': true,
  });

  // Function to toggle streak for a date (for demonstration)
  const toggleStreak = (date: Date) => {
    const dateStr = formatDateString(date);
    setStreakData(prev => ({
      ...prev,
      [dateStr]: !prev[dateStr], // Toggle streak state
    }));
  };

  // Format date as YYYY-MM-DD
  const formatDateString = (date: Date): string => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-">
      <h1 className="text-xl font-bold mb-4">Student Streak Tracker</h1>
      <div className="flex">
        <Calendar 
          initialDate={new Date(2025, 2, 30)} // March 30, 2025
          streakData={streakData}
          onDateSelect={toggleStreak}
        />
        {/* <div className="ml-8">
          <h2 className="text-lg font-semibold mb-2">Instructions</h2>
          <p className="mb-4">Click on any day to toggle whether the student completed their work.</p>
          <p className="mb-2">Days with blue backgrounds indicate completed work.</p>
          <p>Current date has a blue ring around it.</p>
        </div> */}
      </div>
    </div>
  );
};

export default App;

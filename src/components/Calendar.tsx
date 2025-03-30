import React, { useState } from 'react';

interface CalendarProps {
  initialDate?: Date;
  streakData?: { [key: string]: boolean };
  onDateSelect?: (date: Date) => void;
  calendars?: { id: string; name: string; color: string; visible: boolean }[];
}

interface Day {
  date: Date;
  isCurrentMonth: boolean;
  hasStreak: boolean;
  isToday: boolean;
}

const StudentStreakCalendar: React.FC<CalendarProps> = ({
  initialDate = new Date(),
  streakData = {},
  onDateSelect,
  calendars = [
    { id: '1', name: 'Anvi Singh', color: '#2196f3', visible: true },
    { id: '2', name: 'Birthdays', color: '#4caf50', visible: true },
    { id: '3', name: 'Tasks', color: '#3f51b5', visible: true },
    { id: '4', name: 'Holidays in India', color: '#4caf50', visible: true },
  ],
}) => {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarState, setCalendarState] = useState(calendars);
  const [myCalendarsOpen, setMyCalendarsOpen] = useState(true);
  const [otherCalendarsOpen, setOtherCalendarsOpen] = useState(false);

  const formatDateString = (date: Date): string =>
    `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

  const isSameDay = (date1: Date, date2: Date): boolean =>
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();

  const getDaysInMonth = (date: Date): Day[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    
    const prevMonthDays: Day[] = Array.from({ length: firstDayOfMonth }, (_, i) => {
      const day = new Date(year, month, -i);
      return { date: day, isCurrentMonth: false, hasStreak: streakData[formatDateString(day)] || false, isToday: isSameDay(day, new Date()) };
    }).reverse();
    
    const currentMonthDays: Day[] = Array.from({ length: lastDayOfMonth }, (_, i) => {
      const day = new Date(year, month, i + 1);
      return { date: day, isCurrentMonth: true, hasStreak: streakData[formatDateString(day)] || false, isToday: isSameDay(day, new Date()) };
    });
    
    const totalDays = [...prevMonthDays, ...currentMonthDays].length;
    const nextMonthDays: Day[] = Array.from({ length: (7 - (totalDays % 7)) % 7 }, (_, i) => {
      const day = new Date(year, month + 1, i + 1);
      return { date: day, isCurrentMonth: false, hasStreak: streakData[formatDateString(day)] || false, isToday: isSameDay(day, new Date()) };
    });
    
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="w-64 bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
        <div className="flex space-x-2">
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}>&lt;</button>
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}>&gt;</button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="text-center text-sm font-medium">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => (
          <button
            key={i}
            onClick={() => { setSelectedDate(day.date); onDateSelect?.(day.date); }}
            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm
              ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
              ${day.isToday ? 'ring-2 ring-blue-500' : ''}
              ${day.hasStreak ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}
              ${isSameDay(day.date, selectedDate || new Date(-1)) ? 'bg-blue-600 text-white' : ''}`}
          >
            {day.date.getDate()}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="font-medium cursor-pointer" onClick={() => setMyCalendarsOpen(!myCalendarsOpen)}>My calendars {myCalendarsOpen ? '▾' : '▸'}</h3>
        {myCalendarsOpen && calendarState.map(cal => (
          <div key={cal.id} className="flex items-center">
            <input type="checkbox" id={`cal-${cal.id}`} checked={cal.visible} onChange={() => setCalendarState(cs => cs.map(c => c.id === cal.id ? { ...c, visible: !c.visible } : c))} className="hidden" />
            <label htmlFor={`cal-${cal.id}`} className="flex items-center cursor-pointer">
              <span className="w-4 h-4 rounded mr-2" style={{ backgroundColor: cal.visible ? cal.color : '#e0e0e0' }}></span>
              <span className="text-sm">{cal.name}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentStreakCalendar;
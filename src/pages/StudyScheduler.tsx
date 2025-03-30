// File: App.tsx
import React, { useState, useEffect } from 'react';
import SubjectForm from './components/SubjectForm';
import ScheduleView from './components/ScheduleView';
import SubjectList from './components/SubjectList';
import { Subject, TimeSlot } from './types';

const App: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const savedSubjects = localStorage.getItem('subjects');
    return savedSubjects ? JSON.parse(savedSubjects) : [];
  });
  
  const [schedule, setSchedule] = useState<TimeSlot[]>(() => {
    const savedSchedule = localStorage.getItem('schedule');
    return savedSchedule ? JSON.parse(savedSchedule) : [];
  });

  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('schedule', JSON.stringify(schedule));
  }, [schedule]);

  const addSubject = (subject: Subject) => {
    setSubjects([...subjects, { ...subject, id: Date.now().toString() }]);
  };

  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
    setSchedule(schedule.filter(slot => slot.subjectId !== id));
  };

  const updateSubject = (updatedSubject: Subject) => {
    setSubjects(subjects.map(subject => 
      subject.id === updatedSubject.id ? updatedSubject : subject
    ));
  };

  const addTimeSlot = (timeSlot: TimeSlot) => {
    setSchedule([...schedule, { ...timeSlot, id: Date.now().toString() }]);
  };

  const deleteTimeSlot = (id: string) => {
    setSchedule(schedule.filter(slot => slot.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50 text-gray-800">
      <header className="bg-indigo-600 text-white p-4 text-center shadow-md">
        <h1 className="text-2xl font-bold m-0">Student Study Scheduler</h1>
      </header>
      <main className="flex flex-col md:flex-row gap-6 p-6 flex-1">
        <div className="w-full md:w-1/3 bg-white rounded-lg shadow-sm p-6">
          <SubjectForm onAddSubject={addSubject} />
          <SubjectList 
            subjects={subjects} 
            onDeleteSubject={deleteSubject}
            onUpdateSubject={updateSubject}
          />
        </div>
        <div className="w-full md:w-2/3 bg-white rounded-lg shadow-sm p-6">
          <ScheduleView 
            subjects={subjects} 
            schedule={schedule}
            onAddTimeSlot={addTimeSlot}
            onDeleteTimeSlot={deleteTimeSlot}
          />
        </div>
      </main>
    </div>
  );
};

export default App;

// File: types.ts
export interface Subject {
  id: string;
  name: string;
  color: string;
  priority: 'High' | 'Medium' | 'Low';
  estimatedHours: number;
}

export interface TimeSlot {
  id: string;
  subjectId: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string;
  endTime: string;
  note?: string;
}

// File: components/SubjectForm.tsx
import React, { useState } from 'react';
import { Subject } from '../types';

interface SubjectFormProps {
  onAddSubject: (subject: Subject) => void;
}

const SubjectForm: React.FC<SubjectFormProps> = ({ onAddSubject }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3498db');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [estimatedHours, setEstimatedHours] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    const newSubject: Subject = {
      id: '', // Will be set in parent component
      name,
      color,
      priority,
      estimatedHours
    };
    
    onAddSubject(newSubject);
    
    // Reset form
    setName('');
    setColor('#3498db');
    setPriority('Medium');
    setEstimatedHours(1);
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-indigo-600 pb-2 mb-4 border-b border-gray-100">Add New Subject</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-1 font-medium text-gray-700">Subject Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="color" className="block mb-1 font-medium text-gray-700">Color</label>
          <input
            type="color"
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full p-1 border border-gray-300 rounded h-10"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="priority" className="block mb-1 font-medium text-gray-700">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'High' | 'Medium' | 'Low')}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="hours" className="block mb-1 font-medium text-gray-700">Estimated Study Hours per Week</label>
          <input
            type="number"
            id="hours"
            min="1"
            max="40"
            value={estimatedHours}
            onChange={(e) => setEstimatedHours(parseInt(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <button 
          type="submit" 
          className="bg-indigo-600 text-white px-4 py-2 rounded font-medium transition-colors hover:bg-indigo-700 mt-2"
        >
          Add Subject
        </button>
      </form>
    </div>
  );
};

export default SubjectForm;

// File: components/SubjectList.tsx
import React, { useState } from 'react';
import { Subject } from '../types';

interface SubjectListProps {
  subjects: Subject[];
  onDeleteSubject: (id: string) => void;
  onUpdateSubject: (subject: Subject) => void;
}

const SubjectList: React.FC<SubjectListProps> = ({ 
  subjects, 
  onDeleteSubject,
  onUpdateSubject
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [editPriority, setEditPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [editHours, setEditHours] = useState(1);

  const startEditing = (subject: Subject) => {
    setEditingId(subject.id);
    setEditName(subject.name);
    setEditColor(subject.color);
    setEditPriority(subject.priority);
    setEditHours(subject.estimatedHours);
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      onUpdateSubject({
        id: editingId,
        name: editName,
        color: editColor,
        priority: editPriority,
        estimatedHours: editHours
      });
      setEditingId(null);
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-indigo-600 pb-2 mb-4 border-b border-gray-100">Your Subjects</h2>
      {subjects.length === 0 ? (
        <p className="text-gray-500">No subjects added yet. Add your first subject above!</p>
      ) : (
        <ul className="space-y-3">
          {subjects.map(subject => (
            <li 
              key={subject.id} 
              className="bg-gray-50 rounded p-3 transition-transform hover:-translate-y-1" 
              style={{ borderLeft: 4px solid ${subject.color} }}
            >
              {editingId === subject.id ? (
                <div className="flex flex-col space-y-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="color"
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                    className="w-full p-1 border border-gray-300 rounded h-8"
                  />
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as 'High' | 'Medium' | 'Low')}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={editHours}
                    onChange={(e) => setEditHours(parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex space-x-2 mt-2">
                    <button 
                      onClick={saveEdit} 
                      className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-300"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => setEditingId(null)} 
                      className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-lg">{subject.name}</h3>
                    <span className={text-xs font-bold px-2 py-1 rounded ${getPriorityClass(subject.priority)}}>
                      {subject.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 my-1">{subject.estimatedHours} hours/week</p>
                  <div className="flex space-x-2 mt-2">
                    <button 
                      onClick={() => startEditing(subject)} 
                      className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-300"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => onDeleteSubject(subject.id)} 
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SubjectList;

// File: components/ScheduleView.tsx
import React, { useState } from 'react';
import { Subject, TimeSlot } from '../types';

interface ScheduleViewProps {
  subjects: Subject[];
  schedule: TimeSlot[];
  onAddTimeSlot: (timeSlot: TimeSlot) => void;
  onDeleteTimeSlot: (id: string) => void;
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const ScheduleView: React.FC<ScheduleViewProps> = ({ 
  subjects, 
  schedule, 
  onAddTimeSlot,
  onDeleteTimeSlot
}) => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'>('Monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [note, setNote] = useState('');
  const [viewMode, setViewMode] = useState<'day' | 'week'>('week');
  const [selectedViewDay, setSelectedViewDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'>('Monday');

  const handleAddTimeSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject) return;
    
    const newTimeSlot: TimeSlot = {
      id: '',
      subjectId: selectedSubject,
      day: selectedDay,
      startTime,
      endTime,
      note: note.trim() ? note : undefined
    };
    
    onAddTimeSlot(newTimeSlot);
    
    // Reset form partially (keep subject and day)
    setNote('');
  };

  const getSubjectById = (id: string): Subject | undefined => {
    return subjects.find(subject => subject.id === id);
  };
  
  const getTimeSlotsByDay = (day: string): TimeSlot[] => {
    return schedule
      .filter(slot => slot.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const renderTimeSlot = (slot: TimeSlot) => {
    const subject = getSubjectById(slot.subjectId);
    if (!subject) return null;
    
    const backgroundColor = subject.color + '30'; // 30% opacity version of the color
    
    return (
      <div 
        key={slot.id} 
        className="relative p-3 rounded group"
        style={{ backgroundColor, borderLeft: 4px solid ${subject.color} }}
      >
        <div className="flex justify-between items-center mb-1">
          <strong>{subject.name}</strong>
          <span>{slot.startTime} - {slot.endTime}</span>
        </div>
        {slot.note && <p className="text-sm text-gray-600 mt-1 mb-2">{slot.note}</p>}
        <button 
          onClick={() => onDeleteTimeSlot(slot.id)} 
          className="absolute bottom-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Remove
        </button>
      </div>
    );
  };

  const renderDayView = (day: string) => {
    const daySlots = getTimeSlotsByDay(day);
    
    return (
      <div className="bg-gray-50 rounded p-4">
        <h3 className="text-base text-gray-600 text-center border-b border-gray-200 pb-2 mb-3">{day}</h3>
        {daySlots.length === 0 ? (
          <p className="text-gray-400 italic text-center text-sm mt-4">No study sessions scheduled</p>
        ) : (
          <div className="space-y-2">
            {daySlots.map(renderTimeSlot)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-indigo-600 pb-2 mb-4 border-b border-gray-100">Schedule Study Session</h2>
        {subjects.length === 0 ? (
          <p className="text-gray-500">Add subjects first to create your study schedule!</p>
        ) : (
          <form onSubmit={handleAddTimeSlot} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="subject" className="block mb-1 font-medium text-gray-700">Subject</label>
                <select
                  id="subject"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="day" className="block mb-1 font-medium text-gray-700">Day</label>
                <select
                  id="day"
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value as any)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {daysOfWeek.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startTime" className="block mb-1 font-medium text-gray-700">Start Time</label>
                <input
                  type="time"
                  id="startTime"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="endTime" className="block mb-1 font-medium text-gray-700">End Time</label>
                <input
                  type="time"
                  id="endTime"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="note" className="block mb-1 font-medium text-gray-700">Notes (optional)</label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="E.g., Focus on chapter 5, Prepare for quiz, etc."
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px] resize-y"
              />
            </div>
            
            <button 
              type="submit" 
              className="bg-indigo-600 text-white px-4 py-2 rounded font-medium transition-colors hover:bg-indigo-700"
            >
              Add to Schedule
            </button>
          </form>
        )}
      </div>
      
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex overflow-hidden rounded">
            <button 
              className={px-4 py-2 font-medium ${viewMode === 'week' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}}
              onClick={() => setViewMode('week')}
            >
              Week View
            </button>
            <button 
              className={px-4 py-2 font-medium ${viewMode === 'day' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}}
              onClick={() => setViewMode('day')}
            >
              Day View
            </button>
          </div>
          
          {viewMode === 'day' && (
            <div>
              <select
                value={selectedViewDay}
                onChange={(e) => setSelectedViewDay(e.target.value as any)}
                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {daysOfWeek.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        <div>
          {viewMode === 'week' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
              {daysOfWeek.map(day => renderDayView(day))}
            </div>
          ) : (
            <div>
              {renderDayView(selectedViewDay)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleView;
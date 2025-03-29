import { useState, useEffect, useMemo } from 'react';
import { Subject, StudySession } from '../types';
import SubjectManager from '../components/SubjectManager';
import { Book, Plus, Clock, AlertTriangle } from 'lucide-react';
import { startOfWeek, endOfWeek, format, isAfter, isBefore } from 'date-fns';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function Subjects() {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem('subjects');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to parse subjects from localStorage:', error);
      return [];
    }
  });

  const [studySessions, setStudySessions] = useState<StudySession[]>(() => {
    try {
      const saved = localStorage.getItem('studyTime');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to parse study sessions from localStorage:', error);
      return [];
    }
  });

  const [showManager, setShowManager] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'progress'>('name');

  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }, [subjects]);

  const now = new Date();
  const weekStart = useMemo(() => startOfWeek(now), [now]);
  const weekEnd = useMemo(() => endOfWeek(now), [now]);
  const currentWeekFormatted = useMemo(() => 
    `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`, 
    [weekStart, weekEnd]
  );

  const getWeeklyProgress = useMemo(() => (subjectName: string) => {
    const weeklyMinutes = studySessions
      .filter(session => {
        const sessionDate = new Date(session.date);
        return session.subject === subjectName &&
               isAfter(sessionDate, weekStart) &&
               isBefore(sessionDate, weekEnd);
      })
      .reduce((acc, session) => acc + session.durationMinutes, 0);
    
    return weeklyMinutes / 60; // Convert to hours
  }, [studySessions, weekStart, weekEnd]);

  const handleAddSubject = (subjectData: Omit<Subject, 'id'>) => {
    const newSubject: Subject = {
      ...subjectData,
      id: crypto.randomUUID(),
    };
    setSubjects(prevSubjects => [...prevSubjects, newSubject]);
    toast.success('Subject added successfully');
  };

  const handleEditSubject = (id: string, subjectData: Omit<Subject, 'id'>) => {
    setSubjects(prevSubjects => 
      prevSubjects.map(subject =>
        subject.id === id ? { ...subject, ...subjectData } : subject
      )
    );
    toast.success('Subject updated successfully');
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(prevSubjects => 
      prevSubjects.filter(subject => subject.id !== id)
    );
    toast.success('Subject deleted successfully');
  };

  const handleAddStudySession = (subjectId: string, minutes: number) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;
    
    const newSession: StudySession = {
      id: crypto.randomUUID(),
      subject: subject.name,
      date: new Date().toISOString(),
      durationMinutes: minutes
    };
    
    setStudySessions(prev => [...prev, newSession]);
    localStorage.setItem('studyTime', JSON.stringify([...studySessions, newSession]));
    toast.success(`Added ${minutes} minutes to ${subject.name}`);
  };

  const filteredSubjects = useMemo(() => {
    let result = [...subjects];
    
    if (searchQuery) {
      result = result.filter(subject => 
        subject.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'progress') {
      result.sort((a, b) => {
        const progressA = getWeeklyProgress(a.name) / a.goalHoursPerWeek;
        const progressB = getWeeklyProgress(b.name) / b.goalHoursPerWeek;
        return progressB - progressA;
      });
    }
    
    return result;
  }, [subjects, searchQuery, sortBy, getWeeklyProgress]);

  const atRiskSubjects = useMemo(() => {
    return subjects.filter(subject => {
      const progress = getWeeklyProgress(subject.name);
      return progress / subject.goalHoursPerWeek < 0.5 && subject.goalHoursPerWeek > 0;
    });
  }, [subjects, getWeeklyProgress]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Book className="text-indigo-600" size={28} />
          <h1 className="text-2xl font-bold text-gray-900">Subjects</h1>
        </div>
        <button
          onClick={() => setShowManager(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          Manage Subjects
        </button>
      </div>

      <div className="bg-indigo-50 p-4 rounded-lg mb-6">
        <p className="text-indigo-800 font-medium">Current Week: {currentWeekFormatted}</p>
      </div>

      {atRiskSubjects.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="text-amber-500" size={20} />
            <h3 className="font-medium text-amber-800">Subjects at risk</h3>
          </div>
          <p className="text-amber-700 mb-2">
            You're behind on your weekly goals for the following subjects:
          </p>
          <ul className="list-disc pl-5">
            {atRiskSubjects.map(subject => (
              <li key={subject.id} className="text-amber-700">
                {subject.name} ({getWeeklyProgress(subject.name).toFixed(1)}h of {subject.goalHoursPerWeek}h)
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'name' | 'progress')}
          className="p-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        >
          <option value="name">Sort by Name</option>
          <option value="progress">Sort by Progress</option>
        </select>
      </div>

      <div className="grid gap-4">
        <AnimatePresence>
          {filteredSubjects.map((subject) => {
            const weeklyHours = getWeeklyProgress(subject.name);
            const progress = (weeklyHours / subject.goalHoursPerWeek) * 100;
            const progressColor = progress < 33 ? 'bg-red-500' : 
                                progress < 66 ? 'bg-amber-500' : 
                                'bg-green-500';
            
            return (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: subject.color }}
                    />
                    <h3 className="font-semibold text-lg">{subject.name}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock size={16} />
                      <span className="text-sm">
                        {weeklyHours.toFixed(1)} / {subject.goalHoursPerWeek}h
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddStudySession(subject.id, 15)}
                        className="text-xs px-2 py-1 bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200 transition-colors"
                      >
                        +15min
                      </button>
                      <button
                        onClick={() => handleAddStudySession(subject.id, 30)}
                        className="text-xs px-2 py-1 bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200 transition-colors"
                      >
                        +30min
                      </button>
                      <button
                        onClick={() => handleAddStudySession(subject.id, 60)}
                        className="text-xs px-2 py-1 bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200 transition-colors"
                      >
                        +1h
                      </button>
                    </div>
                  </div>
                </div>

                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-100">
                    <div
                      style={{
                        width: `${Math.min(100, progress)}%`,
                      }}
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${progressColor} transition-all duration-500`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {subjects.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-xl border border-gray-100"
          >
            <Book className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No subjects yet</h3>
            <p className="text-gray-500 mb-4">
              Add subjects to track your study progress
            </p>
            <button
              onClick={() => setShowManager(true)}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Add your first subject
            </button>
          </motion.div>
        )}

        {subjects.length > 0 && filteredSubjects.length === 0 && (
          <div className="text-center py-8 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-500">No subjects match your search</p>
          </div>
        )}
      </div>

      {showManager && (
        <SubjectManager
          subjects={subjects}
          onAddSubject={handleAddSubject}
          onEditSubject={handleEditSubject}
          onDeleteSubject={handleDeleteSubject}
          onClose={() => setShowManager(false)}
        />
      )}
    </div>
  );
}
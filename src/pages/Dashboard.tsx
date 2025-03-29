import { useState, useEffect } from 'react';
import { StudySession, StudyStreak, Subject } from '../types';
import PomodoroTimer from '../components/PomodoroTimer';
import StudyStreakComponent from '../components/StudyStreak';
import FocusMode from '../components/FocusMode';
import LoadingSpinner from '../components/LoadingSpinner';
import { GraduationCap, BarChart } from 'lucide-react';
import { getFromStorage, setToStorage } from '../utils/storage';
import StressLevelComponent from '../components/StressLevelComponent';
import MoodTrackerComponent from '../components/MoodTrackerComponent';
import WeeklyMoodComponent from '../components/WeeklyMoodComponent';

// Define interfaces for mood-related types
interface MoodEntry {
  mood: string;
  timestamp: string;
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [studyTime, setStudyTime] = useState<StudySession[]>([]);
  const [isStudyActive, setIsStudyActive] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [streak, setStreak] = useState<StudyStreak>({
    currentStreak: 0,
    bestStreak: 0,
    lastStudyDate: new Date().toISOString()
  });

  // New state for stress and mood tracking
  const [stressLevel, setStressLevel] = useState({
    level: 35,
    lastUpdated: new Date().toISOString()
  });

  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedSubjects, loadedStudyTime, loadedStreak, loadedStressLevel, loadedMoodHistory] = await Promise.all([
          getFromStorage<Subject[]>('subjects', []),
          getFromStorage<StudySession[]>('studyTime', []),
          getFromStorage<StudyStreak>('streak', {
            currentStreak: 0,
            bestStreak: 0,
            lastStudyDate: new Date().toISOString()
          }),
          getFromStorage('stressLevel', {
            level: 35,
            lastUpdated: new Date().toISOString()
          }),
          getFromStorage<MoodEntry[]>('moodHistory', [])
        ]);

        setSubjects(loadedSubjects || []);
        setStudyTime(loadedStudyTime || []);
        setStreak(loadedStreak);
        setStressLevel(loadedStressLevel);
        setMoodHistory(loadedMoodHistory || []);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setError('Failed to load data. Please try refreshing the page.');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Save data effects
  useEffect(() => {
    if (!isLoading) {
      setToStorage('studyTime', studyTime).catch(console.error);
    }
  }, [studyTime, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      setToStorage('streak', streak).catch(console.error);
    }
  }, [streak, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      setToStorage('stressLevel', stressLevel).catch(console.error);
    }
  }, [stressLevel, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      setToStorage('moodHistory', moodHistory).catch(console.error);
    }
  }, [moodHistory, isLoading]);

  const handleStudySessionComplete = (minutes: number) => {
    if (minutes <= 0) {
      console.error('Invalid study session duration');
      return;
    }

    try {
      const newSession: StudySession = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        durationMinutes: minutes,
        subject: selectedSubject || 'General',
      };
      setStudyTime(prev => [...prev, newSession]);
      
      // Update streak
      const today = new Date();
      const lastStudy = new Date(streak.lastStudyDate);
      
      today.setHours(0, 0, 0, 0);
      lastStudy.setHours(0, 0, 0, 0);
      
      const timeDiff = Math.floor((today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24));
      
      if (timeDiff <= 1) {
        if (timeDiff === 1 || (timeDiff === 0 && streak.currentStreak === 0)) {
          setStreak(prev => ({
            currentStreak: prev.currentStreak + 1,
            bestStreak: Math.max(prev.bestStreak, prev.currentStreak + 1),
            lastStudyDate: today.toISOString()
          }));
        }
      } else {
        setStreak({
          currentStreak: 1,
          bestStreak: streak.bestStreak,
          lastStudyDate: today.toISOString()
        });
      }

      // Update stress level based on study time (simplified algorithm)
      // Longer study times might slightly increase stress
      const newStressLevel = Math.min(
        100, 
        Math.max(
          0, 
          stressLevel.level + (minutes > 45 ? 5 : -2)
        )
      );
      
      setStressLevel({
        level: newStressLevel,
        lastUpdated: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Failed to handle study session completion:', error);
    } finally {
      setIsStudyActive(false);
      setSelectedSubject('');
    }
  };

  const handleMoodLog = (mood: string) => {
    const newMoodEntry: MoodEntry = {
      mood,
      timestamp: new Date().toISOString()
    };
    setMoodHistory(prev => [...prev, newMoodEntry]);
  };

  const handleStressUpdate = (newLevel: number) => {
    setStressLevel({
      level: newLevel,
      lastUpdated: new Date().toISOString()
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <GraduationCap className="text-indigo-600" size={28} />
          <h1 className="text-2xl font-bold text-gray-900">StudBud</h1>
        </div>
        <FocusMode isStudyActive={isStudyActive} />
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 font-medium ${activeTab === 'dashboard' 
            ? 'text-indigo-600 border-b-2 border-indigo-600' 
            : 'text-gray-500 hover:text-gray-700'}`}
        >
          Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('moods')}
          className={`px-4 py-2 font-medium ${activeTab === 'moods' 
            ? 'text-indigo-600 border-b-2 border-indigo-600' 
            : 'text-gray-500 hover:text-gray-700'}`}
        >
          Weekly Moods
        </button>
      </div>

      {activeTab === 'dashboard' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <StudyStreakComponent
              streak={streak}
            />
            
            {/* New Stress Level Component */}
            <StressLevelComponent     
            />
          </div>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 mb-4"
                aria-label="Select study subject"
              >
                <option value="">General Study</option>
                {subjects?.map(subject => (
                  <option key={subject.id} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </select>
              <PomodoroTimer 
                onSessionComplete={handleStudySessionComplete}
                onStart={() => setIsStudyActive(true)}
                onStop={() => setIsStudyActive(false)}
              />
            </div>
            
            {/* New Mood Tracker Component */}
            <MoodTrackerComponent onMoodLog={handleMoodLog} />
          </div>
        </div>
      ) : (
        <WeeklyMoodComponent moodHistory={moodHistory} />
      )}
    </div>
  );
}
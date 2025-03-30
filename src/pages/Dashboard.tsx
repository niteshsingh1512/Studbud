import { useState, useEffect } from 'react';
import { StudySession, StudyStreak, Subject } from '../types';
import PomodoroTimer from '../components/PomodoroTimer';
import StudyStreakComponent from '../components/StudyStreak';
import FocusMode from '../components/FocusMode';
import LoadingSpinner from '../components/LoadingSpinner';
import { GraduationCap } from 'lucide-react';
import { getFromStorage, setToStorage } from '../utils/storage';
import StressLevelComponent from '../components/StressLevelComponent';
import MoodTrackerComponent from '../components/MoodTrackerComponent';
import WeeklyMoodComponent from '../components/WeeklyMoodComponent';
import SleepAnalyzer from '../components/SleepAnalyzer';
import CalorieBurnMeter from '../components/CalorieBurntMeter';
import StressAnalyzer from '../components/StressAnalyzer';

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

  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedSubjects, loadedStudyTime, loadedStreak, loadedMoodHistory] = await Promise.all([
          getFromStorage<Subject[]>('subjects', []),
          getFromStorage<StudySession[]>('studyTime', []),
          getFromStorage<StudyStreak>('streak', {
            currentStreak: 0,
            bestStreak: 0,
            lastStudyDate: new Date().toISOString()
          }),
          getFromStorage<MoodEntry[]>('moodHistory', [])
        ]);

        setSubjects(loadedSubjects || []);
        setStudyTime(loadedStudyTime || []);
        setStreak(loadedStreak);
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

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <GraduationCap className="text-indigo-600" size={28} />
          <h1 className="text-2xl font-bold text-gray-900">StudBud</h1>
        </div>
        <FocusMode isStudyActive={isStudyActive} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <StudyStreakComponent streak={streak} />
          <div className="grid grid-cols-2 gap-6">
            <StressLevelComponent />
            <SleepAnalyzer />
            <CalorieBurnMeter />
            <StressAnalyzer />
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 mb-4"
            >
              <option value="">General Study</option>
              {subjects?.map((subject) => (
                <option key={subject.id} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
            <PomodoroTimer
              onSessionComplete={() => {}}
              onStart={() => setIsStudyActive(true)}
              onStop={() => setIsStudyActive(false)}
            />
          </div>
          <MoodTrackerComponent
            onMoodLog={(mood) =>
              setMoodHistory((prev) => [...prev, { mood, timestamp: new Date().toISOString() }])
            }
          />
        </div>
      </div>
    </div>
  );
}
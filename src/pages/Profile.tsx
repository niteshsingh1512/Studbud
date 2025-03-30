import React, { useState, useEffect } from 'react';
import { Bell, User, Calendar, Zap, Heart, BookOpen, Coffee, Coins, Star, Trophy, CheckSquare, Menu, Plus, X } from 'lucide-react';

const StressManagementProfile = () => {
  const [profile, setProfile] = useState({
    name: 'Nitesh Singh',
    email: 'niteshsingh1512ask@gmail.com',
    avatar: null as string | null,
    bio: "I'm a third-year Computer Science student trying to balance coursework, internship applications, and a healthy lifestyle.",
    coins: 24,
    streak: 3,
    lastLogin: null as string | null,
    weeklyProgress: [
      { day: 'Mon', stressLevel: 7, sleepHours: 6, loginReward: true },
      { day: 'Tue', stressLevel: 6, sleepHours: 7, loginReward: true },
      { day: 'Wed', stressLevel: 8, sleepHours: 5, loginReward: true },
      { day: 'Thu', stressLevel: 5, sleepHours: 8, loginReward: false },
      { day: 'Fri', stressLevel: 4, sleepHours: 7, loginReward: false },
      { day: 'Sat', stressLevel: 3, sleepHours: 9, loginReward: false },
      { day: 'Sun', stressLevel: 6, sleepHours: 7, loginReward: false }
    ],
    goals: [
      { id: 1, text: "Meditate for 10 minutes daily", completed: true },
      { id: 2, text: "Get 7-8 hours of sleep", completed: false },
      { id: 3, text: "Take breaks every 45 minutes", completed: true }
    ],
    calmingActivities: ['Deep breathing', 'Nature walks', 'Journaling'],
    rewardHistory: [
      { date: '2025-03-23', reward: 1, reason: 'Daily Login' },
      { date: '2025-03-24', reward: 1, reason: 'Daily Login' },
      { date: '2025-03-25', reward: 1, reason: 'Daily Login' },
      { date: '2025-03-27', reward: 5, reason: 'Completed all goals' },
      { date: '2025-03-30', reward: 1, reason: 'Daily Login' }
    ]
  });

  const [showRewardModal, setShowRewardModal] = useState(false);
  const [currentDate] = useState(new Date());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Check for daily login reward on component mount
  useEffect(() => {
    checkDailyReward();
  }, []);
  
  const checkDailyReward = () => {
    const today = new Date().toISOString().split('T')[0];
    const lastLogin = profile.lastLogin;
    
    // If last login was not today
    if (lastLogin !== today) {
      setProfile(prev => ({
        ...prev,
        lastLogin: today,
        coins: prev.coins + 1,
        streak: lastLogin ? 
          (new Date(lastLogin).getTime() + 86400000 >= new Date(today).getTime() ? 
            prev.streak + 1 : 1) : 1,
        rewardHistory: [
          { date: today, reward: 1, reason: 'Daily Login' },
          ...prev.rewardHistory
        ]
      }));
      setShowRewardModal(true);
    }
  };

  const addCalmingActivity = (activity: string): void => {
    if (activity && !profile.calmingActivities.includes(activity)) {
      setProfile((prev: Profile) => ({
        ...prev,
        calmingActivities: [...prev.calmingActivities, activity]
      }));
    }
  };

  interface Profile {
    name: string;
    email: string;
    avatar: string | null;
    bio: string;
    coins: number;
    streak: number;
    lastLogin: string | null;
    weeklyProgress: WeeklyProgress[];
    goals: Goal[];
    calmingActivities: string[];
    rewardHistory: Reward[];
  }

  interface WeeklyProgress {
    day: string;
    stressLevel: number;
    sleepHours: number;
    loginReward: boolean;
  }

  interface Goal {
    id: number;
    text: string;
    completed: boolean;
  }

  interface Reward {
    date: string;
    reward: number;
    reason: string;
  }

  const removeActivity = (activityToRemove: string): void => {
    setProfile((prev: Profile) => ({
      ...prev,
      calmingActivities: prev.calmingActivities.filter((activity) => activity !== activityToRemove)
    }));
  };

  const toggleGoalCompletion = (goalId: number): void => {
    setProfile({
      ...profile,
      goals: profile.goals.map((goal: Goal) => 
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
      )
    });
  };

  const getCurrentMonth = () => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    return monthNames[currentDate.getMonth()];
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getCalendarDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    
    // Add empty cells for days before the first of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, hasReward: false });
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const hasReward = profile.rewardHistory.some(reward => reward.date === dateString);
      days.push({ day: i, hasReward });
    }
    
    return days;
  };

  const avgStressLevel = Math.round(profile.weeklyProgress.reduce((sum, day) => sum + day.stressLevel, 0) / profile.weeklyProgress.length);
  const avgSleepHours = (profile.weeklyProgress.reduce((sum, day) => sum + day.sleepHours, 0) / profile.weeklyProgress.length).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm px-4 py-3 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-teal-700">Profile</h1>
          </div>
       
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full">
              <Coins size={16} />
              <span className="font-medium">{profile.coins}</span>
            </div>
            <div className="flex items-center gap-2 bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-full">
              <Star size={16} />
              <span className="font-medium">{profile.streak} days</span>
            </div>
           
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
              <Menu size={24} className="text-gray-700" />
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20">
          <div className="h-full w-64 bg-white p-4 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-teal-700">Menu</h2>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={20} className="text-gray-700" />
              </button>
            </div>
            <button className="py-3 px-4 text-left hover:bg-gray-100 rounded-lg mb-2">Dashboard</button>
            <button className="py-3 px-4 text-left hover:bg-gray-100 rounded-lg mb-2">Activities</button>
            <button className="py-3 px-4 text-left hover:bg-gray-100 rounded-lg mb-2">Resources</button>
            <button className="py-3 px-4 text-left hover:bg-gray-100 rounded-lg mb-2">Community</button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-4 py-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Your Wellness Profile</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Personal Information */}
          <div className="space-y-6">
            <div className="p-6 rounded-xl shadow-sm bg-white">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 flex items-center justify-center bg-teal-100">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={32} className="text-teal-600" />
                  )}
                </div>
                <h2 className="text-xl font-semibold">{profile.name}</h2>
                <p className="text-sm text-gray-600">{profile.email}</p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={e => setProfile({...profile, bio: e.target.value})}
                  className="w-full p-3 rounded-lg resize-none h-32 border bg-gray-50 border-gray-200 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>
          </div>
          
          {/* Middle Column - Metrics & Goals */}
          <div className="space-y-6">
            {/* Reward Calendar */}
            <div className="p-6 rounded-xl shadow-sm bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Reward Calendar</h3>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 rounded-full text-teal-700">
                  <Calendar size={16} />
                  <span className="text-sm font-medium">{getCurrentMonth()}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={i} className="h-8 flex items-center justify-center text-sm font-medium text-gray-600">
                    {day}
                  </div>
                ))}
                
                {getCalendarDays().map((day, i) => (
                  <div 
                    key={i} 
                    className={`h-10 rounded-lg flex items-center justify-center relative ${
                      !day.day ? '' : day.day === currentDate.getDate() ? 
                      'bg-teal-100 text-teal-800 font-medium border border-teal-300' : 
                      'hover:bg-gray-100'
                    }`}
                  >
                    {day.day && (
                      <>
                        <span>{day.day}</span>
                        {day.hasReward && (
                          <div className="absolute bottom-1 w-3 h-3 bg-amber-400 rounded-full"></div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center mt-3 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                  <span className="text-gray-600">= Daily login reward</span>
                </div>
                <span className="text-teal-600 font-medium cursor-pointer hover:underline" onClick={() => {}}>
                  View all rewards
                </span>
              </div>
            </div>
            
            {/* Weekly Wellness Summary */}
            <div className="p-6 rounded-xl shadow-sm bg-white">
              <h3 className="text-lg font-semibold mb-4">Weekly Wellness Summary</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-gray-50 text-center">
                  <p className="text-sm text-gray-600">Avg. Stress Level</p>
                  <div className="text-2xl font-bold text-indigo-600">{avgStressLevel}/10</div>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 text-center">
                  <p className="text-sm text-gray-600">Avg. Sleep</p>
                  <div className="text-2xl font-bold text-blue-600">{avgSleepHours} hrs</div>
                </div>
              </div>
            </div>
            
            {/* Wellness Goals */}
            <div className="p-6 rounded-xl shadow-sm bg-white">
              <h3 className="text-lg font-semibold mb-4">My Wellness Goals</h3>
              
              <div className="space-y-3 mb-4">
                {profile.goals.map(goal => (
                  <div key={goal.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={goal.completed}
                      onChange={() => toggleGoalCompletion(goal.id)}
                      className="w-5 h-5 rounded border-2 text-teal-500 focus:ring-teal-300"
                    />
                    <span className={goal.completed ? 'line-through text-gray-500' : ''}>{goal.text}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-2 mt-4">
                <input
                  type="text"
                  placeholder="Add a new goal..."
                  className="w-full p-2 rounded-lg border bg-gray-50 border-gray-200 focus:ring-teal-500 focus:border-teal-500"
                  id="newGoal"
                />
                <button 
                  onClick={() => {
                    const input = document.getElementById('newGoal');
                    if (input && (input as HTMLInputElement).value) {
                      setProfile({
                        ...profile,
                        goals: [...profile.goals, { id: Date.now(), text: (input as HTMLInputElement).value, completed: false }]
                      });
                      (input as HTMLInputElement).value = '';
                    }
                  }}
                  className="p-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Right Column - Wellness Tools */}
          <div className="space-y-6">
            {/* Rewards and Achievements */}
            <div className="p-6 rounded-xl shadow-sm bg-white">
              <h3 className="text-lg font-semibold mb-4">Rewards & Achievements</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-amber-100 text-amber-600">
                      <Trophy size={18} />
                    </div>
                    <div>
                      <p className="font-medium">3-Day Streak</p>
                      <p className="text-sm text-gray-600">Login for 7 days to earn bonus coins</p>
                    </div>
                  </div>
                  <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{width: `${(profile.streak / 7) * 100}%`}}></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-green-100 text-green-600">
                      <CheckSquare size={18} />
                    </div>
                    <div>
                      <p className="font-medium">Goal Completion</p>
                      <p className="text-sm text-gray-600">Complete all goals to earn 5 coins</p>
                    </div>
                  </div>
                  <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500" 
                      style={{
                        width: `${(profile.goals.filter(g => g.completed).length / profile.goals.length) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-3">
                <h4 className="font-medium mb-2">Recent Rewards</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {profile.rewardHistory.slice(0, 5).map((reward, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm p-2 hover:bg-gray-50 rounded-md">
                      <span className="text-gray-600">{reward.reason}</span>
                      <div className="flex items-center gap-1">
                        <span>+{reward.reward}</span>
                        <Coins size={12} className="text-amber-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Stress Relief Techniques */}
            <div className="p-6 rounded-xl shadow-sm bg-white">
              <h3 className="text-lg font-semibold mb-4">My Calming Activities</h3>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.calmingActivities.map((activity, i) => (
                  <div key={i} className="px-3 py-1.5 rounded-full text-sm bg-teal-100 text-teal-800 flex items-center gap-1 hover:bg-teal-200 transition-colors">
                    {activity}
                    <button 
                      onClick={() => removeActivity(activity)}
                      className="w-4 h-4 ml-1 rounded-full flex items-center justify-center hover:bg-teal-600 hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add activity..."
                  className="w-full p-2 rounded-lg border bg-gray-50 border-gray-200 focus:ring-teal-500 focus:border-teal-500"
                  id="newActivity"
                />
                <button 
                  onClick={() => {
                    const input = document.getElementById('newActivity');
                    addCalmingActivity((input as HTMLInputElement).value);
                    (input as HTMLInputElement).value = '';
                  }}
                  className="p-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
            
            {/* Daily Schedule */}
            <div className="p-6 rounded-xl shadow-sm bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Today's Schedule</h3>
                <div className="flex items-center gap-1 text-sm font-medium text-teal-700">
                  <Calendar size={16} />
                  <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-gray-50 flex items-center gap-3 border-l-4 border-indigo-500">
                  <div className="p-2 rounded-full bg-indigo-100 text-indigo-600">
                    <BookOpen size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Study Session</p>
                      <span className="text-sm">08:30-10:15</span>
                    </div>
                    <p className="text-sm text-gray-600">Database Systems</p>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-gray-50 flex items-center gap-3 border-l-4 border-green-500">
                  <div className="p-2 rounded-full bg-green-100 text-green-600">
                    <Heart size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Mindfulness Break</p>
                      <span className="text-sm">10:15-10:30</span>
                    </div>
                    <p className="text-sm text-gray-600">Guided meditation</p>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-gray-50 flex items-center gap-3 border-l-4 border-blue-500">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                    <Coffee size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Study Group</p>
                      <span className="text-sm">14:00-16:00</span>
                    </div>
                    <p className="text-sm text-gray-600">AI Project planning</p>
                  </div>
                </div>
                
                <button className="w-full p-2 text-center text-sm font-medium text-teal-700 hover:bg-teal-50 rounded-lg transition-colors mt-2">
                  + Add New Event
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Reward Modal */}
      {showRewardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <div className="text-center mb-4">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins size={36} className="text-amber-500" />
              </div>
              <h3 className="text-xl font-bold">Daily Reward!</h3>
              <p className="text-gray-600 mt-2">Thanks for checking in today!</p>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-4">
              <span>Login Streak</span>
              <div className="flex items-center gap-2">
                <span className="font-bold">{profile.streak} days</span>
                <Star size={16} className="text-amber-500" />
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-6">
              <span>Coins Earned</span>
              <div className="flex items-center gap-2">
                <span className="font-bold">+1</span>
                <Coins size={16} className="text-amber-500" />
              </div>
            </div>
            
            <button 
              onClick={() => setShowRewardModal(false)}
              className="w-full py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
            >
              Claim Reward
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StressManagementProfile;
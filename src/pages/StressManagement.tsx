import { Heart, Music, Coffee, Dumbbell, Pause, Bolt, BookOpen } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StressManagement() {
  const navigate = useNavigate();
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // Function to play sound
  const playSound = (url: string) => {
    if (audio) audio.pause();
    const newAudio = new Audio(url);
    newAudio.play();
    setAudio(newAudio);
  };

  // Quick Exercises
  const exercises = [
    "Stand up and stretch for 2 minutes.",
    "Roll your shoulders backward and forward.",
    "Do 10 jumping jacks!",
    "Rotate your wrists to relax your hands."
  ];

  // Study Tips
  const studyTips = [
    "Use the Pomodoro technique: 25 minutes focus, 5-minute break.",
    "Avoid multitasking. Focus on one subject at a time.",
    "Use active recall: test yourself instead of rereading notes.",
    "Take short breaks to refresh your mind."
  ];

  // Energy Boost Tips
  const energyTips = [
    "Drink a glass of water to stay hydrated.",
    "Take deep breaths for an instant energy boost.",
    "Do a few push-ups or squats to wake yourself up.",
    "Listen to upbeat music for motivation."
  ];

  // Tool Configuration
  const tools = [
    { name: "Breathe Now", icon: <Heart />, action: () => navigate("/breathe-now") }, // Navigate to Breathe Now page
    { name: "Calming Sounds", icon: <Music />, action: () => navigate("/music") }, // Navigate to Calming Sounds page
    { name: "Take a Break", icon: <Pause />, action: () => navigate("/balloon-game") },
    { name: "Energy Tips", icon: <Coffee />, action: () => console.log(energyTips[Math.floor(Math.random() * energyTips.length)]) },
    { name: "Quick Exercise", icon: <Dumbbell />, action: () => navigate("/quick-exercise") },
    { name: "Focus Music", icon: <Music />, action: () => playSound("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3") },
    { name: "Study Tips", icon: <BookOpen />, action: () => console.log(studyTips[Math.floor(Math.random() * studyTips.length)]) },
    { name: "Energy Boost", icon: <Bolt />, action: () => console.log(energyTips[Math.floor(Math.random() * energyTips.length)]) },
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-50 text-gray-900 flex flex-col">
      <h1 className="text-2xl font-semibold mb-4 text-indigo-700">Tools to help you manage stress and focus</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-grow">
        {tools.map((tool) => (
          <button 
            key={tool.name}
            onClick={tool.action}
            className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition h-full"
          >
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full mb-3">{tool.icon}</div>
            <span className="text-sm font-medium">{tool.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

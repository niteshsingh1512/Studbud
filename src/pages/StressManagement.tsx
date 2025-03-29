import { Heart, Music, Coffee, Dumbbell, Pause, Bolt, BookOpen, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function StressManagement() {
  const navigate = useNavigate();
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Function to play sound
  const playSound = (url: string) => {
    if (audio) audio.pause();
    const newAudio = new Audio(url);
    newAudio.play();
    setAudio(newAudio);
  };

  // Stop audio when unmounting
  useEffect(() => {
    return () => {
      if (audio) audio.pause();
    };
  }, [audio]);

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

  // Tool Configuration with descriptions
  const tools = [
    { 
      name: "Breathe Now", 
      icon: <Heart className="w-6 h-6" />, 
      description: "Guided breathing exercises to calm your mind",
      action: () => navigate("/breathe-now"),
      bgColor: "bg-pink-50",
      iconColor: "text-pink-600",
      hoverColor: "hover:bg-pink-100"
    },
    { 
      name: "Calming Sounds", 
      icon: <Music className="w-6 h-6" />, 
      description: "Nature sounds to help you relax and focus",
      action: () => {
        playSound("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
        setActiveTooltip("Playing calming sounds... Click again to restart");
      },
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      hoverColor: "hover:bg-blue-100"
    },
    { 
      name: "Take a Break", 
      icon: <Pause className="w-6 h-6" />, 
      description: "A quick distraction with our balloon game",
      action: () => navigate("/balloon-game"),
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600", 
      hoverColor: "hover:bg-purple-100"
    },
    { 
      name: "Energy Tips", 
      icon: <Coffee className="w-6 h-6" />, 
      description: "Tips to boost your energy when feeling down",
      action: () => setActiveTooltip(energyTips[Math.floor(Math.random() * energyTips.length)]),
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      hoverColor: "hover:bg-amber-100" 
    },
    { 
      name: "Quick Exercise", 
      icon: <Dumbbell className="w-6 h-6" />, 
      description: "Simple exercises you can do at your desk",
      action: () => setActiveTooltip(exercises[Math.floor(Math.random() * exercises.length)]),
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      hoverColor: "hover:bg-green-100"
    },
    { 
      name: "Focus Music", 
      icon: <Music className="w-6 h-6" />, 
      description: "Music to enhance concentration and focus",
      action: () => {
        playSound("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3");
        setActiveTooltip("Playing focus music... Click again to restart");
      },
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
      hoverColor: "hover:bg-indigo-100"
    },
    { 
      name: "Study Tips", 
      icon: <BookOpen className="w-6 h-6" />, 
      description: "Effective study techniques to maximize retention",
      action: () => setActiveTooltip(studyTips[Math.floor(Math.random() * studyTips.length)]),
      bgColor: "bg-cyan-50",
      iconColor: "text-cyan-600",
      hoverColor: "hover:bg-cyan-100"
    },
    { 
      name: "Energy Boost", 
      icon: <Bolt className="w-6 h-6" />, 
      description: "Quick ways to boost your energy and focus",
      action: () => setActiveTooltip(energyTips[Math.floor(Math.random() * energyTips.length)]),
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      hoverColor: "hover:bg-orange-100"
    },
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-50 text-gray-900 flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="text-indigo-600" size={28} />
        <h1 className="text-2xl font-bold text-gray-900">Stress Management Tools</h1>
      </div>
      
      {activeTooltip && (
        <div className="mb-6 relative bg-white p-4 rounded-xl shadow-md border border-gray-100 animate-fadeIn">
          <button 
            onClick={() => setActiveTooltip(null)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
          <p className="text-gray-700 pr-6">{activeTooltip}</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-grow">
        {tools.map((tool) => (
          <button 
            key={tool.name}
            onClick={tool.action}
            className={`flex flex-col items-center justify-center p-6 ${tool.bgColor} border border-gray-200 rounded-xl shadow-sm ${tool.hoverColor} transition duration-300 h-full`}
          >
            <div className={`p-4 ${tool.iconColor} rounded-full mb-4`}>
              {tool.icon}
            </div>
            <span className="text-base font-medium mb-2">{tool.name}</span>
            <p className="text-xs text-gray-500 text-center">{tool.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
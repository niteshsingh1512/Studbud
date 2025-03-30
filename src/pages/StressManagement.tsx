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


  // Tool Configuration with descriptions
  const tools = [
    { name: "Breathe Now", icon: <Heart />, action: () => navigate("/breathe-now") }, // Navigate to Breathe Now page
    { name: "Calming Sounds", icon: <Music />, action: () => playSound("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3") },
    { name: "Take a Break", icon: <Pause />, action: () => navigate("/balloon-game") },
    { name: "Energy Tips", icon: <Coffee />, action: () => navigate("/energy-tips") },
    { name: "Quick Exercise", icon: <Dumbbell />, action: () => navigate("/quick-exercise") },
    { name: "Focus Music", icon: <Music />, action: () => playSound("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3") },
    { name: "Study Tips", icon: <BookOpen />, action: () => navigate("/study-tips") },
    { name: "Energy Boost", icon: <Bolt />, action: () => console.log(energyTips[Math.floor(Math.random() * energyTips.length)]) },
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
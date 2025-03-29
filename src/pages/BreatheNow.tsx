import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BreatheNow() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("inhale");
  const [counter, setCounter] = useState(4);
  const [cycle, setCycle] = useState(1);
  const [totalBreaths, setTotalBreaths] = useState(5);
  const [isPaused, setIsPaused] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [audio, setAudio] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const intervalRef = useRef(null);
  
  // Initial setup
  useEffect(() => {
    // Create ambient sound
    const ambientSound = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3");
    ambientSound.volume = 0.4;
    ambientSound.loop = true;
    setAudio(ambientSound);
    
    // Auto-hide instructions after 7 seconds
    const instructionsTimer = setTimeout(() => {
      setShowInstructions(false);
    }, 7000);
    
    return () => {
      if (audio) audio.pause();
      clearTimeout(instructionsTimer);
    };
  }, []);
  
  // Handle breathing cycle
  useEffect(() => {
    if (isPaused) return;
    
    intervalRef.current = setInterval(() => {
      setCounter((prev) => {
        if (prev === 1) {
          if (phase === "inhale") {
            setPhase("hold");
            return 4;
          } else if (phase === "hold") {
            setPhase("exhale");
            return 4;
          } else {
            setPhase("inhale");
            if (cycle < totalBreaths) {
              setCycle((c) => c + 1);
            }
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase, isPaused, cycle, totalBreaths]);
  
  // Handle audio toggle
  const toggleAudio = () => {
    if (!audio) return;
    
    if (isAudioPlaying) {
      audio.pause();
      setIsAudioPlaying(false);
    } else {
      audio.play();
      setIsAudioPlaying(true);
    }
  };
  
  // Handle pause/resume
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  
  // Handle reset
  const resetExercise = () => {
    setPhase("inhale");
    setCounter(4);
    setCycle(1);
    setIsPaused(false);
  };
  
  // Calculate progress percentage
  const progressPercentage = ((cycle - 1) / totalBreaths) * 100 + 
    (phase === "inhale" ? ((4 - counter) / 12) * (100 / totalBreaths) : 
     phase === "hold" ? ((4 - counter) / 12) * (100 / totalBreaths) + ((1 / 3) * (100 / totalBreaths)) : 
     ((4 - counter) / 12) * (100 / totalBreaths) + ((2 / 3) * (100 / totalBreaths)));
  
  // Select background color based on phase - using dashboard indigo/purple color scheme
  const getBackgroundColor = () => {
    switch (phase) {
      case "inhale": return "bg-gradient-to-br from-indigo-400 to-indigo-600";
      case "hold": return "bg-gradient-to-br from-indigo-600 to-purple-500";
      case "exhale": return "bg-gradient-to-br from-purple-500 to-indigo-400";
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 relative overflow-hidden">
      {/* Background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-xl transition-all duration-4000 ${getBackgroundColor()}`}
          style={{
            transform: `translate(-50%, -50%) scale(${phase === "inhale" ? 1.2 : phase === "hold" ? 1.3 : 0.9})`,
          }}
        ></div>
      </div>
      
      {/* Header */}
      <div className="flex justify-between items-center p-6 z-10">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">Back</span>
        </button>
        
        <div className="flex items-center gap-3">
          <button
            onClick={toggleAudio}
            className="p-2 rounded-full hover:bg-indigo-50 transition-colors text-indigo-600"
            aria-label={isAudioPlaying ? "Mute ambient sound" : "Play ambient sound"}
          >
            {isAudioPlaying ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          
          <button
            onClick={togglePause}
            className="p-2 rounded-full hover:bg-indigo-50 transition-colors text-indigo-600"
            aria-label={isPaused ? "Resume breathing exercise" : "Pause breathing exercise"}
          >
            {isPaused ? <Play size={20} /> : <Pause size={20} />}
          </button>
          
          <button
            onClick={resetExercise}
            className="p-2 rounded-full hover:bg-indigo-50 transition-colors text-indigo-600"
            aria-label="Reset breathing exercise"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="flex items-center gap-3 mb-8">
          <GraduationCap className="text-indigo-600" size={28} />
          <h1 className="text-3xl font-bold text-gray-900">Breathe Now</h1>
        </div>
        
        {/* Current phase */}
        <div className="mb-6">
          <p className="text-2xl font-bold mb-2 text-center text-indigo-700">
            {phase === "inhale" ? "Inhale" : phase === "hold" ? "Hold" : "Exhale"}
          </p>
          <p className="text-lg font-medium text-center text-gray-600">
            {phase === "inhale" ? "Through your nose" : phase === "hold" ? "Keep your lungs full" : "Through your mouth"}
          </p>
        </div>
        
        {/* Breathing circle */}
        <div className="relative flex items-center justify-center w-64 h-64 mb-12">
          <div 
            className={`absolute w-full h-full rounded-full transition-all duration-4000 ${getBackgroundColor()}`}
            style={{
              transform: `scale(${phase === "inhale" ? 1.3 : phase === "hold" ? 1.2 : 0.8})`,
              boxShadow: "0 0 40px rgba(79, 70, 229, 0.4)",
            }}
          ></div>
          
          <div className="absolute w-full h-full rounded-full border-4 border-white opacity-30"></div>
          
          <div className="relative z-10 text-white text-5xl font-bold">
            {counter}
          </div>
        </div>
        
        {/* Instructions */}
        <div className={`transition-opacity duration-500 ${showInstructions ? 'opacity-100' : 'opacity-0'} text-center mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-md`}>
          <p className="font-medium mb-3 text-lg text-indigo-700">How to breathe:</p>
          <ul className="text-sm text-left space-y-2 pl-5">
            <li className="flex gap-2 items-center">
              <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1"></div>
              <span><span className="font-medium">Inhale</span> slowly through your nose for 4 seconds</span>
            </li>
            <li className="flex gap-2 items-center">
              <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1"></div>
              <span><span className="font-medium">Hold</span> your breath for 4 seconds</span>
            </li>
            <li className="flex gap-2 items-center">
              <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1"></div>
              <span><span className="font-medium">Exhale</span> gently through your mouth for 4 seconds</span>
            </li>
            <li className="flex gap-2 items-center">
              <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1"></div>
              <span>Repeat for {totalBreaths} cycles</span>
            </li>
          </ul>
        </div>
        
        {/* Progress bar */}
        <div className="w-full max-w-md h-3 bg-gray-100 rounded-full mb-4">
          <div 
            className="h-full bg-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        {/* Counter */}
        <div className="flex items-center justify-between w-full max-w-md mb-8">
          <p className="text-sm font-medium text-gray-600">Cycle {cycle} of {totalBreaths}</p>
          <div className="flex gap-1">
            {Array.from({ length: totalBreaths }).map((_, index) => (
              <div 
                key={index} 
                className={`w-3 h-3 rounded-full ${index < cycle ? 'bg-indigo-600' : 'bg-gray-200'}`}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Results */}
        {cycle > totalBreaths && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center max-w-md animate-fadeIn">
            <h2 className="text-xl font-bold mb-3 text-green-600">Great job!</h2>
            <p className="mb-4">You've completed {totalBreaths} cycles of deep breathing.</p>
            <p className="text-sm mb-6 text-gray-600">Deep breathing can help reduce stress, improve focus, and bring a sense of calm.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={resetExercise} 
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Start Again
              </button>
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Return
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Stress level indicator */}
      <div className="w-full max-w-md mx-auto mb-8">
        <p className="text-sm font-medium text-gray-600 mb-2">Stress Level</p>
        <div className="relative h-2 bg-gray-100 rounded-full">
          <div 
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-red-500 rounded-full"
            style={{ width: '100%' }}
          ></div>
          <div 
            className="absolute w-4 h-4 bg-white border-2 border-indigo-600 rounded-full -mt-1 transform -translate-x-1/2"
            style={{ left: `${35}%` }}
          ></div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-4 text-center text-xs text-gray-400">
        Take a moment to focus on your breathing and relieve stress
      </div>
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes breathe-in {
          0% { transform: scale(0.9); }
          100% { transform: scale(1.3); }
        }
        
        @keyframes breathe-hold {
          0% { transform: scale(1.3); }
          100% { transform: scale(1.2); }
        }
        
        @keyframes breathe-out {
          0% { transform: scale(1.2); }
          100% { transform: scale(0.9); }
        }
        
        .duration-4000 {
          transition-duration: 4000ms;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// Added GraduationCap icon from lucide-react to match the dashboard
import { GraduationCap } from "lucide-react";
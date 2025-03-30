import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Pause, Play, RotateCcw, Volume2, VolumeX, GraduationCap, Settings, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BreatheNow() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("inhale");
  const [counter, setCounter] = useState(4);
  const [cycle, setCycle] = useState(1);
  const [totalBreaths, setTotalBreaths] = useState(5);
  const [inhaleTime, setInhaleTime] = useState(4);
  const [holdTime, setHoldTime] = useState(4);
  const [exhaleTime, setExhaleTime] = useState(4);
  const [isPaused, setIsPaused] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [stressLevel, setStressLevel] = useState(35);
  const [stressLevelBefore, setStressLevelBefore] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const stressSliderRef = useRef(null);
  
  // Handle initial mounting
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  // Initial setup
  useEffect(() => {
    if (!isMounted) return;
    
    // Create ambient sound
    const ambientSound = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3");
    ambientSound.volume = 0.4;
    ambientSound.loop = true;
    setAudio(ambientSound);
    
    // Auto-hide instructions after 7 seconds
    const instructionsTimer = setTimeout(() => {
      setShowInstructions(false);
    }, 7000);
    
    // Capture initial stress level
    setStressLevelBefore(stressLevel);
    
    // Load saved preferences
    const savedPreferences = localStorage.getItem("breatheNowPreferences");
    if (savedPreferences) {
      try {
        const { inhale, hold, exhale, cycles } = JSON.parse(savedPreferences);
        setInhaleTime(inhale || 4);
        setHoldTime(hold || 4);
        setExhaleTime(exhale || 4);
        setTotalBreaths(cycles || 5);
      } catch (e) {
        console.error("Failed to load preferences:", e);
      }
    }
    
    return () => {
      if (audio) audio.pause();
      clearTimeout(instructionsTimer);
    };
  }, [isMounted]);
  
  // Handle breathing cycle
  useEffect(() => {
    if (isPaused || !isMounted) return;
    
    const getCurrentPhaseTime = () => {
      switch (phase) {
        case "inhale": return inhaleTime;
        case "hold": return holdTime;
        case "exhale": return exhaleTime;
        default: return 4;
      }
    };
    
    intervalRef.current = setInterval(() => {
      setCounter((prev) => {
        if (prev === 1) {
          if (phase === "inhale") {
            setPhase("hold");
            return holdTime;
          } else if (phase === "hold") {
            setPhase("exhale");
            return exhaleTime;
          } else {
            setPhase("inhale");
            if (cycle < totalBreaths) {
              setCycle((c) => c + 1);
            } else if (cycle === totalBreaths) {
              // Update stress level when complete
              setStressLevel(prev => Math.max(prev - 15, 0));
              setCycle(c => c + 1);
            }
            return inhaleTime;
          }
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase, isPaused, cycle, totalBreaths, inhaleTime, holdTime, exhaleTime, isMounted]);
  
  // Handle audio toggle
  const toggleAudio = () => {
    if (!audio) return;
    
    if (isAudioPlaying) {
      audio.pause();
      setIsAudioPlaying(false);
    } else {
      audio.play().catch(err => {
        console.error("Failed to play audio:", err);
        // Show user-friendly error
        alert("Unable to play audio. Please try again or check your device settings.");
      });
      setIsAudioPlaying(true);
    }
  };
  
  // Handle pause/resume
  const togglePause = () => {
    setIsPaused(prev => !prev);
  };
  
  // Handle reset
  const resetExercise = () => {
    setPhase("inhale");
    setCounter(inhaleTime);
    setCycle(1);
    setIsPaused(false);
    // Reset stress level to initial value
    setStressLevel(stressLevelBefore || 35);
  };
  
  // Save preferences
  const savePreferences = () => {
    const preferences = {
      inhale: inhaleTime,
      hold: holdTime,
      exhale: exhaleTime,
      cycles: totalBreaths
    };
    
    localStorage.setItem("breatheNowPreferences", JSON.stringify(preferences));
    setShowSettings(false);
  };
  
  // Handle stress level change
  interface StressLevelChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

  const handleStressLevelChange = (e: StressLevelChangeEvent): void => {
    setStressLevel(parseInt(e.target.value, 10));
  };
  
  // Calculate progress percentage
  const progressPercentage = () => {
    const totalTime = inhaleTime + holdTime + exhaleTime;
    const cycleProgress = 
      phase === "inhale" ? ((inhaleTime - counter) / totalTime) : 
      phase === "hold" ? ((inhaleTime + (holdTime - counter)) / totalTime) : 
      ((inhaleTime + holdTime + (exhaleTime - counter)) / totalTime);
    
    // If we've completed all cycles, return 100%
    if (cycle > totalBreaths) return 100;
    
    // Calculate percentage based on completed cycles and current progress
    return ((cycle - 1) / totalBreaths) * 100 + (cycleProgress * (100 / totalBreaths));
  };
  
  // Select background color based on phase
  const getBackgroundColor = () => {
    switch (phase) {
      case "inhale": return "bg-gradient-to-br from-indigo-400 to-indigo-600";
      case "hold": return "bg-gradient-to-br from-indigo-600 to-purple-500";
      case "exhale": return "bg-gradient-to-br from-purple-500 to-indigo-400";
      default: return "bg-gradient-to-br from-indigo-400 to-indigo-600";
    }
  };
  
  // Get animation class based on phase
  const getAnimationClass = () => {
    switch (phase) {
      case "inhale": return "animate-breathe-in";
      case "hold": return "animate-breathe-hold";
      case "exhale": return "animate-breathe-out";
      default: return "";
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 relative overflow-hidden">
      {/* Background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 rounded-full opacity-20 blur-xl ${getBackgroundColor()} ${getAnimationClass()}`}
        ></div>
      </div>
      
      {/* Header */}
      <div className="flex justify-between items-center p-4 md:p-6 z-10">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">Back</span>
        </button>
        
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={toggleAudio}
            className="p-2 rounded-full hover:bg-indigo-50 transition-colors text-indigo-600"
            aria-label={isAudioPlaying ? "Mute ambient sound" : "Play ambient sound"}
            title={isAudioPlaying ? "Mute ambient sound" : "Play ambient sound"}
          >
            {isAudioPlaying ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          
          <button
            onClick={togglePause}
            className="p-2 rounded-full hover:bg-indigo-50 transition-colors text-indigo-600"
            aria-label={isPaused ? "Resume breathing exercise" : "Pause breathing exercise"}
            title={isPaused ? "Resume" : "Pause"}
          >
            {isPaused ? <Play size={20} /> : <Pause size={20} />}
          </button>
          
          <button
            onClick={resetExercise}
            className="p-2 rounded-full hover:bg-indigo-50 transition-colors text-indigo-600"
            aria-label="Reset breathing exercise"
            title="Reset"
          >
            <RotateCcw size={20} />
          </button>
          
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-full hover:bg-indigo-50 transition-colors text-indigo-600"
            aria-label="Open settings"
            title="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6">
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <GraduationCap className="text-indigo-600" size={28} />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Breathe Now</h1>
        </div>
        
        {/* Current phase */}
        <div className="mb-4 md:mb-6">
          <p className="text-xl md:text-2xl font-bold mb-1 md:mb-2 text-center text-indigo-700">
            {phase === "inhale" ? "Inhale" : phase === "hold" ? "Hold" : "Exhale"}
          </p>
          <p className="text-base md:text-lg font-medium text-center text-gray-600">
            {phase === "inhale" ? "Through your nose" : phase === "hold" ? "Keep your lungs full" : "Through your mouth"}
          </p>
        </div>
        
        {/* Breathing circle */}
        <div className="relative flex items-center justify-center w-48 h-48 md:w-64 md:h-64 mb-8 md:mb-12">
          <div 
            className={`absolute w-full h-full rounded-full transition-all duration-1000 ${getBackgroundColor()}`}
            style={{
              transform: `scale(${phase === "inhale" ? 1.3 : phase === "hold" ? 1.2 : 0.8})`,
              boxShadow: "0 0 40px rgba(79, 70, 229, 0.4)",
            }}
          ></div>
          
          <div className="absolute w-full h-full rounded-full border-4 border-white opacity-30"></div>
          
          <div className="relative z-10 text-white text-4xl md:text-5xl font-bold">
            {counter}
          </div>
        </div>
        
        {/* Instructions */}
        <div 
          className={`transition-opacity duration-500 ${showInstructions ? 'opacity-100' : 'opacity-0'} 
            text-center mb-6 md:mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 max-w-md`}
        >
          <p className="font-medium mb-2 md:mb-3 text-base md:text-lg text-indigo-700">How to breathe:</p>
          <ul className="text-sm text-left space-y-2 pl-5">
            <li className="flex gap-2 items-center">
              <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1"></div>
              <span><span className="font-medium">Inhale</span> slowly through your nose for {inhaleTime} seconds</span>
            </li>
            <li className="flex gap-2 items-center">
              <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1"></div>
              <span><span className="font-medium">Hold</span> your breath for {holdTime} seconds</span>
            </li>
            <li className="flex gap-2 items-center">
              <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1"></div>
              <span><span className="font-medium">Exhale</span> gently through your mouth for {exhaleTime} seconds</span>
            </li>
            <li className="flex gap-2 items-center">
              <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1"></div>
              <span>Repeat for {totalBreaths} cycles</span>
            </li>
          </ul>
          <button 
            onClick={() => setShowInstructions(false)}
            className="mt-3 text-xs text-indigo-600 hover:text-indigo-800"
          >
            Hide instructions
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="w-full max-w-md h-3 bg-gray-100 rounded-full mb-2 md:mb-4">
          <div 
            className="h-full bg-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage()}%` }}
            role="progressbar"
            aria-valuenow={progressPercentage()}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Breathing exercise progress"
          ></div>
        </div>
        
        {/* Counter */}
        <div className="flex items-center justify-between w-full max-w-md mb-6 md:mb-8">
          <p className="text-sm font-medium text-gray-600">
            {cycle > totalBreaths ? "Complete!" : `Cycle ${cycle} of ${totalBreaths}`}
          </p>
          <div className="flex gap-1">
            {Array.from({ length: totalBreaths }).map((_, index) => (
              <div 
                key={index} 
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${index < cycle ? 'bg-indigo-600' : 'bg-gray-200'}`}
                role="presentation"
              ></div>
            ))}
          </div>
        </div>
        
        {/* Results */}
        {cycle > totalBreaths && (
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 text-center max-w-md animate-fadeIn">
            <h2 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-green-600">Great job!</h2>
            <p className="mb-3 md:mb-4">You've completed {totalBreaths} cycles of deep breathing.</p>
            <p className="text-sm mb-4 md:mb-6 text-gray-600">Your stress level has decreased by approximately 15%.</p>
            <div className="flex justify-center gap-3 md:gap-4">
              <button
                onClick={resetExercise} 
                className="px-3 py-2 md:px-4 md:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Start Again
              </button>
              <button
                onClick={() => navigate(-1)}
                className="px-3 py-2 md:px-4 md:py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Return
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Stress level indicator */}
      <div className="w-full max-w-md mx-auto mb-6 md:mb-8 px-4">
        <p className="text-sm font-medium text-gray-600 mb-2">Stress Level</p>
        <div className="relative h-2 bg-gray-100 rounded-full">
          <div 
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-red-500 rounded-full"
            style={{ width: '100%' }}
          ></div>
          <div 
            className="absolute w-4 h-4 bg-white border-2 border-indigo-600 rounded-full -mt-1 transform -translate-x-1/2 transition-all duration-300"
            style={{ left: `${stressLevel}%` }}
            ref={stressSliderRef}
          ></div>
          
          {cycle <= totalBreaths && (
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={stressLevel} 
              onChange={handleStressLevelChange}
              className="absolute w-full h-6 opacity-0 cursor-pointer" 
              aria-label="Adjust stress level"
            />
          )}
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-3 md:p-4 text-center text-xs text-gray-400">
        Take a moment to focus on your breathing and relieve stress
      </div>
      
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-4 md:p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Breathing Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="inhaleTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Inhale Duration: {inhaleTime}s
                  </label>
                  <input
                    id="inhaleTime"
                    type="range"
                    min="2"
                    max="8"
                    value={inhaleTime}
                    onChange={(e) => setInhaleTime(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
                
                <div>
                  <label htmlFor="holdTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Hold Duration: {holdTime}s
                  </label>
                  <input
                    id="holdTime"
                    type="range"
                    min="2"
                    max="8"
                    value={holdTime}
                    onChange={(e) => setHoldTime(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
                
                <div>
                  <label htmlFor="exhaleTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Exhale Duration: {exhaleTime}s
                  </label>
                  <input
                    id="exhaleTime"
                    type="range"
                    min="2"
                    max="8"
                    value={exhaleTime}
                    onChange={(e) => setExhaleTime(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
                
                <div>
                  <label htmlFor="totalBreaths" className="block text-sm font-medium text-gray-700 mb-1">
                    Total Breath Cycles: {totalBreaths}
                  </label>
                  <input
                    id="totalBreaths"
                    type="range"
                    min="3"
                    max="10"
                    value={totalBreaths}
                    onChange={(e) => setTotalBreaths(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={savePreferences}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <Check size={16} />
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Custom CSS for animations */}
      <style>{`
        @keyframes breathe-in {
          0% { transform: scale(0.8); }
          100% { transform: scale(1.3); }
        }
        
        @keyframes breathe-hold {
          0% { transform: scale(1.3); }
          100% { transform: scale(1.2); }
        }
        
        @keyframes breathe-out {
          0% { transform: scale(1.2); }
          100% { transform: scale(0.8); }
        }
        
        .animate-breathe-in {
          animation: breathe-in ${inhaleTime}s ease-in-out forwards;
        }
        
        .animate-breathe-hold {
          animation: breathe-hold ${holdTime}s ease-in-out forwards;
        }
        
        .animate-breathe-out {
          animation: breathe-out ${exhaleTime}s ease-in-out forwards;
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
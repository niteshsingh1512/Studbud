import { useState, useEffect } from "react";

export default function BreatheNow() {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [counter, setCounter] = useState(4); // 4s per phase
  const [cycle, setCycle] = useState(1);
  
  useEffect(() => {
    const interval = setInterval(() => {
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
            setCycle((c) => c + 1);
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-indigo-50 text-indigo-800">
      <h1 className="text-2xl font-bold mb-6">Breathe Now</h1>

      <div className="relative flex items-center justify-center w-32 h-32">
        <div 
          className={`absolute w-full h-full rounded-full transition-all duration-1000 
            ${phase === "inhale" ? "scale-125 bg-indigo-300" : phase === "hold" ? "bg-indigo-400" : "scale-75 bg-indigo-200"}`}
        ></div>
      </div>

      <p className="text-lg font-semibold mt-4">
        {phase === "inhale" ? "Inhale" : phase === "hold" ? "Hold" : "Exhale"}
      </p>
      <p className="text-2xl">{counter}s</p>
      <p className="text-sm text-gray-600 mt-2">Cycle {cycle} / 5</p>

      {cycle >= 5 && <p className="mt-4 text-green-600">You’re done! Feeling better? 😊</p>}
    </div>
  );
}

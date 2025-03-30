import { useState, useEffect } from "react";
import { Bolt } from "lucide-react";
import water from "../assests/water.gif";
import Pushup from "../assests/pushup1.gif";
import breath from "../assests/breath.gif";
import music from "../assests/music.gif";

const energyTips = [
  { text: "Drink a glass of water to stay hydrated!", image: water },
  { text: "Take deep breaths for an instant energy boost!", image: breath },
  { text: "Do 10 push-ups or squats to wake up your body!", image: Pushup },
  { text: "Listen to upbeat music for motivation!", image: music },
];

export default function EnergyTips() {
  const [currentTip, setCurrentTip] = useState(energyTips[0]);

  const getRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * energyTips.length);
    setCurrentTip(energyTips[randomIndex]);
  };

  useEffect(() => {
    const interval = setInterval(getRandomTip, 30000); // Auto-refresh every 30 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center text-center">
      <button
        onClick={getRandomTip}
        className="flex items-center gap-3 p-4 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition"
      >
        <Bolt />
        <span>Get an Energy Tip</span>
      </button>
      <div className="mt-4 p-4 bg-white shadow-lg rounded-lg max-w-md">
        <h2 className="text-lg font-bold text-yellow-600">Energy Tip</h2>
        <p className="text-gray-700 mt-2">{currentTip.text}</p>
        <img
          src={currentTip.image}
          alt="Energy Tip"
          className="mt-3 w-40 h-40 object-cover mx-auto rounded-md shadow-md"
        />
      </div>
    </div>
  );
}

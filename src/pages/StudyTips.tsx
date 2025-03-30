import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";

import pomodoro from "../assests/Pomodoro.jpeg";
import focus from "../assests/Focus.gif";
import recall from "../assests/Recall.gif";
import breaktime from "../assests/breaktime.jpeg";

const studyTips = [
  { text: "Use the Pomodoro technique: 25 minutes of focus, 5-minute break.", image: pomodoro },
  { text: "Avoid multitasking. Focus on one subject at a time.", image: focus },
  { text: "Use active recall: test yourself instead of rereading notes.", image: recall },
  { text: "Take short breaks to refresh your mind.", image: breaktime },
];

export default function StudyTips() {
  const [currentTip, setCurrentTip] = useState(studyTips[0]);

  const getRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * studyTips.length);
    setCurrentTip(studyTips[randomIndex]);
  };

  useEffect(() => {
    const interval = setInterval(getRandomTip, 30000); // Auto-refresh every 30 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center text-center">
      <button
        onClick={getRandomTip}
        className="flex items-center gap-3 p-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
      >
        <BookOpen />
        <span>Get a Study Tip</span>
      </button>
      <div className="mt-4 p-4 bg-white shadow-lg rounded-lg max-w-md">
        <h2 className="text-lg font-bold text-blue-600">Study Tip</h2>
        <p className="text-gray-700 mt-2">{currentTip.text}</p>
        <img
          src={currentTip.image}
          alt="Study Tip"
          className="mt-3 w-40 h-40 object-cover mx-auto rounded-md shadow-md"
        />
      </div>
    </div>
  );
}

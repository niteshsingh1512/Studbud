import { useState } from "react";
import { Dumbbell } from "lucide-react";
import Squat from "../assests/squats.gif";
import Pushup from "../assests/pushup1.gif";
import ShoulderRoll from "../assests/Shoulderroll.gif";
import JumpingJacks from "../assests/jumping.gif";

interface Exercise {
  name: string;
  description: string;
  duration: number; // in seconds
  animation: string; // GIF showing the movement
}

const exercises: Exercise[] = [
  {
    name: "Jumping Jacks",
    description: "A great full-body warm-up exercise.",
    duration: 30,
    animation: JumpingJacks,
  },
  {
    name: "Push-ups",
    description: "Strengthen your upper body and core.",
    duration: 20,
    animation: Pushup,
  },
  {
    name: "Squats",
    description: "Engage your legs and glutes.",
    duration: 25,
    animation: Squat,
  },
  {
    name: "Shoulder Rolls",
    description: "Relax your shoulders and improve posture.",
    duration: 15,
    animation: ShoulderRoll,
  },
];

export default function QuickExercise() {
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const startExercise = () => {
    const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
    setCurrentExercise(randomExercise);
    setTimeLeft(randomExercise.duration);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={startExercise}
        className="flex items-center gap-3 px-6 py-3 bg-indigo-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-indigo-600 transition"
      >
        <Dumbbell size={24} />
        <span>Start Quick Exercise</span>
      </button>

      {currentExercise && (
        <div className="mt-6 p-6 bg-white shadow-lg rounded-lg text-center max-w-sm flex flex-col items-center">
          <h2 className="text-xl font-bold text-indigo-700">{currentExercise.name}</h2>
          <p className="text-gray-600">{currentExercise.description}</p>

          {/* GIF Animation */}
          <img
            src={currentExercise.animation}
            alt={currentExercise.name}
            className="mt-4 w-48 h-48 object-contain rounded-lg shadow-md"
          />

          {/* Countdown Timer */}
          {timeLeft !== null && (
            <p className="mt-3 text-lg font-semibold text-red-600">Time Left: {timeLeft}s</p>
          )}
        </div>
      )}
    </div>
  );
}

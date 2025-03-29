import { useState } from "react";
import { Dumbbell } from "lucide-react";

interface Exercise {
  name: string;
  description: string;
  duration: number; // in seconds
  animation: string; // Link to GIF or Lottie animation
}

const exercises: Exercise[] = [
  {
    name: "Jumping Jacks",
    description: "A great full-body warm-up exercise.",
    duration: 30,
    animation: "https://media.tenor.com/U4Pt9p4OHM4AAAAC/jumping-jacks.gif",
  },
  {
    name: "Push-ups",
    description: "Strengthen your upper body and core.",
    duration: 20,
    animation: "https://media.tenor.com/3uvjwGFwRRoAAAAC/push-ups.gif",
  },
  {
    name: "Squats",
    description: "Engage your legs and glutes.",
    duration: 25,
    animation: "https://media.tenor.com/Mvhcv-kIT7sAAAAC/squat-exercise.gif",
  },
  {
    name: "Shoulder Rolls",
    description: "Relax your shoulders and improve posture.",
    duration: 15,
    animation: "https://media.tenor.com/bLkYEKqPT00AAAAd/neck-roll.gif",
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
        className="flex items-center gap-3 p-4 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 transition"
      >
        <Dumbbell />
        <span>Quick Exercise</span>
      </button>

      {currentExercise && (
        <div className="mt-4 p-4 bg-white shadow-lg rounded-lg text-center">
          <h2 className="text-lg font-bold text-indigo-600">{currentExercise.name}</h2>
          <p className="text-gray-600">{currentExercise.description}</p>
          <img src={currentExercise.animation} alt={currentExercise.name} className="mt-2 w-40 h-40 object-cover" />
          {timeLeft !== null && <p className="mt-2 text-red-600 font-semibold">Time Left: {timeLeft}s</p>}
        </div>
      )}
    </div>
  );
}

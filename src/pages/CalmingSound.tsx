import { useState } from "react";
import { Music, PauseCircle, PlayCircle } from "lucide-react";
import rain from "../../public/sounds/Rainfall 5 Minute Meditation.mp3"

const sounds = [
  { name: "Rain", url: rain },
  { name: "Ocean Waves", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { name: "Birds Chirping", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

export default function CalmingSounds() {
  const [currentSound, setCurrentSound] = useState<HTMLAudioElement | null>(null);
  const [playingSound, setPlayingSound] = useState<string | null>(null);

  const playSound = (soundName: string, soundUrl: string) => {
    if (currentSound) {
      currentSound.pause();
    }
    const newAudio = new Audio(soundUrl);
    newAudio.loop = true;
    newAudio.play();
    setCurrentSound(newAudio);
    setPlayingSound(soundName);
  };

  const stopSound = () => {
    if (currentSound) {
      currentSound.pause();
      setCurrentSound(null);
      setPlayingSound(null);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold text-indigo-700 mb-3">Calming Sounds</h2>

      <div className="grid grid-cols-2 gap-4">
        {sounds.map((sound) => (
          <button
            key={sound.name}
            onClick={() => playSound(sound.name, sound.url)}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg shadow-md transition ${
              playingSound === sound.name ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            <Music size={20} />
            <span>{sound.name}</span>
          </button>
        ))}
      </div>

      {playingSound && (
        <button
          onClick={stopSound}
          className="mt-4 flex items-center gap-3 px-5 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
        >
          <PauseCircle size={22} />
          <span>Stop Sound</span>
        </button>
      )}
    </div>
  );
}

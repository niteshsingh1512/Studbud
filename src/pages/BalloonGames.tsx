import { useEffect, useRef, useState } from "react";

interface Balloon {
  x: number;
  y: number;
  radius: number;
  color: string;
  speed: number;
  id: number;
}

export default function BalloonGame({ onGameEnd }: { onGameEnd: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const balloonsRef = useRef<Balloon[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);

  const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];
  let balloonId = 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 500;

    function spawnBalloon() {
      const newBalloon = {
        x: Math.random() * canvas.width,
        y: canvas.height,
        radius: 20 + Math.random() * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: 0 + Math.random() * 3, // Increased speed
        id: balloonId++,
      };
      balloonsRef.current = [...balloonsRef.current, newBalloon];
    }

    function updateBalloons() {
      balloonsRef.current = balloonsRef.current
        .map((b) => ({ ...b, y: b.y - b.speed })) // Moves balloon upwards
        .filter((b) => b.y + b.radius > 0); // Ensures balloon moves off-screen before disappearing
    }

    function drawBalloons() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      balloonsRef.current.forEach((b) => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
        ctx.closePath();
      });
    }

    function gameLoop() {
      if (!gameOver) {
        updateBalloons();
        drawBalloons();
        requestAnimationFrame(gameLoop);
      }
    }

    const spawnInterval = setInterval(spawnBalloon, 600);
    gameLoop();

    return () => clearInterval(spawnInterval);
  }, [gameOver]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setGameOver(true);
      onGameEnd(score);
    }
  }, [timeLeft, score, onGameEnd]);

  function handleClick(event: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    let popped = false;

    balloonsRef.current = balloonsRef.current.filter((b) => {
      const distance = Math.sqrt((b.x - clickX) ** 2 + (b.y - clickY) ** 2);
      if (distance < b.radius) {
        setScore((prevScore) => prevScore + 1);
        popped = true;
        return false;
      }
      return true;
    });

    if (popped) {
      console.log("Balloon popped! Score:", score + 1);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-2">Tap to Pop the Balloons!</h2>
      <p>Time Left: {timeLeft}s</p>
      <p>Score: {score}</p>
      <canvas ref={canvasRef} onClick={handleClick} className="border shadow-lg mt-4 bg-white" />
    </div>
  );
}

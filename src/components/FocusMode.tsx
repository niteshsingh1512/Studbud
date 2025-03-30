import { useState, useEffect, useRef } from 'react';
import { Camera, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  ChartData,
  ChartOptions,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
);

interface FocusModeProps {
  isStudyActive: boolean;
}

export default function FocusMode({ isStudyActive }: FocusModeProps) {
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [movementDetected, setMovementDetected] = useState(false);
  const [noiseData, setNoiseData] = useState<number[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const noiseIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const prevFrameRef = useRef<ImageData | null>(null);

  const chartData: ChartData<'line'> = {
    labels: noiseData.map((_, index) => `${index * 2}s`),
    datasets: [
      {
        label: 'Noise Level',
        data: noiseData,
        borderColor: 'rgb(99, 102, 241)',
        tension: 0.1,
        fill: false,
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: { display: true, text: 'Noise Level (dB)' },
      },
      x: {
        title: { display: true, text: 'Time (seconds)' },
        ticks: { maxTicksLimit: 10 },
      },
    },
  };

  useEffect(() => {
    let stream: MediaStream | null = null;

    const setupCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Camera access denied:', err);
        toast.error('Camera access is required for focus mode');
      }
    };

    const setupAudio = async () => {
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        const source = audioContextRef.current.createMediaStreamSource(audioStream);
        source.connect(analyserRef.current);
        
        analyserRef.current.fftSize = 256;
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const updateNoiseLevel = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setNoiseData(prev => [...prev.slice(-29), average].slice(-30));
        };

        noiseIntervalRef.current = setInterval(updateNoiseLevel, 2000);
      } catch (err) {
        console.error('Microphone access denied:', err);
        toast.error('Microphone access is required for focus mode');
      }
    };

    const detectMovement = () => {
      if (!videoRef.current || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);

      if (prevFrameRef.current) {
        const diffThreshold = 20;
        let movementScore = 0;

        for (let i = 0; i < currentFrame.data.length; i += 4) {
          const rDiff = Math.abs(currentFrame.data[i] - prevFrameRef.current.data[i]);
          const gDiff = Math.abs(currentFrame.data[i + 1] - prevFrameRef.current.data[i + 1]);
          const bDiff = Math.abs(currentFrame.data[i + 2] - prevFrameRef.current.data[i + 2]);
          
          if (rDiff > diffThreshold || gDiff > diffThreshold || bDiff > diffThreshold) {
            movementScore++;
          }
        }

        const movementPercentage = (movementScore / (currentFrame.data.length / 4)) * 100;
        if (movementPercentage > 5) {
          setMovementDetected(true);
          setTimeout(() => setMovementDetected(false), 2000);
        }
      }

      prevFrameRef.current = currentFrame;
      requestAnimationFrame(detectMovement);
    };

    if (isFocusMode && isStudyActive) {
      setupCamera();
      setupAudio();
      setTimeout(() => detectMovement(), 1000);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error);
      }
      if (noiseIntervalRef.current) {
        clearInterval(noiseIntervalRef.current);
      }
      setNoiseData([]);
      prevFrameRef.current = null;
    };
  }, [isFocusMode, isStudyActive]);

  const toggleFocusMode = () => {
    if (!isStudyActive && !isFocusMode) {
      toast.error('Please start a study session first');
      return;
    }
    if (!isFocusMode) {
      toast.success('Focus mode activated with camera and audio monitoring');
    } else {
      toast.success('Focus mode deactivated');
    }
    setIsFocusMode(prev => !prev);
  };

  return (
    <>
      <button
        onClick={toggleFocusMode}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          isFocusMode
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <Camera size={20} />
        Focus Mode
      </button>

      {isFocusMode && isStudyActive && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
          <div className="bg-white w-full h-full relative flex flex-col">
            {/* Close Button */}
            <button
              onClick={toggleFocusMode}
              className="absolute top-4 right-4 p-1 text-gray-600 hover:text-gray-800 z-10"
            >
              <X size={28} />
            </button>

            <div className="flex-1 p-8 flex flex-col lg:flex-row gap-8">
              <div className="flex-1 flex flex-col items-center">
                <div className="relative w-full h-[50vh] bg-gray-100 rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  {movementDetected && (
                    <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center">
                      <span className="text-white font-medium bg-red-600/80 px-6 py-3 rounded-lg text-lg">
                        Movement Detected!
                      </span>
                    </div>
                  )}
                </div>
                {/* <p className="mt-4 text-base text-gray-600">
                  Real-time movement detection using frame differencing
                </p> */}
              </div>

              <div className="flex-1 flex flex-col items-center">
                <div className="w-full h-[50vh] bg-white rounded-lg shadow-sm p-6">
                  <Line data={chartData} options={chartOptions} />
                </div>
                <p className="mt-4 text-base text-gray-600">
                  Noise level monitoring (updated every 2 seconds)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
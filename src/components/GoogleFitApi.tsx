import  { useEffect, useState } from "react";
import axios from "axios";

const CLIENT_ID = "studbud78.apps.googleusercontent.com"; // Replace with your Google OAuth Client ID
const SCOPES = "https://www.googleapis.com/auth/fitness.heart_rate.read"; // Scope for heart rate data

declare global {
    interface Window {
      gapi: any;
    }
  }
  
const GoogleFit = () => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [heartRateData, setHeartRateData] = useState<any[]>([]);
  const [error, setError] = useState("");

  // Load Google API
  useEffect(() => {
    const loadGoogleAPI = () => {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.async = true;
      script.onload = () => {
        window.gapi.load("client:auth2", initializeGapiClient);
      };
      document.body.appendChild(script);
    };
    loadGoogleAPI();
  }, []);

  // Initialize Google API client
  const initializeGapiClient = async () => {
    await window.gapi.client.init({
      clientId: CLIENT_ID,
      scope: SCOPES,
    });

    const authInstance = window.gapi.auth2.getAuthInstance();
    if (authInstance.isSignedIn.get()) {
      setAuthToken(authInstance.currentUser.get().getAuthResponse().access_token);
    }
  };

  // Handle Google Login
  const handleSignIn = async () => {
    const authInstance = window.gapi.auth2.getAuthInstance();
    await authInstance.signIn();
    const token = authInstance.currentUser.get().getAuthResponse().access_token;
    setAuthToken(token);
  };

  // Fetch Google Fit Heart Rate Data
  const fetchHeartRate = async () => {
    if (!authToken) {
      setError("Please sign in first.");
      return;
    }

    try {
      const response = await axios.get(
        "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          data: {
            aggregateBy: [
              {
                dataTypeName: "com.google.heart_rate.bpm",
              },
            ],
            bucketByTime: { durationMillis: 60000 }, // 1-minute intervals
            startTimeMillis: Date.now() - 24 * 60 * 60 * 1000, // Last 24 hours
            endTimeMillis: Date.now(),
          },
        }
      );

      if (response.data.bucket.length > 0) {
        const heartRatePoints = response.data.bucket.map((bucket: any) => ({
          timestamp: new Date(bucket.startTimeMillis).toLocaleTimeString(),
          bpm: bucket.dataset[0]?.point[0]?.value[0]?.fpVal || 0,
        }));
        setHeartRateData(heartRatePoints);
      }
    } catch (err) {
      setError("Error fetching Google Fit data.");
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Google Fit Heart Rate Data</h2>

      {!authToken ? (
        <button
          onClick={handleSignIn}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Sign in with Google
        </button>
      ) : (
        <button
          onClick={fetchHeartRate}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Fetch Heart Rate
        </button>
      )}

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {heartRateData.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium text-gray-800 mb-2">Heart Rate Data:</h3>
          <ul className="list-disc pl-4">
            {heartRateData.map((data, index) => (
              <li key={index} className="text-gray-700">
                {data.timestamp} - <strong>{data.bpm} BPM</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GoogleFit;

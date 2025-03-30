# StudBud - Academic Stress Management Platform

StudBud is an AI-driven web application designed to help students manage academic stress and maintain mental wellness during crucial examination periods. By integrating machine learning and real-time data analysis, StudBud offers personalized support, study planning, and stress intervention mechanisms.

## Features

### 📌 Task Manager
- Organize tasks effectively
- Set deadlines and priorities
- Track progress in real-time

### 📚 Subject Manager
- Manage study subjects with color coding
- Set weekly study goals
- Bulk add, edit, and delete subjects

### 🔍 Stress Detection
- Analyze user web activity for stress patterns
- Detect stress levels based on scrolling behavior, mouse movements, and clicks
- Provide intervention strategies based on stress levels

### 🎮 Coin Reward Gamification
- Earn coins for completing tasks and study sessions
- Redeem coins for in-app rewards
- Encourages productivity and positive study habits

### 🤖 AI Assistant Manager
- Provides personalized study recommendations
- Helps manage schedules efficiently
- Offers mental wellness support

### 🧘 Stress Management Activities
- AI-recommended relaxation techniques
- Meditation and breathing exercises
- Music and mindfulness suggestions

### 🎯 Focus Mode
- Detects user's environment using camera and microphone
- Tracks noise levels and movements
- Ensures distraction-free study sessions

### ⌚ Wearable Integration
- Fetches heart rate, calorie expenditure, and sleep hours from wearable devices
- Uses physiological data to assess stress levels and suggest wellness tips

## Tech Stack

### Frontend
- ReactJS

### Backend
- Supabase

### APIs & Libraries
- OpenAI/Gemini for AI Assistant
- TensorFlow.js for environment tracking
- Various wearable APIs for health data integration

## Environment Variables (`.env`)
Ensure you have a `.env` file in the root directory with the following variables:
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_GEMINI_API_KEY=
```

## Installation & Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/niteshsingh1512/Studbud.git
   cd Studbud
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up the environment variables in the `.env` file.

4. Start the development server:
   ```sh
   npm run dev
   ```

## Contributing
We welcome contributions! Feel free to submit pull requests or report issues.

## License
MIT License

---

StudBud - Empowering Students, Reducing Stress! 🚀


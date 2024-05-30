import { useEffect, useState, useRef } from "react";
import "./App.css";

function App() {
  return (
    <>
      <Timer />
    </>
  );
}

function Timer() {
  const [mode, setMode] = useState("countdown");
  const [time, setTime] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const intervalRef = useRef(null);

  // Initialize time based on mode
  useEffect(() => {
    if (mode === "countdown") {
      setTime(60); // Set countdown time to 60 seconds
    } else {
      setTime(0);
    }

    // Cleanup function
    return () => clearInterval(intervalRef.current);
  }, [mode]);

  // Start the timer
  const startTimer = () => {
    if (intervalRef.current !== null) return;

    setIsCounting(true);
    intervalRef.current = setInterval(() => {
      setTime((prevTime) => {
        if (mode === "countdown") {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setIsCounting(false);
            return 0;
          }
          return prevTime - 1;
        } else {
          return prevTime + 1;
        }
      });
    }, 1000);
  };

  // Stop the timer
  const stopTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsCounting(false);
  };

  // Reset the timer
  const resetTimer = () => {
    stopTimer();
    setTime(mode === "countdown" ? 60 : 0);
  };

  // Format time for display
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="timer-container">
      <h1>Simple Timer App</h1>
      <p>Mode: {mode[0].toUpperCase() + mode.slice(1)}</p>
      <p>Time: {formatTime(time)}</p>
      <div>
        <button onClick={() => setMode("countdown")}>Count Down</button>
        <button onClick={() => setMode("stopwatch")}>Stopwatch</button>
        <button onClick={() => setMode("timer")}>Interval</button>
      </div>
      <div>
        <button onClick={isCounting ? stopTimer : startTimer}>
          {isCounting ? `Stop` : `Start`}
        </button>
        {/* <button onClick={startTimer} disabled={isCounting}>
          Start
        </button>
        <button onClick={stopTimer} disabled={!isCounting}>
          Stop
        </button> */}
        <button onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
}

export default App;

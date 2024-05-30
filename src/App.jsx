import { useEffect, useState, useRef } from "react";
import "./App.css";
import useTimer from "./useTimer";

function App() {
  return (
    <>
      <Timer />
    </>
  );
}

function Timer() {
  const [initialTime, setInitialTime] = useState(0);
  const [timeInput, setTimeInput] = useState(0);
  const [workTimeInput, setWorkTimeInput] = useState(1800);
  const [restTimeInput, setRestTimeInput] = useState(300);
  const {
    mode,
    setMode,
    time,
    isCounting,
    startTimer,
    stopTimer,
    resetTimer,

    intervalPhase,
  } = useTimer("countdown", initialTime, workTimeInput, restTimeInput);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const getCircleStyle = (time, initialTime) => {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset =
      initialTime > 0
        ? circumference - (time / initialTime) * circumference
        : circumference;
    return {
      strokeDasharray: `${circumference} ${circumference}`,
      strokeDashoffset: offset,
    };
  };

  function handlerSetTime() {
    setInitialTime(Number(timeInput));
  }

  const circleStyle = getCircleStyle(time, initialTime);

  return (
    <div className="timer-container">
      <h1>Simple Timer App</h1>
      <p>Mode: {mode[0].toUpperCase() + mode.slice(1)}</p>
      {mode === "interval" && <p>{intervalPhase.toUpperCase()}</p>}
      <div className="circle-timer">
        <svg className="timer-svg" width="120" height="120">
          <circle
            className="timer-circle"
            cx="60"
            cy="60"
            r="54"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            style={circleStyle}
          />
        </svg>
        <div className="timer-text">{formatTime(time)}</div>
      </div>
      <div>
        {mode !== "stopwatch" && (
          <>
            <input
              placeholder="Set Time"
              onChange={(e) =>
                mode === "countdown"
                  ? setTimeInput(Number(e.target.value))
                  : setWorkTimeInput(Number(e.target.value))
              }
            />
            {mode === "interval" && (
              <input
                onChange={(e) => setRestTimeInput(Number(e.target.value))}
              />
            )}
            <button onClick={handlerSetTime}>Submit</button>
          </>
        )}
      </div>
      <div>
        <button onClick={() => setMode("countdown")}>Count Down</button>
        <button onClick={() => setMode("stopwatch")}>Stopwatch</button>
        <button onClick={() => setMode("interval")}>Interval</button>
      </div>
      <div>
        <button onClick={isCounting ? stopTimer : startTimer}>
          {isCounting ? `Stop` : `Start`}
        </button>
        <button onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
}

export default App;

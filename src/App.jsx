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
  const [initialTime, setInitialTime] = useState(60);
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
    setRestTime,
    setWorkTime,
  } = useTimer("countdown", initialTime, workTimeInput, restTimeInput);

  const formatTime = (timeInSeconds, mode) => {
    if (mode === "stopwatch") {
      const minutes = Math.floor((timeInSeconds % 3600) / 60);
      const seconds = timeInSeconds % 60;
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    } else {
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds % 60;
      return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
  };
  const getCircleStyle = (time, initialTime) => {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    let offset;

    if (mode === "countdown" && initialTime > 0) {
      offset = circumference - (time / initialTime) * circumference;
    } else if (mode === "interval") {
      const currentInitialTime =
        intervalPhase === "work" ? workTimeInput : restTimeInput;
      offset = circumference - (time / currentInitialTime) * circumference;
    } else {
      offset = circumference;
    }

    return {
      strokeDasharray: `${circumference} ${circumference}`,
      strokeDashoffset: offset,
    };
  };

  function handlerSetTime(e) {
    e.preventDefault();
    if (mode === "countdown") {
      setInitialTime(Number(timeInput));
    } else if (mode === "interval") {
      setWorkTime(Number(workTimeInput));
      setRestTime(Number(restTimeInput));
    }
    resetTimer(); // Ensure timer resets to reflect the new initial time
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
        <form>
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
                  placeholder="Set Rest Time"
                  onChange={(e) => setRestTimeInput(Number(e.target.value))}
                />
              )}
              <button onClick={(e) => handlerSetTime(e)}>Submit</button>
            </>
          )}
        </form>
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

import { useEffect, useState, useRef } from "react";

const useTimer = (
  initialMode = "countdown",
  initialTime,
  workTimeInput,
  restTimeInput
) => {
  const [mode, setMode] = useState(initialMode);
  const [time, setTime] = useState(Number(initialTime));
  const [isCounting, setIsCounting] = useState(false);
  const [intervalPhase, setIntervalPhase] = useState("work");
  const [workTime, setWorkTime] = useState(workTimeInput);
  const [restTime, setRestTime] = useState(restTimeInput);

  const intervalRef = useRef(null);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(intervalRef.current);
  }, [mode, initialTime, workTimeInput, restTimeInput]);

  const startTimer = () => {
    if (intervalRef.current !== null) return;

    setIsCounting(true);
    if (mode !== "stopwatch") {
      intervalRef.current = setInterval(updateTime, 1000);
    } else {
      intervalRef.current = setInterval(updateTime, 100);
    }
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsCounting(false);
  };

  const resetTimer = () => {
    stopTimer();
    if (mode === "countdown") {
      setTime(Number(initialTime));
    } else if (mode === "interval") {
      setTime(workTimeInput);
      setIntervalPhase("work");
    } else {
      setTime(0);
    }
  };

  const updateTime = () => {
    setTime((prevTime) => {
      if (mode === "countdown") {
        return handleCountdown(prevTime);
      } else if (mode === "interval") {
        return handleInterval(prevTime);
      } else {
        return prevTime + 0.1; // Increment by 0.1 for milliseconds
      }
    });
  };

  const handleCountdown = (prevTime) => {
    if (prevTime <= 0) {
      stopTimer();
      setTime(Number(initialTime));
      return 0;
    }
    return prevTime - 1;
  };

  const handleInterval = (prevTime) => {
    if (prevTime <= 0) {
      if (intervalPhase === "work") {
        setIntervalPhase("rest");
        return restTime;
      } else {
        setIntervalPhase("work");
        return workTime;
      }
    }
    return prevTime - 1;
  };

  return {
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
  };
};

export default useTimer;

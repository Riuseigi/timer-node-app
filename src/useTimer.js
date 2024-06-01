import { useEffect, useState, useRef } from "react";

/**
 * Custom React hook for creating a timer with countdown, stopwatch, and interval modes.
 *
 * @param {string} initialMode - The initial mode of the timer ("countdown", "stopwatch", "interval").
 * @param {number} initialTime - The initial time value for the timer.
 * @param {number} workTimeInput - The work interval time for the interval mode.
 * @param {number} restTimeInput - The rest interval time for the interval mode.
 * @returns {object} An object containing the timer state and control functions.
 */
const useTimer = (
  initialMode = "countdown",
  initialTime,
  workTimeInput,
  restTimeInput
) => {
  // State variables
  const [mode, setMode] = useState(initialMode); // Timer mode
  const [time, setTime] = useState(Number(initialTime)); // Current timer value
  const [isCounting, setIsCounting] = useState(false); // Timer running status
  const [intervalPhase, setIntervalPhase] = useState("work"); // Current phase of interval mode
  const [workTime, setWorkTime] = useState(workTimeInput); // Work interval time
  const [restTime, setRestTime] = useState(restTimeInput); // Rest interval time

  // Ref to store interval ID
  const intervalRef = useRef(null);

  // Effect to reset timer when mode or initial time changes
  useEffect(() => {
    resetTimer();
    return () => clearInterval(intervalRef.current); // Cleanup interval on unmount
  }, [mode, initialTime]);

  // Effect to switch interval phase when time reaches below zero in interval mode
  useEffect(() => {
    if (mode === "interval" && time < 0) {
      switchIntervalPhase();
    }
  }, [time, intervalPhase, mode, restTime, workTime]);

  /**
   * Starts the timer.
   */
  const startTimer = () => {
    if (intervalRef.current !== null) return; // Prevent multiple intervals

    setIsCounting(true);
    intervalRef.current = setInterval(
      updateTime,
      mode === "stopwatch" ? 100 : 1000 // Update interval based on mode
    );
  };

  /**
   * Stops the timer.
   */
  const stopTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsCounting(false);
  };

  /**
   * Resets the timer based on the current mode.
   */
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

  /**
   * Updates the timer value.
   */
  const updateTime = () => {
    setTime((prevTime) => {
      if (mode === "countdown") {
        return handleCountdown(prevTime);
      } else if (mode === "interval") {
        return handleInterval(prevTime);
      } else {
        return prevTime + 0.1; // Increment by 0.1 for stopwatch mode (milliseconds)
      }
    });
  };

  /**
   * Handles countdown mode.
   *
   * @param {number} prevTime - The previous timer value.
   * @returns {number} - The updated timer value.
   */
  const handleCountdown = (prevTime) => {
    if (prevTime <= 0) {
      stopTimer();
      setTime(Number(initialTime));
      return 0;
    }
    return prevTime - 1;
  };

  /**
   * Handles interval mode.
   *
   * @param {number} prevTime - The previous timer value.
   * @returns {number} - The updated timer value.
   */
  const handleInterval = (prevTime) => {
    if (prevTime <= 0) {
      return prevTime - 1; // Allows reaching zero
    }
    return prevTime - 1;
  };

  /**
   * Switches the interval phase between work and rest.
   */
  const switchIntervalPhase = () => {
    if (intervalPhase === "work") {
      setIntervalPhase("rest");
      setTime(restTime);
    } else {
      setIntervalPhase("work");
      setTime(workTime);
    }
  };

  // Return the timer state and control functions
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

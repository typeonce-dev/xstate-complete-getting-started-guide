import { useEffect, useRef, useState } from "react";

export default function Page() {
  const interval = useRef<number | null>(null);
  const [time, setTime] = useState(10);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  useEffect(() => {
    if (interval.current !== null) {
      clearInterval(interval.current);
    }

    interval.current = setInterval(() => {
      setTime((t) => t - 1);
    }, 1000);
  }, []);

  useEffect(() => {
    if (time <= 0) {
      if (interval.current !== null) {
        clearInterval(interval.current);
      }

      if (isPaused) {
        setIsPaused(false);
      }

      setIsCompleted(true);
    }
  }, [time]);

  const onPause = () => {
    if (interval.current !== null && !isPaused && !isCompleted) {
      clearInterval(interval.current);
      setIsPaused(true);
    }
  };

  const onRestart = () => {
    setIsPaused(false);
    interval.current = setInterval(() => {
      setTime((t) => t - 1);
    }, 1000);
  };

  return (
    <div>
      <p>Time left: {time} seconds</p>
      {isCompleted ? (
        <></>
      ) : isPaused ? (
        <button onClick={onRestart}>Restart</button>
      ) : (
        <button onClick={onPause}>Pause</button>
      )}
      {isPaused && !isCompleted && <p>Paused</p>}
      {isCompleted && <p>Done!</p>}
    </div>
  );
}

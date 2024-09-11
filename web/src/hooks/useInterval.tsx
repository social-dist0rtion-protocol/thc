import { useEffect, useState } from "react";

export function useInterval(isOn: boolean, interval: number) {
  const [rounds, setRounds] = useState(0);
  const [intervalId, setIntervalId] = useState<number>();

  useEffect(() => {
    if (isOn) {
      const intervalTimer = setInterval(() => {
        setRounds(rounds + 1);
      }, interval);

      setIntervalId(intervalTimer as unknown as number);
      return () => clearInterval(intervalId);
    } else {
      if (intervalId) clearInterval(intervalId);
      setRounds(0);
    }
  }, [isOn]);

  return { rounds };
}

import { useEffect, useState } from "react";

export function useInterval(isOn: boolean, interval: number) {
  const [rounds, setRounds] = useState(0);

  useEffect(() => {
    if (isOn) {
      const intervalTimer = setTimeout(() => {
        setRounds(rounds + 1);
      }, interval);

      return () => clearInterval(intervalTimer as unknown as number);
    } else {
      setRounds(0);
    }
  }, [isOn, rounds]);

  return { rounds };
}

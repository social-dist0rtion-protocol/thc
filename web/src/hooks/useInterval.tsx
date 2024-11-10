import { useEffect, useState } from "react";

export function useInterval(isOn: boolean, interval: number) {
  const [rounds, setRounds] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (isOn) {
      if (rounds === undefined) {
        setRounds(0);
      }
      const intervalTimer = setTimeout(() => {
        setRounds(rounds! + 1);
      }, interval);

      return () => clearInterval(intervalTimer as unknown as number);
    } else {
      setRounds(undefined);
    }
  }, [isOn, rounds]);

  return { rounds };
}

import { useRef, useEffect, useState } from 'react';

type FlashDirection = 'up' | 'down' | null;

export function usePriceFlash(currentPrice: number | undefined) {
  const previousPrice = useRef<number | undefined>(currentPrice);
  const [flash, setFlash] = useState<FlashDirection>(null);

  useEffect(() => {
    if (currentPrice === undefined) return;

    if (previousPrice.current !== undefined && currentPrice !== previousPrice.current) {
      setFlash(currentPrice > previousPrice.current ? 'up' : 'down');

      const timeout = setTimeout(() => setFlash(null), 800);
      previousPrice.current = currentPrice;

      return () => clearTimeout(timeout);
    }

    previousPrice.current = currentPrice;
  }, [currentPrice]);

  return flash;
}

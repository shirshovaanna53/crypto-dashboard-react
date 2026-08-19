import { Text } from '@mantine/core';
import { usePriceFlash } from '../hooks/usePriceFlash';

interface FlashingPriceProps {
  price: number;
}

function FlashingPrice({ price }: FlashingPriceProps) {
  const flash = usePriceFlash(price);

  return (
    <Text
      fw={500}
      style={{
        transition: 'background-color 0.3s ease',
        backgroundColor:
          flash === 'up'
            ? 'rgba(34, 197, 94, 0.25)'
            : flash === 'down'
              ? 'rgba(239, 68, 68, 0.25)'
              : 'transparent',
        padding: '2px 6px',
        borderRadius: 4,
        display: 'inline-block',
      }}
    >
      ${price.toLocaleString()}
    </Text>
  );
}

export default FlashingPrice;

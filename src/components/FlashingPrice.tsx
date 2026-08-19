import { Text } from '@mantine/core';
import { usePriceFlash } from '../hooks/usePriceFlash';
import { FLASH_COLORS } from '../constants/theme';

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
          flash === 'up' ? FLASH_COLORS.up : flash === 'down' ? FLASH_COLORS.down : 'transparent',
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

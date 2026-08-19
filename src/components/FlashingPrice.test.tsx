import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import FlashingPrice from './FlashingPrice';
import { FLASH_COLORS } from '../constants/theme';

function renderWithProvider(price: number) {
  return render(
    <MantineProvider>
      <FlashingPrice price={price} />
    </MantineProvider>,
  );
}

describe('FlashingPrice', () => {
  it('renders the formatted price', () => {
    renderWithProvider(45000);

    expect(screen.getByText('$45,000')).toBeInTheDocument();
  });

  it('renders a different price correctly', () => {
    renderWithProvider(1234.56);

    expect(screen.getByText('$1,234.56')).toBeInTheDocument();
  });

  it('applies a green background when price increases', () => {
    const { rerender: rerenderComponent } = render(
      <MantineProvider>
        <FlashingPrice price={100} />
      </MantineProvider>,
    );

    rerenderComponent(
      <MantineProvider>
        <FlashingPrice price={105} />
      </MantineProvider>,
    );

    const priceElement = screen.getByText('$105');
    expect(priceElement).toHaveStyle({ backgroundColor: FLASH_COLORS.up });
  });

  it('applies a red background when price decreases', () => {
    const { rerender: rerenderComponent } = render(
      <MantineProvider>
        <FlashingPrice price={100} />
      </MantineProvider>,
    );

    rerenderComponent(
      <MantineProvider>
        <FlashingPrice price={95} />
      </MantineProvider>,
    );

    const priceElement = screen.getByText('$95');
    expect(priceElement).toHaveStyle({ backgroundColor: FLASH_COLORS.down });
  });
});

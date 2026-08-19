import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { Provider } from 'react-redux';
import { store } from '../store';
import CoinTable from './CoinTable';
import * as api from '../services/coinGeckoApi';
import { ERROR_MESSAGES } from '../constants/messages';

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <Provider store={store}>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        {ui}
      </MantineProvider>
    </Provider>,
  );
}

describe('CoinTable', () => {
  it('shows a loading state while data is being fetched', () => {
    vi.spyOn(api, 'useGetTopCoinsQuery').mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as unknown as ReturnType<typeof api.useGetTopCoinsQuery>);

    renderWithProviders(<CoinTable />);

    expect(document.querySelector('.mantine-Skeleton-root')).toBeInTheDocument();
  });

  it('renders coin data once loaded', () => {
    vi.spyOn(api, 'useGetTopCoinsQuery').mockReturnValue({
      data: [
        {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          image: 'https://example.com/btc.png',
          current_price: 50000,
          price_change_percentage_24h: 2.5,
          market_cap: 1000000000,
        },
      ],
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof api.useGetTopCoinsQuery>);

    renderWithProviders(<CoinTable />);

    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
  });

  it('shows an error banner when the request fails', () => {
    vi.spyOn(api, 'useGetTopCoinsQuery').mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as unknown as ReturnType<typeof api.useGetTopCoinsQuery>);

    renderWithProviders(<CoinTable />);

    expect(screen.getByText(ERROR_MESSAGES.loadingCoins)).toBeInTheDocument();
  });
});

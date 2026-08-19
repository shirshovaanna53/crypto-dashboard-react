import { Modal, Loader, Text, Center } from '@mantine/core';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useGetCoinPriceHistoryQuery } from '../services/coinGeckoApi';

interface CoinPriceModalProps {
  coinId: string | null;
  coinName: string;
  onClose: () => void;
}

function CoinPriceModal({ coinId, coinName, onClose }: CoinPriceModalProps) {
  const { data, isLoading, isError } = useGetCoinPriceHistoryQuery(coinId ?? '', {
    skip: !coinId, // не делаем запрос, если модалка закрыта
  });

  const chartData = data?.prices.map(([timestamp, price]) => ({
    date: new Date(timestamp).toLocaleDateString('en-AU', { day: '2-digit', month: 'short' }),
    price,
  }));

  return (
    <Modal opened={coinId !== null} onClose={onClose} title={`${coinName} — Last 7 Days`} size="lg">
      {isLoading && (
        <Center h={300}>
          <Loader />
        </Center>
      )}

      {isError && (
        <Center h={300}>
          <Text c="red">Failed to load price history.</Text>
        </Center>
      )}

      {chartData && (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => (typeof value === 'number' ? `$${value.toLocaleString()}` : '')} />
            <Line type="monotone" dataKey="price" stroke="#2f9e44" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Modal>
  );
}

export default CoinPriceModal;